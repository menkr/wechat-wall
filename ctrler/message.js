// ctrler msg

var model = require('../models'),
    user = require('./user'),
    msg = model.msg;

// 新建一条消息
exports.create = function(baby,cb) {
  var baby = new msg(baby);
  baby.save(function(err){
    if (!err) {
      cb(baby._id);
    }
  });
}

// 保存一条消息并推送到用户那里
exports.save = function(uid,msg,cb) {
  user.queryById(uid,function(u){
    if (u) {
      var user = u;
      exports.create({
        detail: msg,
        user: uid
      },function(mid){
        u.msgs.push(mid);
        u.save(function(err){
          if (!err) {
            cb(u);
          } else {
            console.log(err);
          }
        })
      });
    } else {
      console.log('user not exist!!')
    }
  })
}

// 查询所有的消息
exports.fetch = function(cb) {
  msg.find({}).exec(function(msgs){
    cb(msgs);
  });
}