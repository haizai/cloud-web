<template>
  <div id="app" class="container">

    <router-view :socket="socket"></router-view>
  </div>  
</template>

<script>
  import io from 'socket.io-client'

	export default {
		name: 'app',
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/' : 'http://localhost/'
      },
    },
    created() {
      this.socket = io(this.urlPrefix + 'gomoku')
    },
	}
</script>
