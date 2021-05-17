import * as React from 'react'
import { createContext, useReducer, useContext } from 'react'
import { act } from 'react-test-renderer'
import { PodCast } from '../views/home/Model'
import { Audio } from "expo-av";
import { DownloadStatus, initialDownloadStatus } from '../services/download/DownloadModel';
import * as FileSystem from "expo-file-system";

interface AppContextStatus {
    showPlayer: boolean,
    setShowPlayer: (showPlayer: boolean) => void,
    podcast: PodCast,
    setPodcast: (podcast: PodCast) => void,
    playTrackNo: number | null,
    setPlayTrackNo: (playTrackNo: number) => void,
    cachedPaths: string[],
    setCachedPaths: (cachedPaths: string[]) => void,
    setCachedPath: (cachedPath: string, trackNO: number) => void
    mediaInstance: Audio.Sound
    setMediaInstance: (mediaInstance: Audio.Sound) => void

    downloadStatus: DownloadStatus,
    setDownloadStatus: (downloadStatus: DownloadStatus) => void
}



const initialAppContext: AppContextStatus = {
    showPlayer: false,
    setShowPlayer: () => false,
    podcast: null,
    setPodcast: () => null,
    playTrackNo: null,
    setPlayTrackNo: () => null,
    cachedPaths: [],
    setCachedPaths: () => [],
    setCachedPath: () => [],
    mediaInstance:null,
    setMediaInstance: () => null,
    downloadStatus: initialDownloadStatus,
    setDownloadStatus: () => initialDownloadStatus
}
const AppContext = createContext(initialAppContext)

enum AppContextActionType {
    setShowPlayer, setPodcast, setPlayTrackNo, setCachedPaths, setCachedPath, setSound, setDownloadStatus
}

type AppContextActions =
    | { type: AppContextActionType.setShowPlayer; isPlayShow: boolean }
    | { type: AppContextActionType.setPodcast; podcast: PodCast }
    | { type: AppContextActionType.setPlayTrackNo; trackNo: number }
    | { type: AppContextActionType.setCachedPaths; paths: string[] }
    | { type: AppContextActionType.setCachedPath; cashedInfo: { path: string, index: number } }
    | { type: AppContextActionType.setSound; mediaInstance: Audio.Sound }
    | { type: AppContextActionType.setDownloadStatus; downloadStatus: DownloadStatus }

const AppContextReducer = (state: AppContextStatus, action: AppContextActions) => {
    switch (action.type) {
        case AppContextActionType.setShowPlayer:
            return { ...state, showPlayer: action.isPlayShow ?? false }
            break;
        case AppContextActionType.setPodcast:
            return { ...state, podcast: action.podcast }
        case AppContextActionType.setPlayTrackNo:
            return { ...state, playTrackNo: action.trackNo }
        case AppContextActionType.setCachedPath:
            var tempCachedPaths = state.cachedPaths;
            tempCachedPaths[action.cashedInfo.index] = action.cashedInfo.path
            return { ...state, cachedPaths: tempCachedPaths }
        case AppContextActionType.setCachedPaths:
            return { ...state, cachedPaths: action.paths }
        case AppContextActionType.setSound:
            return { ...state, mediaInstance: action.mediaInstance }
        case AppContextActionType.setDownloadStatus:
            return { ...state, downloadStatus: action.downloadStatus }
        default:
            break;
    }
}

const searchFile = async (uid: string) => {
    const gifDir = FileSystem.cacheDirectory + "adyen/";
    const dirInfo = await FileSystem.getInfoAsync(gifDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
    }
    const fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + uid + ".mp3"
    );
    return fileInfo.exists
}
export const AppContextProvider: React.FC = ({ children }) => {
    const [appState, dispatch] = useReducer(AppContextReducer, initialAppContext);
    const dispatchShowPlayer = (showPlayer: boolean) => {
        dispatch({ type: AppContextActionType.setShowPlayer, isPlayShow: showPlayer });
    }

    const dispatchSetPodcast = async (podcast: PodCast) => {
        const promise = podcast.episodes.map(async (item, index) => {
            item.isDownloaded = await searchFile(item.uid);
            if (item.isDownloaded) {
                item.cachedUrl = FileSystem.documentDirectory + item.uid + ".mp3"
            }
            podcast.episodes[index] = item
        })
        await Promise.race(promise)
        dispatch({ type: AppContextActionType.setPodcast, podcast: podcast });
    }



    const dispatchSetPlayEpisodeNo = (trackNo: number) => {
        dispatch({ type: AppContextActionType.setPlayTrackNo, trackNo: trackNo });
    }

    const dispatchSetCachedPaths = (paths: string[]) => {
        dispatch({ type: AppContextActionType.setCachedPaths, paths: paths });
    }

    const dispatchSetCachedPath = (path: string, index: number) => {
        dispatch({ type: AppContextActionType.setCachedPath, cashedInfo: { path: path, index: index } });
    }

    const dispatchSetMediaInstance = (sound: Audio.Sound) => {
        dispatch({ type: AppContextActionType.setSound, mediaInstance: sound });
    }

    const dispatchSetDownloadStatus = (downloadStatus: DownloadStatus) => {
        //dispatch({ type: AppContextActionType.setDownloadStatus, downloadStatus: downloadStatus });
    }


    return (
        <AppContext.Provider
            value={{
                showPlayer: appState.showPlayer,
                setShowPlayer: dispatchShowPlayer,
                podcast: appState.podcast,
                setPodcast: dispatchSetPodcast,
                playTrackNo: appState.playTrackNo,
                setPlayTrackNo: dispatchSetPlayEpisodeNo,
                cachedPaths: appState.cachedPaths,
                setCachedPaths: dispatchSetCachedPaths,
                setCachedPath: dispatchSetCachedPath,
                mediaInstance: appState.mediaInstance,
                setMediaInstance: dispatchSetMediaInstance,
                downloadStatus: appState.downloadStatus,
                setDownloadStatus: dispatchSetDownloadStatus
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useAppContextStore = () => useContext(AppContext);