let emotion = require('../../libs/emotion.json');

function parseBody(body, bodyComponents, type) {
  /* type：1-图片，2-视频，3-音频 */
  let pictures = bodyComponents.filter(item => item.type == 1);
  let videos = bodyComponents.filter(item => item.type == 2);
  let audios = bodyComponents.filter(item => item.type == 3);

  let replacePicture = (result, id, width, height) => {
    let picture;
    if (type == 'mobjects') {
      picture = pictures.find(item => item.mobject_id == id);
      if (picture) {
        if (width == 0 && height == 0) {
          return `<img src="${picture.mobject_url || picture.cover_url}" alt="" />`;
        } else {
          return `<img src="${picture.mobject_url || picture.cover_url}" width="${width}" max-height="${height}" alt="" />`;
        }
      } else {
        return result;
      }
    } else {
      picture = pictures.find(item => item.id == id);
      if (picture) {
        if (width == 0 && height == 0) {
          return `<img src="${picture.url || picture.thumbnail_url}" alt="" />`;
        } else {
          return `<img src="${picture.url || picture.thumbnail_url}" width="${width}" max-height="${height}" alt="" />`;
        }
      } else {
        return result;
      }
    }
  };

  let replaceVideo = (result, id, width, height) => {
    let video;
    if (type == 'mobjects') {
      video = videos.find(item => item.mobject_id == id);
      if (video) {
        return `<video controls="controls" src="${video.mobject_url}" poster="${video.cover_url}"></video>`;
      } else {
        return result;
      }
    } else {
      video = videos.find(item => item.id == id);
      if (video) {
        return `<video controls="controls" src="${video.url}" poster="${video.thumbnail_url}"></video>`;
      } else {
        return result;
      }
    }
  };

  let replaceAudio = (result, id, width, height) => {
    let audio;
    if (type == 'mobjects') {
      audio = audios.find(item => item.mobject_id == id);
      if (audio) {
        return `<audio controlsList="nodownload" controls="controls" src="${audio.mobject_url}"></audio>`;
      } else {
        return result;
      }
    } else {
      audio = audios.find(item => item.id == id);
      if (audio) {
        return `<audio controlsList="nodownload" controls="controls" src="${audio.url}"></audio>`;
      } else {
        return result;
      }
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
