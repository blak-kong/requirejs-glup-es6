// 在demo.js里使用define，此时该文件为demo模块
define(['jquery'], function($){
    let a = Object.assign({a:1},{})
    console.log(a)
    var demo = {
        init: function(){
            $('.demo').text('我只是个demo');
        }
    }
    return demo;
});