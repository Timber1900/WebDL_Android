import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

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
      <ScrollView contentContainerStyle={ styles.itemContainer } style={{width: '100%', paddingHorizontal: 20}}>
        {curQueue.map(({info, url, ext}, i) =>
            <Item ext={ext} key={i} info={info} url={url} index={i}/>
          )}
      </ScrollView>
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
  },

  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});


export default Layout;
