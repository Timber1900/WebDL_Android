import { Alert } from 'react-native'
import ytdl from 'react-native-ytdl'
import RNFetchBlob from 'rn-fetch-blob'
import requestPermissions from './requestPermissions'
import RNFS from 'react-native-fs';
import { ProgressContextData } from '../contexts/ProgressContext';
import { YoutubeDLWrapperInfo } from '../native_modules/YoutubeDL_Wrapper';


export const downloadOther = (info: YoutubeDLWrapperInfo, { updateEta, updateProgress, updateVel }: ProgressContextData) => {
  return(new Promise(async (res, rej) => {
    if(!requestPermissions()) rej("User failed to accept premissions")

    const bestFormat = info.formats.filter(val => val.vcodec != 'none' && val.acodec != 'none').reduce((prev, cur) => {
      console.log({v: cur.vcodec, a: cur.acodec})
      if(cur.vcodec != 'none' && cur.acodec != 'none') {
        return prev.height < cur.height ? cur : prev
      } else {
        return prev
      }
    })
    if(!bestFormat) rej("No good format")
    const link = bestFormat.url;
    const downloadPath  = `${RNFS.ExternalStorageDirectoryPath}/Download/WebDL/${info.title.replace(/([|\\?*<\":>+[\]/'])/g, '')}.${bestFormat.ext}`;

    // let downloadLast = performance.now();
    // let downloadBegin = performance.now();
    // let last_received = 0;
    RNFetchBlob
    .config({ addAndroidDownloads:{
      path: downloadPath,
      title: info.title,
      notification: true,
      useDownloadManager: true,
    }})
    .fetch('GET', link, {})
    // .progress({ interval : 25}, (received, total) => {
    //   const new_time = performance.now();
    //   const delta_time = new_time - downloadLast;
    //   const delta_download = (received - last_received);
    //   const delta_time_eta = new_time - downloadBegin;
    //   const downloadSpeed = received/delta_time_eta;
    //   const eta_time = msToTime((total-received)/downloadSpeed);
    //   last_received = received;
    //   downloadLast = new_time;
    //   updateProgress(received / total);
    //   updateVel(`${((delta_download/(1024*1024))/(delta_time/1000)).toFixed(2)}MiB/s`);
    //   updateEta(eta_time);
    // })
    .catch(err => rej(err))
    .finally(() => console.log("Finished"))
    res("Started download")

  }))
}
