<template>
  <div id='center'>
    <h2 class="center-head" @click="log()">用户中心</h2>
    <div class="center-body">         
      <ul class="center-slide">
        <div class="center-slide-title">用户中心</div>
        <li v-for="child in children" :class="{active: active == child.name}" @click="active = child.name">{{child.chinese}}</li>
      </ul>
      <ul class="center-content">
        <Index v-show="active == 'index'" />
        <Record v-show="active == 'record'" />
      </ul>
    </div>
  </div>

</template>

<script>

  import Index from '../components/Index.vue'
  import Record from '../components/Record.vue'

  export default {
    name: 'center',
    components: {
      Index,
      Record
    },
    created(){
      this.$http.get(this.urlPrefix+'checkLogin').then(res => {
        if (res.body.state == 2001) {
          tip('请先登录','err')
          setTimeout(()=>{
            this.$router.push({name:'login'})
          },500)
        }
      })
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      },
    },
    data(){
      return {
        active: 'index',
        children: [
          {name: 'index', chinese: '首页'},
          {name: 'record', chinese: '操作记录'},
        ]
      }
    },
    methods: {
      log(){console.log(this)}
    },
  }
</script>