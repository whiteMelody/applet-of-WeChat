// pages/member/member.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mem_count: 0,
    users: {},
    admin_id: '',
    userID: '',
    photo_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this

    let cover = options.cover

    _this.setData({
      cover: cover
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

    let photo_id = app.albumData.photoID

    console.log(photo_id)

    app.getUser((res) => {

      let userID = res.userID

      _this.setData({
        userID: userID,
        photo_id: photo_id
      })

      _this.getUsers()

    })

  },

  //删除成员
  delete(val) {
    let _this = this
    let user_id = val.currentTarget.dataset.user_id
    let photo_id = this.data.photo_id
    let userID = this.data.userID
    let admin_id = this.data.admin_id
    console.log(user_id)

    if (userID != admin_id) {
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
      return false
    }


    wx.showModal({
      title: '提示',
      content: '确定要删除成员？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //相册分类类型
          wx.request({
            method: "post",
            url: 'https://www.31un.com/api/public/?s=App.Album_Photo.DelMember',
            data: { admin_id: admin_id, photo_id: photo_id, user_id: user_id },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.data.ret == 200) {

                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                })

                _this.getUsers()

              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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

          let number = res.data.data.number
          let users = res.data.data.users

          let admin_id = users[0].user_id
          console.log(admin_id)

          _this.setData({
            mem_count: number,
            users: users,
            admin_id: admin_id
          })

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