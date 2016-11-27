/// <reference path="../../ux-typings/ts.d.ts" />

import * as thunkify from 'thunkify';
import fs = require('fs'); 
import co = require('co');

let readFile = thunkify(fs.readFile);


// 引入了co库，你就不用写Generator函数的执行库了
// 像同步编程一样,玩起你的Generator函数吧
let gen = function* () {
    let f1 = yield readFile('/etc/fstab');

    console.log(f1.toString());
    let f2 = yield readFile('/etc/shells');

    console.log(f2.toString());
};
// 理解异步分段执行，以上代码被两个yield分为了三段

co(gen).then(() => console.log('打完收工啦！'));
// 对比我们之前在`04-gen-run`写的`genRun`函数，其实只要在之前的return那里加上 promsie返回 就差不多了。