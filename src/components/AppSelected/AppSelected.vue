<template>
  <div class="content">
        <nav class="navigation">
          <ul>
            <li><router-link to="/">Головна</router-link></li>
            <li><router-link to="/selected">Обране</router-link></li>
          </ul>
        </nav>
    <div v-if="responseData.length > 0" class="box">
      <div class="content__weak-block">
        <div class="tab">
          <input checked id="tab-btn-1" name="tab-btn" type="radio" value="">
          <label for="tab-btn-1">День</label>
          <input id="tab-btn-2" name="tab-btn" type="radio" value="">
          <label for="tab-btn-2">Тиждень</label>
          <div class="tab-content" id="content-1">
            <h2 style="display: block; width: 100%">Прогноз погоди на сьогодні (обрані міста)</h2>
            <div class="weather-card" v-for="(item, index) in responseData" :key="index">
              <h2><span>Місто:</span> {{item.cityName}}</h2>
              <p>Температура: <span>{{ Math.round(item.weather.main.temp) }}</span> &deg;C</p>
              <p>Хмарність: <span>{{item.weather.weather[0].description}}</span></p>
              <p>Вітер: <span>{{item.weather.wind.speed}}</span> м/с</p>
              <p>Вологість: <span>{{item.weather.main.humidity}}</span>%</p>
              <p>Тиск: <span>{{item.weather.main.pressure}}</span> мм</p>
