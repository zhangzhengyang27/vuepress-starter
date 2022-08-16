---
title: JavaScript简介
date: '2022-05-19 15:53:00'
sidebar: 'true'
categories:
  - 前端
  - JS
tags:
  - 高级
---



JavaScript 是一种非常松散的面向对象语言，也是 Web 开发中极受欢迎的一门语言。JavaScript，尽管它的语法和编程风格与 Java 都很相似，但它却不是 Java 的“轻量级”版本，甚至与 Java 没有任何关系。JavaScript 是一种全新的动态语言，它植根于 Web浏览器之中，致力于增强网站和 Web 应用程序的交互性。

JavaScript诞生于1995 年。当时，它的主要目的是处理一些输入验证操作。在 JavaScript 问世之前，必须把表单数据发送到服务器端才能确定用户是否没有填写某个必填域。

今天的JavaScript 已经成为一门功能全面的编程语言，能够处理复杂的计算和交互，拥有了闭包、匿名（lamda，拉姆达）函数，甚至元编程等特性。作为 Web 的一个重要组成部分。

JavaScript 从一个简单的输入验证器发展成为一门强大的编程语言。说它简单，是因为学会使用它只需片刻功夫；而说它复杂，是因为要真正掌握它则需要数年时间。要想全面理解和掌握 JavaScript，关键在于弄清楚它的本质、历史和局限性。

## javaScript简史

在web日益流行的同时，人们对客户端脚本语言的需求也越来越强烈。

当时就职于 Netscape 公司的布兰登．艾奇(Brendan Eich )，开始着手为计划于1995年 2月发布的Netscape Navigator 2 开发一种名为 LiveScript 的脚本语言——该语言将同时在浏览器和服务器中使用（它在服务器上的名字叫 Live Wire)。为了赶在发布日期前完成 LiveScript 的开发，Netscape与 Sun 公司建立了一个开发联盟。在 Netscape Navigator 2 正式发布前夕，Netscape 为了搭上媒体热炒 Java 的顺风车，临时把 LiveScript 改名为 JavaScript。

由于 JavaScript 1.0 获得了巨大成功,Netscape 随即在 Netscape Navigator 3 中又发布了 JavaScript 1.1。web 虽然羽翼未丰，但用户关注度却屡创新高。在这样的背景下，Netscape 把自己定位为市场领袖型公司。与此同时，微软决定向与 Navigator 竞争的自家产品 Internet Explorer 浏览器投人更多资源。Netscape Navigator 3发布后不久，微软就在其 Internet Explorer 3 中加入了名为 JScript 的 JavaScript 实现（命名为JScript 是为了避开与 Netscape 有关的授权问题)。以现在的眼光来看，微软1996年8月为进人 Web浏览器领域而实施的这个重大举措，是导致 Netscape 日后蒙羞的一个标志性事件。然而，这个重大举措同时也标志着 JavaScript 作为一门语言，其开发向前迈进了一大步。

微软推出其 JavaScript 实现意味着有了两个不同的 JavaScript 版本：Netscape Navigator 中的JavaScript、 Internet Explorer 中的 JScript。与C及其他编程语言不同，当时还没有标准规定 JavaScript 的语法和特性，两个不同版本并存的局面已经完全暴露了这个问题。随着业界担心的日益加剧，JavaScript的标准化问题被提上了议事日程。

