/**
 * 1、语法上，Generator 函数是一个状态机，封装了多个内部状态
 * 
 * 2、Generator 函数除了状态机，还是一个遍历器对象生成函数，
 * 执行 Generator 函数会返回一个遍历器对象，
 * 返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态
 * 
 * 3、有两个特征：
 * 一是，function关键字与函数名之间有一个星号；
 * 二是，函数体内部使用yield表达式，定义不同的内部状态
 * 
 * 4、调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，
 * 而是一个指向内部状态的指针对象，
 * 也就是上一章介绍的遍历器对象（Iterator Object）
 * 
 * 5、下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。
 * 也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，
 * 直到遇到下一个yield表达式（或return语句）为止
 * 
 * 6、只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。
 * yield表达式就是暂停标志
 * 
 * 7、遍历器对象的next方法的运行逻辑如下：

    （1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。

    （2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。

    （3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。

    （4）如果该函数没有return语句，则返回的对象的value属性值为undefined。
 * 
 * 8、从另一个角度看，也可以说 Generator 生成了一系列的值，
 * 这也就是它的名称的来历（英语中，generator 这个词是“生成器”的意思
 * 
 * 9、一个普通函数中使用yield表达式，结果产生一个句法错误
 * 类似 forEach方法的参数是一个普通函数，
 * 但是在里面使用了yield表达式（这个函数里面还使用了yield*表达式，详细介绍见后文，
 * 故报错
 * 
 * 10、yield表达式如果用在另一个表达式之中，必须放在圆括号里面
 * 
 * 11、yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号
 * 
 * 12、Generator 函数执行后，返回一个遍历器对象。
 * 该对象本身也具有Symbol.iterator属性，执行后返回自身
 * 
 * 由于 Generator 函数就是遍历器生成函数，
 * 因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口
 * 
 * 13、yield表达式本身没有返回值，或者说总是返回undefined。
 * next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
 * 
 * 14、Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的
 * 
 * 15、通过next方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值
 * 
 * 16、for...of循环可以自动遍历 Generator 函数时生成的Iterator对象，且此时不再需要调用next方法。
 * 
 * 17、一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象
 * 改next()步骤依然返回值，但是 for...of 不会输出该次值,
 * 即，Iterator接口遍历时，仅输出done:false 时的 value
 * 
 * 18、调用遍历器接口进行运算的  for...of 、扩展运算符(...)、解构赋值、Array.from() 
 * 
 * 19、Generator 函数返回的遍历器对象，都有一个throw方法，
 * 可以在函数体外抛出错误，然后在 Generator 函数体内捕获
 * 
 * 20、throw()方法可以接受一个参数，该参数会被catch语句接收，建议抛出Error对象的实例。
 * 
 * 21、不要混淆遍历器对象的throw方法和全局的throw命令，后者只能被函数体外的catch语句捕获
 * 
 * 22、如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获
 * 
 * 23、如果 Generator 函数内部和外部，都没有部署try...catch代码块，那么程序将报错，直接中断执行。
 * 
 * 24、throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。
 * 
 *      因为第一次执行next方法，等同于启动执行 Generator 函数的内部代码，
 *      否则 Generator 函数还没有开始执行，这时throw方法抛错只可能抛出在函数外部
 * 
 * 25、throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法。
 * 
 * 26、多个yield表达式，可以只用一个try...catch代码块来捕获错误
 * 
 * 27、Generator 函数体外抛出的错误，可以在函数体内捕获；
 * 反过来，Generator 函数体内抛出的错误，也可以被函数体外的catch捕获。
 * 
 * 28、一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。
 * 如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象，
 * 即 JavaScript 引擎认为这个 Generator 已经运行结束了。
 * 
 * 29、Generator 函数返回的遍历器对象，还有一个return方法，
 * 可以返回给定的值，并且终结遍历 Generator 函数
 * 
 *      对比抛出错误未被内部捕获，强制结束 Generator 函数遍历，
 *      return()方法，手动结束 Generator函数遍历
 * 
 * 30、如果return方法调用时，不提供参数，则返回值的value属性为undefined；
 * 若提供参数，value对应值为所提供的参数
 * 
 * 31、如果 Generator 函数内部有try...finally代码块，
 * 当执行到try块中内容时，
 * 若调用return方法后，则跳转到finally代码块中的内容并开始执行，
 * 然后等到finally代码块执行完，
 * 
 * 32、yield*表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数
 *  
 *      从语法角度看，如果yield表达式后面跟的是一个遍历器对象，
 *      需要在yield表达式后面加上星号，表明它返回的是一个遍历器对象
 * 
 * 33、yield*后面的 Generator 函数（没有return语句时），
 *     等同于在 Generator 函数内部，部署一个for...of循环
 * 
 * 34、实际上，任何数据结构只要有 Iterator 接口，就可以被yield*遍历。
 * 
 * 
 * 
 */


