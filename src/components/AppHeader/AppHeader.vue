<template>
  <header class="header">
    <a href="/" class="logo">{{ title }}</a>
<!--    <nav>-->
<!--      <ul>-->
<!--        <li><router-link to="/">Photo</router-link></li>-->
<!--        <li><router-link to="/video">Video</router-link></li>-->
<!--        <li><router-link to="/">Musik</router-link></li>-->
<!--      </ul>-->
<!--    </nav>-->
    <div class="example">
      <input placeholder="Enter your request of photos" class="" v-model="searchQuery" @input="searchImages">
      <div class="button-search">
        <img src="https://firebasestorage.googleapis.com/v0/b/my-project-56788.appspot.com/o/free-icon-search-711319.png?alt=media&amp;token=5de9c040-000d-4599-b934-5dc1f6aad52e" alt="SearchPage">
      </div>
    </div>
    <!-- Добавьте другие элементы вашего хедера -->
  </header>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
export default {
  name: 'AppHeader',
  data() {
    return {
      title: 'FusionPhotoBox',
      searchQuery: ''
    };
  },
  methods: {
    searchImages() {
      const accessKey = 'KqcwT9g9M5EVFhgUPLv45ZNHdn12enV73KwL-mIeyyM';
      const query = this.searchQuery.trim();
      console.log(query)
      if (query !== '') {
        axios.get('https://api.unsplash.com/search/photos', {
          params: { query, client_id: accessKey }
        })
            .then(response => {
              // Обработка полученных результатов поиска
              console.log(response.data.results);
              this.setSearchQuery(response.data.results);
              window.addEventListener('popstate', function() {
                window.location.href = '/';
              });
            })
            .catch(error => {
              // Обработка ошибки
              console.error('Ошибка при выполнении поиска:', error);
            });
      } else {
        window.location.href = '/';

        console.log('Введите запрос');
      }
    },
    ...mapActions(['setSearchQuery'])
  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppHeader/AppHeader';
</style>