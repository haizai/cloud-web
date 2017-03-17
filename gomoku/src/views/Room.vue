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
    <p class="now">{{tipComputed}}</p>
    <div class="chessboard">
      <span
        v-for="chess in activeChess"
        class="activeChess" 
        :class='chess.color' 
        :style="{'margin-top': chess.r * 40 - 5 + 'px' ,'margin-left': chess.c * 40 - 5 + 'px'}">
      </span>
      <i class="icon-sound"></i>
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
            :class="[chessmen[r][c].color,{'w-hover': stage == 'playing' && !chessmen[r][c].color && color == 'w' && nowColor == 'w'},{'b-hover': stage == 'playing' && !chessmen[r][c].color && color == 'b' && nowColor == 'b'}]" 
            @click="move(r,c)"
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
<!--       <audio src="audio/background.mp3" preload="auto" ref="audioBackground"></audio> -->
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
        ableRealy: true,
        nowColor:'b',
        activeChess: [{
          r: null,
          c: null,
          color: null
        }],
      }
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/' : 'http://localhost/ajax/'
      },
      tipComputed() {
        let meColor = this.color == 'b' ? '黑' : '白'
        let after = ''
        if (this.stage == 'wait') {

          after = this.tip
          return '执' + meColor + ' ' + after

        } else if (this.stage == 'playing') {

          after = this.color == this.nowColor ? '请落子' : '等待对方落子'
          return '执' + meColor + ' ' + after

        } else if (this.stage == 'end') {

          if (this.wing == this.color) {
            return '你贏了'
          } else if (this.wing == 'draw_225') {
            return '棋子落满，和棋'
          } else {
            return '你输了'
          }
        }
        
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
      checkGomoku() {
        this.$http.get(this.urlPrefix+'gomoku/checkGomoku').then(res => {
          if (res.body.text == 'in gomoku') {
            console.log(res.body)
            this.me = res.body.me
            this.other = res.body.other
            this.color = res.body.color
          } else {
            this.$router.push({name: 'online'})
          }
        })
      },
      ready() {
        this.$refs.audioClick.play()
        this.$http.get(this.urlPrefix+'gomoku/ready').then(res => {
          if (res.body.bool) {
            this.ableRealy = false
            if (!res.body.isAllReady) {
              this.waitRealy()
              this.tip = '请等待对方开始'
            } else {
              this.start()
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
              this.start()
            }
          }

        })
      },
      start() {
        this.$refs.audioStart.play()
        this.stage = 'playing'
        this.nowColor = 'b'
        this.getColor()
      },
      move(r,c) {

        if (this.stage !== 'playing') {
          return
        }
        if (this.color !== this.nowColor) {
          return
        }

        if (this.wing) {
          return
        }
        if (this.chessmen[r][c].color !== null) {
          // console.log(r,c,'已有落子')
          return
        }
        this.chessmen[r][c].color = this.color

        this.$refs.audioMove.play()
        
        this.$http.post(this.urlPrefix+'gomoku/move',{r,c}).then( res => {
          // console.log(res.body)
          if (res.body.bool) {

            let color = this.color == 'b' ? 'w' : 'b'
            this.activeChess = [{r,c,color}]
            this.getColor()

            if(res.body.text == 'continue') {
              this.nowColor = this.nowColor == 'b' ? 'w' : 'b'
            }
          }

        })

      },
      getColor() {
        this.$http.get(this.urlPrefix+'gomoku/getColor').then(res => {

          

          if (res.body.bool == true) {

            if (res.body.stage && res.body.stage == 'end') {
              //一局结束
              console.log('end', res.body)
              let r = res.body.chess[0]
              let c = res.body.chess[1]
              this.chessmen[r][c].color = this.nowColor

              let color = this.nowColor == 'b' ? 'w' : 'b'
              this.activeChess = res.body.wingChess.map( chess => {
                return {r: chess[0],c: chess[1],color}
              });
              this.wing = res.body.wing
              this.stage = 'end'
              this.$refs.audioEnd.play()
              this.$forceUpdate()

            } else {

              console.log('wait',res.body)
              if (res.body.text !== this.color) {
                // 对方未落子
                setTimeout(()=>{
                  this.getColor()
                },1000)
              } else {
                // 对方落子
                if (res.body.chess) {
                  let r = res.body.chess[0]
                  let c = res.body.chess[1]
                  this.chessmen[r][c].color = this.nowColor
                  this.$refs.audioMove.play()
                  this.activeChess = [{r,c,color: this.color}]
                }
                this.nowColor = res.body.text
              }
            }



          }
        })
      }
    }
  }
</script>