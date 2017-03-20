<template>
  
<div class="container">
  <h1 @click="log()">room</h1>

  <div class="person" style="top:140px" v-if="other !== null">
    <img class="person-img" :src="'img/face/' + other.face.style + '/' + other.face.name + '.png'">
    <p class="person-account">{{other.account}}</p>
    <div v-show="stage=='playing' && color!==nowColor" class="person-chess" :class="toggleColor(color)"></div>
    <p class="person-p">比分：<span>{{otherScore}}</span></p>
  </div>


  <div class="person" style="top:420px" v-if="me !== null">
    <img class="person-img" :src="'img/face/' + me.face.style + '/' + me.face.name + '.png'">
    <p class="person-account">{{me.account}}</p>
    <div v-show="stage=='ready' || (stage=='playing' && color===nowColor)" class="person-chess" :class="color"></div>
    <p class="person-p">比分：<span>{{meScore}}</span></p>
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
      <li @click="ready" :class="{active: stage=='wait'|| stage=='end'}">开始</li>
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
        meScore: 0,
        other: null,
        otherScore: 0,
        color: null,
        wing: null,
        stage: 'wait', // wait ready playing end
        wingChess:[],
        backgroundAudio: true,
        nowColor:'b',
        activeChess: [{
          r: null,
          c: null,
          color: null
        }],
        history:[]
      }
    },
    computed:{
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/' : 'http://localhost/ajax/'
      },
      tipComputed() {
        // let meColor = this.color == 'b' ? '黑' : '白'

        switch (this.stage) {
          case 'wait':
            return '请按开始'
          case 'ready':
            return '等待对方开始'
          case 'playing':
            return this.color == this.nowColor ? '请落子' : '等待对方落子'
          case 'end':
            if (this.wing == this.color) {
              return '你贏了'
            } else if (this.wing == 'draw_225') {
              return '棋子落满，和棋'
            } else {
              return '你输了'
            }
          default: 
            return 'unknown'
        }        
      },
    },
    created(){
      this.checkGomoku()
      this.resetChess()
    },
    methods: {
      resetChess() {
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
      log(){
        console.log(this)
      },
      toggleColor(color) {
        if (color == 'b') {
          return 'w'
        } else {
          return 'b'
        }
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
        if (this.stage == 'wait' || this.stage == 'end') {

          if (this.stage == 'end') {
            this.color = this.toggleColor(this.color)
            this.wing = null,
            this.activeChess = [{r: null,c: null,color: null}]
            this.nowColor = 'b'
            this.resetChess()
          }
          this.$refs.audioClick.play()
          this.stage = 'ready'
          
          this.$forceUpdate()
          this.$http.get(this.urlPrefix+'gomoku/ready').then(res => {
            if (res.body.bool) {
              this.start()
            }
          })
        }
      },
      start() {
        this.$refs.audioStart.play()
        this.stage = 'playing'
        this.nowColor = 'b'
        if (this.color == 'w') {
          this.waitMove()
        }
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
        
        this.showMove(r,c)
        this.$http.post(this.urlPrefix+'gomoku/move',{r,c}).then( res => {
          if (res.body.bool) {
            console.log(r,c,'move',res.body)

            if (res.body.text == 'continue') {
              this.waitMove()
            } else {
              this.end(res.body)
            }
          }
        })
      },
      waitMove() {
        this.$http.get(this.urlPrefix+'gomoku/waitMove').then( res => {
          if (res.body.bool) {
            console.log('waitMove',res.body)
            if (res.body.text == 'continue') {
              this.showMove(res.body.r, res.body.c)
            } else {
              this.chessmen[res.body.r][res.body.c].color = this.nowColor
              this.end(res.body)
            }
          }
        })
      },
      showMove(r,c) {
        this.chessmen[r][c].color = this.nowColor
        this.nowColor = this.toggleColor(this.nowColor)
        this.activeChess = [{r, c, color: this.nowColor}]
      },
      end(obj) {
        this.wing = obj.wing
        this.meScore = obj.score[this.me.account]
        this.otherScore = obj.score[this.other.account]
        this.activeChess = obj.wingChess.map( chess => {
          let color = this.toggleColor(obj.wing)
          return {r: chess[0],c: chess[1],color}
        })
        this.stage = 'end'
        this.$refs.audioEnd.play()
      }
    }
  }
</script>