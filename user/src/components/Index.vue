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
      <span class="index-sign-span">{{user.sign}}</span>
      <input id="index-sign-input" type="text" maxlength="30" v-model="user.sign"/>
    </p>
    <p>
      性别：
      <select class="index-sex" v-model="user.msg.sex">
        <option  value="male">男性</option>
        <option  value="female">女性</option>
        <option  value="other">其它</option>
        <option  value="secret">保密</option>
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
        }
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
        this.$http.get(this.urlPrefix + 'logoff')
          .then( res=>{
            if (res.body.state === 1) {
              this.$router.push({name:'login'})
            }
          })
      }
    }
  }
</script>