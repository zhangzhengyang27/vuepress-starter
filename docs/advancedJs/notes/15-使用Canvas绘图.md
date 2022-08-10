---
title: 使用canvas绘图
date: '2022-05-26 22:20:00'
sidebar: 'auto'
categories:
 - 前端
 - JS
tags:
 - 高级
publish: false
---





本章内容

- 理解`<canvas>`元素
- 绘制简单的 2D 图形
- 使用 WebGL 绘制 3D 图形

不用说，HTML5 添加的最受欢迎的功能就是`<canvas>`元素。这个元素负责在页面中设定一个区域，然后就可以通过 JavaScript 动态地在这个区域中绘制图形。`<canvas>`元素最早是由苹果公司推出的，当时主要用在其 Dashboard 微件中。很快，HTML5 加入了这个元素，主流浏览器也迅速开始支持它。IE9+、Firefox 1.5+、Safari 2+、Opera 9+、Chrome、iOS 版 Safari 以及 Android 版 WebKit都在某种程度上支持`<canvas>`。

与浏览器环境中的其他组件类似，`<canvas>`由几组 API 构成，但并非所有浏览器都支持所有这些API。除了具备基本绘图能力的 2D 上下文，`<canvas>`还建议了一个名为 WebGL 的 3D 上下文。目前，支持该元素的浏览器都支持 2D 上下文及文本 API，但对 WebGL 的支持还不够好。由于 WebGL 还是实验性的，因此要得到所有浏览器支持还需要很长一段时间。Firefox 4+和 Chrome 支持 WebGL 规范的早期版本，但一些老版本的操作系统，比如 Windows XP，由于缺少必要的绘图驱动程序，即便安装了这两款浏览器也无济于事。

## 15.1基本用法

要使用`<canvas>`元素，必须先设置其 width 和 height 属性，指定可以绘图的区域大小。出现在开始和结束标签中的内容是后备信息，如果浏览器不支持`<canvas>`元素，就会显示这些信息。下面就是`<canvas>`元素的例子。

```js
<canvas id="drawing" width=" 200" height="200">A drawing of something.</canvas> 
```

与其他元素一样，`<canvas>`元素对应的 DOM 元素对象也有 width 和 height 属性，可以随意修改。而且，也能通过 CSS 为该元素添加样式，如果不添加任何样式或者不绘制任何图形，在页面中是看不到该元素的。

要在这块画布（canvas）上绘图，需要取得绘图上下文。而取得绘图上下文对象的引用，需要调用getContext()方法并传入上下文的名字。传入"2d"，就可以取得 2D 上下文对象。

```js
var drawing = document.getElementById("drawing"); 

//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
	var context = drawing.getContext("2d"); 
	//更多代码
} 
```

在使用`<canvas>`元素之前，首先要检测 getContext()方法是否存在，这一步非常重要。有些浏览器会为 HTML 规范之外的元素创建默认的 HTML 元素对象①。在这种情况下，即使 drawing 变量中保存着一个有效的元素引用，也检测不到 getContext()方法。

使用 toDataURL()方法，可以导出在`<canvas>`元素上绘制的图像。这个方法接受一个参数，即图像的 MIME 类型格式，而且适合用于创建图像的任何上下文。比如，要取得画布中的一幅 PNG 格式的图像，可以使用以下代码。

```html
<!DOCTYPE html>
<html>
<head>
    <title>Canvas Fill Rect Example</title>
</head>
<body>
<canvas id="drawing" width="200" height="200">Your browser doesn't support the canvas tag.</canvas>
<input type="button" value="Export" id="export-btn">
<script type="text/javascript">
    window.onload = function () {
        var drawing = document.getElementById("drawing"),
            btn = document.getElementById("export-btn");

        //make sure <canvas> is completely supported
        if (drawing.getContext) {

            var context = drawing.getContext("2d");

            //draw a red rectangle
            context.fillStyle = "#ff0000";
            context.fillRect(10, 10, 50, 50);

            //draw a blue rectangle that's semi-transparent
            context.fillStyle = "rgba(0,0,255,0.5)";
            context.fillRect(30, 30, 50, 50);
        }

        btn.onclick = function () {
            //get data URI of the image
            var imgURI = drawing.toDataURL();

            //display the image
            var image = document.createElement("img");
            image.src = imgURI;
            document.body.appendChild(image);

        };
    };

</script>
<p>Click <strong>Export</strong> to export the image to an <code>img</code> element. Then, you can right-click and save
    the image locally.</p>
</body>
</html>
```

默认情况下，浏览器会将图像编码为 PNG 格式（除非另行指定）。Firefox 和 Opera 也支持基于"image/jpeg"参数的 JPEG 编码格式。由于这个方法是后来才追加的，所以支持`<canvas>`的浏览器也是在较新的版本中才加入了对它的支持，比如 IE9、Firefox 3.5 和 Opera 10。

如果绘制到画布上的图像源自不同的域，toDataURL()方法会抛出错误。本章后面还将介绍更多相关内容。

## 15.2D上下文

使用 2D 绘图上下文提供的方法，可以绘制简单的 2D 图形，比如矩形、弧线和路径。2D 上下文的坐标开始于`<canvas>`元素的左上角，原点坐标是(0,0)。所有坐标值都基于这个原点计算，*x* 值越大表示越靠右，*y* 值越大表示越靠下。默认情况下，width 和 height 表示水平和垂直两个方向上可用的像素数目。

### 15.2.1填充和描边

