<template>
<div>
  <h1>online</h1>
  <button @click="checkLogin()">checkLogin</button>
  <button @click="getUserInCenter()">getUserInCenter</button>
  <button @click="tryEnterRoom()">tryEnterRoom</button>

</div>
</template>

<script>

  export default {
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/' : 'http://localhost/'
      },
    },
    props:['socket'],
    created() {

      this.socket.on('err', obj=>{
        console.error(obj)
      })

      this.socket.on('roomEnter', num=>{
        this.$router.push({name: 'room', params:{num}})
      })
    },
    methods: {
      checkLogin() {
        this.$http.get(this.urlPrefix+'ajax/user/checkLogin').then(res => {
          if (res.body.state == 2001) {
            console.error('请先登录')
          } else {
            console.log('已登录')
          }
        })
      },
      getUserInCenter() {
        this.$http.get(this.urlPrefix+'ajax/user/getUserInCenter').then(res => {
          if (res.body.state == 1) {
            console.log(res.body)
          } else {
            console.error(res.body)
          }
        })
      },
      tryEnterRoom() {
        this.socket.emit('tryRoomEnter',100)
      },
    }
  }
</script>