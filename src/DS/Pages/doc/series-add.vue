<template>
  <div class="page-series-add">
    <base--topbar :title="series_id ? '编辑串联单' : '新建串联单'">
      <p>
        <button @click="post((isCommit = true))">提交</button>
        <button @click="post((isCommit = false))">保存</button>
      </p>
    </base--topbar>
    <base--tab :navItems="navItems" :tabKey="tabKey" @switch="onSwitch" listenScroll="false">
      <div class="s-general" v-if="tabKey == 'message'">
        <p @click="select('column')">
          <label for="col"><i>*</i>栏目</label>
          <input :class="{ readonly: series_id }" type="text" v-model="series.col_name" readonly />
          <mark></mark>
        </p>
        <p @click="select('date')">
          <label for="date"><i>*</i>播出日期</label>
          <input type="text" v-model="series.play_time" readonly />
          <mark></mark>
        </p>
        <p>
          <label for="title"><i>*</i>标题</label>
          <input id="title" type="text" v-model="title" @input="listenInput" ref="title" />
        </p>
        <!-- "type":<int|字段类型：0-普通文本，1-用户列表，2-日期，3-时间，4-选项列表>, -->
        <p v-for="(custom, index) in customs" :key="custom.id" @click="select(custom.type, custom, index)">
          <label :for="custom.id">{{ custom.name }}</label>
          <template v-if="custom.type == 0">
            <input type="text" v-model="custom._value" />
          </template>
          <template v-else>
            <input type="text" v-model="custom._valueName" readonly />
            <mark></mark>
          </template>
        </p>
        <p class="type-textarea">
          <label for="summary">提要</label>
          <textarea id="summary" v-model="series.summary" ref="summary"></textarea>
        </p>
      </div>
      <div class="s-docs" v-if="tabKey == 'docs'">
        <ul>
          <doc--list-docs-item
            v-for="(item, index) in docs"
            :key="index"
            :index="index"
            :item="item"
            @check="checkDocs(item, index)"
          ></doc--list-docs-item>
        </ul>
        <footer class="s-docs-add">
          <span @click="addDoc">添加文稿</span>
        </footer>
      </div>
    </base--tab>
    <!-- 弹出弹窗 -->
    <mt-popup class="mint-popup-operate" v-model="isModalList" position="bottom">
      <ul class="s-popup-main" v-if="list.length">
        <li v-for="(item, index) in list" :key="index" @click="handleConfirm('list', item, index)">
          <label role="checkbox" :class="{ isChecked: item == value }"></label>
          <span>{{ item }}</span>
        </li>
      </ul>
      <p v-else>暂无选项可选</p>
      <button @click="isModalList = false">取消</button>
    </mt-popup>

    <!-- 弹出栏目弹窗 -->
    <mt-popup class="mint-popup-operate" v-model="isModalColumn" position="bottom">
      <doc--list-columns :tree="columns" @select="handleConfirmColumn"></doc--list-columns>
    </mt-popup>

    <!-- 弹出文稿操作弹窗 -->
    <mt-popup class="mint-popup-operate" v-model="isModalDoc" position="bottom">
      <ul class="s-docs-operate">
        <li @click="operateDoc('insert')">插入文稿</li>
        <li @click="operateDoc('up')" v-if="docIndex">上移</li>
        <li @click="operateDoc('down')" v-if="docs.length > 1 && docs.length - 1 != docIndex">下移</li>
        <li @click="operateDoc('delete')">删除</li>
      </ul>
    </mt-popup>

    <!-- 年月日时分插件 -->
    <mt-datetime-picker
      ref="picker"
      v-model="pickerDateTime"
      type="datetime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hour-format="{value} 时"
      minute-format="{value} 分"
      @confirm="handleConfirmDateTime"
    >
    </mt-datetime-picker>

    <!-- 时分秒插件 -->
    <mt-popup class="mint-popup-operate" v-model="isModalTime" position="bottom">
      <mt-picker :slots="slots" @change="handleConfirmTime"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import { DatetimePicker } from 'mint-ui'; // 日期选择
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
  data() {
    return {
      tabKey: '',
      navItems: [
        { name: '基本信息', key: 'message' },
        { name: '文稿列表', key: 'docs' }
      ],
      isModalList: false,
      isModalColumn: false,
      isModalTime: false,
      isModalDoc: false,
      columns: [],
      customs: [],
      docs: [],
      pickerDateTime: '',
      slots: [],
      list: [],
      listIndex: 0,
      docIndex: 0,
      docValue: {},
      value: null,
      series_id: null,
      series: {
        title: '',
        col_id: '',
        col_name: '',
        plan_time: '',
        play_time: '',
        summary: '',
        text: '',
        content: ''
      }
    };
  },
  created() {
    this.init();
  },
  computed: {
    title: {
      get() {
        if (this.series.title) {
          return this.series.title;
        }
        if (this.series.play_time && this.series.col_id) {
          let newDate = this.constructor.filter('ds_time')(
            new Date(this.series.play_time.replace(/\-/gi, '/')) / 1000,
            'yyyy-MM'
          );
          return `${this.series.col_name} ${newDate}`;
        }
      },
      set(newVal) {}
    }
  },
  filters: {
    filter_time(time) {
      let h = (((time / 60 / 60) | 0) + '').padStart(2, '0');
      let m = (((time / 60) % 60 | 0) + '').padStart(2, '0');
      let s = ((time % 60) + '').padStart(2, '0');
      return h + ':' + m + ':' + s;
    }
  },
  methods: {
    onSwitch(key) {
      this.tabKey = key;
    },
    init() {
      let { series_id } = this.$route.params;
      this.series_id = series_id;
      this.getCustom();
      this.tabKey = this.navItems[0].key || '';
      this.pickerDateTime = this.constructor.filter('ds_time')(new Date() / 1000, 'yyyy-MM-dd hh:mm'); // init pickerValue
      let valuesHour = Array.from(Array(24), (v, k) => k.toString().padStart(2, '0'));
      let valuesMin = Array.from(Array(60), (v, k) => k.toString().padStart(2, '0'));
      let valuesSec = Array.from(Array(60), (v, k) => k.toString().padStart(2, '0'));
      let indexHour = 0;
      let indexMin = 0;
      let indexSec = 0;
      this.slots = [
        { values: valuesHour, defaultIndex: indexHour, className: 'slot1', flex: 1, textAlign: 'center' },
        { values: valuesMin, defaultIndex: indexMin, className: 'slot2', flex: 1, textAlign: 'center' },
        { values: valuesSec, defaultIndex: indexSec, className: 'slot3', flex: 1, textAlign: 'center' }
      ];
      this.getColumns();
      this.ensureEmit();
    },
    ensureEmit() {
      let getUserIds = checkData => {
        let userIds = checkData.map(item => item.id);
        let userNames = checkData.map(item => item.nickname || item.username);
        this.customs[this.listIndex]._value = userIds;
        this.customs[this.listIndex]._valueName = userNames;
      };
      let getDocs = checkData => {
        if (checkData && checkData.length) {
          this.docs.push(...checkData);
        }
      };

      let getInsertDocs = checkData => {
        if (checkData && checkData.length) {
          this.docs.splice(this.docIndex, 0, ...checkData);
        }
      };

      this.$root.$on('doc-add-user', getUserIds);
      this.$root.$on('doc-add-doc', getDocs);
      this.$root.$on('doc-insert-doc', getInsertDocs);
      this.$once('hook:beforeDestroy', () => {
        this.$root.$off('doc-add-user', getUserIds);
        this.$root.$off('doc-add-doc', getDocs);
        this.$root.$on('doc-insert-doc', getInsertDocs);
      });
    },
    async getCustom() {
      let data = {};
      if (this.series_id) {
        data = await this.$Model.Doc.series(this.series_id);
        data.play_time = this.constructor.filter('ds_time')(data.play_time, 'yyyy-MM-dd hh:mm');
        this.series = data;
        this.docs = data.items.map(item => {
          item.isChecked = true;
          return item;
        });
      }
      this.$Model.Doc.seriesCustom().then(({ list, select }) => {
        this.customs = (list || []).map(item => {
          let _value = []; // 选中的值
          let _valueName = []; // 选中值的名
          if (this.series_id) {
            let field = data.fields.find(current => current.id == item.id) || {};
            switch (field.type) {
              case 1:
                _value = field.items.map(item => item.id);
                _valueName = field.items.map(item => item.name).toString();
                break;
              case 2:
                _value = field.content;
                _valueName = this.constructor.filter('ds_time')(parseInt(field.content), 'yyyy-MM-dd hh:mm');
                break;
              case 3:
                _value = field.content;
                _valueName = this.constructor.filter('filter_time')(field.content || 0);
                break;
              default:
                _value = field.content;
                _valueName = field.content;
                break;
            }
          }
          return { ...item, _value, _valueName };
        });
      });
    },
    getColumns() {
      this.$Model.Doc.columns('series.add').then(data => {
        this.columns = data.filter(item => !item.parent_id);
      });
    },
    select(type, custom, index) {
      switch (type) {
        case 'column':
          // 栏目
          if (!this.series_id) {
            this.isModalColumn = true;
          } else {
            this.$toast('栏目不可再修改');
          }
          break;
        case 'date':
          // 播出日期
          this.listIndex = -1;
          this.$refs.picker.open();
          break;
        case 0:
          // 普通文本
          break;
        case 1:
          // 用户列表
          this.listIndex = index;
          if (custom._value.length) {
            this.$router.push(`/docs/user/add/${custom.name}/${custom._value}`);
          } else {
            this.$router.push(`/docs/user/add/${custom.name}`);
          }
          break;
        case 2:
          // 日期
          this.listIndex = index;
          this.$refs.picker.open();
          break;
        case 3:
          // 时间
          this.listIndex = index;
          this.isModalTime = true;
          break;
        case 4:
          // 选项列表
          this.list = custom.contents;
          this.listIndex = index;
          this.isModalList = true;
        default:
          break;
      }
    },
    handleConfirmTime(picker, values) {
      let new_values = values.map(Number);
      let valueName = values.toString().replace(/,/gi, ':');
      let value = new_values[0] * 60 * 60 + new_values[1] * 60 + new_values[2];
      if (this.customs.length) {
        this.customs[this.listIndex]._value = value;
        this.customs[this.listIndex]._valueName = valueName;
      }
    },
    handleConfirmColumn(item, index) {
      this.series.col_id = item.id;
      this.series.col_name = item.name;
      this.isModalColumn = false;
    },
    handleConfirm(type, item, index) {
      switch (type) {
        case 'list':
          this.value = item;
          this.customs[this.listIndex]._value = item;
          this.customs[this.listIndex]._valueName = item;
          this.isModalList = false;
          break;
        default:
          break;
      }
    },
    handleConfirmDateTime(time) {
      let date = this.constructor.filter('ds_time')(new Date(time) / 1000, 'yyyy-MM-dd hh:mm');
      if (this.listIndex == -1) {
        this.series.play_time = date;
      } else {
        this.customs[this.listIndex]._value = new Date(time) / 1000;
        this.customs[this.listIndex]._valueName = date;
      }
    },
    listenInput(event) {
      let { value } = event.target;
      this.series.title = value;
    },
    checkDocs(item, index) {
      this.docIndex = index;
      this.docValue = item;
      this.isModalDoc = true;
    },
    addDoc() {
      let docIds = this.docs.map(item => item.id);
      if (docIds.length) {
        this.$router.push(`/docs/doc-add/${docIds}`);
      } else {
        this.$router.push(`/docs/doc-add`);
      }
    },
    operateDoc(type) {
      let { docIndex, docValue } = this;
      switch (type) {
        case 'insert':
          // 插在该文稿之前（一个或多个）
          this.$router.push(`/docs/doc-add?type=insert`);
          break;
        case 'up':
          this.docs.splice(docIndex - 1, 0, docValue);
          this.docs.splice(docIndex + 1, 1);
          break;
        case 'down':
          this.docs.splice(docIndex + 2, 0, docValue);
          this.docs.splice(docIndex, 1);
          break;
        case 'delete':
          // 不是真正意义上的删除
          this.docs.splice(docIndex, 1);
          break;
        default:
          break;
      }
      this.isModalDoc = false;
    },
    async post(isCommit) {
      let title = (this.$refs.title && this.$refs.title.value) || this.title;
      if (!this.series.col_id) {
        this.$toast('请选择栏目');
        return false;
      }
      if (!this.series.play_time) {
        this.$toast('请选择播出时间');
        return false;
      }
      if (!title.trim()) {
        this.$refs.title.focus();
        this.$toast('请输入标题');
        return false;
      }
      let play_time = new Date(this.series.play_time.replace(/\-/gi, '/')) / 1000;
      let fields = this.customs.map(item => {
        let content = item.type == 1 ? '' : String(item._value);
        let items = item.type == 1 ? item._value || [] : [];
        return { id: item.id, items, content };
      });
      let items = this.docs.map(item => {
        item.type = 1; //文稿
        item.playId = 0; //口播类型
        return { id: item.id, type: 1, play_type_id: 0 };
      });
      let data = {
        title: this.title,
        col_id: this.series.col_id,
        plan_time: this.series.plan_time,
        play_time,
        summary: this.series.summary,
        text: this.series.text,
        content: this.series.content,
        fields,
        items,
        is_commit: isCommit
      };
      let existData = {
        col_id: this.series.col_id,
        play_time: play_time
      };

      let model;
      if (this.series_id) {
        model = this.$Model.Doc.seriesModify(this.series_id, data);
      } else {
        let isExist = await this.$Model.Doc.exist(existData);
        if (isExist) {
          this.$toast('已存在同期串联单');
          return false;
        }
        model = this.$Model.Doc.seriesAdd(data);
      }

      model.then(series_id => {
        this.$toast(isCommit ? '提交成功' : '保存成功');
        if (isCommit) {
          this.$navigation.cleanRoutes();
          this.$router.back();
        }
      });
    }
  }
};
</script>

