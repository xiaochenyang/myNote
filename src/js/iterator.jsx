const obj = {
    [Symbol.iterator] : function () {
        return {
            next: function () {
                return {
                    value: 1,
                    done: true
                };
            }
        };
    }
};


/**
 * 
 */
class RangeIterator {
    constructor(start, stop) {
        this.value = start;
        this.stop = stop;
    }
  
    [Symbol.iterator]() { return this; }
  
    next() {
        var value = this.value;
        if (value < this.stop) {
            this.value++;
            return {done: false, value: value};
        }
        return {done: true, value: undefined};
    }
}
  
function range(start, stop) {
    return new RangeIterator(start, stop);
}
  
for (var value of range(0, 3)) {
    console.log(value); // 0, 1, 2
}


/**
 * 上面代码首先在构造函数的原型链上部署Symbol.iterator方法，
 * 调用该方法会返回遍历器对象iterator，调用该对象的next方法，
 * 在返回一个值的同时，自动将内部指针移到下一个实例
 */

function Obj(value){
    this.value = value
    this.next = null
}

Obj.prototype[Symbol.iterator] = function() {
    var iterator = {next: next}

    var current = this

    function next(){
        if(current) {
            var value = current.value
            current = current.next
            return {done: false, value: value}
        } else {
            return {done: true}
        }
    }

    return iterator
}

var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)

one.next() = two
two.next() = three

for(var i of one){
    console.log(i)
}

/**
 * 
 */
let obj = {
    data: ['hello','world'],
    [Symbol.iterator](){
        const self = this
        let index = 0
        return {
            next() {
                if(index < self.data.length){
                    return {
                        value: self.data[index++],
                        done: false
                    }
                }else{
                    return {value: undefined, done: true}
                }
            }
        }
    }
}

/**
 * ITERABLE代表某种可遍历的数据结构，
 * $iterator是它的遍历器对象。
 * 遍历器对象每次移动指针（next方法），都检查一下返回值的done属性，
 * 如果遍历还没结束，就移动遍历器对象的指针到下一步（next方法），不断循环
 */
var $iterator = ITERABLE[Symbol.iterator]();
var $result = $iterator.next();
while (!$result.done) {
  var x = $result.value;
  // ...
  $result = $iterator.next();
}