<template>
  
<div>

  <div class="outline-container">
    <p class="now">{{tip}}</p>
    <div class="chessboard">
      <i 
        class="icon-sound"
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
      <Board/>
      <dt ref="dt">
        <dl v-for="r in 15">
          <dd 
            v-for="c in 15" 
            :class="[chessmen[r][c].color,{'w-hover': stage == 'playing' && !chessmen[r][c].color && color == 'w'},{'b-hover': stage == 'playing' && !chessmen[r][c].color && color == 'b'}]" 
            @click="move(r,c,color)"></dd>
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
      <!-- <audio src="audio/background.mp3" preload="auto" ref="audioBackground" autoplay loop></audio> -->
    </div>
  </div>

</div>

</template>

<script>

  import Board from '../components/Board.vue'

  export default {
    name: 'ai',
    components: {
      Board
    },
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
    data() {
      return {
        color:'b',
        wing: null,
        stage: 'wait', // wait playing end
        wingChess:[],
        history: [],
        backgroundAudio: true, //

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

      AI(){

        let chessmen = this.chessmen

        // 0空位，w白棋，b黑棋，n墙
        let regs = {
          b: {
            _11111: [/b{5}/g, 'long'], //长连
            _011110: [/0b{4}0/g, 'live4'], //活4
            _01111n: [/(0b{4}[wn]|[wn]b{4}0)/g,'lash4'], //冲四
            _0111010: [/(0bbb0b0|0b0bbb0)/g,'lash4'],
            _0110110: [/0bb0bb0/g,'lash4'],
            _01110: [/0bbb0/g,'live3'],//活三,可以形成活四的三
            _010110: [/(0b0bb0|0bb0b0)/g,'live3'],
            _00111n: [/(00bbb[wn]|[wn]bbb00)/g,'sleep3'], //眠三,只能够形成冲四的三
            _01011n: [/(0b0bb[wn]|[wn]bb0b0)/g,'sleep3'],
            _01101n: [/(0bb0b[wn]|[wn]b0bb0)/g,'sleep3'],
            _10011: [/(b00bb|bb00b)/g,'sleep3'],
            _10101: [/(b0b0b|b0b0b)/g,'sleep3'],
            _n01110n: [/[wn]0bbb0[wn]/g,'sleep3'],
            _00110: [/([wn0]00bb0[wn0]|[wn0]0bb00[wn0])/g,'live2'], //活二,能够形成活三的二
            _01010: [/[wn0]0b0b0[wn0]/g,'live2'],
            _010010: [/[wn0]0b00b0[wn0]/g,'live2'],
            _00011n: [/(000bb[wn]|[wn]bb000)/g,'sleep2'], //眠二,能够形成眠三的二
            _00101n: [/(00b0b[wn]|[wn]b0b00)/g,'sleep2'],
            _01001n: [/(0b00b[wn]|[wn]b00b0)/g,'sleep2'],
            _10001: [/b000b/g,'sleep2'],
            _n01010n: [/[wn]0b0b0[wn]/g,'sleep2'],
            _n01100n: [/([wn]0bb00[wn]|[wn]00bb0[wn])/g,'sleep2'],
            _n1111n: [/[wn]bbbb[wn]/,'death'], //死四
            _n111n: [/[wn]bbb[wn]/,'death'], //死三
            _n11n: [/[wn]bb[wn]/,'death'], //死二
          },
          w: {
            _11111: [/w{5}/g, 'long'], //长连
            _011110: [/0w{4}0/g, 'live4'], //活4
            _01111n: [/(0w{4}[bn]|[bn]w{4}0)/g,'lash4'], //冲四
            _0111010: [/(0www0w0|0w0www0)/g,'lash4'],
            _0110110: [/0ww0ww0/g,'lash4'],
            _01110: [/0www0/g,'live3'],//活三,可以形成活四的三
            _010110: [/(0w0ww0|0ww0w0)/g,'live3'],
            _00111n: [/(00www[bn]|[bn]www00)/g,'sleep3'], //眠三,只能够形成冲四的三
            _01011n: [/(0w0ww[bn]|[bn]ww0w0)/g,'sleep3'],
            _01101n: [/(0ww0w[bn]|[bn]w0ww0)/g,'sleep3'],
            _10011: [/(w00ww|ww00w)/g,'sleep3'],
            _10101: [/(w0w0w|w0w0w)/g,'sleep3'],
            _n01110n: [/[bn]0www0[bn]/g,'sleep3'],
            _00110: [/([bn0]00ww0[bn0]|[bn0]0ww00[bn0])/g,'live2'], //活二,能够形成活三的二
            _01010: [/[bn0]0w0w0[bn0]/g,'live2'],
            _010010: [/[bn0]0w00w0[bn0]/g,'live2'],
            _00011n: [/(000ww[bn]|[bn]ww000)/g,'sleep2'], //眠二,能够形成眠三的二
            _00101n: [/(00w0w[bn]|[bn]w0w00)/g,'sleep2'],
            _01001n: [/(0w00w[bn]|[bn]w00w0)/g,'sleep2'],
            _10001: [/w000w/g,'sleep2'],
            _n01010n: [/[bn]0w0w0[bn]/g,'sleep2'],
            _n01100n: [/([bn]0ww00[bn]|[bn]00ww0[bn])/g,'sleep2'],
            _n1111n: [/[bn]wwww[bn]/,'death'], //死四
            _n111n: [/[bn]www[bn]/,'death'], //死三
            _n11n: [/[bn]ww[bn]/,'death'], //死二
          }
        }


        // 由棋子获得用于正则判断的字符串数组
        function getTxtArr(chessmen){
          let txtArr = []
          for (let i = 5; i < 16; i++) {
            let 
              txt1 = 'n',
              txt2 = 'n',
              txt3 = 'n',
              txt4 = 'n'
            for (let j = 1; j <= i; j++) {

              let color1 = chessmen[i - j + 1][j].color
              let color2 = chessmen[15 - i + j][16 - j].color
              let color3 = chessmen[15 - i + j][j].color
              let color4 = chessmen[i - j + 1][16 - j].color

              txt1 += !color1 ? '0' : color1
              txt2 += !color2 ? '0' : color2
              txt3 += !color3 ? '0' : color3
              txt4 += !color4 ? '0' : color4

            }
            txt1 += 'n'
            txt2 += 'n'
            txt3 += 'n'
            txt4 += 'n'

            // 去重
            i !== 15 ? txtArr.push(txt1,txt2,txt3,txt4) : txtArr.push(txt1,txt3)
          }

          for (let i = 1; i < 16; i++) {

            let txt1 = 'n', txt2 = 'n'

            for (let j = 1; j < 16; j++) {
              let color1 = chessmen[i][j].color
              let color2 = chessmen[j][i].color
              txt1 += !color1 ? '0' : color1
              txt2 += !color2 ? '0' : color2
            }
            txt1 += 'n'
            txt2 += 'n'

            txtArr.push(txt1,txt2)
          }

          return txtArr
        }


        // 用正则判断txtArr,返回相差得点
        function txtArrByRegsToScore(txtArr, color, regs){

          function scoreComputedByTypeObj(obj) {
            let score = 0

            // 双冲4
            // if (obj.lash4 >= 2) {
            //   score += 10000
            //   // obj.lash4 -= 2
            // }
            // //冲4活3
            // if (obj.lash4 >= 1 && obj.live3 >= 1) {
            //   score += 10000
            //   // obj.lash4--
            //   // obj.live3--
            // }
            // //双活3
            // if (obj.live3 >= 2) {
            //   score += 5000
            //   // obj.live3 -= 2
            // }
            // //活3眠3
            // if (obj.live3 >= 1 && obj.sleep3 >= 1) {
            //   score += 1000
            //   // obj.live3--
            //   // obj.sleep3--
            // }
            // //双活2
            // if (obj.live2 >= 2) {
            //   score += 100
            //   // obj.live2-=2
            // }
            // //活2眠2
            // if (obj.live2>=1 && obj.sleep2>=1 ) {
            //   score += 10
            //   // obj.live2--
            //   // obj.sleep2--
            // }

            let singleScore = {
              long: 100000,
              live4: 10000,
              lash4: 500,
              live3: 200,
              sleep3: 50,
              live2: 5,
              sleep2: 3,
              death: -5
            }
            for (let type in obj) {
              if (singleScore[type]) {
                score += obj[type] * singleScore[type]
              }
            }
            return score
          }


          let plusTypeObj = {
            long: 0,
            live4: 0,
            lash4: 0,
            live3: 0,
            sleep3: 0,
            live2: 0,
            sleep2: 0,
            death: 0
          }
          let minusTypeObj = {
            long: 0,
            live4: 0,
            lash4: 0,
            live3: 0,
            sleep3: 0,
            live2: 0,
            sleep2: 0,
            death: 0
          }
          let otherColor = color == 'w' ? 'b' : 'w'
          txtArr.forEach(txt=>{
            for (let name in regs[color]) {
              let plusMatch = txt.match(regs[color][name][0])
              let minusMatch = txt.match(regs[otherColor][name][0])
              let type = regs[color][name][1]
              if (plusMatch) {
                plusTypeObj[type]+=plusMatch.length
              }
              if (minusMatch) {
                minusTypeObj[type]+=minusMatch.length
              }
            }
          })


          let plusScore = scoreComputedByTypeObj(plusTypeObj)
          let minusScore = scoreComputedByTypeObj(minusTypeObj)

          return plusScore - minusScore
        }

        //获得所有未落子的地方
        
        function getNullChessmen(chessmen){
          let nullChessmen = []
          for (let r in chessmen) {
            for (let c in chessmen[r]) {
              if (chessmen[r][c].color===null) {
                nullChessmen.push([r,c])
              } 
            }
          }
          return nullChessmen
        }


        function toggleColor(color) {
          if (color == 'b') {
            return 'w'
          } else {
            return 'b'
          }
        }


        function positionScore(r,c) {
          let _r = Math.abs(+r - 8)
          let _c = Math.abs(+c - 8)
          return Math.min((7-_r),(7-_c))
        }


        // 如果落若干子，计算此时得分
        function chessmenIfMove(chessmen, newChessArr, color, regs) {
          let newChessmen = JSON.parse(JSON.stringify(chessmen))

          newChessArr.forEach(chess=>{
            let r = chess[0], c = chess[1]
            newChessmen[r][c].color = chess[2]
          })

          let txtArr = getTxtArr(newChessmen)

          let score = txtArrByRegsToScore(txtArr,color, regs)

          return score
        }

        function ifAIMoveInNullChessmen(nullChessmen, chessmen, color,regs){

          let scoreArr = []
          let otherColor = toggleColor(color)



          nullChessmen.forEach((chess)=>{

            let r1 = chess[0], c1 = chess[1]


            // 超过棋子两个以外的忽略
            let isNeedComputer = false
            let _r_min =  +r1-2 > 0 ? +r1-2 : 1
            let _r_max =  +r1+2 < 16 ? +r1+2 : 15
            let _c_min =  +c1-2 > 0 ? +c1-2 : 1
            let _c_max =  +c1+2 < 16 ? +c1+2 : 15
            for (let _r = _r_min; _r <=_r_max; _r++) {
              for (let _c = _c_min; _c <=_c_max; _c++) {

                if (chessmen[_r][_c].color != null) {
                  isNeedComputer = true
                } 
              }
            }


            if (isNeedComputer) {
              let scoreArr2 = []
              nullChessmen.forEach((chess2)=>{
                let r2 = chess2[0], c2 = chess2[1]
                let newChessArr = [
                  [r1,c1,color],
                  [r2,c2,otherColor]
                ]

                if (r2!==r1 && c2!==c1) {
                  let score = chessmenIfMove(chessmen, newChessArr, color, regs)
                  scoreArr2.push(score)

                }
              })

              let trueScore2 = Math.min.apply(null,scoreArr2)
              scoreArr.push(trueScore2 + positionScore(r1,c1))
            } else {
              scoreArr.push(-1000000)
            }
            
          })


          let trueScore = Math.max.apply(null,scoreArr)

          let index = scoreArr.indexOf(trueScore)

          let trueChess = nullChessmen[index]

          return trueChess
        }



        function __ifAIMoveInNullChessmen(nullChessmen, chessmen, color,regs){

          let scoreArr = []
          let otherColor = toggleColor(color)



          nullChessmen.forEach((chess)=>{
            
            let newChessmen = JSON.parse(JSON.stringify(chessmen))
            let r = chess[0], c = chess[1]
            newChessmen[r][c].color = color



            let scoreArr2 = []
            nullChessmen.forEach((chess2)=>{
              if (chess2[0]!==r && chess2[1]!==c) {
                let newChessmen2 = JSON.parse(JSON.stringify(newChessmen))
                let r2 = chess2[0], c2 = chess2[1]
                newChessmen2[r2][c2].color = otherColor

                let txtArr2 = getTxtArr(newChessmen2)
                let score2 = txtArrByRegsToScore(txtArr2,color, regs)
                scoreArr2.push(score2)

              }
            })
            let trueScore2 = Math.min.apply(null,scoreArr2)
            scoreArr.push(trueScore2 + positionScore(r,c))

          })


          let trueScore = Math.max.apply(null,scoreArr)

          let index = scoreArr.indexOf(trueScore)

          let trueChess = nullChessmen[index]

          return trueChess
        }




        // let txtArr = getTxtArr(chessmen)
        // let typeObj = txtArrByRegs(txtArr, regs)
        // let score = scoreComputedByTypeObj(typeObj)

        let nullChessmen = getNullChessmen(chessmen)

        let moveChess = ifAIMoveInNullChessmen(nullChessmen, chessmen, 'w', regs)

        return moveChess

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
      move(r,c, color) {

        if (this.stage !== 'playing') {
          return
        }

        if (this.wing) {
          return
        }

        if (this.color !== color) {
          return
        }

        if (this.chessmen[r][c].color !== null) {
          // console.log(r,c,'已有落子')
          return
        }

        this.chessmen[r][c].color = this.color

        // this.$refs.audioMove.play()

        this.history.push([r,c])
        this.test()
        if (this.stage == 'playing') {
          this.toggleColor()

          if (this.color == 'w') {
            console.time()
            let AIChess = this.AI()
            console.timeEnd()
            this.move(AIChess[0],AIChess[1], 'w')
          }
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
      },
    }
  }
</script>