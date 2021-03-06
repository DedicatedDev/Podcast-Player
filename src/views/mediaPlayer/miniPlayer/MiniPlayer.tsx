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
    Slider,
    LogBox
} from 'react-native'
import Icon from "react-native-dynamic-vector-icons";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAppContextStore } from '../../../context/AppContext';
import { useDownloadService } from '../../../services/download/DownloadService';
import { Audio, AVPlaybackStatusToSet } from "expo-av";
import { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV';
import { Sound } from 'expo-av/build/Audio';
import { DownloadProgress } from '../../../services/download/DownloadModel';
import '../../../utils/extensions/extension+Number';
import { PlayDisplayMode, PlayState, usePlayerContextStore } from '../MediaPlayerContext';
import { ignoreMsg } from '../../../utils/const/const';
const ICON_SIZE = 40;
const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#000000";
const FONT_SIZE = 14;


const MiniPlayer = () => {
    const {
        playState,
        playTime,
        totalTime,
        setPlayerDisplayMode,
        setPlayState
    } = usePlayerContextStore()

    const {
        mediaInstance
    } = useAppContextStore()
   
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

    useEffect(() => {
        LogBox.ignoreLogs(ignoreMsg);
    }, [])


    const renderPlayStatus = () => {
        switch (playState) {
            case PlayState.loading:
                return 'Loading...'
                break;
            case PlayState.stop:
                return `${playTime?.getMediaPlayTimeStamp()}/${totalTime?.getMediaPlayTimeStamp()}`
                break;
            case PlayState.play:
                return `${playTime?.getMediaPlayTimeStamp()}/${totalTime?.getMediaPlayTimeStamp()}`
                break;
            default:
                return "Buffering"
                break;
        }
    }
    return (
        <View style={[styles.playerContainer]}>
            <View style={styles.miniPlayerContainer}>
                <TouchableOpacity style={styles.expandButton}
                    onPress={() => {
                        return setPlayerDisplayMode(PlayDisplayMode.full)
                    }}
                >
                    <Icon
                        name={"keyboard-arrow-up"}
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
                        name={playState == PlayState.play ? "pause-circle-outline" : "play-circle-outline"}
                        size={ICON_SIZE}
                        color={Colors.white}
                        type={'MaterialIcons'}
                        onPress={() => handlePlayButton()}
                    />
                </TouchableOpacity>
            </View>
        </View>)
}

export { MiniPlayer };

const styles = StyleSheet.create({
    playerContainer: {
        flexDirection: "row",
        width: "100%",
        height: 100,
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

