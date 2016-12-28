;(function(window, undefined) {

    var methods = {
        on: function(node, eventname, handler) {
            if (node.addEventListener) {
                node.addEventListener(eventname, handler)
            } else {
                node.attachEvent('on' + eventname, handler)
            }
        },
        getStyle: function(node, stylename) {
            var realStyle
            if (window.getComputedStyle) {
                realStyle = window.getComputedStyle(node)[stylename]
            } else if (node.currentStyle) {
                realStyle = node.currentStyle[stylename]
            }
            return realStyle
        },
        setCss: function(node, css) {
            for (var key in css) {
                node.style[key] = css[key]
            }
        }
    }

    function DragElement(node) {
        this.node = node
        this.x = 0
        this.y = 0
    }

    DragElement.prototype = {
        constructor: DragElement,
        setXY: function(x, y) {
            this.x = parseInt(x) || 0
            this.y = parseInt(y) || 0
            return this
        },
        setEleCss: function(css) {
            methods.setCss(this.node, css)
            return this
        }
    }

    function Mouse() {
        this.x = 0
        this.y = 0
    }

    Mouse.prototype.setXY = function(x, y) {
        this.x = parseInt(x)
        this.y = parseInt(y)
    }

    var draggableConfig = {
        zIndex: 1,
        draggingObj: null,
        mouse: new Mouse(),
        diffWidth: '',
        diffHeight: ''
    }

    function Drag(ele, outer) {
        draggableConfig.diffWidth = parseInt(methods.getStyle(outer, 'width')) - parseInt(methods.getStyle(ele, 'width'))
        draggableConfig.diffHeight = parseInt(methods.getStyle(outer, 'height')) - parseInt(methods.getStyle(ele, 'height'))

        function mouseDown(event) {
            var ele = event.target || event.srcElement

            draggableConfig.mouse.setXY(event.clientX, event.clientY)
            draggableConfig.draggingObj = new DragElement(ele)
            draggableConfig.draggingObj.setXY(ele.style.left, ele.style.top).setEleCss({
                'zIndex': draggableConfig.zIndex++,
                'position': 'relative'
            })
        }
        methods.on(ele, 'mousedown', mouseDown)
    }


    methods.on(document, 'mousemove', function(event) {

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

    methods.on(document, 'mouseup', function(event) {
        draggableConfig.draggingObj = null
    })

    window.Drag = Drag
})(window)
