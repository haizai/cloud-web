<template>
  <div id='center'>
    <h2 class="center-head" @click="log()">用户中心</h2>
    <div class="center-body">         
      <ul class="center-slide">
        <li>用户中心</li>
        <li class="active">首页</li>
        <li>操作记录</li>
      </ul>
      <ul class="center-content">
        <Index />
        <li id="user-record" style="display: none;">
          <table>
            <tbody>
            </tbody>
          </table>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>

  import Index from '../components/Index.vue'

  export default {
    name: 'center',
    components: {
      Index,
    },
    methods: {
      log(){console.log(this)}
    },
  }
</script>


