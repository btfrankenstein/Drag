# 拖拽插件

内部元素只能在外部元素内部拖拽

# 用法

设置HTML和CSS类似

```
<style media="screen">
  #outer {
    background-color: red;
    width: 200px;
    height: 500px;
    position: relative;
  }

  #inner {
    background-color: #000;
    width: 200px;
    height: 200px;
    position: absolute;
    top: 0;
  }
</style>

<div class="" id="outer">
  <div class="" id="inner"></div>
</div>
```

`body`前引入 `<script src="drag.js"></script>`

```
//第一个参数是内部元素， 第二个参数是外部元素
Drag(document.getElementById("inner"), document.getElementById("outer"));
```
