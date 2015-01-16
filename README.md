## seedprjfrontend ##

[Avalon.js](https://github.com/RubyLouvre/avalon) is a lightweight、high-performance and easy-to-follow javascript MVVM framework.

[Intern.js](http://theintern.io/) is a new testing framework that supports **unit testing**, **behavior testing** and **functional testing**. 

The purpose of this project is, to create a SPA that can run in your browser and mobile environment using an [Avalon.js](https://angularjs.org/) and [cordova](cordova.apache.org) project and the [Gulp.js](http://gulpjs.com/) task runners.

I'm doing this to LEARN. Your feedback and corrections are absolutely welcome!

-----

这是一个javascript前端项目模板。

目的提供一个项目模板，减轻开发环境搭建工作，常用解决方案展示。

此原型项目展示了：
1. 支持cordova、browser应用，即同一套代码可用于桌面浏览器和各类手机应用。
1. 使用avalon MVVM框架
1. 使用cordova 用于移动端
1. 使用requirejs amd模块加载器
1. 使用gulp构建系统
1. 展示了页面切分和逻辑模块划分（html、css、js），及如何根据实际切换模块。适用团队分工合作
1. 页面路由技术，页面转换的有限状态机应用。
1. 支持js、coffee脚本
1. 支持css、less、sass 文件
1. 支持三种应用场景，浏览器，移动app
1. 支持生产环境，即可将js合并压缩成单个js文件，优化css文件，优化html文件
1. 支持DevOps

## 目录说明 ##

~~~
├─src  -------------------- 源码目录
│    ├─main
│    │    └─web ------------- web根目录
│    │        ├───www
│    │        │    ├─css    ---- 公共css、sass、less文件
│    │        │    ├─img    ---- 公共图片、字体、音视频文件
│    │        │    ├─modules
│    │        │    │  └─module1    ---- 模块名，如login等。放置模块的js、coffee、ecs6、html、css、sass、less文件
│    │        │    ├─vendor        ---- 第三方库根目录
│    │        │    │    ├─avalon
│    │        │    │    ├─jquery
│    │        │    │    └─require
│    │        │    └─index.html main.js
│    │        │ 
│    │        └─config.xml  ---- cordova 配置文件
│    │
│    └─test
│         └─web
│
└─target   ---- cordova项目
    └─web ------------- web根目录
       ├─www  ---- 构建输出中间目录
       └─platform ---- cordova项目
~~~

## gulp 构建流说明 ##
1. 创建app目录下cordova项目(recreate 或 cdvcreate，差异cdvcreate不采用src目录下的config.xml文件)
1. 处理main/web目录下资源,并输出到target/web/www目录下
   * 转换coffee和ecs6的js文件
   * 转换sass、less的css文件
   * 转换html、css文件中引用的图片为base64字符串// todo
   * 其它资源文件相对www目录拷贝到target/web/www目录下
   * 资源优化压缩处理，js合并成一个文件，css合并成一个文件
1. 将target/web/www目录下资源拷贝到platform/browser/www目录下，platform/android/ant-build/res/www/目录下（todo）

ios 平台暂时未处理，todo

# 工具
1. 构建工具： [gulp](http://gulpjs.com/)
1. 单元测试和集成测试框架：[intern](http://theintern.io/)
1. mvvm框架：[avalon](https://github.com/RubyLouvre/avalon)
1. 有限状态机框架：[Javascript Finite State Machine](http://javascript.ruanyifeng.com/advanced/fsm.html)
1. android ide：[android-studio](http://developer.android.com/sdk/installing/index.html?pkg=tools)

# 配置说明

## 下载安装nodejs

nodejs 升级方式：卸载旧版本，安装新版本

## 下载安装npm、bower、gulp

**安装**

~~~
npm install npm -g
npm install gulp -g
npm install bower -g
~~~

**升级**

~~~
npm update npm -g
npm update gulp -g
npm update bower -g
~~~

## 获取种子项目或研发项目
fork[seedfrontend](https://github.com/pinghe/seedfrontend.git),clone到本机。
执行项目命令，会自动安装相关插件。

~~~
npm install
~~~

## 安装jdk和android、ant、seleniumserver

1. 安装[jdk](http://java.sun.com)后，设置JAVA_HOME环境变量
1. 安装[adndroid sdk](http://developer.android.com/sdk/index.html)后，设置ANDROID_HOME环境变量
1. 安装[ant](http://ant.apache.org)
1. 设置环境变量 PATH，加入 sdk\platform-tools  sdk\tools ant\bin 三个目录
1. 安装chrome [RemoteLiveReload 插件](https://chrome.google.com/webstore/detail/remotelivereload/jlppknnillhjgiengoigajegdpieppei)
1. 下载[VisGrid](http://www.codoid.com/products/view/2/30). 运行 java -jar VisGrid.jar，创建hub和浏览器节点（chrome、firefox等）
1. 运行android，启动sdk-manager，安装android target。


## 参数配置

### configparam.json
在项目根目录下创建 configparam.json 文件

```json
{
  "localserver": {
    "enabled": false,
    "localPath": "D:/prg/apache-tomcat-8.0.3/webapps/seedprj"
  },
  "sftp": {
    "enabled": false,
    "host": "",
    "port": 22,
    "user": "",
    "pass": "",
    "remotePath": ""
  },
  "proEnv": false
}

```

**proEnv**
>构建用于产品环境，html、css、js将进行合并、优化、压缩。不配这个元素或false，则不进行合并和优化压缩

**localserver**
>web服务器在本地，使用外部web容器，如tomcat等

**sftp**
>web服务器在远程

**nodejs**
>watchsyncapp会启动nodejs webserver。localhost:8888。根路径在 target/web/platforms/browser/www/。

localserver和sftp用于自动发布到外部web服务器。

### package.json

修改package.json, 如：app支持的平台（browser必须保留，如ios、android）、cordova 插件等

## 测试配置
intern的测试相关配置项，都在src/test/intern.js 文件中。参见[配置说明](https://github.com/theintern/intern/wiki/Configuring-Intern)

### 浏览器配置

根据需要设置需要测试的浏览器。

~~~javaScript
environments: [
        {browserName: 'internet explorer', version: '11', platform: 'Windows 8.1'},
        {browserName: 'internet explorer', version: '10', platform: 'Windows 8'},
        {browserName: 'internet explorer', version: '9', platform: 'Windows 7'},
        {browserName: 'firefox', version: '28', platform: ['OS X 10.9', 'Windows 7', 'Linux']},
        {browserName: 'chrome', version: '34', platform: ['OS X 10.9', 'Windows 7', 'Linux']},
        {browserName: 'safari', version: '6', platform: 'OS X 10.8'},
        {browserName: 'safari', version: '7', platform: 'OS X 10.9'}
    ],
~~~

### 测试用例配置
配置功能测试和单元测试套件。

单元测试
>单元测试是运行在nodejs上，仅用于单纯的js测试，不能有操作dom树的相关内容，例如avalon框架不能用于单元测试。（nodejs 没有window对象，无法进行dom操作）

功能测试
>功能测试是运行在浏览器上，模拟用户行为。

~~~javaScript
    // Non-functional test suite(s) to run in each browser
    suites: [/*'unit/login/login'*/],

    // Functional test suite(s) to run in each browser once non-functional tests are completed
    functionalSuites: ['functest/login/login'],
~~~


## 运行准备

启动shell，执行

gulp recreate

## 运行

### 场景一 浏览器测试

启动四个shell

1. gulp watchsynclocal
1. gulp watchtest
1. gulp watchdev
1. java -jar VisGrid.jar

然后编辑修改源文件，将自动进行构建和测试。
也可以不运行gulp watchtest 和 java -jar VisGrid.jar，执行 gulp itest 手动运行测试

### 场景二 外部webserver，浏览器测试

1. gulp watchsync
1. gulp watchtest
1. gulp watchdev
1. java -jar VisGrid.jar

### 场景三 移动app

1. gulp watchapp
1. gulp watchdev

## 命令说明

**clean**
> 删除 target 目录

**cleanwww**
> 删除 target/web/www 目录下内容，target/web/platform/browser/www 和 wwwtmp目录下的内容(www/cordova*.js 和 www/plugins 除外)，target/web/platform/android/ant-build 目录

**recreate**
> 删除target目录，重新创建cordova项目

**cdvcreate**
> 删除target目录，重新创建cordova项目(不使用源码目录下的config.xml文件，而是新建)

**dev**
> 处理html、css、js等

**watchdev**
> 监控html、css、js、img等源文件变化，并自动执行相应命令

**watchsync**
> 监控target/web/www目录下文件变化，并触发同步文件到外部webserver

**watchsynclocal**
> 监控target/web/www目录下文件变化，并触发同步文件到nodejs webserver，target/web/platforms/browser/www/目录。此任务会启动nodejs local webserver（localhost:8888）

**watchapp**
> 监控target/web/config.xml 和 target/web/www目录下文件变化，触发构建app

**watchapprun**
> 监控target/web/config.xml 和 target/web/www目录下文件变化，触发构建app，并部署到通过usb连接的手机上

**default**
> 默认命令是 watchdev
