<template>
  <div :class="[B()]">
    <div v-if="activeKey === 'media'" :class="[B('__item')]">
      <h3 :class="[B('__item_title')]" style="padding-left: 10px">
        我的素材库
        <label :class="[B('__item_colspan')]"></label>
      </h3>
      <div v-for="(item, index) in contents.messages" :key="item.id" :class="[B('__item_content')]">
        <p :class="[B('__item_type')]">
          <span>{{ item.name }}</span>
          <label :class="[B('__item_select'), item.state === 1 && 'isChecked']" @click="select(item, index)"></label>
        </p>
      </div>
    </div>
    <div v-else :class="[B('__item')]">
      <div v-for="item in contents" :key="item.id" :class="[B('__item_content')]">
        <h3 :class="[B('__item_title')]">
          {{ item.name }}
          <label :class="[B('__item_colspan')]"></label>
        </h3>
        <p v-for="(i, index) in item.types" :key="index" :class="[B('__item_type')]">
          <span>{{ i.name }}</span>
          <label :class="[B('__item_select'), i.is_check === true && 'isChecked']" @click="select(i)"></label>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'user--list-task',
  props: {
    activeKey: { type: String, default: '' }
  },
  data() {
    return {
      contents: [] as any[]
    };
  },
  watch: {
    activeKey() {
      this.init();
    }
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      let Model;
      let { activeKey } = this;
      switch (activeKey) {
        case 'doc':
        case 'series':
          this.$Model.Doc.message(activeKey).then(data => {
            this.contents = data;
          });
          break;
        case 'subject':
        case 'task':
          this.$Model.Subject.message(activeKey).then(data => {
            this.contents = data;
          });
          break;
        case 'media':
          this.$Model.Media.configs().then(data => {
            this.contents = data;
          });
          break;
        default:
          break;
      }
    },
    select(i: any, index: number) {
      let { activeKey } = this;
      if (activeKey == 'media') {
        if (i.state == 0) {
          i.state = 1;
        } else {
          i.state = 0;
        }
        this.$Model.Media.putConfigs(this.contents).then(() => {
          this.init();
        });
      } else {
        i.is_check = !i.is_check;
        let data = this.contents.map(item => item.types).flat() || [];
        let data_ids = data.filter(item => item.is_check == true).map(v => v.id);
        if (['doc', 'series'].includes(activeKey)) {
          this.$Model.Doc.postMessage(activeKey, data_ids).then(() => {});
        } else if (['subject', 'task'].includes(activeKey)) {
          this.$Model.Subject.postMessage(activeKey, data_ids).then(() => {});
        }
      }
    }
  }
});
</script>

<style lang="scss">
.user--list-task {
  padding: 0 10px;
  &__item {
    display: block;

    &_title {
      position: relative;
      color: #333;
      font-size: 15px;
      font-weight: normal;
    }
    &_colspan {
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

    &_content {
      padding-left: 10px;
    }

    &_type {
      position: relative;
      min-height: 17px;
      font-size: 15px;
      color: #333;
    }
    &_select {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      margin: 0 10px;
      padding: 5px;
      border-radius: 50%;
      border: 1px solid #999;
      &.isChecked {
        background: url('./_images/checked@2x.png');
        background-repeat: no-repeat;
        background-size: 100%;
        border: none;
        padding: 6px;
      }
    }
  }
}
</style>
