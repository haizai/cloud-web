<template>
  <div class="cantainer">
    <h1 @click='log'>anime</h1>
    <div v-if="anime !== null" class="anime ">
      <h1 class="anime-title">{{anime.title}}</h1>
      <p class="anime-allTitle">{{anime.allTitle}}</p>
      <div class="clearfix">   
        <div class="anime-img-div">
          <img :src="'/img/animes/id/' + anime.id + '.jpg'">
        </div>
        <div class="anime-rating">
          <p>评分： {{anime.rating.value}}</p>
          <p>人数： {{anime.rating.count}}</p>
          <p>start5： {{anime.rating.start5}}</p>
          <p>start4： {{anime.rating.start4}}</p>
          <p>start3： {{anime.rating.start3}}</p>
          <p>start2： {{anime.rating.start2}}</p>
          <p>start1： {{anime.rating.start1}}</p>
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
    float: left;
    width: 320px;
    padding-right: 20px;
    height: 450px;
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
    margin-left: 20px;
    width: 300px;
    float: right;
    height: 450px;
  }
</style>