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
        <small>Updated at <vue-time-ago :datetime="x.updatedAt" :auto-update="60" /></small><br>
        <a :href="`/article/${x.slug}`">Read more...</a>
      </aside>
    </main>
    <section>
      <aside>
        <h3>Tags</h3>
        <sup v-for="tag in tags" :key="tag">
          <nuxt-link :to="`?tag=${encodeURIComponent(tag)}`" style="color:white;">{{ tag }}</nuxt-link>
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
    this.articles = await this
      .$content('article')
      .sortBy('updatedAt', 'desc')
      .fetch()
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
    filteredArticles () {
      let queryTag
      if (Array.isArray(this.$route.query.tag)) {
        queryTag = this.$route.query.tag[0]
      } else {
        queryTag = this.$route.query.tag
      }
      if (queryTag) {
        const tag = decodeURIComponent(queryTag)
        return this.articles.filter(x => x.tags && x.tags.includes(tag))
      } else {
        return this.articles
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
