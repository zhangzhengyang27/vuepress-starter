## 本章内容

- 用模块组织代码
- 编码规范
- 用回调处理一次性完结的事件
- 用事件发射器处理重复性事件
- 实现串行和并行的流程控制
- 使用流程控制工具

Node不像大多数开源平台那样，它很容易设置，对内存和硬盘空间没有过多要求。也不需要复杂的集成开发环境或构建系统。但掌握一些基础知识对你的起步会有很大帮助。本章要解决Node开发新手要面对的两个难题：

- 如何组织代码；
- 怎么做异步编程。

大多数经验丰富的程序员都非常熟悉组织代码的问题。按照概念将逻辑组织成类和函数。将包含类和函数的文件组织到源码树的目录中。最后代码被组织到程序和库中。Node的模块系统提供了强大的代码组织机制，本章就要教你如何利用它组织代码。

要领会和掌握异步编程可能需要花些时间。你对程序逻辑应该如何执行的认识要有模式上的转变。在同步编程中，你在写下一行代码时就知道它前面的所有代码都会先于它执行。然而在异步开发中，程序逻辑乍一看可能就像鲁贝·戈德堡机（Rube Goldberg machine）一样复杂而又滑稽。俗话说，磨刀不误砍柴工，在开始开发大型项目之前，应该学一下怎么才能优雅地控制程序的行为。

本章会介绍几种重要的异步编程技术，让你能牢牢地控制程序将如何执行。你将学到：

- 如何响应一次性事件；
- 如何处理重复性事件；
- 如何让异步逻辑顺序执行。

然而我们要先讲一下如何用模块解决代码组织的问题，模块是Node让代码易于重用的一种组织和包装方式。

## 3.1 Node 功能的组织及重用

在创建程序时，不管是用Node还是什么，经常会出现不可能把所有代码放到一个文件中的情况。当出现这种情况时，传统的方式是按逻辑相关性对代码分组，将包含大量代码的单个文件分解成多个文件，如图3-1所示。

![image-20220522132529457](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522132529457.png)

在某些语言的实现中，比如PHP和Ruby，整合另一个文件（我们称之为“included”文件）中的逻辑，可能意味着在被引入文件中执行的逻辑会影响全局作用域。也就是说被引入文件创建的任何变量，以及声明的任何函数都可能会覆盖包含它的应用程序所创建的变量和声明的函数。

假设你用PHP写程序，你的程序中可能会有下面这种逻辑：

```js
function uppercase_trim($text)
return trim(strtoupper ($text));
include( 'string_handlers .php"）;
```

如果string_handlers.php文件也定义了一个uppercase_trim函数，你会收到一条错误消息：

```js
Fatal error: Cannot redeclare uppercase_trim()
```

在PHP中可以用命名空间避免这个问题，而Ruby通过模块提供了类似的功能。可Node的做法是不让你有机会在不经意间污染全局命名空间。

> PHP命名空间和Ruby模块 PHP命名空间在它的手册上有相关
>
> 论述：http://php.net/manual/en/language.namespaces.php。Ruby模块在Ruby文档中有解释说明：www.rubydoc.org/core-1.9.3/Module.html 

Node模块打包代码是为了重用，但它们不会改变全局作用域。比如说，假设你正用PHP开发一个开源的内容管理系统（CMS），并且想用一个没有使用命名空间的第三方API库。这个库中可能有一个跟你的程序中同名的类，除非你把自己程序中的类名或者库中的类名给改了，否则这个类可能会搞垮你的程序。可是修改你的程序中的类名可能会让那些以你的CMS为基础构建项目的开发人员遇到问题。如果你选择修改那个库中的类名，那么你每次更新程序源码树中的那个库时都得记着再改一次。命名冲突问题最好是从根本上予以避免。

Node模块允许你从被引入文件中选择要暴露给程序的函数和变量。如果模块返回的函数或变量不止一个，那它可以通过设定exports对象的属性来指明它们。但如果模块只返回一个函数或变量，则可以设定module.exports属性。图3-2展示了这一工作机制。

