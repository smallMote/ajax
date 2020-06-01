const axios = require('axios')
const { baseUrl } = require('./ajax.conf.js')

function get(url, params) {
  url = baseUrl + url
  axios.get(url, { params }).then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })
}
// get('/test', { name: 'Larry' })

function post(url, params) {
  url = baseUrl + url
  axios.post(url, params).then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })
}
// post('/test', { name: 'Luckyoung' })

function service() {
  const CancelToken = axios.CancelToken
  let cancel = null
  const request = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {}
  })

  // 请求拦截
  request.interceptors.request.use(
    req => {
      // 你可以在这里做些操作，比如验证token的有效性或者是设置请求头等
      return req
    },
    err => {
      // 错误处理
      console.log('err', err)
      return err
    }
  )

  // 返回拦截
  request.interceptors.response.use(
    res => {
      // axios 会将返回的数据包裹一层data，在拦截这里可以去掉这一层data
      return res.data
    },
    err => {
      // 错误处理
      console.log('非200返回', err)
      return err
    }
  )

  // 请求
  request.request({
    url: '/test',
    method: 'post',
    data: { name: 'Luckyoung' }, // post 参数
    params: { name: 'Luckyoung' }, // get 参数
    cancelToken: new CancelToken(function executor(c) {
      cancel = c
    })
  })
    .then(res => {
      console.log(res)
    })
    .catch(e => {
      console.log('请求失败', e)
    })

  if (cancel) {
    cancel('取消请求啦！') // 取消请求,传递的参数会被响应拦截器拦截到err中
  }
}
// service()


// 重复点击问题，取消上一次请求,最后一次请求生效
function clearRepeatClick() {
  const button  = document.createElement('button')
  button.innerText = 'Click Me'
  const CancelToken = axios.CancelToken
  const pending = [] // 存放正在请求的ajax

  // 取消请求函数
  function cancel(conf) {
    pending.forEach((item, index) => {
      if (item.p + item.m === conf.url + conf.method) {
        item.c('取消请求', item.toString()) // 取消请求
        pending.splice(index, 1) // 在队列中删除本次请求
      }
    })
  }

  // 创建请求实例
  const request = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {}
  })

  // 请求拦截
  request.interceptors.request.use(
    req => {
      // 取消上一次请求
      cancel(req)
      // 将每次请求的标识放如正在请求的队列里面
      req.cancelToken = new CancelToken(c => {
        pending.push({
          p: req.url, // 请求url
          m: req.method, // 请求方法
          c
        })
      })
      return req
    },
    err => {
      console.log(err)
    }
  )

  // 返回拦截
  request.interceptors.response.use(
    res => {
      // 取消已完成的请求
      cancel(res.config)
      console.log(pending)
      return res
    },
    err => {
      console.log(err)
    }
  )

  window.onload = () => {
    document.body.appendChild(button)
    button.addEventListener('click', function click() {
      request.get(baseUrl + '/test', {
        cancelToken: new CancelToken((c) => {
          source = c
        })
      })
        .then(res => {
          console.log(res)
        })
    })
  }
}
clearRepeatClick()