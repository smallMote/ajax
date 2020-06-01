const $ = require('jquery')
const { baseUrl } = require('./ajax.conf')

// jsonp 跨域
$(function() {
  const src = 'http://localhost:3001/jsonp.callback.js'
  const $head = $('head')
  const $client = $(`<script>
  function jsonp(data) {
    console.log(data) // {name: "Luckyoung"}
  }
  </script>`)
  const $script = $(`<script src="${src}"></script>`)
  $head.append($client)
  $head.append($script)
})

// jquery.ajax + jsonp
function request() {
  $.ajax({
    url: baseUrl + '/test',
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'jsonpCross',
    type: 'get',
    success: function(data) {
      console.log(data)
    },
    error(e) {
      console.log(e)
    }
  })
}
request()