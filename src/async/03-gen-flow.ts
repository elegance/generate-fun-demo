import fs = require('fs');
import thunkify = require('thunkify');

let readFile = thunkify(fs.readFile);

// 两个yield 将函数体内分成三段
let gen = function* () {
    let r1 = yield readFile('/etc/fstab');

    console.log(r1.toString());
    var r2 = yield readFile('/etc/shells');

    console.log(r2.toString());
    console.log('============================================我是一条分割线=======================================');
};


// 手动 执行上面的Generator函数
let g = gen();
let r1 = g.next();

r1.value((err, data) => {
    if (err) throw err;
    let r2 = g.next(data);  // 此处的next一个是传入了 data 作为上面的r1，console.log(r1.toString())， 然后再执行到下一个yield后的分号

    r2.value((err, data) => {
        if (err) throw err;
        g.next(data);
    });
});
