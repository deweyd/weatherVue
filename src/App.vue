<template>
  <app-header></app-header>
  <router-view/>
  <app-footer></app-footer>
</template>

<script>
import AppHeader from './components/AppHeader/AppHeader';
import AppFooter from "@/components/AppFooter/AppFooter";

export default {
  name: 'App',
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
  background: radial-gradient(1009.23% 696.22% at 47.6% 26.27%,#181A19 0%,#24282B 68.62%);
}
body{
  padding: 0;
  background: radial-gradient(1009.23% 696.22% at 47.6% 26.27%,#181A19 0%,#24282B 68.62%);
}
</style>
