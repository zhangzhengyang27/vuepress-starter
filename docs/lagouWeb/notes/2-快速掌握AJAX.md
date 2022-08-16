---
title: AJAX
date: '2022-05-12 17:53:00'
sidebar: 'true'
categories:
  - 前端
  - JS
tags:
  - 拉勾	
  - ajax
---



在了解 AJAX 之前我们可以简单的认为 「JavaScript 能力有限」，因为在此之前 Web 平台提供所有的 API 都只停留在「单机」的阶段。
这样就会造成一些无法实现的功能，例如：

- 无法在实现用户登录功能时，当用户输入邮箱地址显示用户对应的头像
- 无法在实现用户注册功能时，当用户输入邮箱或者用户名就提示是否存在
- 无法在实现留言板功能时，实时看到最新的用户留言

这些功能的开发最终都卡在一个相同的问题上：所需要的数据存放在服务端，我们无法通过已知的 API 获取到服务端存放的数据。
在此之前，我们可以通过以下几种方式让浏览器发出对服务端的请求，获得服务端的数据：

- 地址栏输入地址，回车，刷新
- 特定元素的 href 或 src 属性
- 表单提交



## Google Suggest

AJAX (Asynchronous JavaScript and XML)，最早出现在2005 年的 Google Suggest，是在浏览器端进行网络编程（发送
请求、接收响应）的技术方案，它使我们可以通过 JavaScript 直接获取服务端最新的内容而不必重新加载页面。让 Web更
能接近桌面应用的用户体验。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/google-suggest.png" alt="google-suggest" style="zoom: 50%;" />

## AJAX定义

AJAX 就是浏览器提供的一套 APl，可以通过 JavaScript 调用，从而实现通过代码控制请求与响应。实现通过JavaScript 进行网络编程。
至于XML：最早在客户端与服务端之间传递数据时所采用的数据格式就是 XML。

### 应用场景总结

AJAX 一般在开发中的用途我总结为以下四类：

- 按需获取数据
- 对用户输入的数据进行校验
- 自动更新页面上内容
- 提升用户体验-无刷新的体验

## 快速上手

AJAX API 中核心提供的是一个 XMLHttpRequest 类型，所有的 AJAX 操作都需要使用到这个类型。

```js
var xhr = new XMLHttpRequest()

xhr.open('GET', '/time')

xhr.send(null)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
}
```

>注意：涉及到 AJAX 操作的页面不能使用文件协议访问（文件的方式访问）

### readyState

由于 readystatechange 事件是在 xhr 对象状态变化时触发（不单是在得到响应时），也就意味着这个事件会被触发多次，所以我们有必要了解每一个状态值代表的含义：

| readyState |     状态描述     |                           说明                            |
| :--------: | :--------------: | :-------------------------------------------------------: |
|     0      |      UNSENT      |       代理（XHR）被创建，但尚未调用 `open()` 方法。       |
|     1      |      OPENED      |           `open()` 方法已经被调用，建立了连接。           |
|     2      | HEADERS_RECEIVED | `send()` 方法已经被调用，并且已经可以获取状态行和响应头。 |
|     3      |     LOADING      | 响应体下载中， `responseText` 属性可能已经包含部分数据。  |
|     4      |       DONE       |       响应体下载完成，可以直接使用 `responseText`。       |



### 遵循 HTTP

本质上 XMLHttpRequest 就是 JavaScript 在 Web 平台中发送 HTTP 请求的手段，所以我们发送出去的请求仍然是 HTTP 请求，同样符合 HTTP 约定的格式：

```js
// 设置请求报文的请求行
xhr.open('GET', '/time')
// 设置请求头
xhr.setRequestHeader('Accept', 'text/plain')
// 设置请求体
xhr.send(null)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    
    // 获取响应状态码
    console.log(this.status)
    
    // 获取响应状态描述
    console.log(this.statusText)
    
    // 获取响应头信息
    console.log(this.getResponseHeader('Content-Type')) // 指定响应头
    console.log(this.getAllResponseHeaders()) // 全部响应头
    
    // 获取响应体
    console.log(this.responseText) // 文本形式
    console.log(this.responseXML) // XML 形式，了解即可不用了
    
  }
}
```

### 具体用法

#### get

通常在一次 GET 请求过程中，参数传递都是通过 URL 地址中的 `?` 参数传递。

一般情况下 URL 传递的都是参数性质的数据，而 POST 一般都是业务数据

```js
var xhr = new XMLHttpRequest()

// GET 请求传递参数通常使用的是问号传参
xhr.open('GET', '/delete?id=1')

// 一般在 GET 请求时无需设置响应体，可以传 null 或者干脆不传
xhr.send(null)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
}
```

#### post

POST 请求过程中，都是采用请求体承载需要提交的数据。

