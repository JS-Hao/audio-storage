import isString from "lodash/isString";
import localforage from "localforage";
import { SaveInfo, Config, AuidoType } from "./types";
import {
  audioToBlob,
  compress,
  decompress,
  dataURLtoAudio,
  dataURLtoBlob,
  blobToDataURL
} from "./utils";

export default class AudioStorage {
  private conf: Config = null;
  private defaultConf: Config = {
    name: "audioStorageDefaultName"
  };

  constructor(conf: Config) {
    this.conf = Object.assign({}, this.defaultConf, conf);
    const { name } = this.conf;

    localforage.config({
      driver: localforage.INDEXEDDB,
      name
    });
  }

  async setItem(
    name: string,
    audio: HTMLAudioElement | Blob,
    callback?: (error?: Error) => {}
  ): Promise<Error | SaveInfo> {
    let blob: Blob;
    let type: AuidoType;

    if (!isString(name)) {
      console.error(`you need to pass a 'name' into 'setItem'`);
    }

    if (!audio) {
      console.error(
        `you need to pass a 'audio' instance or buffer into 'setItem'`
      );
    }

    if (audio instanceof Audio) {
      blob = await audioToBlob(audio);
      type = AuidoType.htmlAudioElement;
    } else {
      blob = audio;
      type = AuidoType.blob;
    }

    try {
      const compressedDataURL = compress(await blobToDataURL(blob));
      const content = JSON.stringify({ type, compressedDataURL });
      await localforage.setItem(name, content);
      callback && callback();
    } catch (error) {
      console.error("saveInIndexedDB error:", error);
      callback && callback(error);
      return error;
    }
  }

  async getItem(name: string): Promise<Blob | HTMLAudioElement> {
    const content = (await localforage.getItem(name)) as string;

    if (!content) return null;

    const { type, compressedDataURL } = JSON.parse(content);
    const dataURL = decompress(compressedDataURL);

    if (type === AuidoType.blob) {
      return dataURLtoBlob(dataURL);
    } else if (type === AuidoType.htmlAudioElement) {
      return dataURLtoAudio(dataURL);
    }

    return null;
  }

  removeItem(name: string): Promise<void> {
    return localforage.removeItem(name);
  }
}
