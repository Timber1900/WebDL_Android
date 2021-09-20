import { ProgressContextData } from '../contexts/ProgressContext';
import { QueueContextData } from '../contexts/QueueContext';
import { downloadAudio } from './downloadAudio';
import { downloadItem } from './downloadItem';
import { downloadOther } from './downloadOther';

export const downloadQueue = async ({ curQueue, updateQueue }: QueueContextData, ProgressContextData: ProgressContextData) => {
  const tempQueue = [...curQueue]

  for (const { url, info, ext, youtube, otherInfo } of tempQueue) {
    const title = youtube ? info?.videoDetails.title : otherInfo?.title
    ProgressContextData.updateStatus(`Downloading ${title}`);

    const [type, format] = ext.split(' ')

    if(!youtube) {
      if(otherInfo) await downloadOther(otherInfo, ProgressContextData),
      ProgressContextData.updateStatus(`Done Downloading ${title}`);
    } else if(type === 'v') {
      await downloadItem(url, format, ProgressContextData);
      ProgressContextData.updateStatus(`Done Downloading ${title}`);
    } else {
      await downloadAudio(url, ProgressContextData);
      ProgressContextData.updateStatus(`Started Downloading ${title}`);
    }

    const temp = curQueue.filter(val => val.url !== url);
    curQueue = temp;
    updateQueue(temp);
  }
}
