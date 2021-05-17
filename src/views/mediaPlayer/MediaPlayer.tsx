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
import { useAppContextStore } from '../../context/AppContext';
import { useDownloadService } from '../../services/download/DownloadService';
import { Audio, AVPlaybackStatusToSet } from "expo-av";
import { AVPlaybackSource, AVPlaybackStatus } from 'expo-av/build/AV';
import { Sound } from 'expo-av/build/Audio';
import { DownloadProgress } from '../../services/download/DownloadModel';
import '../../utils/extensions/extension+Number';
import { Player } from './player/Player';
import { MiniPlayer } from './miniPlayer/MiniPlayer';
import { onChange } from 'react-native-reanimated';
import { PlayDisplayMode, PlayerContextProvider, PlayState, usePlayerContextStore } from './MediaPlayerContext';
const ICON_SIZE = 40;
const { width: DEVICE_WIDTH } = Dimensions.get("window");
const BACKGROUND_COLOR = "#000000";
const FONT_SIZE = 14;



const MediaPlayer = () => {

    const { podcast, showPlayer, playTrackNo, mediaInstance, setMediaInstance, setDownloadStatus } = useAppContextStore();
    const {
        displayMode,
        totalTime,
        playState,
        setVisible,
        setCachedPath,
        setPlayState,
        setPlayTime,
        setTotalTime,
    } = usePlayerContextStore()

    const { downloadStatus } = useDownloadService()

    const _setNewMediaInstance = async (uri: string) => {
        try {
            await mediaInstance?.unloadAsync()
        } catch (error) {
            console.log(error)
        }
        
        const initialStatus: AVPlaybackStatusToSet = {
            shouldPlay: true,
            rate: 1.0,
            androidImplementation: "MediaPlayer",
            volume: 0.5,
        };
        const source: AVPlaybackSource = {
            uri: uri
        }
        try {
            const { sound } = await Audio.Sound.createAsync(
                source,
                initialStatus,
                _onPlaybackStatusUpdate
            )
            setMediaInstance(sound)
        } catch (error) {
            console.log(error)
        }
    }

    const _onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.isPlaying) {
            if (totalTime != status.durationMillis) {
                setTotalTime(status.durationMillis)
            }
            setPlayTime(status.positionMillis)
        }
    }

    useEffect(() => {
        const selectNewTrack = async() => {
            setPlayState(PlayState.loading)
            try {
                await mediaInstance?.unloadAsync()
            } catch (error) {
                console.log(error)
            }
            
            const cachedPath = podcast?.episodes[playTrackNo].cachedUrl;
            if (cachedPath != null) {
                console.log(cachedPath)
                setPlayState(PlayState.play)
                await _setNewMediaInstance(cachedPath)
            }
        }
        selectNewTrack()
    }, [playTrackNo])

    useEffect( () => {
        const downloaded = async() => {
            if (downloadStatus.progressStatus == DownloadProgress.downloaded && playTrackNo == downloadStatus.trackNo && playState != PlayState.play) {
                const cachedPath = downloadStatus.cachedPath;
                await mediaInstance?.unloadAsync()
                setCachedPath(cachedPath)
                setPlayState(PlayState.play)
                await _setNewMediaInstance(cachedPath)
            }
        }
        downloaded()
    }, [downloadStatus.progressStatus])

    useEffect(() => {
         setVisible(showPlayer)
    }, [showPlayer])

    const playerRender = () => {
        if(showPlayer){
            switch (displayMode) {
                case PlayDisplayMode.mini:
                    return <MiniPlayer />
                    break;
                default:
                    return <Player />
                    break;
            }
        }else{
            return <View></View>;
        }
    }
    
    return playerRender()
}

export { MediaPlayer };

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




