<template>
  <header class="header">
    <div class="content">
      <a href="/" class="logo">{{ title }}</a>
    </div>
  </header>
</template>
<script>

export default {
  name: 'AppHeader',
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
@import './src/components/AppHeader/AppHeader';
</style>