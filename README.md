## 说明or注意事项

使用gulp打包项目并新增版本号

运行前需要执行以下步骤，与修改内容：

### 1.如何打包

1. npm install

2. 更改node_modules引入的包

#### gulp-rev\index.js
* ------修改版本号

* 找到 manifest[originalFile] = revisionedFile;
 
更新为: manifest[originalFile] = originalFile + '?v='  + new Date().getTime();


#### gulp-rev-collector\index.js

* ------把修改文件名改为：添加版本号
* 40行 path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' )
更新为:  path.basename(json[key]).split('?')[0]

* 
第147 和 172行 regexp: new RegExp( '([\/\\\\\'"])' + pattern, 'g' ), 
更新为: regexp: new RegExp( '([\/\\\\\'"])' + pattern+'(\\?v=\\w{10})?', 'g' ),

#### rev-path\index.js

* 第9行    ${filename}-${hash}${ext}
  更新为   ${filename}${ext}


>gulp dev