2D 上下文的两种基本绘图操作是填充和描边。填充，就是用指定的样式（颜色、渐变或图像）填充图形；描边，就是只在图形的边缘画线。大多数 2D 上下文操作都会细分为填充和描边两个操作，而操作的结果取决于两个属性：fillStyle 和 strokeStyle。

这两个属性的值可以是字符串、渐变对象或模式对象，而且它们的默认值都是"#000000"。如果为它们指定表示颜色的字符串值，可以使用 CSS 中指定颜色值的任何格式，包括颜色名、十六进制码、rgb、rgba、hsl 或 hsla。举个例子：

```js
var drawing = document.getElementById("drawing"); 

//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
 	var context = drawing.getContext("2d"); 
 	context.strokeStyle = "red"; 
 	context.fillStyle = "#0000ff"; 
} 
```

以上代码将 strokeStyle 设置为 red（CSS 中的颜色名），将 fillStyle 设置为#0000ff（蓝色）。

然后，所有涉及描边和填充的操作都将使用这两个样式，直至重新设置这两个值。如前所述，这两个属性的值也可以是渐变对象或模式对象。本章后面会讨论这两种对象。

### 15.2.2绘制矩形

矩形是唯一一种可以直接在 2D 上下文中绘制的形状。与矩形有关的方法包括 fillRect()、strokeRect()和 clearRect()。这三个方法都能接收 4 个参数：矩形的 *x* 坐标、矩形的 *y* 坐标、矩形宽度和矩形高度。这些参数的单位都是像素。

首先，fillRect()方法在画布上绘制的矩形会填充指定的颜色。填充的颜色通过 fillStyle 属性指定，比如：

```js
var drawing = document.getElementById("drawing"); 

//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
 var context = drawing.getContext("2d"); 

 /* 
 *根据 Mozilla 的文档
 * http://developer.mozilla.org/en/docs/Canvas_tutorial:Basic_usage 
 */ 

 //绘制红色矩形
 context.fillStyle = "#ff0000"; 

 context.fillRect(10, 10, 50, 50); 

 //绘制半透明的蓝色矩形
 context.fillStyle = "rgba(0,0,255,0.5)"; 
 context.fillRect(30, 30, 50, 50); 
} 
```

以上代码首先将 fillStyle 设置为红色，然后从(10,10)处开始绘制矩形，矩形的宽和高均为 50 像素。然后，通过 rgba()格式再将 fillStyle 设置为半透明的蓝色，在第一个矩形上面绘制第二个矩形。结果就是可以透过蓝色的矩形看到红色的矩形（见图 15-1）。

![image-20220527183110562](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527183110562.png)

strokeRect()方法在画布上绘制的矩形会使用指定的颜色描边。描边颜色通过 strokeStyle 属性指定。比如：

```js
var drawing = document.getElementById("drawing"); 

//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
 var context = drawing.getContext("2d"); 

 /* 
 * 根据 Mozilla 的文档
 * http://developer.mozilla.org/en/docs/Canvas_tutorial:Basic_usage 
 */ 

 //绘制红色描边矩形
 context.strokeStyle = "#ff0000"; 
 context.strokeRect(10, 10, 50, 50); 

 //绘制半透明的蓝色描边矩形
 context.strokeStyle = "rgba(0,0,255,0.5)"; 
 context.strokeRect(30, 30, 50, 50); 

} 
```

以上代码绘制了两个重叠的矩形。不过，这两个矩形都只有框线，内部并没有填充颜色

> 描边线条的宽度由 lineWidth 属性控制，该属性的值可以是任意整数。另外，通过 lineCap 属性可以控制线条末端的形状是平头、圆头还是方头（"butt"、"round"或"square"），通过 lineJoin 属性可以控制线条相交的方式是圆交、斜交还是斜接（"round"、"bevel"或"miter"）。

最后，clearRect()方法用于清除画布上的矩形区域。本质上，这个方法可以把绘制上下文中的某一矩形区域变透明。通过绘制形状然后再清除指定区域，就可以生成有意思的效果，例如把某个形状切掉一块。下面看一个例子。

```html
<!DOCTYPE html>
<html>
<head>
    <title>Canvas Clear Rect Example</title>
</head>
<body>
<canvas id="drawing" width="200" height="200">Your browser doesn't support the canvas tag.</canvas>
<script type="text/javascript">
    window.onload = function () {
        var drawing = document.getElementById("drawing");

        //make sure <canvas> is completely supported
        if (drawing.getContext) {

            var context = drawing.getContext("2d");

            //draw a red rectangle
            context.fillStyle = "#ff0000";
            context.fillRect(10, 10, 50, 50);

            //draw a blue rectangle that's semi-transparent
            context.fillStyle = "rgba(0,0,255,0.5)";
            context.fillRect(30, 30, 50, 50);

            //clear a rectangle that overlaps both of the previous rectangles
            context.clearRect(40, 40, 10, 10);
        }
    };

</script>
</body>
</html>
```

如图 15-3 所示，两个填充矩形重叠在一起，而重叠的地方又被清除了一个小矩形区域。

![image-20220527183449549](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527183449549.png)

### 15.2.3绘制路径

2D 绘制上下文支持很多在画布上绘制路径的方法。通过路径可以创造出复杂的形状和线条。要绘制路径，首先必须调用 beginPath()方法，表示要开始绘制新路径。然后，再通过调用下列方法来实际地绘制路径。

