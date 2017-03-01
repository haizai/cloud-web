<template>
  <li>
    <h2 class="content-title" @click="log()">
      更换头像
    </h2>
    <div class="face-myface">
      <span>当前头像：</span>
      <img class="face-now" :src="'img/face/defalut/' + face.style + '/' + face.name + '.png'">
    </div>
    <ul class="face-style">
      <li :class="{active: style == 'boy'}" @click="style = 'boy'">男性</li>
      <li :class="{active: style == 'girl'}" @click="style = 'girl'">女性</li>
    </ul>
    <ul class="face-list">

      <li v-for="n in 8" v-if="style == 'boy'">
        <i 
          v-if="face.style == 'boy' && face.name == n" 
          class="icon-success" 
          style="margin-left:150px;margin-top:18px;"></i>
        <img 
          class="face-face" 
          :src="'img/face/defalut/boy/' + n + '.png'" 
          :class="{active: face.style == 'boy' && face.name == n}" 
          @click="setFace('boy',n)">
      </li>

      <li v-for="n in 8" v-if="style == 'girl'">
        <i 
          v-if="face.style == 'girl' && face.name == n" 
          class="icon-success" 
          style="margin-left:150px;margin-top:18px;"></i>
        <img 
          class="face-face" 
          :src="'img/face/defalut/girl/' + n + '.png'" 
          :class="{active: face.style == 'girl' && face.name == n}" 
          @click="setFace('girl',n)">
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
        style: 'boy',
        lastFace: {
          style: null,
          name: null
        },
      }
    },
    created() {
      if (this.face.style == 'girl') {
        this.style = 'girl'
      }
      this.lastFace.style = this.face.style
      this.lastFace.name = this.face.name
    },
    methods: {
      log(){console.log(this)},
      setFace(style,name) {
        if (this.lastFace.style == style && this.lastFace.name == name) {
          tip('头像相同','info')
          return
        }
        this.face.style = style
        this.face.name = name
        this.$http.post(this.urlPrefix + 'setFace',{style,name}).then(res=>{
          if(res.body.state === 1) {
            tip('头像修改成功')
            this.lastFace.style = this.face.style
            this.lastFace.name = this.face.name
          } else {
            tip('头像修改失败','err')
          }
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