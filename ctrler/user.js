// ctrler user

var model = require('../models'),
    user = model.user,
    tool = model.tool;

// 新建一个用户
exports.create = function(baby,cb) {
  var baby = new user(baby);
  baby.save(function(err){
    if (!err) {
      cb(baby._id);
    }
  });
}

// 更新用户信息
exports.update = function(id,body,cb) {
  user.findByIdAndUpdate(id,body,function(err){
    if (!err) {
      cb(id)
    }
  })
}

// 删除一个用户
exports.remove = function(id) {
  // 删除完这个用户之后，要联动删除在用户组里的记录才行
  user.findByIdAndRemove(id,function(err){
    cb(id)
  });
}

// 从微信用户名（fake）查询一个用户的信息
exports.query = function(username,cb) {
  user.findOne({
    FromUserName: username
  }).exec(function(err,u){
    if (!err) {
      if (u) {
        cb(u)
      } else {
        cb(null)
      }
    } else {
      console.log(err)
    }
  })
}

// 用户拿到新的道具
exports.addTool = function(username,toolid,cb) {
  exports.query(username,function(u){
    u.tools.push(toolid);
    u.save(function(err){
      if (!err) {
        cb(toolid)
      } else {
        console.log(err)
      }
    })
  })
}