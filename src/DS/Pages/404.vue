<template>
  <div class="page-404">
    <div class="page-404-main">
      <img src="../Components/base/_images/404.png" />
      <p>哎呀，这个页面一边凉快去了</p>
    </div>
  </div>
</template>

<style lang="scss">
.page-404 {
  &-main {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    & > img {
      background-color: #fff;
      max-width: 50%;
    }
    & > p {
      text-align: center;
      font-size: 17px;
      color: #666;
    }
  }
}
</style>
