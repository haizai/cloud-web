<template>
  <canvas class="background" width="640" height="640" ref="canvas"></canvas>
</template>

<script>
  export default {
    name: 'board',
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
  }
</script>