/**
 * 与Iterator接口的关系
 * 
 * Iterator接口 即 拥有[Symbol.iterator]属性，该属性返回遍历器对象
 * 
 * generator函数 生成遍历器对象
 * 
 * 即，Iterator接口 可以使用自己手写的带有next()方法的对象作为 [Symbol.iterator]属性返回的对象，
 *                  或 使用generator函数，生成可用的遍历器对象，
 *                  自带相应next()、return()、throw()方法
 */
let myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1
    yield 2
    yield 3
};
[...myIterable]

/**
 * 如果想要第一次调用next方法时，就能够输入值，可以在 Generator 函数外面再包一层。
 */
function wrapper(generatorFunction) {
    return function(...args){
        let generatorObject = generatorFunction(...args)
        generatorObject.next()
        return generatorObject
    }
}

const wrapped = wrapper(function* (){
    console.log(`first input: ${yield}`)
    return 'DONE'
})

wrapped().next('hello!')


/**
 * 利用Generator函数 和 for...of 循环，实现斐波那契数列
 */

function* fibonacci(){
    let [prev, curr] = [0, 1]
    for(;;){
        yield curr
        [prev, curr] = [curr, prev + curr]
    }
}

for(let n of fibonacci()){
    if(n > 1000) break
    console.log(n)
}

/**
 * 通过 Generator 函数为任意对象加上遍历接口
 * 利用for...of循环，可以写出遍历任意对象（object）的方法
 */

function* objectEntries(obj){
    let propKeys = Reflect.ownKeys(obj)

    for(let propKey of propKeys){
        yield [propKey, obj[propKey]]
    }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}

/**
 * 或者 改写组件 Object的[Symbol.iterator]属性
 */

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = function* (){
    let propKeys = Object.keys(this)

    for(let propKey of propKeys){
        yield [propKey, this[propKey]]
    }
}

for (let [key, value] of jane) {
    console.log(`${key}: ${value}`);
}

[...jane]

/**
 * 或者 自定义 [Symbol.iterator]属性返回的遍历器对象的 next()方法
 */

jane[Symbol.iterator] = function(){
	var self = this
	let a = 0
	return {
		next(){
		    let propEntries = Object.entries(self)
			if(a < propEntries.length){
				
				return {
					done: false,
					value: propEntries[a++]
                }
			} else {
				return {
					done: true
				}
            }
        },
        return(){
            //遍历器接口调用 提前结束(break...) 或 抛出错误时调用
            return {done: true}
        }
	}
}

/**
 * yield*
 */

function* inner(){
    yield 'hello'
}

function* outer(){
    yield 'open'
    yield* inner()
    yield 'close'
}

var gen = outer()
gen.next().value //open
gen.next().value //hello
gen.next().value //close

/**
 * 如果被代理的 Generator 函数有return语句，那么就可以向代理它的 Generator 函数返回数据
 */

function* foo() {
    yield 2;
    yield 3;
    return "foo";
  }
  
  function* bar() {
    yield 1;
    var v = yield* foo();
    console.log("v: " + v);
    yield 4;
  }
  
  var it = bar();
  
  it.next()
  // {value: 1, done: false}
  it.next()
  // {value: 2, done: false}
  it.next()
  // {value: 3, done: false}
  it.next();
  // "v: foo"
  // {value: 4, done: false}
  it.next()
  // {value: undefined, done: true}


/**
 * yield*命令可以很方便地取出嵌套数组的所有成员
 */

function* iterTree(tree) {
    if (Array.isArray(tree)) {
      for(let i=0; i < tree.length; i++) {
        yield* iterTree(tree[i]);
      }
    } else {
      yield tree;
    }
  }
  
  const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];
  
  for(let x of iterTree(tree)) {
    console.log(x);
  }
  // a
  // b
  // c
  // d
  // e 

/**
 * 使用 yield* 语句遍历完全二叉树
 */

