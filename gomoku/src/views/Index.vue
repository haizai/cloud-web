<template>
  <div>  
    <h2 class="title">五子棋</h2> 
    <a class="big-btn" href="javascript:;" @click="$router.push({name:'outline'})">单机模式</a>
    <a class="big-btn" href="javascript:;" @click="online">联机对战</a>
  </div>
</template>

<script>

  export default {
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/' : 'http://localhost/'
      },
    },
    methods: {
      online() {
        this.$http.get(this.urlPrefix+'ajax/user/checkLogin').then(res => {
          if (res.body.state == 2001) {
            tip('请先登录','err')
            location = '/user#/login'
          } else {
            this.$router.push({name:'online'})
          }
        })
      }
    }
  }
</script>