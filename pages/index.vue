<template>
  <div class="index">
    <main>
      <aside v-for="x in filteredArticles" :key="x.slug">
        <h2>
          <nuxt-link
            :to="`/article/${x.slug}`"
          >
            {{ x.title }}
          </nuxt-link>
        </h2>
        <nuxt-content :document="{ body: x.excerpt }" />
        <small>Updated at <vue-time-ago :datetime="x.finalTime" :auto-update="60" /></small><br>
        <a :href="`/article/${x.slug}`">Read more...</a>
      </aside>
    </main>
    <section>
      <aside v-if="tags.length !== 0">
        <h3>Tags ({{ tags.length }})</h3>
        <sup v-for="tag in tags" :key="tag">
          <nuxt-link :to="`?tag=${encodeURIComponent(tag)}`" style="color:white;">{{ tag }}</nuxt-link>
        </sup>
      </aside>
      <aside v-if="categories.length !== 0">
        <h3>Categories ({{ categories.length }})</h3>
        <sup v-for="category in categories" :key="category">
          <nuxt-link :to="`?category=${encodeURIComponent(category)}`" style="color:white;">{{ category }}</nuxt-link>
        </sup>
      </aside>
      <aside>
        <h3>Weather</h3>
        <weather-info />
      </aside>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      articles: []
    }
  },
  async fetch () {
    const articles = await this
      .$content('article')
      .fetch()
    this.articles = articles.map((article) => { article.finalTime = article.date === undefined ? new Date(article.updatedAt) : new Date(article.date); return article })
      .sort((a, b) => a.finalTime - b.finalTime)
      .reverse()
    this.$store.commit('setSubtitle', this.filteredArticles.length + ' Journals in total. Keep blogging!')
  },
  computed: {
    tags () {
      return _
        .chain(this.articles)
        .map(x => x.tags ?? [])
        .flatten()
        .uniq()
        .value()
    },
    categories () {
      return _
        .chain(this.articles)
        .map(x => x.categories ?? [])
        .flatten()
        .uniq()
        .value()
    },
    filteredArticles () {
      let queryTag
      let tagFiltered
      if (Array.isArray(this.$route.query.tag)) {
        queryTag = this.$route.query.tag[0]
      } else {
        queryTag = this.$route.query.tag
      }
      if (queryTag) {
        const tag = decodeURIComponent(queryTag)
        tagFiltered = this.articles.filter(x => x.tags && x.tags.includes(tag))
      } else {
        tagFiltered = this.articles
      }

      let queryCategory
      if (Array.isArray(this.$route.query.category)) {
        queryCategory = this.$route.query.category[0]
      } else {
        queryCategory = this.$route.query.category
      }
      if (queryCategory) {
        const category = decodeURIComponent(queryCategory)
        return tagFiltered.filter(x => x.categories && x.categories.includes(category))
      } else {
        return tagFiltered
      }
    }
  }
}
</script>

<style scoped>
.index {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  padding: 0;
  max-width: var(--width-content);
}

.index > main {
  margin: 0;
  --width-content: 680px;
  width: 100%;
}

h2 > a {
  color: black;
  text-decoration: none;
}

.index main aside:not(:last-child) {
  padding-bottom: 1em;
  border-bottom: 1px solid #ccc;
}

.index > * {
  padding-top: 0;
}

.index .nuxt-content {
  margin: 1em 0;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

section > aside > h3 {
  margin-top: 0;
}
</style>
