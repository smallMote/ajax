# 谈谈Ajax、Axios、Fetch

> AJAX即“Asynchronous Javascript And XML”（异步JavaScript和XML），是指一种创建交互式网页应用的网页开发技术。Ajax不是一种新的编程语言，而是使用现有标准的新方法。AJAX可以在不重新加载整个页面的情况下，与服务器交换数据。这种异步交互的方式，使用户单击后，不必刷新页面也能获取新数据。使用Ajax，用户可以创建接近本地桌面应用的直接、高可用、更丰富、更动态的Web用户界面。

官方已经说的很清楚了，就是一个解决异步获取数据、不用刷新页面的方案。在代码上的实现就是对`XMLHttpRequest`对象的操作。

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
  console.log(xhr) // 此处会执行三次
}
// 代码顺序并非执行顺序
```
上面就完成了一个简单的ajax的get请求，并且在方法体中注释了 `此处会执行三次`，那是因为在ajax请求的过程中会发生5个变化。
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