- arc(*x*, *y*, *radius*, *startAngle*, *endAngle, counterclockwise*)：以(*x*,*y*)为圆心绘制一条弧线，弧线半径为 radius，起始和结束角度（用弧度表示）分别为 startAngle 和endAngle。最后一个参数表示 startAngle 和 endAngle 是否按逆时针方向计算，值为 false表示按顺时针方向计算。
- arcTo(*x1, y1, x2, y2, radius*)：从上一点开始绘制一条弧线，到(*x2,y2*)为止，并且以给定的半径 radius 穿过(*x1,y1*)。 
- bezierCurveTo(*c1x, c1y, c2x, c2y, x, y*)：从上一点开始绘制一条曲线，到(*x,y*)为止，并且以(*c1x,c1y*)和(*c2x,c2y*)为控制点。
- lineTo(*x, y*)：从上一点开始绘制一条直线，到(*x,y*)为止。
- moveTo(*x, y*)：将绘图游标移动到(*x,y*)，不画线。
- quadraticCurveTo(*cx, cy, x, y*)：从上一点开始绘制一条二次曲线，到(*x,y*)为止，并且以(*cx,cy*)作为控制点。
- rect(*x, y, width, height*)：从点(*x,y*)开始绘制一个矩形，宽度和高度分别由 width 和height 指定。这个方法绘制的是矩形路径，而不是 strokeRect()和 fillRect()所绘制的独立的形状。

创建了路径后，接下来有几种可能的选择。如果想绘制一条连接到路径起点的线条，可以调用closePath()。如果路径已经完成，你想用 fillStyle 填充它，可以调用 fill()方法。另外，还可以调用 stroke()方法对路径描边，描边使用的是 strokeStyle。最后还可以调用 clip()，这个方法可以在路径上创建一个剪切区域。

下面看一个例子，即绘制一个不带数字的时钟表盘。

```js
var drawing = document.getElementById("drawing"); 

//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
 		var context = drawing.getContext("2d"); 
 		//开始路径
 		context.beginPath(); 

 		//绘制外圆
		context.arc(100, 100, 99, 0, 2 * Math.PI, false); 

		//绘制内圆
		context.moveTo(194, 100); 
		context.arc(100, 100, 94, 0, 2 * Math.PI, false); 

		//绘制分针
		context.moveTo(100, 100); 
		context.lineTo(100, 15); 

		//绘制时针
		context.moveTo(100, 100); 
		context.lineTo(35, 100); 

		//描边路径
		context.stroke(); 
} 
```

在绘制内圆之前，必须把路径移动到内圆上的某一点，以避免绘制出多余的线条。第二次调用 arc()使用了小一点的半径，以便创造边框的效果。然后，组合使用moveTo()和 lineTo()方法来绘制时针和分针。最后一步是调用 stroke()方法，这样才能把图形绘制到画布上，如图 15-4 所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527184711510.png" alt="image-20220527184711510" style="zoom:50%;" />

在 2D 绘图上下文中，路径是一种主要的绘图方式，因为路径能为要绘制的图形提供更多控制。由于路径的使用很频繁，所以就有了一个名为 isPointInPath()的方法。这个方法接收 *x* 和 *y* 坐标作为参数，用于在路径被关闭之前确定画布上的某一点是否位于路径上，例如：

```js
if (context.isPointInPath(100, 100)){ 
 alert("Point (100, 100) is in the path."); 
} 
```

2D 上下文中的路径 API 已经非常稳定，可以利用它们结合不同的填充和描边样式，绘制出非常复杂的图形来。

### 15.2.4绘制文本

文本与图形总是如影随形。为此，2D 绘图上下文也提供了绘制文本的方法。绘制文本主要有两个方法：fillText()和 strokeText()。这两个方法都可以接收 4 个参数：要绘制的文本字符串、*x* 坐标、*y* 坐标和可选的最大像素宽度。而且，这两个方法都以下列 3 个属性为基础。

- font：表示文本样式、大小及字体，用 CSS 中指定字体的格式来指定，例如"10px Arial"。 
- textAlign：表示文本对齐方式。可能的值有"start"、"end"、"left"、"right"和"center"。建议使用"start"和"end"，不要使用"left"和"right"，因为前两者的意思更稳妥，能同时适合从左到右和从右到左显示（阅读）的语言。
- textBaseline：表示文本的基线。可能的值有"top"、"hanging"、"middle"、"alphabetic"、"ideographic"和"bottom"。

这几个属性都有默认值，因此没有必要每次使用它们都重新设置一遍值。fillText()方法使用fillStyle 属性绘制文本，而 strokeText()方法使用 strokeStyle 属性为文本描边。相对来说，还是使用 fillText()的时候更多，因为该方法模仿了在网页中正常显示文本。例如，下面的代码在前一节创建的表盘上方绘制了数字 12：

```js
//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
 		var context = drawing.getContext("2d"); 
 		//开始路径
 		context.beginPath(); 

 		//绘制外圆
		context.arc(100, 100, 99, 0, 2 * Math.PI, false); 

		//绘制内圆
		context.moveTo(194, 100); 
		context.arc(100, 100, 94, 0, 2 * Math.PI, false); 

		//绘制分针
		context.moveTo(100, 100); 
		context.lineTo(100, 15); 

		//绘制时针
		context.moveTo(100, 100); 
		context.lineTo(35, 100); 

		//描边路径
		context.stroke(); 
  
  	//add some text - not supported by all browsers
    if (context.strokeText){
        context.font = "bold 14px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("12", 100, 20);
    } else {
        alert("Your browser doesn't support the canvas text API.");
    }
} 
```

结果如图 15-5 所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527184900390.png" alt="image-20220527184900390" style="zoom:50%;" />

