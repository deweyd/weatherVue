<template>
  <div class="content">
    <h1>Wonderful photos from the best authors</h1>
    <div v-if="responseData" class="box">
      <!-- Отобразить данные, если они доступны -->
      <div class="box__item" v-for="(item, index) in responseData" :key="index">
        <div class="box__img"><router-link :to="{ path: '/user', query: { itemId: item.user.username } }"><img :src="item.urls.small" alt=""></router-link></div>
        <div class="box__name">
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }"><img :src="item.user.profile_image.medium" alt=""></router-link>
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }">{{ item.user.first_name }} {{ item.user.last_name }}</router-link>
          <span>{{formatDate(item.promoted_at)}}</span>
        </div>
        <div class="box__location" v-if="item.user.location">Location: {{item.user.location}}</div>
        <div class="box__text">{{item.alt_description}}</div>
      </div>
      <!-- Замените "someProperty" на свойство вашего объекта responseData -->
    </div>
    <div v-else>
      <!-- Отобразить сообщение о загрузке, пока данные не загружены -->
      <p>Loading...</p>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="page === 1">Previous page</button>
      <span>{{ page }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Next page</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const accessKey = 'KqcwT9g9M5EVFhgUPLv45ZNHdn12enV73KwL-mIeyyM';
export default {
  name: 'AppVideo',
  data() {
    return {
      responseData: null,
      page: 1,
      perPage: 12,
      totalPages: 1
    };
  },
  methods: {
    fetchPhotos(){
      axios.get('https://api.unsplash.com/photos', {
        params: {
          client_id: accessKey,
          include: 'user',
          page: this.page,
          per_page: this.perPage
        }
      })
          .then(response => {
            this.responseData = response.data; // Сохраняем полученные данные
            console.log(this.responseData)
            this.totalPages = Math.ceil(response.headers['x-total'] / this.perPage);
          })
          .catch(error => {
            console.error('There has been a problem with your axios operation:', error);
          });
    },
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toISOString().split('T')[0];
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchPhotos();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchPhotos();
      }
    }
  },
  mounted() {
    this.fetchPhotos();
  },
};
</script>
<style lang="scss" scoped>
@import './src/components/AppVideo/AppVideo';
</style>