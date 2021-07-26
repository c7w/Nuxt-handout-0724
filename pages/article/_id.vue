<template>
  <main>
    <script type="text/x-mathjax-config">
      MathJax.Hub.Config({
      tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      processEscapes: true
      }
      });
    </script>
    <script
      type="text/javascript"
      src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
    />
    <article v-if="article">
      <nuxt-content :document="article" />
    </article>
    <content-placeholders v-else>
      <content-placeholders-heading :img="true" />
      <content-placeholders-text :lines="6" />
    </content-placeholders>
    <comments />
  </main>
</template>

<script>
export default {
  async validate ({ params, $content }) {
    try {
      this.article = await $content('article', params.id).fetch()
    } catch (error) {
      return false
    }
    return true
  },
  data () {
    return { article: null }
  },
  async fetch () {
    this.article = await this.$content(
      'article',
      this.$route.params.id
    ).fetch()
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

<style>
.mjx-chtml {
  outline: 0;
}
.MJXc-display {
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
