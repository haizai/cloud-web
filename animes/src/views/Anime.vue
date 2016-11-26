<template>
  <div class="cantainer">
<!--     <h1 @click='log'>anime</h1> -->
    <div v-if="anime !== null" class="anime">
    <h1 class="anime-title">
      <i class="anime-i-back" title="返回上一页" @click="back"></i>
      <i class="anime-i-random" title="随机获得一部动漫" @click="random"></i>
      <span>{{anime.title}}</span>
    </h1>
      <p class="anime-allTitle">{{anime.allTitle}}</p>
      <div class="anime-top">
        <div class="anime-img-div">
          <img :src="'/img/animes/id/' + anime.id + '.jpg'">
        </div>
        <div class="anime-rating">
          <p class="anime-rating-value">{{anime.rating.value}}</p>
          <p class="anime-rating-count">{{anime.rating.count}} 人评分</p>
          <p v-for="n in 5" class="anime-rating-percent" :style="styles.percent[n-1]">{{anime.rating['start'+n]}}%</p>
          <div v-for="n in 5" class="anime-rating-start" :style="styles.start[n-1]"></div>
          <span v-for="n in 5" class="anime-rating-info" :style="{right: (n * 58 - 25) +'px'}">{{n}}星</span>
        </div>
        <div class="anime-info">
          <p v-if="anime.info['导演']"><b>导演</b>： {{anime.info['导演']}}</p>
          <p v-if="anime.info['编剧']"><b>编剧</b>： {{anime.info['编剧']}}</p>
          <p v-if="anime.info['主演']"><b>声优</b>： {{anime.info['主演']}}</p>
          <p v-if="anime.info['季数']"><b>季数</b>： {{parseInt(anime.info['季数']) + ' 季'}}</p>
          <p v-if="anime.info['集数']"><b>集数</b>： {{parseInt(anime.info['集数']) + ' 话'}}</p>
          <p v-if="anime.info['单集片长']"><b>单集片长</b>： {{parseInt(anime.info['单集片长']) + ' 分钟'}}</p>
          <p v-if="anime.info['首播']"><b>首播</b>： {{anime.info['首播']}}</p>
        </div>
      </div>
      <p class="anime-item-title">剧情简介</p>
      <div class="anime-404" v-if="!anime.summary">sorry, 还没有简介</div>
      <div class="anime-summary">{{anime.summary}}</div>
      <p class="anime-item-title">简要评论</p>
      <div class="anime-comments">
        <p v-for="comment in anime.comments"><b>·</b>&nbsp;&nbsp;{{comment}}</p>
      </div>
      <div class="anime-404" v-if="anime.comments.length == 0">sorry, 还没有评论</div>
      <p class="anime-item-title">精彩影评</p>
      <div class="anime-reviews">
        <div class="anime-review" v-for="review in anime.reviews">
          <h3 class="anime-review-title">{{review.title}}</h3>
          <p class="anime-review-html" v-for="line in review.html">{{line}}</p>
        </div>
      </div> 
      <div class="anime-404" v-if="anime.reviews.length == 0">sorry, 还没有影评</div>
    </div>
    <div style="height:60px"></div>
  </div>
</template>

