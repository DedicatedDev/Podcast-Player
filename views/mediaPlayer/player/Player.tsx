import * as React from 'react'
import { 
    View, 
    TouchableOpacity, 
    Modal, 
    Image, 
    TouchableHighlight, 
    Text, 
    Dimensions, 

    StyleSheet} from 'react-native'

import Slider from '@react-native-community/slider'
import Icon from 'react-native-dynamic-vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppContextStore } from '../../../context/AppContext';
import { PlayDisplayMode, PlayState, usePlayerContextStore } from '../MediaPlayerContext';
import { decode } from "html-entities";
const ICON_SIZE = 40;
const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#000000";
const FONT_SIZE = 14;

const Player = () => {
    
    const{
      podcast,
      playTrackNo,
      mediaInstance,
      setPlayTrackNo,
      
    } = useAppContextStore()
    const {
        playState,
        playTime,
        totalTime,
        volume,
        setPlayState,
        setPlayerDisplayMode,
    } = usePlayerContextStore()

    const _onSeekSliderValueChange = async(value:number) => {
       await mediaInstance?.pauseAsync()
       try {
           await mediaInstance?.setPositionAsync(value * totalTime)
       } catch (error) {
          console.log(error)
       }
       
       await mediaInstance?.playAsync()
    }

    const _onSeekSkip = async (deltaTime:number,direction:boolean) => {
        await  mediaInstance?.pauseAsync()
        try {
            direction ? await mediaInstance?.setPositionAsync(playTime + deltaTime) :
                await mediaInstance?.setPositionAsync(playTime - deltaTime)
        } catch (error) {
            console.log(error)
        }
        
        await mediaInstance.playAsync()
    }

    const handlePlayButton = async () => {
        switch (playState) {
            case PlayState.play:
                await mediaInstance?.pauseAsync()
                setPlayState(PlayState.stop)
                break;
            case PlayState.stop:
                await mediaInstance?.playAsync()
                setPlayState(PlayState.play)
                break;
            default:
                break;
        }
    }
    

    return (
        <Modal animationType="slide">
            <View style={[styles.container, styles.modalContainer]}>
                <TouchableOpacity
                    style={styles.closeButton}
                  onPress={() => {
                      return setPlayerDisplayMode(PlayDisplayMode.mini)
                  }}
                >
                    <Icon
                        name="keyboard-arrow-down"
                        size={ICON_SIZE}
                        color="#ffffff"
                        type={"MaterialIcons"}
                    />
                </TouchableOpacity>
                <View style={styles.portraitContainer}>
                    <Image
                        style={styles.portrait}
                        source={{
                            uri: podcast?.episodes[playTrackNo].artwork,
                        }}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={[styles.textTitle]}>{
                        podcast?.episodes[playTrackNo].title
                    }</Text>
                    <Text style={[styles.text]}>
                        {`${playTime.getMediaPlayTimeStamp()}/${totalTime.getMediaPlayTimeStamp()}`}
                    </Text>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerTopRow,
                    ]}
                >
                    <TouchableOpacity
                        style={styles.controlButton}
                         onPress={() => {
                             if(playTrackNo-1>=0){
                                 setPlayTrackNo(playTrackNo-1)
                             }
                         }}
                        disabled={false}
                    >
                        <Icon
                            name="fast-rewind"
                            size={40}
                            type={'MaterialIcons'}
                            color={Colors.white}
                        />
                    </TouchableOpacity>
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.controlButton}
                        onPress={()=>{
                            return _onSeekSkip(1500,false)
                        }}
                        disabled={false}
                    >
                        <View>
                            <Icon
                                name="reload1"
                                type="AntDesign"
                                size={24}
                                color={Colors.white}
                                style={{ transform: [{ rotateY: "180deg" }] }}
                            />
                            <Text style={styles.controlButtonText}>15sec</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.controlButton}
                        onPress={() => handlePlayButton()}
                        disabled={false}
                    >
                        <View>
                            {playState == PlayState.play ? (
                                <Icon
                                    name="pause"
                                    size={40}
                                    type={'MaterialIcons'}
                                    color={Colors.white}
                                />
                            ) : (
                                <Icon
                                    name="play-arrow"
                                    size={40}
                                    type={'MaterialIcons'}
                                    color={Colors.white}
                                />
                            )}
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={BACKGROUND_COLOR}
                        style={styles.controlButton}
                        onPress={()=>{
                            return _onSeekSkip(1500, true)
                        }}
                        disabled={false}
                    >
                        <View>
                            <Icon name="reload1" type={'AntDesign'} size={24} color={Colors.white} />
                            <Text style={styles.controlButtonText}>15sec</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableOpacity
                        //underlayColor={BACKGROUND_COLOR}
                        style={styles.controlButton}
                        onPress={() => {
                            if(playTrackNo+1 < podcast?.episodes.length){
                                setPlayTrackNo(playTrackNo+1)
                            }
                        }}
                        disabled={false}
                    >
                        <Icon
                            name="fast-forward"
                            type={'MaterialIcons'}
                            size={40}
                            color={Colors.white}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.playbackContainer]}>
                    <Slider
                        style={styles.playbackSlider}
                        value={playTime/totalTime}
                        onValueChange={_onSeekSliderValueChange}
                        //onSlidingComplete={_onSeekSliderSlidingComplete}
                        thumbTintColor="#ffffff"
                        maximumTrackTintColor="#ffffff"
                        disabled={false}
                    />
                </View>
                <View>
                    <Text style={styles.textShowNotes}>{
                        decode(podcast?.episodes[playTrackNo].description)
                    }</Text>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerMiddleRow,
                    ]}
                >
                    <View style={styles.volumeContainer}>
                        <View>
                            <Icon type={'MaterialIcons'} name="volume-down" size={30} color="#ffffff" />
                        </View>
                        <Slider
                            style={styles.volumeSlider}
                            value={volume}
                            onValueChange={(value) =>
                                mediaInstance?.setVolumeAsync(value)
                            }
                            thumbTintColor="#ffffff"
                            minimumTrackTintColor="#cccccc"
                        />
                        <View>
                            <Icon type={'MaterialIcons'} name="volume-up" size={30} color="#ffffff" />
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        styles.buttonsContainerBase,
                        styles.buttonsContainerBottomRow,
                    ]}
                >
                    <View>
                        <TouchableOpacity
                        //debounce={500}
                        // onPress={() =>
                        //     playbackInstance?.setRateAsync(rate >= 2 ? 1 : rate + 0.5)
                        // }
                        >
                            <Text style={[styles.textPlayRate]}>{"rate"} x</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export {Player}

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
    textShowNotes: {
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
    textTitle: {
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