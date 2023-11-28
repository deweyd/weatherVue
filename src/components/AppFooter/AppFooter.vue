<template>
  <footer class="footer">
    <a href="/" class="logo">{{ title }}</a>
    <div>2023 FusionPhotoBox</div>
  </footer>
</template>

<script>

export default {
  name: 'AppFooter',
  data() {
    return {
      title: 'FusionPhotoBox',
    };
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppFooter/AppFooter';
</style>