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
  }
}
</script>

<style scoped>
.weather__icon {
  float: right;
  height: 50px;
}
</style>
