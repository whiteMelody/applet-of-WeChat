// pages/join/join.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamic_id: '',
    dynamic: {},
    invite_user: {},
    userID: {},
    isLogin: false, 
    isComment: false,
    commentVal: {
      userID: '',
      dynamic_id: '',
      content: '',
    },
    // inputHeight: 800,
    allow_comment: 0,
    inputHeight: 0,
    isReply: false,
    ReplyVal: {
      userID: '',
      userID: '',
      dynamic_id: '',
      content: '',
    },
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //判断登录
    this.setData({
      dynamic_id: options.dynamic_id,
      invite_user: options.invite_user
    })
    this.login = this.selectComponent("#login");

    app.getUser((res) => {
      if (res) {
        this.setData({
          userID: res.userID,
          isLogin: true
        })
        // 不强制登录
        // this.login.hideLogin()
      } else {
        // 不强制登录
        // this.login.showLogin()
      }
    })

    this.init()

  },

  init(){

    app.getUser((res) => {
      if (res) {
        this.setData({
          userID: res.userID,
          isLogin: true
        })
      } 
    })

    //--

    wx.showLoading({
      title: '加载中',
    })

    //查询单条
    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.GetDynamic',
      data: { dynamic_id: this.data.dynamic_id },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {

        let _tmp = res.data.data.dynamic

        _tmp.createtime = app.getDateDiff(_tmp.createtime * 1000)

        _tmp.is_liked = 0

        if (res.data.ret == 200) {
          this.setData({
            dynamic: _tmp
          })
        }
        wx.hideLoading()
      }
    })
  },

  toAlbum(){

    //判断是否登录

    if (!this.data.isLogin) {
      this.login.showLogin()
      return false;
    }

    if (app.isNull(this.data.invite_user)){
      wx.showToast({
        title: '邀请人不存在',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (this.data.invite_user == this.data.userID){

      if (this.data.invite_user != ''){
        //自己
        app.albumData.photoID = this.data.dynamic.photo_id
        wx.navigateTo({
          url: '/pages/make/make',
        })
      }else{
        // ???
      }
     
    }else{

      app.albumData.photoID = this.data.dynamic.photo_id
      wx.navigateTo({
        url: '/pages/make/make?photo_id=' + this.data.dynamic.photo_id + '&invite_user=' + this.data.invite_user,
      })
    }
   
  },

  //取消事件 
  _cancelEvent() {
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  },

  //确认事件
  _confirmEvent() {

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })

    //更新数据
    this.init()

    this.login.hideLogin()
  },


  //下载照片
  download(val) {

    let tmp = val.currentTarget.dataset.imglist
    let imgList = JSON.stringify(tmp)

    wx.navigateTo({
      url: '/pages/download/download?imgList=' + imgList
    })
  },

  //预览图片
  getImg(val) {

    let tmp = val.currentTarget.dataset.imglist
    let index = val.currentTarget.dataset.index
    let img = val.currentTarget.dataset.img
    let imgList = JSON.stringify(tmp)

    wx.navigateTo({
      url: '/pages/preview2/preview2?img=' + img + '&imgList=' + imgList + '&index=' + index
    })
  },


  //同步照片
  sync(val) {

    if (!this.data.isLogin){
      this.login.showLogin()
      return false;
    }

    let tmp = val.currentTarget.dataset.imglist
    let imgList = JSON.stringify(tmp)
    let name = this.data.dynamic.photo_name

    wx.navigateTo({
      url: '/pages/sync/sync?imgList=' + imgList + '&albumName=' + name
    })
  },

  twoDecimal(oNum) {
    var num = parseFloat(oNum);
    var num = Math.round(oNum * 100) / 100;
    return num;
  },

  inputFocus(e) {

    this.setData({
      inputHeight: e.detail.height
    })

  },

  inputBlur() {
    // this.setData({
    //   isComment: false
    // })
  },


  //获取相册名称字符长度
  commentInput: function (e) {
    let _tmp = this.data.commentVal
    _tmp.content = e.detail.value
    this.setData({
      commentVal: _tmp
    })
  },


  setComment(val) {

    this.setData({
      isComment: false
    })

    let flag = val.currentTarget.dataset.value

    let userID = this.data.userID

    if (flag == 'true' || flag == true) {
      //评论

      let commentVal = this.data.commentVal

      if (commentVal.content.length == 0) return;

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Comment',
        data: { dynamic_id: this.data.dynamic_id, user_id: userID, content: commentVal.content },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.ret == 200) {
            //评论成功
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000
            })

            let _tmp = this.data.dynamic
            _tmp.comments.comments.push(res.data.data.comments[0])

            //替换当前动态
            this.setData({
              isComment: false,
              dynamic: _tmp
            })

          }
        }
      })
    }

  },

  /**
  * 评论
  */
  comment(val) {

    if (!this.data.isLogin) {
      this.login.showLogin()
      return false;
    }

    let dynamic_id = val.currentTarget.dataset.id
    let index = val.currentTarget.dataset.index
    let userID = this.data.userID

    let _tmp = this.data.commentVal

    _tmp.dynamic_id = dynamic_id
    _tmp.index = index
    _tmp.userID = userID

    this.setData({
      isComment: true,
      commentVal: _tmp
    })

  },


  /**
  * 回复
  */
  reply(val) {

    if (!this.data.isLogin) {
      this.login.showLogin()
      return false;
    }

    let dynamic_id = val.currentTarget.dataset.id
    let index = val.currentTarget.dataset.index
    let userID2 = val.currentTarget.dataset.userID || val.currentTarget.dataset.userid
    let userName = val.currentTarget.dataset.username || val.currentTarget.dataset.userName
    let commentId = val.currentTarget.dataset.commentId || val.currentTarget.dataset.commentid

    let userID = this.data.userID

    let _tmp = this.data.ReplyVal

    _tmp.dynamic_id = dynamic_id
    _tmp.index = index
    _tmp.userID = userID
    _tmp.userID2 = userID2
    _tmp.userName = userName
    _tmp.commentId = commentId

    this.setData({
      isReply: true,
      ReplyVal: _tmp
    })

  },

  setReply(val) {

    let ReplyVal = this.data.ReplyVal

    console.log(ReplyVal)

    this.setData({
      isReply: false
    })

    let flag = val.currentTarget.dataset.value

    let userID = this.data.userID

    if (flag == 'true' || flag == true) {

      if (ReplyVal.content.length == 0) return;

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Comment',
        data: { dynamic_id: ReplyVal.dynamic_id, base_id: ReplyVal.commentId, user_id: userID, atuser_id: ReplyVal.userID2, content: ReplyVal.content },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {

        
          if (res.data.ret == 200) {
            //评论成功
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000
            })

            let _tmp = this.data.dynamic
            _tmp.comments.comments.push(res.data.data.comments[0])


            //替换当前动态
            this.setData({
              isReply: false,
              dynamic: _tmp
            })

          }
        }
      })
    }

  },


  replyBlur() {
    // this.setData({
    //   isReply: false
    // })
  },


  //获取相册名称字符长度
  replyInput: function (e) {
    let _tmp = this.data.ReplyVal
    _tmp.content = e.detail.value
    this.setData({
      ReplyVal: _tmp
    })
  },


  //点赞
  like(val) {

    if (!this.data.isLogin) {
      this.login.showLogin()
      return false;
    }

    let _this = this
    let userID = this.data.userID
    let timelineList = this.data.timelineList
    let index = val.currentTarget.dataset.index
    let dynamic_id = val.currentTarget.dataset.dynamic_id
    let like_count = val.currentTarget.dataset.like_count

    if (this.data.dynamic.is_liked == 1) {
      return false
    }

    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Like',
      data: { dynamic_id: dynamic_id, user_id: userID },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        // console.log(res.data)
        if (res.data.ret == 200) {

          let _tmp = this.data.dynamic

          _tmp.like_count = parseInt(like_count) + 1

          _tmp.is_liked = 1

          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })

          _this.setData({
            dynamic: _tmp,
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
    this.setData({
      allow_comment: app.globalData.allow_comment
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

})