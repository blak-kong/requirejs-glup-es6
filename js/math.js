// 在math.js里使用define，此时该文件为math模块
// 引入别名js，并声明为$
define(['jquery'], function($){
    var math = {
        add: function(i,j){
            $('.math').text(i+j)
        }
    }
    return math;
})