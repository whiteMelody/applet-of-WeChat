// pages/rank/rank.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 30,
    ranklList: [],
    end: false,
    worldRank: true,
    friendRank: false,
    friendlList: [],
    myRank: "",
    myFriendRank: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.getUser((res) => {
      if (res) {
        this.setData({
          userID: res.userID,
          head: res.head,
          openID: res.openID
        })
        app.getSystemInfo((res) => {
          this.setData({
            height: res.windowHeight
          })
          this.getRanklList()
          this.getFriendList()
        })
      }
    })

  },

  //好友排行
  getFriendList() {
    let _this = this
    let userID = this.data.userID
    let openID = this.data.openID
    let myFriendRank = this.data.myFriendRank

    let sign = app.getAjaxSign({
      uuid: userID,
      deviceID: openID,
      deviceType: '4',
      source: 'WeChat_Applet'
    })

    wx.request({
      url: app.globalData.requestUrl + 'api/fight/frientRank',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        uuid: sign.uuid,
        deviceID: sign.deviceID,
        deviceType: sign.deviceType,
        source: sign.source,
        sign: sign.sign,
        timestemp: sign.timestemp
      },
      method: 'POST',
      success: function(res) {
        let message = res.data.message
        if (res.data.status == 1) {
          let friendlList = res.data.returnJSON
          if (app.isNull(friendlList)) {
            myFriendRank = '无'
          } else {
            let arr = friendlList.filter((item) => {
              return item.uuid == userID
            })
            myFriendRank = arr[0].ranking
          }
          _this.setData({
            friendlList: friendlList,
            myFriendRank: myFriendRank
          })
        } else {
          wx.showModal({
            title: '提示',
            content: message,
            showCancel: false,
            success: function(res) {}
          })
        }
      }
    })

  },

  //世界排行
  getRanklList() {

    let _this = this
    if (this.data.end) {
      return false
    }
    let userID = this.data.userID
    let openID = this.data.openID
    let pageIndex = this.data.pageIndex
    let pageSize = this.data.pageSize
    let myRank = this.data.myRank
    pageIndex++

    if (pageIndex == 5) {
      _this.setData({
        end: true
      })
    }

    let sign = app.getAjaxSign({
      pageIndex: pageIndex,
      pageSize: pageSize,
      uuid: userID,
      deviceID: openID,
      deviceType: '4',
      source: 'WeChat_Applet'
    })

    wx.request({
      url: app.globalData.requestUrl + 'api/fight/fightRank',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        pageIndex: sign.pageIndex,
        pageSize: sign.pageSize,
        uuid: sign.uuid,
        deviceID: sign.deviceID,
        deviceType: sign.deviceType,
        source: sign.source,
        sign: sign.sign,
        timestemp: sign.timestemp
      },
      method: 'POST',
      success: function(res) {
        let message = res.data.message
        if (res.data.status == 1) {
          if (app.isNull(res.data.extendInfo)) {
            myRank = '无'
          } else {
            myRank = res.data.extendInfo.ranking
          }
          let tmp = res.data.returnJSON.indexData
          if (tmp.length == 0 || tmp.length < 20) {
            console.log('暂无更多数据')
            _this.setData({
              end: true
            })
          }
          let ranklList = _this.data.ranklList
          ranklList = ranklList.concat(tmp)

          _this.setData({
            myRank: myRank,
            ranklList: ranklList,
            pageIndex: pageIndex
          })
        } else {
          wx.showModal({
            title: '提示',
            content: message,
            showCancel: false,
            success: function(res) {}
          })
        }
      }
    })

  },

  lower: function(e) {
    this.getRanklList()
  },


  //世界排行
  worldRank() {

    if (this.data.worldRank) {
      return false
    }

    this.setData({
      worldRank: true,
      friendRank: false,
    })

  },

  //好友排行
  friendRank() {

    if (this.data.friendRank) {
      return false
    }

    this.setData({
      friendRank: true,
      worldRank: false,
    })

  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})