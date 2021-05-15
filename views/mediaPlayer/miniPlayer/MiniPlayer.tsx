import * as React from 'react'
import { useEffect, useReducer, useMemo} from 'react';
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
//import Icon from 'react-native-vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppContextStore } from '../../../context/AppContext';
import { PlayDisplayMode, PlayerModel, PlaySpeed, UserActionsToPlayer, UserActionTypeToPlayer } from './PlayerModel'

const ICON_SIZE = 40;
const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#000000";
const FONT_SIZE = 14;

const MiniPlayer = () => {
    //reducer 
    const ManagePlayer = (state: PlayerModel, action: UserActionsToPlayer) => {
        switch (action.type) {
            case UserActionTypeToPlayer.tappedExpandBtn:
                return { ...state, displayStyle: action.displayMode === PlayDisplayMode.mini ? PlayDisplayMode.full : PlayDisplayMode.mini }
            case UserActionTypeToPlayer.changedVisible:
                return { ...state, isHidden: state.isHidden = !showPlayer }
            case UserActionTypeToPlayer.tappedPlayBtn:
                return { ...state, isPlaying: state.isPlaying = !action.isPlaying }
            case UserActionTypeToPlayer.loadedNewTrack:
                return { ...state, selectedTrack:action.trackNo}
            default:
                break;
        }
    }

    //define state 
    const { podcast} = useAppContextStore();
    const { showPlayer, playTrackNo } = useAppContextStore();

    console.log(podcast)
    const initState: PlayerModel = {
        displayStyle: PlayDisplayMode.mini,
        isHidden: showPlayer,
        isPlaying: false,
        cachedPath: [],
        playlist: podcast&&podcast.episodes,
        playSpeed: PlaySpeed.normal,
        playTime: 0.0,
        selectedTrack: 0,
    };


    const [state, dispatch] = useReducer(ManagePlayer, initState);

    //visible/hidden manage
    useMemo(() => {
        dispatch({ type: UserActionTypeToPlayer.changedVisible, isHidden: showPlayer })
        return () => {
            state.isHidden = true
        }
    }, [showPlayer])

    useMemo(() => {
        dispatch({ type: UserActionTypeToPlayer.loadedNewTrack, trackNo: playTrackNo})
        return () => {
            state.isHidden = true
        }
    }, [playTrackNo])

    return (
        <View style={[styles.playerContainer, { display: state.isHidden ? 'none' : 'flex' }]}>
            <View style={styles.miniPlayerContainer}>
                <TouchableOpacity style={styles.expandButton}
                    onPress={() => dispatch({ type: UserActionTypeToPlayer.tappedExpandBtn, displayMode: state.displayStyle })}
                >
                    <Icon
                        name={state.displayStyle ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                        size={ICON_SIZE}
                        type={'MaterialIcons'}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{state.cachedPath == null ? "loading..." : "00:00/05:23"}</Text>
                </View>
                <TouchableOpacity
                    style={styles.playPauseButton}

                    disabled={false}
                >
                    <Icon
                        name={state.isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                        size={ICON_SIZE}
                        color={Colors.white}
                        type={'MaterialIcons'}
                        onPress={() => dispatch({ type: UserActionTypeToPlayer.tappedPlayBtn, isPlaying: state.isPlaying })}
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