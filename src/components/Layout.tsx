import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../style';
import Header from './Header';
import { QueueContext } from '../contexts/QueueContext';
import Item from './Item';
import Footer from './Footer';
import Backdrop from './Backdrop';
import SettingsModal from './SettingsModal';

const Layout = () => {
  const [settings, setSettings] = useState(false);
  const { curQueue } = useContext(QueueContext);

  return(
    <View style={{position: 'relative'}}>
      {settings &&
        <Backdrop close_function={() => setSettings(false)}>
          <SettingsModal close_function={() => setSettings(false)} />
        </Backdrop>
      }
      <View style={ styles.container }>
        <Header />
        <ScrollView contentContainerStyle={ styles.itemContainer } style={{width: '100%', paddingHorizontal: 20}}>
          {curQueue.map(({info, url, ext, youtube, otherInfo, title}, i) =>
              <Item title={title} youtube={youtube} otherInfo={otherInfo} ext={ext} key={i} info={info} url={url} index={i}/>
            )}
        </ScrollView>
        <Footer open_settings={() => {setSettings(true)}}/>
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
    backgroundColor: colors["bg-gray-700"],
    zIndex: 5
  },

  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});


export default Layout;
