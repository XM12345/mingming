<template>
  <div class="page-user-login">
    <h-topbar title="用户登录"></h-topbar>
    <div class="page-user-login-main">
      <div>
        <label for="username">账号</label>
        <input type="text" id="username" v-model="username" />
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" />
        <a @click="submit">登录</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    submit() {
      let { username, password } = this;
      this.$Model.User.login(username, password).then(data => {
        history.back();
      });
    }
  }
};
</script>

<style lang="scss">
.page-user-login {
  &-main {
    font-size: 14px;
    padding: 20px 10px;

    a {
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      margin: 50px 0 0;
      padding: 10px;
      border: none;
      color: #fff;
      font-size: 15px;
      background-color: #ed4040;
    }
    div {
      label {
        display: block;
        color: #a8b0af;
      }
      input {
        box-sizing: border-box;
        margin: 10px 0;
        width: 100%;
        height: 38px;
        border: 1px solid #eaeaea;
        padding: 0 10px;
      }
    }
  }
}
</style>