因为这里把 textAlign 设置为"center"，把 textBaseline 设置为"middle"，所以坐标(100,20)表示的是文本水平和垂直中点的坐标。如果将 textAlign 设置为"start"，则 *x* 坐标表示的是文本左端的位置（从左到右阅读的语言）；设置为"end"，则 *x* 坐标表示的是文本右端的位置（从左到右阅读的语言）。例如：

```js
//正常
context.font = "bold 14px Arial"; 
context.textAlign = "center"; 
context.textBaseline = "middle"; 
context.fillText("12", 100, 20); 

//起点对齐
context.textAlign = "start"; 
context.fi llText("12", 100, 40); 

//终点对齐
context.textAlign = "end"; 
context.fi llText("12", 100, 60); 
```

这一回绘制了三个字符串"12"，每个字符串的 *x* 坐标值相同，但 textAlign 值不同。另外，后两个字符串的 *y* 坐标依次增大，以避免相互重叠。结果如图 15-6 所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527184952489.png" alt="image-20220527184952489" style="zoom:50%;" />

表盘中的分针恰好位于正中间，因此文本的水平对齐方式如何变化也能够一目了然。类似地，修改textBaseline 属性的值可以调整文本的垂直对齐方式：值为"top"，*y* 坐标表示文本顶端；值为"bottom"，*y* 坐标表示文本底端；值为"hanging"、"alphabetic"和"ideographic"，则 *y* 坐标分别指向字体的特定基线坐标。

由于绘制文本比较复杂，特别是需要把文本控制在某一区域中的时候，2D 上下文提供了辅助确定文本大小的方法 measureText()。这个方法接收一个参数，即要绘制的文本；返回一个 TextMetrics对象。返回的对象目前只有一个 width 属性，但将来还会增加更多度量属性。

measureText()方法利用 font、textAlign 和 textBaseline 的当前值计算指定文本的大小。

比如，假设你想在一个 140 像素宽的矩形区域中绘制文本 Hello world!，下面的代码从 100 像素的字体大小开始递减，最终会找到合适的字体大小。

```js
var fontSize = 100; 
context.font = fontSize + "px Arial"; 
while(context.measureText("Hello world!").width > 140){ 
 fontSize--; 
 context.font = fontSize + "px Arial"; 
} 

context.fillText("Hello world!", 10, 10); 
context.fillText("Font size is " + fontSize + "px", 10, 50); 
```

前面提到过，fillText 和 strokeText()方法都可以接收第四个参数，

也就是文本的最大像素宽度。不过，这个可选的参数尚未得到所有浏览器支持（最早支持它的是 Firefox 4）。提供这个参数后，调用 fillText()或strokeText()时如果传入的字符串大于最大宽度，则绘制的文本字符的高度

正确，但宽度会收缩以适应最大宽度。图 15-7 展示了这个效果。

绘制文本还是相对比较复杂的操作，因此支持`<canvas>`元素的浏览器也并未完全实现所有与绘制文本相关的 API。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527185736011.png" alt="image-20220527185736011" style="zoom:50%;" />

### 15.2.5变换

通过上下文的变换，可以把处理后的图像绘制到画布上。2D 绘制上下文支持各种基本的绘制变换。

创建绘制上下文时，会以默认值初始化变换矩阵，在默认的变换矩阵下，所有处理都按描述直接绘制。

为绘制上下文应用变换，会导致使用不同的变换矩阵应用处理，从而产生不同的结果。可以通过如下方法来修改变换矩阵。

-  *rotate*(*angle*)：围绕原点旋转图像 *angle* 弧度。
- *scale*(*scaleX*, *scaleY*)：缩放图像，在 *x* 方向乘以 *scaleX*，在 *y* 方向乘以 *scaleY*。*scaleX*和 *scaleY* 的默认值都是 1.0。 
-  *translate*(*x*, *y*)：将坐标原点移动到(*x,y*)。执行这个变换之后，坐标(0,0)会变成之前由(*x,y*)表示的点。
- *transform*(*m1_1, m1_2, m2_1, m2_2, dx, dy*)：直接修改变换矩阵，方式是乘以如下矩阵。
- ![image-20220527195353865](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527195353865.png)
- setTransform(*m1_1*, m1*_2, m2_1, m2_2, dx, dy*)：将变换矩阵重置为默认状态，然后再调用 *transform*()。

变换有可能很简单，但也可能很复杂，这都要视情况而定。比如，就拿前面例子中绘制表针来说，如果把原点变换到表盘的中心，然后再绘制表针就容易多了。请看下面的例子。

```js
var drawing = document.getElementById("drawing"); 
//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
	var context = drawing.getContext("2d"); 
 	//开始路径
 	context.beginPath(); 

 	//绘制外圆
 	context.arc(100, 100, 99, 0, 2 * Math.PI, false); 

 	//绘制内圆
 	context.moveTo(194, 100); 
 	context.arc(100, 100, 94, 0, 2 * Math.PI, false); 

 	//变换原点
 	context.translate(100, 100); 

 	//绘制分针
 	context.moveTo(0,0); 
 	context.lineTo(0, -85); 

 	//绘制时针
 	context.moveTo(0, 0); 
 	context.lineTo(-65, 0); 
  
 	//描边路径
 	context.stroke(); 
} 
```

把原点变换到时钟表盘的中心点(100,100)后，在同一方向上绘制线条就变成了简单的数学问题了。

所有数学计算都基于(0,0)，而不是(100,100)。还可以更进一步，像下面这样使用 rotate()方法旋转时钟的表针。

