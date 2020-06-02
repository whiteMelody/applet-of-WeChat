//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    photoList: [],
    userID: "",
    isLogin: false,
    empty: false,
    vain: false,
    page: 0,
    perpage: 10,
  },

  onLoad() {
    this.login = this.selectComponent("#login");
  },

  onShow() {

    let _this = this

    app.getUser((res) => {

      console.log(res)

      if(res){

        _this.setData({
          userID: res.userID,
          page: 0,
          isLogin: true,
          photoList: [],
          disable: false
        })

        _this.onReachBottom()

        this.login.hideLogin()

      }else{
        console.log('未登录')
        //未登录
        this.login.showLogin()
      }
     
    })

  },

  //取消事件 
  _cancelEvent(){
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  }, 
  //确认事件
  _confirmEvent(){

    let _this = this

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })

    app.getUser((res) => {

      if (res) {
        _this.setData({
          userID: res.userID,
          page: 0,
          isLogin: true,
          photoList: [],
          disable: false
        })

        _this.onReachBottom()

      } else {
        //未登录
        this.login.showLogin()
      }

    })


    this.login.hideLogin()
  },

  //跳传相册详情
  goAlbum(val){
    let _this = this 
    let photo_id = val.currentTarget.dataset.photo_id
      app.albumData.photoID = photo_id
    wx.navigateTo({
      url: '/pages/make/make' 
    })

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

        if (res.data.ret == 200){

          let tmp = res.data.data.photos
          console.log(tmp)
  
          if(page > 1){
            var empty = false
          }else{
            //判断相册数量 如果有相册empty为false
            if (tmp.length > 0) {
              var empty = false
            } else {
              var empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 10) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let photoList = _this.data.photoList;

          photoList = photoList.concat(tmp)
         
          //相册数量大于4 vain为false
          if (photoList.length > 4) {
            var vain = false
          } else {
            var vain = true
          }

          _this.setData({
            empty: empty,
            vain: vain,
            photoList: photoList,
            page: page
          })
        }
        wx.hideLoading()
      }
    })
  },
})
