var wechat = require('wechat'),
  List = wechat.List,
  user = require('../ctrler/user'),
  room = require('../ctrler/room'),
  mail = require('../lib/mail'),
  async = require('async');

exports.feedback = function(msg, user, req, res) {
  if (msg.Content != '') {
    var mailcontent = [
        '反馈内容：',
      msg.Content,
        '',
        '',
        '该用户的混淆id：',
      msg.FromUserName,
        '该用户的数据库id：',
      user._id,
        '该用户的缩略信息：',
      JSON.stringify(user)
    ].join("\n");
    mail.send(mailcontent, function(stat) {
      if (stat != 'error') {
        req.wxsession.step = null;
        res.reply('提交成功！感谢您的建议。')
      } else {
        req.wxsession.step = null;
        res.reply('抱歉，反馈提交失败，要不您先备份一下呗，服务器可能是挂了，杯具。')
      }
    })
  }
}

// 加入已经存在的房间，对于已经加入了房间的人来说，回到他的游戏里
exports.join = function(msg, user, req, res) {
  var roomID = parseInt(msg.Content);
  if (isNaN(roomID) == false) {
    room.join(user._id, roomID, function(r) {
      if (r) {
        if (r == 'exist') {
          req.wxsession.step = null;
          res.reply('hey，你已经在这个房间里咯');
        } else if (r == 'full') {
          req.wxsession.step = null;
          res.reply('这个房间人已经满了，找其他的房间加入把，或者自己新创建一个房间也行。');
        } else {
          // 正常的加入房间流程
          req.wxsession.step = 'game';
          req.wxsession.sc = 'home';
          req.wxsession.game = {
            door: r._id,
            openid: r.openid
          };
          res.reply('加入成功！可以开始游戏了')
        }
      } else {
        req.wxsession.step = null;
        res.reply('没有找到这个房间，看看是不是搞错门牌号了？');
      }
    })
  } else if (roomID == 'back') {
    // 这里如何记录上一步中他的状态？
    // 这里要进行用户所属房间的一个查询，这个房间数值可能是多个
    req.wxsession.step == 'game';
    req.wxsession.sc = 'home';
    res.reply('欢迎回来')
  } else {
    res.reply('你的输入有误，请输入数字哦');
  }
}

// 创建一个新的房间
exports.createRoom = function(msg, user, req, res) {
  var roomLimited = parseInt(msg.Content);
  if (isNaN(roomLimited) == false) {

    if (roomLimited > 100) {
      res.reply('最多100人一起玩哦，请输入100以下的数字')
    } else {

      async.waterfall([
        function(callback) {
          console.log('2')
          room.last(function(last) {
            if (last) {
              callback(null, last.openid);
            } else {
              callback(null, 0);
            }
          });
        },
        function(last, callback) {
          var door = last + 1;
          // 创建新的游戏房间
          room.create({
            limited: roomLimited,
            openid: door
          }, user, function(rid) {
            callback(null, rid, door);
          })
        },
        function(rid, door, callback) {
          if (rid) {
            req.wxsession.step = 'game';
            req.wxsession.sc = 'home';
            req.wxsession.game = {
              door: rid,
              openid: door
            };
            res.reply('房间创建成功，房间号码是' + door);
          }
        }
      ]);

    }

  } else {
    res.reply('你的输入有误，请输入数字哦');
  }
}

exports.main = function(msg, u) {
  List.add('main', [
    ['回复{开始} :选择新的房间或者回到游戏',
      function(info, req, res) {
        // 进行一些分配操作
        req.wxsession.step = 'join';
        res.reply('请输入房间号，如 1024 表示加入1024号房间，如果想要回到上次断开的游戏，请回复back');
      }
    ],
    ['回复{新建} :新建一个房间，和好友一起玩',
      function(info, req, res) {
        // 新建一个房间
        req.wxsession.step = 'createRoom';
        res.reply('请输入最大人数，如 10 表示最大允许10人同时参加');
      }
    ],
    ['回复{帮助} :查看游戏帮助',
      function(info, req, res) {
        res.reply([
            '『 Darkroom 游戏帮助 』',
            '',
            'darkroom 是一个多人沙盒游戏',
            '你会被分配到一个最多有100人的房间',
            '这个房间里有一些道具',
            '探索房间会获得一些道具',
            '你也可以从随机事件中获得道具',
            '你的目的是从最多100人中胜出',
            '利用道具杀人是被允许的',
            '你也可以从被杀死的玩家手中获得新的道具',
            '谈判可以让合作成为可能',
            '意味着你可以通过换取道具免除被杀',
            '某些道具可以直接打开房间的门，获得胜利',
            '因此获胜并非来自屠杀',
            '还有更多玩法等你来发掘',
            'enjoy darkroom!'
        ].join('\n'))
      }
    ],
    ['回复{成就} :查看我所获得的积分',
      function(info, req, res) {
        // 查询积分
        res.reply('你现在的积分是' + u.score + '分');
      }
    ],
    ['回复{在线} :查看darkroom世界里在进行游戏的房间数',
      function(info, req, res) {
        // 查询总房间人数
        room.stat('all', function(count) {
          res.reply([
              '服务器状态：正常',
              '在线房间：' + count + '个'
          ].join('\n'));
        });
      }
    ],
    ['回复{反馈} :提交你对darkroom的想法',
      function(info, req, res) {
        // 提交反馈
        // 这里要考虑一个情况，就是用户怎么从一开始的路由里进入这个反馈流程是一个问题
        // 针对这个情况可以设置一个step路由拦截掉
        req.wxsession.step = 'feedback';
        res.reply('我正拿着笔准备记下呢，请说：')
      }
    ]
  ]);
}