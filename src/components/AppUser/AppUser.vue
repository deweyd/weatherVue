<template>
  <div class="content">
    <h1 v-if="Query !== ''">Search result</h1>
    <div class="user" v-if="responseData" :class="{ 'active': Query !== '' }">
      <div class="user__img"><img :src="responseData.picture" alt=""></div>
      <div class="user__name">{{ responseData.name }}</div>
      <div class="user__location" v-if="responseData.age">Age: {{responseData.age}}</div>
      <div class="user__location" v-if="responseData.date">Date: {{formatDate(responseData.date)}}</div>
      <div class="user__location" v-if="responseData.registered">Registered date: {{formatDate(responseData.registered)}}</div>
      <div class="user__location" v-if="responseData.email">Email: {{responseData.email}}</div>
      <div class="user__location" v-if="responseData.phone">Phone: {{responseData.phone}}</div>
      <div class="user__location" v-if="responseData.location">Location: {{responseData.location}}</div>
<!--      <div class="box__img" v-if="url"><img :src="url" alt=""></div>-->
      <div class="user__location" v-if="responseData.country">Country: {{responseData.country}}</div>
      <div class="user__location" v-if="responseData.gender">Gender: {{responseData.gender}}</div>
      <div class="user__location" v-if="responseData.timezone">Timezone: {{responseData.timezone}}</div>
<!--      <a :href="responseData[0].user.portfolio_url" class="user__portfolio" v-if="responseData[0].user.portfolio_url">Portfolio: {{responseData[0].user.portfolio_url}}</a>-->
<!--      <div class="user__all">All photos ({{responseData[0].user.total_photos}} pieces) {{ responseData[0].user.first_name }} {{ responseData[0].user.last_name }}</div>-->
    </div>
    <div v-else>
      <!-- Отобразить сообщение о загрузке, пока данные не загружены -->
      <p>Loading...</p>
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
      responseData1: null,
      page: 1,
      perPage: 12,
      Query: '',
      totalPages: 1
    };
  },
  methods: {
    fetchPhotos(){
      this.responseData = this.$route.query;
      const username = this.$route.query;
      console.log(username)
      this.url = this.$route.query.urls;
      axios.get(`https://api.unsplash.com/users/${username}/photos`, {
        params: {
          client_id: accessKey,
          page: this.page,
          per_page: this.perPage
        }
      })
          .then(response => {
            this.responseData1 = response.data;
            console.log(this.responseData1); // Обработайте полученные фотографии здесь
            this.totalPages = Math.ceil(response.headers['x-total'] / this.perPage);
          })
          .catch(error => {
            console.error('Ошибка при получении фотографий пользователя:', error);
          });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      return formattedDate;
    },
    useQuery(query) {
      console.log('Текущий запрос:', query);
      this.Query = query
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