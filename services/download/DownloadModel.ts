import { DownloadPauseState } from 'expo-file-system';
import * as React from 'react'
import { Episode } from '../../views/home/Model';
export enum DownloadProgress{
    downloading,downloaded,downloadPossible,downloadImpossible
}
export interface DownloadStatus{
    progressStatus:DownloadProgress,
    setProgressStatus: (progressStatus: DownloadStatus) => void,

    downloadProgress:number,
    setDownloadProgress: (downloadProgress: number) => void

    episode:Episode,
    setEpisode: (episode: Episode) => void,

    cachedPath:string,
    setCachedPath:(path:string) => void
}

export const initialDownloadStatus: DownloadStatus = {
    progressStatus: DownloadProgress.downloadImpossible,
    setProgressStatus:() => null,
    downloadProgress: 0,
    setDownloadProgress:() => null,
    episode: null,
    setEpisode: () => null,
    cachedPath:null,
    setCachedPath:() => null
}

