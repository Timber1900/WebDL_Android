import React, { useContext } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ProgressContext } from '../contexts/ProgressContext';
import { colors } from '../style';
import { Icon } from 'react-native-elements'
import { downloadQueue } from '../functions/downloadQueue';
import { QueueContext } from '../contexts/QueueContext';

const Footer = () => {
  const { status } = useContext(ProgressContext);
  const ProgressContextData = useContext(ProgressContext);
  const QueueContextData = useContext(QueueContext);

  return(
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text numberOfLines={1} style={styles.text}>{ status }</Text>
      </View>
      <Icon onPress={() => {downloadQueue(QueueContextData, ProgressContextData)}} style={styles.icon} type="material" name="file-download" color="#fff" size={35}/>
    </View>
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
    width: Dimensions.get('window').width,

  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors['bg-gray-800'],
    marginTop: 'auto',
    width: "80%"
  },

  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: colors["bg-white"],
  },
})

export default Footer;
