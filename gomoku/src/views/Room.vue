<template>
  
<div>
  <h1>room</h1>
  <div id="gomoku" style="margin-left: 160px;">
    <p class="now">{{tip}}</p>
    <div class="chessboard">
      <i 
        class="icon-sound"></i>
      <span
        v-if="history.length > 0" 
        class="activeChess" >
      </span>
      <span 
        class="activeChess" >
      </span>
      <Board/>
      <dt ref="dt">
        <dl v-for="r in 15">
          <dd 
            v-for="c in 15" 
            :class="[chessmen[r][c].color,{'w-hover': stage == 'playing' && !chessmen[r][c].color && color == 'w'},{'b-hover': stage == 'playing' && !chessmen[r][c].color && color == 'b'}]" 
            ></dd>
        </dl>
      </dt>
    </div>
    <ul class="btns">
      <li>悔棋</li>
      <li>认输</li>
      <li>开始</li>
      <li>和棋</li>
    </ul>
    <div style="display:none">   
      <audio src="audio/chess_move.mp3" preload="auto" ref="audioMove"></audio>
      <audio src="audio/end.mp3" preload="auto" ref="audioEnd"></audio>
      <audio src="audio/click.mp3" preload="auto" ref="audioClick"></audio>
      <audio src="audio/start.mp3" preload="auto" ref="audioStart"></audio>
      <audio src="audio/background.mp3" preload="auto" ref="audioBackground"></audio>
    </div>
  </div>

</div>

</template>

<script>

  import Board from '../components/Board.vue'

  export default {
    name: 'outline',
    components: {
      Board
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/' : 'http://localhost/ajax/'
      },
    },
    created(){
      this.checkGomoku()
      let obj = {}, r = 1, c = 1
      for (let r = 1; r <= 15; r++) {
        obj[r] = {}
        for (let c = 1; c <= 15; c++) {
          obj[r][c] = {
            color: null,
            wing: null
          }
        }
      }
      this.chessmen = obj
    },
    data() {
      return {
        color:'b',
        wing: null,
        stage: 'wait', // wait playing end
        wingChess:[],
        history: [],
        backgroundAudio: true,
        tip: '请按开始'
      }
    },
    methods: {
      checkGomoku() {
        this.$http.get(this.urlPrefix+'gomoku/checkGomoku').then(res => {
          console.log(res.body)
        })
      }
    }
  }
</script>