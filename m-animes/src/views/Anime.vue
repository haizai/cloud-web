<template>
  <div class="cantainer">
<!--     <h1 @click='log'>anime</h1> -->
    <div class="search-text" v-if="anime == null">
      <i class="iconfont icon-refresh i-loading"></i>
    </div> 
    <div v-if="anime !== null" class="anime">
    <h1 class="anime-title">
      <i class="iconfont icon-Left i-left" @click="back"></i>
      <i class="iconfont icon-random i-random" @click="random"></i>
      <span>{{anime.title}}</span>
    </h1>
      <p class="anime-allTitle">{{anime.allTitle}}</p>
      <div class="anime-top">
        <div class="anime-img-div">
          <img :src="'/img/animes/id/' + anime.id + '.jpg'" @load="imgLoading(anime)" v-show="anime.imgLoading">
          <span>图片加载中...</span>
        </div>
        <div class="anime-rating">
          <p class="anime-rating-value">{{anime.rating.value}}</p>
          <p class="anime-rating-count">{{anime.rating.count}} 人评分</p>
          <p v-for="n in 5" class="anime-rating-percent" :style="styles.percent[n-1]">{{Math.round(anime.rating['start'+n])}}%</p>
          <div v-for="n in 5" class="anime-rating-start" :style="styles.start[n-1]"></div>
          <span v-for="n in 5" class="anime-rating-info" :style="{right: (n * 28 - 17) +'px'}">{{n}}星</span>
        </div>
      </div>
        <p class="anime-item-title">番剧信息</p>
        <div class="anime-info">
          <p v-if="anime.info['导演']"><b>导演</b>： {{anime.info['导演']}}</p>
          <p v-if="anime.info['编剧']"><b>编剧</b>： {{anime.info['编剧']}}</p>
          <p v-if="anime.info['主演']"><b>声优</b>： {{anime.info['主演']}}</p>
          <p v-if="anime.info['季数']"><b>季数</b>： {{parseInt(anime.info['季数']) + ' 季'}}</p>
          <p v-if="anime.info['集数']"><b>集数</b>： {{parseInt(anime.info['集数']) + ' 话'}}</p>
          <p v-if="anime.info['单集片长']"><b>单集片长</b>： {{parseInt(anime.info['单集片长']) + ' 分钟'}}</p>
          <p v-if="anime.info['首播']"><b>首播</b>： {{anime.info['首播']}}</p>
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
          <h3 class="anime-review-title" @click="logr(review.html)">{{review.title}}</h3>
          <div class="anime-review-content">
            <p class="anime-review-html" v-for="(line, index) in review.html" v-show="index < review.brief || review.isShow">{{line}}</p>
          </div>
          <div class="anime-review-more" @click="trigger(review)" v-if="review.isLong">
            <i class="iconfont" :class="[{'icon-up': review.isShow},{'i-up': review.isShow},{'icon-down': !review.isShow},{'i-up': !review.isShow}]"></i>
            <i class="iconfont" :class="[{'icon-up': review.isShow},{'i-up': review.isShow},{'icon-down': !review.isShow},{'i-up': !review.isShow}]"></i>
            <i class="iconfont" :class="[{'icon-up': review.isShow},{'i-up': review.isShow},{'icon-down': !review.isShow},{'i-up': !review.isShow}]"></i>
            <i class="iconfont" :class="[{'icon-up': review.isShow},{'i-up': review.isShow},{'icon-down': !review.isShow},{'i-up': !review.isShow}]"></i>
            <i class="iconfont" :class="[{'icon-up': review.isShow},{'i-up': review.isShow},{'icon-down': !review.isShow},{'i-up': !review.isShow}]"></i>
          </div>
        </div>
      </div> 
      <div class="anime-404" v-if="anime.reviews.length == 0">sorry, 还没有影评</div>
    </div>
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
            {height: ( this.anime.rating['start'+n] * 1.5+1) + 'px'},
            {top:( 210 - this.anime.rating['start'+n] * 1.5) + 'px'},
            {right: (n * 28 - 21)+ 'px'},
            {backgroundColor: this.anime.rating['start'+n] == this.maxRating ? '#00a1d6' : null}
          ])
          styles.percent.push([
            {top:( 193 - this.anime.rating['start'+n] * 1.5) + 'px'}, 
            {right: (n * 28 - 33)+ 'px'}
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
            this.anime.imgLoading = false
            this.anime.reviews.forEach(review => {
              review.brief = []
              var count = 0
              review.html.forEach(line => {
                if (count < 5) {
                  review.brief++
                } else {
                  return
                }
                if (line.trim() != '') count++
              })
              review.isLong = (count >= 5 && review.html.length > review.brief) ? true : false
              review.isShow = false
            })
          }, err => {
            console.error(err)
          })
      },
      back() {
        this.$router.go(-1)
      },
      trigger(review) {
        console.log(review)
        review.isShow = !review.isShow
        this.$forceUpdate()
      },
      random() {
        this.anime = null
        let url = process.env.NODE_ENV === 'production' ? '/ajax/anime' : 'http://localhost/ajax/anime'
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
      },
      imgLoading(anime) {
      anime.imgLoading = true
      this.$forceUpdate()
      }
    }
  }
</script>
