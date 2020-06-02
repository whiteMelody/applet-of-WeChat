//index.js
//获取应用实例
var app = getApp();
var bMouseIsDown = false, ctx, iX, iY, iLastX, iLastY, img_arr = [], op_arr = [], del_arr = [], i1, i2, interval, opId = 0, isTimer = false, interval2, drawTime = 0;
Page({

  data: {
    color: "#000000",
    lineWidth: 3,
    zIndex: 1,
    imgUrl: "",
    img: "",
    width: "",
    width2: "",
    margin: "",
    height: "",
    isLoaded: false,
    showForm: false,
    hidden: true,
    colorBar: false,
    index: 0,
    tag: "",
    gifID: "",
    type: "1",
    tags: [],
    tags2: [],
    status: 0,
    step: 0,
    colors: [
      { color: '000000', select: true },
      // { color: 'eeeeee', select: false },  画布颜色，等于橡皮擦效果
      { color: '751313', select: false },
      { color: 'f81e00', select: false },
      { color: 'ff8f00', select: false },
      { color: 'f4bb00', select: false },
      { color: '96ff0c', select: false },
      { color: '33ff1c', select: false },
      { color: '12b200', select: false },
      { color: '027224', select: false },
      { color: '28eeba', select: false },
      { color: '3cd2fb', select: false },
      { color: '19a8ff', select: false },
      { color: '3960ff', select: false },
      { color: '4d34ff', select: false },
      { color: '6700fd', select: false },
      { color: '9200e1', select: false },
      { color: 'c800bf', select: false },
      { color: 'f80068', select: false },
      { color: 'ff0008', select: false }

    ],
    drawData: {},
    sysVerify: false,
  },
  onLoad: function (options) {

    

  },

  onShow: function () {

    let _this = this;
    
    wx.getSystemInfo({
      success: function (res) {
        let [width, height] = [res.windowWidth, res.windowHeight];

        let width2 = (res.windowWidth - 90) / 6;

        _this.setData({
          'width': width - width2,
          'width2': width2,
          'margin': 15,
          'height': height + 50,
          'color': "#000000",
        })
      }
    })

    let ctx = wx.createCanvasContext('myCanvas');
    //圆角结束，圆角相交
    ctx.setLineJoin('round');
    ctx.setLineCap('round');

    app.getConfig((flag1, flag2) => {
      this.setData({
        sysVerify: flag1
      })

      if (flag1 == false) {
        this.setData({
          isLoaded: true
        })
      } else {

        let _this = this;

        this.login = this.selectComponent("#login");

        app.getUser((res) => {

          if (res) {

            _this.setData({
              userID: res.userID,
              isLogin: true,
            })

            _this.login.hideLogin()

            wx.getStorage({
              key: 'drawMsg',
              success: function (res) {
                _this.setData({
                  'step': 0,
                  isLoaded: true
                })
              },
              fail: function () {
                _this.setData({
                  'step': 1
                })
                wx.setStorage({
                  key: 'drawMsg',
                  data: '0'
                })
              },
              complete: function () {
                // complete
              }
            })

          } else {
            console.log('未登录')
            //未登录
            _this.login.showLogin()
          }

        })

        // 加载标签

        wx.request({
          url: app.globalData.requestUrl + '?s=Doodle.Paint_Config.LabelList',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {},
          method: 'POST',
          success(res) {
            if (res.data.ret == 200) {
              _this.setData({
                tags: res.data.data.labelList
              })
            }
          }
        })

        

    // let [_x1, _y1, _width, _height, grd] = [0, 0, this.data.width / 8, this.data.height / 8];

    // for (let i = 0; i < 4; i++) {
    //   _y1 += _height;
    //   for (let j = 0; j < 4; j++) {
    //     let grd = ctx.createLinearGradient(_x1, _y1, _width, _height);
    //     grd.addColorStop(0, 'purple')
    //     grd.addColorStop(0.2, 'orange')
    //     grd.addColorStop(0.4, 'yellow')
    //     grd.addColorStop(0.6, 'green')
    //     grd.addColorStop(0.8, 'cyan')
    //     grd.addColorStop(1, 'blue')
    //     _x1 += _width;
    //     ctx.setStrokeStyle(grd);
    //     console.log(_x1+","+_y1);
    //   }
    // }


    //  _this.addImg();
        

      }

    })

   
  },

  closeForm(){
    this.setData({
      showForm: false
    })
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

        wx.getStorage({
          key: 'drawMsg',
          success: function (res) {
            _this.setData({
              'step': 0
            })
          },
          fail: function () {
            _this.setData({
              'step': 1
            })
            wx.setStorage({
              key: 'drawMsg',
              data: '0'
            })
          },
          complete: function () {
            // complete
          }
        })

      } else {
        //未登录
        this.login.showLogin()
      }
    })
    this.login.hideLogin()
  },


  touchStart: function (e) {
    bMouseIsDown = true;
    del_arr = [];
    opId++;
    iLastX = e.changedTouches[0].x
    iLastY = e.changedTouches[0].y

    // var grd = ctx.createLinearGradient(0, 0, this.data.width, 1);
    //   grd.addColorStop(0, 'purple')
    //     grd.addColorStop(0.2, 'orange')
    //     grd.addColorStop(0.4, 'yellow')
    //     grd.addColorStop(0.6, 'green')
    //     grd.addColorStop(0.8, 'cyan')
    //     grd.addColorStop(1, 'blue')
    // ctx.setStrokeStyle(grd);

    ctx.setStrokeStyle(this.data.color);

    ctx.setLineWidth(this.data.lineWidth);
    ctx.beginPath();
    // img_arr = [];
    // op_arr = [];
    i1 = 0;

    isTimer = true;

  },
  touchMove: function (e) {
    let _this = this;

    if (bMouseIsDown) {

      [iX, iY] = [e.changedTouches[0].x, e.changedTouches[0].y];
      ctx.moveTo(iLastX, iLastY);
      ctx.lineTo(iX, iY);
      op_arr.push({
        iLastX: iLastX,
        iLastY: iLastY,
        iX: iX,
        iY: iY,
        color: _this.data.color,
        lineWidth: _this.data.lineWidth,
        opId: opId
      })

      ctx.stroke();
      iLastX = iX;
      iLastY = iY;

      wx.drawCanvas({
        canvasId: 'myCanvas',
        reserve: true,
        actions: ctx.getActions() // 获取绘图动作数组
      })

    }
  },
  touchEnd: function () {
    
  },
  saveImg: function (e) {

    var _this = this;

    var i2 = 0;

    var _color = "", _lineWidth = "";

    if (op_arr.length == 0) {

      return false;
    }

    bMouseIsDown = false;
    iLastX = -1;
    iLastY = -1;

    clearInterval(interval);

    ctx.draw();

    //圆角结束，圆角相交

    interval2 = setInterval(function () {

      if (i2 > op_arr.length - 1) {
        clearInterval(interval2);
        return false;
      }
      var _item = op_arr[i2];

      if (_color != _item.color) {
        ctx.setLineJoin('round');
        ctx.setLineCap('round');
        ctx.setStrokeStyle(_item.color);
        ctx.beginPath();
      }

      if (_lineWidth != _item.lineWidth) {
        ctx.setLineWidth(_item.lineWidth);
        ctx.beginPath();
      }

      ctx.moveTo(_item.iLastX, _item.iLastY);
      ctx.lineTo(_item.iX, _item.iY);
      ctx.stroke();
      wx.drawCanvas({
        canvasId: 'myCanvas',
        reserve: true,
        actions: ctx.getActions() // 获取绘图动作数组
      })

      i2++;

    }, 20);

    let _status = e.currentTarget.dataset.type;

    this.setData({
      isLoaded: false,
      status: _status,
      drawData: {
        width: _this.data.width,
        height: _this.data.height,
        color: _this.data.color,
        lineWidth: _this.data.lineWidth,
        paths: op_arr,
        time: 20,
      }
    })

    // if (op_arr.length >= 1000) {
    //   wx.showToast({
    //     title: '制作的图片过大，请重画',
    //     icon: 'error',
    //     duration: 2000
    //   })
    //   return false;
    // }

    // wx.getNetworkType({
    //   success: function(res) {
    //     if(res.networkType != "wifi"){
    //        wx.showModal({
    //         title: '提示',
    //         showCancel: false,
    //         content: '非wifi情况下传输图片，确定继续吗',
    //         complete: function (res222) {

    //         }
    //       })
    //     }
        
    //   }
    // })

    //弹出form

    this.setData({
      showForm: true
    })

    // app.getGif2(_this.data.width, _this.data.height, _this.data.color, _this.data.lineWidth, op_arr, 20, "", function (res) {

    //   _this.setData({
    //     hidden: true,
    //     imgUrl: res.url
    //   })

    //   if (res) {
    //     if (_type == "1" || _type == 1) {

    //       wx.getStorage({
    //         key: 'isShareImg',
    //         success: function (res333) {
    //           // success
    //         },
    //         fail: function () {
    //           wx.showModal({
    //             title: '提示',
    //             content: '长按图片或点击右上角，选择发送给好友',
    //             complete: function (res222) {
    //               wx.previewImage({
    //                 current: res.url, // 当前显示图片的http链接
    //                 urls: [res.url] // 需要预览的图片http链接列表
    //               })
    //               wx.setStorage({
    //                 key: 'isShareImg',
    //                 data: 'true'
    //               })
    //             }
    //           })
    //         },
    //         success: function () {
    //           wx.previewImage({
    //             current: res.url, // 当前显示图片的http链接
    //             urls: [res.url] // 需要预览的图片http链接列表
    //           })
    //         }
    //       })

    //     } else {
    //       wx.navigateTo({
    //         url: '../publish/publish?gifID=' + res.gifID
    //       })
    //     }
    //   }
    // })


  },

  download(url) {
    wx.downloadFile({
      url: url,
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


  bindPickerChange: function (e) {
    let _this = this;
    _this.setData({
      'index': e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      'type': e.detail.value
    })
  },
  formSubmit: function (e) {

    wx.showLoading({
      title: '图片生成中',
    })

    let values = e.detail.value;

    let _this = this;

    wx.request({
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.Create',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: this.data.userID,
        title: values.title,
        status: this.data.status,
        type: this.data.type,
        label: this.data.tags[this.data.index],
        introduction: values.content,
        worksMessage: JSON.stringify(this.data.drawData),
      },
      method: 'POST',
      success(data) {
        console.log(data)

        if(data.data.ret == 200){
          //提交成功
          let imgUrl = data.data.data.gif_url

          wx.showToast({
            title: '图片生成成功',
            icon: 'success',
            duration: 1500
          })

          _this.download(imgUrl)

          // wx.getStorage({
          //   key: 'isShareImg',
          //   success: function (res333) {
          //     // success
          //     wx.previewImage({
          //       current: imgUrl, // 当前显示图片的http链接
          //       urls: [imgUrl] // 需要预览的图片http链接列表
          //     })
          //   },
          //   fail: function () {
          //     wx.showModal({
          //       title: '提示',
          //       content: '长按图片或点击右上角，选择发送给好友',
          //       complete: function (res222) {
          //         wx.previewImage({
          //           current: imgUrl, // 当前显示图片的http链接
          //           urls: [imgUrl] // 需要预览的图片http链接列表
          //         })
          //         wx.setStorage({
          //           key: 'isShareImg',
          //           data: 'true'
          //         })
          //       }
          //     })
          //   },
          //   success: function () {
          //     wx.previewImage({
          //       current: imgUrl, // 当前显示图片的http链接
          //       urls: [imgUrl] // 需要预览的图片http链接列表
          //     })
          //   }
          // })

        }else{
          //提交失败
          wx.showToast({
            title: '图片生成失败，请重试',
            icon: 'none',
            duration: 1500
          })
        }
        
      }, complete(){
        wx.hideLoading()
        _this.setData({
          isLoaded: true,
          showForm: false
        })

        _this.clear();
      }
    })

    // app.publish(_this.data.gifID, _this.data.tag, values.title, values.content, _this.data.type, function (res) {

    //   if (res) {
    //     wx.showToast({
    //       title: '提交成功，页面跳转中',
    //       icon: 'success',
    //       duration: 2000,
    //       complete: function () {
    //         setTimeout(function () {
    //           wx.navigateBack({
    //             delta: 1
    //           })
    //         }, 2000)

    //       }
    //     })

    //   } else {
    //     wx.showToast({
    //       title: '提交失败',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //   }


    // })

  },

  toHome(){
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

  clear: function () {
    bMouseIsDown = false;
    iLastX = -1;
    iLastY = -1;
    img_arr = [];
    op_arr = [];
    i1 = 0;
    isTimer = true;
    clearInterval(interval);
    clearInterval(interval2);
    ctx.draw();
  },

  changeColor: function (e) {

    let _tmp = this.data.colors;

    for (var i = 0; i < _tmp.length; i++) {
      _tmp[i].select = false;
    }
    _tmp[e.currentTarget.dataset.index].select = true;

    this.setData({
      'color': e.currentTarget.dataset.color,
      'colors': _tmp
    })

  },

  prev: function () {

    //判断是否能够撤销
    if (opId == 0 || op_arr.length == 0)
      return;

    let [arr, _color, _this] = [[], "", this];

    for (let i = 0; i < op_arr.length; i++) {
      if (opId != op_arr[i].opId) {
        arr.push(op_arr[i]);
      } else {
        //临时数组,带下标
        del_arr.push(op_arr[i]);
      }
    }

    opId--;

    op_arr = arr;

    this.draw();

  },

  next: function () {

    //判断是否能够恢复
    let _flag = false;

    opId++;

    for (let i = 0; i < del_arr.length; i++) {
      if (opId == del_arr[i].opId) {
        _flag = true;
        break;
      }
    }

    if (_flag) {
      //进行恢复
      for (let i = 0; i < del_arr.length; i++) {
        if (opId == del_arr[i].opId) {
          op_arr.push(del_arr[i]);
        }

      }
      this.draw();
    } else {
      //不能恢复
      opId--;
      return;
    }

  },

  draw: function () {
    let [_color, _lineWidth, _this] = ["", "", this];

    ctx.draw();

    for (let i = 0; i < op_arr.length; i++) {

      let _item = op_arr[i];
      if (_color != _item.color) {
        ctx.setLineJoin('round');
        ctx.setLineCap('round');
        ctx.setStrokeStyle(_item.color);
        ctx.beginPath();
      }

      if (_lineWidth != _item.lineWidth) {
        ctx.setLineWidth(_item.lineWidth);
        ctx.beginPath();
      }

      ctx.moveTo(_item.iLastX, _item.iLastY);
      ctx.lineTo(_item.iX, _item.iY);

      ctx.stroke();
      wx.drawCanvas({
        canvasId: 'myCanvas',
        reserve: true,
        actions: ctx.getActions() // 获取绘图动作数组
      })
    }
  },

  swicthColorBar: function () {

    let _this = this;

    _this.setData({
      "colorBar": !_this.data.colorBar
    })

  },

  prevImg: function () {

    let _this = this;

    if (_this.data.imgUrl == "") {

      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '发送图片至服务器后方可预览（发送朋友或发布榜单）',
        complete: function (res222) {

        }
      })

      return false;
    }


    wx.previewImage({
      current: _this.data.imgUrl, // 当前显示图片的http链接
      urls: [_this.data.imgUrl] // 需要预览的图片http链接列表
    })
  },

  lineSlider: function (e) {
    let _this = this;

    _this.setData({
      "lineWidth": e.detail.value
    })

  },

  nextStep: function (e) {

    this.setData({
      "step": e.currentTarget.dataset.value
    })

    if (e.currentTarget.dataset.value == 3){
      this.setData({
        isLoaded: true
      })
    }

  },

  addImg : function(e){
     ctx.drawImage("https://mp.weixin.qq.com/debug/wxadoc/dev/image/canvas/draw-image.png?t=2017117", 0, 0, 150, 100)
     ctx.draw()
  },

  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }

})
