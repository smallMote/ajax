const { baseUrl } = require('./ajax.conf.js')
const $ = require('jquery')

function get(url) {
  $.ajax({
    url: baseUrl + url,
    method: 'get',
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
    },
    success(res) {
      console.log(res)
    },
    error(err) {
      console.log(err)
    }
  })
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
  $.ajax({
    url: baseUrl + url + '/1',
    method,
    params,
    ...options,
    success(res) {
      callback(res)
    },
    err(err) {
      throw err
    }
  })
}
request('/test', 'get', { id: 10086, name: 'Luckyoung'}, (res) => {
  console.log(res)
})