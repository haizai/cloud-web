<template>
  
<div class="container">
  <h1 @click="log()">room</h1>

  <div class="person" style="top:100px" v-if="other !== null">
    <img class="person-img" :src="'img/face/' + other.face.style + '/' + other.face.name + '.png'">
    <p class="person-account">{{other.account}}</p>
  </div>


  <div class="person" style="top:400px" v-if="me !== null">
    <img class="person-img" :src="'img/face/' + me.face.style + '/' + me.face.name + '.png'">
    <p class="person-account">{{me.account}}</p>
    <p class="person-color">{{color}}</p>
  </div>



  <div id="gomoku" style="margin-left:250px">
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
      <li @click="ready" :class="{active: ableRealy}">开始</li>
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
    data() {
      return {
        me: null,
        other: null,
        color: null,
        wing: null,
        stage: 'wait', // wait playing end
        wingChess:[],
        history: [],
        backgroundAudio: true,
        tip: '请按开始',
        ableRealy: true
      }
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
    methods: {
      log(){
        console.log(this)
      },
      tipComputed(color) {
        let meColor = this.color == 'b' ? '黑' : '白'
        let after = this.color == color ? '请落子' : '等待对方落子'
        return '执' + meColor + ' ' + after
      },
      checkGomoku() {
        this.$http.get(this.urlPrefix+'gomoku/checkGomoku').then(res => {
          if (res.body.text == 'in gomoku') {
            console.log(res.body)
            this.me = res.body.me
            this.other = res.body.other
            this.color = res.body.color
          }
        })
      },
      ready() {
        this.$http.get(this.urlPrefix+'gomoku/ready').then(res => {
          if (res.body.bool) {
            this.ableRealy = false
            if (!res.body.isAllReady) {
              this.waitRealy()
              this.tip = '请等待对方开始'
            } else {
              console.log('AllReady')
              this.tip = this.tipComputed('b')
            }
          }
        })
      },
      waitRealy() {
        this.$http.get(this.urlPrefix+'gomoku/getRoomStage').then(res => {

          console.log(res.body)

          if (res.body.bool == true) {

            if (res.body.stage == "wait") {
              setTimeout(()=>{
                this.waitRealy()
              },1000)
            } else if (res.body.stage == "playing") {
              console.log('AllReady')
              this.tipComputed('b')
            }
          }

        })
      }
    }
  }
</script>