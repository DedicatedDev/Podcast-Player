
import { createContext, useReducer, useContext } from 'react';
import * as React from 'react'
import { Episode } from '../home/Model';

export interface PlayerContextStatus {
    displayMode: PlayDisplayMode,
    setPlayerDisplayMode:(displayMode:PlayDisplayMode) => void,
    visible: Boolean | null,
    setVisible:(isHidden:boolean) => void,
    playState: PlayState,
    setPlayState:(playState:PlayState) => void,
    cachedPath: string | null,
    setCachedPath:(cachedPath:string) => void,
    playlist: Episode[] | null,
    setPalyList:(playList:Episode[]) => void,
    playSpeed: PlaySpeed,
    setPlaySpeed:(playSpeed:PlaySpeed) => void,
    playTime: number,
    setPlayTime:(playTime:number) => void,
    totalTime: number,
    setTotalTime:(totalTime:number) => void,
    volume:number,
    setVolume:(volume:number) => void
}

export enum PlaySpeed {
    normal = 1,
    middle = 1.5,
    twice = 2
}

export enum PlayState {
    loading,
    play,
    stop
}

export enum PlayDisplayMode {
    mini, full
}

const initPlayerContext: PlayerContextStatus = {
    displayMode: PlayDisplayMode.mini,
    setPlayerDisplayMode:()=> PlayDisplayMode.mini,
    visible: false,
    setVisible:() => false,
    playState: PlayState.loading,
    setPlayState:() => PlayState.loading,
    cachedPath: null,
    setCachedPath: () => null,
    playlist: [],
    setPalyList:() => [],
    playSpeed: PlaySpeed.normal,
    setPlaySpeed:() => PlaySpeed.normal,
    playTime: 0.0,
    setPlayTime:() => 0.0,
    totalTime: 0.0,
    setTotalTime:() => 0.0,
    volume:1.0,
    setVolume:() => 1.0
};

const PlayerContext = createContext(initPlayerContext);

export enum PlayerActionType {
    setPlayMode,
    setDisplayMode,
    setForward,
    setBackward,
    setNext,
    setPrevious,
    loadNewItem,
    setVolume,
    setPlaySpeed,
    setVisible,
    setPlayTime,
    setTotalTime,
    setCachedPath,
    setPlaylist,
}

export type PlayerActions =
    | { type: PlayerActionType.setPlayMode, playStatus: PlayState }
    | { type: PlayerActionType.setDisplayMode, displayMode: PlayDisplayMode }
    | { type: PlayerActionType.setBackward }
    | { type: PlayerActionType.setNext }
    | { type: PlayerActionType.setPrevious }
    | { type: PlayerActionType.loadNewItem }
    | { type: PlayerActionType.setVolume, volume: number }
    | { type: PlayerActionType.setPlaySpeed, speed:number}
    | { type: PlayerActionType.setVisible, visible: Boolean }
    | { type: PlayerActionType.setPlayTime, playTime: number }
    | { type: PlayerActionType.setTotalTime, totalTime: number }
    | { type: PlayerActionType.setCachedPath, cachedPath: string }
    | { type: PlayerActionType.setPlaylist, playlist: Episode[] }
    

const PlayerContextReducer = (state:PlayerContextStatus,action:PlayerActions)=>{
    switch (action.type) {
        case PlayerActionType.setDisplayMode:
            return { ...state, displayMode: action.displayMode }
        case PlayerActionType.setPlaySpeed:
            return { ...state, playSpeed: action.speed }
        case PlayerActionType.setVisible:
            return { ...state, visible:  action.visible }
        case PlayerActionType.setPlayMode:
            return { ...state, playState: action.playStatus }
        case PlayerActionType.loadNewItem:
            return { ...state, playState: PlayState.loading }
        case PlayerActionType.setPlayTime:
            return { ...state, playTime: action.playTime }
        case PlayerActionType.setTotalTime:
            return { ...state, totalTime: action.totalTime }
        case PlayerActionType.setCachedPath:
            return { ...state, cachedPath: action.cachedPath }
        case PlayerActionType.setVolume:
            return { ...state, volume: action.volume }
        default:
            break;
    }
}

export const PlayerContextProvider:React.FC = ({children}) => {
    const [playerState, dispatch] = useReducer(PlayerContextReducer, initPlayerContext);
    const dispatchSetPlayerDisplayMode = (displayMode:PlayDisplayMode) => {
        dispatch({type:PlayerActionType.setDisplayMode,displayMode:displayMode})
    }
    const dispatchSetVisible = (visible: boolean) => {
        dispatch({ type: PlayerActionType.setVisible, visible: visible })
    }
    const dispatchSetPlayState = (playState: PlayState) => {
        dispatch({ type: PlayerActionType.setPlayMode, playStatus: playState })
    }
    const dispatchSetCachedPath = (cachedPath:string) => {
        dispatch({ type: PlayerActionType.setCachedPath, cachedPath: cachedPath })
    }

    const dispatchSetPlaylist = (playList: Episode[]) => {
        dispatch({ type: PlayerActionType.setPlaylist, playlist: playList })
    }
    const dispatchSetPlaySpeed = (playSpeed: number) => {
        dispatch({ type: PlayerActionType.setPlaySpeed, speed: playSpeed })
    }

    const dispatchSetPlayTime = (playTime: number) => {
        dispatch({ type: PlayerActionType.setPlayTime, playTime: playTime })
    }
    const dispatchSetTotalTime = (totalTime: number) => {
        dispatch({ type: PlayerActionType.setTotalTime, totalTime: totalTime })
    }
   
    const dispatchSetVolume = (volume: number) => {
        dispatch({ type: PlayerActionType.setVolume, volume: volume })
    }
    return(
        <PlayerContext.Provider
            value = {{
                displayMode: playerState.displayMode,
                setPlayerDisplayMode: dispatchSetPlayerDisplayMode,
                visible: playerState.visible,
                setVisible: dispatchSetVisible,
                playState: playerState.playState,
                setPlayState: dispatchSetPlayState,
                cachedPath: playerState.cachedPath,
                setCachedPath: dispatchSetCachedPath,
                playlist: playerState.playlist,
                setPalyList: dispatchSetPlaylist,
                playSpeed: playerState.playSpeed,
                setPlaySpeed: dispatchSetPlaySpeed,
                playTime: playerState.playTime,
                setPlayTime: dispatchSetPlayTime,
                totalTime: playerState.totalTime,
                setTotalTime: dispatchSetTotalTime,
                volume:playerState.volume,
                setVolume: dispatchSetVolume
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayerContextStore = () => useContext(PlayerContext)


