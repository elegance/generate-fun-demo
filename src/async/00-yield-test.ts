function* a() { yield 1; yield 2; yield 3; }
function* b() { yield 4; yield* a(); yield 5; }
function* c() { yield 6; yield* b(); yield 7; }

for (let x of c()) console.log(x)    // 你觉得会输出什么？先自己试试看