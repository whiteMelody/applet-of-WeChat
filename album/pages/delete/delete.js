// pages/delete/delete.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    isAll: false,
    selectList: [],
    photoNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this

    let tmp = JSON.parse(options.imgList)
    let dynamic_id = options.dynamic_id
    let photo_id = options.photo_id

    for (let i = 0; i < tmp.length; i++) {
      tmp[i].selectImg = false
    }

    app.getUser((res) => {

      let userID = res.userID

      _this.setData({
        userID: userID,
        imgList: tmp,
        dynamic_id: dynamic_id,
        photo_id: photo_id,
      })
    })
  },

  //选择删除的照片
  select(val) {
    let _this = this
    let index = val.currentTarget.dataset.index
    let img_id = val.currentTarget.dataset.img_id
    let isAll = this.data.isAll
    let tmp = this.data.imgList

    //选择的照片列表
    // let selectList = this.data.selectList

    if (tmp[index].selectImg == false) {
      tmp[index].selectImg = true
    } else {
      tmp[index].selectImg = false
      isAll = false
    }

    let arr = tmp.filter((item) => {
      return item.selectImg == true
    })

    console.log(arr)

    let photoNum = arr.length

    if (arr.length == tmp.length) {
      isAll = true
    }


    _this.setData({
      imgList: tmp,
      isAll: isAll,
      photoNum: photoNum,
      selectList: arr,
    })

  },
  //全选
  selectAll() {
    let _this = this
    let tmp = this.data.imgList
    let isAll = this.data.isAll
    let photoNum = this.data.photoNum
    let selectList = this.data.selectList

    if (isAll) {
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].selectImg = false
      }
      isAll = false
      photoNum = 0
      selectList = []
    } else {
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].selectImg = true
      }
      isAll = true
      photoNum = tmp.length
      selectList = tmp
    }

    _this.setData({
      isAll: isAll,
      imgList: tmp,
      photoNum: photoNum,
      selectList: selectList
    })

  },

  //立即删除
  delete() {

    let _this = this

    let selectList = this.data.selectList
    let isAll = this.data.isAll
    let userID = this.data.userID
    let dynamic_id = this.data.dynamic_id
    let photo_id = this.data.photo_id

    console.log(selectList)
    console.log(isAll)
    console.log(userID)
    console.log(dynamic_id)

    // return false

    if (selectList.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个',
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

    //全选删除删除动态
    if (isAll) {

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.DelDynamic',
        data: { user_id: userID, dynamic_id: dynamic_id, photo_id: photo_id },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

        
          if (res.data.ret == 200) {

            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              complete: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })

          }else{

            let errorMsg = res.data.msg

            wx.showModal({
              title: '提示',
              content: errorMsg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      })

    } else {
      //删除照片

    }


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