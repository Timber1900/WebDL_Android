import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TextInput , View, Button, PermissionsAndroid, StyleSheet, Alert, Text } from 'react-native';
import { LogLevel, RNFFmpeg, RNFFmpegConfig } from 'react-native-ffmpeg';
import ytdl from 'react-native-ytdl';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import { colors } from '../style';
import performance from 'react-native-performance';
import requestPermissions from '../functions/requestPermissions';
import ShareMenu from "react-native-share-menu";
import { ProgressContext } from '../contexts/progressContext';
import msToTime from '../functions/msToTime';
import Header from './Header';

type SharedItem = {
  mimeType: string,
  data: string,
  extraData: any,
};

const Layout = () => {
  const [url, setUrl] = useState('');
  const { updateEta, updateProgress, updateVel } = useContext(ProgressContext);

  const handleShare = useCallback((item: SharedItem) => {
    if (!item) {
      return;
    }
    const { data } = item;
    setUrl(data);
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, []);

  const downloadVideo = async () => {
    if(!requestPermissions()) return

    if(!ytdl.validateURL(url)) {
      console.log(url)
      Alert.alert(
        "Error downloading video",
        `Invalid url: ${url}`
      )
      return
    }

    const basicInfo = await ytdl.getBasicInfo(url);

    const audioPipe = await RNFFmpegConfig.registerNewFFmpegPipe()
    const videoPipe = await RNFFmpegConfig.registerNewFFmpegPipe()
    const downloadPath  = `${RNFS.ExternalStorageDirectoryPath}/Download/${basicInfo.videoDetails.title.replace(/([|\\?*<\":>+[\]/'])/g, '')}.mkv`;
    const video_args = [
      '-loglevel',
      `${LogLevel.AV_LOG_WARNING}`,
      '-hide_banner',
      '-i',
      audioPipe,
      '-i',
      videoPipe,
      '-map',
      '0:a',
      '-map',
      '1:v',
      '-c:v',
      'copy',
      '-y',
      downloadPath
    ];

    const audio = await ytdl(url, { quality: 'highestaudio' });
    const video = await ytdl(url, { quality: 'highestvideo' });

    RNFFmpeg.executeWithArguments(video_args).then((val) => { console.log(val); if(val === 0) updateProgress(1) } ).catch(err => {console.log(err); Alert.alert("Error", err.toString())})

    RNFetchBlob
    .config({ path: audioPipe})
    .fetch('GET', audio[0].url, {})
    .catch(err => {console.log(err); Alert.alert("Error", err.toString())})

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
    .catch(err => {console.log(err); Alert.alert("Error", err.toString())})
  };

  return(
      <View style={ styles.container }>
        <Header />
        <View style={styles.inputContainer}>
          <TextInput defaultValue={url} onChangeText={url_new => setUrl(url_new)} style={ styles.input }/>
          <Button title="Download Video" onPress={downloadVideo} />
        </View>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    height: "100%",
    fontFamily: "sans",
    backgroundColor: colors["bg-gray-800"]
  },

  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexGrow: 1,
  },

  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors["bg-gray-700"],
  },
});


export default Layout;