```js
var xhr = new XMLHttpRequest()

xhr.open('POST', '/add')

// 设置请求头中的 Content-Type 为 application/x-www-form-urlencoded
// 标识此次请求的请求体格式为 urlencoded 以便于服务端接收数据
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

// 需要提交到服务端的数据可以通过 send 方法的参数传递 stringfy
xhr.send('name=zhangsan&age=18')

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
}
```

#### 同步与异步

`xhr.open()` 方法第三个参数要求传入的是一个 `bool` 值，其作用就是设置此次请求是否采用异步方式执行，默认为 `true`，如果需要同步执行可以通过传递 `false` 实现：

```js
var xhr = new XMLHttpRequest()

// 默认第三个参数为 true 意味着采用异步方式执行
xhr.open('GET', '/time', true)

xhr.send(null)

xhr.onreadystatechange = function () {
  if (this.readyState === 4) {
    // 这里的代码最后执行
    console.log('request done')
  }
}
```

如果采用同步方式执行，则代码会卡死在 `xhr.send()` 这一步：

```js
console.log('before ajax')
var xhr = new XMLHttpRequest()

// 同步方式
xhr.open('GET', '/time', false)

// 同步方式 执行需要 先注册事件再调用 send，否则 readystatechange 无法触发
xhr.onreadystatechange = function () {
   if (this.readyState === 4) {
     console.log('request done')
   }
}
xhr.send(null)

// 因为 send 方法执行完成 响应已经下载完成
console.log(xhr.responseText)
console.log('after ajax')
```

所以一定在发送请求 `send()` 之前注册 `readystatechange`（不管同步或者异步）

- 为了让这个事件可以更加可靠（一定触发），一定是先注册

> 了解同步模式即可，切记不要使用同步模式。

#### 属性

- `readyState`
- `status`
- `responseText`
- `responseXML`
- `onreadystatechange`

#### 方法

- `open(method, url, async)`
- `send(requsetBody)`
- `setRequestHeader(key, value)`
- `getResponseHeader(key)`

### XML

淘汰的原因：数据冗余太多

### JSON

也是一种数据描述手段，类似于 JavaScript 字面量方式

服务端采用 JSON 格式返回数据，客户端按照 JSON 格式解析数据。

>不管是 JSON 也好，还是 XML，只是在 AJAX 请求过程中用到，并不代表它们与 AJAX 之间有必然的联系，它们只是数据协议罢了。
>
>不管服务端是采用 XML 还是采用 JSON 本质上都是将数据返回给客户端。
>
>服务端应该根据响应内容的格式设置一个合理的 Content-Type。

### 缓存问题

缓存问题指的是：多次 AJAX GET 请求同一个 URL 得到的结果是相同的，目前绝大多数浏览器已经没有这个问题了，只有早期的IE浏览器(<= IE9) 任然存在这个问题

```js
var xhr = new XMLHttpRequest()
xhr.open('GET', '/time')
xhr.send(null)
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return
  console.log(this.responseText)
  // => 每次得到的结果都是相同的
}
```

#### URL 加戳

这个办法的核心就是让浏览器认为每次请求的地址都是不同的。

>不同的 querystring 会被浏览器认为是不同的地址，浏览器会忽略客户端缓存。

```js
var xhr = new XMLHttpRequest()
xhr.open('GET', '/time?t=' + Date.now())
xhr.send(null)
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return
  console.log(this.responseText)
}
```

#### 服务端设置响应头

由服务端通过 HTTP 响应报文中的响应头告知客户端浏览器不要缓存当前地址。

```js
app.get('/time', (req, res) => {
  res.set('Cache-Control', 'no-cache')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '-1')
  // 返回数据
  res.send(Date.now().toString())
})
```



## XMLHttpRequest 2.0

介绍完老版本的问题，接下来介绍一下新版本的特性。
HTML5中对 XMLHttpRequest 类型全面升级，更易用，更强大

### onload / onprogress

```js
var xhr = new XMLHttpRequest()

xhr.open('GET', '/time')

xhr.onload = function () {
  // onload readyState => 4
  // 只在请求完成时触发
  console.log(this.readyState)
}

xhr.onprogress = function (e) {
  // onprogress readyState => 3
  // 只在请求进行中触发
  console.log(this.readyState)
  // e.loaded  在周期性调用中接受到了多少信息。
  // e.total  该请求一共有多少信息。
}

xhr.send(null)
```

### response 属性

以对象的形式表述响应体，其类型取决于 `responseType` 的值。你可以尝试设置 `responseType` 的值，以便通过特定的类型请求数据。

```js
var xhr = new XMLHttpRequest()
xhr.open('GET', '/api/users')

// 主观认为服务端返回的响应体为 JSON 格式
xhr.responseType = 'json'
xhr.onload = function () {
  console.log(this.response)
  // => Array 而不是 JSON String
}
xhr.send(null)
```

>`responseType` 要在调用 `open()` 初始化请求之后，在调用 `send()` 发送请求到服务器之前设置方可生效。

