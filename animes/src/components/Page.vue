<template>
  <div class="page-wrap" v-if="isShow">
    <div class="page-body">
      <span v-if="page > 4" class="page-item page-info page-num" @click="setPage(page - 1)">
        上一页
      </span><span class="page-item page-num" v-if="page > 3" @click="setPage(1)">
        1
      </span><span v-if="page > 4" class="page-item page-none">
        ...
      </span>
      <span class="page-item page-num" :class="{'page-active': num == page}" v-for="num in pagesBycomputed" @click="setPage(num)">
        {{num}}
      </span><span v-if="page < pages - 3" class="page-item page-none">
        ...
      </span><span v-if="page < pages - 2" class="page-item page-num" @click="setPage(pages)">
        {{pages}}
      </span><span v-if="page < pages - 3" class="page-item page-info page-num" @click="setPage(page - 1)">
        下一页
      </span>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['count', 'page'],
    computed: {
      isShow() {
        return this.count > 10
      },
      pages() {
        return Math.floor((this.count - 1) / 10) + 1
      },
      pagesBycomputed() {
        let arr = []
        for(let i = 1; i <= this.pages; i++ ) {
          if (this.page - i > 2 || i - this.page > 2){

          }else {
           arr.push(i)
          }
        }
        return arr
      }
    },
    methods: {
      log() {
        console.log(this)
      },
      setPage(num) {
        this.$emit('setPage', num)
      }
    }
  }
</script>

<style>
  .page-wrap {
    width: 640px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
    height: 50px;
  }
  .page-body {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    white-space:nowrap;
  }
  .page-item {
    display: inline-block;
    text-align: center;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #aaa;
    margin-top: 5px;
    margin-right: 10px;
    border-radius: 4px;
  }
  .page-num {
    cursor: pointer;
  }
  .page-num:hover {
    border-color: #00a1d6;
    color: #00a1d6;
  }
  .page-active, .page-active:hover {
    background: #00a1d6;
    color: #fff;
    border-color: #fff;
  }
  .page-none {
    border-color: #fff;
  }
  .page-info {
    width: 70px;
  }
</style>