<template>
  <div id="login">
    <h2 class="login-head">登入Haizainai</h2>
    <div class="login-body">
      <div class="login-line">
        <label>用户名</label><input type="text" v-model="account" maxlength="16">
      </div>
      <div class="login-line">
        <label>密码</label><input type="password" v-model="password" maxlength="16" @keydown.enter="checkLogin(account, password)">
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
        tip('登入中...','info',500)
        let url = process.env.NODE_ENV === 'production' ? '/ajax/user/login' : 'http://localhost/ajax/user/login'
          this.$http.get(url,{params:{account,password}})
          .then(res => {
            switch (res.body.state) {
            case 1:
              tip('登入成功，即将自动转跳')
              setTimeout(()=>{
                this.$router.push({name: 'center'})
              }, 1000)
              break;
            case 1001:
              tip('用户名为空','err')
              break;
            case 1002:
              tip('密码为空','err')
              break;
            case 1003:
             tip('用户名不存在','err')
              break;
            case 1004:
              tip('密码错误','err')
              break;
            case 3001:
              tip('数据库错误','err')
              break;
            default:
              tip('未知错误','err')
              break;
            }
          }, err => console.error(err))
      }
    }
  }
</script>