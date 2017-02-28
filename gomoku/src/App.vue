<template>
	<div id="gomoku">
    <h1 @click="log()">gomoku</h1>
    <div class="chessboard">
      <canvas class="background" width="640" height="640" ref="canvas">
        
      </canvas>
    </div>
	</div>
</template>

<script>

	export default {
		name: 'gomoku',
    mounted() {
      this.ctx = this.$refs.canvas.getContext('2d')
      let ctx = this.ctx
      let w = 40 //格子边长
      let star = 4 //星半径


      ctx.beginPath()

      //格子
      let r = w, l = w
      while (r <= w * 15) {
        ctx.moveTo(r, w)
        ctx.lineTo(r, w * 15)
        r += w
      }
      while (l <= w * 15) {
        ctx.moveTo(w, l)
        ctx.lineTo(w * 15, l)
        l += w
      }

      //星
      ctx.fillRect(w*8-star, w*8-star, 2*star, 2*star)
      ctx.fillRect(w*4-star, w*4-star, 2*star, 2*star)
      ctx.fillRect(w*4-star, w*12-star, 2*star, 2*star)
      ctx.fillRect(w*12-star, w*4-star, 2*star, 2*star)
      ctx.fillRect(w*12-star, w*12-star, 2*star, 2*star)


      ctx.stroke()

      ctx.font = '20px serif'
      ctx.textAlign = 'center'
      var letters = ['A','B','C','D','E','F','G','H','I','G','K','L','M','N','O']
      letters.forEach((letter,index)=>{
        ctx.fillText(letter,(index+1)*w,w-20)
      })
      let num = 1
      while(num <= 15) {
        ctx.fillText(num,w-25,num*w+6)
        num++
      }
    },
    data() {
      return {
        chess: {
          items:[],
          getColor(r,c) {
            let color
            this.items.forEach(item=>{
              if (item.r == r && item.c == c) 
                color = item.color
            })
            return color
          }
        }
      }
    },
    computed:{

    },
    methods:{
      log(){
        console.log(this)
      },
      /**
       * 落子 以左上角为第一行第一列
       * @param  Srting color  'b' or 'w'
       * @param  Int r row行
       * @param  Int c column列 
       */
      move(color,r,c) {

        let chessmen = this.chess.items

        if (chessmen.some(chess=> chess.r === r && chess.c === c )) {
          console.info('重复落子')
          return 
        }
        chessmen.push({color, r, c})
      }
    }
	}
</script>
