/**
 * Created by wangsong3635 on 2016/4/10.
 */
var uuid = require('node-uuid');
var User = require('../bean/User');
var UserList = require('../model/UserList');
var CeilList = require('../model/CeilList');
var Const = require('../utils/Const');
var BackApi = require('../routes/BackApi');
var BroadcastService = require('./BroadcastService');

var UserService = (function() {

    var handle = function(message, ws) {
        switch (message.data.action) {
            case Const.ACTION.LOGIN:
                addUser(message.data, ws);
                break;
            case Const.ACTION.CLOSE:
                delUser(message.data);
                break;
            default:
                handleDefault();
                break;
        }
    };
    /**
     * 添加用户到userList中
     * @param message
     */
    //     data: {
    //         action: 'login',
    //         nickname: 'nickname'
    //     }
    var addUser = function(data, ws) {
        var userId = uuid.v1();
        try {
            ws.userId = userId;
        } catch (e) {
            console.log('ws userId 添加失败');
        }
        var user = User(userId, data.nickname, ws);
        
        UserList.addUser(user);
        //获取所有房间，并在房间中添加庄家的昵称
        var ceilList = CeilList.getAllCeil();
        ceilList.map(function(ceil) {
            var blanker = UserList.findUser(ceil.getBlankerId());
            if(blanker == undefined) {
                console.log(ceil);
            }
            ceil.blankerNickname = blanker !== undefined ? blanker.getNickname() : null;
        });
        var data = BackApi.LoginBack(user.getId(), user.getNickname(), ceilList);
        ws.send(JSON.stringify(data));
        //广播
        BroadcastService.updateUser(user.getId(), 'add');
    };

    /**
     * 从userList中删除用户
     * @param message
     */
    //     data: {
    //         action: 'close',
    //         userId: 'useId'
    //     },
    var delUser = function (data) {
        //UserList 删除用户
        UserList.delUser(data.userId);
        //CeilList 删除庄家是用户的ceil
        CeilList.delCeilByBlankId(data.userId);
        //广播
        BroadcastService.updateUser(data.userId, 'delete');
    };

    /**
     * 处理default情况
     */
    var handleDefault = function() {
        console.log('UserService default...');
    };
    
    return {
        handle: handle
    };

})();

module.exports = UserService;
