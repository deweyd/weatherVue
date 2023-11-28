<template>
  <div class="content">
    <div class="user" v-if="responseData">
      <div class="user__img"><img :src="profile" alt=""></div>
      <div class="user__name">{{ username }} <span v-if="responseData && responseData[0].user.last_name !== null">{{ responseData[0].user.last_name }}</span></div>
      <div class="user__location" v-if="location">Location: {{location}}</div>
      <div class="box__img" v-if="url"><img :src="url" alt=""></div>
      <div class="user__all">All photos of search</div>
    </div>
    <div v-if="responseData" class="box">
      <!-- Отобразить данные, если они доступны -->
      <div class="box__item" v-for="(item, index) in responseData" :key="index">
        <router-link :to="{ path: '/likes', query: { itemId: item.user.username, urls: item.urls.regular,  profile: item.user.profile_image.large, location: item.user.location} }" class="box__img"><img :src="item.urls.small" alt=""></router-link>
        <div class="box__name">
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }" @click="delSearch">
            <img :src="item.user.profile_image.medium" alt="">
          </router-link>
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }" @click="delSearch">{{ item.user.first_name }} <span v-if="responseData && responseData[0].user.last_name !== null">{{ item.user.last_name }}</span></router-link>
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
import {mapActions, mapGetters} from 'vuex';
const accessKey = 'KqcwT9g9M5EVFhgUPLv45ZNHdn12enV73KwL-mIeyyM';
export default {
  name: 'AppMain',
  data() {
    return {
      responseData: null,
      page: 1,
      perPage: 12,
      Query: '',
      queryFromStore: '',
      totalPages: 1
    };
  },
  methods: {
    fetchPhotos(){
      const username = this.$route.query.itemId;
      this.url = this.$route.query.urls;
      this.username = this.$route.query.itemId;
      this.profile = this.$route.query.profile;
      this.location = this.$route.query.location;
      console.log(this.Query)
      this.queryFromStore = this.$store.state.searchQuery;
      if (!this.queryFromStore){
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
      }
      this.responseData = this.queryFromStore
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
      this.responseData = this.Query
    },
    '$route'() {
      this.scrollToTop();
      this.fetchPhotos()
    },
  },
  mounted() {
    this.fetchPhotos();
    this.useQuery(this.getSearchQuery);
  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppLike/AppLike';
</style>