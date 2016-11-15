<template>
  <div class="cantainer">
    <!-- <h1 @click='log'>anime</h1> -->
    <div v-if="anime !== null" class="anime">
      <h1 class="anime-title">{{anime.title}}</h1>
      <p class="anime-allTitle">{{anime.allTitle}}</p>
      <div class="clearfix">   
        <div class="anime-img-div">
          <img :src="'/img/animes/id/' + anime.id + '.jpg'">
        </div>
        <div class="anime-rating">
          <p class="anime-rating-value">{{anime.rating.value}}</p>
          <p class="anime-rating-count">{{anime.rating.count}} 人评分</p>
          <div class="anime-rating-start anime-rating-start5" :style="[{height:( anime.rating.start5 * 3) + 'px'}, {top:( 400 - anime.rating.start5 * 3) + 'px'}]"></div>
          <div class="anime-rating-start anime-rating-start4" :style="[{height:( anime.rating.start4 * 3) + 'px'}, {top:( 400 - anime.rating.start4 * 3) + 'px'}]"></div>
          <div class="anime-rating-start anime-rating-start3" :style="[{height:( anime.rating.start3 * 3) + 'px'}, {top:( 400 - anime.rating.start3 * 3) + 'px'}]"></div>
          <div class="anime-rating-start anime-rating-start2" :style="[{height:( anime.rating.start2 * 3) + 'px'}, {top:( 400 - anime.rating.start2 * 3) + 'px'}]"></div>
          <div class="anime-rating-start anime-rating-start1" :style="[{height:( anime.rating.start1 * 3) + 'px'}, {top:( 400 - anime.rating.start1 * 3) + 'px'}]"></div>
          <span class="anime-rating-info anime-rating-info5">5星</span>
          <span class="anime-rating-info anime-rating-info4">4星</span>
          <span class="anime-rating-info anime-rating-info3">3星</span>
          <span class="anime-rating-info anime-rating-info2">2星</span>
          <span class="anime-rating-info anime-rating-info1">1星</span>
        </div>
        <div class="anime-info">
          <p v-if="anime.info['导演']"><b>导演</b>： {{anime.info['导演']}}</p>
          <p v-if="anime.info['编剧']"><b>编剧</b>： {{anime.info['编剧']}}</p>
          <p v-if="anime.info['主演']"><b>声优</b>： {{anime.info['主演']}}</p>
          <p v-if="anime.info['集数']"><b>集数</b>： {{parseInt(anime.info['集数']) + ' 话'}}</p>
          <p v-if="anime.info['单集片长']"><b>单集片长</b>： {{parseInt(anime.info['单集片长']) + ' 分钟'}}</p>
          <p v-if="anime.info['首播']"><b>首播</b>： {{anime.info['首播']}}</p>
        </div>
      </div>
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
    created() {
      let url = process.env.NODE_ENV === 'production' ? '/ajax/anime' : 'http://localhost/ajax/anime'
      this.$http
        .get(url,{
          params:{
            id: this.$route.params.id
          }
        })
        .then(res => {
          console.log(res.body)
          this.anime = res.body
        }, err => {
          console.error(err)
        })      
    },
    methods: {
      log() {
        console.log(this)
      }
    }
  }
</script>

<style>
  .anime {
    font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
    font-size: 14px;
    color: #333;
    line-height: 2;
  }

  .clearfix:after{
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
    font-size: 0;
  }
  h1, p {
    margin-top: 0;
    margin-bottom: 0;
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
  }
  .anime-title {
    text-align: center;
    font-size: 30px;
  }
  .anime-allTitle {
    text-align: center;
    color: #aaa;
    margin-bottom: 10px;
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
 .anime-rating-start5 { left: 20px; }
 .anime-rating-start4 { left: 78px; }
 .anime-rating-start3 { left: 136px; }
 .anime-rating-start2 { left: 194px; }
 .anime-rating-start1 { left: 252px; }
 .anime-rating-info {
    position: absolute;
    top: 400px;
 }
 .anime-rating-info5 { left: 33px; }
 .anime-rating-info4 { left: 91px; }
 .anime-rating-info3 { left: 149px; }
 .anime-rating-info2 { left: 207px; }
 .anime-rating-info1 { left: 265px; }
</style>