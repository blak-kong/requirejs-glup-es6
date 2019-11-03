// 设置模块
require.config({
    path: {
        "jquery": "./lib/jquery.min",
        "math": "./math",
        "demo": "/demo"
    },
    // shim属性，专门用来配置不兼容AMD规范的模块。
    // 具体来说，每个模块要定义（1）exports值（输出的变量名），表明这个模块外部调用时的名称；（2）deps数组，表明该模块的依赖性。
    shim: {
        "jquery": {
            exports: '$'
        }
    }
}); 

require(['math', 'demo'], function(math, demo){
    math.add(3,53);
    demo.init();
});