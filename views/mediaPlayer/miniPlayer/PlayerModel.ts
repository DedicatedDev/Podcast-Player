import { Episode } from './../../home/Model';
export interface PlayerModel{
    displayStyle:PlayDisplayMode,
    isHidden:boolean|null,
    playState:PlayState,
    cachedPath:string|null,
    playlist:Episode[]|null,
    playSpeed:PlaySpeed,
    playTime:Number,
    totalTime:Number,
}

export enum PlaySpeed{
    normal,
    middle,
    twice
}

export enum PlayState{
    loading,
    play,
    stop
}

export enum PlayDisplayMode {
    mini,full
}

export enum PlayerActionType {
    tappedPlayBtn,
    tappedExpandBtn,
    tappedForward,
    tappedBackward,
    tappedNext,
    tappedPrevious,
    loadNewItem,
    changedVolume,
    changedPlaySpeed,
    changedVisible,
    setPlayTime,
    setTotalTime,
    setCachedPath
}

export type PlayerActions =
    | { type: PlayerActionType.tappedPlayBtn,playStatus:PlayState}
    | { type: PlayerActionType.tappedExpandBtn,displayMode:PlayDisplayMode}
    | { type: PlayerActionType.tappedBackward}
    | { type: PlayerActionType.tappedNext}
    | { type: PlayerActionType.tappedPrevious}
    | { type: PlayerActionType.loadNewItem}
    | { type: PlayerActionType.changedVolume}
    | { type: PlayerActionType.changedPlaySpeed}
    | { type: PlayerActionType.changedVisible, isHidden:Boolean}
    | { type: PlayerActionType.setPlayTime, playTime:Number}
    | { type: PlayerActionType.setTotalTime, totalTime:Number}
    | { type: PlayerActionType.setCachedPath, cachedPath:string}
