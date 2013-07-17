var sc = require('./scence'),
  room = require('../ctrler/room');

// 正式开始进入游戏模式
exports.home = function(msg, user, req, res) {
  // 在这里判断游戏的场景
  var game = req.wxsession.game;

  console.log('<!-- game -->')
  console.log(game);

  room.queryById(game.door, function(r) {
    if (r.open) {
      req.wxsession.sc = 'action';
      // 这里不能直接返回，而需要根据sc来挂载对话
      sc.home(msg, user, res);
    } else {
      res.reply(sc.gmover(r));
    }
  });

}

// 玩家动作
exports.action = function(msg, user, req, res) {
  console.log(msg)
  // 根据他当前的a/b来进行判断
  // 根据反馈挂载对话
}