|      值       |                             描述                             |
| :-----------: | :----------------------------------------------------------: |
|      ""       | 将 responseType 设为空字符串与设置为"text"相同， 是默认类型 （实际上是 DOMString）。 |
| "arraybuffer" |  response 是一个包含二进制数据的 JavaScript ArrayBuffer 。   |
|    "blob"     |         response 是一个包含二进制数据的 Blob 对象 。         |
|  "document"   | response 是一个 HTML Document 或 XML XMLDocument ，这取决于接收到的数据的 MIME 类型。请参阅 HTML in XMLHttpRequest 以了解使用 XHR 获取 HTML 内容的更多信息。 |
|    "json"     | response 是一个 JavaScript 对象。这个对象是通过将接收到的数据类型视为 JSON 解析得到的。 |
|    "text"     |          response 是包含在 DOMString 对象中的文本。          |

### FormData

以前 AJAX 操作只能提交字符串，现在可以提交 **二进制** 的数据。

```js
var formElement = document.querySelector('form#login')

// 表单数据对象
var data = new FormData(formElement)

// 额外文本内容
data.append('key', 'value')

// 额外文件内容
data.append('file', dom.files[0])

var xhr = new XMLHttpRequest()

xhr.open('POST', '/api/upload')

xhr.send(data)

xhr.onload = function () {
  console.log(this.responseText)
}
```

## 封装 AJAX 库

### 自己封装一个 AJAX 函数

> 这里主要是为了了解封装的过程，一般情况在开发中都是使用第三方提供的 AJAX 库，因为它们可能更加严谨。

为了在后续的开发过程中可以更方便的使用这套 API，一般的做法都是将其封装到一个函数中以便调用。

```js
/**
 * 发送一个 AJAX 请求
 * @param  {string}   url    请求地址
 * @param  {string}   method 请求方法
 * @param  {Object}   params 请求参数
 * @param  {function} done   请求完成过后需要做的事情（委托/回调）
 */
function ajax(url, method, params, done) {
  // 统一转换为大写便于后续判断
  method = method.toUpperCase()

  // 对象形式的参数转换为 urlencoded 格式
  var pairs = []
  for (var key in params) {
    pairs.push(key + '=' + params[key])
  }
  var querystring = pairs.join('&')

  // 兼容性
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState !== 4) return

    // 尝试通过 JSON 格式解析响应体
    try {
      done(JSON.parse(this.responseText))
    } catch (e) {
      done(this.responseText)
    }
  })

  // 如果是 GET 请求就设置 URL 地址 问号参数
  if (method === 'GET') {
    url += '?' + querystring
  }

  xhr.open(method, url)

  // 如果是 POST 请求就设置请求体
  var data = null
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    data = querystring
  }
  xhr.send(data)
}

ajax('get', '/getsomthing', { id: 123 }, function (data) {
  console.log(data)
})

ajax('post', '/addsomthing', { foo: 'posted data' }, function (data) {
  console.log(data)
})
```



## jQuery 中的 AJAX

jQuery 中有一套专门针对 AJAX 的封装，功能十分完善，经常使用，需要着重注意。

```js
$.ajax({
  url: '/time',
  type: 'get',
  dataType: 'json',
  data: { id: 1 },
  beforeSend: function (xhr) {
    console.log('before send')
  },
  success: function (data) {
    console.log(data)
  },
  error: function (xhr) {
    console.log(xhr)
  },
  complete: function (xhr) {
    console.log('request completed')
  }
})
```

常用选项参数介绍：

- url：请求地址
- type：请求方法，默认为 `get`
- dataType：服务端响应数据类型
- contentType：请求体内容类型，默认 `application/x-www-form-urlencoded`
- data：需要传递到服务端的数据，如果 GET 则通过 URL 传递，如果 POST 则通过请求体传递
- timeout：请求超时时间
- beforeSend：请求发起之前触发
- success：请求成功之后触发（响应状态码 200）
- error：请求失败触发
- complete：请求完成触发（不管成功与否）

### $.get

GET 请求快捷方法

```
$.get(url, data, callback)
```

### $.post

POST 请求快捷方法

```
$.post(url, data, callback)
```

### 其他常见 API

- `$(selector).load()` - 局部区域加载服务端返回的内容，有点类似 `iframe`
- `$.getJSON()` - 忽略服务端响应的 `Content-Type` 响应头，主观按照 JSON 格式解析响应体
- `$.getScript()` - 加载并执行服务端返回的一段 JavaScript 代码

## Axios

Axios 是目前应用最为广泛的 AJAX 封装库，相对于 jQuery 的优势在于支持 `Promise`、功能更强劲、职责更单一，后期会专门介绍到。

```js
axios
  .get('/time')
  .then(function (res) {
    console.log(res.data)
  })
  .catch(function (err) {
    console.error(err)
  })
```









