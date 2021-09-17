import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { video } from '../contexts/QueueContext';
import { colors } from '../style';

const Item = ({ info }: video) => {
  return(
    <View style={styles.container}>
      <Text style={styles.text}>{info.videoDetails.title}</Text>
      <View style={styles.mainContainer}>
        <Image style={styles.thumbnail} source={{uri: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url}} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
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
