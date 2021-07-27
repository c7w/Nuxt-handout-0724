<template>
  <div class="Comments">
    <h2>Comments</h2>
    <div class="Input">
      Nickname &nbsp;&nbsp; <input id="data.nickname" v-model="nickname" class="label">&nbsp;&nbsp;&nbsp;&nbsp;
      Email&nbsp;&nbsp;<input id="data.email" v-model="email" class="label">
      <div class="InputBox">
        <textarea id="data.content" v-model="content" placeholder="Your comment..." />
      </div>
      <button :disabled="buttonFinal" @click="postComment">
        Submit
      </button>
    </div>
    <div v-if="currComment" class="CurrComments">
      <div v-if="currComment.data.length != 0">
        <div v-for="x in currComment.data" :key="x+email+x.time" class="CommentContent">
          <hr>
          <p><img :src="getAvatar(x.email)" alt="avatar" loading="lazy" width="64" height="64"></p>
          <p><span class="Bold">{{ x.nickname }}</span> (<a :href="'mailto://'+x.email">{{ x.email }}</a>) posted <vue-time-ago :datetime="x.time" :auto-update="60" /></p>
          <p>{{ x.content }}</p>
        </div>
      </div>
      <div class="PostNow">
        No more comments! Post your comment now!
      </div>
    </div>
    <p v-else>
      Comments are loading...
    </p>
  </div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currComment: null,
      nickname: null,
      email: null,
      content: null,
      buttonDisabled: false
    }
  },
  async fetch () {
    const url = 'http://121.5.165.232:10001?path=' + this.path + '&t=' + Math.random()
    this.currComment = await fetch(url).then(response => response.json())
  },
  computed: {
    contentValidation () {
      if (this.nickname === null) {
        return false
      }
      if (this.content === null) {
        return false
      }
      const pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!pattern.test(this.email)) {
        return false
      }
      return true
    },
    buttonFinal () {
      return this.buttonDisabled || !this.contentValidation
    }
  },
  methods: {
    postComment (evt) {
      this.buttonDisabled = true

      const nickname = this.nickname
      const email = this.email
      const content = this.content
      const time = new Date()

      const path = this.path

      this.content = 'Your comment is being processed. Please be patient...'
      const body = { path, data: { email, nickname, content, time } }

      const httpRequest = new XMLHttpRequest()
      httpRequest.open('POST', 'http://121.5.165.232:10001/')
      httpRequest.setRequestHeader('Content-type', 'application/json')
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
          alert(httpRequest.responseText)
        }
      }
      httpRequest.send(JSON.stringify(body))
      setTimeout(() => { location.reload() }, 2000)
    },
    getAvatar (email) {
      const MD5 = require('crypto-js/md5')
      return 'https://www.gravatar.com/avatar/' + MD5(email) + '.png'
    }
  }
}
</script>

<style scoped>
.Comments{
    margin: 20px auto;
    padding: 20px;
    width: 65%;
    background-color: #EDEAE9;
}

.CurrComments{
    margin: 20px 0 0 0;
}

.Input {
    margin: 0 auto;
}

.Input table {
    margin: 0 auto;
    display: table;
}

.Input {
    text-align: center;
}

.Input .label{
    display: inline;
    width: 25%;
}

.InputBox{
    text-align: center;
}

.InputBox textarea{
    width: 90%;
    height: 100px;
    padding: 5px;
    margin: 0 auto;
}

.CurrComments div div hr{
  margin: 10px 0;
  background-color: red;
  height: 1.5px;
}

.CurrComments .PostNow {
  text-align: center;
  color: grey;
  font-weight: bold;
  margin: 10px auto;
}

.CurrComments div div img {
  float: right;
  overflow: visible;
  transform:unset;
  display: inline;
  border: 1px red;
}

.CommentContent p .Bold {
  font-weight: bold;
}
</style>
