<template>
  <div id="register">
    <h2 class="login-head">注册</h2>
    <div class="login-body">

      <div class="login-line">
        <label @click="log()">用户名</label>
        <input 
          type="text" 
          :class="accountClass" 
          v-model="account"
          maxlength="16" 
          @blur="checkAccount()" 
          placeholder="4到16位英文或数字字符" 
          autocomplete="new-password">
        <i :class="'icon-' + accountClass"></i>
        <p class="login-line-tip" :class="accountClass">{{accountTip}}</p>
      </div>

      <div class="login-line">
        <label>密码</label>
        <input 
          type="password" 
          :class="{error: passwordStrength == 1 || passwordStrength == 0 ,success: passwordStrength > 1}" 
          v-model="password" 
          maxlength="16" 
          @keyup="checkPassword()"
          @blur="checkPassword()"
          placeholder="6到16位英文及数字字符" 
          autocomplete="new-password">
        <i :class="{'icon-error': passwordStrength == 1 || passwordStrength == 0 ,'icon-success': passwordStrength > 1}"></i>
        <p class="login-line-tip error" v-show="passwordStrength == 0">{{passwordTip}}</p>
        <div 
          class="login-line-tip" 
          :class="{error: passwordStrength == 1,success: passwordStrength > 1}"  
          v-show="passwordStrength > 0 ">
          密码强度：
          <div class="password-strength">
            <div class="password-strength-1" v-show="passwordStrength == 1">1</div>
            <div class="password-strength-2" v-show="passwordStrength == 2">2</div>
            <div class="password-strength-3" v-show="passwordStrength == 3">3</div>
          </div>
        </div>
      </div>

      <div class="login-line">
        <label>确认密码</label>
        <input 
          :class="passwordRepeatClass" 
          type="password" 
          v-model="passwordRepeat" 
          maxlength="16" 
          @blur="checkPasswordRepeat()" 
          autocomplete="new-password">
        <i :class="'icon-' + passwordRepeatClass"></i>
        <p class="login-line-tip" :class="passwordRepeatClass">{{passwordRepeatTip}}</p>
      </div>

      <div class="login-line">
        <label>验证码</label>
        <input 
          type="text" 
          v-model="captchaText" 
          style="width:70px;" 
          :class="captchaClass"
          @blur="checkCaptcha()"
          @keyup="keyupCaptcha()"
          maxlength="4">
        <i :class="'icon-' + captchaClass"></i>
        <p class="login-line-tip" :class="captchaClass">{{captchaTip}}</p>
        <div class="login-catcha tran-ZoomIn" v-html="captchaSvg" @click="getCaptcha()"></div>
        <i class="icon-refresh tran-round" style="left: 366px;top: 10px;" @click="getCaptcha()"></i>
      </div>

      <div class="login-small">
        <input type="checkbox" id="protocol" v-model="protocol" @change="checkProtocol()">
        <label for="protocol" title="其实并没有什么协议" :class="protocolClass">我已经同意《Haizainaive用户协议》</label>
      </div>

      <div class="login-line">
        <a 
          href="javascript:;" 
          class="login-btn" 
          :class="{'login-submit': protocol,'login-other': !protocol}" 
          @click="register()">注册</a>
        <a 
          href="javascript:;" 
          @click="$router.push({name:'login'})" 
          class="login-btn login-other">已有账号</a>
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
        passwordStrength: -1,
        passwordRepeat: '',
        passwordRepeatClass: '',
        passwordRepeatTip: '',
        captchaSvg: '',
        captchaTip: '',
        captchaText:'',
        captchaClass:'',
        protocol: false,
        protocolClass:'',
      }
    },
    created(){
      this.$http.get(this.urlPrefix+'user/checkLogin').then(res => {
        if (res.body.state == 2002) {
          tip('你已登录，请先退出','err')
          setTimeout(()=>{
            this.$router.push({name:'center'})
          },500)
        } else {
          this.getCaptcha()
        }
      })
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/' : 'http://localhost/ajax/'
      },
    },
    methods: {
      log() {
        console.log(this)
      },
      getCaptcha() {
        this.$http.get(this.urlPrefix+'getCaptcha').then(res=>{

          // 将blob转换为text
          var reader = new FileReader()
          reader.readAsText(res.body)
          reader.addEventListener("loadend", ()=>this.captchaSvg = reader.result);
          this.captchaText = ''
        })
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

        if(!/^[\da-zA-Z]+$/.test(this.account)) {
          this.accountTip = '用户名应该仅使用英文或数字'
          this.accountClass = 'error'
          return
        }
        this.$http.get(this.urlPrefix + 'user/checkAccount',{params:{account:this.account}}).then(res => {
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
        if (!/^[\da-zA-Z]*$/.test(password)) {
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
        this.passwordRepeatTip = '两次密码相同'
        this.passwordRepeatClass = 'success'
      },
      checkCaptcha(){
        if (this.captchaText.length === 0) {
          this.captchaTip = '请输入验证码'
          this.captchaClass = 'error'
        } else if (this.captchaText.length !== 4) {
          this.captchaTip = '验证码为4位'
          this.captchaClass = 'error'
        } else {
          this.$http.get(this.urlPrefix+'checkCaptcha',{params:{captcha:this.captchaText.toLowerCase()}}).then(res=>{
            if (res.body.state==1) {
              this.captchaClass = 'success'
              this.captchaTip = '验证码正确'
            } else {
              this.captchaClass = 'error'
              this.captchaTip = '验证码错误'
            }
          })
        }
      },
      keyupCaptcha(){
        if (this.captchaText.length == 4) {
          this.checkCaptcha()
        }
      },
      checkProtocol(){
        this.protocol ? this.protocolClass = 'success' : this.protocolClass = 'error'
      },
      register() {
        this.checkAccount()
        this.checkPassword()
        this.checkPasswordRepeat()
        this.checkCaptcha()
        this.checkProtocol()
        // if (this.passwordStrength < 2) {
        //   tip('密码强度过低','err')
        // }
        let account = this.account, password = this.password,captcha = this.captchaText
        if (this.accountClass == 'success' && this.passwordRepeatClass == 'success' && this.passwordStrength > 1 && this.protocol && this.captchaClass == 'success') {
          this.$http.post(this.urlPrefix + 'user/register',{account,password,captcha}).then(res=>{
            if (res.body.state == 1 ) {
              tip('注册成功')
              setTimeout(()=> {
                this.$http.get(this.urlPrefix + 'user/login',{params:{account,password}}).then(res=>{
                  if (res.body.state == 1) {
                    tip('即将自动登录')
                    setTimeout(()=> this.$router.push({name:'center'}), 1000)
                  } else {
                    tip('自动登录失败，请手动登录','err')
                    setTimeout(()=> this.$router.push({name:'login'}), 1000)
                  }
                })
              },1000)
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