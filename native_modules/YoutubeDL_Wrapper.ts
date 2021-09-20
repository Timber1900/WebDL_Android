import { NativeModules } from 'react-native';

interface YoutubeDL_Wrapper_Types {
  getInfoInner: (url: string) => string
}

const getOtherInfo = (url : string): Promise<YoutubeDLWrapperInfo> => {
  return(new Promise(async (res, rej) => {
    let { YoutubeDL_Wrapper } = NativeModules;
    YoutubeDL_Wrapper = YoutubeDL_Wrapper as YoutubeDL_Wrapper_Types;

    try {
      const infoString = await YoutubeDL_Wrapper.getInfoInner(url)
      res(JSON.parse(infoString))
    } catch (error) {
      rej(error)
    }
  }))
}

export default getOtherInfo;

export interface YoutubeDLWrapperInfo {
  id:                   string;
  title:                string;
  description:          string;
  uploader:             string;
  timestamp:            number;
  uploader_id:          string;
  uploader_url:         string;
  like_count:           number;
  repost_count:         number;
  comment_count:        number;
  age_limit:            number;
  tags:                 any[];
  formats:              Format[];
  thumbnails?:           Thumbnail[];
  duration:             number;
  extractor:            string;
  webpage_url:          string;
  webpage_url_basename: string;
  extractor_key:        string;
  playlist:             null;
  playlist_index:       null;
  thumbnail?:            string;
  display_id:           string;
  upload_date:          string;
  requested_subtitles:  null;
  url:                  string;
  format_id:            string;
  tbr:                  number;
  width:                number;
  height:               number;
  ext:                  string;
  format:               string;
  protocol:             string;
  http_headers:         HTTPHeaders;
  fulltitle:            string;
  _filename:            string;
}

export interface Format {
  url:           string;
  format_id:     string;
  tbr:           number;
  width:         number;
  height:        number;
  ext:           string;
  format:        string;
  protocol:      string;
  http_headers:  HTTPHeaders;
  manifest_url?: string;
  fps?:          null;
  preference?:   null;
  vcodec?:       string;
  acodec?:       string;
}

export interface HTTPHeaders {
  "User-Agent":      string;
  "Accept-Charset":  string;
  Accept:            string;
  "Accept-Encoding": string;
  "Accept-Language": string;
}

export interface Thumbnail {
  id:         string;
  url:        string;
  width:      number;
  height:     number;
  resolution: string;
}
