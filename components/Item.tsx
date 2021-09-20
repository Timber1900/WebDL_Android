import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { QueueContext, video } from '../contexts/QueueContext';
import { colors } from '../style';
import { Picker } from '@react-native-picker/picker';
import { ProgressContext } from '../contexts/ProgressContext';
import { downloadItem } from '../functions/downloadItem';
import { downloadAudio } from '../functions/downloadAudio';
import { downloadOther } from '../functions/downloadOther';

const Item = ({ info, ext, index, youtube, otherInfo, url }: video & {index: number}) => {
  const { changeVideoExt, curQueue, updateQueue } = useContext(QueueContext)
  const ProgressContextData = useContext(ProgressContext)
  const [selectedFormat, setSelectedFormat] = useState(ext);
  const title = youtube ? info?.videoDetails.title : otherInfo?.title
  const thumbnail = youtube ? info?.videoDetails.thumbnails[info?.videoDetails.thumbnails.length - 1].url : otherInfo?.thumbnails ? otherInfo?.thumbnails[otherInfo?.thumbnails.length - 1].url : 'https://media.istockphoto.com/vectors/no-thumbnail-image-vector-graphic-vector-id1147544806?k=20&m=1147544806&s=170667a&w=0&h=5rN3TBN7bwbhW_0WyTZ1wU_oW5Xhan2CNd-jlVVnwD0='

  useEffect(() => {
    changeVideoExt(selectedFormat, index)
  }, [selectedFormat])

  const removeFromQueue = () => {
    const temp = [...curQueue];
    temp.splice(index, 1)
    updateQueue(temp);
  }

  const downloadVideo = async () => {
    ProgressContextData.updateStatus(`Downloading ${title}`);

    const [type, format] = selectedFormat.split(' ')

    if(!youtube) {
      if(otherInfo) await downloadOther(otherInfo, ProgressContextData),
      ProgressContextData.updateStatus(`Done Downloading ${title}`);
    } else if(type === 'v') {
      await downloadItem(url, format, ProgressContextData);
      ProgressContextData.updateStatus(`Done Downloading ${title}`);
    } else {
      await downloadAudio(url, ProgressContextData);
      ProgressContextData.updateStatus(`Started Downloading ${title}`);
    }

    removeFromQueue()
  }

  return(
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.text}>{title}</Text>
      <View style={styles.mainContainer}>
        <Image style={styles.thumbnail} source={{uri: thumbnail}} />
        <View style={ styles.chooserContainer }>
          <View style={ styles.buttonsContainer }>
            <Icon onPress={removeFromQueue} type="material" name="close" color="#fff" size={35}/>
            <Icon onPress={downloadVideo} type="material" name="file-download" color="#fff" size={35}/>
            <Icon onPress={() => {}} type="material" name="edit" color="#fff" size={35}/>
          </View>
          <View style={ styles.pickerContainer }>
            <Picker style={{width: '100%', height: 20}} selectedValue={selectedFormat}  onValueChange={(itemValue, itemIndex) => setSelectedFormat(itemValue) }>
              <Picker.Item style={{color: '#c0c0c0', fontSize: 16, lineHeight: 24 }} label="Video" enabled={false} />
              <Picker.Item style={{color: '#fff'}} label="mkv" value="v mkv" />
              <Picker.Item style={{color: '#fff'}} label="mp4" value="v mp4" />
              <Picker.Item style={{color: '#fff'}} label="webm" value="v webm" />
              <Picker.Item style={{color: '#c0c0c0', fontSize: 16, lineHeight: 24 }} label="Audio" enabled={false} />
              <Picker.Item style={{color: '#fff'}} label="m4a" value="a m4a" />
            </Picker>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    height: 150,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: colors['bg-gray-800'],
    paddingTop: 10,
    padding: 20,
    borderRadius: 10,
  },

  mainContainer:  {
    display: 'flex',
    width: "100%",
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonsContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pickerContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors['bg-gray-700']
  },

  chooserContainer: {
    flexGrow: 1,
    height: '100%',
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbnail: {
    aspectRatio: 16/9,
    width: 150,
    borderRadius: 10,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: colors["bg-white"]
  },
})

export default Item;
