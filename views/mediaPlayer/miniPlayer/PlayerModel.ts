import { Episode } from './../../home/Model';
export interface PlayerModel{
    displayStyle:PlayDisplayMode,
    isHidden:boolean,
    isPlaying:boolean,
    cachedPath:string[]|null,
    playlist:Episode[]|null,
    playSpeed:PlaySpeed,
    playTime:number,
    selectedTrack:number,
}

export enum PlaySpeed{
    normal,
    middle,
    twice
}

export enum PlayDisplayMode {
    mini,full
}

export enum UserActionTypeToPlayer {
    tappedPlayBtn,
    tappedExpandBtn,
    tappedForward,
    tappedBackward,
    tappedNext,
    tappedPrevious,
    changedVolume,
    changedPlaySpeed,
    changedVisible,
    loadedNewTrack,
}

export type UserActionsToPlayer =
    | { type: UserActionTypeToPlayer.tappedPlayBtn,isPlaying:boolean}
    | { type: UserActionTypeToPlayer.tappedExpandBtn,displayMode:PlayDisplayMode}
    | { type: UserActionTypeToPlayer.tappedBackward}
    | { type: UserActionTypeToPlayer.tappedNext}
    | { type: UserActionTypeToPlayer.tappedPrevious}
    | { type: UserActionTypeToPlayer.changedVolume}
    | { type: UserActionTypeToPlayer.changedPlaySpeed}
    | { type: UserActionTypeToPlayer.changedVisible, isHidden:boolean}
    | { type: UserActionTypeToPlayer.loadedNewTrack, trackNo:number}
