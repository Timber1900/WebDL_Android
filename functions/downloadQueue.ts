import { ProgressContextData } from '../contexts/ProgressContext';
import { QueueContextData } from '../contexts/QueueContext';
import { downloadAudio } from './downloadAudio';
import { downloadItem } from './downloadItem';

export const downloadQueue = async ({ curQueue, updateQueue }: QueueContextData, ProgressContextData: ProgressContextData) => {
  const tempQueue = [...curQueue]
  console.log(curQueue)

  for (const { url, info } of tempQueue) {
    console.log(info.videoDetails.title);
    ProgressContextData.updateStatus(`Downloading ${info.videoDetails.title}`);
    await downloadAudio(url, ProgressContextData);
    const temp = curQueue.filter(val => val.url !== url);
    curQueue = temp;
    ProgressContextData.updateStatus(`Done Downloading ${info.videoDetails.title}`);
    updateQueue(temp);
  }
}
