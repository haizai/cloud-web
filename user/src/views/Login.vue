<template>
  <div id="login">
    <h2 class="login-head" @click="log()">登录</h2>
    <div class="login-body">
      <div class="login-line">
        <label>用户名</label><input type="text" v-model="account" maxlength="16" autocomplete="new-password">
      </div>
      <div class="login-line">
        <label>密码</label><input type="password" v-model="password" maxlength="16" @keydown.enter="login()" autocomplete="new-password">
      </div>
      <div class="login-small">
        <input type="checkbox" id="saveAccount" v-model="saveAccount"><label for="saveAccount">记住用户名</label>
        <input type="checkbox" id="autoLogin" v-model="autoLogin"><label for="autoLogin">下次自动登录</label>
      </div>
      <div class="login-line">
        <a href="javascript:;" class="login-btn login-submit" @click="login()">登入</a>
        <a href="javascript:;" class="login-btn login-reg"  @click="$router.push({name: 'register'})">注册</a>
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
        password: '',
        saveAccount: false,
        autoLogin: false,
      }
    },
    created(){
      this.$http.get(this.urlPrefix+'checkLogin').then(res => {
        if (res.body.state == 2002) {
          tip('你已登录，请先退出','err')
          setTimeout(()=>{
            this.$router.push({name:'center'})
          },500)
        } else {
          let account = window.localStorage.getItem('haizai_account')
          let password = window.localStorage.getItem('haizai_password')
          if (account) {
            this.saveAccount = true,
            this.account = account
          }
          if (password) {
            this.$http.get(this.urlPrefix+'login',{params:{account,password}}).then(res => {
              if (res.body.state == 1) {
                tip('自动登录成功')
                this.$router.push({name:'center'})
              } else {
                window.localStorage.remove('haizai_password')
              }
            })
          }
        }
      })
    },
    watch: {
      saveAccount(val){
        if (!val) this.autoLogin = false
      },
      autoLogin(val) {
        if (val) this.saveAccount = true
      }
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      },
    },
    methods: {
      log(){
        console.log(this)
      },
      login() {
        this.saveAccount ? window.localStorage.setItem('haizai_account',this.account) : window.localStorage.removeItem('haizai_account')
        tip('登入中...','info',500)
        this.$http.get(this.urlPrefix+'login',{params:{account:this.account,password:this.password}}).then(res => {
          switch (res.body.state) {
            case 1:
              this.autoLogin ? window.localStorage.setItem('haizai_password',this.password) : window.localStorage.removeItem('haizai_password')
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