![image-20220522132929555](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522132929555.png)

如果你觉得有点晕，先别急。我们在这一章里会给出好几个例子。

Node的模块系统避免了对全局作用域的污染，从而也就避免了命名冲突，并简化了代码的重用。模块还可以发布到npm（Node包管理器）存储库中，这是一个收集了已经可用并且要跟Node社区分享的Node模块的在线存储库，使用这些模块没必要担心某个模块会覆盖其他模块的变量和函数。我们会在第14章讨论如何把模块发布到npm存储库中。

为了帮你把逻辑组织到模块中，我们会讨论下面这些主题：

- 如何创建模块；
- 模块放在文件系统中的什么地方；
- 在创建和使用模块时要意识到的东西。

我们这就深入到Node模块系统的学习中去，开始创建我们的第一个模块。

### 3.1.1 创建模块

模块既可能是一个文件，也可能是包含一个或多个文件的目录，如图3-3所示。如果模块是个目录，Node通常会在这个目录下找一个叫index.js的文件作为模块的入口（这个默认设置可以重写，见3.1.4节）。

典型的模块是一个包含exports对象属性定义的文件，这些属性可以是任意类型的数据，比如字符串、对象和函数。

为了演示如何创建基本的模块，我们在一个名为currency.js的文件中添加一些做货币转换的函数。这个文件如下面的代码清单所示，其中有两个函数，分别对加元和美元进行互换。

```js
var canadianDollar = 0.91;

function roundTwoDecimals(amount) {
  return Math.round(amount * 100) / 100;
}

exports.canadianToUS = function(canadian) {
  return roundTwoDecimals(canadian * canadianDollar);
}

exports.USToCanadian = function(us) {
  return roundTwoDecimals(us / canadianDollar);
}
```

exports对象上只设定了两个属性。也就是说引入这个模块的代码只能访问到canadianToUS和USToCanadian这两个函数。而变量canadianDollar作为私有变量仅作用在canadianToUS和USToCanadian的逻辑内部，程序不能直接访问它。

使用这个新模块要用到Node的require函数，该函数以你要用的模块的路径为参数。Node以同步的方式寻找它，定位到这个模块并加载文件中的内容。

> 关于**require**和同步I/O 
>
> require是Node中少数几个同步I/O操作之一。因为经常用到模块，并且一般都是在文件顶端引入，所以把require做成同步的有助于保持代码的整洁、有序，还能增强可读性。但在程序中I/O密集的地方尽量不要用require。所有同步调用都会阻塞Node，直到调用完成才能做其他事情。比如你正在运行一个HTTP服务器，如果在每个进入的请求上都用了require，就会遇到性能问题。所以通常都只在程序最初加载时才使用require和其他同步操作。

下面这个是test-currency.js中的代码，它require了currency.js模块：

```js
var currency = require('./currency'); 

console.log('50 Canadian dollars equals this amount of US dollars:');
console.log(currency.canadianToUS(50));

console.log('30 US dollars equals this amount of Canadian dollars:');
console.log(currency.USToCanadian(30));
```

引入一个以./开头的模块意味着，如果你准备创建的程序脚本test-currency.js在currency_app目录下，那你的currency.js模块文件，如图3-4所示，应该也放在currency_app目录下。在引入时，.js扩展名可以忽略。

![image-20220522133535276](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522133535276.png)

在Node定位到并计算好你的模块之后，require函数会返回这个模块中定义的exports对象中的内容，然后你就可以用这个模块中的两个函数做货币转换了。

如果你想把这个模块放到子目录中，比如lib，只要把require语句改成下面这样就可以了：

```js
var currency = require('../lib/currency'); 
```

组装模块中的exports对象是在单独的文件中组织可重用代码的一种简便方法。

### 3.1.2 用module.exports微调模块的创建

尽管用函数和变量组装exports对象能满足大多数的模块创建需要，但有时你可能需要用不同的模型创建该模块。

比如说，前面创建的那个货币转换器模块可以改成只返回一个Currency构造函数，而不是包含两个函数的对象。一个面向对象的实现看起来可能像下面这样：

