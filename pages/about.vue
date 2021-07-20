<template>
  <main>
    <article v-if="article">
      <nuxt-content :document="article" />
    </article>
    <div v-else>
      Loading...
    </div>
  </main>
</template>

<script>
export default {
  data () {
    return { article: null }
  },
  async fetch () {
    this.article = await this.$content('pages', 'about').fetch()
    this.$store.commit('setTitle', this.article.title)
    this.$store.commit('setSubtitle', this.article.description)
  },
  head () {
    return {
      title: this.article?.title ?? 'Loading'
    }
  }
}
</script>
