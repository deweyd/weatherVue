<template>
  <div class="content">
    <h1 v-if="Query !== ''">Search result</h1>
    <div class="user" v-if="responseData" :class="{ 'active': Query !== '' }">
      <div class="user__img"><img :src="responseData[0].user.profile_image.large" alt=""></div>
      <div class="user__name">{{ responseData[0].user.first_name }} {{ responseData[0].user.last_name }}</div>
      <div class="user__location" v-if="responseData[0].user.location">Location: {{responseData[0].user.location}}</div>
      <div class="box__img" v-if="url"><img :src="url" alt=""></div>
      <div class="user__location" v-if="responseData[0].user.bio"> {{responseData[0].user.bio}}</div>
      <a :href="responseData[0].user.portfolio_url" class="user__portfolio" v-if="responseData[0].user.portfolio_url">Portfolio: {{responseData[0].user.portfolio_url}}</a>
      <div class="user__all">All photos ({{responseData[0].user.total_photos}} pieces) {{ responseData[0].user.first_name }} {{ responseData[0].user.last_name }}</div>
    </div>
    <div v-if="responseData" class="box">
      <!-- Отобразить данные, если они доступны -->
      <div class="box__item" v-for="(item, index) in responseData" :key="index">
        <div></div>
        <router-link v-if="Query !== ''" :to="{ path: '/likes', query: { itemId: item.user.username, urls: item.urls.regular,  profile: item.user.profile_image.large, location: item.user.location} }" class="box__img"><img :src="item.urls.small" alt=""></router-link>
        <router-link v-if="Query === ''" :to="{ path: '/user', query: { itemId: item.user.username, urls: item.urls.regular } }" class="box__img"><img :src="item.urls.small" alt=""></router-link>
        <div class="box__name" v-if="Query === ''">
          <img :src="item.user.profile_image.medium" alt="">
          {{ item.user.first_name }} {{ item.user.last_name }}
          <span>{{formatDate(item.promoted_at)}}</span>
          <div :to="{ path: '/likes', query: { itemId: item.user.username } }" class="box__like"><img src="https://firebasestorage.googleapis.com/v0/b/my-project-56788.appspot.com/o/like_favorite_heart_3524.png?alt=media&token=b4a85c35-3a75-497b-956a-52f90b3a2cb6" alt="">{{item.likes}}</div>
        </div>
        <div class="box__name" v-if="Query !== ''">
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }" @click="delSearch"><img :src="item.user.profile_image.medium" alt=""></router-link>
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }" @click="delSearch">{{ item.user.first_name }} {{ item.user.last_name }}</router-link>
          <span>{{formatDate(item.promoted_at)}}</span>
          <div :to="{ path: '/likes', query: { itemId: item.user.username } }" class="box__like"><img src="https://firebasestorage.googleapis.com/v0/b/my-project-56788.appspot.com/o/like_favorite_heart_3524.png?alt=media&token=b4a85c35-3a75-497b-956a-52f90b3a2cb6" alt="">{{item.likes}}</div>
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
import {mapActions, mapGetters} from 'vuex';
const accessKey = 'KqcwT9g9M5EVFhgUPLv45ZNHdn12enV73KwL-mIeyyM';
export default {
  name: 'AppMain',
  data() {
    return {
      url: '',
      responseData: null,
      page: 1,
      perPage: 12,
      Query: '',
      totalPages: 1
    };
  },
  methods: {
    fetchPhotos(){
      const username = this.$route.query.itemId;
      this.url = this.$route.query.urls;
      axios.get(`https://api.unsplash.com/users/${username}/photos`, {
        params: {
          client_id: accessKey,
          page: this.page,
          per_page: this.perPage
        }
      })
          .then(response => {
            this.responseData = response.data;
            console.log(this.responseData); // Обработайте полученные фотографии здесь
            this.totalPages = Math.ceil(response.headers['x-total'] / this.perPage);
          })
          .catch(error => {
            console.error('Ошибка при получении фотографий пользователя:', error);
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
    },
    useQuery(query) {
      console.log('Текущий запрос:', query);
      this.Query = query
      // Делайте что-то с текущим запросом
    },
    scrollToTop() {
      const scrollDuration = 300;
      const scrollStep = -window.scrollY / (scrollDuration / 15);
      const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    },
    delSearch() {
      this.setSearchQuery('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    ...mapActions(['setSearchQuery'])
  },
  computed: {
    ...mapGetters(['getSearchQuery']),
  },
  watch: {
    getSearchQuery(newValue) {
      this.useQuery(newValue);
      if (this.Query === '') {
        this.fetchPhotos();
      } else {
        this.responseData = this.Query
      }
    },
    '$route'() {
      this.fetchPhotos();
      this.scrollToTop();
    },
  },
  mounted() {
    this.fetchPhotos();
    this.useQuery(this.getSearchQuery);
  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppUser/AppUser';
</style>