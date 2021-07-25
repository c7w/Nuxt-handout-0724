<template>
  <div>
    <div class="weather" v-if="currentWeather">
      <div>
        <img
          :src="currentWeather.current.condition.icon"
          :alt="currentWeather.current.condition.text"
          class="weather__icon"
        >
        <span>
          {{ currentWeather.current.condition.text }}, {{ currentWeather.current['temp_c'] }}°C
        </span>
      </div>
      <small>Location: {{ currentWeather.location.name }}</small>
    </div>
    <content-placeholders v-else>
      <content-placeholders-heading :img="true"/>
    </content-placeholders>
  </div>
</template>

<script>
export default {
  props: {
    city: {
      type: String,
      default: 'Beijing'
    }
  },
  data () {
    return {
      currentWeather: null
    }
  },
  async fetch () {
    // TODO: fetch the weather from API
    const queryParams = {}
    queryParams.aqi = 'no'
    queryParams.q = this.city
    queryParams.key = this.$config.WEATHER_API_KEY

    const baseUrl = 'https://api.weatherapi.com/v1/current.json'
    let url = baseUrl + '?'
    for (const key in queryParams) {
      url = url + key + '=' + queryParams[key] + '&'
    }
    for (let i = 0; i < 5; i++) {
      let success = true
      this.currentWeather = await fetch(url)
        .then(response => response.json())
        // eslint-disable-next-line node/handle-callback-err
        .catch((error) => { success = false })
      if (success) {
        break
      }
    }
  }
}
</script>

<style scoped>
.weather__icon {
  float: right;
  height: 50px;
}
</style>
