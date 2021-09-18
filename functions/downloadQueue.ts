import { ProgressContextData } from '../contexts/ProgressContext';
import { QueueContextData } from '../contexts/QueueContext';
import { downloadAudio } from './downloadAudio';
import { downloadItem } from './downloadItem';

export const downloadQueue = async ({ curQueue, updateQueue }: QueueContextData, ProgressContextData: ProgressContextData) => {
  const tempQueue = [...curQueue]
  console.log(curQueue)

  for (const { url, info, ext } of tempQueue) {
    ProgressContextData.updateStatus(`Downloading ${info.videoDetails.title}`);

    const [type, format] = ext.split(' ')

    if(type === 'v') {
      await downloadItem(url, format, ProgressContextData);
      ProgressContextData.updateStatus(`Done Downloading ${info.videoDetails.title}`);
    } else {
      await downloadAudio(url, ProgressContextData);
      ProgressContextData.updateStatus(`Started Downloading ${info.videoDetails.title}`);
    }

    const temp = curQueue.filter(val => val.url !== url);
    curQueue = temp;
    updateQueue(temp);
  }
}
