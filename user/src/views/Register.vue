<template>
  <div id="register">
    <h2 class="login-head">注册Haizainai</h2>
    <div class="login-body">
      <div class="login-line">
        <label>用户名</label><input type="text" v-model="account" maxlength="16" @blur="checkAccount()">
        <p class="login-line-tip" :class="accountClass">{{accountTip}}</p>
      </div>
      <div class="login-line">
        <label>密码</label><input type="password" v-model="password" maxlength="16">
      </div>
      <div class="login-line">
        <label>确认密码</label><input type="password" v-model="passwordRepeat" maxlength="16">
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
    name: 'register',
    data() {
      return {
        account: '',
        accountTip: '',
        accountClass: '',
        password: '',
        passwordRepeat: ''
      }
    },
    methods: {
      log() {
        console.log(this)
      },
      checkAccount() {
        if (this.account == '') {
          this.accountTip = '请输入用户名'
          this.accountClass = 'error'
          return
        }
        if (this.account.length < 4 || this.account.length > 16) {
          this.accountTip = '用户名应在4到16个字符之间'
          this.accountClass = 'error'
          return 
        }

        if(!/^[\dA-z]+$/.test(this.account)) {
          this.accountTip = '用户名应该仅使用英文或数字'
          this.accountClass = 'error'
          return
        }

        let url = process.env.NODE_ENV === 'production' ? '/ajax/user/checkAccount' : 'http://localhost/ajax/user/checkAccount'
        this.$http.get(url,{params:{account:this.account}}).then(res => {
          if (res.body.state == 1) {
            this.accountTip = '用户名可用'
            this.accountClass = 'success'
          }
          if (res.body.state == 3002) {
            this.accountTip = '用户名已存在'
            this.accountClass = 'error'
          }
        }, err => console.error(err))
      }
    }
  }
</script>