<template>
  <div class="cantainer">
    <div class="search-div">
      <input class="input-keyword" type="text" v-model="keyword" @keydown.enter="search" placeholder="搜索内容为空时，获得全部数据">
      <input type="button" class="input-search" value="搜索" @click="search">
    </div>

    <div class="info">
      <ul class="info-ul">
        <span class="info-title">搜索范围</span>
        <li class="info-item" :class="{'info-active': range == 'default'}" @click="changeInfo('range','default')">默认</li>
        <li class="info-item" :class="{'info-active': range == 'title'}"  @click="changeInfo('range','title')">标题</li>
        <li class="info-item" :class="{'info-active': range == 'person'}"  @click="changeInfo('range','person')">人员</li>
        <li class="info-item" :class="{'info-active': range == 'summary'}"  @click="changeInfo('range','summary')">简介</li>
        <li class="info-item" :class="{'info-active': range == 'all'}"  @click="changeInfo('range','all')">全部</li>
      </ul>
      <ul class="info-ul">
        <span class="info-title">排序方式</span>
        <li class="info-item" :class="{'info-active': sort == 'default'}" @click="changeInfo('sort','default')">默认</li>
        <li class="info-item" :class="{'info-active': sort == 'value'}" @click="changeInfo('sort','value')">评价最高</li>
        <li class="info-item" :class="{'info-active': sort == 'count'}" @click="changeInfo('sort','count')">人数最多</li>
        <li class="info-item" :class="{'info-active': sort == 'year'}" @click="changeInfo('sort','year')">时间最新</li>
      </ul>
    </div>

    <List v-for="animes in animesList" :animes="animes" v-if="state!=='loading'"/>
    <div class="moreLoading">
      <i class="iconfont icon-refresh i-loading-more" v-if="state == 'loading-more'"></i>
      <i class="iconfont icon-noResult i-noMore" v-if="state == 'no-more'"></i>
      <span v-if="state == 'no-more'">没有了...</span>
    </div>    
    <div class="search-text" v-if="state=='no-result'">
      <i class="iconfont icon-noResult i-noResult"></i>
      未找到相关结果。
    </div>
    <div class="search-text" v-if="state == 'loading'">
      <i class="iconfont icon-refresh i-loading"></i>
    </div>    
  </div>
</template>

<script>

  import List from '../components/List.vue'

  export default {
    name: 'animes',
    components: {
      List
    },
    data() {
      return {
        animesList: [],
        count: 0,
        page: 1,
        state: 'loading',
        keyword: this.$route.query.keyword || '',
        page: this.$route.query.page || 1,
        range: this.$route.query.range || 'default',
        sort: this.$route.query.sort || 'count',
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      $route() {
        this.keyword = this.$route.query.keyword || ''
        this.page = this.$route.query.page || 1
        this.range = this.$route.query.range || 'default'
        this.sort = this.$route.query.sort || 'default'
        this.fetchData()
      }
    },
    methods: {
      log() {
        console.log(this)
      },
      search() {
        this.page = 1
        this.routerPush()
      },
      setPage(num) {
        this.page = num
        this.routerPush()
      },
      fetchData() {
        let url = process.env.NODE_ENV === 'production' ? '../../ajax/animes' : 'http://localhost/ajax/animes'
        let self = this
        function scrollEvent(e) {
          if (document.documentElement.offsetHeight - window.screen.availHeight - document.body.scrollTop < 20 && self.state == 'normal') {
            self.page++
            self.state = 'loading-more'
            self.fetchData()
          }
        }
        this.$http
          .get(url,{
            params:{
              keyword: this.keyword,
              page: this.page,
              range: this.range,
              sort: this.sort
            }
          })
          .then(res => {
            if (process.env.NODE_ENV !== 'production') console.log(res.body)
            this.count = res.body.count
            if (this.count == 0) {
              this.state = 'no-result'
              this.animesList = []
              return
            }
            if (res.body.animes.length > 0) {
              if (this.state=='loading') {
                this.animesList = [res.body.animes]
              } else {
                this.animesList.push(res.body.animes)
              }
              
              this.state = 'normal'
              document.addEventListener('scroll', scrollEvent)
            } else {
              this.state = 'no-more'
              document.removeEventListener('scroll',scrollEvent)
            }
          }, err => {
            console.error(err)
          })
      },
      routerPush() {
        this.state = 'loading'
        this.$router.push({
          name:'animes', 
          query: { 
            keyword: this.keyword.trim(),
            page: this.page,
            range: this.range,
            sort: this.sort
          }})
      },
      changeInfo(key,val) {
        if (this[key] != val) {
          this[key] = val
          this.page = 1
          this.routerPush()
        }
      }
    }
  }
</script>