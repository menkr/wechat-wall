// config
// - `url` 约定了微信POST过来的接口地址，如果你在微信填的是 `http://yoursite.com/abc` 那么这里就应该填写 `/abc`。
// - `token` 填入你的weixin token `(String)`
// - `autoRefresh` 是否开启自动刷新 `(true | false)`，默认`true`
// - `delay` 自动刷新的时间 `(Number)`，默认为 2（表示2分钟）

module.exports = {
    url: '/',
    token: 'keyboardcat123',
    autoRefresh: false,
    event: {
        title: '上墙有奖品哦，参与都有奖活动名称活动名称',
        done: '恭喜，你已经成功上墙啦~！等待抽奖吧！！'
    }
}