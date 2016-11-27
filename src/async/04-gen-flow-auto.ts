import genRun from './04-gen-run';
import thunkify = require('thunkify');
import fs = require('fs');

let readFile = thunkify(fs.readFile);

// 这里就像编写同步代码一样 来读取文件了
let gen = function* () {
    let r1 = yield readFile('/etc/fstab');
    console.log(r1.toString());
    var r2 = yield readFile('/etc/shells');
    console.log(r2.toString());
};

// 调用
genRun(gen);