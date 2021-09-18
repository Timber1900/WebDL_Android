import React, { useCallback, useEffect, createContext, ReactNode, useState, useContext } from 'react';
import ytdl, { videoInfo } from 'react-native-ytdl';
import ytpl from 'react-native-ytpl';
import { Alert } from 'react-native';
import ShareMenu from "react-native-share-menu";
import MMKVStorage from "react-native-mmkv-storage";
import util from 'util';
import { ProgressContext } from './ProgressContext';

export interface video {
  info: videoInfo,
  url: string,
  ext: 'v mkv' | 'v mp4' | 'v webm' | 'a m4a'
}

export interface QueueContextData {
  curQueue: video[]
  defaultExt: 'v mkv' | 'v mp4' | 'v webm' | 'a m4a'
  addToQueue: (url: string) => Promise<string>
  updateQueue: (newQueue: video[]) => void,
  updateDefaultExt: (newDefaultExt: 'v mkv' | 'v mp4' | 'v webm' | 'a m4a') => void,
  changeVideoExt: (newExt: 'v mkv' | 'v mp4' | 'v webm' | 'a m4a', index: number) => void,
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
  const MMKV = new MMKVStorage.Loader().initialize();
  const {status, updateStatus} = useContext(ProgressContext)
  const [curQueue, setCurQueue] = useState<video[]>([])
  const [defaultExt, setDefaultExt] = useState<'v mkv' | 'v mp4' | 'v webm' | 'a m4a'>(MMKV.getString('def_ext') as 'v mkv' | 'v mp4' | 'v webm' | 'a m4a' ?? 'v mkv')

  const addToQueue = (url: string, queue=curQueue) => {
    return(new Promise<string>(async (res, rej) => {
      let currentInfo = 'Fetching videos';
      updateStatus(currentInfo);

      let url_list: string[] = [];
      if(ytpl.validateID(url)) {
        console.log(JSON.stringify({ "url": url }))
        const responce= await fetch('https://www.web-dl.live/api', {
          method: 'POST',
          body: JSON.stringify({ "url": url }),
          headers: {
            'Content-Type': 'application/json'
          },
        })
        if(responce.status !== 200) {rej(`Error: ${await responce.text()}`); return}
        const { urls } = await responce.json()
        url_list = [...urls]
      } else {
        url_list = [url]
      }

      const infos: Promise<ytdl.videoInfo>[] = []
      for (const URL of url_list) {
        infos.push(getInfo(URL))
      }

      const promise = Promise.all(infos)
      // const InformUser = async () => {
      //   if (util.inspect(promise).includes('pending')) {
      //     if (currentInfo.includes('Fetching videos')) {
      //       const new_info =
      //       currentInfo.substring(currentInfo.length - 3, currentInfo.length) === '...'
      //           ? currentInfo.substring(0, currentInfo.length - 3)
      //           : `${currentInfo}.`;
      //       currentInfo = new_info;
      //       updateStatus(new_info);
      //     }
      //     setTimeout(InformUser, 333);
      //   }
      // };

      // InformUser();

      promise.then(val => {
        const queue_addons: video[] = []
        if(val) {
          for(const info of val) {
            if(info) queue_addons.push({ info, url: info.videoDetails.video_url, ext: MMKV.getString('def_ext') as 'v mkv' | 'v mp4' | 'v webm' | 'a m4a' })
          }
        }
        setCurQueue([...queue, ...queue_addons])
        let currentInfo = 'Done fetching';
      })
    }))
  }

  const getInfo = (url: string) => {
    return(new Promise<ytdl.videoInfo>(async (res, rej) => {
      if(!ytdl.validateURL(url)) rej("Invalid url")
      try {
        const info = await ytdl.getInfo(url);
        res(info)
      } catch (error) {
        rej(error as string)
      }
    }))
  }

  const saveQueue = () => {
    MMKV.setArray('queue', curQueue)
  }

  const getSavedQueue = (): video[] => {
    return MMKV.getArray('queue') ?? []
  }

  const updateQueue = (newQueue: video[]) => {
    setCurQueue(newQueue);
  }

  const updateDefaultExt = (newDefaultExt: 'v mkv' | 'v mp4' | 'v webm' | 'a m4a') => {
    MMKV.setString('def_ext', newDefaultExt)
    setDefaultExt(newDefaultExt);
  }

  const changeVideoExt = (newExt: 'v mkv' | 'v mp4' | 'v webm' | 'a m4a', index: number) => {
    const temp = [...curQueue]
    temp[index].ext = newExt
    setCurQueue(temp)
  }

  const handleShare = useCallback(async (item: SharedItem) => {
    if (!item) return
    const { data } = item;
    const last_queue = await getSavedQueue();
    addToQueue(data, last_queue).catch(err => Alert.alert("Error: ", err));
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    setCurQueue(getSavedQueue())

    return () => {
      saveQueue();
    }
  }, [])

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    saveQueue()
  }, [curQueue])

  useEffect(() => {
    MMKV.setString('def_ext', defaultExt)
  }, [defaultExt])

  return (
    <QueueContext.Provider
      value={{
        curQueue,
        defaultExt,
        addToQueue,
        updateQueue,
        updateDefaultExt,
        changeVideoExt
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}
