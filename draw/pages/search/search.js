//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    type: "",
    width: "",
    width2: "",
    width3: "",
    margin: "",
    height: "",
    height2: "",
    search: false,
    empty: false,
    hidden: true,
    keyword: "",
    tag: "",
    tags: [],
    tagUrl: "../../image/tag-btn1.png",
    animationData: {},
    disable: false,
    page: 0,
    pageSize: 15,
    datas: []
  },
  onLoad: function (options) {
    let _this = this;

    if (options.search) {
      options.search = true;
    } else {
      options.search = false;
    }

    if (options.keyword) {
    } else {
      options.keyword = "";
    }

    if (options.tag) {
    } else {
      options.type = 1;
    }

    _this.setData({
      'search': options.search,
      'keyword': options.keyword,
      'type': options.type,
    })

    wx.getSystemInfo({
      success: function (res) {
        let [width, height] = [res.windowWidth, res.windowHeight];

        let width2 = (res.windowWidth - 40) / 3;

        _this.setData({
          'width': width,
          'width2': width2,
          'width3': width2 * 2 + 30,
          'margin': 10,
          'height2': width2 / 4,
          'height': height
        })
      }
    })


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

    this.onReachBottom()
  
  },

  onShow: function () {


  },

  changeTag(e){

    this.setData({
      tag: e.target.dataset.value
    })

    this.reSearch()

  },

  reSearch: function (e) {

    let _this = this;

    _this.setData({
      disable: false,
      empty: false,
      datas: [],
      page: 0,
      pageSize: 15,
    })

    this.onReachBottom()
  },

  swichTag: function () {

    let _this = this;

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    if (_this.data.width3 == _this.data.width) {

      animation.translate(0).step();

      _this.setData({
        'width3': _this.data.width2 * 2 + 30,
        'animationData': animation.export(),
        'tagUrl': "../../image/tag-btn1.png",
      })
    } else {
      var width = this.data.width2;
      animation.translate(width * -1).step();

      _this.setData({
        'width3': _this.data.width,
        'animationData': animation.export(),
        'tagUrl': "../../image/tag-btn2.png",
      })

    }

  },

  toSearch: function (e) {
    this.reSearch();
  },

  eInput: function (e) {

    if (e.detail.value == "") {
      this.reSearch();
    }


    this.setData({
      "keyword": e.detail.value
    })

  },


  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {

    console.log(123)

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
      data: { page: page, pageSize: pageSize, type: this.data.type, label: this.data.tag, type: this.data.type, keywords: this.data.keyword },
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


  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }

})
