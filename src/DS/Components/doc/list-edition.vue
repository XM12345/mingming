<template>
  <div class="doc--list-edition">
    <h3>历史版本</h3>
    <base--link
      class="item"
      :to="`/docs/${mediumId}/histories/${item.version}`"
      v-for="(item, index) in histories"
      :key="item.version"
    >
      <mark>V{{ index }}</mark>
      <div>
        <p>版本{{ item.version }}</p>
        <span>{{ item.creator_nickname || item.creator_username }}</span>
      </div>
      <time>{{ $F.time(item.creation_time) }}</time>
    </base--link>
  </div>
</template>

<script>
export default {
  props: {
    mediumId: {
      required: true,
      default: undefined
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      histories: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$Model.Doc.histories(this.mediumId).then(data => {
        this.histories = data;
      });
    }
  }
};
</script>

<style lang="scss">
.doc--list-edition {
  background-color: #fff;
  border-bottom: 10px solid #f4f6f9;
  h3 {
    padding: 15px;
    font-size: 15px;
    font-weight: normal;
    margin: 0;
  }
  .item {
    font-size: 12px;
    position: relative;
    display: block;
    padding: 15px;

    mark {
      float: left;
      width: 31px;
      height: 36px;
      background: url('./_images/edition@2x.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center center;
      vertical-align: middle;
      color: #fff;
      font-size: 13px;
      text-align: center;
      line-height: 36px;
    }
    div {
      vertical-align: middle;
      padding-left: 50px;

      p {
        margin: 0;
        padding-bottom: 5px;
        padding-right: 60px;
        color: #999;

        mark {
          background-color: #fff;
          color: inherit;
          padding-left: 30px;
        }
      }

      span {
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: #333;
      }
    }
    time {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #999;
    }
  }
}
</style>
