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

// 实际使用案例 结合promise
function request(url, method, params) {
  url = baseUrl + url
  // 兼容IE浏览器
  const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
  return new Promise((resolve, reject) => {
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function onChange() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        resolve(JSON.parse(xhr.response))
      }
    }
    xhr.send(params)
  })
}

request('/test', 'get')
.then(res => {
  console.log(res) // {code: 200, message: "GET 请求"}
})
.catch(err => {
  console.log(err)
})