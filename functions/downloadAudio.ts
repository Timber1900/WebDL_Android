import { Alert } from 'react-native'
import ytdl from 'react-native-ytdl'
import RNFetchBlob from 'rn-fetch-blob'
import requestPermissions from './requestPermissions'
import RNFS from 'react-native-fs';
import { ProgressContextData } from '../contexts/ProgressContext';
import performance from 'react-native-performance';
import msToTime from './msToTime';


export const downloadAudio = (url: string, { updateEta, updateProgress, updateVel }: ProgressContextData) => {
  return(new Promise(async (res, rej) => {
    if(!requestPermissions()) rej("User failed to accept premissions")
    if(!ytdl.validateURL(url)) {
      console.log(url)
      Alert.alert(
        "Error downloading video",
        `Invalid url: ${url}`
      )
      rej(`Invalid url: ${url}`)
    }

    const basicInfo = await ytdl.getBasicInfo(url);
    const audio = await ytdl(url, { quality: 'highestaudio',  filter: 'audioonly'});
    const downloadPath  = `${RNFS.ExternalStorageDirectoryPath}/Music/WebDL/${basicInfo.videoDetails.title.replace(/([|\\?*<\":>+[\]/'])/g, '')}.m4a`;


    let downloadLast = performance.now();
    let downloadBegin = performance.now();
    let last_received = 0;
    RNFetchBlob
    .config({ path: downloadPath })
    .fetch('GET', audio[0].url, {})
    .progress({ interval : 25}, (received, total) => {
      const new_time = performance.now();
      const delta_time = new_time - downloadLast;
      const delta_download = (received - last_received);
      const delta_time_eta = new_time - downloadBegin;
      const downloadSpeed = received/delta_time_eta;
      const eta_time = msToTime((total-received)/downloadSpeed);
      last_received = received;
      downloadLast = new_time;
      updateProgress(received / total);
      updateVel(`${((delta_download/(1024*1024))/(delta_time/1000)).toFixed(2)}MiB/s`);
      updateEta(eta_time);
    })
    .then(() => res("Downloaded sucessfully"))
    .catch(err => rej(err))
  }))
}
