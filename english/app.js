//app.js

App({

  // 登录
  getUser(call) {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        let user = res;
        if (user) {
          call(user.data);
        } else {
          call(false);
        }
      }, fail: (res) => {
        call(false);
      }
    });

  },

  login: function (callback) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: _this.globalData.requestUrl + '?s=App.Album_User.GetWxOpenID',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res2) {

              //获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  var openID = res2.data.data.openid
                  var name = res.userInfo.nickName
                  var head = res.userInfo.avatarUrl

                  wx.request({
                    method: "post",
                    url: _this.globalData.requestUrl + '?s=App.Album_User.WxLogin',
                    data: { openID: openID, name: name, head: head },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {

                      var userID = res.data.data.user_id

                      wx.setStorage({
                        key: "userinfo",
                        data: { name, head, openID, userID },
                        success: function (res) {

                        }
                      })
                      if (callback) {
                        callback({ name, head, openID, userID });
                      }
                    }
                  })
                },
                fail: function (res) {

                  wx.showModal({
                    title: '温馨提示',
                    content: '检测到授权未成功，请前往开启授权，以保证功能的正常使用',
                    showCancel: false,
                    confirmText: '开启授权',
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: (res) => {
                            //获取用户信息
                            wx.getUserInfo({
                              success: function (res) {

                                var openID = res2.data.data.openid
                                var name = res.userInfo.nickName
                                var head = res.userInfo.avatarUrl
                                wx.request({
                                  method: "post",
                                  url: 'https://www.31un.com/test_api/public/?s=App.Album_User.WxLogin',
                                  data: { openID: openID, name: name, head: head },
                                  header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                  },
                                  success: function (res) {

                                    var userID = res.data.data.user_id

                                    wx.setStorage({
                                      key: "userinfo",
                                      data: { name, head, openID, userID },
                                      success: function (res) {

                                      }
                                    })
                                    if (callback) {
                                      callback({ name, head, openID, userID });
                                    }
                                  }
                                })
                              },
                              fail: function (res) {

                              }
                            })
                          }
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }, fail: (res2) => {
              console.log(res2)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  onLaunch: function () {

    //获取配置文件
    // wx.request({
    //   url: _this.globalData.requestUrl + '?service=App.Album_Config.Audit',
    //   method: 'POST',
    //   dataType: 'json',
    //   success: (res) => {
    //     this.globalData.allow_comment = res.data.data.allow_comment
    //   },
    // })

  },

  /**
   * 通过时间戳获取离现在的时间（几天前，几分钟前，几小时前）
   * @param dateTimeStamp				时间戳
   * @returns {string|*|string}		（几天前，几分钟前，几小时前）
   */
  getDateDiff: function getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      //若日期不符则弹出窗口告之
      console.log("结束日期不能小于开始日期！");
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    var result = "";
    if (monthC >= 1) {
      result = parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
      result = parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = parseInt(hourC) + "个小时前";
    } else if (minC >= 1) {
      result = parseInt(minC) + "分钟前";
    } else result = "刚刚";
    return result;
  },

  getFileName: function getFileName(obj) {//通过第一种方式获取文件名
    var pos = obj.lastIndexOf(".");//查找最后一个\的位置
    return obj.substring(pos + 1); //截取最后一个\位置到字符长度，也就是截取文件名 
  },

  getUuid: function getUuid() {
    var len = 32; //32长度
    var radix = 16; //16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = [],
      i; radix = radix || chars.length; if (len) {
        for (i = 0; i < len; i++) {
          uuid[i] = chars[0 | Math.random() * radix];
        }
      } else {
      var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16; uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },

  isNull: function isNull(obj) {
    if (obj == undefined || obj == 'undefined' || obj == null || obj == 'null' || obj == "" || obj.length == 0) return true; else return false;
  },

  getNowDate: function () {
    return this.toLocalTime(new Date().getTime() / 1000);
  },
  getNowWeek: function () {
    //由于0为周日 1-6为周一到周六，这里重新计算
    var _week = new Date().getDay();

    if (_week == 0) {
      return 6;
    } else {
      return _week - 1;
    }
  },
  getNowDay: function () {
    return new Date().getDate();
  },
  toLocalTime: function (nS) {
    var date = new Date(parseInt(nS) * 1000);
    // var str =  date.getFullYear().toString().substring(2,4) ;
    var str = date.getFullYear();

    var myDate = str + "-" + this.addZero(date.getMonth() + 1) + "-" + this.addZero(date.getDate());
    return myDate;
  },
  addZero: function (num) {
    var str = num.toString();
    if (str.length == 1) return "0" + num;
    else return num;
  },
  /**
	 * 保留2位小数
	 * @param oNum			原始数值 {number}
	 * @returns {number}	新数值
	 */
  twoDecimal(oNum) {
    var num = parseFloat(oNum);
    if (isNaN(length)) return false;

    var num = Math.round(oNum * 100) / 100;
    return num;
  },
  //获取当前日期的前几天或后几天数据
  getNewDate: function (day) {
    var _time = (new Date().getTime() - 86400 * day * 1000) / 1000;
    return this.toLocalTime(_time);
  },

  //随机数 传数字区间
  random_num: function (smin, smax) {
    var Range = smax - smin;
    var Rand = Math.random();
    return (smin + Math.round(Rand * Range));
  },

  formatTime: function (time) {
    if (typeof time !== 'number' || time < 0) {
      return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([minute, second]).map(function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':')
  },

  globalData: {
    requestUrl: 'https://api.7english.cn/',           //线上
    // requestUrl: 'https://192.168.8.150/',      //本地测试
    userInfo: {},
  },

})

