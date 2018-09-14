/**
 * async Generator函数的语法糖
 * 
 * 将 Generator 函数的 * 换成 async，yield 换成 await
 * 
 * 1、内置执行器，不需要调用 co 模块
 * 
 * 2、更好的语义
 * 
 * 3、更广的适用性  await 命令后面，可以使Promise对象 和原始类型的值
 * 
 * 4、返回值是Promise，可以通过then方法指定下一步操作  （Generator函数的返回值是Iterator对象）
 * 
 * async 函数完全可以看作多个异步操作，包装成一个Promise 对象，await 命令是内部then命令的语法糖
 * 
 */

/**
 * async 函数返回一个Promise 对象，可以使用then方法添加回调函数。
 * 当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句
 * 
 */

/**
 * 多种使用形式
 */

// 函数声明
async function foo(){}

// 函数表达式
const foo = async function(){}

// 对象的方法
let obj = { async function(){} }

//class 的方法
class Storage {
    constructor(){
        this.cachePromise = caches.open('avatars')
    }

    async getAvatar(name) {
        const cache = await this.cachePromise
        return cache.match(`/avatars/${name}.jpg`)
    }
}

const storage = new Storage()
storage.getAvatar('jake').then()

//箭头函数
const foo = async () => {}