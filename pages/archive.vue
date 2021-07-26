<template>
  <div class="index">
    <main>
      <aside>
        <div v-for="(value, index) in months" :key="value" class="month">
          <a :name="'month-link-' + index" />
          <ul class="month-title">
            <li><h2>{{ index }}</h2></li>
          </ul>
          <ul v-for="day in Object.keys(value)" :key="day" class="day">
            <li>
              <h3>{{ day }}</h3>
              <p v-for="article in value[day]" :key="article">
                <a :href="`/article/${article.slug}`">{{ article.title }}</a>
              </p>
            </li>
          </ul>
        </div>
      </aside>
    </main>
    <section>
      <aside v-if="months.length !== 0">
        <!-- Reserved for TOC -->
        <h3>Months</h3>
        <div v-for="(value, index) in months" :key="value">
          <ul class="month-link"><li><a :href="'#month-link-' + index">{{ index }} ({{ Object.values(value).flat().length }})</a></li></ul>
        </div>
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
    const articles = await this
      .$content('article')
      .fetch()
    this.articles = articles.map((article) => { article.finalTime = article.date === undefined ? new Date(article.updatedAt) : new Date(article.date); return article })
      .sort((a, b) => a.finalTime - b.finalTime)
      .reverse()
    this.$store.commit('setSubtitle', this.articles.length + ' Journals in total. Keep blogging!')
  },
  computed: {
    months () {
      const result = {}
      for (const article of this.articles) {
        const time = new Date(article.date === undefined ? article.createdAt : article.date)
        // const date = time.toLocaleDateString()
        const key = time.getFullYear() + '.' + (time.getMonth() + 1)
        const day = (time.getMonth() + 1) + '.' + time.getDate()
        try {
          result[key][day].push(article)
        } catch (error) {
          try {
            result[key][day] = [article]
          } catch {
            result[key] = {}
            result[key][day] = [article]
          }
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

.month ul, li{
  list-style: none;
  padding: 0;
}

</style>
