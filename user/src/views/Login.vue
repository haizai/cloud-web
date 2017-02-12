<template>
  <div id="login">
    <h1 @click="log()">login</h1>
    account:<input type="text" v-model="account">
    password:<input type="password" v-model="password">
    <button type="button" @click="checkLogin(account,password)">submit</button>
  </div>
</template>

<script>

  export default {
    name: 'user',
    data() {
      return {
        account: '',
        password: ''
      }
    },
    methods: {
      log() {
        console.log(this)
      },
      checkLogin(account, password) {
        let url = process.env.NODE_ENV === 'production' ? '/ajax/user/login' : 'http://localhost/ajax/user/login'
          this.$http.get(url,{params:{account,password}})
          .then(res => {
            if (res.body.state === 1) {
              this.$http.get('http://localhost/ajax/user/getProAndCity')
            }
          }, err => console.error(err))
      }
    }
  }
</script>