<style lang="scss">
.page-series-add {
  height: 100%;
  .h-topbar header {
    p {
      position: absolute;
      right: 13px;
      top: 50%;
      margin: 0;
      transform: translateY(-50%);
      button {
        margin: 0 5px;
        padding: 2px 6px;
        outline: none;
        color: #1990ff;
        border: 1px solid #1990ff;
        background: #fff;
      }
    }
  }
  .s-general {
    margin: 0 13px;
    p {
      margin: 0;
      padding: 10px 0;
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #343434;
      border-bottom: 1px solid #f3f6f9;
      label {
        i {
          color: #ed4040;
          font-style: normal;
        }
      }
      input {
        flex: 1;
        height: 25px;
        border: none;
        margin: 0 10px;
        text-align: right;
        color: inherit;
        &.readonly {
          color: #999;
        }
      }
      mark {
        width: 15px;
        height: 15px;
        background-color: transparent;
        background-image: url('./_images/right@2x.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
      &.type-textarea {
        display: block;
        label {
          display: block;
        }
        textarea {
          width: 100%;
          resize: unset;
          height: 200px;
          box-sizing: border-box;
          font-size: 15px;
          color: #343434;
          padding: 10px;
          background: #f4f6f9;
          border: none;
          margin-top: 10px;
          outline: none;
        }
      }
    }
  }
  .s-docs {
    padding-bottom: 70px;

    &-add {
      text-align: center;
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 10px 0;
      border-top: 1px solid #eee;
      z-index: 1;
      background: #fff;
      span {
        display: inline-block;
        font-size: 12px;
        color: #343434;
        padding-top: 32px;
        background-image: url('./_images/add@2x.png');
        background-repeat: no-repeat;
        background-size: 30px 30px;
        background-position: center top;
        background-color: transparent;
        border: none;
      }
    }
  }
  .picker-slot {
    font-size: 15px;
    .picker-item {
      padding: 0 4px;
    }
  }
  .mint-popup-operate {
    width: 100%;
    max-height: 50vh;
    overflow-y: auto;
    .s-popup-main {
      li {
        position: relative;
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        background-color: #fff;
        label {
          display: inline-block;
          vertical-align: middle;
          border-radius: 50%;
          border: 1px solid #dedede;
          padding: 5px;
          margin: 0 5px;
          &.isChecked {
            background: url('../weixin/_images/checked@2x.png');
            background-repeat: no-repeat;
            background-size: 100%;
            border: none;
            padding: 6px;
          }
        }
        span {
          font-size: 15px;
          color: #343434;
          vertical-align: middle;
          padding-left: 10px;
        }
      }
    }
    & > p {
      font-size: 15px;
      color: #767676;
      text-align: center;
    }
    & > button {
      width: 100%;
      font-size: 15px;
      color: #767676;
      padding: 12px;
      border: none;
      border-top: 8px solid #f4f6f9;
      background: none;
    }
    .s-docs-operate {
      li {
        border-bottom: 1px solid #f1f1f1;
        font-size: 15px;
        color: #343434;
        padding: 13px;
      }
    }
  }
}
</style>