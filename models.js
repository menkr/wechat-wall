/**
 * @brief: 数据库模型
 * @author [turingou]
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.createConnection('localhost', 'wechatwall');

// 参与用户
var userModel = new mongoose.Schema({
  FromUserName: String,
  location: String,
  avatar: String,
  createdBy: {
    type: Date,
    default: new Date()
  },
  msgs: [{
    type: Schema.Types.ObjectId,
    ref: 'msg'
  }]
});

// 单条消息
var msgModel = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  detail: {}
});

exports.user = db.model('user', userModel);
exports.msg = db.model('msg', msgModel);