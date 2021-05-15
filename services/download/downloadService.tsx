import * as React from 'react'

import * as FileSystem from "expo-file-system";
import { useAppContextStore } from '../../context/AppContext';
import { Episode } from '../../views/home/Model';
import { useState, useMemo, useEffect } from 'react';
import { DownloadProgress, DownloadStatus, initialDownloadStatus } from './DownloadModel';

export const useDownloadService = (index: number) => {

    const { podcast } = useAppContextStore();
    const [state, setState] = useState<DownloadStatus>(initialDownloadStatus)
    useEffect(() => {
        if (podcast && podcast) {
            downloadFile(podcast.episodes[index])
        } else {
            setState({ ...state, progressStatus: DownloadProgress.downloadImpossible })
        }
    }, [index])

    const downloadFile = async (item: Episode) => {
        const gifDir = FileSystem.cacheDirectory + "adyen/";
        const dirInfo = await FileSystem.getInfoAsync(gifDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
        }
        const fileInfo = await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + item.uid + ".mp3"
        );

        if (!fileInfo.exists) {
            setState({ ...state, progressStatus: DownloadProgress.downloadPossible, cachedPath: null })
            const downloadResumable = FileSystem.createDownloadResumable(
                //item.bestand,
                "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
                FileSystem.documentDirectory + item.uid + ".mp3",
                {},
                (progress) => downloadCallback(progress)
            );
            await downloadResumable.downloadAsync();
            console.log("finished")
        } else {
            const cachedPath = FileSystem.documentDirectory + item.uid + ".mp3"
            setState({ ...state, progressStatus: DownloadProgress.downloaded, cachedPath: cachedPath })
        };
    }


    // const onDownloaded = useCallback(
    //     async (index) => {
    //         let _items = [...data];
    //         const tmp = await FileSystem.getInfoAsync(
    //             FileSystem.documentDirectory + _items[index].uid + ".mp3"
    //         );
    //         _items[index] = {
    //             ..._items[index],
    //             isDownloading: false,
    //             isDownloaded: Platform.OS === "ios" ? true : tmp.exists,
    //         };
    //         setData(_items);
    //     },
    //     [data, setData]
    // );

    // const deleteFile = useCallback(
    //     async (item, index) => {
    //         const fileInfo = await FileSystem.getInfoAsync(
    //             FileSystem.documentDirectory + item.uid + ".mp3"
    //         );
    //         await FileSystem.deleteAsync(fileInfo.uri);
    //         let _items = [...data];
    //         _items[index] = { ..._items[index], isDownloaded: false };
    //         setData(_items);
    //     },
    //     [data, setData]
    // );

    const downloadCallback =
        async (downloadProgress:FileSystem.DownloadProgressData) => {
      
            const progress =
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite;

            if (progress < 1) {
                console.log(progress)
                if (state.downloadProgress != DownloadProgress.downloading) {
                    setState({ ...state, progressStatus: DownloadProgress.downloading })
                } else {
                    const cachedPath = FileSystem.documentDirectory + podcast.episodes[index].uid + ".mp3"
                    setState({ ...state, progressStatus: DownloadProgress.downloaded, cachedPath: cachedPath })
                }
            } else {
                const cachedPath = FileSystem.documentDirectory + podcast.episodes[index].uid + ".mp3"
                setState({ ...state, progressStatus: DownloadProgress.downloaded, cachedPath: cachedPath })
            }
        };

    // const onDownloaded = useCallback(
    //     async (index) => {
    //         let _items = [...data];
    //         const tmp = await FileSystem.getInfoAsync(
    //             FileSystem.documentDirectory + _items[index].uid + ".mp3"
    //         );
    //         _items[index] = {
    //             ..._items[index],
    //             isDownloading: false,
    //             isDownloaded: Platform.OS === "ios" ? true : tmp.exists,
    //         };
    //         setData(_items);
    //     },
    //     [data, setData]
    // );

    return { downloadStatus: state, index: index }

}
