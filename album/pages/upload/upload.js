// pages/upload/upload.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "所在位置",
    photoList: [],
    isSyncList: false,
    userID: "",
    photo_id: "",
    emotion: "",
    lng: "",
    lat: "",
    images: "",
    sync: "",
    isUpload: false,
    uploadPlan: 0,
    uploadLength: 0,
    plan: 0,
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
    let photo_id = app.albumData.photoID

    app.getUser((res) => {

      let address = wx.getStorageSync('address')

      if (app.isNull(address))
        address = '所在位置'

      _this.setData({
        userID: res.userID,
        photo_id: photo_id,
        address: address
      })

    })

  },

  //选择位置
  locate() {
    let _this = this
    wx.chooseLocation({
      success: function (res) {
        _this.setData({
          address: res.name
        })
        //保存至本地
        wx.setStorage({
          key: "address",
          data: res.name
        })
      }
    })
  },

  //添加照片
  select() {
    let _this = this

    wx.chooseImage({
      success: function (res) {

        let tempFilePaths = res.tempFilePaths
        let tmp = res.tempFiles

        let photoList = _this.data.photoList
        photoList = photoList.concat(tmp)

        _this.setData({
          photoList: photoList,
        })
      }
    })

  },

  //删除照片
  delete(val) {
    let _this = this

    let tmp = this.data.photoList
    let index = val.currentTarget.dataset.index
    let photoList = tmp.splice(index + 1)

    _this.setData({
      photoList: photoList
    })

  },
  //上传照片
  upload() {
    let _this = this

    let userID = this.data.userID
    let photo_id = this.data.photo_id
    let tmp = this.data.photoList
    let emotion = this.data.emotion

    let lng = this.data.lng
    let lat = this.data.lat
    let sync = this.data.sync

    var location = ""

    if (this.data.address == "所在位置") {
    } else {
      location = this.data.address
    }

    if (app.isNull(tmp)) {

      wx.showToast({
        title: '请选择照片',
        icon:'none',
        duration: 2000
      })

      return false
    }

    //返回上一页，并生成上传队列

    //查询是否存在未上传完的队列

    let _uploadData = app.albumData.uploadData

    if (_uploadData.data){
      if (_uploadData.status == 1) {
        //当前存在有其他相片正在上传，请稍等
        wx.showToast({
          title: '当前存在有其他相片正在上传，请稍等',
          duration: 2000
        })
        return;
      }
    }

   
    app.albumData.uploadData = {
      status: 0,        //0 未上传  1上传完成  2上传中
      data: tmp,        //上传数据
      param: {
        userID,
        photo_id,
        emotion,
        lng,
        lat,
        sync,
        location,
      },
      images: []        //上传后的图片地址
    }

    wx.navigateBack({
      delta: 1,
    })
    
  },

  openSyncList(){
    this.setData({
      isSyncList: true
    })
  },

  emotionChange(e){
    this.setData({
      emotion: e.detail.value
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