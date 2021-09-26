import { ProgressContextData } from '../contexts/ProgressContext';
import { QueueContextData } from '../contexts/QueueContext';
import { downloadAudio } from './downloadAudio';
import { downloadItem } from './downloadItem';
import { downloadOther } from './downloadOther';
import notifee, { AndroidGroupAlertBehavior, AndroidImportance, AndroidStyle } from '@notifee/react-native';

export interface progressItems {
  vel: string,
  eta: string,
  progress: number
}

export const downloadQueue = async ({ curQueue, updateQueue }: QueueContextData, ProgressContextData: ProgressContextData) => {
  const tempQueue = [...curQueue]



  for (const { url, info, ext, youtube, otherInfo, title } of tempQueue) {
    ProgressContextData.updateStatus(`Downloading ${title}`);
    const [type, format] = ext.split(' ')

    if(!youtube) {
      if(otherInfo) await downloadOther(otherInfo, title, ProgressContextData),
      ProgressContextData.updateStatus(`Done Downloading ${title}`);
    } else if(type === 'v') {
      const channelId = await notifee.createChannel({
        id: 'video_download',
        name: 'Video Download Notifications',
        badge: false,
        importance: AndroidImportance.DEFAULT
      });

      notifee.displayNotification({
        id: "WebDL_Downloads_Group",
        title: 'WebDL Downloads',
        android: {
          channelId,
          groupSummary: true,
          groupId: '123',
          autoCancel: false,
        },
      });

      const onProgressCallback = async ({eta, progress, vel}: progressItems) => {
        await notifee.displayNotification({
          id: title,
          title: `Downloading ${title}`,
          android: {
            channelId,
            color: "#00C9E1",
            colorized: true,
            onlyAlertOnce: true,
            ongoing: true,
            autoCancel: false,
            importance: AndroidImportance.DEFAULT,
            groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            style: {
              type: AndroidStyle.BIGTEXT,
              text: `${(progress*100).toFixed(1)}%<br/>${vel} | ETA: ${eta}s`,
            },
            progress: {
              max: 1000,
              current: progress * 1000,
              indeterminate: false
            },
            groupId: '123',
          },
        });
      }

      await notifee.displayNotification({
        id: title,
        title: `Downloading ${title}`,
        body: 'Waiting for download to start',
        android: {
          channelId,
          color: "#00C9E1",
          colorized: true,
          onlyAlertOnce: true,
          ongoing: true,
          autoCancel: false,
          importance: AndroidImportance.DEFAULT,
          groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
          groupId: '123',
        },
      });
      await downloadItem(url, format, title, ProgressContextData, onProgressCallback);

      await notifee.displayNotification({
        id: title,
        title: `Done downloading ${title}`,
        body: `Successfully downloaded ${title}`,
        android: {
          channelId,
          color: "#00C9E1",
          colorized: true,
          onlyAlertOnce: true,
          ongoing: false,
          autoCancel: true,
          importance: AndroidImportance.DEFAULT,
          groupId: '123',
          groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
        },
      });

      ProgressContextData.updateStatus(`Done Downloading ${title}`);
    } else {
      await downloadAudio(url, title, ProgressContextData);
      ProgressContextData.updateStatus(`Started Downloading ${title}`);
    }

    const temp = curQueue.filter(val => val.url !== url);
    curQueue = temp;
    updateQueue(temp);
  }
}