```js
var drawing = document.getElementById("drawing"); 
//确定浏览器支持<canvas>元素
if (drawing.getContext){ 
 	var context = drawing.getContext("2d"); 
 	//开始路径
 	context.beginPath(); 

 	//绘制外圆
 	context.arc(100, 100, 99, 0, 2 * Math.PI, false); 

 	//绘制内圆
 	context.moveTo(194, 100); 
 	context.arc(100, 100, 94, 0, 2 * Math.PI, false); 

 	//变换原点
 	context.translate(100, 100); 

 	//旋转表针
 	context.rotate(1);

 	//绘制分针
	context.moveTo(0,0); 
 	context.lineTo(0, -85); 

 	//绘制时针
 	context.moveTo(0, 0); 
 	context.lineTo(-65, 0); 

 	//描边路径
 	context.stroke(); 
} 
```

因为原点已经变换到了时钟表盘的中心点，所以旋转也是以该点为圆心的。结果就像是表针真地被固定在表盘中心一样，然后向右旋转了一定角度。结果如图 15-8 所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527195119731.png" alt="image-20220527195119731" style="zoom:50%;" />

无论是刚才执行的变换，还是 fillStyle、strokeStyle 等属性，都会在当前上下文中一直有效，除非再对上下文进行什么修改。虽然没有什么办法把上下文中的一切都重置回默认值，但有两个方法可以跟踪上下文的状态变化。如果你知道将来还要返回某组属性与变换的组合，可以调用 save()方法。

调用这个方法后，当时的所有设置都会进入一个栈结构，得以妥善保管。然后可以对上下文进行其他修改。等想要回到之前保存的设置时，可以调用 restore()方法，在保存设置的栈结构中向前返回一级，恢复之前的状态。连续调用 save()可以把更多设置保存到栈结构中，之后再连续调用 restore()则可以一级一级返回。下面来看一个例子。

```js
context.fillStyle = "#ff0000"; 
context.save(); 

context.fillStyle = "#00ff00"; 
context.translate(100, 100); 
context.save(); 

context.fillStyle = "#0000ff"; 
context.fillRect(0, 0, 100, 200); //从点(100,100)开始绘制蓝色矩形
context.restore(); 

context.fillRect(10, 10, 100, 200); //从点(110,110)开始绘制绿色矩形

context.restore(); 

context.fillRect(0, 0, 100, 200); //从点(0,0)开始绘制红色矩形
```

需要注意的是，save()方法保存的只是对绘图上下文的设置和变换，不会保存绘图上下文的内容。

### 15.2.6绘制图像

2D 绘图上下文内置了对图像的支持。如果你想把一幅图像绘制到画布上，可以使用 drawImage()方法。根据期望的最终结果不同，调用这个方法时，可以使用三种不同的参数组合。最简单的调用方式是传入一个 HTML `<img>`元素，以及绘制该图像的起点的 *x* 和 *y* 坐标。例如：

```js
var image = document.images[0]; 
context.drawImage(image, 10, 10);  
```

这两行代码取得了文档中的第一幅图像，然后将它绘制到上下文中，起点为(10,10)。绘制到画布上的图像大小与原始大小一样。如果你想改变绘制后图像的大小，可以再多传入两个参数，分别表示目标宽度和目标高度。通过这种方式来缩放图像并不影响上下文的变换矩阵。例如：

```js
context.drawImage(image, 50, 10, 20, 30); 
```

执行代码后，绘制出来的图像大小会变成 20×30 像素。

除了上述两种方式，还可以选择把图像中的某个区域绘制到上下文中。drawImage()方法的这种调用方式总共需要传入 9 个参数：要绘制的图像、源图像的 *x* 坐标、源图像的 *y* 坐标、源图像的宽度、源图像的高度、目标图像的 *x* 坐标、目标图像的 *y* 坐标、目标图像的宽度、目标图像的高度。这样调用drawImage()方法可以获得最多的控制。例如：

```js
context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60); 
```

这行代码只会把原始图像的一部分绘制到画布上。原始图像的这一部分的起点为(0,10)，宽和高都是 50 像素。最终绘制到上下文中的图像的起点是(0,100)，而大小变成了 40×60 像素。这种调用方式可以创造出很有意思的效果，如图 15-9 所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527200820123.png" alt="image-20220527200820123" style="zoom:50%;" />

### 15.2.7阴影

2D 上下文会根据以下几个属性的值，自动为形状或路径绘制出阴影。

- shadowColor：用 CSS 颜色格式表示的阴影颜色，默认为黑色。
- shadowOffsetX：形状或路径 *x* 轴方向的阴影偏移量，默认为 0。 
- shadowOffsetY：形状或路径 *y* 轴方向的阴影偏移量，默认为 0。 
- shadowBlur：模糊的像素数，默认 0，即不模糊。

这些属性都可以通过 context 对象来修改。只要在绘制前为它们设置适当的值，就能自动产生阴影。例如：

```js
var context = drawing.getContext("2d"); 

//设置阴影
context.shadowOffsetX = 5; 
context.shadowOffsetY = 5; 
context.shadowBlur = 4; 
context.shadowColor = "rgba(0, 0, 0, 0.5)"; 

//绘制红色矩形
context.fillStyle = "#ff0000"; 
context.fillRect(10, 10, 50, 50); 

//绘制蓝色矩形
context.fillStyle = "rgba(0,0,255,1)";
context.fillRect(30, 30, 50, 50); 
```

