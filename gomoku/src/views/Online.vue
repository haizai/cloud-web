<template>
<div>
  <h1>online</h1>
  <button @click="checkLogin()">checkLogin</button>
  <button @click="getUserInCenter()">getUserInCenter</button>
  <button @click="enterRoom()">enterRoom</button>

</div>
</template>

<script>
  export default {
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/' : 'http://localhost/ajax/'
      },
    },
    methods: {
      checkLogin() {
        this.$http.get(this.urlPrefix+'user/checkLogin').then(res => {
          if (res.body.state == 2001) {
            console.error('请先登录')
          } else {
            console.log('已登录')
          }
        })
      },
      getUserInCenter() {
        this.$http.get(this.urlPrefix+'user/getUserInCenter').then(res => {
          if (res.body.state == 1) {
            console.log(res.body)
          } else {
            console.error(res.body)
          }
        })
      },
      enterRoom() {
        this.$http.get(this.urlPrefix+'gomoku/roomEnter',{params:{num:1}}).then(res => {
          console.log(res.body)

          if (res.body.text == 'b') {
            this.waitOther()
          }
        })
      },
      waitOther() {
        this.$http.get(this.urlPrefix+'gomoku/getRoomStage',{params:{num:1}}).then(res => {

          console.log(res.body)

          if (res.body.bool == true && res.body.stage == "notfull") {
            setTimeout(()=>{
              this.waitOther()
            },1000)
          }
        })
      }
    }
  }
</script>