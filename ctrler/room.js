// ctrler room
var model = require('../models'),
    room = model.room;

// 创建房间
exports.create = function(baby,master,cb) {
  baby.user = [];
  baby.user.push(master._id);
  var baby = new room(baby);
  baby.save(function(err){
    if (!err) {
      cb(baby._id);
    } else {
      console.log(err);
    }
  });
}

// 删除和回收房间
exports.remove = function(id,cb) {
  room.findByIdAndRemove(id,function(err){
    cb(id)
  });
}

// 查询最新的房号
exports.last = function(cb) {
  room.findOne({}).sort('-createBy').exec(function(err,r){
    if (!err) {
      cb(r);
    } else {
      console.log(err)
    }
  })
}

// 通过公开的房间号码查询房间信息
exports.query = function(openid,cb) {
  room.findOne({
    openid: openid
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

// 通过公开的房间id查询
exports.queryById = function(id,cb) {
  room.findById(id).exec(function(err,u){
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

// 查询当前总服务器的房间状况
exports.stat = function(open,cb) {
  if (typeof(open) == 'boolean') {
    room.count({
      open: open
    },function(err,count){
      if (!err) {
        cb(count)
      } else {
        console.log(err)
      }
    })
  } else {
    room.count({},function(err,count){
      if (!err) {
        cb(count)
      }
    })
  }
}

// 加入房间
// todo: 这里写完后也应该联动在用户的数据表里存上他加入的房间。
exports.join = function(userID,roomID,cb) {
    exports.query(roomID,function(r){
      if (r) {
        if (r.user.indexOf(userID) > -1) {
          // 如果该用户已经在这个房间里
          cb('exist')
        } else {
          // 如果该用户没有在这个房间里，添加到房间并且写下记录。
          var players = r.user;
          if (players.length < r.limited) {
            r.user.push(userID);
            r.save(function(err){
              if(!err) {
                cb(r)
              } else {
                console.log(err)
              }
            })
          } else {
            cb('full')
          }
        }
      } else {
        cb(null)
      }
    })
}