1997 年，以 JavaScript 1.1 为蓝本的建议被提交给了欧洲计算机制造商协会（ECMA, European
Computer Manufacturers Association )。该协会指定 39 号技术委员会(TC39，Technical Committee #39)
负责“标准化一种通用、跨平台、供应商中立的脚本语言的语法和语义”。TC39 由来自 Netscape、Sun、微软、Borland 及其他关注脚本语言发展的公司的程序员组成，他们经过数月的努力完成了 ECMA-262——定义一种名为 ECMAScript（发音为“ek-ma-script”）的新脚本语言的标准。

第二年，ISO/EC ( International Organization for Standardization and International Electrotechnical
Commission，国标标准化组织和国际电工委员会）也采用了 ECMAScript 作为标准（即 ISO/EC-16262)。自此以后，浏览器开发商就开始致力于将 ECMAScript 作为各自 JavaScript 实现的基础，也在不同程度上取得了成功。

## javaScript实现

虽然 JavaScript 和 ECMAScript 通常都被人们用来表达相同的含义，但 JavaScript 的含义却比 ECMA-262 中规定的要多得多。没错，一个完整的 JavaScript 实现应该由下列三个不同的部分组成
核心(ECMAScript）、文档对象模型（DOM）浏览器对象模型(BOM）

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220518120059506.png" alt="image-20220518120059506" style="zoom: 50%;" />

### ECMAScript

由 ECMA-262定义的 ECMAScript 与 Web 浏览器没有依赖关系。实际上，这门语言本身并不包含输入和输出定义。

ECMA-262 定义的只是这门语言的基础，而在此基础之上可以构建更完善的脚本语言。我们常见的 Web 浏览器只是 ECMAScript 实现可能的宿主环境之一。

宿主环境不仅提供基本的ECMAScript 实现，同时也会提供该语言的扩展，以便语言与环境之间对接交互。而这些扩展——如DOM，则利用 ECMAScript 的核心类型和语法提供更多更具体的功能，以便实现针对环境的操作。

其他宿主环境包括 Node（一种服务端 JavaScript 平台）和 Adobe Flash。

既然 ECMA-262 标准没有参照 Web 浏览器，那它都规定了些什么内容呢？大致说来，它规定了这门语言的下列组成部分：

- 语法
- 类型
- 语句
- 关键字
- 保留字
- 操作符
- 对象



### 文档对象模型(DOM）

文档对象模型(DOM， Document Object Model） 是针对 XML但经过扩展用于 HTML 的应用程序编程接口（API，Application Programming Interface)。DOM把整个页面映射为一个多层节点结构。HTML或XML 页面中的每个组成部分都是某种类型的节点，这些节点又包含着不同类型的数据。看下面这个HTML页面：

```html
<html> 
 <head> 
 <title>Sample Page</title> 
 </head> 
 <body> 
 <p>Hello World!</p> 
 </body> 
</html>
```

在 DOM中，这个页面可以通过图所示的分层节点图表示。
通过 DOM 创建的这个表示文档的树形图，开发人员获得了控制页面内容和结构的主动权。借助DOM提供的 API，开发人员可以轻松自如地删除、添加、替换或修改任何节点。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220518122016263.png" alt="image-20220518122016263" style="zoom:50%;" />



#### DOM 级别

DOMI级(DOM Level 1）于1998年10月成为 W3C 的推荐标准。DOM1 级由两个模块组成：DOM核心（DOM Core ）和 DOM HTML。

其中，DOM 核心规定的是如何映射基于 XML的文档结构，以便简化对文档中任意部分的访问和操作。DOM HTML 模块则在 DOM 核心的基础上加以扩展，添加了针对 HTML 的对象和方法。

> 请读者注意，DOM并不只是针对 JavaScript 的，很多别的语言也都实现了 DOM。
> 不过，在 Web 浏览器中，基于 ECMAScript 实现的 DOM 的确已经成为 JavaScript 这门语言的一个重要组成部分。

如果说 DOM1 级的目标主要是映射文档的结构，那么 DOM2级的目标就要宽泛多了。

DOM2级在原来 DOM 的基础上又扩充了(DHTML一直都支持的）鼠标和用户界面事件、范围、遍历（迭代 DOM文档的方法）等细分模块，而且通过对象接口增加了对 CSS ( Cascading Style Sheets，层叠样式表）的支持。DOM1 级中的DOM核心模块也经过扩展开始支持 XML命名空间。

DOM2 级引人了下列新模块，也给出了众多新类型和新接口的定义。

- DOM 视图（DOM Views)：定义了跟踪不同文档（例如，应用 CSS之前和之后的文档）视图的接口；
- DOM事件(DOM Events)：定义了事件和事件处理的接口；
- DOM样式（DOM Style)：定义了基于 CSS为元素应用样式的接口；
- DOM遍历和范围(DOM Traversal and Range)：定义了遍历和操作文档树的接口。

DOM3 级则进一步扩展了 DOM，引入了以统一方式加载和保存文档的方法——在 DOM 加载和保存(DOM Load and Save) 模块中定义；新增了验证文档的方法——在 DOM验证（DOM Validation） 模块中定义。DOM3 级也对 DOM 核心进行了扩展，开始支持 XML 1.0 规范，涉及 XML Infoset、 XPath和 XML Base。

> 在阅读 DOM 标准的时候，读者可能会看到 DOMO 级（DOM Level 0）的字眼。实际上，DOMO级标准是不存在的；所谓 DOMO 级只是 DOM历史坐标中的一个参照点而已。具体说来，DOMO 级指的是 Internet Explorer 4.0 和 Netscape Navigator 4.0 最初支持的 DHTML。

#### 其他 DOM 标准

除了 DOM 核心和 DOM HTML 接口之外，另外几种语言还发布了只针对自己的DOM标准。下面列出的语言都是基于 XML的，每种语言的 DOM标准都添加了与特定语言相关的新方法和新接口：

- SVG ( Scalable Vector Graphic，可伸缩矢量图）1.0；
- MathML ( Mathematical Markup Language，数学标记语言） 1.0；
- SMIL ( Synchronized Multimedia Integration Language，同步多媒体集成语言)。

还有一些语言也开发了自己的 DOM实现，例如 Mozilla 的 XUL( XML User Interface Language, XML用户界面语言)。但是，只有上面列出的几种语言是 W3C的推荐标准。



### 浏览器对象模型(BOM）

浏览器对象模型（BOM, Browser Object Model)。

从根本上讲，BOM 只处理浏览器窗口和框架；但人们习惯上也把所有针对浏览器的 JavaScript扩展算作 BOM 的一部分。下面就是一些这样的扩展：

- 弹出新浏览器窗口的功能；
- 移动、缩放和关闭浏览器窗口的功能；
- 提供浏览器详细信息的 navigator 对象；
- 提供浏览器所加载页面的详细信息的 location 对象；
- 提供用户显示器分辨率详细信息的 screen 对象；
- 对 cookies 的支持；
- 像 XMLHttpRequest 和IE的 Activexobiect 这样的自定义对象。



## JavaScript 版本

作为 Netscape“继承人”的 Mozilla 公司，是目前唯一还在沿用最初的 JavaScript版本编号序列的浏览器开发商。在 Netscape 将源代码提交给开源的 Mozilla 项目的时候，JavaScript 在浏览器中的最后一个版本号是1.3。（如前所述,1.4版是只针对服务器的实现。)后来，随着 Mozilla 基金会继续开发 JavaScript,添加新的特性、关键字和语法，JavaScript 的版本号继续递增。下表列出了 Netscape/Mozilla 浏览器中JavaScript 版本号的递增过程：

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220518123540109.png" alt="image-20220518123540109" style="zoom:50%;" />

实际上，上表中的编号方案源自 Firefox 4 将内置 JavaScript 2.0这一共识。因此，2.0版之前每个递增的版本号，表示的是相应实现与 JavaScript 2.0 开发目标还有多大的距离。虽然原计划是这样，但JavaScript 的这种发展速度让这个计划不再可行。目前，JavaScript 2.0 还没有目标实现。

> 请注意，只有 Netscape/Mozilla 浏览器才遵循这种编号模式。例如，IE的 JScript就采用了另一种版本命名方案。换句话说，JScript 的版本号与上表中 JavaScript 的版本号之间不存在任何对应关系。而且，大多数浏览器在提及对 JavaScript 的支持情况时，一般都以 ECMAScript 兼容性和对 DOM的支持情况为准。



## 小结

JavaScript 是一种专为与网页交互而设计的脚本语言，由下列三个不同的部分组成：

- ECMAScript, 由 ECMA-262定义，提供核心语言功能；
- 文档对象模型（D0M)，提供访问和操作网页内容的方法和接口；
- 浏览器对象模型（BOM)，提供与浏览器交互的方法和接口。
