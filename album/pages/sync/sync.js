// pages/sync/sync.js
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
    //相册名
    let albumName = options.albumName
    console.log(albumName)

    for (let i = 0; i < tmp.length; i++) {
      tmp[i].selectImg = false
    }
    console.log(tmp)

    _this.setData({
      imgList: tmp,
      albumName: albumName
    })
  },

  //选择同步的照片
  select(val) {
    let _this = this
    let index = val.currentTarget.dataset.index
    let isAll = this.data.isAll
    let tmp = this.data.imgList
    //选择的照片列表
    let selectList = this.data.selectList

    if (tmp[index].selectImg == false) {
      tmp[index].selectImg = true
    } else {
      tmp[index].selectImg = false
      isAll = false
    }

    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].selectImg == true) {
        selectList = tmp
      }
    }
    let photoNum = selectList.length

    if (selectList.length == tmp.length){
      isAll = true
    }

    console.log(tmp)
    _this.setData({
      imgList: tmp,
      isAll: isAll,
      photoNum: photoNum
    })
    
  },
  //全选
  selectAll() {
    let _this = this
    let tmp = this.data.imgList
    let isAll = this.data.isAll
    let photoNum = this.data.photoNum

    if (isAll) {
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].selectImg = false
      }
      isAll = false
      photoNum = 0
    } else {
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].selectImg = true
      }
      isAll = true
      photoNum = tmp.length
    }

    _this.setData({
      isAll: isAll,
      imgList: tmp,
      photoNum: photoNum
    })

  },

  //立即同步
  syncAlbum() {
    let _this = this
    let tmp = this.data.imgList
    let selectList = this.data.selectList
    let albumName = this.data.albumName
   
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].selectImg == true) {
        selectList = tmp
      }
    }
   
    if (selectList.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请至少选择一个',
        showCancel:false,
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

    let arr = JSON.stringify(selectList)

    wx.navigateTo({
      url: '/pages/syncAlbum/syncAlbum?arr=' + arr + '&albumName=' + albumName
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