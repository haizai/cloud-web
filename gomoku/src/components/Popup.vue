<template>
  <div class="popup" v-show="isShow">
    <div class="popup-cont">
      <p class="popup-text">{{text}}</p>
      <div class="popup-bottom">
        <span class="popup-btn confirm" @click="confirm">确定</span><!--
     --><span class="popup-btn cancel" @click="cancel">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'popup',
    data() {
      return {
        isShow: false,
        text: '',
        fn: null
      }
    },
    created() {
      this.$on('popup', (text, fn) => {
        this.text = text
        this.isShow = true
        this.fn = fn
      })
    },
    methods: {
      cancel() {
        this.text = ''
        this.isShow = false
        this.fn = null
      },
      confirm() {
        this.fn()
        this.cancel()
      }
    }
  }
</script>