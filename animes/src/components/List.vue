<template>
  <div class="list">
    <div v-for="anime in animesByComputed" class="list-item">
      <div class="list-imgdiv">
        <router-link :to="{ name: 'anime', params: { id: anime.id }}">
          <img class="list-img" :src="'/img/animes/id/' + anime.id + '.jpg'" @load="imgLoading(anime)" v-show="anime.imgLoading">
          <span>图片加载中...</span>
        </router-link>
      </div>
      <div class="list-right">
        <div class="list-line0">
          <i :class="['list-rating','list-rating-'+ Math.floor(anime.rating.value) ]"></i><span class="list-lrating">{{anime.lrating}}</span><router-link :to="{ name: 'anime', params: { id: anime.id }}"><span class="list-title" v-html="anime.title"></span></router-link> <span class="list-year">（{{anime.year}}）</span>
        </div>
        <div class="list-allTitle" v-html="anime.line1"></div>
        <div v-html="anime.line2"></div>
        <div v-html="anime.line3"></div>
        <div v-html="anime.line4"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['animes'],
    methods: {
      imgLoading(anime) {
        anime.imgLoading = true
        this.$forceUpdate()
      }
    },
    computed: {
      animesByComputed() {
        var animes = JSON.parse(JSON.stringify(this.animes))
        animes.map(anime => {

          anime.imgLoading = false
          let query = this.$route.query
          let keyword = query.keyword ? query.keyword.replace(/[\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/]/g,'') : ''
          let reg = new RegExp(keyword, 'ig')
          let change = '<span class="list-keyword">' + keyword + '</span>'

          anime.lrating = ' ' + anime.rating.value + '分/' + anime.rating.count + '评 '

          anime.line1 = ''
          if (anime.allTitle) anime.line1 += anime.allTitle
          if (anime.allTitle && anime.info['又名']) anime.line1 += ' / '
          if (anime.info['又名']) anime.line1 += anime.info['又名']

          if(query.keyword && (query.range == 'title' || query.range == 'default' || query.range == 'all')) {
            anime.title = anime.title.replace(reg, change)
            anime.line1 = anime.line1.replace(reg, change)
          }

          anime.line2 = ''
          if (anime.info['导演']) anime.line2 += '导演：' + anime.info['导演']
          if (anime.info['导演'] && anime.info['编剧']) anime.line2 += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
          if (anime.info['编剧']) anime.line2 += '编剧：' + anime.info['编剧']

          anime.line3 = ''
          if (anime.info['主演']) anime.line3 += '声优：' + anime.info['主演']

          if(query.keyword && (query.range == 'person' || query.range == 'default' || query.range == 'all')) {
            anime.line2 = anime.line2.replace(reg, change)
            anime.line3 = anime.line3.replace(reg, change)
          }          


          anime.line4 = ''
          if (anime.info['季数']) anime.line4 += parseInt(anime.info['季数']) + '季 / '
          if (anime.info['集数']) anime.line4 += parseInt(anime.info['集数']) + '话 / '
          if (anime.info['单集片长']) anime.line4 += parseInt(anime.info['单集片长']) + '分钟 / '
          if (anime.info['首播']) anime.line4 += anime.info['首播']
          return anime
        })
        return animes
      }
    }
  }
</script>

<style>

  a {
    color:  #333;
    text-decoration: none;
  }

  .list {
    margin-bottom: 30px;
    min-height: 1000px;
  }


  .list-item {
    height: 200px;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0px 1px 2px 0 #ccc;
    margin: 10px 0;
  }
  .list-item:hover {
    box-shadow: 0 1px 6px #aaa;
  }
  .list-imgdiv {
    line-height: 200px;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 4px;
    position: relative;
    float: left;
    width: 140px;
    height: 200px;
    margin-right: 20px;
    margin-left: 10px;
  }
  .list-imgdiv:hover {
    border-color: #ddd;
    background: #f5f5f5;
  } 
  .list-img {
    width: 120px;
    max-height: 180px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
  }
  .list-right {
    margin-left: 170px;
    position: relative;
    line-height: 1.9
  }
  .list-line0 {
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .list-rating {
    display: inline-block;
    width: 75px;
    height: 15px;
    background: url('/img/animes/rating.png') no-repeat;
    vertical-align: 20%;
    margin-right: 15px;
  }
  .list-rating-10 { background-position: 0 0; }
  .list-rating-9 { background-position: 0 -15px; }
  .list-rating-8 { background-position: 0 -30px; }
  .list-rating-7 { background-position: 0 -45px; }
  .list-rating-6 { background-position: 0 -60px; }
  .list-rating-5 { background-position: 0 -75px; }
  .list-rating-4 { background-position: 0 -90px; }
  .list-rating-3 { background-position: 0 -105px; }
  .list-rating-2 { background-position: 0 -120px; }
  .list-rating-1 { background-position: 0 -135px; }
  .list-rating-0 { background-position: 0 -150px; }

  .list-lrating{
    position: absolute;
    left: 1px;
    font-size: 12px;
    top: 18px;
    color: #777;
  }
  .list-title {
    font-weight: bold;
    font-size: 20px;
    vertical-align: -10%;
  }
  .list-title:hover {
    color: #00a1d6;
  }
  .list-year {
    color: #555;
    vertical-align: -10%;
  }

  .list-allTitle {
    color: #aaa;
    font-size: 12px;
  }
  .list-keyword {
    color: #f25d8e;
  }
</style>