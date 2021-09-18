import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { QueueContext, video } from '../contexts/QueueContext';
import { colors } from '../style';
import { Picker } from '@react-native-picker/picker';

const Item = ({ info, ext, index }: video & {index: number}) => {
  const { changeVideoExt } = useContext(QueueContext)
  const [selectedFormat, setSelectedFormat] = useState(ext);

  useEffect(() => {
    changeVideoExt(selectedFormat, index)
  }, [selectedFormat])

  return(
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.text}>{info.videoDetails.title}</Text>
      <View style={styles.mainContainer}>
        <Image style={styles.thumbnail} source={{uri: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url}} />
        <View style={ styles.chooserContainer }>
          <View style={ styles.buttonsContainer }>
            <Icon onPress={() => {}} type="material" name="close" color="#fff" size={35}/>
            <Icon onPress={() => {}} type="material" name="file-download" color="#fff" size={35}/>
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
