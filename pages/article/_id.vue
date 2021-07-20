<template>
  <main>
    <article v-if="article">
      <nuxt-content :document="article" />
    </article>
    <content-placeholders v-else>
      <content-placeholders-heading :img="true" />
      <content-placeholders-text :lines="6" />
    </content-placeholders>
  </main>
</template>

<script>
export default {
  async validate ({ params, $content }) {
    /*
      TODO: use $content to fetch the article;
      return false if any exception is raised
    */
  },
  data () {
    return { article: null }
  },
  async fetch () {
    /* TODO: use this.$content to fetch page content */
  },
  head () {
    return {
      title: this.article?.title ?? 'Loading'
    }
  }
}
</script>
