<template>
  <div id="register">
    <h2 class="login-head">注册</h2>
    <div class="login-body">
      <div class="login-line">
        <label>用户名</label><input type="text" v-model="account" maxlength="16" @blur="checkAccount()" placeholder="4到16位英文或数字字符">
        <p class="login-line-tip" :class="accountClass">{{accountTip}}</p>
      </div>
      <div class="login-line">
        <label>密码</label><input type="password" v-model="password" maxlength="16" @keyup="checkPassword()" placeholder="6到16位英文或数字字符">
        <p class="login-line-tip error" v-show="passwordStrength == 0">{{passwordTip}}</p>
        <div class="login-line-tip" :class="{error: passwordStrength == 1,success: passwordStrength > 1}"  v-show="passwordStrength > 0 ">
          密码强度：
          <div class="password-strength">
            <div class="password-strength-1" v-show="passwordStrength == 1">1</div>
            <div class="password-strength-2" v-show="passwordStrength == 2">2</div>
            <div class="password-strength-3" v-show="passwordStrength == 3">3</div>
          </div>
        </div>
      </div>
      <div class="login-line">
        <label>确认密码</label><input type="password" v-model="passwordRepeat" maxlength="16" @blur="checkPasswordRepeat()">
        <p class="login-line-tip" :class="passwordRepeatClass">{{passwordRepeatTip}}</p>
      </div>
      <div class="login-line">
        <a href="javascript:;" class="login-btn login-submit" @click="register()">注册</a>
        <a href="javascript:;" @click="$router.push({name:'login'})" class="login-btn login-reg">已有账号</a>
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
        passwordTip: '',
        passwordStrength: 0,
        passwordRepeat: '',
        passwordRepeatClass: '',
        passwordRepeatTip: ''
      }
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      },
    },
    watch: {
      // password(val, oldVal) {
      //   if (val == '') {
      //     this.passwordTip = '请输入密码'
      //     this.passwordStrength = 0
      //     return
      //   }
      //   if (!/^[\dA-z]*$/.test(val)) {
      //     this.passwordTip = '密码仅限使用英文或数字'
      //     this.passwordStrength = 0
      //     return
      //   }
      //   if (val.length < 6 && val.length > 0) {
      //     this.passwordTip = '密码应在6到16个字符之间'
      //     this.passwordStrength = 0
      //     return
      //   }
      //   this.passwordStrength = 1
      //   if (val.length == 16) this.passwordStrength++
      //   if (/\d/.test(val) && /[A-z]/.test(val)) this.passwordStrength++
      // }
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
        this.$http.get(this.urlPrefix + 'checkAccount',{params:{account:this.account}}).then(res => {
          if (res.body.state == 1) {
            this.accountTip = '用户名可用'
            this.accountClass = 'success'
          }
          if (res.body.state == 3002) {
            this.accountTip = '用户名已存在'
            this.accountClass = 'error'
          }
        }, err => console.error(err))
      },
      checkPassword() {
        var password = this.password
        if (password == '') {
          this.passwordTip = '请输入密码'
          this.passwordStrength = 0
          return
        }
        if (!/^[\dA-z]*$/.test(password)) {
          this.passwordTip = '密码仅限使用英文或数字'
          this.passwordStrength = 0
          return
        }
        if (password.length < 6 && password.length > 0) {
          this.passwordTip = '密码应在6到16个字符之间'
          this.passwordStrength = 0
          return
        }
        this.passwordStrength = 1
        if (password.length == 16) this.passwordStrength++
        if (/\d/.test(password) && /[A-z]/.test(password)) this.passwordStrength++
      },
      checkPasswordRepeat() {
        if(this.passwordStrength < 2){
          this.passwordRepeatTip = '请先输入合适的密码'
          this.passwordRepeatClass = 'error'
          return
        }
        if(this.passwordRepeat !== this.password){
          this.passwordRepeatTip = '两次密码不一致'
          this.passwordRepeatClass = 'error'
          return
        }
        this.passwordRepeatTip = '两次密码一致'
        this.passwordRepeatClass = 'success'
      },
      register() {
        this.checkAccount()
        this.checkPassword()
        this.checkPasswordRepeat()
        let account = this.account, password = this.password
        if (this.accountClass == 'success' && this.passwordRepeatClass == 'success' && this.passwordStrength > 1) {
          this.$http.post(this.urlPrefix + 'register',{account,password}).then(res=>{
            if (res.body.state == 1 ) {
              tip('注册成功，即将自动登录')
              this.$http.get(this.urlPrefix + 'login',{params:{account,password}}).then(res=>{
                if (res.body.state == 1) {
                  tip('自动登录成功，即将自动转跳')
                  setInterval(()=> {
                    this.$router.push({name:'center'})
                  }, 500)
                } else {
                  tip('自动登录失败，请手动登录','error')
                  setInterval(()=> {
                    this.$router.push({name:'login'})
                  }, 500)
                }
              })
            } else {
              tip('注册失败')
              console.log(res)
            }
          })
        }
      }
    }
  }
</script>