<template>
  <div class="content">
    <h1 v-if="Query === ''">Wonderful photos <br> from the best authors</h1>
    <h1 v-if="Query !== ''">Search result</h1>
    <div v-if="Query === ''" class="dropdown oriental">
      <button class="dropbtn">Sort by</button>
      <div class="dropdown-content">
        <div>
          <a href="#" @click="changeOrderBy('relevant')" :class="{ 'selected': myVariable === 'relevant' }">relevant</a>
        </div>
        <div>
          <a href="#" @click="changeOrderBy('latest')" :class="{ 'selected': myVariable === 'latest' }">latest</a>
        </div>
        <div>
          <a href="#" @click="changeOrderBy('oldest')" :class="{ 'selected': myVariable === 'oldest' }">oldest</a>
        </div>
        <div>
          <a href="#" @click="changeOrderBy('popular')" :class="{ 'selected': myVariable === 'popular' }">popular</a>
        </div>
        <div>
          <a href="#" @click="changeOrderBy('downloads')" :class="{ 'selected': myVariable === 'downloads' }">downloads</a>
        </div>
      </div>
    </div>
    <div v-if="responseData" class="box">
      <!-- Отобразить данные, если они доступны -->
      <div class="box__item" v-for="(item, index) in responseData" :key="index">
        <div class="box__img" v-if="Query === ''"><router-link :to="{ path: '/user', query: { itemId: item.user.username, urls: item.urls.regular } }"><img :src="item.urls.small" alt=""></router-link></div>
        <div class="box__img" v-if="Query !== ''"><router-link :to="{ path: '/likes', query: { itemId: item.user.username, urls: item.urls.regular,  profile: item.user.profile_image.large, location: item.user.location} }"><img :src="item.urls.small" alt=""></router-link></div>
        <div class="box__name">
          <router-link :to="{ path: '/user', query: { itemId: item.user.username } }" @click="delSearch"><img :src="item.user.profile_image.medium" alt=""></router-link>
          <router-link  :to="{ path: '/user', query: { itemId: item.user.username } }" @click="delSearch">{{ item.user.first_name }} {{ item.user.last_name }}</router-link>
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
import { mapGetters } from 'vuex';
const accessKey = 'KqcwT9g9M5EVFhgUPLv45ZNHdn12enV73KwL-mIeyyM';
export default {
  name: 'AppMain',
  data() {
    return {
      responseData: null,
      page: 1,
      orientation: 'landscape',
      perPage: 20,
      myVariable: 'relevant',
      totalPages: 1,
      searchQuery: '',
      Query: ''
    };
  },
  methods: {
    changeOrderBy(order) {
      // Здесь ваша логика для изменения порядка сортировки
      this.myVariable = order
      console.log('Выбран порядок:', this.myVariable);
      this.fetchPhotos();
    },
    fetchPhotos(){
      axios.get('https://api.unsplash.com/photos', {
        params: {
          client_id: accessKey,
          include: 'user',
          order_by: this.myVariable,
          page: this.page,
          orientation: this.orientation,
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
    },
    useQuery(query) {
      console.log('Текущий запрос:', query);
      this.Query = query
    },
    delSearch() {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  },
  computed: {
    ...mapGetters(['getSearchQuery']),
  },
  watch: {
    getSearchQuery(newValue) {
      this.useQuery(newValue);
      if (newValue === '') {
        this.fetchPhotos();
        console.log(newValue)
      } else {
        this.responseData = this.Query
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.Query = ''; // Очистка значения инпута при переходе на другую страницу
    next();
  },
  mounted() {
    this.fetchPhotos();
    this.useQuery(this.getSearchQuery);
  },
};
</script>
<style lang="scss" scoped>
@import './src/components/AppMain/AppMain';
</style>