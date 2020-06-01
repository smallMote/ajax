# 谈谈Ajax、Axios、Fetch

[toc]

> AJAX即“Asynchronous Javascript And XML”（异步JavaScript和XML），是指一种创建交互式网页应用的网页开发技术。Ajax不是一种新的编程语言，而是使用现有标准的新方法。AJAX可以在不重新加载整个页面的情况下，与服务器交换数据。这种异步交互的方式，使用户单击后，不必刷新页面也能获取新数据。使用Ajax，用户可以创建接近本地桌面应用的直接、高可用、更丰富、更动态的Web用户界面。

官方已经说的很清楚了，就是一个解决异步获取数据、不用刷新页面的方案。在代码上的实现就是对`XMLHttpRequest`对象的操作。

### 原生Ajax
原生ajax，也就是使用`XMLHttpRequest`对象对服务端请求资源。
源代码`src/xhr.test.js`
```js
// 1.创建一个xhr实例
const xhr = new XMLHttpRequest()
// 2.参数配置
xhr.open('get', url)
// 3.发送请求
xhr.send()
// 4.接收服务端的响应变化
xhr.onreadystatechange = function() {
  console.log(xhr) // 此处会执行四次
}
// 代码顺序并非执行顺序
```
上面就完成了一个简单的ajax的get请求，并且在方法体中注释了 `此处会执行四次`，那是因为在ajax请求的过程中会发生5个变化。
```
// 与`xhr.readyState`字段对应
0: 请求未初始化
1: 服务器连接已建立
2: 请求已接收
3: 请求处理中
4: 请求已完成，且响应已就绪

打印四次是因为，只有客户端与服务端建立连接后客户端才能收到服务端的信息推送。
```
使用Ajax的post请求。
源代码`src/xhr.test.js`
```js
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function() {
  if (xhr.status === 200 && xhr.readyState === 4) {
    console.log(JSON.parse(xhr.response))
  }
}
xhr.open('post', url)
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
xhr.send(params) // 发送参数
```

ajax 中断请求。ajax在请求过程中是可以主动中断请求的，使用`xhrInstance`接口提供的`abort`函数。
案例在`src/xhr.test.js[32-55]`
```js
// 实际使用案例 结合promise
function request(url, method, params) {
  url = baseUrl + url
  // 兼容IE浏览器 < 7
  const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
  return new Promise((resolve, reject) => {
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function onChange() {
      console.log(xhr) // 只会打印2次
      if (xhr.readyState === 2) {
        xhr.abort() // 将终止请求 并且xhr.readyState会重置为0
      }
      if (xhr.status === 200 && xhr.readyState === 4) {
        resolve(JSON.parse(xhr.response)) // 这里不会打印
      }
    }
    xhr.send(params)
  })
}
```

### jQuery中的Ajax
案例在`src/jquery.ajax.test.js`。
jquery中的`$.ajax`是对`XMLHttpRequest`和`ActiveXObject`兼容封装,使用起来简单方便。在jquery中单独使用`get`和`post`请求函数的时候，可以使用回调函数的方式拿到请求结果。
get请求：
```js
$.get(url, data, (res) => {
  console.log(res)
})
```
post请求：

```js
$.post(url, params, (res) => {
  console.log(res)
})
```
中断请求
jquery中的ajax请求会返回一个`XMLHttpRequest`实例，所以取消方式与原生ajax是一样的。
```js
// get 请求
const xhr = $.get(url, (res) => {
    console.log(res)
  })
xhr.abort() // 取消请求

// ajax函数中
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
```

### Axios
案例在`src/axios.ajax.test.js`
Axios也是对`XMLHttpRequest`的封装，只是使用了`Promise`封装，返回的也是一个Promise对象。对于目前的市场来说是很受欢迎的，因为axios提供了请求与返回的拦截处理，在处理数据和返回情况方面也是很好的。
```js
// get 请求
axios.get(url, { params }).then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })
// post 请求
axios.post(url, params).then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })
```

拦截器。在使用拦截器之前你需要创建一个请求对象，使用`axios.create`即可。
```js
// 可以设置一些基本配置
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
// 使用
request.request({
  url: '/test',
  method: 'post',
  data: { name: 'Luckyoung' }, // post 参数
  params: { name: 'Luckyoung' } // get 参数
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log('请求失败', e)
  })
```

取消请求，axios中取消请求提供了两种方式，一个是在配置中设置属性，另一个是使用取消函数。因为使用了Promise封装的原因，取消ajax请求后还要中断Promise链，所以和jquery、原生ajax取消方式复杂一些。
```js
const CancelToken = axios.CancelToken
let cancel = null

axios.get('/test', {
  cancelToken: new CancelToken((c) => {
    cancel = c
  })
})
  .then(res => {
    console.log(res) // 不会打印
  })
  .catch(e => {
    console.log(e) // Cancel {message: "取消请求"}
  })

// 取消请求
if (cancel) {
  cancel('取消请求')
}
```

在这里可以通过对axios的封装解决重复请求的问题。在实际场景中，有些用户往往在某个行为上重复执行，但这个行为又会触发对服务器的请求，为了减少对服务器请求的压力，延迟函数是一个方式，但是每次都要在点击的地方添加延迟函数未免太过麻烦，我们就可以对axios进一步封装解决用户这种“疯狂”的行为。
```js
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
```

### fetch请求
fetch是ES6的产物，基于原生js+Promise封装的一个请求方法，非`XMLHttpRequest`实现。说是取代Ajax，结果被啪啪打脸，因为fetch可以说是更接近原生的ajax，而且对400、500状态码不敏感，不会用reject抛出来。目前使用上没有前面两者多，我这里就简单的介绍一下使用方法。
```js
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
```

### 跨域
> 源码提示：在测试跨域的时候，服务端我设置的响应头是3000，而我客户端是8080就跨域了。
服务端文件：`server/index.js`
响应头代码：`'Access-Control-Allow-Origin': 'http://localhost:3000'`

使用jsonp跨域。jsonp是一套非标准传输传输信息的方案。在`XMLHttpRequest`中，在html文件中有`src`属性的标签支持跨域。jsonp就利用了这个bug，在本地引入服务端js文件，服务端远程调用客户端的js函数实现信息传输。
```js
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
$.ajax({
  url: baseUrl + '/test',
  dataType: 'jsonp',
  jsonp: 'callback',
  jsonpCallback: 'jsonpCross',
  type: 'get',
  success: function(data) {
    console.log(data) // 获取数据
  },
  error(e) {
    console.log(e)
  }
})
```

Nginx代理跨域
```bash
#proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;

    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

nodejs中间转发
使用nodejs创建一个服务，然后开放域名以及请求设置。该案例是使用`express`作为服务端，可参考。
文件地址：`server/index.js`
```js
// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
```

终极方案
让后端自己搞。