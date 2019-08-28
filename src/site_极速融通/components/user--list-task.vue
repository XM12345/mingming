<template>
  <div class="user--list-task">
    <div class="s-item" v-if="activeKey == 'media'">
      <h3 style="padding-left: 10px;">
        我的素材库
        <label class="colspan"></label>
      </h3>
      <div v-for="(item,index) in contents" :key="item.id">
        <p>
          <span>{{item.name}}</span>
          <label class="select" :class="{isChecked:item.state == 1}" @click="select(item,index)"></label>
        </p>
      </div>
    </div>
    <div class="s-item" v-else>
      <div v-for="item in contents" :key="item.id">
        <h3>
          {{item.name}}
          <label class="colspan"></label>
        </h3>
        <p v-for="i in item.types">
          <span>{{i.name}}</span>
          <label class="select" :class="{isChecked:i.is_check == true}" @click="select(i)"></label>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeKey: {
      default: ''
    }
  },
  data() {
    return {
      contents: []
    };
  },
  created() {
    this.init();
  },
  watch: {
    activeKey() {
      this.init();
    }
  },
  methods: {
    init() {
      let Model;
      let { activeKey } = this;
      if (activeKey == 'doc') {
        this.$Model.Doc.message('doc').then(data => {
          this.contents = data;
        });
      } else if (activeKey == 'subject') {
        this.$Model.Subject.message('subject').then(data => {
          this.contents = data;
        });
      } else if (activeKey == 'media') {
        this.$Model.Media.configs().then(data => {
          this.contents = data;
        });
      }
    },
    select(i, index) {
      let { activeKey } = this;
      let data = [i.id];
      if (activeKey == 'doc') {
        this.$Model.Doc.postMessage('doc', data).then(() => {
          i.is_check = !i.is_check;
        });
      } else if (activeKey == 'subject') {
        this.$Model.Subject.postMessage('subject', data).then(() => {
          i.is_check = !i.is_check;
        });
      } else if (activeKey == 'media') {
        if (i.state == 0) {
          i.state = 1;
        } else {
          i.state = 0;
        }
        this.$Model.Media.putConfigs(this.contents).then(() => {
          this.init();
        });
      }
    }
  }
};
</script>

<style lang="scss">
.user--list-task {
  padding: 0 10px;
  .s-item {
    display: block;

    h3 {
      position: relative;
      color: #333;
      font-size: 15px;
      font-weight: normal;
      label {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: inline-block;
        background: transparent;
        border: 1px solid #999;
        border-top: none;
        border-left: none;
        height: 9px;
        width: 9px;
        margin: 0 18px;
        margin-top: -4px;
        transform: rotate(45deg) translate(0, -5px);
        transform-origin: bottom;
        transition: all 0.5s;
        &.active {
          transform: rotate(-135deg) translate(-2px, 8px);
        }
      }
    }
    div {
      padding-left: 10px;

      p {
        position: relative;
        min-height: 17px;
        font-size: 15px;
        color: #333;
        label {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          &.isChecked {
            background: url('../images/detail/checked@2x.png');
            background-repeat: no-repeat;
            background-size: 100%;
            border: none !important;
            padding: 6px !important;
          }
          &.select {
            margin: 0 10px;
            padding: 5px;
            border-radius: 50%;
            border: 1px solid #999;
          }
        }
      }
    }
  }
}
</style>