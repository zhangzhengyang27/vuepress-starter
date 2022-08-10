Node.js是什么? 你很可能已经有所耳闻，甚至已经用上了，你也有可能对它很好奇。现在Node还很年轻（它的首次亮相是在2009年），却非常流行。它在[Github受关注项目排行榜上位列第二](https://github.com/joyent/node)，在[Google小组](http://groups.google.com/group/nodejs)和[IRC频道](http://webchat.freenode.net/?channels=node.js)中都有很多追随者，并且社区同仁们在[NPM包管理网站](http://npmjs.org)上发布的模块多达15 000 多个。所有这些都足以表明这个平台的强大吸引力。

Node创始人Ryan Dahl 给Node下的定义是：“一个搭建在Chrome JavaScript运行时上的平台，用于构建高速、可伸缩的网络程序。Node.js采用的事件驱动、非阻塞I/O模型，使它既轻量又高效，并成为构建运行在分布式设备上的数据密集型实时程序的完美选择。”

我们在本章中会看到下面这些概念：

- 为什么JavaScript对服务端开发很重要；
- 浏览器如何用JavaScript处理I/O； 
- Node在服务端如何处理I/O； 
- DIRT程序是什么意思，为什么适于用Node开发；
- 几个基础的Node程序示例。

## 1.1构建于 JavaScript 之上

无论好坏，JavaScript都是世界上最流行的编程语言。只要你做过Web程序，就肯定遇到过JavaScript。JavaScript几乎遍布于Web上的每个角落，所以它已经实现了Java在20世纪90年代“一次编写，处处运行”的梦想。

在2005年Ajax革命前后，JavaScript从一门“写着玩儿”的语言变成了一种被人们用来编写真正的、重要的程序的语言。这些程序中比较引人注目的先行者是Google地图和Gmail，但现在类似的Web应用有一大堆，从Twitter到Facebook，再到GitHub。

自从2008年年末Google Chrome发布以来，得益于浏览器厂商（Mozilla、微软、苹果、Opera和谷歌）的白热化竞争，JavaScript的性能以不可思议的速度得到了大幅提升。现代化JavaScript虚拟机的性能正改变着可以构建在Web上的应用类型。一个很有说服力的、坦率地说是令人震惊的例子是jslinux，一个运行在JavaScript中的PC模拟器，它能加载Linux内核，可以利用终端会话与其交互，还能编译C程序，而这一切都是在浏览器中完成的。

在服务器端编程，Node使用的是为Google Chrome提供动力的V8虚拟机。V8让Node在性能上得到了巨大的提升，因为它去掉了中间环节，执行的不是字节码，用的也不是解释器，而是直接编译成了本地机器码。Node在服务器端使用JavaScript还有其他好处。

- 开发人员用一种语言就能编写整个Web应用，这可以减少开发客户端和服务端时所需的语言切换。这样代码可以在客户端和服务端中共享，比如在表单校验或游戏逻辑中使用同样一段代码。
- JSON是目前非常流行的数据交换格式，并且还是JavaScript原生的。
- 有些NoSQL数据库中用的就是JavaScript语言（比如CouchDB和MongoDB），所以跟它们简直是天作之合（比如MongoDB的管理和查询语言都是JavaScript；CouchDB的map/reduce也是JavaScript）。
- JavaScript是一门编译目标语言，现在有很多可以编译成JavaScript的语言
- Node用的虚拟机（V8）会紧跟ECMAScript标准。换句话说，在Node中如果想用新的JavaScript语言特性，不用等到所有浏览器都支持。

JavaScript竟然成了一种引人瞩目的编写服务端应用的语言，之前谁能料到呢？基于前面提到的覆盖范围、性能和其他特性，Node已经赚足了眼球。但JavaScript只是整幅拼图中的一块；

Node使用JavaScript的方式则更为有趣。为了理解Node环境，我们先看看你最熟悉的JavaScript环境：浏览器

## 1.2 异步和事件触发：浏览器

Node为服务端JavaScript提供了一个事件驱动的、异步的平台。它把JavaScript带到服务端中的方式跟浏览器把JavaScript带到客户端的方式几乎一模一样。

了解浏览器的工作原理对我们了解Node的工作原理会有很大帮助。它们都是事件驱动（用事件轮询）和非阻塞的I/O处理（用异步I/O）。下面举个例子说明这是什么意思。

> 事件轮询和异步I/O 要了解更多有关事件轮询和异步I/O的知识，请参见相关的维基百科文章：http://en.wikipedia.org/wiki/Event_loop和http://en.wikipedia.org/wiki/Asynchronous_I/O。

我们来看一小段jQuery用XMLHttpRequest（XHR）做Ajax请求的代码：

![image-20220521201035523](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521201035523.png)

这个程序会发送一个到resource.json的HTTP请求。当响应返回时会调用带着参数data的匿名函数（在这个上下文中的“回调函数”），data就是从那个请求中得到的数据。

注意，代码没有写成下面这样：

```js
var data=$.post('/resource.json');  // 在I/O完成之前会被阻塞
console.log(data)
```

在这个例子中，假定对resource.json的响应在准备好后会存储在变量data中，并且在此之前函数console.log不会执行。I/O操作（Ajax请求）会“阻塞”脚本继续执行，直到数据准备好。因为浏览器是单线程的，如果这个请求用了400ms才返回，那么页面上的其他任何事件都要等到那之后才能执行。可以想象一下，如果一幅动画被停住了，或者用户试着跟页面交互时动不了，那种用户体验有多糟糕。

谢天谢地，实际情况不是这样的。当浏览器中有I/O操作时，该操作会在事件轮询的外面执行（脚本执行的主顺序之外），然后当这个I/O操作完成时，它会发出一个“事件”，会有一个函数（通常称作“回调”）处理它，如图1-1所示。这个I/O是异步的，并且不会“阻塞”脚本执行，事件轮询仍然可以响应页面上执行的其他交互或请求。这样，浏览器可以对客户做出响应，并且可以处理页面上的很多交互动作。请牢记上面这些内容，现在我们切换到服务端。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521201404882.png" alt="image-20220521201404882" style="zoom:50%;" />

>注意，在浏览器中有几种特殊情况会“阻塞”程序执行，并且通常我们会建议你不要使用它们：alert、prompt、confirm和同步XHR。

## 1.3 异步和事件触发：服务器

可能大多数人都了解传统的服务端编程的I/O模型，就像1.2节那个“阻塞”的jQuery例子一样。下面是一个PHP的例子：

![image-20220521204026788](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521204026788.png)

这段代码做了些I/O操作，并且在所有数据回来之前，这个进程会被阻塞。对于很多程序而言，这个模型没什么问题，并且很容易理解。但有一点可能会被忽略：这个进程也有状态，或者说内存空间，并且在I/O完成之前基本上什么也不会做。根据I/O操作的延迟情况，那可能会有10ms到几分钟的时间。延迟也可能是由下列意外情况引发的：

- 硬盘正在执行维护操作，读/写都暂停了；
- 因为负载增加，数据库查询变得更慢了；
- 由于某种原因，今天从sitexyz.com拉取资源非常迟缓。

如果程序在I/O上阻塞了，当有更多请求过来时，服务器会怎么处理呢？在这种情景中通常会用多线程的方式。一种常见的实现是给每个连接分配一个线程，并为那些连接设置一个线程池。

你可以把线程想象成一个计算工作区，处理器在这个工作区中完成指定的任务。线程通常都是处于进程之内的，并且会维护它自己的工作内存。每个线程会处理一到多个服务器连接。尽管这听起来是个很自然的委派服务器劳动力的方式（最起码对那些曾经长期采用这种方式的开发人员来说是这样的），但程序内的线程管理会非常复杂。此外，当需要大量的线程处理很多并发的服务器连接时，线程会消耗额外的操作系统资源。

线程需要CPU和额外的RAM来做上下文切换。为了说明这一点，我们来看NGINX和Apache的一个基准比较（见图1-2，源自http://mng.bz/eaZT）。或许你还不了解NGINX（http://nginx.com/），它跟Apache一样，是个HTTP服务器，但它用的不是带有阻塞I/O的多线程方式，而是带有异步I/O的事件轮询（就像浏览器和Node一样）。因为这些设计上的选择，NGINX通常能处理更多的请求和客户端连接，它因此变成了响应能力更强的解决方案

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521204514420.png" alt="image-20220521204514420" style="zoom:50%;" />

在Node中，I/O几乎总是在主事件轮询之外进行，使得服务器可以一直处于高效并且随时能够做出响应的状态，就像NGINX一样。这样进程就更加不会受I/O限制，因为I/O延迟不会拖垮服务器，或者像在阻塞方式下那样占用很多资源。因此一些在服务器上曾经是重量级的操作，在Node服务器上仍然可以是轻量级的。

这个混杂了事件驱动和异步的模型，加上几乎随处可用的JavaScript语言，帮我们打开了一个精彩纷呈的数据密集型实时程序的世界。

## 1.4 DIRT 程序

实际上，Node所针对的应用程序有一个专门的简称：DIRT。它表示数据密集型实时（data-intensive real-time）程序。因为Node自身在I/O上非常轻量，它善于将数据从一个管道混排或代理到另一个管道上，这能在处理大量请求时持有很多开放的连接，并且只占用一小部分内存。它的设计目标是保证响应能力，跟浏览器一样。

对Web来说，实时程序是个新生事物。现在有很多Web程序提供的信息几乎都是即时的，比如通过白板在线协作、对临近公交车的实时精确定位，以及多人在线游戏。不管是用实时组件增强已有程序，还是打造全新的程序，Web都在朝着响应性和协作型环境逐渐进发。而这种新型的Web应用程序需要一个能够实时响应大量并发用户请求的平台来支撑它们。这正是Node所擅长的领域，并且不仅限于Web程序，其他I/O负载比较重的程序也可以用到它。

Browserling （browserling.com，见图1-3）就是一个用Node开发的DIRT程序，它是一个很好的范例。在这个网站上，我们可以在浏览器中使用各种浏览器。这对Web前端开发工程师来说特别有用，因为他们再也不用仅仅为了测试就去装一堆的浏览器和操作系统了。Browserling用了一个叫做StackVM的由Node驱动的项目，而StackVM管理了用QEMU（快速模拟器）模拟器创建的虚拟机，QEMU会模拟运行浏览器所需的CPU和外设。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521204943087.png" alt="image-20220521204943087" style="zoom:50%;" />

Browserling在VM中运行测试浏览器，将键盘和鼠标的输入数据从用户的浏览器中转到模拟出来的浏览器中，然后将模拟浏览器中要重新渲染的区域转出来，在用户浏览器的画布上重新画出来。图1-4向我们呈现了这一过程。

Browserling还有一个使用Node的互补项目Testling（testling.com），它可以通过命令行在多个浏览器上并行运行测试包。

Browserling和Testling都是很好的DIRT程序范例，并且构建像它们这样可伸缩的网络程序所用的基础设施在你坐下来写第一个Node程序时就在发挥作用了。我们来看看Node的API是如何提供这些开箱即用的工具的。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521205052450.png" alt="image-20220521205052450" style="zoom:50%;" />

## 1.5 默认 DIRT 

Node从构建开始就有一个事件驱动和异步的模型。JavaScript从来没有过标准的I/O库，那是服务端语言的常见配置。对于JavaScript而言，这总是由“宿主”环境决定的。JavaScript最常见的宿主环境，也是大多数开发人员所用的，就是浏览器，它是事件驱动和异步的。

Node重新实现了宿主中那些常用的对象，尽量让浏览器和服务器保持一致，比如：

- 计时器API（比如setTimeout）；
- 控制台API（比如console.log）。

Node还有一组用来处理多种网络和文件I/O的核心模块。其中包括用于HTTP、TLS、HTTPS、文件系统（POSIX）、数据报（UDP）和NET（TCP）的模块。这些核心模块刻意做得很小、底层并且简单，只包含要给基于I/O的程序用的组成部分。第三方模块基于这些核心模块，针对常见的问题进行了更高层的抽象。

> 平台与框架
>
> Node是JavaScript程序的平台，不要把它跟框架相混淆。很多人都误把Node当做JavaScript上的Rails或Django，实际上它更底层。

但如果你对Web程序的框架感兴趣，本书后面会介绍在Node中非常流行的Express框架。

聊了这么多了，你可能很想知道Node程序的代码长什么样子。我们来看几个简单的例子：

- 一个简单的异步程序；
- 一个Hello World Web服务器；
- 一个数据流的例子。

### 1.5.1 简单的异步程序

你应该在1.2节见过下面这个使用jQuery的Ajax例子：

我们要在Node里做一个跟这个差不多的例子，不过这次是用文件系统（fs）模块从硬盘中加载resource.json。注意看下面这个程序跟前面那个jQuery的例子有多像：

```js
var fs=require(' fs' );
fs.readFile('./resource.json', function (er, data) {
		console.log (data)；
}
```

这段程序要从硬盘里读取resource.json文件。当所有数据都读出来后，会调用那个匿名函数（即“回调函数”），传给它的参数是er（如果出现错误）和data（文件中的数据）。

这个过程是在后台完成的，这样在该过程中，我们可以继续处理其他任何操作，直到数据准备好。我们之前说过的那些事件触发和异步的好处都是自动实现的。差别在于，这个不是在浏览器中用jQuery发起一个Ajax请求，而是在Node中访问文件系统抓取resource.json。后面这个过程如图1-5所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521205618647.png" alt="image-20220521205618647" style="zoom:50%;" />



### 1.5.2 Hello World HTTP服务器

Node常被用来构建服务器。有了Node，创建各种服务器变得非常简单。如果你过去习惯于把程序部署到服务器中运行（比如把PHP程序放到Apache HTTP服务器上），可能会觉得这种方式很怪异。在Node中，服务器和程序是一样的。

```js
var http = require('http' );
http.createServer (function (reg,res){
  	res.writeHead(200,{'Content-Type"：'text/plain'])；
		res.end('Hello world\n’)
}).listen (3000);
console.1og('Server running at http: //localhost :3000/'）
```

下面是个简单的HTTP服务器实现，它会用“Hello World”响应所有请求：只要有请求过来，它就会激发回调函数function (req, res)，把“Hello World”写入到响应中返回去。这个事件模型跟浏览器中对onclick事件的监听类似。在浏览器中，点击事件随时都可能发生，所以要设置一个函数来执行对事件的处理逻辑，而Node在这里提供了一个可以随时响应请求的函数。

下面是同一服务器的另一种写法，这样看起来request事件更明显：

![image-20220521210025836](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521210025836.png)

### 1.5.3 流数据

Node在数据流和数据流动上也很强大。你可以把数据流看成特殊的数组，只不过数组中的数据分散在空间上，而数据流中的数据是分散在时间上的。通过将数据一块一块地传送，开发人员可以每收到一块数据就开始处理，而不用等所有数据都到全了再做处理。下面我们用数据流的方式来处理resource.json：

![image-20220521210227162](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521210227162.png)

只要有新的数据块准备好，就会激发data事件，当所有数据块都加载完之后，会激发一个end事件。由于数据类型不同，数据块的大小可能会发生变化。有了对读取流的底层访问，程序就可以边读取边处理，这要比等着所有数据都缓存到内存中再处理效率高得多。

Node中也有可写数据流，可以往里写数据块。当HTTP服务器上有请求过来时，对其进行响应的res对象就是可写数据流的一种。

可读和可写数据流可以连接起来形成管道，就像shell脚本中用的 |(管道)操作符一样。这是一种高效的数据处理方式，只要有数据准备好就可以处理，不用等着读取完整个资源再把它写出去。

我们借用一下前面那个HTTP服务器，看看如何把一张图片流到客户端：

![image-20220521210410691](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220521210410691.png)

在这行代码中，数据从文件中读进来（fs.createReadStream），然后数据随着进来就被送到（.pipe）客户端（res）。在数据流动时，事件轮询还能处理其他事件。

Node在多个平台上均默认提供了DIRT方式，包括各种Windows和类UNIX系统。底层的I/O库（libuv）特意屏蔽了宿主操作系统的差异性，提供了统一的使用方式，如果需要的话，程序可以在多个设备上轻松移植和运行。

## 1.6 小结

Node跟所有技术一样，并不是万能灵药。它只能解决特定的问题，并为我们开创新的可能性。Node比较有意思的一点是，它让从事系统各方面工作的人走到了一起。很多进入Node世界的是客户端JavaScript程序员，此外还有服务端程序员以及系统层面的程序员。不管你是做什么的，我们都希望你能了解Node到底适合帮你完成什么样的任务。

回顾一下，Node是：

- 构建在JavaScript之上的；
- 事件触发和异步的；
- 专为数据密集型实时程序设计的。

我们在第2章会构建一个简单的DIRT Web程序，好让你了解Node程序是如何工作的。