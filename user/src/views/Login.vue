<template>
  <div id="login">
    <h2 class="login-head">登入Haizainai</h2>
    <div class="login-body">
      <div class="login-line">
        <label>用户名</label><input type="text" v-model="account" maxlength="16">
      </div>
      <div class="login-line">
        <label>密码</label><input type="password" v-model="password" maxlength="16">
      </div>
      <div class="login-line">
        <div class="login-btn login-submit" @click="checkLogin(account, password)">登入</div>
        <div class="login-btn login-reg">注册</div>
      </div>
    </div>
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
              console.log('login')
              this.$router.push({name: 'center'})
            }
          }, err => console.error(err))
      }
    }
  }
</script>


