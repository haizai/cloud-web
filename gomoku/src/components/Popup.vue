<template>
  <div class="popup" v-show="isShow">
    <div class="popup-cont">
      <p class="popup-text">{{text}}</p>
      <div class="popup-bottom">
        <span v-if="type === 'confirm'" class="popup-btn confirm" @click="yes">{{confirmText}}</span><!--
     --><span v-if="type === 'confirm'" class="popup-btn cancel" @click="no">{{cancelText}}</span>
        <span v-if="type === 'alert'" class="popup-btn alert" @click="yes">{{confirmText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'popup',
    data() {
      return {
        type: '', // confirm alert wait
        isShow: false,
        text: '',
        confirm: null,
        cancel: null,
        confirmText: '确定',
        cancelText: '取消',
        confirmWaitText: null
      }
    },
    created() {
      this.$on('popup', o => {
        this.reset()
        this.type = o.type
        this.text = o.text
        this.isShow = true

        if (o.confirm) {
          this.confirm = o.confirm
        }
        if (o.cancel) {
          this.cancel = o.cancel
        }
        if (o.confirmText) {
          this.confirmText = o.confirmText
        }
        if (o.cancelText) {
          this.cancelText = o.cancelText
        }

        if (o.confirmWaitText) {
          this.confirmWaitText = o.confirmWaitText
        }

      })
    },
    methods: {
      yes() {
        if (this.confirm) {
          this.confirm()
        }
        if (this.confirmWaitText) {
          this.text = this.confirmWaitText
          this.type = 'wait'
        } else {
          this.isShow = false
        }
      },
      no() {
        if (this.cancel) {
          this.cancel()
        }
        this.isShow = false
      },
      reset() {
        this.text = ''
        this.fn = null
        this.confirmText = '确定'
        this.cancelText = '取消'
        this.confirm = null
        this.cancel = null
        this.confirmWaitText = null
      }
    }
  }
</script>