### `Generator` 函数是”协成“在`ES6`的实现，最大的特点就是可以交出函数的执行权（暂停执行）。

#### 理解的三个特点：
1. 可以暂停可恢复执行，这是它能封装异步任务的根本原因
2. 函数体内外的数据交换，`next`的返回值是函数向外的输出，next方法可接收参数，这就是向函数内输入
3. 错误处理机制

关于`Generator`函数的初步理解，以及其暂停，可恢复理解的例子：
```javascript
function* gen(x) {
    console.log(1);
    console.log(2);

    var y = yield x + 2;

    console.log(3);
    console.log(4);
    return y;
}

var g = gen(1); //          (第一步)
g.next();       // 1        (第二步)
                // 2
                // {value: 3, done: false}

g.next();       // {value: undefined, done: true} (第三步)         
```
从上面的例子，可以看出以下几点:
. “第一步”调用`Generator`函数，不同于普通函数，它不会立即执行(没有输出1,2)，而是返回一个内部指针(遍历器)g;
. “第二步”调用`g.next()`时，移动内部指针，执行到第一个异步任务后。（可以把 `yield`后的那个分号`;`理解为一个断点）
. 每次调用`next()`方法会返回一个对象，`value`是函数当前的返回值，`done`表示函数是否执行完毕。

关于输入输出理解的例子:
```javascript
function* gen(x) {
    var y = yield x + 2;
    // 分号";"后面有一条鸿沟，下面的y变量其实取到的不是这里的返回值了，而是传入的参数，☆：如果没有传入参数y就成为了undefined了
    // yield 前面被赋值的变量，就像是这条鸿沟的一座桥梁，返回yield后面表达式的值，接收外部下次next()传入的参数。

    console.log(y); //这里的y是不能接收
    return y;
}

var g = gen(1);
g.next();   // {value: 3, done: false}
g.next(2);  // 2
            // {value: 2, done: true}
```

关于错误处理机制的例子：
```javascript
function* gen(x) {
    try{
        var y = yield x + 2;
    } catch(e) {
        console.error(e);
    }
    return y;
}

var g = gen(1);
g.next();
g.throw('出错啦！');
```
`g.throw`在函数体外，用指针对象的`throw`方法抛出错误，可以在函数体内`catch`捕获，出错的代码，与处理错误的代码实现了空间和时间上的分离，这对于一部编程很重要。

### 关于ts import node包的几种方式， 注意看几种的差别
```javascript
// node：
var fetch = require('node-fetch');   // 使用时：fetch(url).then();

// ts:
import * as fetch from 'node-fetch'; // 使用时：fetch.fetch(url).then();
import fetch = require('node-fetch'); // 使用时：fetch.fetch(url).then();

import fetch from 'node-fetch'; // 使用时：fetch(url).then();

```

### Thunk函数
说到这个函数，就得提下编程语言刚起步时，编译器怎么写比较好，一个争论的焦点是“求值策略”，即函数的参数到底该何时求值。
之前有简单的学习过`scala`，求值策略分两种：
1. Call by value
2. Call by name

理解例子：
```javascript
function f(m) {
    return m * 2;
}

var x = 2;
f(x + 2); // 关键其实是理解这里：x + 2 这个表达式，代表作上面定义函数f的形参m，争论点在于：m 应该在这里求值，还是应该在函数定义的内部使用时再求值。
```
上面的代码,在按`Call by value`策略时(C语言就采用了这种策略):
```javascript
f(x + 2); 
// 等同于
f(3);   //这个求值是发生在 f函数外部
```
如果是在`Call by name`策略时(Hashkell采用了这种策略)：
```javascript
f(x + 2);
// 等同于
(x + 2) * 2;   //这个是发生在 函数f内部
```

哪一种策略比较好呢？回答是各有利弊。传值策略比较简单，但是对参数求值时，实际上没有用到这个参数时，可能造成性能损失。
传名策略有可能对同名参数的多次使用而多次求值，也有可能造成性能损失。

#### Thunk函数的定义
`Call by name`的实现往往是将参数放到一个**临时函数**中，在将这个参数传入函数体。这个临时函数就叫做`Thunk`函数。

#### javascript语言的Thunk函数
`javascript`语言的求值本事是采用的`Call by value`。在`javascript`语言中，`Thunk`函数替换的不是表达式，而是多参数函数，将其替换为单参数的版本，且只接收
回调函数作为参数。
```javascript
// 正常版本的readFile(多参数)
fs.readFile(fileName, callback);

// Thunk版本的readFile(单参数版本)，其实这类似一个由高阶函数到柯里化函数
var Thunk = function (fileName) {
    return function(callback) {  //函数里面返回函数，这其实就是高阶函数了，
        return fs.readFile(fileName, callback);
    };
};

var readXXFileThunk = Thunk('XX');  // 这里我特意加上了XX，因为得到的这个函数 只能用来读XX这个文件了

readXXFileThunk(callback);
```

另外我的理解这个有点类似高阶到柯里化的例子：
```javascript
var Thunk = function(power) {
    return function(num) {
        return Math.pow(num, power);
    };
};    

var square = Thunk(2); // 得到一个求平方的函数
var cube = Thunk(3); // 得到一个求立方的函数

square(2);  // ==> 4
cube(2);    // ==> 8
```

#### javascript多参数函数的Thunk转换(参数要有回调函数)
// ES5:
```javascript
var Thunk = function(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments);

        return function(callback) {
            args.push(callback);
            return fn.apply(this, args);
        };
    }
};

// ES6:
var Thunk = function(fn) {
    return function(...args) {
        return function(callback) {
            fn.call(this, ...args, callback)
        };
    };
};
```
### Generator 函数流程管理
讲了这么久的`Thunk`函数，那它有什么用你？回答是以前确实没什么用，但是ES6有了`Generator`函数后，`Thunk`函数可以用于`Generator`的自动流程管理。


### async 函数
`ES7`提供了`async`函数，使得异步操作变得更加方便。`async`函数其实就是`Generator`函数的语法糖。
对比效果：
```javascript
let gen = function* () {
   let f1 = yield readFile('/etc/fstab'); 
   let f2 = yield readFile('/etc/shells'); 
   console.log(f1.toString());
   console.log(f2.toString());
};

let asyncReadFile = async function() {
    let f1 = await readFile('/etc/fstab');
    let f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
```
语法上可以看出`async`函数就是将`Generator`函数的星号`*`替换成`async`,将`yield`替换为`await`，仅此而已。
另外`async`函数的几点改进：
1. 内置执行器。`Generator`函数执行依靠执行其，所以才有了`co`模块，而`async`自带了执行器。
2. 更好的语义，`async`表示函数里面有异步操作，`await`表示紧跟在后面的表达式需要等待结果
3. 更广的适用性，`co`模块的约定，`yield`命令后面只能是`Thunk`函数或`Promise`函数，而`async`函数的`await`后面可以是Promise对象和原始类型的值
4. 返回值是`Promise`,这比`Generator`的`Iterator`方便多了。你可以用`then`方法指定下一步操作了
