var msg = require('../ctrler/message'),
    config = require('../config');

module.exports = function(req,res,next) {
    msg.fetch(function(msgs){
        res.render('wall',{
            config: config,
            msgs: msgs
        })
    })
}