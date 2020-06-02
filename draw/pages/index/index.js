//index.js
//获取应用实例
var app = getApp();
var bMouseIsDown = false, ctx, iX, iY, iLastX, iLastY, img_arr = [], op_arr = [], del_arr = [], i1, i2, interval, opId = 0, isTimer = false, interval2, drawTime = 0;

Page({
  data: {
    type: 1,
    width: "",
    width2: "",
    margin: "",
    height2: "",
    height: "",
    search: false,
    keyword: "",
  
    init: false,
    isLogin: false,
    orderType: 1,    // 1 最新作品  2 人气作品
    page: 0,
    pageSize: 15,
    hidden: true,
    disable: false,
    empty: false,
    datas: [],
    sysVerify: false,
    
    draws: {
      height:1500
    },
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
  },
  onLoad: function (options) {
    
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
      } else {
        //未登录
        this.login.showLogin()
      }
    })
    this.login.hideLogin()
  },


  onShow: function () {

    let _this = this;

    app.getConfig((flag1, flag2)=>{

      this.setData({
        sysVerify: flag1
      })

      if (flag1 == false) {
        // wx.navigateTo({
        //   url: '/pages/draw/draw',
        // })
        // return

        // sysVerify 模式
        let _this = this;

        wx.getSystemInfo({
          success: function (res) {
            let [width, height] = [res.windowWidth, res.windowHeight];

            let width2 = (res.windowWidth - 90) / 6;

            _this.setData({
              draws: {
                radio: 750 / width,
                height: 750 / width * height - 220,
                color: "#000000",
              }
            })

          }
        })

        ctx = wx.createCanvasContext('myCanvas');
        //圆角结束，圆角相交
        ctx.setLineJoin('round');
        ctx.setLineCap('round');

      }else{

        //加载数据
        wx.getSystemInfo({
          success: function (res) {
            let [width, height] = [res.windowWidth, res.windowHeight];

            let width2 = (res.windowWidth - 40) / 3;

            _this.setData({
              'width': width,
              'width2': width2,
              'margin': 10,
              'height2': width2 / 4,
              'height': height,
              'init': true
            })
          }
        })

        this.login = this.selectComponent("#login");

        app.getUser((res) => {

          if (res) {

            _this.setData({
              userID: res.userID,
              isLogin: true,
            })

            _this.login.hideLogin()

          } else {
            console.log('未登录')
            //未登录
            _this.login.showLogin()
          }

        })

        this.onReachBottom()

      }
    })

  },

  openSearch: function (e) {
    this.setData({
      "search": true
    })

  },

  closeSearch: function (e) {


  },


  toSearch: function (e) {

    let _this = this;

    wx.navigateTo({
      url: '../search/search?keyword=' + _this.data.keyword + "&search=true"
    })

  },


  eInput: function (e) {

    if (e.detail.value == "") {
      this.setData({
        "search": false
      })
    }

    this.setData({
      "keyword": e.detail.value
    })

  },

  changeType(e){

    console.log(e.target.dataset.value);

    this.setData({
      type: 1,
      disable: false,
      empty: false,
      orderType: e.target.dataset.value,
      page: 0,
      pageSize: 15,
      datas: []
    })

    this.onReachBottom()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    this.setData({
      type: 1,
      disable: false,
      empty: false,
      page: 0,
      pageSize: 15,
      datas: []
    })
    wx.stopPullDownRefresh()

    this.onReachBottom()
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
    let pageSize = this.data.pageSize
    page++;

    wx.request({
      url: app.globalData.requestUrl + '?s=Doodle.Paint_Works.WorksList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { page: page, pageSize: pageSize, type: this.data.type, orderType: this.data.orderType },
      method: 'POST',
      success: function (res) {

        if (res.data.ret == 200) {

          let tmp = res.data.data.worksList

          var empty = false

          if (page > 1) {
            empty = false
          } else {
            //判断相册数量 如果有相册empty为false
            if (tmp.length > 0) {
              empty = false
            } else {
              empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 15) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let datas = _this.data.datas;

          datas = datas.concat(tmp)

          _this.setData({
            empty: empty,
            datas: datas,
            page: page
          })

        }

      }
    })
   
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

  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }


})
