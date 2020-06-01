const path = require('path')
const express = require('express')
const bodyParse = require('body-parser')

const app = express()

// 静态资源库
app.use(express.static(path.resolve(__dirname, 'static')))

// 参数解析
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended : true}))

// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  // 在调试跨域时请将值设置为 http://localhost:3000
  res.header('Access-Control-Allow-Origin', '*')
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.get('/test', (req, res) => {  
  let body = {
    code: 200,
    message: 'GET 请求',
    data: req.query
  }
  const callback = req.query.callback
  if (callback) { // jsonp 请求
    body = callback + '(' + JSON.stringify({ code: 200 }) + ')'
  }
  callback ? res.send(body) : res.json(body)
})

app.post('/test', (req, res) => {
  console.log(req.body)
  const body = {
    code: 200,
    message: 'POST 请求',
    data: req.body
  }
  res.json(body)
})

const port = 3001
app.listen(port, () => {
  console.log(`服务已启动 http://localhost:${port}`)
})