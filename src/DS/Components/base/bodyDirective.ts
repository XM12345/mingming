import type { DirectiveFunction } from 'vue';

let emotion = require('../../../libs/emotion.json');

function parseBody(body: string, bodyComponents: any) {
  let { pictures = [], videos = [], audios = [], files = [], picturesets = [] } = bodyComponents;
  let replacePicture = (result: string, id: string, width: string, height: string) => {
    let picture;
    let data = '';
    picture = (pictures || []).find((item: any) => item.id == id);
    if (picture) {
      if (Number(width) == 0 && Number(height) == 0) {
        data = `<img src="${picture.url}" alt="" />`;
      } else {
        data = `<img src="${picture.url}?w=${width}&h=${height}&s=2" width="${width}" alt="" />`;
      }
    } else {
      data = result;
    }
    return data;
  };

  let replaceImage = (result: string, id: string) => {
    let picture = (pictures || []).find((item: any) => item.id == id) || {};
    return picture.url;
  };

  let replacePictureSet = (result: string, id: string) => {
    let pictureset = (picturesets || []).find((item: any) => item.id == id);
    if (pictureset) {
      let { pictures = [] } = pictureset;
      pictures = pictures.map(({ width, height, url }: any) => {
        let style = '';
        if (width && height) {
          style = `ds-body-img-sized`;
          url = url + `?w=${width}&h=${height}&s=2`;
        }
        return `<img src="${url}" ${style} ds-body-img alt />`;
      });
      return pictures;
    } else {
      return result;
    }
  };

  let replaceVideo = (result: string, id: string, width: string, height: string) => {
    let video;
    let data = '';
    video = (videos || []).find((item: any) => item.id == id);
    if (video) {
      let { versions } = video;
      let poster = video.cover_url || video.coverUrl;
      if (versions.length) {
        let mp4Reg = /(.mp4)$/;
        let versionMp4 = versions.find(({ url }: any) => mp4Reg.test(url));
        let version = versionMp4 || versions[0];
        data = `<video controls="controls" src="${version.url}" poster="${poster}"></video>`;
      } else if (video.url) {
        data = `<video controls="controls" src="${video.url}" poster="${poster}"></video>`;
      } else {
        data = result;
      }
    }
    return data;
  };

  let replaceAudio = (result: string, id: string, width: string, height: string) => {
    let audio;
    let data = '';
    audio = (audios || []).find((item: any) => item.id == id);
    if (audio) {
      let { versions } = audio;
      if (versions.length) {
        data = `<audio controlsList="nodownload" controls="controls" src="${versions[0].url}"></audio>`;
      } else if (audio.url) {
        data = `<audio controlsList="nodownload" controls="controls" src="${audio.url}"></audio>`;
      } else {
        data = result;
      }
    }
    return data;
  };

  let replaceFile = (result: string, id: string, position: string) => {
    let file;
    let data = '';
    file = (files || []).find((item: any) => item.id == id);
    if (file) {
      let { url, title, name } = file;
      data = `<a href="${url}" download="${title}" target="_blank" style="color:#9dabc2;">${title || name}</a>`;
    }
    return data;
  };

  let replaceEmotion = (result: string, value: string) => {
    let finalEmotion = emotion.find((item: any) => item.value == result);
    if (finalEmotion) {
      return `<img class="emotion" src="${
        finalEmotion.url || finalEmotion.icon
      }" alt="${value}" width="20" style="padding: 0 2px" />`;
    } else {
      return result;
    }
  };
  //汉字: [\u4e00-\u9fa5]+
  return body
    .replace(/<\!--PICTURE#([a-zA-Z0-9]*),(\d*),(\d*)-->/gi, replacePicture)
    .replace(/<\!--BG_IMAGE#([a-zA-Z0-9]*)-->/gi, replaceImage)
    .replace(/<\!--PICTURESET#(\d*)-->/gi, replacePictureSet)
    .replace(/<\!--VIDEO#([a-zA-Z0-9]*),(\d*),(\d*)-->/gi, replaceVideo)
    .replace(/<\!--AUDIO#([a-zA-Z0-9]*),(\d*),(\d*)-->/gi, replaceAudio)
    .replace(/<\!--FILE#([a-zA-Z0-9]*),(ending|.*?)-->/gi, replaceFile)
    .replace(/\[([\u4e00-\u9fa5a-zA-Z]+)\]/gi, replaceEmotion);
}

let dsBodyDirective: DirectiveFunction = function dsBodyDirective(el, binding, vnode, oldVnode) {
  let vm = vnode.context;
  let [body, bodyComponents] = binding.value;
  let template;
  let bodyNode;
  if (typeof body !== 'string') return;
  if (bodyComponents == undefined) {
    template = body;
  } else {
    template = parseBody(body, bodyComponents);
  }
  try {
    bodyNode = document.createRange().createContextualFragment(template);
  } catch (error) {
    bodyNode = document.createElement('div');
    bodyNode.innerHTML = template;
  }
  el.appendChild(bodyNode);
};

export default dsBodyDirective;
