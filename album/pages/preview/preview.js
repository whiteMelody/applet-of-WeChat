// pages/preview/preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPreview: true,
    isDownLoad: false,
    isSync: false,
    isOriginal: false,
    imgList: [],
    windowHeight: "",
    index: 0,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this

    let img = options.img
    let tmp = JSON.parse(options.imgList)
    let index = options.index

    console.log(tmp)

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)

        let windowWidth = res.windowWidth
        let windowHeight = res.windowHeight

        wx.getImageInfo({
          src: img,
          success: function (res) {
            console.log(res.width)
            console.log(res.height)
            let imgHeight = windowWidth / res.width * res.height
            _this.setData({
              windowHeight: windowHeight,
              imgHeight: imgHeight,
              imgList: tmp,
              index: parseInt(index),
              img: img,
            })
          }
        })
      }
    })

  },

  myChange: function (e) {
    this.setData({
      index: e.detail.current
    })
  },


  //同步照片
  sync() {

    let imgList = JSON.stringify(this.data.imgList)
    let name = '相册时光'

    wx.navigateTo({
      url: '/pages/sync/sync?imgList=' + imgList + '&albumName=' + name
    })
  },

  //原图
  original() {

    let img = this.data.imgList[this.data.index].img_path

    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img],// 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
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


  //下载照片
  download(val) {

    let imgList = JSON.stringify(this.data.imgList)

    wx.navigateTo({
      url: '/pages/download/download?imgList=' + imgList
    })
  },

})