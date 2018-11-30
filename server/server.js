const express = require('express')
const mongoose = require('mongoose')

// 链接mongo
const DB_URL = 'mongodb://127.0.0.1:27017'
mongoose.connect(DB_URL)
mongoose.connection.on('connected', function () {
  console.log('mongo connect success')
})

// mongo里的文档、字段概念
const User = mongoose.model('user', new mongoose.Schema({
  name: { type: String, require: true },
  age: { type: Number, require: true }
}))

// 新增数据
// User.create({
//   name: 'homegus',
//   age: 20
// }, function (err, doc) {
//   if (!err) {
//     console.log(doc)
//   } else {
//     console.log(err)
//   }
// })

// 删除数据
// User.remove({}, function (err, doc) {
//   if (!err) {
//     console.log(doc)
//   }
// })

// 更新数据
// User.update({ 'name': 'wanglei' }, { '$set': { age: 26 } }, function (err, doc) {
//   if (!err) {
//     console.log(doc)
//   }
// })

// 新建app
const app = express()

app.get('/', function (req, res) {
  User.find({}, function (err, doc) {
    if (!err) {
      res.json(doc)
    }
  })
})

app.listen(9093, function () {
  console.log('Node app start at port 9093')
})
