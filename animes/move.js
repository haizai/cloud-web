var fs = require('fs')
var path = require('path')

var dir1a = path.resolve(__dirname,'public','animes.js')
var dir1b = path.resolve(__dirname,'..','..','cloud','server','public','js','default','animes.js')

fs.readFile(dir1a,{encoding: 'utf8'}, (err, data)=> {
  fs.writeFile(dir1b,data, err=>{
    if (err) {
      console.log(err)
    } else {
      console.log('OK: \n Move: ',dir1a,'\n To: ',dir1b)
    }
  })
})

var dir2a = path.resolve(__dirname,'public','animes.js.map')
var dir2b = path.resolve(__dirname,'..','..','cloud','server','public','js','default','animes.js.map')

fs.readFile(dir2a,{encoding: 'utf8'}, (err, data)=> {
  fs.writeFile(dir2b,data, err=>{
    if (err) {
      console.log(err)
    } else {
      console.log('OK: \n Move: ',dir2a,'\n To: ',dir2b)
    }
  })
})