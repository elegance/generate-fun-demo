// 编写函数，让Generator函数自动执行
function runGen(fn: Function) {
    let gen: IterableIterator<any> = fn();
    
    function next(err, data) {
        if (err) throw err;
        let result = gen.next(data);
        if (result.done) return;
        result.value(next);
    }
    next(undefined, undefined);
}


export default runGen;