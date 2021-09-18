import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ProgressContext } from '../contexts/ProgressContext';
import { colors } from '../style';
import { Icon } from 'react-native-elements'
import { downloadQueue } from '../functions/downloadQueue';
import { QueueContext } from '../contexts/QueueContext';


const Footer = ({ open_settings }: {open_settings: () => void}) => {
  const { status } = useContext(ProgressContext);
  const ProgressContextData = useContext(ProgressContext);
  const QueueContextData = useContext(QueueContext);

  return(
    <>

      <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text numberOfLines={1} style={styles.text}>{ status }</Text>
      </View>
      <View style={styles.icon} >
        <Icon onPress={() => {QueueContextData.updateQueue([])}} type="material" name="close" color="#fff" size={35}/>
        <Icon onPress={() => {downloadQueue(QueueContextData, ProgressContextData)}} type="material" name="file-download" color="#fff" size={35}/>
        <Icon onPress={ open_settings } type="material" name="settings" color="#fff" size={35}/>
      </View>
    </View>
    </>

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors['bg-gray-800'],
    marginTop: 'auto',
    width: '100%',
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors['bg-gray-800'],
    marginTop: 'auto',
    zIndex: 0,
    width: '70%'
  },

  icon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    zIndex: 1
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: colors["bg-white"],
  },
})

export default Footer;
