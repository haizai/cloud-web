<template>
  <li>
    <h2 class="content-title" @click="log()">
      更换头像
    </h2>
    <div class="face-myface">
      <span>当前头像：</span>
      <img class="face-now" :src="'img/face/defalut/' + face.style + '/' + face.name + '.png'">
    </div>
    <ul class="face-type">
      <li>男性</li>
      <li>女性</li>
    </ul>
    <ul class="face-list">
      <li v-for="n in 8">
        <i v-if="face.style == 'boy' && face.name == n" class="icon-success" style="margin-left:150px;margin-top:18px;"></i>
        <img class="face-face" :src="'img/face/defalut/boy/' + n + '.png'" :class="{active: face.style == 'boy' && face.name == n}" @click="setFace('boy',n)">
      </li>
    </ul>
  </li>
</template>

<script>

  export default {
    name: 'face',
    props:['face','urlPrefix'],
    data() {
      return {

      }
    },
    created() {

    },
    methods: {
      log(){console.log(this)},
      setFace(style,name) {
        this.face.style = style
        this.face.name = name
        this.$http.post(this.urlPrefix + 'setFace',{style,name}).then(res=>{
          console.log(res)
        })
      }
    },
    computed: {
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      }
    }
  }
</script>