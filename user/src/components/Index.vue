<template>
  <li class="index">
    <p>
      <span class="index-account" @click="log()">{{user.account}}</span>
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
      <select id="index-pro" v-model="user.msg.proID" @change="setProID()">
        <option value="0">请选择省份</option>
        <option v-for="pro in provinces" :value="pro.proID">{{pro.name}}</option>
      </select>
      <select id="index-city" v-model="user.msg.cityID" v-show="user.msg.proID != 0 && user.msg.proID != 1 && user.msg.proID != 2 && user.msg.proID != 9 && user.msg.proID != 27 && user.msg.proID != 33 && user.msg.proID != 34" @change="setCityID()">
        <option value="0">请选择城市</option>
        <option v-for="city in selectedProCitys" :value="city.cityID">{{city.name}}</option>
      </select>
    </p>
  </li>
</template>

</template>

<script>
  import provinces from '../data/province'
  import citys from '../data/city'

  // provinces.forEach(function(pro){
  //   $('#user-pro').append('<option value="' + pro.proID + '">'+ pro.name +'</option>')
  // })
  // $('#user-pro').on('change',function(e){
  //   var proID = $(this).val()
  //   cityByProID(proID)
  //   $.post('ajax/user/setProID',{proID: proID},function(obj){
  //     if (obj.state == 1) {
  //       proID == 0 ? tip('请选择省份','info') : tip('省份修改成功')
  //     } else {
  //       tip('省份修改失败','err')
  //     }
  //   })
  // })
  // $.get('ajax/user/getProAndCity',function(obj){
  //   if (obj.state == 1) {
  //     $('#user-pro').val(obj.proID)
  //     cityByProID(obj.proID,obj.cityID)
  //   }
  // })

  // $('#user-city').on('change',function(e){
  //   var cityID = $(this).val()
  //   $.post('ajax/user/setCityID',{cityID: cityID},function(obj){
  //     if (obj.state == 1) {
  //       cityID == 0 ? tip('请选择城市','info') : tip('城市修改成功')
  //     } else {
  //       tip('城市修改失败','err')
  //     }
  //   })
  // })


  function cityByProID(proID,cityID) {
    if (proID == 0 || proID == 1 || proID == 2 || proID == 9 || proID == 27 || proID == 33 || proID == 34 ) {
      $('#user-city').hide()
      return
    } 
    $('#user-city').show().empty().append('<option value="0">请选择城市</option>')
    citys.forEach(function(city){
      if(city.proID == proID) {
        $('#user-city').append('<option value="' + city.cityID + '">'+ city.name +'</option>')
      }
    })
    cityID !== void 0 ? $('#user-city').val(cityID) : $('#user-city').val(0)
  }



  export default {
    name: 'index',
    data() {
      return {
        user: {
          msg: {}
        },
        signFocus: false,
        lastSign: null,
        provinces,
        citys,
      }
    },
    created() {
      console.log(this)
      console.log(provinces)
      this.$http.get(this.urlPrefix + 'getUserInCenter')
        .then((res)=>{
          if (res.body.state === 1) {
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
      selectedProCitys() {
        return citys.filter(city=> {
          return city.proID == this.user.msg.proID
        })
      }
    },
    methods: {
      log() {
        console.log(this)
      },
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
        this.$http.post(this.urlPrefix + 'setSign',{sign}).then(res=>{
          res.body.state == 1 ? tip('个性签名修改成功') : tip('个性签名修改失败','err')
        })
      },
      setProID() {
        this.user.msg.cityID = 0
        this.$http.post(this.urlPrefix + 'setProID',{proID: this.user.msg.proID}).then(res=>{
          if (res.body.state == 1) {
            this.user.msg.proID == 0 ? tip('请选择省份','info') : tip('省份修改成功')
          } else {
            tip('省份修改失败','err')
          }
        })
      },
      setCityID() {
        this.$http.post(this.urlPrefix + 'setCityID',{cityID: this.user.msg.cityID}).then(res=>{
          if (res.body.state == 1) {
            this.user.msg.cityID == 0 ? tip('请选择城市','info') : tip('城市修改成功')
          } else {
            tip('城市修改失败','err')
          }
        })
      }
    }
  }

</script>