<!--              <span class="del" @click="dellCity(index)">+</span>-->
              <span class="del" @click="openPopup(index)">+</span>
              <button class="btn-info" @click="activeTab1 = index, infoFunction(item.cityName)" :class="{ 'active': activeTab1 === index }">Погода детально &#9660;</button>
            </div>
            <div class="tabs">
              <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index" :class="{ 'active': activeTab === index }">
                {{ tab.name }}
              </button>
              <h2 style="display: block; width: 100%">Прогноз погоди по місту {{responseData[0].cityName}} на 1 день (сутки - 24 години)</h2>
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
              <canvas id="myChart2"></canvas>
            </div>
          </div>
          <div class="tab-content tab-flex" id="content-2">
            <h2 style="display: block; width: 100%">Прогноз погоди на 5 днів по місту {{responseData[0].cityName}}</h2>
            <div class="weather-card" v-for="(item, index) in Object.values(weatherByDay).slice(0, 5)" :key="index">
              <h2>{{item[0].dt_txt.split(' ')[0].split('-').reverse().join('.')}}</h2>
              <h2><span>Місто:</span> {{responseDataWeather[0].cityName}}</h2>
              <p>Сер.температура: <span>{{ Math.round(item[0].main.temp) }}</span> &deg;C</p>
              <p>Хмарність: <span>{{item[0].weather[0].description}}</span></p>
              <p>Вітер: <span>{{item[0].wind.speed}}</span> м/с</p>
              <p>Вологість: <span>{{item[0].main.humidity}}</span>%</p>
              <p>Тиск: <span>{{item[0].main.pressure}}</span> мм</p>
            </div>
            <div class="tabs">
              <h2 style="display: block; width: 100%">Прогноз погоди на 5 днів по місту {{responseData[0].cityName}} (день та ніч)</h2>
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
              <canvas id="myChartWeak2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="responseData.length === 0" class="box">
      <div class="box-content">
        <h2>Ви ще нічого не добавили в обрані міста!!!</h2>
        <p>Перейдіть на головну, <br> та натисніть на кнопку "Добавити місто в обране"</p>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <div v-if="showPopup" class="popup-container">
      <!-- Вміст попапу -->
      <div class="popup-content">
        <span class="dell" @click="closePopup()">×</span>
        <p>Ви підтверджуєте видалення міста?</p>
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
  name: 'AppSelected',
  data() {
    return {
      activeTab: 0,
      activeTab1: 0,
      tabs: [
        { name: 'День', content: this.filteredDay },
        { name: 'Ніч', content: this.filteredNight }
      ],
      showPopup: false,
      indexToDelete: null,
      responseData: [],
      responseDataWeather: [],
      weatherWeak: {},
      addCity_: false,
      cityName: '',
      apiKey: '6143a71367362bd3e3edfce5bc9ba087',
      cities: [],
      city: [],
      cityLocal: [],
      matchingCities: [],
      searchQuery: '',
      Query: '',
      responseDay: [],
      responseDay1: [],
      responseDay2: [],
      filteredDay: [],
      filteredNight: [],
      allDaysData: [],
      allDaysDataNight: [],
      myChart1: null,
      weatherByDay: [],
      weatherByDay1: [],
      local: false,
      city1: []
    };
  },
  created() {

  },
  methods: {
    dellCity(){
      this.responseData.splice(this.indexToDelete, 1);
      console.log(this.responseData)
      localStorage.setItem('dataWeather', JSON.stringify(this.responseData)); // Обновляем localStorage
      this.closePopup()
    },
    openPopup(index) {
      this.indexToDelete = index; // Зберігаємо індекс обраного елемента
      this.showPopup = true; // Показуємо попап
    },
    closePopup() {
      this.showPopup = false;
    },
    infoFunction(city){
      console.log(city)
      this.fetchWeatherWeak1(city)
      this.fetchWeatherDay1(city)
      this.scheduleFun();
      this.scheduleFun1();
    },
    getCity(){
      const dataWeather = localStorage.getItem('dataWeather');
      if(!dataWeather || dataWeather.length === 0){
        this.local = true;
      }
      else{
        this.local = false;
      }
      if (dataWeather) {
        // JSON назад в объект
        const weatherData = JSON.parse(dataWeather);
        console.log(weatherData)
        const hasCityName = weatherData.some(item => item.cityName !== undefined);
        if (hasCityName) {
          this.city1 = weatherData.map(item => item.cityName);
          console.log('Поле cityName присутнє в об\'єктах.' + this.city1);
        } else {
          this.city1 = weatherData.map(item => item && item.name);
          console.log('Поле cityName відсутнє в об\'єктах.' + this.city1);
        }

        console.log(this.city1)
        this.city1.forEach(cityName => {
          console.log(cityName)
          this.fetchWeather(cityName)
              .then(weather => {
                if (weather) {
                  this.responseData.push({ cityName, weather });
                  console.log('responseData', this.responseData)
                } else {
                  this.responseData.push({ cityName, weather: null });
                }
              })
              .catch(error => {
                console.error('Error', error);
              });
          this.fetchWeatherWeak1(cityName)
          this.fetchWeatherDay(cityName)
        });
      } else {
        console.log('')
      }
    },
    fetchWeather(cityName) {
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.apiKey}&units=metric&lang=ua`;
      return axios.get(API_URL)
          .then(response => response.data)
          .catch(error => {
            console.error('Error:', error);
            return null;
          });
    },
    fetchWeatherWeak1(cityName) {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            if (response) {
              this.responseDataWeather = [];
              this.responseDataWeather.push({ cityName, weather: response.data });
              const weatherData = this.responseDataWeather[0].weather.list;
              weatherData.forEach(weather => {
                const date = new Date(weather.dt * 1000);
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                if (!this.weatherByDay[formattedDate]) {
                  this.weatherByDay[formattedDate] = [];
                }
                this.weatherByDay[formattedDate].push(weather);
              });
              for (const date in this.weatherByDay) {
                const temperaturesForDate = this.weatherByDay[date].map(item => item.main.temp);
                this.temperature = temperaturesForDate.reduce((acc, val) => acc + val, 0) / temperaturesForDate.length;
                this.weatherByDay[date].averageTemperature = this.temperature;
              }
            } else {
              this.responseDataWeather.push({ cityName, weather: null });
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    fetchWeatherWeak(cityName) {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=metric&lang=ua`;
      return axios.get(API_URL)
          .then(response => response.data)
          .catch(error => {
            console.error('Error:', error);
            return null;
          });
    },
    fetchWeatherDay(cityName) {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=metric&lang=ua`;
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
            const combinedData = this.responseDay[keys2[0]].concat(this.responseDay[keys2[1]]);// Получаем перший ключ (дату)
            this.dataForFirstElement = combinedData.slice(0, 8);
            console.log('1212121', this.dataForFirstElement)
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
    fetchWeatherDay1(cityName) {
      const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=metric&lang=ua`;
      axios.get(API_URL)
          .then(response => {
            this.responseDataDay = response.data;
            this.responseDay = [];
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
              this.responseDay1[date] = this.responseDay[date];
            });
            this.filteredDay = []
            Object.keys(this.responseDay1).forEach(date => {
              const dayData = this.responseDay1[date];
              this.filteredDay = dayData.filter(tab => {
                const time = tab.dt_txt.split(' ')[1].split(':')[0];
                return time >= 6 && time < 18;
              });
              console.log('100999', this.filteredDay)
              this.filteredNight = dayData.filter(tab => {
                const time = tab.dt_txt.split(' ')[1].split(':')[0];
                return time < 6 || time >= 18;
              });
              console.log('000999', this.filteredNight)
              this.allDaysData = []
              Object.values(this.filteredDay).forEach(dayData => {
                this.allDaysData = this.allDaysData.concat(dayData);
              });
              this.allDaysDataNight = []
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
        axios.get(`https://api.openweathermap.org/data/2.5/find?q=${this.searchQuery}&appid=${this.apiKey}&units=metric&lang=ua`)
            .then(response => {
              this.matchingCities = response.data.list.filter(city => {
                return city.name.toLowerCase().includes(this.searchQuery.toLowerCase());
              });
              console.log(this.matchingCities);
            })
            .catch(error => {
              console.error('Помилка отримання списку міст:', error);
            });
      } else {
        this.matchingCities = [];
      }
    },
    selectCity(city) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${this.apiKey}&units=metric&lang=ua`)
          .then(response => {
            this.responseData = response.data;
            console.log(this.responseData);
            this.matchingCities = [];
            this.searchQuery = '';
            this.cityName = city;
            this.addCity_ = false;
          })
          .catch(error => {
            console.error('Помилка отримання погоди для обраного міста:', error);
          });
    },
    addCity() {
      this.$store.dispatch('setDataSelected', this.responseData);
      this.addCity_ = true;
      console.log(this.$store.state);
    },
    scheduleFun(){
        setTimeout(() => {
          const ctx = document.getElementById('myChart2');
          const temperatureData = this.dataForFirstElement && Array.isArray(this.dataForFirstElement) ? this.dataForFirstElement.map(item => Math.round(item.main.temp)) : [];
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
        const ctx = document.getElementById('myChartWeak2');
        const temperatureData = this.allDaysData.map(item => item.main.temp);
        console.log('45454545', temperatureData);
        if (this.myChart1) {
          this.myChart1.destroy();
        }
        if (ctx) {
          this.myChart1 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.allDaysData.map(item => {
                // Преобразование времени в нужный формат (если это timestamp)
                const date = new Date(item.dt * 1000); // Преобразование секунд в миллисекунды
                return date.toLocaleTimeString();
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
    this.getCity();
  },
};
</script>
<style lang="scss" scoped>
@import './src/components/AppSelected/AppSelected';
</style>