<script>
  export default{
    name: 'anime',
    data() {
      return {
        anime: null
      }
    },
    watch: {
      $route() {
        this.fetchData()
      }
    },
    created() {
      this.fetchData()    
    },
    computed: {
      maxRating() {
        if (this.anime)
        return Math.max(this.anime.rating.start1, this.anime.rating.start2, this.anime.rating.start3, this.anime.rating.start4, this.anime.rating.start5)
      },
      styles() {
        let styles = {}
        styles.start = []
        styles.percent = []
        for (let n = 1; n < 6; n++) {
          styles.start.push([
            {height: ( this.anime.rating['start'+n] * 3) + 'px'},
            {top:( 400 - this.anime.rating['start'+n] * 3) + 'px'},
            {right: (n * 58 - 38)+ 'px'},
            {backgroundColor: this.anime.rating['start'+n] == this.maxRating ? '#00a1d6' : null}
          ])
          styles.percent.push([
            {top:( 375 - this.anime.rating['start'+n] * 3) + 'px'}, 
            {right: (n * 58 - 38)+ 'px'}
          ])
        }
        return styles
      }
    },
    methods: {
      fetchData() {
        let url = process.env.NODE_ENV === 'production' ? '/ajax/anime' : 'http://localhost/ajax/anime'
        this.$http
          .get(url,{
            params:{
              id: this.$route.params.id
            }
          })
          .then(res => {
            if (process.env.NODE_ENV !== 'production') console.log(res.body)
            this.anime = res.body
          }, err => {
            console.error(err)
          })
      },
      log() {
        console.log(this)
      },
      back() {
        this.$router.go(-1)
      },
      random() {
        let url = process.env.NODE_ENV === 'production' ? '/ajax/anime' : 'http://localhost/ajax/anime'
        this.loading = true
        this.anime = null
        this.$http
          .get(url,{
            params:{
              random: true
            }
          })
          .then(res => {
            this.$router.push({
              name: 'anime',
              params: { id: res.body.id }
            })
          }, err => {
            console.error(err)
          })
      }
    }
  }
</script>

<style>
  .anime {
    line-height: 2;
  }

  .anime-i-back, .anime-i-random {
    position: absolute;
    top: 15px;
    width: 48px;
    height: 48px;
    cursor: pointer;
    border-radius: 6px;
  }
  .anime-i-back:hover,.anime-i-random:hover {
    background-color: #eee;
  }
  .anime-i-back {
    left: 10px;
    background: url('/img/animes/back.png')
  }
  .anime-i-random {
    right: 10px;
    background: url('/img/animes/random.png')
  }
  h1, h3, p {
    margin-top: 0;
    margin-bottom: 0;
  }
  .anime-top {
    height: 452px;

  }
  .anime-img-div {
    position: relative;
    float: left;
    width: 320px;
    margin-right: 20px;
    height: 450px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  .anime-img-div img {
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
  .anime-info {
    height: 450px;
    overflow: hidden;
  }
  .anime-title {
    position: relative;
    margin-top: 10px;
    text-align: center;
    font-size: 30px;
  }
  .anime-allTitle {
    text-align: center;
    color: #aaa;
    margin-bottom: 20px;
    margin-top: -5px
  }
  .anime-rating {
    position: relative;
    margin-left: 20px;
    width: 320px;
    float: right;
    height: 450px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  .anime-rating-value {
    text-align: center;
    font-size: 70px;
    line-height: 150px;
    color: #E800A4;
  }
  .anime-rating-count {
    text-align: center;
    margin-top: -30px;
    color: #888;
  }
  .anime-rating-start {
    position: absolute;
    width: 48px;
    background: #888;
    height: 200px;
    top: 200px;
  }
  .anime-rating-info {
    position: absolute;
    top: 400px;
  }
  .anime-rating-percent {
    width: 48px;
    position: absolute;
    text-align: center;
    color: #888；
  }
  .anime-item-title {
    background-color: #f5f5f5;
    margin-top: 20px;
    margin-bottom: 10px;
    padding: 5px 10px;
    border-top: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: #00a1d6;
  }
  .anime-summary {
    text-indent: 2em;
    padding-left: 50px;
    padding-right: 50px;
  }
  .anime-comments {
    padding-left: 50px;
    padding-right: 50px;
  }
  .anime-review {
    padding: 50px;
    border-bottom: 1px solid #ccc;
  }
  .anime-review-title {
    text-align: center;
    font-size: 16px;
  }
  .anime-review-html {
    text-indent: 2em;
    margin: 20px 0;
  }
  .anime-404 {
    padding: 20px;
    text-align: center
  }
</style>