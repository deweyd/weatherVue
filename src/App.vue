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
  color: #2c3e50;
  margin-top: 60px;
}
</style>
