//app.js
App({

  getUuid: function () {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = [], i; radix = radix || chars.length; if (len) { for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]; } else { var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } } }
    return uuid.join('');
  },

  //保留2位小数
  twoDecimal: function (oNum) {
    var num = parseFloat(oNum);
    if (isNaN(length)) return false;

    var num = Math.round(oNum * 100) / 100;
    return num;
  },

  //获取string的长度，可以传中文
  getByteLen: function (val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
        len += 2;
      else
        len += 1;
    };
    return len;
  },
  //截取string，可以传中文
  cutStrForNum: function (str, num) {
    var len = 0;
    var index = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i].match(/[^\x00-\xff]/ig) != null) //全角
        len += 2;
      else
        len += 1;
      index++;
      if (len >= num) {
        break;
      }
    }
    if (len >= num)
      newStr = str.substring(0, index) + "...";
    else
      newStr = str;
    return newStr;
  },
  //获取用户接口
  getUserInfo: function (cb) {

    var that = this
    // console.log("user:" + this.globalData.userInfo);
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {

      //查看本地是否有数据
      wx.getStorage({
        key: "userInfo",
        success: function (res) {
          if (res) {
            that.globalData.userInfo = res.data;
            cb(that.globalData.userInfo)
          }
        },
        fail: function (res111) {
          //调用登录接口
          wx.login({
            success: function () {
              wx.getUserInfo({

                complete: function (res) {

                  if (res.errMsg != "getUserInfo:ok") {
                    //默认生成一个userInfo
                    res.userInfo = {};
                  }

                  res.userInfo.userId = that.getUuid();

                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)

                  //保存在本地

                  wx.setStorage({
                    key: 'userInfo',
                    data: res.userInfo,
                    complete: function () {
                      cb(res.userInfo);
                      wx.request({
                        url: 'https://www.gmbridge.cn/draw/login',
                        data: res.userInfo
                      })
                    }
                  })

                }
              })
            }
          })
        }
      })


    }
  },
  //全局临时对象（保存在系统缓存，而不是本地缓存）
  globalData: {
    tagList : [],
    indexEd: false,
    listEd: false
  },


  getIndex: function (tag, page, pageSize, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/index',
      data: {
        tag: tag,
        page: page,
        pageSize: pageSize,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  getGif: function (width, height, color, lineWidth, paths, time, tag, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/getGif',
      data: {
        width: width,
        height: height,
        color: color,
        lineWidth: lineWidth,
        paths: paths,
        time: time,
        userID: that.globalData.userInfo.userId,
        tag: tag,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },


  getGif2: function (width, height, color, lineWidth, paths, time, tag, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/getGif2',
      data: {
        width: width,
        height: height,
        color: color,
        lineWidth: lineWidth,
        paths: paths,
        time: time,
        userID: that.globalData.userInfo.userId,
        tag: tag,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  collect: function (gifID, option, fnc) {


    let _url = "https://www.gmbridge.cn/draw/addCollect";
    if (option == 2 || option == "2") {
      _url = "https://www.gmbridge.cn/draw/deleteCollect";
    }

    let that = this;
    wx.request({
      url: _url,
      data: {
        gifID: gifID,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  like: function (gifID, option, fnc) {

    let _url = "https://www.gmbridge.cn/draw/zan";
    if (option == 2 || option == "2") {
      _url = "https://www.gmbridge.cn/draw/cancelZan";
    }

    let that = this;
    wx.request({
      url: _url,
      data: {
        gifID: gifID,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  del: function (gifID, fnc) {
  
    let that = this;
    wx.request({
      url: "https://www.gmbridge.cn/draw/del",
      data: {
        gifID: gifID,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },


  myCollect: function (page, pageSize, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/myCollect',
      data: {
        page: page,
        pageSize: pageSize,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },


  my: function (page, pageSize, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/my',
      data: {
        page: page,
        pageSize: pageSize,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },


  publish: function (gifID, tag, title, intro, big, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/publish',
      data: {
        gifID: gifID,
        tag: tag,
        title: title,
        intro: intro,
        big: big,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  search: function (page, pageSize, big, tag, search, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/search',
      data: {
        page: page,
        pageSize: pageSize,
        big: big,
        tag: tag,
        search: search
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  detail: function (id, fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/detail',
      data: {
        gifID: id,
        userID: that.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },

  tagList: function (fnc) {
    let that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/draw/tagList',
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          fnc(res.data);
        } else {
          fnc(false);
        }
      }
    })
  },


})

