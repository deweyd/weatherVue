<template>
  <div class="content">
        <nav class="navigation">
          <ul>
            <li><router-link to="/">Головна</router-link></li>
            <li><router-link to="/selected">Обране</router-link></li>
          </ul>
        </nav>
    <div v-if="responseData" class="box">
      <div class="content__top">
        <div class="content__input">
          <div class="content__input-bl">
            <input type="text" autocomplete="on" v-model="searchQuery" placeholder="Пошук за назвою міста" @input="searchCities">
            <div class="content__input-search" v-if="matchingCities.length">
              Результати пошуку:
              <div v-for="(city, index) in matchingCities" :key="index" @click="selectCity(city)">{{ city }}</div>
            </div>
          </div>

        </div>
        <button class="content__favorited" v-if="!addCity_" @click="addCity()">Добавити місто {{responseData.name}} в обране</button>
        <button class="content__favorited" v-if="addCity_">Добавлено в обране</button>
      </div>
      <div class="content__weak-block">
        <div class="tab">
          <input checked id="tab-btn-1" name="tab-btn" type="radio" value="">
          <label for="tab-btn-1">День</label>
          <input id="tab-btn-2" name="tab-btn" type="radio" value="">
          <label for="tab-btn-2">Тиждень</label>
          <div class="tab-content" id="content-1">
            <h2 style="display: block; width: 100%">Прогноз погоди на сьогодні по місту {{responseData.name}}</h2>
            <div class="weather-card">
              <h2><span>Місто:</span> {{responseData.name}}</h2>
              <p>Температура: <span>{{ Math.round(responseData.main.temp) }}</span> &deg;C</p>
              <p>Хмарність: <span>{{responseData.weather[0].description}}</span></p>
              <p>Вітер: <span>{{responseData.wind.speed}}</span> м/с</p>
              <p>Вологість: <span>{{responseData.main.humidity}}</span>%</p>
              <p>Тиск: <span>{{responseData.main.pressure}}</span> мм</p>
            </div>
            <div class="tabs">
              <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index" :class="{ 'active': activeTab === index }">
                {{ tab.name }}
              </button>
              <h2 style="display: block; width: 100%">Прогноз погоди по місту {{responseData.name}} на 1 день (сутки - 24 години)</h2>
              <div style="width: 100%" v-for="(tab, index) in tabs" :key="index" v-show="activeTab === index" :class="{ 'active': activeTab === index }">
                <div class="tabs__content" v-if="index === 0">
                  <div class="tabs__item" v-for="(tab, index) in allDaysData.slice(0, 4)" :key="index">
                    <p><span>Дата:</span> {{tab.dt_txt.split(' ')[0].split('-').reverse().join('.')}}</p>
                    <p>Година: {{tab.dt_txt.split(' ')[1].split('-').reverse().join('.').slice(0, -3)}}</p>
                    <p>Температура: <span>{{ Math.round(tab.main.temp) }}</span> &deg;C</p>
                    <p>Хмарність: <span>{{tab.weather[0].description}}</span></p>
                    <p>Вологість: <span>{{tab.main.humidity}}</span>%</p>
                    <p>Тиск: <span>{{tab.main.pressure}}</span> мм</p>
                  </div>
                </div>
                <div class="tabs__content" v-if="index === 1">
                  <div class="tabs__item" v-for="(tab, index) in allDaysDataNight.slice(0, 4)" :key="index">
                    <p><span>Дата:</span> {{tab.dt_txt.split(' ')[0].split('-').reverse().join('.')}}</p>
                    <p>Година: {{tab.dt_txt.split(' ')[1].split('-').reverse().join('.').slice(0, -3)}}</p>
                    <p>Температура: <span>{{ Math.round(tab.main.temp) }}</span> &deg;C</p>
                    <p>Хмарність: <span>{{tab.weather[0].description}}</span></p>
                    <p>Вологість: <span>{{tab.main.humidity}}</span>%</p>
                    <p>Тиск: <span>{{tab.main.pressure}}</span> мм</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="content__schedule">
              <canvas id="myChart"></canvas>
            </div>
          </div>
          <div class="tab-content tab-flex" id="content-2">
            <h2 style="display: block; width: 100%">Прогноз погоди по місту {{responseData.name}} на 5 днів</h2>
            <div class="weather-card" v-for="(item, index) in Object.values(weatherWeak).slice(0, 5)" :key="index">
              <h2>{{item[0].dt_txt.split(' ')[0].split('-').reverse().join('.')}}</h2>
              <h2><span>Місто:</span> {{responseData.name}}</h2>
              <p>Сер.температура: <span>{{ Math.round(item.averageTemperature) }}</span> &deg;C</p>
              <p>Хмарність: <span>{{item[0].weather[0].description}}</span></p>
              <p>Вітер: <span>{{item[0].wind.speed}}</span> м/с</p>
              <p>Вологість: <span>{{item[0].main.humidity}}</span>%</p>
              <p>Тиск: <span>{{item[0].main.pressure}}</span> мм</p>
            </div>
            <div class="tabs">
              <h2 style="display: block; width: 100%">Прогноз погоди на 5 днів по місту {{responseData.name}} (день та ніч)</h2>
              <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index" :class="{ 'active': activeTab === index }">
                {{ tab.name }}
              </button>
              <div style="width: 100%" v-for="(tab1, index) in tabs" :key="index" v-show="activeTab === index" :class="{ 'active': activeTab === index }">
                {{tab1.content}}
                <div class="tabs__content" v-if="index === 0">
                  <div class="tabs__item" v-for="(tab, index) in allDaysData.slice(0, 10)" :key="index">
                    <p><span>Дата:</span> {{tab.dt_txt.split(' ')[0].split('-').reverse().join('.')}}</p>
                    <p>Година: {{tab.dt_txt.split(' ')[1].split('-').reverse().join('.').slice(0, -3)}}</p>
                    <p>Температура: <span>{{ Math.round(tab.main.temp) }}</span> &deg;C</p>
                    <p>Хмарність: <span>{{tab.weather[0].description}}</span></p>
                    <p>Вологість: <span>{{tab.main.humidity}}</span>%</p>
                    <p>Тиск: <span>{{tab.main.pressure}}</span> мм</p>
                  </div>
                </div>
                <div class="tabs__content" v-if="index === 1">
                  <div class="tabs__item" v-for="(tab, index) in allDaysDataNight.slice(0, 10)" :key="index">
                    <p><span>Дата:</span> {{tab.dt_txt.split(' ')[0].split('-').reverse().join('.')}}</p>
                    <p>Година: {{tab.dt_txt.split(' ')[1].split('-').reverse().join('.').slice(0, -3)}}</p>
                    <p>Температура: <span>{{ Math.round(tab.main.temp) }}</span> &deg;C</p>
                    <p>Хмарність: <span>{{tab.weather[0].description}}</span></p>
                    <p>Вологість: <span>{{tab.main.humidity}}</span>%</p>
                    <p>Тиск: <span>{{tab.main.pressure}}</span> мм</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="content__schedule">
              <canvas id="myChartWeak"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <div v-if="showPopup" class="popup-container">
      <!-- Вміст попапу -->
      <div class="popup-content">
        <span class="dell" @click="closePopup()">×</span>
        <p>Для додавання міста {{responseData.name}} видаліть спочатку місто, яке знаходиться в "Обране",  тому, що
          максимум одне місто</p>
        <span class="city-dell" @click="dellCity()">Так</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import Chart  from 'chart.js/auto';
