// pages/make/make.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: false,
    isLogin: false,
    userID: "",
    newName: "",
    page: 0,
    perpage: 10,
    timelineList: [],
    disable: false,
    is_admin: false,
    allow_comment: 0,     // 0禁用 | 1启用
    users: [],
    type: 0,
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
    isUpload: false,
    plan: 0,
    uploadPlan: 0,
    uploadLength: 0,
    wallList: [],
    from_time: "",
    to_time: "",
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    //这个页面需要登录

    this.setData({
      options: options
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

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })

    //判断options
    let options = this.data.options
    let photo_id = options.photo_id
    let invite_user = options.invite_user

    if (!app.isNull(photo_id)) {
      //分享进入  
      this.initLoad()
    } else {
      //普通进入
      this.initShow()
    }

    this.login.hideLogin()
  },

  initLoad(){

    //判断是否是自己

    let _this = this

    let options = this.data.options

    let photo_id = options.photo_id
    let invite_user = options.invite_user

    console.log('initLoad')

    if (!app.isNull(photo_id)) {
      _this.setData({
        invite_user: invite_user,
      })

      app.getUser((res) => {

        if (res) {

          let userID = res.userID
          let myHead = res.head

          _this.setData({
            userID: userID,
          })


          if (invite_user != userID) {
            // console.log('邀请者')

            _this.setData({
              userID: userID,
              photo_id: photo_id,
              myHead: myHead,
              page: 0,
              timelineList: [],
              wallList: [],
              disable: false
            })


            //邀请
            wx.request({
              method: "post",
              url: 'https://www.31un.com/api/public/?s=App.Album_User.InviteRec',
              data: { invite_user: invite_user, beinvited_user: userID, photo_id: photo_id, way: '0' },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {

                // console.log(res.data.data)

                if (res.data.ret == 200) {

                  // console.log('邀请成功')

                  //获取相册详情
                  wx.request({
                    method: "post",
                    url: 'https://www.31un.com/api/public/?s=App.Album_Photo.GetPhotoInfo',
                    data: { user_id: invite_user, photo_id: photo_id },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {

                      // console.log(res.data.data)

                      if (res.data.ret == 200) {

                        let cover = res.data.data.cover
                        let mem_count = res.data.data.mem_count
                        let img_count = res.data.data.img_count
                        let name = res.data.data.name
                        let length = name.length

                        //是否管理员(0:不是 1:是)
                        let is_admin = res.data.data.is_admin

                        let photo_id = res.data.data.photo_id

                        let users = res.data.data.users

                        if (img_count > 0) {
                          var empty = true

                          _this.onReachBottom()

                        } else {
                          var empty = false
                        }
                        _this.setData({
                          cover: cover,
                          name: name,
                          mem_count: mem_count,
                          img_count: img_count,
                          empty: empty,
                          is_admin: is_admin,
                          length: length,
                          users: users
                        })
                      }
                    }
                  })
                }
              }
            })
          }else{
            this.initShow()
          }
        } else {

          //未登录
          this.login.showLogin()
        }

      })
    }
  },

  initShow(){

    let _uploadData = app.albumData.uploadData

    if (_uploadData.data) {

      if (_uploadData.status != 1) {
        //上传队列中的文件
        this.upload()
      }
    }

    let _this = this

    let photo_id = app.albumData.photoID
    let invite_user = this.data.invite_user

    if (app.isNull(photo_id)) {
      // console.log('分享进来的')
      return false
    }

    app.getUser((res) => {

      let userID = res.userID
      let myHead = res.head

      if (!app.isNull(invite_user)) {
        if (invite_user == userID) {
          // console.log('同一个人')
        } else {
          // console.log('不同的人')
          return false
        }
      }

      _this.setData({
        userID: userID,
        photo_id: photo_id,
        myHead: myHead,
        page: 0,
        timelineList: [],
        wallList: [],
        disable: false
      })

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Photo.GetPhotoInfo',
        data: { user_id: userID, photo_id: photo_id },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          // console.log(res.data.data)

          if (res.data.ret == 200) {

            let cover = res.data.data.cover
            let mem_count = res.data.data.mem_count
            let img_count = res.data.data.img_count
            let name = res.data.data.name
            let length = name.length

            //是否管理员(0:不是 1:是)
            let is_admin = res.data.data.is_admin

            let photo_id = res.data.data.photo_id

            let users = res.data.data.users

            if (img_count > 0) {
              var empty = true

              _this.onReachBottom()

            } else {
              var empty = false
            }

            _this.setData({
              cover: cover,
              name: name,
              mem_count: mem_count,
              img_count: img_count,
              empty: empty,
              is_admin: is_admin,
              length: length,
              users: users
            })

          }

        }
      })

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

    this.login = this.selectComponent("#login");

    app.getUser((res) => {

      if (res) {
        this.setData({
          isLogin: true,
        })

        //判断options
        let options = this.data.options
        let photo_id = options.photo_id
        let invite_user = options.invite_user

        if (!app.isNull(photo_id)) {
          //分享进入  
          this.initLoad()
        } else {
          //普通进入
          this.initShow()
        }

        this.login.hideLogin()

      } else {
        //未登录
        this.login.showLogin()
      }

    })

  },

  upload(){

    let _this = this

    let _uploadData = app.albumData.uploadData

    let userID = _uploadData.param.userID
    let photo_id = _uploadData.param.photo_id
    let tmp = _uploadData.data
    let emotion = _uploadData.param.emotion

    let lng = _uploadData.param.lng
    let lat = _uploadData.param.lat
    let sync = _uploadData.param.sync
    let location = _uploadData.param.location

    this.setData({
      isUpload: true,
      uploadLength: tmp.length
    })

    for (let i = 0; i < tmp.length; i++) {

      let img = tmp[i].path

      let image = JSON.stringify({ "md5": "xxmd5md5md5md5md5md5md5md5md5md5", "filename": img })


      // return false

      //上传文件图片签名获取
      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Config.UploadSign',
        data: { type: 'photo', user_id: userID, image: image },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          // console.log(res)

          if (res.data.ret == 200) {

            let accessid = res.data.data.accessid
            let callback = res.data.data.callback
            // let host = res.data.data.host
            let policy = res.data.data.policy
            let signature = res.data.data.signature
            let key = res.data.data.dir
            // let filepath = res.data.data.new_img.filepath

            let filename = app.getUuid()
            let suffix = app.getFileName(img)


            // return false

            const uploadTask = wx.uploadFile({
              url: 'https://img.31un.com/',
              filePath: img,
              name: 'file',
              formData: {
                'callback': callback,
                'key': key + filename + '.' + suffix,
                'policy': policy,
                'OSSAccessKeyId': accessid,
                'signature': signature,
                'success_action_status': '200'
              },
              success: function (res) {

                let data = JSON.parse(res.data)

                // console.log(data.data.file)
                // console.log(data.ret)

                if (data.ret == 200) {

                  let filepath = data.data.file.filepath

                  let upload_time = data.data.file.upload_time

                  _uploadData.images.push({ "upload_time": upload_time, "filepath": filepath })

                  //-

                  let _plan = _this.data.uploadPlan + 1

                  if (_plan == _this.data.uploadLength) {

                    //上传完毕
                    _this.setData({
                      isUpload: false,
                      plan: 0,
                      uploadPlan: 0,
                      uploadLength: 0,
                    })

                    // console.log('上传的图片地址')

                    // console.log({ user_id: userID, photo_id: photo_id, emotion: emotion, location: location, lng: lng, lat: lat, images: JSON.stringify(_uploadData.images), sync: sync });

                    //发布动态
                    wx.request({
                      method: "post",
                      url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Create',
                      data: { user_id: userID, photo_id: photo_id, emotion: emotion, location: location, lng: lng, lat: lat, images: JSON.stringify(_uploadData.images), sync: sync },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        // console.log('发表一条动态')
                        // console.log(res)

                        if (res.data.ret == 200) {


                          //将当前的任务移除
                          app.albumData.uploadData = {}

                          wx.showToast({
                            title: '上传成功',
                            icon: 'success',
                            duration: 2000
                          })

                          //更新
                          _this.initShow()
                        }else{
                          wx.showToast({
                            title: '上传失败',
                            icon: 'none',
                            duration: 2000
                          })
                          _this.initShow()
                        }
                      }, fail: function (res) {
                       
                          wx.showToast({
                            title: '上传失败',
                            icon: 'none',
                            duration: 2000
                        })
                        _this.initShow()
                      },
                    })


                  } else {
                    _this.setData({
                      uploadPlan: _plan,
                      plan: _this.twoDecimal(_plan / _this.data.uploadLength) * 100
                    })
                  }

                  // return false
                  //相册分类类型
                
                }
              },
              fail: function (res) {
                // console.log(res)
              }
            })
            uploadTask.onProgressUpdate((res) => {
              //这个函数好像没什么卵用
              if (res.progress == 100 || res.progress == '100') {
              }
            })
          }
        }
      })

    }

    wx.hideLoading()
  },

  twoDecimal(oNum) {
    var num = parseFloat(oNum);
    var num = Math.round(oNum * 100) / 100;
    return num;
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

            let _tmp = this.data.timelineList

            let _comments = res.data.data.comments.slice(0, 3)

            _tmp[commentVal.index].comments = _comments

            _tmp[commentVal.index].cmnt_count = Number.parseInt(_tmp[commentVal.index].cmnt_count) + 1

            //替换当前动态
            this.setData({
              isComment: false,
              timelineList: _tmp
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

            let _tmp = this.data.timelineList

            let _comments = res.data.data.comments.slice(0, 3)

            _tmp[ReplyVal.index].comments = _comments

            _tmp[ReplyVal.index].cmnt_count = Number.parseInt(_tmp[ReplyVal.index].cmnt_count) + 1

            //替换当前动态
            this.setData({
              isReply: false,
              timelineList: _tmp
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

    let _this = this
    let userID = this.data.userID
    let timelineList = this.data.timelineList
    let index = val.currentTarget.dataset.index
    let dynamic_id = val.currentTarget.dataset.dynamic_id
    let like_count = val.currentTarget.dataset.like_count
    let is_liked = val.currentTarget.dataset.is_liked
    

    if (is_liked == 1){
      return false
    }

    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Dynamic.Like',
      data: { dynamic_id: dynamic_id, user_id: userID },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res.data)
        if (res.data.ret == 200) {

          timelineList[index].is_liked = 1

          timelineList[index].like_count = parseInt(like_count) + 1

          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })

          _this.setData({
            timelineList: timelineList
          })
        }
      }
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
    let name = this.data.name

    wx.navigateTo({
      url: '/pages/sync/sync?imgList=' + imgList + '&albumName=' + name
    })
  },

  //删除照片
  delete(val) {

    let tmp = val.currentTarget.dataset.imglist
    let dynamic_id = val.currentTarget.dataset.dynamic_id
    let photo_id = val.currentTarget.dataset.photo_id
    let imgList = JSON.stringify(tmp)
    
    wx.navigateTo({
      url: '/pages/delete/delete?imgList=' + imgList + '&dynamic_id=' + dynamic_id + '&photo_id=' + photo_id
    })
  },

  showMsg() {

    return false;

    wx.showModal({
      title: '提示',
      content: '你不是管理员',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  //编辑相册
  editCover(){
    if (this.data.is_admin == false){
      this.showMsg()
      return
    }

    wx.navigateTo({
      url: '/pages/cover/cover'
    })

  },

  //显示设置相册名称
  showName() {

    if (this.data.is_admin == false) {
      this.showMsg()
      return
    }

    this.setData({
      albumName: true
    })
  },
  //取消设置相册名称
  cancelName() {
    this.setData({
      albumName: false
    })
  },
  //修改相册名称
  setName() {

    let _this = this

    let userID = this.data.userID
    let photo_id = this.data.photo_id
    let name = this.data.newName

    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Rename',
      data: { user_id: userID, photo_id: photo_id, name: name },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res)
        if (res.data.ret == 200) {

          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })

          _this.setData({
            albumName: false,
            name: name
          })

        }
      }
    })

  },
  //获取相册名称字符长度
  bindKeyInput: function (e) {

    let name = e.detail.value
    let length = e.detail.value.length

    this.setData({
      newName: name,
      length: length
    })
  },

  //选择时间轴或是照片墙
  select(val) {
    let _this = this
    let type = val.currentTarget.dataset.type

    _this.setData({
      type: type,
      page: 0,
      timelineList: [],
      wallList: [],
      disable: false
    })

    _this.onReachBottom()

  },


  //选择时间轴或是照片墙
  select2(type) {
    let _this = this

    _this.setData({
      type: type,
      page: 0,
      timelineList: [],
      wallList: [],
      disable: false
    })

    _this.onReachBottom()

  },

  back() {
    wx.switchTab({
      url: '/pages/index/index'
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

    let type = this.data.type
    let userID = this.data.userID
    let photo_id = this.data.photo_id
    let page = this.data.page
    let perpage = this.data.perpage
    page++;

    wx.showLoading({
      title: '加载中',
    })

    //type为0是时间轴1是照片墙
    if (type == 0) {
      //获取时间轴列表
      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Photo.TimeLine',
        data: { user_id: userID, photo_id: photo_id, page: page, perpage: perpage },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)

          if (res.data.ret == 200) {

            let tmp = res.data.data
            // console.log(tmp)

            if (tmp.length == 0 || tmp.length < 10) {
              // console.log('暂无更多数据')
              _this.setData({
                disable: true,
              })
            }

            for (let i = 0; i < tmp.length; i++) {
              tmp[i].createtime = app.getDateDiff(tmp[i].createtime * 1000)
              tmp[i].comments = tmp[i].comments.slice(0, 3)
              tmp[i].cmnt_count = Number.parseInt(tmp[i].cmnt_count)
            }

            let timelineList = _this.data.timelineList;


            timelineList = timelineList.concat(tmp)

            _this.setData({
              timelineList: timelineList,
              page: page
            })


          }
          wx.hideLoading()
        }
      })
    } else {
      //获取照片墙列表

      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Wall',
        data: { user_id: userID, photo_id: photo_id, from_time: this.data.from_time, to_time: this.data.to_time },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          if (res.data.ret == 200) {

            let tmp = res.data.data.wall_data
            // console.log(tmp)

            if (tmp.length == 0 || tmp.length < 10) {
              // console.log('暂无更多数据')
              _this.setData({
                disable: true,
              })
            }

            let wallList = _this.data.wallList;

            wallList = wallList.concat(tmp)

            _this.setData({
              wallList: wallList,
            })
          }
          wx.hideLoading()
        }
      })
    }
  },

  onShareAppMessage(e){
    if(e.from == 'button'){
      //分享心情  
      return {
        title: this.data.name,
        path: '/pages/join/join?dynamic_id=' + e.target.dataset.id +'&invite_user=' + this.data.userID,
        imageUrl: this.data.cover
      }
    }else{
      //自带的分享
    }

  },

})