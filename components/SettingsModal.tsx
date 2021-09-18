import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, Pressable } from 'react-native';
import { QueueContext } from '../contexts/QueueContext';
import { colors } from '../style';


const SettingsModal = ({close_function}: {close_function: () => void}) => {
  const {defaultExt, updateDefaultExt} = useContext(QueueContext)
  const [selectedFormat, setSelectedFormat] = useState<"v mkv" | "v mp4" | "v webm" | "a m4a">(defaultExt);

  const closeSettings = useCallback(() => {
    close_function();
    return true
  }, [])

  useEffect(() => {
    updateDefaultExt(selectedFormat)
  }, [selectedFormat])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', closeSettings);
    return(() => {
      BackHandler.removeEventListener('hardwareBackPress', closeSettings);
    })
  }, [])

  return(
    <Pressable style={ styles.settingsContainer } onPress={e => e.stopPropagation()}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.text}>Default format:</Text>
        <View style={ styles.pickerContainer }>
          <Picker style={{width: '100%', height: 24}} selectedValue={selectedFormat}  onValueChange={(itemValue, itemIndex) => setSelectedFormat(itemValue) }>
            <Picker.Item style={{color: '#c0c0c0', fontSize: 16, lineHeight: 24 }} label="Video" enabled={false} />
            <Picker.Item style={{color: '#fff'}} label="mkv" value="v mkv" />
            <Picker.Item style={{color: '#fff'}} label="mp4" value="v mp4" />
            <Picker.Item style={{color: '#fff'}} label="webm" value="v webm" />
            <Picker.Item style={{color: '#c0c0c0', fontSize: 16, lineHeight: 24 }} label="Audio" enabled={false} />
            <Picker.Item style={{color: '#fff'}} label="m4a" value="a m4a" />
          </Picker>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  settingsContainer: {
    display: 'flex',
    width: '80%',
    height: '80%',
    backgroundColor: colors['bg-gray-700'],
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 7,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'column'
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: colors["bg-white"],
  },

  pickerContainer: {
    flexGrow: 1,
    borderRadius: 10,
    backgroundColor: colors['bg-gray-800'],
    margin: 10,
  },
})

export default SettingsModal;
