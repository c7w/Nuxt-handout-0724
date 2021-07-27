<template>
  <div class="Comments">
    <h2>Your comment...</h2>
    <div class="Input">
      <table>
        <tbody>
          <tr>
            <td class="label">
              Nickname<input id="data.nickname" v-model="nickname">
            </td>
            <td class="label">
              Email<input id="data.email" v-model="email">
            </td>
            <td class="label">
              <button :disabled="buttonFinal" @click="postComment">
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="InputBox">
        <p>Comment</p>
        <textarea id="data.content" v-model="content" placeholder="Your comment..." />
      </div>
    </div>
    <div v-if="currComment" class="CurrComments">
      <div v-if="currComment.data.length != 0">
        <div v-for="x in currComment.data" :key="x">
          <hr>
          <image :src="'https://www.gravatar.com/avatar/'+md5(x.email)" />
          <p>{{ x.nickname }} {{ x.time }}</p>
          <p>{{ x.content }}</p>
        </div>
      </div>
      <div v-else>
        No comments yet! Post your comment now!
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
    const url = 'http://121.5.165.232:10001?path=' + this.path
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

      this.content = null
      this.buttonDisabled = false
      async function reFetch (path) {
        const url = 'http://121.5.165.232:10001?path=' + path
        this.currComment = await fetch(url).then(response => response.json())
      }
      setTimeout(reFetch(this.path), 8000)
    }
  }
}
</script>

<style scoped>
.Comments{
    margin: 0 auto;
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

.Input table tbody tr .label{
    text-align: center;
}

.InputBox{
    text-align: center;
}

.InputBox textarea{
    width: 590px;
    height: 100px;
    padding: 5px;
    margin: 0 auto;
}

.CurrComments div div hr{
  margin: 10px 0;
  background-color: red;
}
</style>
