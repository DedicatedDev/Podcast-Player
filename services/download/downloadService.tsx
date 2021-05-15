import * as React from 'react'
import {useCallback} from 'react'

const downloadFile = useCallback(async (item, index) => {

    const gifDir = FileSystem.cacheDirectory + "adyen/";
    const dirInfo = await FileSystem.getInfoAsync(gifDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
    }
    const fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + item.uid + ".mp3"
    );
    if (!fileInfo.exists) {
        const downloadResumable = FileSystem.createDownloadResumable(
            //item.bestand,
            "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
            FileSystem.documentDirectory + item.uid + ".mp3",
            {},
            (progress) => downloadCallback(progress, index)
        );
        downloadResumable.downloadAsync();
    }
}, []);