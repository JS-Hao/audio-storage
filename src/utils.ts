import LZUTF8 from "lzutf8";
import axios from "axios";

export async function audioToBlob(audio: HTMLAudioElement): Promise<Blob> {
  const url = audio.src;
  if (url) {
    return axios({
      url,
      method: "get",
      responseType: "arraybuffer"
    }).then(async res => {
      const arrayBuffer = res.data;
      const contentType = res.headers["content-type"];
      const file = new File([arrayBuffer], "result", {
        type: contentType
      });
      return file;
    });
  } else {
    return Promise.resolve(null);
  }
}

export function compress(str: string): string {
  return LZUTF8.compress(str, {
    outputEncoding: "Base64"
  });
}

export function decompress(str: string): string {
  return LZUTF8.decompress(str, {
    inputEncoding: "Base64"
  });
}

export function dataURLtoBlob(dataURL: string): Blob {
  var arr = dataURL.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function blobToDataURL(blob: Blob): Promise<string> {
  const fileReader = new FileReader();
  return new Promise(resolve => {
    fileReader.addEventListener("load", () =>
      resolve(fileReader.result as string)
    );
    fileReader.readAsDataURL(blob);
  });
}

export function dataURLtoAudio(dataURL: string): HTMLAudioElement {
  const audio = new Audio(dataURL);
  return audio;
}
