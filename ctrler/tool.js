// ctrler tool

var model = require('../models'),
    tool = model.tool;

// 新建一个道具
exports.create = function(baby,cb) {
  var baby = new tool(baby);
  baby.save(function(err){
    if (!err) {
      cb(baby._id);
    }
  });
}

// 更新道具信息
exports.update = function(id,body,cb) {
  tool.findByIdAndUpdate(id,body,function(err){
    if (!err) {
      cb(id)
    }
  })
}

// 删除一个道具
exports.remove = function(id) {
  // 删除完这个用户之后，要联动删除在用户组里的记录才行
  tool.findByIdAndRemove(id,function(err){
    cb(id)
  });
}

// 根据顺序返回一个道具的细节
exports.query = function(index,cb) {
  tool.findOne({}).skip(index - 1).exec(function(err,t){
    if (!err) {
      cb(t)
    } else {
      console.log(err)
    }
  })
}

// 随机选择一个道具
exports.gen = function(cb) {
  tool.count({},function(err,count){
    if (!err) {
      if (count != 0) {
        var n = Math.random()*count;
        n = parseInt(n);
        exports.query(n,function(t){
          cb(t);
        })
      } else {
        cb(null)
      }
    } else {
      console.log(err);
    }
  });
}