<template>
  <table id='record'>
    <tbody>
      <tr>
        <td>时间</td>
        <td>方法</td>
        <td>地址</td>
        <td>参数</td>
        <td>状态</td>
        <td>其他返回</td>
      </tr>
      <tr v-for="record in computedRecords">
        <td>{{record.time}}</td>
        <td>{{record.method}}</td>
        <td>{{record.url}}</td>
        <td>{{record.param}}</td>
        <td>{{record.state}}</td>
        <td>{{record.res}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>

  export default {
    name: 'record',
    data() {
      return {
        records: []
      }
    },
    created() {
      this.$http.get(this.urlPrefix + 'getRecord')
        .then(res=>{
          console.log(res)
          if (res.body.state === 1) {
            this.records = res.body.record
          }
        })
    },
    methods: {
      log(){console.log(this)}
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
          obj.state = record.res.state
          delete record.res.state
          obj.res = Object.keys(record.res).map(key=>{
            return key + ': ' + record.res[key]
          }).join('\n')
          return obj
        })
      }
    }
  }
</script>