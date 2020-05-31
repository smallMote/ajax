// 原生ajax请求
const { baseUrl } = require('./ajax.conf.js')
function get(url) {
  url = baseUrl + url
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.status === 200 && xhr.readyState === 4) {
      console.log(JSON.parse(xhr.response))
    }
  }
  xhr.open('get', url)
  xhr.send()
}

// get('/test')

function post(url, params) {
  url = baseUrl + url
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if (xhr.status === 200 && xhr.readyState === 4) {
      console.log(JSON.parse(xhr.response))
    }
  }
  xhr.open('post', url)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(params) // 发送参数
}
// post('/test', 'id=10086&name=Luckyoung')