// pages/detail/detail.js

var app = getApp();
Page({
  data: {
    id: "",
    imgUrl: "",
    author: "",
    count: 0,
    count2: 0,
    title: "",
    tag: "",
    content: "",
    isOpen: 1,
    load1: "hidden",
    load2: "show",
    options: {},
    my: false,
    liked: false,
    faved: false,
    isFav: false,
    isLike: false,
    isShare: false,
    detail: {},
    userID: "",
    userName: "",
    dynamicComments: [],
    isComment: true,
    commentVal: {
      userID: '',
      dynamic_id: '',
      content: '',
    },
    // inputHeight: 800,
    inputHeight: 0,
    isReply: false,
    ReplyVal: {
      userID: '',
      userID: '',
      dynamic_id: '',
      content: '',
    },

  },
  onLoad: function (options) {
    let _this = this;

    this.setData({
      options: options
    })

    this.login = this.selectComponent("#login");

    //加载返回按钮

    let pages = getCurrentPages()

    let hasIndex = pages.filter((item)=>{
      return item.route == 'pages/index/index'
    })

    if(hasIndex == 0){
      //分享进入 加载返回首页按钮
      console.log('分享进入')
      this.setData({
        isShare: true
      })
    }else{
      console.log('首页进入')
    }

    app.getUser((res) => {

      if (res) {

        _this.setData({
          userID: res.userID,
          userName: res.name,
          isLogin: true,
        })

        wx.request({
          url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.OneWorks',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            id: options.id,
            user_id: res.userID,
          },
          method: 'POST',
          success: (data)=> {
            console.log(data.data.data)

            if (data.data.ret == 200) {

              let _tmp = data.data.data

              let my = false

              let isFav = false
              
              let isLike = false

              if (_tmp.user_id == res.userID){
                my = true
              }else{
                my = false
              }


              let favers = _tmp.collectworksList
              let likers = _tmp.likeUserList
              
              let _res = favers.filter((item)=>{
                return item.user_id == res.userID
              })

              let _res2 = likers.filter((item) => {
                return item.user_id == res.userID
              })

              if (_res.length > 0) {
                isFav = true
              } else {
                isFav = false
              }

              if (_res2.length > 0) {
                isLike = true
              } else {
                isLike = false
              }

              _this.setData({
                empty: false,
                detail: _tmp,
                my: my,
                isFav: isFav,
                isLike: isLike,
              })

              this.loadComment();
              
            }
          }
        })

        _this.login.hideLogin()

      } else {
        console.log('未登录')
        //未登录
        _this.login.showLogin()
      }

    })

    //-


    // app.detail(, function (res) {

    //   let _item = res.data;
    //   let _collect = true, _zan = true, _tag = "未设置";

    //   if (res.data2.collect == 0 || res.data2.collect == "") {
    //     _collect = false;
    //   }
    //   if (res.data2.zan == 0 || res.data2.zan == "") {
    //     _zan = false;
    //   }

    //   if (_item.userID == app.globalData.userInfo.userId) {
    //     _this.setData({
    //       my: true
    //     })
    //   }

    //   for (let i = 0; i < app.globalData.tagList.length; i++) {

    //     if (_item.tag == app.globalData.tagList[i].id) {
    //       _tag = app.globalData.tagList[i].tag;
    //       break;
    //     }

    //   }

    //   _this.setData({
    //     id: options.id,
    //     imgUrl: _item.gifUrl,
    //     count: _item.number,
    //     count2: _item.zan,
    //     author: _item.username,
    //     title: _item.title,
    //     tag: _tag,
    //     content: _item.intro,
    //     isFav: _collect,
    //     isLike: _zan,
    //     isOpen: _item.open
    //   })
    // });

    
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
          isLogin: true,
        })

        wx.request({
          url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.OneWorks',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            id: this.data.options.id,
            user_id: res.userID,
          },
          method: 'POST',
          success: function (data) {
            console.log(data.data.data)

            if (data.data.ret == 200) {

              let _tmp = data.data.data

              let my = false

              let isFav = false

              let isLike = false

              if (_tmp.user_id == res.userID) {
                my = true
              } else {
                my = false
              }

              let favers = _tmp.collectworksList
              let likers = _tmp.likeUserList

              let _res = favers.filter((item) => {
                return item.user_id == res.userID
              })

              let _res2 = likers.filter((item) => {
                return item.user_id == res.userID
              })

              if (_res.length > 0) {
                isFav = true
              } else {
                isFav = false
              }

              if (_res2.length > 0) {
                isLike = true
              } else {
                isLike = false
              }

              _this.setData({
                empty: false,
                detail: _tmp,
                my: my,
                isFav: isFav,
                isLike: isLike,
              })


              _this.loadComment();

            }
          }
        })

        _this.login.hideLogin()

      } else {
        console.log('未登录')
        //未登录
        _this.login.showLogin()
      }

    })
    this.login.hideLogin()
  },

  onShow: function () {
    
  },

  showImg: function () {

    let _this = this;

    console.log(_this.data.detail.gif_url)

    wx.getStorage({
      key: 'isShareImg',
      success: function (res) {
        // success
        wx.previewImage({
          current: _this.data.detail.gif_url, // 当前显示图片的http链接
          urls: [_this.data.detail.gif_url], // 需要预览的图片http链接列表
          success: (e)=>{
            console.log(_this.data.detail.gif_url)
            console.log('加载成功')
            console.log(e)
          },
          fail: (e) => {
            console.log('加载失败')
            console.log(e)
          },
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '长按图片或点击右上角，选择发送给好友',
          complete: function (res) {
            wx.previewImage({
              current: _this.data.detail.gif_url, // 当前显示图片的http链接
              urls: [_this.data.detail.gif_url] // 需要预览的图片http链接列表
            })
            wx.setStorage({
              key: 'isShareImg',
              data: 'true'
            })
          }
        })
      },
    })


  },

  download(){
    wx.downloadFile({
      url: this.data.detail.gif_url,
      success: function (res) {

        if (res.statusCode === 200) {

          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (res2) {
                wx.showToast({
                  title: '下载成功',
                  icon: 'success',
                  duration: 2000
                })
            },
            fail: function (res) {
              console.log(res)
              console.log('fail')
            }
          })

        }
      }
    })
  },

  toHome() {
    this.toPage('pages/index/index')
  },

  toPage(url) {

    let _url = url
    let pages = getCurrentPages()
    if (pages.length > 1) {
      if (pages[pages.length - 2].route == _url) {
        //返回
        wx.navigateBack({
          delta: 1,
        })
      } else {
        //跳转
        wx.navigateTo({
          url: '/' + _url,
        })
      }
    } else {
      //跳转
      wx.navigateTo({
        url: '/' + _url,
      })
    }
  },

  fav: function (e) {
    if (this.data.faved) {
      wx.showToast({
        title: '操作频繁，请稍后再试',
        icon: 'none'
      })
      return false;
    }

    let _this = this;
    let _type = e.currentTarget.dataset.type;
    let formId = e.detail.formId

    if (app.isNull(formId)) {
      formId = ''
    } else {
      if (formId == 'the formId is a mock one') {
        formId = ''
      }
    }

    let _detail = this.data.detail
    let isFav = false

    if (_type == 1) {
      _detail.collection_number = Number.parseInt(_detail.collection_number) + 1
      isFav = true
    } else {
      _detail.collection_number = Number.parseInt(_detail.collection_number) - 1
      isFav = false
      if (_detail.collection_number <= 0) {
        _detail.collection_number = 0
      }
    }

    this.setData({
      detail: _detail,
      isFav: isFav,
      faved: true,
    })

    wx.request({
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.CollectWorks',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { works_id: this.data.detail.id, user_id: this.data.userID, form_id:formId },
      method: 'POST',
      success: function (res) {

        if (res.data.ret == 200) {
          setTimeout(() => {
            _this.setData({
              faved: false
            })
          }, 3000)
        }

      }
    })


  },
  like: function (e) {

    if (this.data.liked){
      wx.showToast({
        title: '操作频繁，请稍后再试',
        icon: 'none'
      })
      return false;
    }

    let _this = this;
    let _type = e.currentTarget.dataset.type;
    let formId = e.detail.formId

    if (app.isNull(formId)) {
      formId = ''
    } else {
      if (formId == 'the formId is a mock one') {
        formId = ''
      }
    }

    let _detail = this.data.detail
    let isLike = false

    if(_type == 1){
      _detail.like_number = Number.parseInt(_detail.like_number) + 1
      isLike = true
    }else{
      _detail.like_number = Number.parseInt(_detail.like_number) - 1
      isLike = false
      if (_detail.like_number <=0){
        _detail.like_number = 0
      }
    }

    this.setData({
      detail: _detail,
      isLike: isLike,
      liked: true,
    })

    wx.request({
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.LikeWorks',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { works_id: this.data.detail.id, user_id: this.data.userID, form_id: formId },
      method: 'POST',
      success: function (res) {

        if (res.data.ret == 200) {
          setTimeout(()=>{
            _this.setData({
              liked: false
            })
          },3000)
        }

      }
    })

  },

  publish: function () {

    let _this = this;

    wx.navigateTo({
      url: '../publish/publish?gifID=' + _this.data.id
    })
  },

  del: function (e) {

    let _this = this

    let msg = ''

    if (this.data.liked) {
      wx.showToast({
        title: '操作频繁，请稍后再试',
        icon: 'none'
      })
      return false;
    }

    let _type = e.currentTarget.dataset.type;

    let _detail = this.data.detail

    if (_type == 0) {
      _detail.status = 0
      msg = '下架作品后仅自己可见'
    } else {
      _detail.status = 1
      msg = '发布到大厅后所有人可见'
    }

    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

          if (_type == 0) {
            _detail.status = 0
          } else {
            _detail.status = 1
          }

          _this.setData({
            detail: _detail,
            liked: true
          })

          wx.request({
            url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.RenewStatus',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: { id: _this.data.detail.id, user_id: _this.data.userID },
            method: 'POST',
            success: function (res) {

              if (res.data.ret == 200) {
                setTimeout(() => {
                  _this.setData({
                    liked: false
                  })
                }, 3000)
              }

            }
          })


        } else if (res.cancel) {
          
        }
      }
    })

    
  },

  loaded: function () {
    this.setData({
      load1: "show",
      load2: "hidden"
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
    this.setData({
      inputHeight: 0
    })
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

    let formId = val.detail.formId

    if (formId == 'the formId is a mock one'){
      console.log('本地测试')
      formId = ''
    }

    let userID = this.data.userID

    //评论

    let commentVal = this.data.commentVal

    if (commentVal.content.length == 0) return;

    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Reply.Store',
      data: { user_id: userID, works_id: this.data.options.id, content: commentVal.content, form_id: formId },
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

          let commentVal = this.data.commentVal

          commentVal.content = ''

          this.setData({
            isRefresh: true,
            commentVal: commentVal
          })

          this.loadComment()
        }
      }
    })

  },

  /**
   * 评论
   */
  comment(val) {

    let dynamic_id = this.options.id
    let index = val.currentTarget.dataset.index
    let userID = this.data.userID

    let _tmp = this.data.commentVal

    _tmp.dynamic_id = dynamic_id
    _tmp.index = index
    _tmp.userID = userID

    this.setData({
      commentVal: _tmp
    })

  },


  /**
  * 回复
  */
  reply(val) {

    let _this = this;

    let dynamic_id = this.options.id
    let index = val.currentTarget.dataset.index
    let userName = val.currentTarget.dataset.username || val.currentTarget.dataset.userName
    let commentId = val.currentTarget.dataset.commentId || val.currentTarget.dataset.commentid
    let userName2 = this.data.userName
    let _tmp = this.data.ReplyVal

    if (userName2 == userName) {
      wx.showModal({
        title: '提示',
        content: '是否删除该条评论',
        showCancel: true,
        success(res) {
          if (res.confirm) {

            wx.request({
              method: "post",
              url: app.globalData.requestUrl + '?s=Doodle.Paint_Reply.Destroy',
              data: { reply_id: commentId, user_id: _this.data.userID },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {
                console.log(res.data)
                if (res.data.ret == 200) {
                  //评论成功
                  wx.showToast({
                    title: '删除评论成功',
                    icon: 'success',
                    duration: 2000
                  })

                  _this.setData({
                    isRefresh: true
                  })

                  _this.loadComment()

                }
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {

      _tmp.dynamic_id = dynamic_id
      _tmp.index = index
      _tmp.userName = userName
      _tmp.commentId = commentId

      this.setData({
        isComment: false,
        ReplyVal: _tmp
      })
    }

  },

  setReply(val) {

    let formId = val.detail.formId

    if (app.isNull(formId)){
      formId = ''
    }else{
      if (formId == 'the formId is a mock one') {
        formId = ''
      }
    }

    let ReplyVal = this.data.ReplyVal

    this.setData({
      isComment: true
    })

    if (ReplyVal.content.length == 0) return;

    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Reply.Store',
      data: { user_id: this.data.userID, works_id: this.options.id, reply_id: ReplyVal.commentId, content: ReplyVal.content, form_id: formId },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {

        if (res.data.ret == 200) {
          //回复成功
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 2000
          })

          let ReplyVal = this.data.ReplyVal

          ReplyVal.content = ''

          this.setData({
            isRefresh: true,
            ReplyVal: ReplyVal
          })

          this.loadComment()
        }
      }
    })

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
   * 加载所有评论
   */
  loadComment() {
    //加载评论
    wx.request({
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Reply.Index',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        works_id: this.data.options.id,
        user_id: this.data.userID,
        page: 1,
        pageSize: 999,
      },
      method: 'POST',
      success: (data) => {
        this.setData({
          dynamicComments: data.data.data
        })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '嘿，猜猜我画了啥',
      desc: '嘿，猜猜我画了啥',
    }
  }

})