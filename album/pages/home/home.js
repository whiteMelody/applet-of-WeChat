// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    perpage: 10,
    disable: false,
    homeList: [],
    empty: false, 
    allow_comment: 0,
    isComment: false,
    commentVal: {
      userID: '',
      dynamic_id: '',
      content: '',
    },
    inputHeight: 800,
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

    let _this = this
    let cover = options.cover
    let albumName = options.name
    let photoid = options.photoid

    app.getUser((res) => {

      _this.setData({
        userID: res.userID,
        name: res.name,
        head: res.head,
        photo_id: photoid,
        cover: cover,
        albumName: albumName
      })

      _this.onReachBottom()

    })

  },


//预览图片
  getImg(val) {

      let tmp = val.currentTarget.dataset.imglist
      let index = val.currentTarget.dataset.index
      let img = val.currentTarget.dataset.img
      let imgList = JSON.stringify(tmp)

      wx.navigateTo({
          url: '/pages/preview/preview?img=' + img + '&imgList=' + imgList +'&index=' + index
      })
  },

  //下载照片
  download(val) {

    let tmp = val.currentTarget.dataset.imglist
    let imgList = JSON.stringify(tmp)

    wx.navigateTo({
      url: '/pages/download/download?imgList=' + imgList
    })
  },

  //同步照片
  sync(val) {

    let tmp = val.currentTarget.dataset.imglist
    let imgList = JSON.stringify(tmp)

    wx.navigateTo({
      url: '/pages/sync/sync?imgList=' + imgList
    })
  },

  inputFocus(e) {

    let _height = e.detail.height

    if (app.isNull(_height))
      _height = 290

    this.setData({
      inputHeight: _height
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

      // base_id = > 'comment_id'
      // user_id = > 'user_id ' 
      // atuser_id  => 'user_id'

      // dynamic_id 字符串 必须    最小：1；最大：32  动态ID
      // base_id  整型  可选      回复的评论ID
      // user_id  字符串 必须    最小：1；最大：40  发送评论用户的ID
      // atuser_id  字符串 可选    最小：1；最大：40  评论接收用户ID(注：回复时必须传)
      // content  字符串 必须      评论内容

      let commentVal = this.data.commentVal

      if (commentVal.content.length == 0) return;

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Comment',
        data: { dynamic_id: commentVal.dynamic_id, user_id: userID, content: commentVal.content },
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

            let _tmp = this.data.homeList

            let _comments = res.data.data.comments.slice(0, 3)

            _tmp[commentVal.index].comments = _comments

            _tmp[commentVal.index].cmnt_count = Number.parseInt(_tmp[commentVal.index].cmnt_count) + 1


            //替换当前动态
            this.setData({
              isComment: false,
              homeList: _tmp
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
      //评论

      // dynamic_id 字符串 必须    最小：1；最大：32  动态ID
      // base_id  整型  可选      回复的评论ID
      // user_id  字符串 必须    最小：1；最大：40  发送评论用户的ID
      // atuser_id  字符串 可选    最小：1；最大：40  评论接收用户ID(注：回复时必须传)
      // content  字符串 必须      评论内容

      console.log('回复')


      if (ReplyVal.content.length == 0) return;

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Comment',
        data: { dynamic_id: ReplyVal.dynamic_id, base_id: ReplyVal.commentId, user_id: userID, atuser_id: ReplyVal.userID2, content: ReplyVal.content },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {

          console.log('回复成功')

          console.log(res.data)
          if (res.data.ret == 200) {
            //评论成功
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000
            })

            let _tmp = this.data.homeList

            let _comments = res.data.data.comments.slice(0, 3)

            _tmp[ReplyVal.index].comments = _comments

            _tmp[ReplyVal.index].cmnt_count = Number.parseInt(_tmp[ReplyVal.index].cmnt_count) + 1

            //替换当前动态
            this.setData({
              isReply: false,
              homeList: _tmp
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
    
    let empty = this.data.empty
    let userID = this.data.userID
    let photo_id = this.data.photo_id
    let page = this.data.page
    let perpage = this.data.perpage
    page++;

    wx.showLoading({
      title: '加载中',
    })

    //获取相册列表
    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_User.Home',
      data: { user_id: userID, page: page, perpage: perpage, photo_id: photo_id },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        console.log(res.data.data)

        if (res.data.ret == 200) {

          let tmp = res.data.data.home_dynamics
          console.log(tmp)


          if (tmp.length == 0 || tmp.length < 10) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          for (let i = 0; i < tmp.length; i++) {
            tmp[i].createtime = app.getDateDiff(tmp[i].createtime * 1000)
            tmp[i].comments = tmp[i].comments.slice(0, 3)
            tmp[i].cmnt_count = Number.parseInt(tmp[i].cmnt_count)
          }

          let homeList = _this.data.homeList;

          homeList = homeList.concat(tmp)


          if (homeList.length > 0) {
            empty = true
          } else {
            empty = false
          }
          console.log(empty)

          _this.setData({
            homeList: homeList,
            page: page,
            empty: empty
          })
        }

        wx.hideLoading()

      }
    })
  },

})