```js
var Currency = require('./currency'）;
var canadianDollar = 0.91;
                       
var currency = new Currency (canadianDollar);
console.1og(currency.canadianTous(50))；
```

如果只需要从模块中得到一个函数，那从require中返回一个函数的代码要比返回一个对象的代码更优雅。

要创建只返回一个变量或函数的模块，你可能会以为只要把exports设定成你想返回的东西就行。但这样是不行的，因为Node觉得不能用任何其他对象、函数或变量给exports赋值。下面这个代码清单中的模块代码试图将一个函数赋值给exports。

代码清单3-3 这个模块不能用

```js
var Currency = function (canadianDollar) {
		this.canadianDollar - canadianDollar；
}

Currency.prototype.roundTwoDecimals = function (amount){
		return Math. round (amount*100) / 100；
}

Currency.prototype.canadianTous=function (canadian) {
		return this .roundTwoDecinals (canadian *this.canadianDollar)；
}

Currency.prototype.USToCanadian = funetion (us){
  	return this.rounaTwoDecimals(us/this.canadianDollar)；
}

exports = Currency;
```

为了让前面那个模块的代码能用，需要把exports换成module.exports。用module.exports可以对外提供单个变量、函数或者对象。如果你创建了一个既有exports又有module.exports的模块，那它会返回module.exports，而exports会被忽略。

> 导出的究竟是什么
>
> 最终在程序里导出的是module.exports。exports只是对module.exports的一个全局引用，最初被定义为一个可以添加属性的空对象。所以 exports.myFunc 只 是module.exports.myFunc的简写。

所以，如果把exports设定为别的，就打破了module.exports和exports之间的引用关系。可是因为真正导出的是module.exports，那样exports就不能用了，因为它不再指向module.exports了。如果你想维持那个链接，可以像下面这样让module.exports再次引用exports：

```js
module.exports = exports = Currency; 
```

根据需要使用exports或module.exports可以将功能组织成模块，规避掉程序脚本一直增长产生的弊端。

### 3.1.3 用node_modules重用模块

要求模块在文件系统中使用相对路径存放，对于组织程序特定的代码很有帮助，但对于想要在程序间共享或跟其他人共享代码却用处不大。Node中有一个独特的模块引入机制，可以不必知道模块在文件系统中的具体位置。这个机制就是使用node_modules目录。前面那个模块的例子中引入的是./currency。如果省略./，只写currency，Node会遵照几个规则搜寻这个模块，如图3-5所示。

![image-20220522134522357](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522134522357.png)

用环境变量NODE_PATH可以改变Node模块的默认路径。如果用了它，NODE_PATH在Windows中应该设置为用分号分隔的目录列表，在其他操作系统中用冒号分隔。

### 3.1.4 注意事项

尽管Node模块系统的本质简单直接，但还是有两点需要注意一下。

第一，如果模块是目录，在模块目录中定义模块的文件必须被命名为index.js，除非你在这个目录下一个叫package.json的文件里特别指明。要指定一个取代index.js的文件，package.json文件里必须有一个用JavaScript对象表示法（JSON）数据定义的对象，其中有一个名为main的键，指明模块目录内主文件的路径。图3-6中的流程图对这些规则做了汇总。

![image-20220522134652296](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522134652296.png)

这里有个 package.json 文件的例子，它指定currency.js为主文件：

```js
{
	“main”:"./currency.js"
}
```

还有一点需要注意的是，Node能把模块作为对象缓存起来。如果程序中的两个文件引入了相同的模块，第一个文件会把模块返回的数据存到程序的内存中，这样第二个文件就不用再去访问和计算模块的源文件了。实际上第二个引入有机会修改缓存的数据。这种“猴子补丁”（monkey patching）让一个模块可以改变另一个模块的行为，开发人员可以不用创建它的新版本。

熟悉Node模块系统最好的办法是自己动手试一试，亲自验证一下本节所描述的Node的行为。

你对模块的工作机制有了基本的认识，接下来我们开始学习异步编程技术吧。

## 3.2 异步编程技术

