<template>
	<div id="gomoku">
    <p class="now">{{tip}}</p>
    <div class="chessboard">
      <i 
        class="icon-sound" 
        @click="toggleBackgroundAudio()" 
        :class="{max:backgroundAudio,mute:!backgroundAudio}"></i>
      <span
        v-if="history.length > 0" 
        class="activeChess" 
        :class='color' 
        :style="{'margin-top': history[history.length-1][0] * 40 - 5 + 'px' ,'margin-left': history[history.length-1][1] * 40 - 5 + 'px'}">
      </span>
      <span 
        class="activeChess" 
        v-for="chess in wingChessSet" 
        :class="{b: wing == 'w', w: wing == 'b'}" 
        :style="{'margin-top': chess[0] * 40 - 5 + 'px' ,'margin-left': chess[1] * 40 - 5 + 'px'}">
      </span>
      <canvas class="background" width="640" height="640" ref="canvas"></canvas>
      <dt ref="dt">
        <dl v-for="r in 15">
          <dd 
            v-for="c in 15" 
            :class="[chessmen[r][c].color,{'w-hover': stage == 'playing' && !chessmen[r][c].color && color == 'w'},{'b-hover': stage == 'playing' && !chessmen[r][c].color && color == 'b'}]" 
            @click="move(r,c)"></dd>
        </dl>
      </dt>
    </div>
    <ul class="btns">
      <li :class="{active: stage == 'playing' && history.length > 0}" @click="regret()">悔棋</li>
      <li :class="{active: stage=='playing'}" @click="givein()">认输</li>
      <li :class="{active: stage!=='playing'}" @click="start()">开始</li>
      <li :class="{active: stage=='playing'}" @click="draw()">和棋</li>
    </ul>
    <div style="display:none">   
      <audio src="audio/chess_move.mp3" preload="auto" ref="audioMove"></audio>
      <audio src="audio/end.mp3" preload="auto" ref="audioEnd"></audio>
      <audio src="audio/click.mp3" preload="auto" ref="audioClick"></audio>
      <audio src="audio/start.mp3" preload="auto" ref="audioStart"></audio>
      <audio src="audio/background.mp3" preload="auto" ref="audioBackground" autoplay loop></audio>
    </div>
	</div>
</template>

