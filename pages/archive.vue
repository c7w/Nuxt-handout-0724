/* eslint-disable vue/require-v-for-key */
<template>
  <div class="index">
    <main>
      <!--       <aside v-for="x in filteredArticles" :key="x.slug">
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
      </aside> -->
      <aside>
        <div v-for="(value, index) in months" :key="value">
          <ul class="month"><li>{{ index }}</li></ul>
          <ul class="article" v-for="article in value" :key="article"><li>{{ article.day }}</li><li>{{ article.article.title }}</li></ul>
        </div>
      </aside>
    </main>
    <section>
      <aside v-if="months.length !== 0">
        <!-- Reserved for TOC -->
        <h3>Months</h3>
        </sup>
      </aside>
    </section>
  </div>
</template>

<script>
// import _ from 'lodash'

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
    this.$store.commit('setSubtitle', this.articles.length + ' Journals in total. Keep blogging!')
  },
  computed: {
    months () {
      const result = {}
      for (const article of this.articles) {
        const time = new Date(article.updatedAt)
        // const date = time.toLocaleDateString()
        const key = time.getFullYear() + '.' + (time.getMonth() + 1)
        const day = (time.getMonth() + 1) + '.' + time.getDate()
        try {
          result[key].push({ article, day })
        } catch (error) {
          result[key] = [{ article, day }]
        }
      }
      return result
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
