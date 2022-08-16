---
title: Node.js 中途岛
date: '2022-05-12 17:53:00'
sidebar: 'true'
categories:
  - 前端
  - JS
  - node
tags:
  - node
  - 拉勾
---



当前时代下，应用程序的本质就两点：

1. 将数据友好的呈现给用户
2. 将用户的输入存储到数据之中

在Web 这一应用环境中核心角色：

- 数据库
- 服务器
- 浏览器

以前项目中绝大多数的事情都是由后端完成的，可以毫不夸张的说：后端驱动着整个项目。

在这样一种状态下，前端就是给后端「打杂」，没有任何发挥的空间，完全是一个服务于后端的角色。

为什么要变？

答案很简单：

- 需求在变、用户体验的要求在变，如果一直这样发展下去，后端将不堪重负。
- 背后的原因更多的是合理性的问题，决定用户看到什么、以何种形式看到应该是前端的工作。



## 基于 AJAX 的前后端分离

### 架构方案

![基于 AJAX 的前后端分离方案](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/with-ajax.png)

### 面临的问题

能力问题（鉴权、缓存、路由定制）

环境问题

## 基于中间层的前后端分离

### 架构方案

![基于 Node.js 中间层的前后端分离方案](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/with-midway.png)

### 优势

1. 略微增加成本的情况下给前端更大的发挥空间
2. 完全可控的路由
3. 完全可控的服务端逻辑
4. 接口重组、Bigpipe
5. 服务端渲染、良好的 SEO 支持
6. 后端更为专注，完全从数据出发
7. 不用为特定业务单独提供接口

### 案例：商品列表页的实现

1. 用户浏览器对应用服务器（Node.js)发起页面请求
2. 应用服务器接收并校验请求参数（分类 ID、分页页码、排序条件、属性筛选）
3. 应用服务器调用服务层（JAVA) 提供的数据接口获取对应分类和商品信息数据
4. 应用服务器将所获取的数据通过页面模板渲染为 HTML（服务端渲染）
5. 应用服务器将渲染的结果返回给用户浏览器
6. 浏览器解析并渲染页面
7. 用户进行页面行为操作，比如下一页、按照价格排序等
8. 用户浏览器再次对应用服务器发起 AJAX 请求 (JavaScript 实现）
9. 应用服务器接收 AJAX 请求，根据逻辑调用服务接口，将最终组织完成的数据通过 JSON 方式返回
10. 浏览器接收 JSON数据，通过客户端模板渲染到页面中（客户端渲染）

>其中 8-10 为客户端 AJAX 调用应用服务器，目的为了增强用户体验，减少服务器压力



## 为什么选Node.js

1. 前端熟悉的语言，学习成本低
2. 都是JS，可以前后端复用
3. 体质适合：事件驱动、非阻塞V/O
4. 适合lO密集型业务
5. 执行速度也不差



## 淘宝前后端分离实践



### 互联网时代

#### 前端代码越来越复杂

- 无法统一协作模式，代码充满了约定
- JS跟CSS依赖于后端产生的HTML
- 有的数据来自AJAX,有的数据写在DOM上
- 有的页面逻辑写在前端，有的在Model层，更多的在view层

#### 前后端依旧高度耦合

- 前端依赖服务端开发环境
- 在服务端View层高度耦合
- 沟通成本高
- 职责不清晰

### 第一次前后端分离大战

CLIENT-SIDE MV*时代

接口分离，后端提供数据，前端自己搞

![img](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/client-side-mvc.jpg)

![前后端职责](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/%E5%89%8D%E5%90%8E%E7%AB%AF%E8%81%8C%E8%B4%A3.png)

#### 问题：

各层职责重叠，并且各玩各的

- Client-side Model 是 Server-side Model 的加工
- Client-side View 跟 Server-side是 不同层次的东西
- Client-side的Controller 跟 Sever-side的Controller 各搞各的
- Client-side的Route 但是 Server-side 可能没有

#### 性能问题

- 渲染，取值都在客户端进行，有性能的问题
- 需要等待资源到齐才能进行，会有短暂白屏与闪动
- 在移动设备低速网路的体验奇差无比

#### 重用问题

- 模版无法重用，造成维护上的麻烦与不一致
- 逻辑无法重用，前端的校验后端仍须在做一次
- 路由无法重用，前端的路由在后端未必存在

#### 跨终端问题

- 业务太靠前，导致不同端重复实现
- 逻辑太靠前，造成维护上的不易

#### SEO问题

渲染都在客户端，模版无法重用，SEO实现麻烦

### 第二次前后端分离大战

在服务器与浏览器的中间，架了一个中间层(nodeJs)

![img](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/work-mode-2.png)



![nodejs前后端](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/zce/nodejs%E5%89%8D%E5%90%8E%E7%AB%AF.png)
