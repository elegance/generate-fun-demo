// Type definitions for co
// Project: https://github.com/tj/co
// Definitions by: wxqqh <https://github.com/wxqqh/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "co" {
    function co(fn: Function): Promise<any>;
    module co {
        function wrap(fn: Function): () => Promise<any>;
    }
    export = co;
}