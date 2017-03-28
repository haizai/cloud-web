<template>
  <div class="popup" v-show="isShow">
    <div class="popup-cont">
      <p class="popup-text">{{text}}</p>
      <div class="popup-bottom">
        <span v-if="type === 'confirm'" class="popup-btn confirm" @click="confirm">确定</span><!--
     --><span v-if="type === 'confirm'" class="popup-btn cancel" @click="cancel">取消</span>
        <span v-if="type === 'alert'" class="popup-btn alert" @click="confirm">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'popup',
    data() {
      return {
        type: '',
        isShow: false,
        text: '',
        fn: null
      }
    },
    created() {
      this.$on('confirm', (text, fn) => {
        this.type = 'confirm'
        this.text = text
        this.isShow = true
        this.fn = fn
      })
      this.$on('alert', (text, fn) => {
        this.type = 'alert'
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