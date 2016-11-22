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

    <List v-for="animes in animesList" :animes="animes" v-if="!noResult"/>
    <!-- <Page :count="count" :page="page" @setPage='setPage' v-if="!noResult && !loading"/> -->
    <div class="loading" v-if="loading && !isEnding && !noResult">
      loading...
    </div>
    <div class="loading" v-if="isEnding && !noResult">
      没有了...
    </div>    
    <div class="search-text" v-if="noResult">
      未找到相关结果。
    </div>
  </div>
</template>

<script>

  import List from '../components/List.vue'
  import Page from '../components/Page.vue'

  export default {
    name: 'animes',
    components: {
      List,
      Page
    },
    data() {
      return {
        animesList: [],
        count: 0,
        page: 1,
        noResult: false,
        loading: false,
        isPage: false,
        isEnding: false,
        keyword: this.$route.query.keyword || '',
        page: this.$route.query.page || 1,
        range: this.$route.query.range || 'default',
        sort: this.$route.query.sort || 'count'
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
        this.loading = true
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
            this.noResult = this.count == 0 ? true : false
          
            if (res.body.animes.length > 0) {
              this.loading = false
              if (this.isPage) {
                this.page++
                this.animesList.push(res.body.animes)
              } else {
                this.page = 1
                this.animesList = [res.body.animes]
                this.isEnding = false
              }
              this.isPage = false
              let self = this
              document.addEventListener('scroll', e => {
                if (document.documentElement.offsetHeight - window.screen.availHeight - document.body.scrollTop < 30 && !this.loading && !this.isEnding) {
                  self.loading = true
                  self.isPage = true
                  self.fetchData()
                }
              })
            } else {
              this.isEnding = true
            }
          }, err => {
            console.error(err)
          })
      },
      routerPush() {
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


<style>

  body {
    font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
    font-size: 13px;
    color: #333;
    margin: 0;
  }
  .cantainer {

  }
  .title {
    text-align: center;
  }
  .search-div {
    margin-top: 20px;
    margin-bottom: 20px;
    height: 40px;
    display: flex;
  }
  .input-keyword {
    display: inline-block;
    flex: 1;
    margin-left: 5px;
    margin-right: 5px;
    height: 38px;
    padding: 0 10px;
    box-shadow: none;
    font-size: 14px;
    border-radius: 4px;
  }
  .input-search {
    vertical-align: -2px;
    display: inline-block;
    width: 68px;
    height: 40px;
    padding: 0 15px;
    border: none;
    background: #00a1d6;
    color: #fff;
    font-size: 18px;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 4px;
  }
  .input-search:hover {
    background: #29AAD4;
  }
  .search-text {
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    height: 500px;
    line-height: 500px;
    font-size: 20px;
    margin-bottom: 500px;
  }
  input {
    font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
    outline: none;
    color: #333;
  }
  input[type=text] {
    border: 1px solid #aaa;
  }
  input[type=text]:focus {
    border: 1px solid #00a1d6;
  }

  .info {
    padding: 5px 0;
    background: #fff;
    box-shadow: 0px 0px 2px 0 #ccc;
  }

  .info:hover {
    box-shadow: 0 1px 6px #aaa;
  }

  .info-ul {
    list-style: none;
    padding: 0;
    margin: 5px;
    display: flex;
  }
  .info-item {
    text-align: center;
    display:inline-block;
    height: 30px;
    margin-right: 3px;
    line-height: 30px;
    padding: 0 2px;
    border-radius: 4px;
    cursor: pointer;
    flex: 1;
  }
  .info-title {
    background: #e5e5e5;
    display:inline-block;
    height: 30px;
    margin-right: 3px;
    line-height: 30px;
    padding: 0 8px;
    border-radius: 4px;   
  }

  .info-active {
    background-color: #00a1d6;
    color: #fff;
  }

  .loading {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

</style>