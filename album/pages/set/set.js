// pages/set/set.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumName: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this

    let is_admin = options.is_admin
    let mem_count = options.mem_count
    let name = options.name
    let length = name.length
    let cover = options.cover

    _this.setData({
      is_admin: is_admin,
      mem_count: mem_count,
      name: name,
      length: length,
      cover: cover,
    })


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

    console.log('--------------photo_id--------------')

    console.log(photo_id);

    app.getUser((res) => {

      let userID = res.userID

      this.setData({
        userID: userID
      })

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
            let number = res.data.data.number

            _this.setData({
              mem_count: number
            })
          }
        }
      })

    })

  },

  showMsg(){
    wx.showModal({
      title: '提示',
      content: '你不是管理员',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //显示设置相册名称
  showName() {
    this.setData({
      albumName: true
    })
  },
  //取消设置相册名称
  cancelName() {
    this.setData({
      albumName: false
    })
  },
  //修改相册名称
  setName() {

    let _this = this

    let userID = this.data.userID
    let photo_id = app.albumData.photoID
    let name = this.data.name

    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Rename',
      data: { user_id: userID, photo_id: photo_id, name: name },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.ret == 200) {

          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })

          _this.setData({
            albumName: false
          })

        }
      }
    })

  },


  //获取相册名称字符长度
  bindKeyInput: function (e) {

    let name = e.detail.value
    let length = e.detail.value.length

    this.setData({
      name: name,
      length: length
    })
  },


  //解散相册
  dissolve() {
    let _this = this

    let userID = this.data.userID
    let photo_id = app.albumData.photoID

    wx.showModal({
      title: '解散相册',
      content: '确定要解散此相册吗',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //相册分类类型
          wx.request({
            method: "post",
            url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Dismiss',
            data: { admin_id: userID, photo_id: photo_id },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.data.ret == 200) {

                wx.showToast({
                  title: '解散成功',
                  icon: 'success',
                  duration: 2000,
                  complete: function (res) {
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  }
                })

              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

  exit() {
    let _this = this

    let userID = this.data.userID
    let photo_id = app.albumData.photoID

    wx.showModal({
      title: '退出相册',
      content: '确定要退出此相册吗',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //相册分类类型
          wx.request({
            method: "post",
            url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Getout',
            data: { user_id: userID, photo_id: photo_id },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.data.ret == 200) {

                wx.showToast({
                  title: '退出成功',
                  icon: 'success',
                  duration: 2000,
                  complete: function (res) {
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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