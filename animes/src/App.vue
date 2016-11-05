<template>
	<div id="app">

			<div class="cantainer">
				
			<h1 class="title" @click="log">动漫</h1>

			<input class="input-keyword" type="text" id="keyword" v-model="keyword">
			<input type="button" id="submit" value="搜索" @click="search">
			<br>
			<List :animes="animes" v-if="!noResult && !loading"/>
			<Page :count="count" :page="page" @setPage='setPage'/>
			<div class="noResult" v-if="noResult">
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
				keyword: this.$route.query.keyword || '',
				page: this.$route.query.page || 1,
				noResult: false,
				loading: false
			}
		},
		created () {
	    this.fetchData()
	  },
		 watch: {
	    '$route': 'fetchData'
	  },
		methods: {
			search() {
				this.page = 1
				this.routerPush()
			},
			fetchData() {
				this.loading = true
				this.$http
					.get('ajax/animes',{
						params:{
							'keyword': this.keyword,
							'page': this.page
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
				this.$router.push({name:'animes', query: { keyword: this.keyword, page: this.page }})
			},
			log() {
				console.log(this)
			},
			setPage(num) {
				this.page = num
				this.routerPush()
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
    min-width: 990px;
		width: 980px;
		margin: 0 auto;
	}
	.title {
		text-align: center;
	}
	.input-keyword {
		margin-left: 400px;
		margin-bottom: 40px
	}
	.noResult{
		text-align: center;
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		height: 500px;
		line-height: 500px;
		font-size: 20px;
	}
</style>