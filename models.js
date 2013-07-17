/**
 * @brief: 数据库模型
 * @author [turingou]
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = mongoose.createConnection('localhost', 'darkroom');

// 房间
var roomModel = new mongoose.Schema({
  limited: Number,
  open: {
    type: Boolean,
    default: true
  },
  openid: {
    type: Number,
    unique: true
  },
  createBy: {
    type: Date,
    default: new Date()
  },
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
});

// 用户
var userModel = new mongoose.Schema({
  FromUserName: String,
  location: String,
  avatar: String,
  score: Number,
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: 'room'
  }],
  tools: [{
    type: Schema.Types.ObjectId,
    ref: 'tool'
  }],
  createdBy: {
    type: Date,
    default: new Date()
  }
});

// 道具
var toolModel = new mongoose.Schema({
  name: String,
  power: Number,
  // 是否是关键道具
  key: Boolean
});

exports.room = db.model('room', roomModel);
exports.user = db.model('user', userModel);
exports.tool = db.model('tool', toolModel);