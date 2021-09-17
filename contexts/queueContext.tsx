import React, { useCallback, useEffect, createContext, ReactNode, useState } from 'react';
import ytdl, { videoInfo } from 'react-native-ytdl';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShareMenu from "react-native-share-menu";

interface video {
  info: videoInfo,
  url: string,
}

export interface QueueContextData {
  curQueue: video[]
  addToQueue: (url: string) => Promise<string>
}

export const QueueContext = createContext({} as QueueContextData);

interface QueueProviderProps {
  children: ReactNode;
}

interface SharedItem {
  mimeType: string,
  data: string,
  extraData: any,
};

export default function QueueProvider({ children }: QueueProviderProps) {
  const [curQueue, setCurQueue] = useState<video[]>([])

  const addToQueue = (url: string, queue=curQueue) => {
    return(new Promise<string>(async (res, rej) => {
      if(!ytdl.validateURL(url)) rej("Invalid url")
      try {
        const info = await ytdl.getInfo(url);
        console.log(curQueue)
        setCurQueue([...queue, {info, url}])
        res("Sucess")
      } catch (error) {
        rej(error as string)
      }
    }))
  }


  const handleShare = useCallback(async (item: SharedItem) => {
    if (!item) return
    const { data } = item;
    const last_queue = await AsyncStorage.getItem('queue')
    addToQueue(data, JSON.parse(last_queue ?? "[]")).catch(err => Alert.alert("Error: ", err));
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('queue').then(last_queue => {
      setCurQueue(JSON.parse(last_queue ?? "[]"))
    })
  }, [])

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const jsonValue = JSON.stringify(curQueue)
    AsyncStorage.setItem('queue', jsonValue).catch(e => console.error(e))
    console.log(curQueue)
  }, [curQueue])

  return (
    <QueueContext.Provider
      value={{
        curQueue,
        addToQueue
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}
