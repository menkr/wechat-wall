## Menkr Wechat Wall
==========

基于微信公众平台的微信墙后台程序

### 使用以下技术构建

- Node
- Express 
- wechat `npm install wechat`

### 如何安装

#### 使用Git下载

`git clone https://github.com/Menkr/WechatWall.git`
`cd WechatWall`
`node app`

#### 使用Npm安装

`npm install wechat-wall`
`cd node_modules/wechat-wall`
`node app`

### 如何配置

#### 修改配置文件

- `url` 约定了微信POST过来的接口地址，如果你在微信填的是 `http://yoursite.com/abc` 那么这里就应该填写 `/abc`。
- `token` 填入你的weixin token `(String)`
- `autoRefresh` 是否开启自动刷新 `(true | false)`，默认`true`
- `delay` 自动刷新的时间 `(Number)`，默认为 2（表示2分钟）

填入以上配置项之后，将config-sample.js修改为config.js

### Roadmap -> 0.1.0

- `[ ]` 将配置项做成命令行配置
- `[ ]` 针对多个事件的管理和用户墙数据的分析设计高级版本功能和web界面