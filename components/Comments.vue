<template>
  <div class="Comments">
    <h2>Your comment...</h2>
    <div class="Input">
      <table>
        <tr>
          <td class="label">
            Nickname<input name="data.nickname">
          </td>
          <td class="label">
            Email<input name="data.email">
          </td>
          <td class="label">
            <button>Submit</button>
          </td>
        </tr>
      </table>
      <div class="InputBox">
        <p>Comment</p>
        <textarea name="data.content" placeholder="Your comments..." />
      </div>
    </div>
    <div class="CurrComments">
      curr // TODO
    </div>
  </div>
</template>

<script>
export default ({
  data () {
    return {
      currComment: null
    }
  }
})
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

.Input table tr .label{
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
</style>
