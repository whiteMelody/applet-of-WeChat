
var app = getApp();
Page({
  data: {
    userInfo: {},
    type: 1,
    width: "",
    width2: "",
    margin: "",
    height2: "",
    height: "",
    isDisabled: false,
    disable: false,
    empty: false,
    init: false,
    isLogin: false,
    page: 0,
    pageSize: 15,
    datas: [],
    sysVerify: false,
  },
  onLoad: function (options) {


  },
  onShow: function () {

    let _this = this;

    app.getConfig((flag1, flag2) => {

      if (flag1 == false) {
        wx.navigateTo({
          url: '/pages/draw/draw',
        })
        return
      } else {

        this.setData({
          sysVerify: flag1
        })

        _this.clear();

        app.getUser((res) => {

          console.log(res)
          if (res) {
            this.setData({
              userID: res.userID,
              userInfo: res,
              isLogin: true,
            })
            this.onReachBottom()
          }
        })

        wx.getSystemInfo({
          success: function (res) {
            let [width, height] = [res.windowWidth, res.windowHeight];

            let width2 = (res.windowWidth - 40) / 3;

            _this.setData({
              'width': width,
              'width2': width2,
              'margin': 10,
              'height2': width2 / 4,
              'height': height
            })

          }
        })

      }

    })

  },


  onGotUserInfo(e) {

    if (this.data.isDisabled)
      return

    this.setData({
      isDisabled: true
    })

    let _this = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              method: "post",
              url: app.globalData.requestUrl + '?s=Doodle.User_Basic.GetWxOpenID',
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res2) {

                wx.getUserInfo({
                  success: function (res) {
                    var openID = res2.data.data.openid
                    var name = res.userInfo.nickName
                    var head = res.userInfo.avatarUrl
                    var encryptedData = res.encryptedData
                    var iv = res.iv
                    var unionID = res2.data.data.unionid

                    wx.request({
                      method: "post",
                      url: app.globalData.requestUrl + '?s=Doodle.User_Basic.WxLogin',
                      data: { openID: openID, encryptedData: encryptedData, iv: iv, name: name, head: head, unionID: unionID },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        var userID = res.data.data.user_id
                        wx.setStorage({
                          key: "userinfo",
                          data: { name, head, openID, userID, createtime: res.data.data.createtime },
                          success: function (res) {
                          }
                        })
                        _this._confirmEvent()
                      }
                    })
                  }
                })
              }, fail: (res2) => {
                _this._cancelEvent()
                console.log(res2)
              }
            })
          } else {
            _this._cancelEvent()
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });

    } else {
      _this._cancelEvent()
    }

  },

  _cancelEvent() {
    wx.showToast({
      title: '登录失败，请稍后重试',
      icon: 'none',
    })
  },

  _confirmEvent() {
    wx.showToast({
      title: '登录成功',
      icon: 'success',
    })
    this.onShow()
  },

  clear: function () {
    this.setData({
      datas: [],
      page: 0,
      pageSize: 15,
      disable: false,
      empty: false,
    })
  },

  changeType(e){
    this.clear()

    this.setData({
      type: e.currentTarget.dataset.type
    })

    this.onReachBottom()
   
  },

  onReachBottom: function (e) {


    let _this = this

    if (this.data.disable == true) {
      return false;
    }

    let _url = ''


    if (this.data.type == 1) {
      _url = app.globalData.requestUrl + '?s=Doodle.Paint_Works.WorksListByUser'
    } else {
      _url = app.globalData.requestUrl + '?s=Doodle.Paint_Works.WorksListByUserCollect'
    }

    let userID = this.data.userID
    let page = this.data.page
    let pageSize = this.data.pageSize
    page++;

    wx.request({
      url: _url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { page: page, pageSize: pageSize, user_id: this.data.userID },
      method: 'POST',
      success: function (res) {

        if (res.data.ret == 200) {

          let tmp = res.data.data.worksList

          var empty = false

          if (page > 1) {
            empty = false
          } else {
            if (tmp.length > 0) {
              empty = false
            } else {
              empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 15) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let datas = _this.data.datas;

          datas = datas.concat(tmp)

          _this.setData({
            empty: empty,
            datas: datas,
            page: page
          })

        }

      }
    })
    
  },


  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }


})