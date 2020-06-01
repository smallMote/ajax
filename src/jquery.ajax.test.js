const { baseUrl } = require('./ajax.conf.js')
const $ = require('jquery')

function get(url) {
  url =  baseUrl + url
  const xhr = $.get(url, (res) => {
    console.log(res)
  })
  xhr.abort()
}
// get('/test')

function post(url, params) {
  url = baseUrl + url
  $.post(url, params, (res) => {
    console.log(res)
  })
}
// post('/test', { id: 10086, name: 'Luckyoung'})'

// 应用
function request(url, method, params, callback, options) {
  const xhr = $.ajax({
    url: baseUrl + url,
    method,
    params, // post 传递的参数
    data: params, // get 传递的参数
    ...options,
    success(res) {
      callback(res)
    },
    err(err) {
      throw err
    }
  })
  xhr.abort('取消请求')
  // jquery现在已经支持了promise
  xhr.then(res => {
    console.log('promise', res) // 这里不会打印
  })
}
request(
  '/test', 
  'get', 
  { id: 10086, name: 'Luckyoung'}, 
  (res) => {
    console.log(res)
  },
  {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
    },
  })