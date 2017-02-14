<template>
  <li class="index">
    <p>
      <span class="index-account">{{user.account}}</span>
      <span class="index-uid">uid: <span>{{user.uid}}</span></span>
      <span class="index-position">{{computedPosition}}</span>
      <span class="index-btn" @click="logoff()">注销</span>
    </p>
    <p>注册时间： <span>{{new Date(user.registerTime).toLocaleString()}}</span></p>
    <p>
      个性签名：
      <span class="index-sign-span" @click="signClick()" ref="signSpan">{{user.sign}}</span>
      <input type="text" maxlength="30" v-model="user.sign" ref="signInput" style="display:none" @keydown.enter="$refs.signInput.blur()" @blur="signBlur()"/>
    </p>
    <p>
      性别：
      <select class="index-sex" v-model="user.msg.sex" @change="setSex()">
        <option value="male">男性</option>
        <option value="female">女性</option>
        <option value="other">其它</option>
        <option value="secret">保密</option>
      </select>
    </p>
    <p class="index-location">
      所在地：
      <select id="index-pro">
        <option value="0">请选择省份</option>
      </select>
      <select id="index-city" style="display: none;">
        <option value="0">请选择城市</option>
      </select>
    </p>
  </li>
</template>

</template>

<script>

  export default {
    name: 'index',
    data() {
      return {
        user: {
          msg: {}
        },
        signFocus: false,
        lastSign: null,
      }
    },
    created() {
      console.log(this)
      this.$http.get(this.urlPrefix + 'getUserInCenter')
        .then((res)=>{
          if (res.body.state === 1) {
            console.log(res)
            this.user = res.body.user
          }
        })
    },
    computed: {
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      },
      computedPosition() {
        switch (this.user.position) {
          case 'admin':
            return '管理员'
          case 'member':
            return '正式会员'
          default:
            return '未知'
        }
      },
    },
    methods: {
      logoff() {
        this.$http.get(this.urlPrefix + 'logoff').then( res=>{
          if (res.body.state === 1) {
            tip('注销成功，即将自动转跳')
            setTimeout(()=>{
              this.$router.push({name:'login'})
            },1000)
          } else {
            tip('注销失败','err')
          }
        })
      },
      setSex() {
        this.$http.post(this.urlPrefix + 'setSex',{sex: this.user.msg.sex}).then( res => {
          res.body.state == 1 ? tip('性别修改成功') : tip('性别修改失败','err')
        })
      },
      signClick() {
        this.lastSign = this.user.sign
        this.$refs.signSpan.style.display = 'none'
        let input = this.$refs.signInput
        input.style.display = 'inline-block'
        input.focus()
        input.select()
      },
      signBlur() {
        this.$refs.signSpan.style.display = 'inline-block'
        this.$refs.signInput.style.display = 'none'
        let sign = this.user.sign.trim()
        if (this.lastSign === sign) {
          tip('个性签名尚未修改','info')
          return
        }
        if (sign === '') {
          tip('个性签名修改失败，请勿输入空值','err')
          this.user.sign = this.lastSign
          return
        }
        this.$http.post(this.urlPrefix + '/setSign',{sign}).then(res=>{
          res.body.state == 1 ? tip('个性签名修改成功') : tip('个性签名修改失败','err')
        })
      }
    }
  }

  // $('#user-sign-input').on('blur', function(e){
  //   var val = $(this).val().trim()
  //   if (val === lastSignVal) {
  //     $(this).hide().prev().show()
  //     tip('个性签名尚未修改','info')
  //     return
  //   }
  //   if (val !== ''){
  //     $(this).hide().prev().show().text(val)
  //     $.post('ajax/user/setSign',{sign: val},function(obj){
  //       obj.state == 1 ? tip('个性签名修改成功') : tip('个性签名修改失败','err')
  //     })
  //   } else {
  //     $(this).hide().prev().show()
  //     tip('个性签名修改失败，请勿输入空值','err')
  //   }
  // })
</script>