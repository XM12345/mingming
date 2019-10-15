<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.isKeepLive" />
    </keep-alive>
    <router-view v-if="!$route.meta.isKeepLive" />
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
  height: 100vh;
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
