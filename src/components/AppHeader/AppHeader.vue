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
<!--      <input placeholder="Enter your request" class="" v-model="searchQuery" @input="searchImages" @focus="inputFocus" @blur="inputBlur">-->
      <button class="button-search" @click="toggleButton">
        Search
        <img v-if="!inputActive" src="https://firebasestorage.googleapis.com/v0/b/my-project-56788.appspot.com/o/free-icon-search-711319.png?alt=media&amp;token=5de9c040-000d-4599-b934-5dc1f6aad52e" alt="SearchPage">
        <div class="button-search__close" v-if="inputActive">+</div>
      </button>
    </div>
    <div class="search-block" v-bind:class="{ 'active': inputActive }">
      <div class="search-block__item">
        <span>Search by country</span>
        <input type="text" v-model="searchQuery" @input="searchImages">
      </div>
      <div class="search-block__item">
        <span>Search by name</span>
        <input type="text" v-model="searchQueryByName" @input="searchImagesName">
      </div>
      <div class="search-block__item">
        <span>Search by age</span>
        <input type="text" v-model="searchQueryByAge" @input="searchImagesAge">
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
export default {
  name: 'AppHeader',
  data() {
    return {
      title: 'UserBox',
      responseData: null,
      users: null,
      searchQuery: '',
      searchQueryByName: '',
      searchQueryByAge: '',
      page: 1,
      inputActive: false
    };
  },
  methods: {
    toggleButton() {
      this.inputActive = !this.inputActive;
    },
    searchImages() {
      const query = this.searchQuery.trim();
      console.log('query' + query)
      this.$router.push({ path: '/' });
      if (query !== '') {
        axios.get(`https://randomuser.me/api/?page=${this.page}&results=100`)
            .then(response => {
              this.responseData = response.data.results;
              console.log(query)
              const filteredUsers = this.responseData.filter(user => {
                const country = user.location.country.toLowerCase();
                const queryLowerCase = query.toLowerCase();
                return country.includes(queryLowerCase);
              });
              console.log('Отфильтрованные пользователи:', filteredUsers);
              this.setSearchQuery(filteredUsers);
            })
            .catch(error => {
              console.error(error);
            });
      } else {
        console.log('Введите запрос');
        this.setSearchQuery([]);
        window.location.href = '/';
      }
    },
    searchImagesName() {
      const query = this.searchQueryByName.trim();
      console.log('query' + query)
      this.$router.push({ path: '/' });
      if (query !== '') {
        axios.get(`https://randomuser.me/api/?page=${this.page}&results=100`)
            .then(response => {
              this.responseData = response.data.results;
              console.log(query)
              const filteredUsers = this.responseData.filter(user => {
                const country = user.name.last.toLowerCase();
                const queryLowerCase = query.toLowerCase();
                return country.includes(queryLowerCase);
              });
              console.log('Отфильтрованные пользователи:', filteredUsers);
              this.setSearchQueryByName(filteredUsers);
            })
            .catch(error => {
              console.error(error);
            });
      } else {
        console.log('Введите запрос');
        this.setSearchQueryByName([]);
        window.location.href = '/';
      }
    },
    searchImagesAge() {
      const query = this.searchQueryByAge.trim();
      console.log('query' + query)
      this.$router.push({ path: '/' });
      if (query !== '') {
        axios.get(`https://randomuser.me/api/?page=${this.page}&results=100`)
            .then(response => {
              this.responseData = response.data.results;
              console.log(query)
              const filteredUsers = this.responseData.filter(user => {
                const country = user.dob.age.toString().toLowerCase();
                const queryLowerCase = query.toString().toLowerCase();
                return country.includes(queryLowerCase);
              });
              console.log('Отфильтрованные пользователи:', filteredUsers);
              this.setSearchQueryByName(filteredUsers);
            })
            .catch(error => {
              console.error(error);
            });
      } else {
        console.log('Введите запрос');
        this.setSearchQueryByAge([]);
        window.location.href = '/';
      }
    },
    ...mapActions(['setSearchQuery', 'setSearchQueryByName', 'setSearchQueryByAge'])
  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppHeader/AppHeader';
</style>