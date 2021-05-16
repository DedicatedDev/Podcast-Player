import * as React from 'react'
import { useEffect, useReducer, useMemo, useCallback } from 'react';
import {
    View,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    Modal,
    Image,
    StyleSheet,
    Dimensions,
    Slider
} from 'react-native'
import Icon from "react-native-dynamic-vector-icons";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppContextStore } from '../../../context/AppContext';
import { useDownloadService } from '../../../services/download/DownloadService';
import { PlayDisplayMode, PlayerModel, PlaySpeed, PlayerActions, PlayerActionType, PlayState } from './PlayerModel'
import { Audio, AVPlaybackStatusToSet } from "expo-av";
import { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV';
import { Sound } from 'expo-av/build/Audio';
import { DownloadProgress } from '../../../services/download/DownloadModel';
import '../../../utils/extensions/extension+Number';
const ICON_SIZE = 40;
const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#000000";
const FONT_SIZE = 14;



const MiniPlayer = () => {

    //reducer 
    const ManagePlayer = (state: PlayerModel, action: PlayerActions) => {
        switch (action.type) {
            case PlayerActionType.tappedExpandBtn:
                return { ...state, displayStyle: action.displayMode === PlayDisplayMode.mini ? PlayDisplayMode.full : PlayDisplayMode.mini }
            case PlayerActionType.changedVisible:
                return { ...state, isHidden: state.isHidden = !showPlayer }
            case PlayerActionType.tappedPlayBtn:
                console.log("this is working?")
                console.log(action.playStatus)
                return { ...state, playState: action.playStatus }
            case PlayerActionType.loadNewItem:
                return { ...state, playState: PlayState.loading }
            case PlayerActionType.setPlayTime:
                return { ...state, playTime: action.playTime }
            case PlayerActionType.setTotalTime:
                return { ...state, totalTime: action.totalTime }
            case PlayerActionType.setCachedPath:
                return { ...state, cachedPath: action.cachedPath }
            default:
                break;
        }
    }

    //define state 
    const { podcast, showPlayer, playTrackNo, mediaInstance, setMediaInstance, setDownloadStatus } = useAppContextStore();
    const initState: PlayerModel = {
        displayStyle: PlayDisplayMode.mini,
        isHidden: showPlayer,
        playState: PlayState.loading,
        cachedPath: null,
        playlist: podcast && podcast.episodes,
        playSpeed: PlaySpeed.normal,
        playTime: 0.0,
        totalTime: 0.0,
    };


    const _setNewMediaInstance = async (uri: string) => {
        await mediaInstance?.unloadAsync()
        const initialStatus: AVPlaybackStatusToSet = {
            shouldPlay: true,
            rate: 1.0,
            androidImplementation: "MediaPlayer",
            volume: 0.5,
        };
        const source: AVPlaybackSource = {
            uri: uri
        }
        const { sound } = await Audio.Sound.createAsync(
            source,
            initialStatus,
            _onPlaybackStatusUpdate
        )
        setMediaInstance(sound)
    }

    const _onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.isPlaying) {
            if (state.totalTime != status.durationMillis) {
                dispatch({ type: PlayerActionType.setTotalTime, totalTime: status.durationMillis })
            }
            dispatch({ type: PlayerActionType.setPlayTime, playTime: status.positionMillis })
        } 
    }

    const [state, dispatch] = useReducer(ManagePlayer, initState);
    const { downloadStatus } = useDownloadService()

    // useMemo(async() => {
    //     console.log(state.playState)
    //     switch (state.playState) {
    //         case PlayState.loading:
    //             console.log("loading")
    //            await mediaInstance?.unloadAsync()
    //             break;
    //         case PlayState.play:
    //             await mediaInstance?.playAsync()
    //             break;
    //         case PlayState.stop:
    //             await mediaInstance?.stopAsync()
    //             break;
    //         default:
    //             break;
    //     }
    // }, [state.playState])

    useEffect(() => {
        dispatch({ type: PlayerActionType.loadNewItem });
        const cachedPath = podcast?.episodes[playTrackNo].cachedUrl;
        mediaInstance?.unloadAsync()
        if (cachedPath != null) {
            _setNewMediaInstance(cachedPath)
            console.log(state.playState)
            dispatch({ type: PlayerActionType.tappedPlayBtn, playStatus: PlayState.play });
        }
    }, [playTrackNo])

    useMemo(async () => {
        if (downloadStatus.progressStatus == DownloadProgress.downloaded && playTrackNo == downloadStatus.trackNo) {
            const cachedPath = downloadStatus.cachedPath;
            await _setNewMediaInstance(cachedPath)
            dispatch({ type: PlayerActionType.setCachedPath, cachedPath: cachedPath });
            dispatch({ type: PlayerActionType.tappedPlayBtn, playStatus: PlayState.play });
        }
    }, [downloadStatus.progressStatus])

    useMemo(() => {
        dispatch({ type: PlayerActionType.changedVisible, isHidden: showPlayer })
        return () => {
            state.isHidden = true
        }
    }, [showPlayer])

     const renderPlayStatus = () => {
   
        switch (state.playState) {
            case PlayState.loading:
                return 'Loading...'
                break;
            case PlayState.stop:
                return `${state.playTime?.getMediaPlayTimeStamp()}/${state.totalTime?.getMediaPlayTimeStamp()}`
                break;
            case PlayState.play:
                return `${state.playTime?.getMediaPlayTimeStamp()}/${state.totalTime?.getMediaPlayTimeStamp()}`
                break;
            default:
                return "Buffering"
                break;
        }
     }

    const handlePlayButton = async() => {
        switch (state.playState) {
            case PlayState.play:
                await mediaInstance?.pauseAsync()
                dispatch({ type: PlayerActionType.tappedPlayBtn, playStatus: PlayState.stop })
                break;
            case PlayState.stop:
                 await mediaInstance?.playAsync()
                 dispatch({ type: PlayerActionType.tappedPlayBtn, playStatus: PlayState.play })
                 break;
            default:
                break;
        }
    }

    return (
        <View style={[styles.playerContainer, { display: state.isHidden ? 'none' : 'flex' }]}>
            <View style={styles.miniPlayerContainer}>
                <TouchableOpacity style={styles.expandButton}
                    onPress={() => dispatch({ type: PlayerActionType.tappedExpandBtn, displayMode: state.displayStyle })}
                >
                    <Icon
                        name={state.displayStyle == PlayDisplayMode.full ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                        size={ICON_SIZE}
                        type={'MaterialIcons'}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{renderPlayStatus()}</Text>
                </View>
                <TouchableOpacity
                    style={styles.playPauseButton}
                    disabled={false}
                    
                >
                    <Icon
                        name={state.playState == PlayState.play ? "pause-circle-outline" : "play-circle-outline"}
                        size={ICON_SIZE}
                        color={Colors.white}
                        type={'MaterialIcons'}
                        onPress={() => handlePlayButton()}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export { MiniPlayer };

const styles = StyleSheet.create({
    playerContainer: {
        flexDirection: "row",
        width: "100%",
        height: 100,
        display: 'none'
    },
    closeButton: {
        position: "absolute",
        left: 10,
        top: 40,
        zIndex: 20,
    },
    modalContainer: {
        paddingTop: 40,
    },
    expandButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    titleContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 16,
        color: "#ffffff",
    },
    miniPlayerContainer: {
        backgroundColor: "#757575",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    playPauseButton: {},
    slidingContainer: {
        borderColor: "red",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: BACKGROUND_COLOR,
    },
    portraitContainer: {
        marginTop: 20,
    },
    portrait: {
        height: 200,
        width: 200,
    },
    detailsContainer: {
        height: 40,
        marginTop: 40,
        alignItems: "center",
    },
    playbackContainer: {
        marginTop: 10,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
    },
    playbackSlider: {
        alignSelf: "stretch",
        marginLeft: 40,
        marginRight: 40,
    },
    text: {
        fontSize: FONT_SIZE,
        color: "#ffffff",
    },
    controlButton: {
        marginLeft: 15,
        marginRight: 15,
    },
    controlButtonText: {
        color: "#ffffff",
        fontSize: 9,
        marginTop: 5,
    },
    textShownotes: {
        fontSize: FONT_SIZE,
        color: "#ffffff",
        textAlign: "center",
        minWidth: DEVICE_WIDTH / 1.2,
        maxWidth: DEVICE_WIDTH / 1.2,
        marginTop: -15,
        marginBottom: 45,
    },
    textPlayRate: {
        fontSize: 18,
        marginTop: 0,
        marginLeft: 10,
        fontWeight: "bold",
        color: "#ffffff",
    },
    textTitel: {
        fontSize: 20,
        marginTop: -25,
        color: "#ffffff",
        minHeight: FONT_SIZE,
        paddingHorizontal: 7,
        textAlign: "center",
    },
    buttonsContainerBase: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonsContainerTopRow: {
        maxHeight: 40,
    },
    buttonsContainerMiddleRow: {
        maxHeight: 40,
        alignSelf: "stretch",
    },
    volumeContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: DEVICE_WIDTH - 40,
        maxWidth: DEVICE_WIDTH - 40,
    },
    volumeSlider: {
        width: DEVICE_WIDTH - 80,
    },
    buttonsContainerBottomRow: {
        alignSelf: "stretch",
    },
    rateSlider: {
        width: DEVICE_WIDTH - 80,
    },
});




// {
//     true ? (
        // <View style={styles.miniPlayerContainer}>
        //     <TouchableOpacity style={styles.expandButton}
        //     // onPress={togglePlayer}
        //     >
        //         <Icon
        //             name={true ? "keyboard-arrow-down" : "keyboard-arrow-up"}
        //             size={ICON_SIZE}
        //             type={'AntDesign'}
        //             color="#ffffff"
        //         />
        //     </TouchableOpacity>
        //     <View style={styles.titleContainer}>
        //         <Text style={styles.title} numberOfLines={1}>
        //             Test podcast
        //                 </Text>
        //                 this is just title
        //             </View>
        //     <TouchableOpacity
        //         style={styles.playPauseButton}
        //         // onPress={() =>
        //         //     false
        //         //         ? playbackInstance?.pauseAsync()
        //         //         : playbackInstance?.playAsync()
        //         // }
        //         disabled={false}
        //     >
        //         <Icon
        //             name={true ? "pause-circle-outline" : "play-circle-outline"}
        //             size={ICON_SIZE}
        //             color={Colors.white}
        //             type={'FontAwesome'}
        //         />
        //     </TouchableOpacity>
        // </View>
//     ) : (
//         <Modal animationType="slide">
//             <View style={[styles.container, styles.modalContainer]}>
//                 <TouchableOpacity
//                     style={styles.closeButton}
//                 //onPress={() => setIsExpanded(false)}
//                 >
//                     <Icon
//                         name="keyboard-arrow-down"
//                         size={ICON_SIZE}
//                         color="#ffffff"
//                         type={"MaterialIcons"}
//                     />
//                 </TouchableOpacity>
//                 <View style={styles.portraitContainer}>
//                     <Image
//                         style={styles.portrait}
//                         source={{
//                             uri: "sdf",
//                         }}
//                     />
//                 </View>
//                 <View style={styles.detailsContainer}>
//                     <Text style={[styles.textTitel]}>{"sdf"}</Text>
//                     <Text style={[styles.text]}>
//                         {/* {isBuffering ? BUFFERING_STRING : _getTimestamp()} */}
//                     </Text>
//                 </View>
//                 <View
//                     style={[
//                         styles.buttonsContainerBase,
//                         styles.buttonsContainerTopRow,
//                     ]}
//                 >
//                     <TouchableOpacity
//                         style={styles.controlButton}
//                         // onPress={() => _advanceIndex(false)}
//                         disabled={false}
//                     >
//                         <Icon
//                             name="fast-rewind"
//                             size={40}
//                             type={'MaterialIcons'}
//                             color={Colors.white}
//                         />
//                     </TouchableOpacity>
//                     <TouchableHighlight
//                         underlayColor={BACKGROUND_COLOR}
//                         style={styles.controlButton}
//                         //onPress={_onSkipBackwards}
//                         disabled={false}
//                     >
//                         <View>
//                             <Icon
//                                 name="reload1"
//                                 type="AntDesign"
//                                 size={24}
//                                 color={Colors.white}
//                                 style={{ transform: [{ rotateY: "180deg" }] }}
//                             />
//                             <Text style={styles.controlButtonText}>15sec</Text>
//                         </View>
//                     </TouchableHighlight>

//                     <TouchableHighlight
//                         underlayColor={BACKGROUND_COLOR}
//                         style={styles.controlButton}
//                         // onPress={() =>
//                         //     isPlaying
//                         //         ? playbackInstance?.pauseAsync()
//                         //         : playbackInstance?.playAsync()
//                         // }
//                         disabled={false}
//                     >
//                         <View>
//                             {true ? (
//                                 <Icon
//                                     name="pause"
//                                     size={40}
//                                     type={'MaterialIcons'}
//                                     color={Colors.white}
//                                 />
//                             ) : (
//                                 <Icon
//                                     name="play-arrow"
//                                     size={40}
//                                     type={'MaterialIcons'}
//                                     color={Colors.white}
//                                 />
//                             )}
//                         </View>
//                     </TouchableHighlight>
//                     <TouchableHighlight
//                         underlayColor={BACKGROUND_COLOR}
//                         style={styles.controlButton}
//                         // onPress={_onSkipForwards}
//                         disabled={false}
//                     >
//                         <View>
//                             <Icon name="reload1" type={'AntDesign'} size={24} color={Colors.white} />
//                             <Text style={styles.controlButtonText}>15sec</Text>
//                         </View>
//                     </TouchableHighlight>
//                     <TouchableOpacity
//                         underlayColor={BACKGROUND_COLOR}
//                         style={styles.controlButton}
//                         //onPress={() => _advanceIndex(true)}
//                         disabled={false}
//                     >
//                         <Icon
//                             name="fast-forward"
//                             type={'MaterialIcons'}
//                             size={40}
//                             color={Colors.white}
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={[styles.playbackContainer]}>
//                     <Slider
//                         style={styles.playbackSlider}
//                         value={0.5}
//                         //onValueChange={_onSeekSliderValueChange}
//                         //onSlidingComplete={_onSeekSliderSlidingComplete}
//                         thumbTintColor="#ffffff"
//                         maximumTrackTintColor="#ffffff"
//                         disabled={false}
//                     />
//                 </View>
//                 <View>
//                     <Text style={styles.textShownotes}>{"this is show note"}</Text>
//                 </View>
//                 <View
//                     style={[
//                         styles.buttonsContainerBase,
//                         styles.buttonsContainerMiddleRow,
//                     ]}
//                 >
//                     <View style={styles.volumeContainer}>
//                         <View>
//                             <Icon type={'MaterialIcons'} name="volume-down" size={30} color="#ffffff" />
//                         </View>
//                         <Slider
//                             style={styles.volumeSlider}
//                             value={1}
//                             // onValueChange={(value) =>
//                             //     //playbackInstance?.setVolumeAsync(value)
//                             // }
//                             thumbTintColor="#ffffff"
//                             minimumTrackTintColor="#cccccc"
//                         />
//                         <View>
//                             <Icon type={'MaterialIcons'} name="volume-up" size={30} color="#ffffff" />
//                         </View>
//                     </View>
//                 </View>
//                 <View
//                     style={[
//                         styles.buttonsContainerBase,
//                         styles.buttonsContainerBottomRow,
//                     ]}
//                 >
//                     <View>
//                         <TouchableOpacity
//                             debounce={500}
//                         // onPress={() =>
//                         //     playbackInstance?.setRateAsync(rate >= 2 ? 1 : rate + 0.5)
//                         // }
//                         >
//                             <Text style={[styles.textPlayRate]}>{"rate"} x</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     )
// }