如果你做过Web前端编程，并且遇到过界面事件（比如鼠标点击）触发的逻辑，那你就做过异步编程。服务端异步编程也一样：事件发生会触发响应逻辑。在Node的世界里流行两种响应逻辑管理方式：回调和事件监听。

回调通常用来定义一次性响应的逻辑。比如对于数据库查询，可以指定一个回调函数来确定如何处理查询结果。这个回调函数可能会显示数据库查询结果，根据这些结果做些计算，或者以查询结果为参数执行另一个回调函数。

事件监听器，本质上也是一个回调，不同的是，它跟一个概念实体（事件）相关联。例如，当有人在浏览器中点击鼠标时，鼠标点击是一个需要处理的事件。在Node中，当有HTTP请求过来时，HTTP服务器会发出一个请求事件。你可以监听那个请求事件，并添加一些响应逻辑。在下面这个例子中，每当有请求事件发出时，服务器就会调用handleRequest函数：

```js
server.on('request',handleRequest)
```

一个NodeHTTP服务器实例就是一个事件发射器，一个可以继承、能够添加事件发射及处理能力的类（EventEmitter）。Node的很多核心功能都继承自EventEmitter，你也能创建自己的事件发射器。

Node有两种常用的响应逻辑组织方式，我们已经用其中一种构建了响应逻辑，现在该了解一下它是如何实现的了，所以接下来要学习如下内容：

- 如何用回调处理一次性事件；
- 如何用事件监听器响应重复性事件；
- 异步编程的几个难点。

先来看这个最常用的异步代码编写方式：使用回调。

### 3.2.1 用回调处理一次性事件

回调是一个函数，它被当做参数传给异步函数，它描述了异步操作完成之后要做什么。回调在Node开发中用得很频繁，比事件发射器用得多，并且用起来也很简单。

为了在程序中演示回调的用法，我们来做一个简单的HTTP服务器，让它实现如下功能：

- 异步获取存放在JSON文件中的文章的标题；
- 异步获取简单的HTML模板；
- 把那些标题组装到HTML页面里；
- 把HTML页面发送给用户。

最终结果如图3-7所示。

![image-20220522134938372](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522134938372.png)

JSON文件（titles.json）会被格式化成一个包含文章标题的字符串数组，内容如下所示。

代码清单3-4 一个包含文章标题的列表

```js
[
  "Kazakhstan is a huge country. .. what goes on there?",
	"This weather is making me craaazy",
	"My neighbor sort of howls at night"
]
```

HTML模板文件（template.html），如下所示，结构很简单，可以插入博客文章的标题。

代码清单3-5 用来渲染博客标题的HTML模板

```html
<!doctype html>
<html>
	<head></head>
	<body>
	＜h1>Latest Posts</hl>
  <!--%会被替换为标题--->
	<u1><1i>%</1i></ul>
	</body>
</html>
```

获取JSON文件中的标题并渲染Web页面的代码如下所示（blog_recent.js），其中的回调函数以黑体显示。

![image-20220522135957176](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522135957176.png)

这个例子嵌入了三层回调：

三层还算可以，但回调层数越多，代码看起来越乱，重构和测试起来也越困难，所以最好限制一下回调的嵌套层级。如果把每一层回调嵌套的处理做成命名函数，虽然表示相同逻辑所用的代码变多了，但维护、测试和重构起来会更容易。下面代码清单中的代码功能跟代码清单3-6中的一样。

![image-20220522140334453](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522140334453.png)

你还可以用Node开发中的另一种惯用法减少由if/else引起的嵌套：尽早从函数中返回。下面的代码清单功能跟前面一样，但通过尽早返回的做法避免了进一步的嵌套。它还明确表示出了函数不应该继续执行的意思。

![image-20220522140426583](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522140426583.png)

你已经学过如何用回调为读取文件和Web服务器请求这样的一次性任务定义响应了，接下来我们去学学如何用事件发射器组织事件。

> Node的异步回调惯例
>
> Node中的大多数内置模块在使用回调时都会带两个参数：第一个是用来放可能会发生的错误的，第二个是放结果的。错误参数经常被缩写为er或err。

