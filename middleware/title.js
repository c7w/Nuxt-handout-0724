import config from '../nuxt.config.js'

export default function ({ store, route }) {
  store.commit('setTitle', config.head.title) // set default value
  store.commit('setSubtitle', '')
}
