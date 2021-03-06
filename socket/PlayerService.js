/**
 * Created by wangsong3635 on 2016/4/11.
 */
var Const = require('../utils/Const');
var UserList = require('../model/UserList');
var CeilList = require('../model/CeilList');
var BackApi = require('../routes/BackApi');
var PlayerService = (function() {

    // var blanker = {
    //     type: 'blanker',
    //     ceilId: ceilId,
    //     data: {
    //         action: 'hit', //'stand', 'bust'
    //         card: 'club02'
    //     }
    // }

    //庄家继续要牌
    var handleHit = function(message) {
        var ceil = CeilList.findCeil(message.ceilId);
        var playerId = ceil.getPlayerId();
        var ws = UserList.findUser(playerId).getWs();
        ws.send(JSON.stringify(BackApi.TransmitData(message.data)));
    };


    //庄家stand时， 比较庄家和玩家的大小
    var handleStand = function(message) {
        var ceil = CeilList.findCeil(message.ceilId);
        var playerId = ceil.getPlayerId();
        var ws = UserList.findUser(playerId).getWs();
        ws.send(JSON.stringify(BackApi.TransmitData(message.data)));
    };
    //庄家bust， 玩家赢
    var handleBust = function(message) {
        var ceil = CeilList.findCeil(message.ceilId);
        var playerId = ceil.getPlayerId();
        var ws = UserList.findUser(playerId).getWs();
        ws.send(JSON.stringify(BackApi.TransmitData(message.data)));
    };
    //庄家是否可以再玩呢
    var handleBegin = function (message) {
        var ceil = CeilList.findCeil(message.ceilId);
        var playerId = ceil.getPlayerId();
        var ws = UserList.findUser(playerId).getWs();
        ws.send(JSON.stringify(BackApi.TransmitData(message.data)));
    };

    var handleDefault = function(message) {
        console.log("PlayerService default..");
    };
    var handle = function(message) {
        switch (message.data.action) {
            case Const.ACTION.HIT:
                handleHit(message);
                break;
            case Const.ACTION.STAND:
                handleStand(message);
                break;
            case Const.ACTION.BUST:
                handleBust(message);
                break;
            case Const.ACTION.BEGIN:
                handleBegin(message);
                break;
            default:
                handleDefault(message);
                break;
        }

    };

    return {
        handle: handle
    };
    
})();

module.exports = PlayerService;