export default {
  name: 'AppMain',
  data() {
    return {
      responseData: null,
      activeTab: 0,
      showPopup: false,
      activeTab1: 0,
      tabs: [
        { name: 'День', content: this.filteredDay },
        { name: 'Ніч', content: this.filteredNight }
      ],
      responseDataWeather: null,
      weatherWeak: {},
      addCity_: false,
      cityName: 'Kyiv',
      apiKey: '6143a71367362bd3e3edfce5bc9ba087',
      apiKeyAccess: '7f88d2ce81b6e7bf85fb1c7779f3f3c4',
      cities: [],
      lat: '',
      lon: '',
      matchingCities: [],
      page: 1,
      allDaysDataNight: [],
      temperature: [],
      searchQuery: '',
      Query: '',
      allDaysData: [],
      responseDataDay: '',
      responseDay: [],
      responseDay1: {},
      responseDay2: {},
      filteredDay: [],
      filteredNight: [],
      filteredDay1: [],
      filteredNight1: [],
      allDaysData1: [],
      dataForFirstElement: [],
      allDaysDataNight1: [],
      myChart: null,
      myChart1: null
    };
  },
  created() {

  },
  methods: {
    fetchApi(){
      // const API_URL = `https://api.ipstack.com/check?access_key=${this.apiKeyAccess}`;
      // fetch(API_URL)
      //     .then(response => response.json())
      //     .then(data => {
      //       this.lat = data.latitude;
      //       this.lon = data.longitude;
      //       this.fetchWeather();
      //       this.fetchWeatherWeak();
      //       this.fetchWeatherDay();
      //     })
      //     .catch(error => {
      //       console.error('Error:', error);
      //     });
      fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=5b436cc2405c4ee3bfbd191927f61108')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then(data => {
             this.lat = data.latitude;
             this.lon = data.longitude;
             this.fetchWeather();
             this.fetchWeatherWeak();
             this.fetchWeatherDay();
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    closePopup() {
      this.showPopup = false;
    },
    dellCity(){
      this.showPopup = false;
    },
    fetchWeather() {
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            this.responseData = response.data;
            console.log(this.responseData);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    fetchWeatherWeak() {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            this.responseDataWeather = response.data;
            this.responseDataWeather.list.forEach(item => {
              const date = item.dt_txt.split(' ')[0];
              if (!this.weatherWeak[date]) {
                this.weatherWeak[date] = [];
              }
              this.weatherWeak[date].push(item);
            });
            for (const date in this.weatherWeak) {
              const temperaturesForDate = this.weatherWeak[date].map(item => item.main.temp);
              this.temperature = temperaturesForDate.reduce((acc, val) => acc + val, 0) / temperaturesForDate.length;
              this.weatherWeak[date].averageTemperature = this.temperature;
            }
            console.log(`temperature for ${this.temperature}`);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    fetchWeatherWeak1(city) {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            this.responseDataWeather = response.data;
            this.weatherWeak = [];
            this.responseDataWeather.list.forEach(item => {
              const date = item.dt_txt.split(' ')[0];
              if (!this.weatherWeak[date]) {
                this.weatherWeak[date] = [];
              }
              this.weatherWeak[date].push(item);
            });
            console.log('uuuuu', this.weatherWeak);
            for (const date in this.weatherWeak) {
              const temperaturesForDate = this.weatherWeak[date].map(item => item.main.temp);
              this.temperature = temperaturesForDate.reduce((acc, val) => acc + val, 0) / temperaturesForDate.length;
              this.weatherWeak[date].averageTemperature = this.temperature;
            }
            console.log(`temperature for ${this.temperature}`);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    fetchWeatherDay() {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            this.responseDataDay = response.data;
            this.responseDataDay.list.forEach(item => {
              const date = item.dt_txt.split(' ')[0];
              if (!this.responseDay[date]) {
                this.responseDay[date] = [];
              }
              this.responseDay[date].push(item);
            });
            //фрагмент кода для отримання першого елемента масива, тобто для отримання сьогоднішнього дня
            const keys2 = Object.keys(this.responseDay);
            const combinedData = this.responseDay[keys2[0]].concat(this.responseDay[keys2[1]]);// Получаем первый ключ (дату)
            this.dataForFirstElement = combinedData.slice(0, 8);
            //на 5 днів
            const keys = Object.keys(this.responseDay);
            keys.slice(0, keys.length - 1).forEach(date => {
              this.responseDay1[date] = this.responseDay[date].slice(0, 5);
            });
            Object.keys(this.responseDay1).forEach(date => {
              const dayData = this.responseDay1[date];
              this.filteredDay = dayData.filter(tab => {
                const time = tab.dt_txt.split(' ')[1].split(':')[0];
                return time >= 6 && time < 18;
              });
              this.filteredNight = dayData.filter(tab => {
                const time = tab.dt_txt.split(' ')[1].split(':')[0];
                return time < 6 || time >= 18;
              });
              Object.values(this.filteredDay).forEach(dayData => {
                this.allDaysData = this.allDaysData.concat(dayData);
              });
              Object.values(this.filteredNight).forEach(dayData => {
                this.allDaysDataNight = this.allDaysDataNight.concat(dayData);
              });
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    fetchWeatherDay1(city) {
      this.scheduleFun();
      this.scheduleFun1();
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            this.responseDay = [];
            this.responseDataDay = response.data;
            this.responseDataDay.list.forEach(item => {
              const date = item.dt_txt.split(' ')[0];
              if (!this.responseDay[date]) {
                this.responseDay[date] = [];
              }
              this.responseDay[date].push(item);
            });
            //фрагмент кода для отримання першого елемента масива, тобто для отримання сьогоднішнього дня
            const keys2 = Object.keys(this.responseDay);
            const firstKey = keys2[0]; // Получаем первый ключ (дату)
            this.dataForFirstElement = this.responseDay[firstKey];
            console.log('1212121', this.dataForFirstElement)
            //на 5 днів
            const keys = Object.keys(this.responseDay);
            keys.slice(0, keys.length - 1).forEach(date => {
              this.responseDay1[date] = this.responseDay[date];
            });
            Object.keys(this.responseDay1).forEach(date => {
              const dayData = this.responseDay1[date];
              console.log('989898', dayData)
              this.filteredDay = [];
              this.filteredDay = dayData.filter(tab => {
                const time = tab.dt_txt.split(' ')[1].split(':')[0];
                return time >= 6 && time < 18;
              });
              this.filteredNight = [];
              this.filteredNight = dayData.filter(tab => {
                const time = tab.dt_txt.split(' ')[1].split(':')[0];
                return time < 6 || time >= 18;
              });
              this.allDaysData = [];
              Object.values(this.filteredDay).forEach(dayData => {
                this.allDaysData = this.allDaysData.concat(dayData);
              });
              this.allDaysDataNight = [];
              Object.values(this.filteredNight).forEach(dayData => {
                this.allDaysDataNight = this.allDaysDataNight.concat(dayData);
              });
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    searchCities() {
      if (this.searchQuery.length > 1) {
        const requests = [
          axios.get(`https://api.openweathermap.org/data/2.5/find?q=${this.searchQuery}&appid=${this.apiKey}&units=metric&lang=uk`),
          axios.get(`https://api.openweathermap.org/data/2.5/find?q=${this.searchQuery}&appid=${this.apiKey}&units=metric&lang=en`)
        ];
        Promise.all(requests)
            .then(responses => {
              const cities = responses.flatMap(response => response.data.list.map(city => city.name));
              this.matchingCities = Array.from(new Set(cities));
              console.log(this.matchingCities);
            })
            .catch(error => {
              console.error('Error fetching cities:', error);
            });
      } else {
        this.matchingCities = [];
      }
    },
    selectCity(city) {
      console.log(city)
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=en`)
          .then(response => {
            this.responseData = response.data;
            this.matchingCities = [];
            this.searchQuery = '';
            this.cityName = city;
            this.addCity_ = false;
            this.fetchWeatherDay1(city);
            this.fetchWeatherWeak1(city)
          })
          .catch(error => {
            console.error('Помилка отримання погоди для обраного міста:', error);
          });
    },
    addCity() {
      this.$store.dispatch('setDataSelected', this.responseData);
      this.addCity_ = true;
      //отримуем масив. якщо є загрузимо, ні - утвор.новий пустий масив
      let dataWeather = JSON.parse(localStorage.getItem('dataWeather')) || [];
      if (dataWeather.length < 1) {
        console.log('Немає даних про погоду в локальному сховищі');
        dataWeather.push(this.responseData);
        localStorage.setItem('dataWeather', JSON.stringify(dataWeather));
        console.log(this.$store.state);
        const weatherData = localStorage.getItem('dataWeather');
        console.log('22222222', weatherData);
      } else {
        console.log(dataWeather.length)
        console.log('Дані про погоду знайдено:', dataWeather);
        this.showPopup = true;
      }
    },
    scheduleFun(){
      setTimeout(() => {
        const ctx = document.getElementById('myChart');
        const temperatureData = this.dataForFirstElement.map(item => Math.round(item.main.temp));
        if (this.myChart) {
          this.myChart.destroy();
        }
        if (ctx) {
          this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.dataForFirstElement.map(item => {
                const date = new Date(item.dt * 1000); // в мілісекунди
                return date.toLocaleTimeString().substring(0, 5);
              }),
              datasets: [{
                label: 'Температура за день (сутки - 24 години)',
                data: temperatureData,
                borderColor: 'white',
                borderWidth: 5
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    color: 'white',
                    callback: function(value) {
                      return value + '  °C';
                    },
                  },
                },
                x: {
                  ticks: {
                    color: 'white'
                  },
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white',
                    font: {
                      size: 25,
                      weight: 'bold'
                    }
                  }
                }
              }
            }
          });
          console.log('Chart created successfully');
        } else {
          console.log('Canvas element with ID "myChart" not found');
        }
      }, 1000)
    },
    scheduleFun1(){
      setTimeout(() => {
        const ctx = document.getElementById('myChartWeak');
        const temperatureData = Object.values(this.weatherWeak)
            .flatMap(array => array.map(item => item.main.temp));
        console.log('45454545', temperatureData);
        if (this.myChart1) {
          this.myChart1.destroy();
        }
        if (ctx) {
          this.myChart1 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: Object.values(this.weatherWeak).flatMap(array => {
                return array.map(item => {
                  const date = new Date(item.dt * 1000);
                  return date.toLocaleTimeString().substring(0, 5);
                });
              }),
              datasets: [{
                label: 'Температура на 5 днів',
                data: temperatureData,
                borderColor: 'white',
                borderWidth: 5
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    color: 'white',
                    callback: function(value) {
                      return value + '  °C';
                    },
                  },
                },
                x: {
                  ticks: {
                    color: 'white'
                  },
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white',
                    font: {
                      size: 25,
                      weight: 'bold'
                    }
                  }
                }
              }
            }
          });
          console.log('Chart created successfully');
        } else {
          console.log('Canvas element with ID "myChart" not found');
        }
      }, 1000);
    }
  },
  computed: {
    ...mapGetters(['getDataQuery']),
  },
  mounted() {
    this.scheduleFun();
    this.scheduleFun1();
    this.fetchApi();
  }
};
</script>
<style lang="scss" scoped>
@import './src/components/AppMain/AppMain';
</style>