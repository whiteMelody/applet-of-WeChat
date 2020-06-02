// pages/select/select.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    type: 0,
    userID: "",
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

    app.getUser((res) => {

      _this.setData({
        userID: res.userID
      })

    })

    //相册分类类型
    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Config.GetClass',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.ret == 200) {

          let list = res.data.data
          console.log(list)

          //相册默认类型名称
          for (var i = 0; i < list.length; i++) {
            var class_id = list[0].id
            var _list = list[0].detail
            for (var j = 0; j < _list.length; j++) {
              var name = _list[0].name
            }
          }
          _this.setData({
            list: list,
            class_id: class_id,
            name: name
          })

        }


      }
    })

  },

  //选择相册类型
  select(val) {
    let _this = this
    let type = val.currentTarget.dataset.index
    let class_id = val.currentTarget.dataset.class_id
    let detail = val.currentTarget.dataset.detail

    for (var i = 0; i < detail.length; i++) {
      var name = detail[0].name
    }
    _this.setData({
      type: type,
      class_id: class_id,
      name: name
    })
  },

  //创建相册
  create() {

    let class_id = this.data.class_id
    let name = this.data.name
    let creator_id = this.data.userID

    let _type = this.data.type

    let _cover = this.data.list[_type].cover

    _cover = _cover.split('|')

    let _cover2 = _cover[app.random_num(0, _cover.length-1)]

    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Create',
      data: { class_id: class_id, name: name, creator_id: creator_id, cover: _cover2 },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.ret == 200) {

          let photo_id = res.data.data.photo_id

            app.albumData.photoID = photo_id

          wx.navigateTo({
            url: '/pages/make/make'
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