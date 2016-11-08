<template>
	<div id="app">

			<div class="cantainer">
				
			<div class="search-div">
				<input class="input-keyword" type="text" v-model="keyword" @keydown.enter="search" placeholder="搜索内容为空时，获得全部数据">
				<input type="button" class="input-search" value="搜索" @click="search">
			</div>

			<div class="info">
				<ul class="info-ul">
					<li class="info-title">搜索范围</li>
					<li class="info-item" :class="{'info-active': range == 'default'}" @click="changeInfo('range','default')">默认</li>
					<li class="info-item" :class="{'info-active': range == 'title'}"  @click="changeInfo('range','title')">标题</li>
					<li class="info-item" :class="{'info-active': range == 'person'}"  @click="changeInfo('range','person')">人员</li>
					<li class="info-item" :class="{'info-active': range == 'summary'}"  @click="changeInfo('range','summary')">简介</li>
					<li class="info-item" :class="{'info-active': range == 'all'}"  @click="changeInfo('range','all')">全部</li>
				</ul>
				<ul class="info-ul">
					<li class="info-title">排序方式</li>
					<li class="info-item" :class="{'info-active': sort == 'default'}" @click="changeInfo('sort','default')">默认</li>
					<li class="info-item" :class="{'info-active': sort == 'value'}" @click="changeInfo('sort','value')">评价最高</li>
					<li class="info-item" :class="{'info-active': sort == 'count'}" @click="changeInfo('sort','count')">人数最多</li>
					<li class="info-item" :class="{'info-active': sort == 'year'}" @click="changeInfo('sort','year')">时间最新</li>
				</ul>
			</div>

			<List :animes="animes" v-if="!noResult && !loading"/>
			<Page :count="count" :page="page" @setPage='setPage' v-if="!noResult && !loading"/>
			<div class="search-text" v-if="!noResult && loading">
				loading...
			</div>
			<div class="search-text" v-if="noResult">
				未找到相关结果。
			</div>
		</div>
	</div>
</template>

<script>

	import List from './components/List.vue'
	import Page from './components/Page.vue'

	export default {
		name: 'app',
		components: {
			List,
			Page
		},
		data() {
			return {
				animes: [],
				count: 0,
				noResult: false,
				loading: false,
				keyword: this.$route.query.keyword || '',
				page: this.$route.query.page || 1,
				range: this.$route.query.range || 'default',
				sort: this.$route.query.sort || 'default'
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
				this.loading = true
				this.$http
					.get('/ajax/animes',{
						params:{
							keyword: this.keyword,
							page: this.page,
							range: this.range,
							sort: this.sort
						}
					})
					.then(res => {
						console.log(res.body)
						this.animes = res.body.animes
						this.count = res.body.count
						this.noResult = this.count == 0 ? true : false
						this.loading = false
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
				console.log(key,val)
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
    font-size: 14px;
    color: #333;
    margin: 0;
	}
	.cantainer {
		width: 980px;
		margin: 0 auto;
	}
	.title {
		text-align: center;
	}
	.search-div {
		margin-top: 40px;
		margin-bottom: 40px;
		height: 40px;
	}
	
	.input-keyword {
		margin-left: 320px;
		width: 300px;
		height: 38px;
		padding: 0 10px;
		box-shadow: none;
		font-size: 14px;
		border-radius: 4px;
	}
	.input-search {
		height: 40px;
		padding: 0 20px;
		border: none;
		background: #00a1d6;
		color: #fff;
		font-size: 18px;
		position: absolute;
		margin-left: 5px;
		cursor: pointer;
		border-radius: 4px;
	}
	.input-search:hover {
		background: #29AAD4;
	}
	.search-text {
		text-align: center;
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
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
		border-top: 1px solid #e0e0e0;
		padding: 15px 0;
	}

	.info-ul {
		list-style: none;
		padding: 0;
		margin: 10px;
	}
	.info-item {
		display:inline-block;
		height: 30px;
		margin-right: 10px;
		line-height: 30px;
		padding: 0 10px;
		border-radius: 4px;
		cursor: pointer;
	}
	.info-item:hover {
		background: #e5e5e5
	}

	.info-title {
		background: #e5e5e5;
		display:inline-block;
		height: 30px;
		margin-right: 10px;
		line-height: 30px;
		padding: 0 10px;
		border-radius: 4px;		
	}

	.info-active, .info-active:hover {
		background-color: #00a1d6;
		color: #fff;
	}

</style>