两个矩形的阴影样式相同，结果如图 15-10 所示。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220527201033584.png" alt="image-20220527201033584" style="zoom:50%;" />

### 15.2.8渐变

渐变由 CanvasGradient 实例表示，很容易通过 2D 上下文来创建和修改。要创建一个新的线性渐变，可以调用 createLinearGradient()方法。这个方法接收 4 个参数：起点的 *x* 坐标、起点的 *y* 坐标、终点的 *x* 坐标、终点的 *y* 坐标。调用这个方法后，它就会创建一个指定大小的渐变，并返回CanvasGradient 对象的实例。

创建了渐变对象后，下一步就是使用 addColorStop()方法来指定色标。这个方法接收两个参数：色标位置和 CSS 颜色值。色标位置是一个 0（开始的颜色）到 1（结束的颜色）之间的数字。例如：

```js
var gradient = context.createLinearGradient(30, 30, 70, 70); 
gradient.addColorStop(0, "white"); 
gradient.addColorStop(1, "black"); 
```

此时，gradient 对象表示的是一个从画布上点(30,30)到点(70,70)的渐变。起点的色标是白色，终点的色标是黑色。然后就可以把 fillStyle 或 strokeStyle 设置为这个对象，从而使用渐变来绘制形状或描边：

```js
//绘制红色矩形
context.fillStyle = "#ff0000"; 
context.fillRect(10, 10, 50, 50); 

//绘制渐变矩形
context.fillStyle = gradient; 
context.fillRect(30, 30, 50, 50);
```

为了让渐变覆盖整个矩形，而不是仅应用到矩形的一部分，矩形和渐变对象的坐标必须匹配才行。以上代码会得到如图 15-11 所示的结果。

![image-20220529111556392](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220529111556392.png)

如果没有把矩形绘制到恰当的位置，那可能就只会显示部分渐变效果。例如：

```js
context.fillStyle = gradient; 
context.fillRect(50, 50, 50, 50); 
```

这两行代码执行后得到的矩形只有左上角稍微有一点白色。这主要是因为矩形的起点位于渐变的中间位置，而此时渐变差不多已经结束了。由于渐变不重复，所以矩形的大部分区域都是黑色。确保渐变与形状对齐非常重要，有时候可以考虑使用函数来确保坐标合适。例如：

```js
function createRectLinearGradient(context, x, y, width, height){ 
 	return context.createLinearGradient(x, y, x+width, y+height); 
} 
```

这个函数基于起点的*x*和*y*坐标以及宽度和高度值来创建渐变对象，从而让我们可以在fillRect()中使用相同的值。

```js
var gradient = createRectLinearGradient(context, 30, 30, 50, 50);
gradient.addColorStop(0, "white"); 
gradient.addColorStop(1, "black"); 

//绘制渐变矩形
context.fillStyle = gradient; 
context.fillRect(30, 30, 50, 50); 
```

使用画布的时候，确保坐标匹配很重要，也需要一些技巧。类似 createRectLinearGradient()这样的辅助方法可以让控制坐标更容易一些。

要创建径向渐变（或放射渐变），可以使用 createRadialGradient()方法。这个方法接收 6 个参数，对应着两个圆的圆心和半径。前三个参数指定的是起点圆的原心（*x* 和 *y*）及半径，后三个参数指定的是终点圆的原心（*x* 和 *y*）及半径。可以把径向渐变想象成一个长圆桶，而这 6 个参数定义的正是这个桶的两个圆形开口的位置。如果把一个圆形开口定义得比另一个小一些，那这个圆桶就变成了圆锥体，而通过移动每个圆形开口的位置，就可达到像旋转这个圆锥体一样的效果。

如果想从某个形状的中心点开始创建一个向外扩散的径向渐变效果，就要将两个圆定义为同心圆。

比如，就拿前面创建的矩形来说，径向渐变的两个圆的圆心都应该在(55,55)，因为矩形的区域是从(30,30)到(80,80)。请看代码：

```js
var gradient = context.createRadialGradient(55, 55, 10, 55, 55, 30); 
gradient.addColorStop(0, "white"); 
gradient.addColorStop(1, "black"); 

//绘制红色矩形
context.fillStyle = "#ff0000"; 
context.fillRect(10, 10, 50, 50); 

//绘制渐变矩形
context.fillStyle = gradient; 
context.fillRect(30, 30, 50, 50); 
```

运行代码，会得到如图 15-12 所示的结果。

![image-20220529111955208](https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220529111955208.png)

因为创建比较麻烦，所以径向渐变并不那么容易控制。不过，一般来说，让起点圆和终点圆保持为同心圆的情况比较多，这时候只要考虑给两个圆设置不同的半径就好了。

### 15.2.9模式

模式其实就是重复的图像，可以用来填充或描边图形。要创建一个新模式，可以调用createPattern()方法并传入两个参数：一个 HTML `<img>`元素和一个表示如何重复图像的字符串。

其中，第二个参数的值与 CSS 的 background-repeat 属性值相同，包括"repeat"、"repeat-x"、"repeat-y"和"no-repeat"。看一个例子。

```js
var image = document.images[0], 
pattern = context.createPattern(image, "repeat"); 
//绘制矩形
context.fillStyle = pattern; 
context.fillRect(10, 10, 150, 150); 
```

需要注意的是，模式与渐变一样，都是从画布的原点(0,0)开始的。将填充样式（fillStyle）设置为模式对象，只表示在某个特定的区域内显示重复的图像，而不是要从某个位置开始绘制重复的图像。上面的代码会得到如图 15-13 所示的结果。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220529112246812.png" alt="image-20220529112246812" style="zoom:50%;" />

