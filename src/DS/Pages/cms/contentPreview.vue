<script>
export default {
  extends: require('./content').default,
  methods: {
    getContent() {
      return this.$Model.Cms(this.baview_api_url).contentPreview(this.content_id);
    }
  }
};
</script>
