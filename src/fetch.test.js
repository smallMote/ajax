const { baseUrl } = require('./ajax.conf.js')
function request(url) {
  url = baseUrl + url
  fetch(url, {
    method: 'post',
    body: 'name=Luckyoung',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(async res => {
      // 默认是 ReadableStream 类型
      console.log(await res.json())
    })
    .catch(err => {
      console.log(err)
    })
}
request('/test')