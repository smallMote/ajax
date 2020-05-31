const axios = require('axios')
const { baseUrl } = require('./ajax.conf.js')

function request(url) {
  url = baseUrl + url
  axios.get(url).then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })
}

request('/test')