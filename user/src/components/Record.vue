<template>
  <li>
    <h2 class="content-title">
      操作记录
      <i class="icon-refresh tran-round" style="margin-top:28px;margin-left:8px;" @click="getRecord()"></i>
    </h2>
    <p>
      全<span style="color:#f45d90;">{{records.length}}</span>条,
      共<span style="color:#f45d90;">{{Math.ceil(records.length/10)}}</span>页
    </p>
    <table id='record'>
      <tbody>
        <tr style="background:#f5f5f5">
          <td style="width:160px">时间</td>
          <td style="width:40px">方法</td>
          <td style="width:160px">地址</td>
          <td style="width:160px">参数</td>
          <td style="width:40px">状态</td>
          <td>其他返回</td>
        </tr>
        <tr v-for="record in filterRecords">
          <td>{{record.time}}</td>
          <td>{{record.method}}</td>
          <td>{{record.url}}</td>
          <td>{{record.param}}</td>
          <td>{{record.state}}</td>
          <td>{{record.res}}</td>
        </tr>
      </tbody>
    </table>
    <p style="text-align:center">
      <a href="javascript:;" v-show="page>1" @click="page--" class="record-a">上一页</a>
      第<span>{{page}}</span>页
      <a href="javascript:;" v-show="page<Math.ceil(records.length/10)" @click="page++" class="record-a">下一页</a>
    </p>
  </li>
</template>

<script>

  export default {
    name: 'record',
    data() {
      return {
        records: [],
        page:1
      }
    },
    created() {
      this.getRecord()
    },
    methods: {
      log(){console.log(this)},
      getRecord() {
        this.$http.get(this.urlPrefix + 'getRecord').then(res=>{
          if (res.body.state === 1) {
            this.records = res.body.record
            this.page = 1
            tip('成功获取操作记录')
          }
        })
      }
    },
    computed: {
      urlPrefix () {
        return process.env.NODE_ENV === 'production' ? '/ajax/user/' : 'http://localhost/ajax/user/'
      },
      computedRecords() {
        return this.records.map(record=>{
          var obj = {}
          obj.time = new Date(record.time).toLocaleString()
          obj.method = record.method
          obj.url = record.url.replace('/ajax/user/','')
          obj.param = Object.keys(record.param).map(key=>{
            return key + ': ' + record.param[key]
          }).join('\n')
          if (obj.param == '') obj.param = '无'
          obj.state = record.res.state
          delete record.res.state
          obj.res = Object.keys(record.res).map(key=>{
            return key + ': ' + Object.prototype.toString.call(record.res[key])
          }).join('\n')
          if (obj.res == '') obj.res = '无'
          return obj
        }).reverse()
      },
      filterRecords() {
        return this.computedRecords.slice((this.page-1)*10,this.page*10)
      }
    }
  }
</script>