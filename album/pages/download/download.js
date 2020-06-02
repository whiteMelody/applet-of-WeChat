// pages/delete/delete.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    isAll: false,
    isDownload: false,
    plan: 0,
    uploadPlan: 0,
    uploadLength: 0,
    selectList: [],
    photoNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this

    let tmp = JSON.parse(options.imgList)

    for (let i = 0; i < tmp.length; i++) {
      tmp[i].selectImg = false
    }

    app.getUser((res) => {

      let userID = res.userID

      _this.setData({
        userID: userID,
        imgList: tmp,
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
    let photo_id = this.data.photo_id

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

    //下载指定的图片

    this.setData({
      isDownload: true,
      uploadLength: selectList.length
    })
    
    console.log(selectList)

    for (let i = 0; i < selectList.length; i++){
      wx.downloadFile({
        url: selectList[i].img_path, //仅为示例，并非真实的资源
        success: function (res) {
          if (res.statusCode === 200) {
            let _plan = _this.data.uploadPlan + 1

            if (_plan == _this.data.uploadLength) {

              wx.showToast({
                title: '下载完成',
                icon: 'success',
                duration: 2000
              })

              _this.setData({
                isDownload: false
              })
            }else{
              _this.setData({
                uploadPlan: _plan,
                plan: _this.twoDecimal(_plan / _this.data.uploadLength) * 100
              })
            }
          }
        }
      })

      
    }

  },

  twoDecimal(oNum) {
    var num = parseFloat(oNum);
    var num = Math.round(oNum * 100) / 100;
    return num;
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