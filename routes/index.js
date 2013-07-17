var wechat = require('wechat'),
    user = require('../ctrler/user'),
    message = require('../ctrler/message');

var config = require('../config');

/*
 * 文字路由
 * 只接受文字信息
 */
var resTpl = [
  config.event.done,
  '—— 来自活动『' + config.event.title + '』'
].join('\n');

module.exports = wechat(config.token, wechat.text(function(msg, req, res, next) {

  // 查询数据库中是否已经存了这个用户
  user.query(msg.FromUserName, function(u) {
    if (u) {
      // 如果已经注册
      if (!req.wxsession.uid) {
        req.wxsession.uid = u._id;
      }
      // 保存这个用户的消息
      message.save(req.wxsession.uid,msg,function(mid){
        res.reply(resTpl);
      });

    } else {
      // 第一次访问,开始新建用户
      user.create({
        FromUserName: msg.FromUserName
      }, function(babyID) {
        req.wxsession.uid = babyID;
        // 保存这个用户的消息
        message.save(req.wxsession.uid,msg,function(mid){
          res.reply(resTpl);          
        });
      })
    }
  });
  
}))