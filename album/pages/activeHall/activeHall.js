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

  //搜索input事件
  searchInput(e){

  },

  search(e){

  },

  like(e){

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
  
      this.onShow()
  
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

    let _uploadData = app.albumData.uploadData

    if (_uploadData.data) {

      if (_uploadData.status != 1) {
        //上传队列中的文件
        this.upload()
      }
    }

  },

  upload() {

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
                        } else {
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


  //点赞
  like(val) {

    let _this = this
    let userID = this.data.userID
    let timelineList = this.data.timelineList
    let index = val.currentTarget.dataset.index
    let dynamic_id = val.currentTarget.dataset.dynamic_id
    let like_count = val.currentTarget.dataset.like_count
    let is_liked = val.currentTarget.dataset.is_liked


    if (is_liked == 1) {
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

  onShareAppMessage(e) {
    if (e.from == 'button') {
      //分享心情  
      return {
        title: this.data.name,
        path: '/pages/join/join?dynamic_id=' + e.target.dataset.id + '&invite_user=' + this.data.userID,
        imageUrl: this.data.cover
      }
    } else {
      //自带的分享
    }

  },

})