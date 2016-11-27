import fetch from 'node-fetch';
// import * as fetch from 'node-fetch';
// import fetch = require('node-fetch');

function* gen() {
    console.log('go..');
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);
    // --鸿沟..........

    console.log(result.bio); // 注意： 这里 的result 其实不是上面的result，而是外部第二次调用`next`方法传入的参数
}

var g = gen();
var result = g.next(); // 返回： {value: Promise, done: false}

result.value
    .then(data => data.json())
    .then(data => g.next(data));


