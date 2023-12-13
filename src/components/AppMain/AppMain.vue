<template>
  <div class="content">
<!--    <h1 v-if="Query === ''">Wonderful photos <br> from the best authors</h1>-->
    <div class="dropdown__box">
      <div class="dropdown oriental">
        <button class="dropbtn">Gender</button>
        <div class="dropdown-content">
          <div><a href="#" class="" @click="changeOrderBy1('all')" :class="{ 'selected': gender === 'all' }">all</a></div>
          <div><a href="#" class="" @click="changeOrderBy('male')" :class="{ 'selected': gender === 'male' }">male</a></div>
          <div><a href="#" class="" @click="changeOrderBy('female')" :class="{ 'selected': gender === 'female' }">female</a></div>
        </div>
      </div>
    </div>
    <div v-if="responseData" class="box">
      <div class="box__item" v-for="(item, index) in responseData" :key="index">
        <div class="box__img" @click="delSearch"><router-link  :to="{ path: '/user', query: { age: item.dob.age, date: item.dob.date, email: item.email, gender: item.gender, location: item.location.city, country: item.location.country, timezone: item.location.timezone.description, phone: item.phone, picture: item.picture.large, registered: item.registered.date, name: item.name.title + '. ' + item.name.first + ' ' + item.name.last } }"><img :src="item.picture.large" alt=""></router-link></div>
        <div class="box__info">
          <div class="box__name">{{item.name.title}}. {{item.name.first}} {{item.name.last}}</div>
        </div>
        <div class="box__name">{{item.location.country}}</div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <div class="pagination" v-if="Query === ''">
      <button v-if="gender === 'all'" @click="previousPage">&larr;</button>
      <button v-else @click="previousPage1" :disabled="page === 1">&larr;</button>
      <span>{{ page }}</span>
      <button v-if="gender === 'all'" @click="nextPage">&rarr;</button>
      <button v-else @click="nextPage1" :disabled="page === totalPages">&rarr;</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
export default {
  name: 'AppMain',
  data() {
    return {
      responseData: null,
      page: 1,
      orientation: 'landscape',
      perPage: 21,
      myVariable: 'relevant',
      totalPages: 50,
      gender: 'all',
      searchQuery: '',
      Query: ''
    };
  },
  methods: {
    changeOrderBy(order) {
      this.gender = order;
      this.page = 1;
      console.log(this.gender)
      this.fetchPhotos1();
    },
    changeOrderBy1(order) {
      this.gender = order;
      this.page = 1;
      this.fetchPhotos();
    },
    delSearch() {
      window.location.reload();
    },
    fetchPhotos(){
      axios.get(`https://randomuser.me/api/?page=${this.page}&results=25`)
          .then(response => {
            this.responseData = response.data.results;
            console.error(this.responseData);
          })
          .catch(error => {
            console.error(error);
          });
    },
    fetchPhotos1(){
      axios.get(`https://randomuser.me/api/?results=25&gender=${this.gender}`)
          .then(response => {
            this.responseData = response.data.results;
            console.error(this.responseData);
          })
          .catch(error => {
            console.error(error);
          });
    },
    useQuery(query) {
      console.log('Текущий запрос:', query);
      this.Query = query
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchPhotos();
      }
    },
    previousPage1() {
      if (this.page > 1) {
        this.page--;
        this.fetchPhotos1();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        console.log(this.page)
        this.fetchPhotos();
      }
    },
    nextPage1() {
      if (this.page < this.totalPages) {
        this.page++;
        console.log(this.page)
        this.fetchPhotos1();
      }
    },
  },
  computed: {
    ...mapGetters(['getSearchQuery', 'getSearchQueryByName', 'getSearchQueryByAge']),
  },
  watch: {
    getSearchQuery(newValue) {
      this.useQuery(newValue);
      if (newValue === '') {
        this.fetchPhotos();
        console.log('55555' + newValue)
      } else {
        this.responseData = this.Query
      }
    },
    getSearchQueryByName(newValue) {
      this.useQuery(newValue);
      if (newValue === '') {
        this.fetchPhotos();
        console.log('55555' + newValue)
      } else {
        this.responseData = this.Query
      }
    },
    getSearchQueryByAge(newValue) {
      this.useQuery(newValue);
      if (newValue === '') {
        this.fetchPhotos();
        console.log('55555' + newValue)
      } else {
        this.responseData = this.Query
      }
    },
  },
  mounted() {
    this.fetchPhotos();
    this.useQuery(this.getSearchQuery);
    this.useQuery(this.getSearchQueryByName);
    this.useQuery(this.getSearchQueryByAge);
  },
};
</script>
<style lang="scss" scoped>
@import './src/components/AppMain/AppMain';
</style>