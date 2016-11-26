<template>
  <div class="list">
    <router-link v-for="anime in animesByComputed" :to="{ name: 'anime', params: { id: anime.id }}">
      <div class="list-item">

        <div class="list-imgdiv">
          <img class="list-img" :src="'/img/animes/id/' + anime.id + '.jpg'" v-show="anime.imgLoading" @load="imgLoading(anime)">
          <div class="list-img-lazyload" v-if="!anime.imgLoading">图片加载中...</div>
        </div>
        <div class="list-right">
          <p class="list-line0 nowrap">          
            <span class="list-title" v-html="anime.title"></span>
            <span class="list-year">（{{anime.year}}）</span>
          </p>
          <div class="list-allTitle nowrap" v-html="anime.line1"></div>
          <div>
            <div><i :class="['list-rating','list-rating-'+ Math.floor(anime.rating.value) ]"></i><span class="list-lrating">{{anime.lrating}}</span></div>
          </div>
          <div class="nowrap" v-html="anime.line2"></div>
          <div class="nowrap" v-html="anime.line3"></div>
          <div class="nowrap" v-html="anime.line4"></div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default{
    props: ['animes'],
    methods: {
      imgLoading(anime) {
        console.log(anime)
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
          if (anime.info['导演'] && anime.info['编剧']) anime.line2 += '&nbsp&nbsp&nbsp'
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