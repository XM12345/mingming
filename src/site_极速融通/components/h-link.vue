<template>
  <a :href="href" @click.prevent.stop="goto(to)">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    to: {
      required: true,
      type: Object
    }
  },
  computed: {
    href() {
      let { id, mobject_id } = this.to;
      let medium_id = id || mobject_id;
      let href = `/media/${medium_id}`;
      /* let { app: appLink = '' } = this.$router.options.routes.find(route => route.path == '/media/:medium_id').meta;
      let params = { medium_id };
      if (this.$RunTime.isApp) {
        let { schemeIOS, schemeAndroid } = window.site_.app || {};
        let appScheme = { ios: schemeIOS, android: schemeAndroid }[this.$RunTime.app];
        if (appScheme && appLink) {
          appLink = appLink.replace(/{(.+?)}/gi, (a, k) => {
            return params[k] || '';
          });
          href = `${appScheme}://${appLink}`;
        }
      } */
      return href;
    }
  },
  methods: {
    goto({ id, mobject_id }) {
      /* if (this.href.match(/^([^:]+:)?\/\//)) {
        location.href = this.href;
        return;
      } else {
        this.$router.push(this.href);
      } */
      // 回调原生跳转素材详情
      this.$toMedia(id || mobject_id);
    }
  }
};
</script>
