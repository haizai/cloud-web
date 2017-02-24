<template>
  <li>
    <h2 class="content-title" @click="log()">
      更换头像
    </h2>
    <div class="face-myface">
      <span>当前头像：</span>
      <img class="face-now" src="img/face/defalut/boy/boy_1.png">
    </div>
    <ul class="face-type">
      <li>男性</li>
      <li>女性</li>
    </ul>
    <img class="face-face" v-for="boy in boys" :src="'img/face/defalut/boy/' + boy + '.png'">
  </li>
</template>

<script>

  export default {
    name: 'face',
    data() {
      return {
        boys:['boy_1','boy_2','boy_3','boy_4','boy_5','boy_6','boy_7','boy_8'],
        girls:['girl_1','girl_2','girl_3','girl_4','girl_5','girl_6','girl_7','girl_8']
      }
    },
    created() {

    },
    methods: {
      log(){console.log(this)},
    },
    computed: {
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      }
    }
  }
</script>