下面是这个常用的函数签名的典型示例：

```js
var fs = require('fs'); 

fs.readFile('./titles.json', function(er, data) { 
 	if (er) throw er; 
  // do something with data if no error has occurred 
});
```

### 3.2.2 用事件发射器处理重复性事件

事件发射器会触发事件，并且在那些事件被触发时能处理它们。一些重要的Node API组件，比如HTTP服务器、TCP服务器和流，都被做成了事件发射器。你也可以创建自己的事件发射器。

我们之前说过，事件是通过监听器进行处理的。监听器是跟事件相关联的，带有一个事件出

现时就会被触发的回调函数。比如Node中的TCP socket，它有一个data事件，每当socket中有新

数据时就会触发：

```js
socket.on('data', handleData)；
```

我们看一下用data事件创建的echo服务器。

#### 1.事件发射器示例

echo服务器就是个处理重复性事件的简单例子，当你给它发送数据时，它会把那个数据发回来，如图3-8所示。

![image-20220522140827384](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522140827384.png)

下面的代码清单实现了一个echo服务器。当有客户端连接上来时，它就会创建一个socket。socket是个事件发射器，可以用on方法添加监听器响应data事件。只要socket上有新数据过来，就会发出这些data事件。

```js
var net = require('net');

var server = net.createServer(function(socket) {
  // 当读取到新数据时处理的data事件
  socket.on('data', function(data) {
    // 数据被写回到客户端
    socket.write(data);
  });
});

server.listen(8888);
```

用下面这条命令可以运行echo服务器：

```js
node echo_server.js
```

echo服务器运行起来之后，你可以用下面这条命令连上去：

```js
telnet 127.0.0.1:8888
```

你每次通过连上去的telnet会话把数据发送给服务器，数据就会传回到telnet会话中。

> Windows上的Telnet 如果你用的是微软的Windows操作系统，那上面可能还没装telnet，你得自己装。TechNet上有各版本Windows下的安装指南：http://mng.bz/egzr。

#### 2.响应只应该发生一次的事件

监听器可以被定义成持续不断地响应事件，如上例所示，也能被定义成只响应一次。下面的代码用了once方法，对前面那个echo服务器做了修改，让它只回应第一次发送过来的数据。

代码清单3-10 用once方法响应单次事件**data**事件只被处理一次

```js
var net = require('net');

var server = net.createServer(function(socket) {
  socket.once ('data', function(data) {
    socket.write(data);
  });
});

server.listen(8888);
```

#### 3.创建事件发射器：一个PUB/SUB的例子

前面的例子用了一个带事件发射器的Node内置API。然而你可以用Node内置的事件模块创建自己的事件发射器。

下面的代码定义了一个channel事件发射器，带有一个监听器，可以向加入频道的人做出响应。注意这里用on（或者用比较长的addListener）方法给事件发射器添加了监听器：

```js
var EventEmitter = require('events').Event Emitter;
var channel = new EventEmitter()；
channel.on( 'join',function()
		console.log("Welcome！）；
})；
```

然而这个join回调永远都不会被调用，因为你还没发射任何事件。所以还要在上面的代码中加上一行，用emit函数发射这个事件：

```js
channel.emit('join')
```

> 事件名称
>
> 事件只是个键，可以是任何字符串：data、join或某些长的让人发疯的事件名都行。只有一个事件是特殊的，那就是error，我们马上就会看到它。

你在第2章用具有发布/预订功能的Socket.IO模块构建了一个聊天程序。接下来我们看看应该如何实现自己的发布/预订逻辑。

代码清单3-11是一个简单的聊天服务器。聊天服务器的频道被做成了事件发射器，能对客户端发出的join事件做出响应。当有客户端加入聊天频道时，join监听器逻辑会将一个针对该客户端的监听器附加到频道上，用来处理会将所有广播消息写入该客户端socket的broadcast事件。事件类型的名称，比如join和broadcast，完全是随意取的。你也可以按自己的喜好给它们换个名字。

