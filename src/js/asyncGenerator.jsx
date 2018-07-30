/**
 * 回调函数
 * 
 * 回调函数的第一个参数，必须是错误对象err，没有错误，该参数为null
 * 
 * 因为，执行分两段，第一段执行完以后，任务所在上下文环境已结束，
 * 在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段
 */


/**
 * 协程
 * （多个线程互相协作，完成异步任务）
 * 
 * 1、协程A开始执行
 * 
 * 2、协程A执行到一半，进入暂停，执行权转移到协程B
 * 
 * 3、一段时间后，协程B交还执行权
 * 
 * 4、协程A恢复执行
 * 
 * 协程A是异步任务，分多段执行
 * 
 * yield 命令是异步两个阶段的分界线，协程遇到 yield 命令就暂停。
 * 等到执行权返回，再从暂停的地方继续往后执行
 * 
 */


/**
 * 协程的Generator函数实现
 * 
 * Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行
 * 
 * 整个Generator函数都是一个封装的异步任务，或者说，是异步任务的容器
 * 异步操作需要暂停的地方，都用yield语句注明
 * 
 * 1、调用 Generator 函数，会返回一个内部指针(遍历器)
 * 
 *  这是Generator函数不同于普通函数的地方，即执行它不会返回结果，返回的是一个指针对象
 * 
 * 2、调用指针 的 next()方法，会移动内部指针，指向下一个遇到的yield语句
 * 
 * 重点：next() 方法的作用是分段执行Generator函数，每次调用next方法，会返回一个对象，
 *      表示当前阶段的信息（包含value属性和done属性）
 * 
 *      value 属性是 yield语句 后面表达式的值，表示当前阶段的值；
 *      done 属性是 一个布尔值，表示Generator函数是否执行完毕，既是否还有下一个阶段
 * 
 */


/**
 * Generator 函数的数据交换和错误处理
 * 
 * 1、Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因
 * 
 * 2、函数体内外的数据交换和错误处理机制
 * 
 * next() 等方法返回值的value属性，是Generator函数向外输出数据，
 * next() 等方法还可以接受参数，向Generator 函数体内输入数据
 * 
 * 3、Generator函数内部可以部署错误处理代码，捕获函数体外抛出的错误
 *  出错代码和错误处理，实现了时间和空间上的分离
 * 
 */

/**
 * 异步任务的封装
 * 
 * Generator函数封装了一个异步操作，该操作先读取一个远程接口
 * 
 * 然后从JSON格式的数据解析信息
 * 
 * 
 */

var fetch = require('node-fetch')

function* gen(){
    var url = 'https://api.github.com/users/github'
    var result = yield fetch(url)
    console.log(result.bio)
}

var g = gen()
var result = g.next()

result.value.then(function(data){
    return data.json()
}).then(function(data){
    g.next(data)
})



/**
 * Thunk 函数
 * 自动执行Generator函数的一种方法
 * 
 * 1、编译器的“传名调用”实现，是将参数放到一个临时函数中，再将这个临时函数传入函数体，这个临时函数 叫 Thunk函数
 * 
 * 2、在 JS 中，Thunk 函数替换的不是表达式，而是多参函数，将其替换成一个只接受回调函数作为参数的单参函数
 * （即 将普通参数 和 回调函数参数 区分）
 * 
 */

 /**
  * Thunk 函数转换器
  */

//ES5
var Thunk = function(fn){
    return function(){
        var args = Array.prototype.slice.call(arguments)
        return function (callback){
            args.push(callback)
            return fn.apply(this, args)
        }
    }
}

//ES6
const Thunk = function(fn){
    return function(...args){
        return function(callback){
            return fn.apply(this, args)
        }
    }
}

var readFileThunk = Thunk(fs.readFile)
readFileThunk(fileA)(callback)


/**
 * Generator 函数的流程管理
 * 
 * 使用Thunk函数，用于Generator函数的自动流程管理
 * 
 * 必须有一种机制，自动控制Generator函数的流程，接收和交还程序的执行权
 * 
 * 1、回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权
 * 
 * 2、Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权
 */

function run(fn){
    var gen = fn()
    
    function next(err, data){
        var result = gen.next()
        if(result.done) return
        result.value(next)  //将 next方法 作为回调传给经过Thunk包装的函数，执行异步操作，实现流程管理
    }

    next()
}

//yield 后面，必须是Thunk函数
var g = function* (){
    var f1 = yield readFileThunk('fileA')   
    var f2 = yield readFileThunk('fileB')
}

run(g)



/**
 * co 模块（用于Generator函数的自动执行）
 * 
 * 1、将Generator函数传入co函数，即自动执行
 * 
 * 2、co函数返回一个Promise对象，可以用then方法，添加回调函数
 * 
 * 3、此时，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。
 * 如果是数组或对象，其成员，全部都是 Promise 对象
 * 
 */

// 数组的写法
co(function* () {
    var res = yield [
        Promise.resolve(1),
        Promise.resolve(2)
    ];
    console.log(res);
}).catch(onerror);
  
  // 对象的写法
co(function* () {
    var res = yield {
        1: Promise.resolve(1),
        2: Promise.resolve(2),
    };
    console.log(res);
}).catch(onerror);

co(function* () {
    var values = [n1, n2, n3];
    yield values.map(somethingAsync);
});
  
function* somethingAsync(x) {
    // do something async
    return y
}


/**
 * 基于Promise对象的自动执行
 */

var fs = require('fs')

var readFile = function(fileName){
    return new Promise(function(resolve, reject){
        fs.readFile(fileName, function(error, data){
            if(error) return reject(error)
            resolve(data)
        })
    })
}

var gen = function* (){
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString()); 
}

var g = gen()

//手动执行，即用then方法，层层添加回调函数
g.next().value.then(function(data){
    g.next(data).value.then(function(data){
      g.next(data);
    });
});

//自动执行器
function run(gen){
    var g = gen()

    function next(data){
        var result = g.next(data)
        if (result.done) return result.value
        result.value.then(function(data){
            next(data)
        })
    }

    next()
}

run(gen)


/**
 * 处理Stream
 * 
 * Node 提供 Stream 模式读写数据，特点是一次只处理数据的一部分，数据分成一块块依次处理，就好像“数据流”一样
 * 
 * 使用Promise.race()函数，可以判断这三个事件之中哪一个最先发生，只有当data事件最先发生时，才进入下一个数据块的处理
 * 
 * 对于每个数据块都使用stream.once方法，在data、end、error三个事件上添加一次性回调函数。
 * 
 * 变量res只有在data事件发生时才有值，然后累加每个数据块之中valjean这个词出现的次数
 */

const co = require('co');  
const fs = require('fs');

const stream = fs.createReadStream('./les_miserables.txt');
let valjeanCount = 0;

co(function*() {
    while(true) {
        const res = yield Promise.race([
            new Promise(resolve => stream.once('data', resolve)),
            new Promise(resolve => stream.once('end', resolve)),
            new Promise((resolve, reject) => stream.once('error', reject))
        ]);
        if (!res) {
           break;
        }
        stream.removeAllListeners('data');
        stream.removeAllListeners('end');
        stream.removeAllListeners('error');
        valjeanCount += (res.toString().match(/valjean/ig) || []).length;
    }
    console.log('count:', valjeanCount); // count: 1120
});