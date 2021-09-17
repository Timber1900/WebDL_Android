import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../style';

import Header from './Header';
import { QueueContext } from '../contexts/QueueContext';
import Item from './Item';
import Footer from './Footer';

const Layout = () => {
  const { curQueue } = useContext(QueueContext)

  return(
    <View style={ styles.container }>
      <Header />
      {curQueue.map(({info, url}, i) =>
          <Item key={i} info={info} url={url}/>
        )}
      <Footer />
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
    backgroundColor: colors["bg-gray-700"]
  }
});


export default Layout;
