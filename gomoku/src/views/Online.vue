<template>
<div>
  <h2 class="title">联机对战</h2>
  <a href="javascript:;" style="margin-left:370px;" class="big-btn" @click="tryEnterRoom()">加入房间</a>
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
        tip(obj.text,'err')
      })

      this.socket.on('roomEnter', num=>{
        this.$router.push({name: 'room', params:{num}})
      })


      this.$http.get(this.urlPrefix+'ajax/user/checkLogin').then(res => {
        if (res.body.state == 2001) {
          console.error('请先登录')
          location = '/user#/login'
        } else {
          console.log('已登录')
        }
      })

    },
    methods: {
      tryEnterRoom() {
        this.socket.emit('tryRoomEnter',100)
        tip('等待中','info')
      },
    }
  }
</script>