代码清单3-11 用事件发射器实现的简单的发布/预订系统

```js
var events = require('events')
  , net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

// 添加join事件的监听器，保存用户的client对象，以便程序可以将数据发送给用户
channel.on('join', function(id, client) {
  this.clients[id] = client; 
  this.subscriptions[id] = function(senderId, message) {
    // 忽略发出这一广播数据的用户
    if (id != senderId) { 
      this.clients[id].write(message);
    }
  }
  // 添加一个专门针对当前用户的broadcast事件监听器
  this.on('broadcast', this.subscriptions[id]); 
});

channel.on('leave', function(id) { 
  channel.removeListener('broadcast', this.subscriptions[id]); 
  channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function() {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  // 当有用户连到服务器上来时发出一个join事件，指明用户ID和client对象
  client.on('connect', function() {
    channel.emit('join', id, client); 
  });
  // 当有用户发送数据时，发出一个频道broadcast事件，指明用户ID和消息
  client.on('data', function(data) {
    data = data.toString();
    if (data == "shutdown\r\n") {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data); 
  });
  client.on('close', function() {
    channel.emit('leave', id); 
  });
});
server.listen(8888);
```

把聊天服务器跑起来后，在命令行中输入下面的命令进入聊天程序：

```js
telent 127.0.0.1 8888
```

如果你打开几个命令行窗口，在其中任何一个窗口中输入的内容都将会被发送到其他所有窗口中。

这个聊天服务器还有个问题，在用户关闭连接离开聊天室后，原来那个监听器还在，仍会尝试向已经断开的连接写数据。这样自然就会出错。为了解决这个问题，你还要按照下面的代码清单把监听器添加到频道事件发射器上，并且向服务器的close事件监听器中添加发射频道的leave事件的处理逻辑。leave事件本质上就是要移除原来给客户端添加的broadcast监听器。此段代码上面已存在

如果出于某种原因你想停止提供聊天服务，但又不想关掉服务器，可以用removeAllListeners事件发射器方法去掉给定类型的全部监听器。下面是在我们的聊天服务器上使用这一方法的示例：

```js
channel.on('shutdown', function() {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.removeAllListeners('broadcast');
});
```

然后你可以添加一个停止服务的聊天命令。为此需要将data事件的监听器改成下面这样：

```js
client.on('data', function(data) {
   data = data.toString();
   if (data == "shutdown\r\n") {
      channel.emit('shutdown');
   }
   channel.emit('broadcast', id, data); 
});
```

现在只要有人输入shutdown命令，所有参与聊天的人都会被踢出去。

**错误处理**

在错误处理上有个常规做法，你可以创建发出error类型事件的事件发射器，而不是直接抛出错误。这样就可以为这一事件类型设置一个或多个监听器，从而定义定制的事件响应逻辑。

下面的代码显示的是一个错误监听器如何将被发出的错误输出到控制台中：

```js
var events = require('events'); 

var myEmitter = new events.EventEmitter(); 

myEmitter.on('error', function(err) { 
    console.log('ERROR: ' + err.message); 
}); 

myEmitter.emit('error', new Error('Something is wrong.'));
```

如果这个error事件类型被发出时没有该事件类型的监听器，事件发射器会输出一个堆栈跟踪（到错误发生时所执行过的程序指令列表）并停止执行。堆栈跟踪会用emit调用的第二个参数指明错误类型。这是只有错误类型事件才能享受的特殊待遇，在发出没有监听器的其他事件类型时，什么也不会发生。

如果发出的error类型事件没有作为第二个参数的error对象，堆栈跟踪会指出一个“未捕获、未指明的‘错误’事件”错误，并且程序会停止执行。你可以用一个已经被废除的方法处理这个错误，用下面的代码定义一个全局处理器实现响应逻辑：

```js
process.on('uncaughtException', function(err){ 
 		console.error(err.stack); 
 		process.exit(1); 
});
```

除了这个，还有像domain（http://nodejs.org/api/domain.html）这样正在开发的方案，但它们是实验性质的。

