<template>
	<div id="gomoku">
    <h1 @click="log()">gomoku</h1>
    <p class="now" v-text="tip"></p>
    <div class="chessboard">
      <canvas class="background" width="640" height="640" ref="canvas"></canvas>
      <dt>
        <dl v-for="r in 15">
          <dd v-for="c in 15" :class="chessmen[r][c]" @click="move(r,c)"></dd>
        </dl>
      </dt>
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
          obj[r][c] = null
        }
      }
      this.chessmen = obj
    },
    mounted() {
      this.ctx = this.$refs.canvas.getContext('2d')
      let ctx = this.ctx
      let w = 40 //格子边长
      let star = 4 //星半径

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
        ctx.fillText(letter,(index+1)*w,w-20)
      })
      for(let i = 1; i <= 15; i++) {
        ctx.fillText(i,w-25,i*w+6)
      }

    },
    data() {
      return {
        color:'b',
        wing: null,
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
      tip() {
        switch (this.wing) {
          case null:
            return '执' + this.chineseColor;
          case 'b':
            return '黑棋胜'
          case 'w':
            return '白棋胜'
          default:
            return ''
        }

      }
    },
    methods:{
      log(){
        console.log(this)
      },
      test() {
        let chessmen = this.chessmen
        for (let r in chessmen) {
          r = (+r)
          for (let c in chessmen[r]) {
            c = (+c)

            // 横五个
            if (
              chessmen[r][c] !== null 
              && chessmen[r][c] == chessmen[r][c+1]
              && chessmen[r][c] == chessmen[r][c+2]
              && chessmen[r][c] == chessmen[r][c+3]
              && chessmen[r][c] == chessmen[r][c+4]
            ) {
              this.wing = chessmen[r][c]
              console.log('wing',chessmen[r][c],[r,c],[r,c+1],[r,c+2],[r,c+3],[r,c+4])
            }

            //竖五个
            if (
              chessmen[r][c] !== null 
              && chessmen[r][c] == chessmen[r+1][c]
              && chessmen[r][c] == chessmen[r+2][c]
              && chessmen[r][c] == chessmen[r+3][c]
              && chessmen[r][c] == chessmen[r+4][c]
            ) {
              this.wing = chessmen[r][c]
              console.log('wing',chessmen[r][c],[r,c],[r+1,c],[r+2,c],[r+3,c],[r+4,c])
            }

            //左上斜五个
            if (
              chessmen[r][c] !== null 
              && chessmen[r][c] == chessmen[r+1][c+1]
              && chessmen[r][c] == chessmen[r+2][c+2]
              && chessmen[r][c] == chessmen[r+3][c+3]
              && chessmen[r][c] == chessmen[r+4][c+4]
            ) {
              this.wing = chessmen[r][c]
              console.log('wing',chessmen[r][c],[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3],[r+4,c+4])
            }

            //左下斜五个
            if (
              chessmen[r][c] !== null 
              && chessmen[r][c] == chessmen[r+1][c-1]
              && chessmen[r][c] == chessmen[r+2][c-2]
              && chessmen[r][c] == chessmen[r+3][c-3]
              && chessmen[r][c] == chessmen[r+4][c-4]
            ) {
              this.wing = chessmen[r][c]
              console.log('wing',chessmen[r][c],[r,c],[r+1,c-1],[r+2,c-2],[r+3,c-3],[r+4,c-4])
            }
          }
        }
      },
      /**
       * 落子 以左上角为第一行第一列
       * @param  Int r row行
       * @param  Int c column列 
       */
      move(r,c) {
        if (this.chessmen[r][c] !== null) {
          console.log(r,c,'已有落子')
          return
        }
        if (this.wing) {
          return
        }
        this.chessmen[r][c] = this.color
        this.$forceUpdate()

        this.test()

        if (this.color == 'b') {
          this.color = 'w'
        } else {
          this.color = 'b'
        }
      }
    }
	}
</script>