createPattern()方法的第一个参数也可以是一个`<video>`元素，或者另一个`<canvas>`元素。

### 15.2.10使用图像数据

2D 上下文的一个明显的长处就是，可以通过 getImageData()取得原始图像数据。这个方法接收4 个参数：要取得其数据的画面区域的 *x* 和 *y* 坐标以及该区域的像素宽度和高度。例如，要取得左上角坐标为(10,5)、大小为 50×50 像素的区域的图像数据，可以使用以下代码：

```js
var imageData = context.getImageData(10, 5, 50, 50); 
```

这里返回的对象是 ImageData 的实例。每个 ImageData 对象都有三个属性：width、height 和data。其中 data 属性是一个数组，保存着图像中每一个像素的数据。在 data 数组中，每一个像素用4 个元素来保存，分别表示红、绿、蓝和透明度值。因此，第一个像素的数据就保存在数组的第 0 到第3 个元素中，例如：

```js
var data = imageData.data, 
red = data[0], 
green = data[1], 
blue = data[2], 
alpha = data[3]; 
```

数组中每个元素的值都介于 0 到 255 之间（包括 0 和 255）。能够直接访问到原始图像数据，就能够以各种方式来操作这些数据。例如，通过修改图像数据，可以像下面这样创建一个简单的灰阶过滤器。

```html
<!DOCTYPE html>
<html>
<head>
    <title>Canvas Fill Rect Pattern Example</title>
</head>
<body>
<canvas id="drawing" width="200" height="200">Your browser doesn't support the canvas tag.</canvas>
<img id="smiley" src="smile2.gif" border="1" title="Image tag"/>
<script>
    window.onload = function () {
        var drawing = document.getElementById("drawing");

        //make sure <canvas> is completely supported
        if (drawing.getContext) {

            var context = drawing.getContext("2d"),
                image = document.images[0],
                imageData, data,
                i, len, average,
                red, green, blue, alpha;

            // 绘制原始图像
            context.drawImage(image, 0, 0);

            // 取得图像数据
            imageData = context.getImageData(0, 0, image.width, image.height);
            data = imageData.data;

            for (i = 0, len = data.length; i < len; i += 4) {

                red = data[i];
                green = data[i + 1];
                blue = data[i + 2];
                alpha = data[i + 3];

                // 取得rgb平均值
                average = Math.floor((red + green + blue) / 3);

                //set the colors, leave alpha alone
                data[i] = average;
                data[i + 1] = average;
                data[i + 2] = average;

            }

            // 回写图像数据并显示结果
            imageData.data = data;
            context.putImageData(imageData, 0, 0);
        }
    };

</script>
</body>
</html>
```

这个例子首先在画面上绘制了一幅图像，然后取得了原始图像数据。其中的 for 循环遍历了图像数据中的每一个像素。这里要注意的是，每次循环控制变量 i 都递增 4。在取得每个像素的红、绿、蓝颜色值后，计算出它们的平均值。再把这个平均值设置为每个颜色的值，结果就是去掉了每个像素的颜色，只保留了亮度接近的灰度值（即彩色变黑白）。在把 data 数组回写到 imageData 对象后，调用putImageData()方法把图像数据绘制到画布上。最终得到了图像的黑白版。

当然，通过操作原始像素值不仅能实现灰阶过滤，还能实现其他功能。要了解通过操作原始图像数据实现过滤器的更多信息，请参考 Ilmari Heikkinen 的文章“Making Image Filters with Canvas”（基于Canvas 的图像过滤器）：http://www.html5rocks.com/en/tutorials/canvas/imagefilters/。

> 只有在画布“干净”的情况下（即图像并非来自其他域），才可以取得图像数据。如果画布“不干净”，那么访问图像数据时会导致 JavaScript 错误。

### 15.2.11合成

还有两个会应用到 2D 上下文中所有绘制操作的属性：globalAlpha 和 globalCompositionOperation。其中，globalAlpha 是一个介于 0 和 1 之间的值（包括 0 和 1），用于指定所有绘制的透明度。默认值为 0。如果所有后续操作都要基于相同的透明度，就可以先把 globalAlpha 设置为适当值，然后绘制，最后再把它设置回默认值 0。下面来看一个例子。

```js
//绘制红色矩形
context.fillStyle = "#ff0000"; 
context.fillRect(10, 10, 50, 50); 

//修改全局透明度
context.globalAlpha = 0.5; 

//绘制蓝色矩形
context.fillStyle = "rgba(0,0,255,1)"; 
context.fillRect(30, 30, 50, 50); 

//重置全局透明度
context.globalAlpha = 0; 
```

在这个例子中，我们把蓝色矩形绘制到了红色矩形上面。因为在绘制蓝色矩形前，globalAlpha已经被设置为 0.5，所以蓝色矩形会呈现半透明效果，透过它可以看到下面的红色矩形。

第二个属性 globalCompositionOperation 表示后绘制的图形怎样与先绘制的图形结合。这个属性的值是字符串，可能的值如下。

