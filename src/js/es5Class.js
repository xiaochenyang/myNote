function Toast(option){
    this.prompt = ''
    this.elem = null
    this.init(option)
}

Toast.prototype = {
    //构造器
    constructor: Toast,
    //方法
    init: function(option) {
        this.prompt = option.prompt || '';
        this.render();
        this.bindEvent();
    },
    show: function(){
        this.changeStyle(this.elem, 'display', 'block');
    },
    hide: function(){
        this.changeStyle(this.elem, 'display', 'none');
    },
    render: function(){
        var html = ''
        this.elem = document.createElement('div')
        this.changeStyle(this.elem, 'display', 'none')

        html += '<a class="j-close" href="javascript:;">x</a>'
        html += '<p>'+ this.prompt + '</p>'

        this.elem.innerHtml = html

        return document.body.appendChild(this.elem)
    },
    changeStyle: function(node, key, value){
        node.style[key] = value
    },
    bindEvent: function(){
        var self = this

        this.addEvent(this.elem, 'click', function(e){
            if(e.target.className.indexOf('j-close') != -1 ){
                console.log('close Toast')
                self.hide()
            }
        })
    },
    addEvent: function(node, name, fn){
        var self = this

        node.addEventListener(name, function(){
            fn.apply(self, Array.prototype.slice.call(arguments))
        }, false)
    }
}

var T = new Toast({prompt: 'toast!'})
T.show()