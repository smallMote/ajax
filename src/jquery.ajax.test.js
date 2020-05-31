const { baseUrl } = require('./ajax.conf.js')
const $ = require('jquery')

function request(url) {
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

request('/test')