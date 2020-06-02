// pages/permit/permit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: '0',
    auth_data: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this

    //获取屏幕高宽
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })

    let photo_id = app.albumData.photoID

    app.getUser((res) => {

      let userID = res.userID

      _this.setData({
        userID: userID,
        photo_id: photo_id
      })

      _this.getUsers()


    })

  },


  //获取相册成员列表
  getUsers() {

    let _this = this

    let userID = this.data.userID
    let photo_id = this.data.photo_id


    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.GetUsers',
      data: { user_id: userID, photo_id: photo_id },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.ret == 200) {

          console.log(res.data.data)
          let tmp = res.data.data.users

          let users = tmp.slice(1)

          let arr = users.filter((item) => {
            console.log(item)
            return item.upload_auth == 1
          })

          if (arr.length == 0) {
            var all = '1'
          }else if (arr.length == users.length){
            var all = '0'
          }else{
            var all = '3'
          }

          _this.setData({
            users: users,
            all: all
          })
        }
      }
    })
  },

  //选择照片权限所有人或自己
  select(val) {
    let _this = this
    let all = val.currentTarget.dataset.all

    _this.setData({
      all: all
    })

    _this.set()

  },

  //照片权限允许的对象
  permit(val) {
    let _this = this

    let auth_data = val.currentTarget.dataset.auth_data
    let upload_auth = val.currentTarget.dataset.upload_auth

    console.log(auth_data)

    _this.setData({
      all: '3',
      auth_data: auth_data,
      upload_auth: upload_auth
    })

    _this.set()

  },

  set() {
    let _this = this
    let all = this.data.all
    let userID = this.data.userID
    let photo_id = this.data.photo_id
    let _auth_data = this.data.auth_data
    let upload_auth = this.data.upload_auth
    let range = ""

    let auth_data = JSON.stringify({"user_id": _auth_data, "upload_auth": upload_auth })
    
    if (all == '0') {
      console.log('所以人')
      range = 0
    } else if (all == '1') {
      console.log('仅自己')
      range = 1
    } else {
      console.log('自定义')
      range = 2
    }

  
    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Authority',
      data: { range: range, user_id: userID, photo_id: photo_id, auth_data: auth_data },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.ret == 200) {

          _this.getUsers()

        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})