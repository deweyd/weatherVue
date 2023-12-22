<template>
  <footer class="footer">
    <div class="content">
      <a href="/" class="logo">{{ title }}</a>
      <div>2023 {{title}}</div>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'AppFooter',
  data() {
    return {
      title: 'OpenWeathermap',
    };
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppFooter/AppFooter';
</style>