如果你想让连接上来的用户看到当前有几个已连接的聊天用户，可以用下面这个监听器方法，它能根据给定的事件类型返回一个监听器数组：

![image-20220522144722438](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220522144722438.png)

为了增加能够附加到事件发射器上的监听器数量，不让Node在监听器数量超过10个时向你发出警告，可以用setMaxListeners方法。以频道事件发射器为例，可以用下面的代码增加监听器的数量：

```js
channel.setMaxListeners(50)
```

#### 4.扩展事件监听器：文件监视器

如果你想在事件发射器的基础上构建程序，可以创建一个新的JavaScript类继承事件发射器。比如创建一个Watcher类来处理放在某个目录下的文件。然后可以用这个类创建一个工具，该工具可以监视目录（将放到里面的文件名都改成小写），并将文件复制到一个单独目录中。

扩展事件发射器需要三步：

1. 创建类的构造器；
2. 继承事件发射器的行为；
3. 扩展这些行为。

下面的代码是Watcher类的构造器。它的两个参数分别是要监控的目录和放置修改过的文件的目录：

```js
function Watcher(watchDir, processedDir) {
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}
```

接下来要添加继承事件发射器行为的代码：

```js
var events = require('events')
  , util = require('util');

util.inherits(Watcher, events.EventEmitter);
```

注意inherits函数的用法，它是Node内置的util模块里的。用inherits函数继承另一个对象里的行为看起来很简洁。

上面那段代码中的inherits语句等同于下面的JavaScript：

```js
Watch.prototype =new evevts.EvenEmitten();
```

设置好Watcher对象后，还需要加两个新方法扩展继承自EventEmitter的方法，代码如下所示。

代码清单3-13 扩展事件发射器的功能

```js
var fs = require('fs')
  , watchDir = './watch'
  , processedDir  = './done';

// 扩展EventEmitter，添加处理文件的方法
Watcher.prototype.watch = function() { 
  var watcher = this;
  // 保存对Watcher对象的引用，以便在回调函数readdir中使用
  fs.readdir(this.watchDir, function(err, files) {
    if (err) throw err;
    for(index in files) {
      // 处 理 watch目录中的所有文件
      watcher.emit('process', files[index]); 
    }
  })
}

// 扩展EventEmitter，添加开始监控的方法
Watcher.prototype.start = function() { 
  var watcher = this;
  fs.watchFile(watchDir, function() {
    watcher.watch();
  });
}
```

watch方法循环遍历目录，处理其中的所有文件。start方法启动对目录的监控。监控用到了Node的fs.watchFile函数，所以当被监控的目录中有事情发生时，watch方法会被触发，循环遍历受监控的目录，并针对其中的每一个文件发出process事件。

定义好了Watcher类，可以用下面的代码创建一个Watcher对象：

```js
var watcher = new Watcher(watchDir, processedDir);
```

有了新创建的Watcher对象，你可以用继承自事件发射器类的on方法设定文件的处理逻辑，如下所示：

```js
watcher.on('process', function process(file) {
  var watchFile      = this.watchDir + '/' + file;
  var processedFile  = this.processedDir + '/' + file.toLowerCase();

  fs.rename(watchFile, processedFile, function(err) {
    if (err) throw err;
  });
});
```

现在所有必要逻辑都已经就位了，可以用下面这行代码启动对目录的监控：

```js
watcher.start();
```

把Watcher代码放到脚本中，创建watch和done目录，你应该能用Node运行这个脚本，把文件丢到watch目录中，然后看着文件出现在done目录中，文件名被改成小写。这就是用事件发射器创建新类的例子。

通过学习如何使用回调定义一次性异步逻辑，以及如何用事件发射器重复派发异步逻辑，你离掌控Node程序的行为又近了一步。然而你可能还想在单个回调或事件发射器的监听器中添加新的异步任务。如果这些任务的执行顺序很重要，你就会面对新的难题：如何准确控制一系列异步任务里的每个任务。

在我们学习如何控制任务的执行之前（3.3节），先看一看在你写异步代码时可能会碰到哪些难题。



