// 下面是二叉树的构造函数，三个参数分别是左树、当前节点和右树
function Tree(left, label, right){
    this.left = left
    this.label = label
    this.right = right
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(){
    if(t){
        yield* inorder(t.left)
        yield t.label
        yield* inorder(t.right)
    }
}

//生成二叉树
function make(array){
    //判断是否为叶节点
    if(array.length === 1) return new Tree(null, array[0], null)
    return new Tree(make(array[0]), array[1], make(array[2]))
}
let tree = make([[['a'], 'b', ['c']],'d',[['e'],'f',['g']]])

//遍历二叉树
var result = []
for(let node of inorder(tree)){
    result.push(node)
}

/**
 * 1、Generator 函数总是返回一个遍历器，
 * ES6 规定这个遍历器是 Generator 函数的实例，
 * 也继承了 Generator 函数的prototype对象上的方法。
 * 
 * 2、如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象
 * 
 * 3、Generator 函数也不能跟new命令一起用，会报错
 * 
 */

 /**
  * 让 Generator 函数返回一个正常的对象实例，既可以用next方法，又可以获得正常的this
  * 
  * 将 generator函数 的this对象，绑定到 generator函数 gen.prototype
  * 
  * 将其改成构造函数，此时，返回一个 遍历器对象，该遍历器对象 继承 gen.prototype 所拥有的属性
  */

function* gen() {
    this.a = 1;
    yield this.b = 2
    yield this.c = 3
}

function F(){
    return gen.call(gen.prototype)
}

var f = new F()

f.next()

f.a

/**
 * Generator 与协程
 */

/**
 * 1、这种可以并行执行、交换执行权的线程（或函数），就称为协程
 * 
 * 2、协程是以多占用内存为代价，实现多任务的并行
 * 
 * 3、同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态
 * 
 * 4、普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定(操作系统分配);
 *    但是协程是合作式的，执行权由协程自己分配
 * 
 * 5、由于 JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。
 * 这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。
 * 不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束
 * 
 * 6、Generator 函数被称为“半协程”（semi-coroutine），
 * 意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数
 * 
 * 7、如果是完全执行的协程，任何函数都可以让暂停的协程继续执行
 * 
 * 8、如果将 Generator 函数当作协程，
 * 完全可以将多个需要互相协作的任务写成 Generator 函数，它们之间使用yield表达式交换控制权
 * 
 * 9、传统的“子例程”（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数
 * 
 * 10、协程与其不同，多个线程（单线程情况下，即多个函数）可以并行执行，
 * 但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），
 * 线程（或函数）之间可以交换执行权
 */

/**
 * Generator 与上下文
 * 
 * 1、JavaScript 代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象
 * 
 * 2、执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，
 * 由此形成一个上下文环境的堆栈（context stack）
 * 
 * 3、这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，
 * 然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。
 * 
 * 4、Generator 函数不是这样，它执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。
 * 等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。
 */

/**
 * Generator 可以暂停函数执行，返回任意表达式的值
 * 
 * 1、异步操作的同步化表达
 * 
 *        可以把异步操作写在yield表达式里面，到调用next方法时再往后执行
 * 
 * 2、控制流管理
 * 
 * 3、部署Iterator接口
 * 
 * 4、作为数据结构（数组结构）, 对任意表达式，提供类似数组的接口
 */


/**
* 通过Generator 函数部署Ajax操作
*/

function* main(){
    var result = yield request('http://some.url')
    var resp = JSON.parse(result)
    console.log(resp.value)
}

function request(url){
    makeAjaxCall(urll, function(response){
        it.next(response)
    })
}

var it = main()

it.next()

/**
 * Generator 函数逐行读取文本文件
 */

function* numbers(){
    let file = new FileReader('numbers.txt')
    try {
        while(!file.eof){
            yield parseInt(file.readLine(), 10)
        }
    } finally {
        file.close()
    }
}


/**
 * 下面，利用for...of循环会自动依次执行yield命令的特性，提供一种更一般的控制流管理的方法
 * 
 * 未手动调用next
 * 
 * 仅限于同步操作
 */
let steps = [step1, step2, step3]

function* iterateSteps(steps){
    for(let i = 0; i < steps.length; i++){
        let step = steps[i]
        yield step()
    }
}

let jobs = [job1, job2, job3]

function* iterateJobs(jobs){
    for (var i=0; i< jobs.length; i++){
      var job = jobs[i];
      yield* iterateSteps(job.steps);
    }
}

for(var step of iterateJobs(jobs)){
    console.log(step.id)
}

/**
 * `next`/`throw`/`return`三个方法都是让generator恢复执行，效果上的不同在于，
 * `it.next( value )`是将generator里面的yield表达式 *替换* 为一个值，
 * `it.throw( value )`是将yield表达式替换为一个throw语句，
 * `it.return( value )`是将yield表达式替换为一个return语句。
 * 
 * 基于这个理解，generator内部的各种`return`/`throw`行为就按一般情况来预期。
 * 如果`return`/`throw`出现在try内，那么有捕获就捕获，有finally就执行finally；
 * 如果最后`return`/`throw`到了函数外部，那么这个generator自然就变成`complete`状态，而外部caller自然就应该收到返回值或抛出异常
 */