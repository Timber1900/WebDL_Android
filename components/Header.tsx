import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from '../style';
import ProgressBar from 'react-native-progress/Bar'
import { ProgressContext } from '../contexts/ProgressContext';


const Header = () => {
  const { eta, progress, vel } = useContext(ProgressContext);

  return(
    <View style={ styles.progressContainer }>
      <View style={ [styles.progressBarContainer, globalStyles.shadowMD] }>
        <ProgressBar color={colors['bg-blue-500']} unfilledColor={colors["bg-gray-700"]} borderWidth={0} progress={progress} width={null} />
      </View>
      <View style={ styles.progressTextContainer }>
        <Text numberOfLines={1} style={ styles.text }>{`${(progress*100).toFixed(1)}%`}</Text>
        <Text numberOfLines={1} style={[styles.text, {marginLeft: 'auto'}]}>{vel} | ETA: {eta}s</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    padding: 10,
    paddingTop: 15,
    backgroundColor: colors['bg-gray-800'],
  },

  progressTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 8,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: colors["bg-white"],
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: colors["bg-white"]
  },

  progressBarContainer: {
    width: "100%",
    height: 24
  },
});


export default Header;
