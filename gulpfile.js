// 引入gulp和gulp插件
var gulp = require('gulp'),
    rev = require('gulp-rev'),                           // 生成版本号映射
    revCollector = require('gulp-rev-collector'),        // 添加版本号
    jshint = require('gulp-jshint'),		 		     // js语法检查
    htmlmin = require('gulp-htmlmin'),                   // 压缩html
    uglify = require("gulp-uglify"),                     // 压缩js
    imageMin = require("gulp-imagemin"),                 // 压缩图片
    cssmin = require('gulp-clean-css'),					 // 压缩css
    csso = require('gulp-csso'),						 // 合并css属性
	csslint = require('gulp-csslint'),					 // css语法检查
	autoprefixer = require('gulp-autoprefixer'),		 // 添加浏览器前缀
	cache = require('gulp-cache'),						 // 缓存处理
	replace = require('gulp-replace'),					 // 替换路径
    clean = require('gulp-clean'),						 // 清理文目标文件夹
    babel = require("gulp-babel"),
    requirejsOptimize = require('gulp-requirejs-optimize'), // require打包压缩(引入模块打包到js，减少引入)
    connect = require('gulp-connect'), // 热更新
    concat = require("gulp-concat") // 合并js

    // gulp-rev-append

// rev.mt_versions.v = '2019-06-18-1348';  // 此处必须为基本类型

// 定义css、js源文件路径，替换文件版本的路径，及替换成功后的存放路径 
var cssSrc = 'css/*.css',
    jsSrc = 'js/*.js',
    htmlSrc = 'src/pages/*.html'

// CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射 
gulp.task('revCss', function() {
     gulp.src(cssSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射 
gulp.task('revJs', function() {
     gulp.src(jsSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});


// 压缩 css 文件
// 在命令行使用 gulp csscompress 启动此任务
gulp.task('csscompress', function() {
    // 1. 找到文件
    gulp.src('css/*.css')
        // 2. 压缩文件
        .pipe(cssmin())
        .pipe(autoprefixer())
        .pipe(csslint())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/css'));
})

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('jscompress', function() {
    // 1. 找到文件
    gulp.src('js/*.js')
        // 3. 运行babel(注意，babel只转换语法，不转换api)
        .pipe(babel())
        // 3. 另存压缩后的文件
        .pipe(uglify())
        .pipe(jshint())
        .pipe(gulp.dest('dist/js'));
});

// 合并js
gulp.task("requirejs", function() {
     gulp.src("js/*.js")
            
           .pipe(
                requirejsOptimize({
                    optimize: 'none',
                    // 主文件配置：根据此文件配置合并打包
                    mainConfigFile: 'js/require_config.js'
                }))
            .pipe(gulp.dest('dist/js/build'))
})

// 压缩图片
gulp.task('imageMin', function () {
     gulp.src('images/*.{png,jpg}')
        .pipe(cache(imageMin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })
        ))
        .pipe(gulp.dest('dist/images'));
});

// 压缩icon
gulp.task('icon', function () {
     gulp.src('icon/*.{png,jpg}')
        // 不作处理 直接复制黏贴
        .pipe(gulp.dest('dist/icon'));
});

// 重写URL
gulp.task('replaceURL', function(){
    gulp.src(['dist/*.html'])
        .pipe(replace('../css', '/css'))
        .pipe(replace('../js', '/js'))
        .pipe(replace('/src', '/'))
        .pipe(gulp.dest('dist'));
        
    gulp.src(['dist/css/*.css'])
        .pipe(replace('../css', '/css'))
        .pipe(replace('../js', '/js'))
        .pipe(replace('/src', '/'))
        .pipe(gulp.dest('dist/css'));
        
    gulp.src(['dist/js/*.js'])
        .pipe(replace('../css', '/css'))
        .pipe(replace('../js', '/js'))
        .pipe(replace('/src', '/'))
        .pipe(gulp.dest('dist/js'));
    
});

//Html替换css、js文件版本-----开发页面
gulp.task('revHtml', function() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
 gulp.src(['rev/**/*.json', htmlSrc]) // 这里的View/*.html是项目html文件路径，如果gulpfile.js和html文件同在一级目录下，修改为return;
    .pipe(revCollector())
    .pipe(htmlmin(options)) // html压缩
    .pipe(gulp.dest('dist/pages/'));// 注意这里是生成的新的html文件，如果设置为你的项目html文件所在文件夹，会覆盖旧的html文件，若上面的template/*.html修改了，这里也要相应修改;----不能把源文件覆盖！否则会出现bug，源文件不断被替换，版本号越来越多！
});

//Html替换css、js文件版本-----根目录页面
gulp.task('revRootHtml', function() {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript" 
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS 
    };
   gulp.src(['rev/{css,img,js}/*.json', 'src/*.html']) // 这里的View/*.html是项目html文件路径，如果gulpfile.js和html文件同在一级目录下，修改为return;
    .pipe(revCollector())
    .pipe(htmlmin(options)) // html压缩 
    .pipe(gulp.dest('dist/'));
});


//监控文件变化
gulp.task('watch', function() {
    gulp.watch([cssSrc, jsSrc, htmlSrc, 'js/*.js', '*.html']);
});

gulp.task('connect',function(){
    connect.server({
        root: 'dist',//根目录
        // ip:'192.168.11.62',//默认localhost:8080
        livereload: true,//自动更新
        port: 8089
    })
})

gulp.task("dev", gulp.series(gulp.parallel('connect','revCss', 'revJs','requirejs','csscompress','jscompress','imageMin','icon','revHtml','revRootHtml','replaceURL','watch')))