// pages/cover/cover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _this = this

    let photo_id = app.albumData.photoID

    app.getUser((res) => {

      let userID = res.userID

      //封面类型
      wx.request({
        method: "post",
        url: 'https://www.31un.com/api/public/?s=App.Album_Config.GetDftCovers',
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          if (res.data.ret == 200) {

            let list = res.data.data.covers
            console.log(list)

            _this.setData({
              list: list,
              userID: userID,
              photo_id: photo_id,
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


  },

  //更换封面
  replace(val) {
    let _this = this
    let cover = val.currentTarget.dataset.cover
    let userID = this.data.userID
    let photo_id = this.data.photo_id
    console.log(cover)

    // return false


    wx.request({
      method: "post",
      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Recover',
      data: { user_id: userID, photo_id: photo_id, cover: cover },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        console.log(res.data)

        if (res.data.ret == 200) {

          wx.showToast({
            title: '更换成功',
            icon: 'success',
            duration: 2000,
            complete: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })

        }
      }
    })
  },

  //上传封面
  upload() {
    let _this = this

    let userID = this.data.userID
    let photo_id = this.data.photo_id

    wx.chooseImage({
      success: function (res) {
        let tempFilePaths = res.tempFilePaths
        let img = tempFilePaths[0]
        let image = JSON.stringify({ "md5": "xxmd5md5md5md5md5md5md5md5md5md5", "filename": img })

        wx.showLoading({
          title: '上传中',
        })

        //上传文件图片签名获取
        wx.request({
          method: "post",
          url: 'https://www.31un.com/api/public/?s=App.Album_Config.UploadSign',
          data: { type: 'photo', user_id: userID, image: image },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {

            if (res.data.ret == 200) {

              let accessid = res.data.data.accessid
              let callback = res.data.data.callback
              let policy = res.data.data.policy
              let signature = res.data.data.signature
              let key = res.data.data.dir
              let filename = app.getUuid()
              let suffix = app.getFileName(img)

              const uploadTask = wx.uploadFile({
                url: 'https://img.31un.com/', //仅为示例，非真实的接口地址
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
                  if (data.ret == 200) {

                    let cover = data.data.file.filepath

                    wx.request({
                      method: "post",
                      url: 'https://www.31un.com/api/public/?s=App.Album_Photo.Recover',
                      data: { user_id: userID, photo_id: photo_id, cover: cover },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {

                        console.log(res.data)

                        if (res.data.ret == 200) {

                          wx.hideLoading()

                          wx.showToast({
                            title: '更换成功',
                            icon: 'success',
                            duration: 2000,
                            complete: function (res) {
                              wx.navigateBack({
                                delta: 1
                              })
                            }
                          })

                        }
                      }
                    })
                  }
                },
                fail: function (res) {
                  console.log(res)
                }
              })
              uploadTask.onProgressUpdate((res) => {
                console.log('上传进度', res.progress)
                console.log('已经上传的数据长度', res.totalBytesSent)
                console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
              })
            }
          }
        })

      }
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