;
(function(window, undefined) {

    var methods = {
        on: function(node, eventname, handler) { // 注册事件
            if (node.addEventListener) {
                node.addEventListener(eventname, handler)
            } else {
                node.attachEvent('on' + eventname, handler)
            }
        },
        getStyle: function(node, stylename) { // 获取元素样式
            var realStyle
            if (window.getComputedStyle) {
                realStyle = window.getComputedStyle(node)[stylename]
            } else if (node.currentStyle) {
                realStyle = node.currentStyle[stylename]
            }
            return realStyle
        },
        setStyle: function(node, css) { // 为元素添加css样式
            for (var key in css) {
                node.style[key] = css[key]
            }
        }
    }

    function DragElement(node) { // 被拖拽的对象
        this.node = node
        this.x = 0
        this.y = 0
    }

    DragElement.prototype = {
        constructor: DragElement,
        setXY: function(x, y) { // 对象被拖拽前，记录坐标值。x-横坐标，y-纵坐标
            this.x = parseInt(x) || 0
            this.y = parseInt(y) || 0
            return this
        },
        setEleCss: function(css) { // 为被拖拽的对象添加css样式
            methods.setStyle(this.node, css)
            return this
        }
    }

    function Mouse() { // 鼠标对象
        this.x = 0
        this.y = 0
    }

    Mouse.prototype.setXY = function(x, y) { // 拖拽对象前记录鼠标的坐标
        this.x = parseInt(x)
        this.y = parseInt(y)
    }

    var draggableConfig = {
        // zIndex: 1,
        draggingObj: null,
        mouse: new Mouse(),
        diffWidth: '',
        diffHeight: ''
    }

    function Drag(ele, outer) {
        // 计算被拖拽元素和其容器的宽高差
        draggableConfig.diffWidth = parseInt(methods.getStyle(outer, 'width')) - parseInt(methods.getStyle(ele, 'width'))
        draggableConfig.diffHeight = parseInt(methods.getStyle(outer, 'height')) - parseInt(methods.getStyle(ele, 'height'))

        function mouseDown(event) { // 鼠标按下时的handler
            var ele = event.target || event.srcElement

            draggableConfig.mouse.setXY(event.clientX, event.clientY)
            draggableConfig.draggingObj = new DragElement(ele)
            draggableConfig.draggingObj.setXY(ele.style.left, ele.style.top).setEleCss({
                // 'zIndex': draggableConfig.zIndex++,
                'position': 'relative' // position是relative或者absolute， left和right才有效果
            })
        }
        methods.on(ele, 'mousedown', mouseDown)
    }


    methods.on(document, 'mousemove', function(event) { // 鼠标移动时的handler

        if (draggableConfig.draggingObj) {
            var mouse = draggableConfig.mouse
            var draggingObj = draggableConfig.draggingObj
            var left;
            var top;

            if (parseInt(event.clientX - mouse.x + draggingObj.x) > draggableConfig.diffWidth) {
                left = draggableConfig.diffWidth
            } else if (parseInt(event.clientX - mouse.x + draggingObj.x) < 0) {
                left = 0
            } else {
                left = parseInt(event.clientX - mouse.x + draggingObj.x)
            }

            if (parseInt(event.clientY - mouse.y + draggingObj.y) > draggableConfig.diffHeight) {
                top = draggableConfig.diffHeight
            } else if (parseInt(event.clientY - mouse.y + draggingObj.y) < 0) {
                top = 0
            } else {
                top = parseInt(event.clientY - mouse.y + draggingObj.y)
            }
            draggingObj.setEleCss({
                'left': left + 'px',
                'top': top + 'px'
            })
        }

    })

    methods.on(document, 'mouseup', function(event) { // 鼠标抬起时的handler
        draggableConfig.draggingObj = null
    })

    window.Drag = Drag

})(window)
