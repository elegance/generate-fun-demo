import fs = require('fs');

const readFile = function (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
};

// 两个yield将函数分为三段
const gen = function* () {
    const f1 = yield readFile('/etc/fstab');

    const f2 = yield readFile('/etc/shells');

    console.log(f1.toString());
    console.log(f2.toString());
};

// 手工执行generator函数，理解执行原理
const g = gen();
g.next().value
    .then((data) => {
        g.next(data).value.then((data) => {
            g.next(data);
            console.log('==============================================勉强的分割线========================================');
        });
    });
// gen有两个yield，将函数分为了3段，我们这里手动执行的时候 则需要执行三次next了


// 哈哈 参照04-gen-flow-auto我们写的自动执行Generator方法，也可以在promise下在写一个
function runGen(fn: Function): Promise<{}> {
    const g:IterableIterator<Promise<{}>> = fn();

    function next(data) {
        let result = g.next(data);
        if (result.done) return result.value;
        result.value.then((data) => next(data));
    }
    return next(undefined);
}

console.log('发现个问题，想在这样的代码中打印出一个想要的分割线也是不简单的。。。。。 好像不是很容易出现在我想要出现的位置。');
runGen(gen);