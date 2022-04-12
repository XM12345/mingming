<template>
  <div id="app">
    <!-- 使用vue-navigation插件缓存页面 -->
    <navigation>
      <h-page>
        <router-view class="app-view" />
      </h-page>
    </navigation>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}
/* 解决ios滚动不流畅 */
* {
  -webkit-overflow-scrolling: touch;
}

#app {
  height: 100%;
  background-color: #fff;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .app-view {
    min-height: 100%;
  }

  a {
    text-decoration: none;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  img {
    object-fit: cover;
  }
  input,
  button,
  select {
    outline: none;
  }
}
</style>