<script>

	export default {
		name: 'gomoku',
    created(){
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
    mounted() {
      this.ctx = this.$refs.canvas.getContext('2d')
      let ctx = this.ctx
      let w = 40 //格子边长
      let star = 4 //星半径

      ctx.fillStyle = 'rgba(255,150,50,0.1)'
      ctx.fillRect(w/2,w/2,w * 15,w * 15)



      ctx.beginPath()

      ctx.fillStyle = '#333'
      ctx.strokeStyle = '#333'

      //格子
      for (let r = w; r <= w * 15; r += w) {
        ctx.moveTo(r, w)
        ctx.lineTo(r, w * 15)
      }
      for (let c = w; c <= w * 15; c += w) {
        ctx.moveTo(w, c)
        ctx.lineTo(w * 15, c)
      }

      //星
      ctx.fillRect(w*8-star, w*8-star, 2*star, 2*star)
      ctx.fillRect(w*4-star, w*4-star, 2*star, 2*star)
      ctx.fillRect(w*4-star, w*12-star, 2*star, 2*star)
      ctx.fillRect(w*12-star, w*4-star, 2*star, 2*star)
      ctx.fillRect(w*12-star, w*12-star, 2*star, 2*star)

      ctx.stroke()

      //文字
      ctx.font = '20px serif'
      ctx.textAlign = 'center'
      var letters = ['A','B','C','D','E','F','G','H','I','G','K','L','M','N','O']
      letters.forEach((letter,index)=>{
        ctx.fillText(letter,(index+1)*w,w-26)
      })
      for(let i = 1; i <= 15; i++) {
        ctx.fillText(i,w-32,i*w+6)
      }

    },
    data() {
      return {
        color:'b',
        wing: null,
        stage: 'wait', // wait playing end
        wingChess:[],
        history: [],
        backgroundAudio: true //
      }
    },
    computed:{
      chineseColor() {
        if (this.color == 'b') {
          return '黑'
        } else {
          return '白'
        }
      },
      //去重
      wingChessSet() {
        return this.wingChess.filter((nowChess,nowIndex)=> {
          return !this.wingChess.some((lastChess,lastIndex)=>{
            return lastIndex > nowIndex && nowChess[0] == lastChess[0] && nowChess[1] == lastChess[1]
          })
        })
      },
      tip() {
        switch (this.wing) {
          case null:
            if (this.stage == 'wait') {
              return '请按开始'
            } else {
              return '执' + this.chineseColor;
            }
          case 'b':
            return '黑棋胜'
          case 'w':
            return '白棋胜'
          case 'bgivein':
            return '黑棋认输，白棋胜'
          case 'wgivein':
            return '白棋认输，黑棋胜'
          case 'draw_225':
            return '棋子落满，和棋'
          case 'draw':
            return '和棋'
          default:
            return ''
        }

      }
    },
    methods:{
      toggleBackgroundAudio(){
        this.backgroundAudio ? this.$refs.audioBackground.pause() : this.$refs.audioBackground.play()
        this.backgroundAudio = !this.backgroundAudio
      },
      log(){
        console.log(this)
      },
      test() {
        let chessmen = this.chessmen
        for (let r in chessmen) {
          r = (+r)
          for (let c in chessmen[r]) {
            c = (+c)

            
            var color = chessmen[r][c].color

            if (color !== null) {

              // 横五个
              if (c < 12 && color == chessmen[r][c+1].color && color == chessmen[r][c+2].color && color == chessmen[r][c+3].color && color == chessmen[r][c+4].color) {
                this.wing = color
                this.wingChess.splice(0,0,[r,c],[r,c+1],[r,c+2],[r,c+3],[r,c+4])
                this.stage = 'end'
                this.$refs.audioEnd.play()
              }

              //竖五个
              if ( r < 12 && color == chessmen[r+1][c].color&& color == chessmen[r+2][c].color&& color == chessmen[r+3][c].color&& color == chessmen[r+4][c].color) {
                this.wing = color
                this.wingChess.splice(0,0,[r,c],[r+1,c],[r+2,c],[r+3,c],[r+4,c])
                this.stage = 'end'
                this.$refs.audioEnd.play()
              }


              //左上斜五个
              if (c < 12 && r < 12 && color == chessmen[r+1][c+1].color&& color == chessmen[r+2][c+2].color&& color == chessmen[r+3][c+3].color && color == chessmen[r+4][c+4].color) {
                this.wing = chessmen[r][c].color
                this.wingChess.splice(0,0,[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3],[r+4,c+4])
                this.stage = 'end'
                this.$refs.audioEnd.play()
              }

              //左下斜五个
              if (r < 12 && c > 4 && chessmen[r+4] && chessmen[r+4][c-4] &&  color == chessmen[r+1][c-1].color&& color == chessmen[r+2][c-2].color&& color == chessmen[r+3][c-3].color && color == chessmen[r+4][c-4].color) {
                this.wing = color
                this.wingChess.splice(0,0,[r,c],[r+1,c-1],[r+2,c-2],[r+3,c-3],[r+4,c-4])
                this.stage = 'end'
                this.$refs.audioEnd.play()
              }
              
            } 
          }
        }

        if (this.history.length === 225) {
          this.wing = 'draw_225'
          this.stage = 'end'
          this.$refs.audioEnd.play()
        }

        this.$forceUpdate()
      },
      toggleColor() {
        if (this.color == 'b') {
          this.color = 'w'
        } else {
          this.color = 'b'
        }
      },
      /**
       * 落子 以左上角为第一行第一列
       * @param  Int r row行
       * @param  Int c column列 
       */
      move(r,c) {

        if (this.stage !== 'playing') {
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

        this.history.push([r,c])
        this.test()
        if (this.stage == 'playing') {
          this.toggleColor()
        }

      },
      start() {
        if (this.stage !== 'playing') {
          this.stage = 'playing'
          this.reset()
          this.$refs.audioStart.play()
        }
      },
      reset() {
        for (let r = 1; r <= 15; r++) {
          for (let c = 1; c <= 15; c++) {
            this.chessmen[r][c] = {
              color: null,
              wing: null
            }
          }
        }
        this.color = 'b'
        this.wing = null
        this.history = []
        this.wingChess = []
      },
      regret() {
        if (this.stage == 'playing' && this.history.length > 0) {
          let lastMove = this.history.pop()
          this.chessmen[lastMove[0]][lastMove[1]].color = null
          this.$forceUpdate()
          this.$refs.audioClick.play()
          this.toggleColor()
        }
      },
      givein() {
        if (this.stage == 'playing') {
          this.wing = this.color + 'givein'
          this.stage = 'end'
          this.$refs.audioEnd.play()
          this.$forceUpdate()
        }
      },
      draw() {
        if (this.stage == 'playing') {
          this.wing = 'draw'
          this.stage = 'end'
          this.$refs.audioEnd.play()
          this.$forceUpdate()
        }
      }
    }
	}
</script>
