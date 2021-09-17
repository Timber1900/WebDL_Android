import { Alert } from 'react-native'
import ytdl from 'react-native-ytdl'
import requestPermissions from './requestPermissions'
import performance from 'react-native-performance';
import msToTime from '../functions/msToTime';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import { LogLevel, RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg';
import { ProgressContextData } from '../contexts/ProgressContext';

export const downloadItem = async (url: string, { updateEta, updateProgress, updateVel }: ProgressContextData) => {
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
    const audioPipe = await RNFFmpegConfig.registerNewFFmpegPipe()
    const videoPipe = await RNFFmpegConfig.registerNewFFmpegPipe()
    const downloadPath  = `${RNFS.ExternalStorageDirectoryPath}/Download/${basicInfo.videoDetails.title.replace(/([|\\?*<\":>+[\]/'])/g, '')}.mkv`;
    const video_args = ['-loglevel', `${LogLevel.AV_LOG_WARNING}`, '-hide_banner', '-i', audioPipe, '-i', videoPipe, '-map', '0:a', '-map', '1:v', '-c:v', 'copy', '-y', downloadPath];
    const audio = await ytdl(url, { quality: 'highestaudio' });
    const video = await ytdl(url, { quality: 'highestvideo' });

    RNFFmpeg.executeWithArguments(video_args).then((val) => { console.log(val); if(val === 0) res("Downloaded sucessfully"); rej(`FFMPEG closed with exit code ${val}`) } ).catch(err => rej(err))

    RNFetchBlob
      .config({ path: audioPipe})
      .fetch('GET', audio[0].url, {})
      .catch(err => rej(err))

    let downloadLast = performance.now();
    let downloadBegin = performance.now();
    let last_received = 0;
    RNFetchBlob
      .config({ path: videoPipe })
      .fetch('GET', video[0].url, {})
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
      .catch(err => rej(err))
  }))
}
