import React, { ReactNode } from 'react';
import { StyleSheet, Pressable} from 'react-native';


const Backdrop = ({ children, close_function }: {children: ReactNode, close_function: () => void}) => {
  return(
    <Pressable style={ styles.backdrop } onPress={ close_function }>
      { children }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0000005a',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6
  }
})

export default Backdrop;
