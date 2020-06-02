// pages/syncAlbum/syncAlbum.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [],
    userID: "",
    page: 0,
    perpage: 10,
    disable: false,
    isAll:false,
    selectList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    let _this = this

    let arr = JSON.parse(options.arr)
    let albumName = options.albumName

    console.log(arr)
    let _arr = []

    for (let i = 0; i < arr.length; i++) {
     _arr.push({
       upload_time: arr[i].createtime,
         filepath:arr[i].img_path
     })
    }
    
    console.log(_arr)
    let images = JSON.stringify(_arr)

    console.log(images)
    
    //获取屏幕高宽
    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })

    app.getUser((res) => {

      _this.setData({
        userID: res.userID,
        albumName: albumName,
        images: images
      })

      _this.onReachBottom()

    })

  },

  //选择同步的相册
  select(val){
    let _this = this
    let index = val.currentTarget.dataset.index
    let photo_id = val.currentTarget.dataset.photo_id
    let isAll = this.data.isAll
    let tmp = this.data.photoList

    console.log(tmp)

    //选择的相册列表
    let selectList = this.data.selectList

    if (tmp[index].selectAlbum == false) {
      tmp[index].selectAlbum = true

      selectList = selectList.concat(tmp[index].photo_id)

    } else {
      tmp[index].selectAlbum = false
    
      let arr = selectList.filter((item) => {
        return item != photo_id
      })

      selectList = arr
    }

    if (selectList.length == tmp.length){
      isAll = true
    }else{
      isAll = false
    }

    console.log(selectList)
    
    _this.setData({
      photoList: tmp,
      isAll: isAll,
      selectList: selectList
    })

  },

  //全选
  selectAll(){
    let _this = this
    let tmp = this.data.photoList
    let isAll = this.data.isAll
    let selectList = this.data.selectList
    console.log(isAll)

    if (isAll){
      isAll = false
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].selectAlbum = false
      }
      selectList = []
    }else{
      isAll = true
      for (let i = 0; i < tmp.length; i++) {
        tmp[i].selectAlbum = true
        selectList.push(tmp[i].photo_id)
      }
    }

    _this.setData({
      isAll: isAll,
      photoList: tmp,
      selectList: selectList
    })

  },

  //立即同步
  syncAlbum(){
    let _this = this

    let selectList = this.data.selectList
    let images = this.data.images
    let userID = this.data.userID
    let sync = '[' + selectList.join(",") + ']'


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

    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.SyncDynamic',
      data: { user_id: userID, images: images, sync: sync },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {


        if (res.data.ret == 200) {

          wx.showToast({
            title: '同步成功',
            icon: 'success',
            duration: 2000,
           })


        } else {

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

    let _this = this

    if (this.data.disable == true) {
      return false;
    }
    let userID = this.data.userID
    let page = this.data.page
    let perpage = this.data.perpage
    let albumName = this.data.albumName
    page++;

    wx.showLoading({
      title: '加载中',
    })

    //获取相册列表
    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.GetList',
      data: { user_id: userID, page: page, perpage: perpage },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.ret == 200) {

          let tmp = res.data.data.photos
          console.log(tmp)

          let arr = tmp.filter((item) => {
            return item.name != albumName
          })

          for (let i = 0; i < arr.length; i++) {
            arr[i].selectAlbum = false
          }

          if (arr.length == 0 || arr.length < 10) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let photoList = _this.data.photoList;

          photoList = photoList.concat(arr)

          _this.setData({
            photoList: photoList,
            page: page
          })
        }


        wx.hideLoading()


      }
    })

  },


})