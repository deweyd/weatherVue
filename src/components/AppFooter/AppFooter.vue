<template>
  <footer class="footer">
    <a href="/" class="logo">{{ title }}</a>
    <div>2023 UserBox</div>
  </footer>
</template>

<script>

export default {
  name: 'AppFooter',
  data() {
    return {
      title: 'UserBox',
    };
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppFooter/AppFooter';
</style>