- source-over（默认值）：后绘制的图形位于先绘制的图形上方。
- source-in：后绘制的图形与先绘制的图形重叠的部分可见，两者其他部分完全透明。
- source-out：后绘制的图形与先绘制的图形不重叠的部分可见，先绘制的图形完全透明。
- source-atop：后绘制的图形与先绘制的图形重叠的部分可见，先绘制图形不受影响。
- destination-over：后绘制的图形位于先绘制的图形下方，只有之前透明像素下的部分才可见。
- destination-in：后绘制的图形位于先绘制的图形下方，两者不重叠的部分完全透明。
- destination-out：后绘制的图形擦除与先绘制的图形重叠的部分。
- destination-atop：后绘制的图形位于先绘制的图形下方，在两者不重叠的地方，先绘制的图形会变透明。
- lighter：后绘制的图形与先绘制的图形重叠部分的值相加，使该部分变亮。
- copy：后绘制的图形完全替代与之重叠的先绘制图形。
- xor：后绘制的图形与先绘制的图形重叠的部分执行“异或”操作。

这个合成操作实际上用语言或者黑白图像是很难说清楚的。要了解每个操作的具体效果，请参见https://developer.mozilla.org/samples/canvas-tutorial/6_1_canvas_composite.html。推荐使用 IE9+或 Firefox 4+访问前面的网页，因为这两款浏览器对 Canvas 的实现最完善。下面来看一个例子。

```js
//绘制红色矩形
context.fillStyle = "#ff0000"; 
context.fillRect(10, 10, 50, 50); 

//设置合成操作
context.globalCompositeOperation = "destination-over";

//绘制蓝色矩形
context.fillStyle = "rgba(0,0,255,1)"; 
context.fillRect(30, 30, 50, 50); 
```

如果不修改 globalCompositionOperation，那么蓝色矩形应该位于红色矩形之上。但把globalCompositionOperation 设置为"destination-over"之后，红色矩形跑到了蓝色矩形上面。

在使用 globalCompositionOperation 的情况下，一定要多测试一些浏览器。因为不同浏览器对这个属性的实现仍然存在较大的差别。Safari 和 Chrome 在这方面还有问题，至于有什么问题，大家可以比较在打开上述页面的情况下，IE9+和 Firefox 4+与它们有什么差异。

## 15.3WebGL

WebGL 是针对 Canvas 的 3D 上下文。与其他 Web 技术不同，WebGL 并不是 W3C 制定的标准，而是由 Khronos Group 制定的。其官方网站是这样介绍的：“Khronos Group 是一个非盈利的由会员资助的协会，专注于为并行计算以及各种平台和设备上的图形及动态媒体制定无版税的开放标准。” Khronos Group 也设计了其他图形处理 API，比如 OpenGL ES 2.0。浏览器中使用的 WebGL 就是基于 OpenGL ES 2.0 制定的。

OpenGL 等 3D 图形语言是非常复杂的，本书不可能介绍其中每一个概念。熟悉 OpenGL ES 2.0 的读者可能会觉得 WebGL 更好理解一些，因为好多概念是相通的。

本节将适当地介绍 OpenGL ES 2.0 的一些概念，尽力解释其中的某些部分在 WebGL 中的实现。要全面了解 OpenGL，请访问 www.opengl.org。要全面学习 WebGL，请参考 www.learningwebgl.com，其中包含非常棒的系列教程

### 15.3.1类型化数组

WebGL 涉及的复杂计算需要提前知道数值的精度，而标准的 JavaScript 数值无法满足需要。为此WebGL 引入了一个概念，叫类型化数组（typed arrays）。类型化数组也是数组，只不过其元素被设置为特定类型的值。

类型化数组的核心就是一个名为 ArrayBuffer 的类型。每个 ArrayBuffer 对象表示的只是内存中指定的字节数，但不会指定这些字节用于保存什么类型的数据。通过 ArrayBuffer 所能做的，就是为了将来使用而分配一定数量的字节。例如，下面这行代码会在内存中分配 20B。

```js
var buffer = new ArrayBuffer(20); 
```

创建了 ArrayBuffer 对象后，能够通过该对象获得的信息只有它包含的字节数，方法是访问其byteLength 属性：

```js
var bytes = buffer.byteLength; 
```

虽然 ArrayBuffer 对象本身没有多少可说的，但对 WebGL 而言，使用它是极其重要的。而且，在涉及视图的时候，你才会发现它原来还是很有意思的。

#### 1.视图

使用 ArrayBuffer（数组缓冲器类型）的一种特别的方式就是用它来创建数组缓冲器视图。其中，最常见的视图是 DataView，通过它可以选择 ArrayBuffer 中一小段字节。为此，可以在创建 DataView实例的时候传入一个 ArrayBuffer、一个可选的字节偏移量（从该字节开始选择）和一个可选的要选择的字节数。例如：

```js
//基于整个缓冲器创建一个新视图
var view = new DataView(buffer); 

//创建一个开始于字节 9 的新视图
var view = new DataView(buffer, 9); 

//创建一个从字节 9 开始到字节 18 的新视图
var view = new DataView(buffer, 9, 10); 

//实例化之后，DataView 对象会把字节偏移量以及字节长度信息分别保存在 byteOffset 和byteLength 属性中。

alert(view.byteOffset); 

alert(view.byteLength); 
```

通过这两个属性可以在以后方便地了解视图的状态。另外，通过其 buffer 属性也可以取得数组缓冲器。

读取和写入 DataView 的时候，要根据实际操作的数据类型，选择相应的 getter 和 setter 方法。下表列出了 DataView 支持的数据类型以及相应的读写方法。

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220613223312765.png" alt="image-20220613223312765" style="zoom:50%;" />

<img src="https://interview-aliyun.oss-cn-beijing.aliyuncs.com/myBlog/image-20220613223334712.png" alt="image-20220613223334712" style="zoom:50%;" />











### 15.3.2WebGL上下文



### 15.3.3支持