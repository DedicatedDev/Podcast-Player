import * as React from 'react'
import { createContext, useReducer, useContext } from 'react'
import { act } from 'react-test-renderer'
import { PodCast } from '../views/home/Model'
import { PlayerModel } from '../views/mediaPlayer/miniPlayer/PlayerModel'

interface AppContextStatus {
    showPlayer: boolean,
    setShowPlayer: (showPlayer: boolean) => void,
    podcast: PodCast,
    setPodcast: (podcast: PodCast) => void,
    playTrackNo: number,
    setPlayTrackNo: (playTrackNo: number) => void,
    cachedPaths: string[],
    setCachedPaths: (cachedPaths: string[]) => void,
    setCachedPath: (cachedPath: string, trackNO: number) => void
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
    setCachedPath: () => []
}
const AppContext = createContext(initialAppContext)

enum AppContextActionType {
    setShowPlayer, setPodcast, setPlayTrackNo, setCachedPaths, setCachedPath
}

type AppContextActions =
    | { type: AppContextActionType.setShowPlayer; isPlayShow: boolean }
    | { type: AppContextActionType.setPodcast; podcast: PodCast }
    | { type: AppContextActionType.setPlayTrackNo; trackNo: number }
    | { type: AppContextActionType.setCachedPaths; paths: string[] }
    | { type: AppContextActionType.setCachedPath; cashedInfo: { path: string, index: number } }


const AppContextReducer = (state: AppContextStatus, action: AppContextActions) => {
    switch (action.type) {
        case AppContextActionType.setShowPlayer:
            return { ...state, showPlayer: action.isPlayShow ?? false }
            break;
        case AppContextActionType.setPodcast:
            return { ...state, podcast: action.podcast }
        case AppContextActionType.setPlayTrackNo:
            return { ...state, trackNo: action.trackNo }
        case AppContextActionType.setCachedPath:
            var tempCachedPaths = state.cachedPaths;
            tempCachedPaths[action.cashedInfo.index] = action.cashedInfo.path
            return { ...state, cachedPaths: tempCachedPaths}
        case AppContextActionType.setCachedPaths:
            return { ...state, cachedPaths: action.paths}
        default:
            break;
    }
}
``
export const AppContextProvider: React.FC = ({ children }) => {
    const [appState, dispatch] = useReducer(AppContextReducer, initialAppContext);
    const dispatchShowPlayer = (showPlayer: boolean) => {
        dispatch({ type: AppContextActionType.setShowPlayer, isPlayShow: showPlayer });
    }

    const dispatchSetPodcast = (podcast: PodCast) => {
        console.log(podcast)
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
                setCachedPath: dispatchSetCachedPath
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useAppContextStore = () => useContext(AppContext);