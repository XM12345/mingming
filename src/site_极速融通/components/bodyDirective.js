let emotion = require('../../libs/emotion.json');

function parseBody(body, bodyComponents, type) {
  let { pictures = [], videos = [], audios = [] } = bodyComponents;
  if (type == 'news') {
    /* type：1-图片，2-视频，3-音频 */
    pictures = bodyComponents.filter(item => item.type == 1);
    videos = bodyComponents.filter(item => item.type == 2);
    audios = bodyComponents.filter(item => item.type == 3);
  }
  let replacePicture = (result, id, width, height) => {
    let picture;
    picture = pictures.find(item => item.id == id);
    if (picture) {
      if (width == 0 && height == 0) {
        return `<img src="${picture.url}" alt="" />`;
      } else {
        return `<img src="${picture.url}" width="${width}" alt="" />`;
      }
    } else {
      return result;
    }
  };

  let replaceVideo = (result, id, width, height) => {
    let video;
    video = videos.find(item => item.id == id);
    let { versions } = video;
    if (versions.length) {
      return `<video controls="controls" src="${versions[0].url}" poster="${video.cover_url}"></video>`;
    } else if (type == 'news') {
      return `<video controls="controls" src="${video.url}"></video>`;
    } else {
      return result;
    }
  };

  let replaceAudio = (result, id, width, height) => {
    let audio;
    audio = audios.find(item => item.id == id);
    let { versions } = audio;
    if (versions.length) {
      return `<audio controlsList="nodownload" controls="controls" src="${versions[0].url}"></audio>`;
    } else if (type == 'news') {
      return `<audio controlsList="nodownload" controls="controls" src="${audio.url}"></audio>`;
    } else {
      return result;
    }
  };

  let replaceEmotion = (result, value) => {
    let finalEmotion = emotion.find(item => item.value == result);
    if (finalEmotion) {
      return `<img class="emotion" src="${finalEmotion.url ||
        finalEmotion.icon}" alt="${value}" width="20" style="padding: 0 2px" />`;
    } else {
      return result;
    }
  };
  //汉字: [\u4e00-\u9fa5]+
  return body
    .replace(/<\!--PICTURE#(\d*),(\d*),(\d*)-->/gi, replacePicture)
    .replace(/<\!--VIDEO#(\d*),(\d*),(\d*)-->/gi, replaceVideo)
    .replace(/<\!--AUDIO#(\d*),(\d*),(\d*)-->/gi, replaceAudio)
    .replace(/\[([\u4e00-\u9fa5a-zA-Z]+)\]/gi, replaceEmotion);
}

export default function dsBodyDirective(el, binding, vnode, oldVnode) {
  let vm = vnode.context;
  let [body, bodyComponents, type] = binding.value;
  let template;
  let bodyNode;
  if (typeof body !== 'string') return;
  if (bodyComponents == undefined) {
    template = body;
  } else {
    template = parseBody(body, bodyComponents, type);
  }
  try {
    bodyNode = document.createRange().createContextualFragment(template);
  } catch (error) {
    bodyNode = document.createElement('div');
    bodyNode.innerHTML = template;
  }
  el.appendChild(bodyNode);
}
