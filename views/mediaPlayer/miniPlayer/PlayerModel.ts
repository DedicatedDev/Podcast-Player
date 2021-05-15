import { Episode } from './../../home/Model';
export interface PlayerModel{
    displayStyle:PlayDisplayMode,
    isHidden:Boolean,
    isPlaying:Boolean,
    cachedPath:String[]|null,
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
    changedVolume,
    changedPlaySpeed,
    changedVisible,
    setPlayTime,
    setTotalTime,
}

export type PlayerActions =
    | { type: PlayerActionType.tappedPlayBtn,isPlaying:Boolean}
    | { type: PlayerActionType.tappedExpandBtn,displayMode:PlayDisplayMode}
    | { type: PlayerActionType.tappedBackward}
    | { type: PlayerActionType.tappedNext}
    | { type: PlayerActionType.tappedPrevious}
    | { type: PlayerActionType.changedVolume}
    | { type: PlayerActionType.changedPlaySpeed}
    | { type: PlayerActionType.changedVisible, isHidden:Boolean}
    | { type: PlayerActionType.setPlayTime, playTime:Number}
    | { type: PlayerActionType.setTotalTime, totalTime:Number}
