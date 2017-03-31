<template>
  
<div class="container">
  <Popup ref="popup"></Popup>
  <h1 @click="log()">room</h1>

  <div class="person" style="top:140px" v-if="other.ready !== null">
    <img class="person-img" :src="'img/face/' + other.face.style + '/' + other.face.name + '.png'">
    <p class="person-account">{{other.account}}</p>
    <div v-show="((stage=='wait' || stage=='end') && other.ready) || (stage=='playing' && color!==nowColor)" class="person-chess" :class="toggleColor(color)"></div>
    <p class="person-p">本局比分：<span>{{otherScore}}</span></p>
  </div>


  <div class="person" style="top:420px" v-if="me.ready!== null">
    <img class="person-img" :src="'img/face/' + me.face.style + '/' + me.face.name + '.png'">
    <p class="person-account">{{me.account}}</p>
    <div v-show=" (stage=='wait' && me.ready) || (stage=='playing' && color===nowColor)" class="person-chess" :class="color"></div>
    <p class="person-p">本局比分：<span>{{meScore}}</span></p>
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
      <li @click="tryRegret" :class="{active: stage=='playing' && history.length > 2}">悔棋</li>
      <li @click="givein" :class="{active: stage=='playing'}">认输</li>
      <li @click="ready" :class="{active: (stage=='wait' && !me.ready)|| stage=='end'}">开始</li>
      <li @click="tryDraw" :class="{active: stage=='playing'}">求和</li>
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
  import Popup from '../components/Popup.vue'


  export default {
    name: 'room',
    props:['socket'],
    components: { Board, Popup },
    data() {
      return {
        me: {
          ready: null
        },
        meScore: 0,
        other: {
          ready: null
        },
        otherScore: 0,
        color: null, // 自己的颜色
        wing: null,
        stage: 'wait', // wait playing end
        wingChess:[],
        backgroundAudio: true,
        nowColor:'b', //后台为color
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
        return process.env.NODE_ENV === 'production' ? '/' : 'http://localhost/'
      },
      tipComputed() {
        // let meColor = this.color == 'b' ? '黑' : '白'

        switch (this.stage) {
          case 'wait':

            if (this.me) {
              if (!this.me.ready) {
                return '请按开始'
              } else {
                return '请等待对方开始'
              }
            } else {
              return 'loading...'
            }

          case 'playing':
            return this.color == this.nowColor ? '请落子' : '等待对方落子'
          case 'end':
            switch (this.wing) {
              case this.color: 
                return '你贏了'
              case 'draw_225': 
                return '棋子落满，和棋'
              case 'draw': 
                return '双方和棋'
              case 'meGivein': 
                return '你投子认负'
              case 'otherGivein': 
                return '对方投子认负'
              default: 
                return '你贏了'
            }
          default: 
            return 'unknown'
        }        
      },
    },
    created(){
      this.num = this.$route.params.num
      this.socket.emit('checkGomoku')
      this.socketListener()
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
      end() {
        this.stage = 'end'
        this.tryAudioPlay(this.$refs.audioEnd)
        this.me.ready = false
        this.other.ready = false
      },
      reset() {
        this.wing = null,
        this.activeChess = [{r: null,c: null,color: null}]
        this.nowColor = 'b'
        this.stage = 'wait'
        this.history = []
        this.resetChess()
      },
      log(){
        console.log(this)
      },
      //防止未知原因play()报错
      tryAudioPlay(audio) {
        try {
          audio.play()
        } catch(e) {
          console.log('error tryAudioPlay',e);
        }
      },
      toggleColor(color) {
        if (color == 'b') {
          return 'w'
        } else {
          return 'b'
        }
      },
      socketListener() {


        this.socket.on('err', o=> {
          console.log('err',o)
          if (o.text == 'not login' || o.text == 'not enter room') {
            this.$router.push({name: 'online'})
          }
        })


        this.socket.on('user', o=> {
          console.log('user',o)
          this.color = o.color
          this.me = o.me
          this.other = o.other
        })

        this.socket.on('otherReady', ()=> {
          this.other.ready = true
          this.tryAudioPlay(this.$refs.audioClick)
        })

        this.socket.on('allReady', ()=> {
          this.start()
        })

        this.socket.on('otherMove', o=> {
          console.log('otherMove',o)
          this.tryAudioPlay(this.$refs.audioMove)
          this.showMove(o.r, o.c)
        })

        this.socket.on('otherGivein', ()=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'alert',
            text: '对方投子认负，你赢了！',
            confirm: () => {
              this.meScore++
              this.wing = 'otherGivein'
              this.end()
            }
          })
        })

        this.socket.on('otherTryDraw', ()=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'confirm',
            text: '对方求和，是否同意？',
            confirmText: '同意',
            cancelText: '拒绝',
            confirm: () => {
              this.socket.emit('agreeDraw')
              this.wing = 'draw'
              this.end()
            },
            cancel: () => {
              this.socket.emit('refuseDraw')
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        })

        this.socket.on('otherTryRegret', color=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'confirm',
            text: '对方请求悔棋，是否同意？',
            confirmText: '同意',
            cancelText: '拒绝',
            confirm: () => {
              this.socket.emit('agreeRegret',color)
              this.regret(color)
            },
            cancel: () => {
              this.socket.emit('refuseRegret')
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        })

        this.socket.on('otherAgreeDraw', ()=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'alert',
            text: '对方同意你的悔棋。',
            confirm: () => {
              this.wing = 'draw'
              this.end()
            },
          })
        })

        this.socket.on('otherAgreeRegret', color=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'alert',
            text: '对方同意你的悔棋。',
            confirm: () => {
              this.regret(color)
            },
          })
        })

        this.socket.on('otherRefuseDraw', o=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'alert',
            text: '对方拒绝你的求和。',
            confirm: ()=>{
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        })

        this.socket.on('otherRefuseRegret', o=> {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'alert',
            text: '对方拒绝你的悔棋。',
            confirm: ()=>{
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        })

        this.socket.on('end', o=> {
          this.end()
          this.wing = o.wing
          if (o.r) {
            this.chessmen[o.r][o.c].color = this.wing
          }
          this.meScore = o.score[this.me.account]
          this.otherScore = o.score[this.other.account]
          this.activeChess = o.wingChess.map( chess => {
            let color = this.toggleColor(o.wing)
            return {r: chess[0],c: chess[1],color}
          })
        })
      },
      ready() {
        if ((this.stage == 'wait' && !this.me.ready) || this.stage == 'end') {

          if (this.stage == 'end') {
            this.reset()
          }
          this.tryAudioPlay(this.$refs.audioClick)
          this.me.ready = true

          this.socket.emit('ready')
        }
      },
      start() {
        this.tryAudioPlay(this.$refs.audioStart)
        this.stage = 'playing'
        this.nowColor = 'b'
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
        // this.chessmen[r][c].color = this.color

        this.tryAudioPlay(this.$refs.audioMove)
        
        this.showMove(r,c)

        this.socket.emit('move', {r,c})

      },
      showMove(r,c) {
        this.chessmen[r][c].color = this.nowColor
        this.nowColor = this.toggleColor(this.nowColor)
        this.activeChess = [{r, c, color: this.nowColor}]
        this.history.push([r,c])
      },
      givein() {
        if (this.stage =='playing') {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'confirm',
            text: '你确定要认输吗？',
            confirm: () => {
              this.socket.emit('givein')
              this.otherScore++
              this.wing = 'meGivein'
              this.end()
            },
            cancel: () => {
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        }
      },
      tryDraw() {
        if (this.stage =='playing') {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'confirm',
            text: '你确定要求和吗？',
            confirm: () => {
              this.socket.emit('tryDraw')
              this.tryAudioPlay(this.$refs.audioClick)
            },
            cancel: () => {
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        }
      },
      tryRegret() {
        if (this.stage =='playing' && this.history.length > 2 ) {
          this.tryAudioPlay(this.$refs.audioClick)
          this.$refs.popup.$emit('popup', {
            type: 'confirm',
            text: '你确定要悔棋吗？',
            confirm: () => {
              this.socket.emit('tryRegret', this.color)
              this.tryAudioPlay(this.$refs.audioClick)
            },
            cancel: () => {
              this.tryAudioPlay(this.$refs.audioClick)
            }
          })
        }
      },
      regret(color) {
        let regretCount = this.nowColor == color ? 2 : 1;
        let regretChessmen = this.history.splice(-regretCount, regretCount)

        // 将后退的步重置颜色
        regretChessmen.forEach( item => {
          this.chessmen[item[0]][item[1]].color = null
        })

        // 当前颜色
        this.nowColor = color


        let activeChess = this.history[this.history.length-1]
        this.activeChess = [{
          r: activeChess[0], 
          c: activeChess[1], 
          color: this.nowColor
        }]

      }
    }
  }
</script>