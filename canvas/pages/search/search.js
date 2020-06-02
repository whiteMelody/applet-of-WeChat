//index.js
//获取应用实例
var app = getApp();
var page = 1, pageSize = 12, isEnd = false;
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

      if (options.tag) {
      } else {
        options.tag = app.globalData.tagList[0].id;
      }

      _this.setData({
        'tags':  app.globalData.tagList,
        'tag': options.tag
      })
      
      _this.reSearch();
  
  },

  onShow: function () {


  },

  reSearch: function (e) {

    let _this = this;

    let _datas;

    _this.setData({
      hidden: false
    })

    if (e) {
      _datas = e.currentTarget.dataset;
      page = 1;
      pageSize = 12;
      isEnd = false;
      _this.setData({
        'datas': [],
        'hidden': false
      })
    } else {
      _datas = {
        index: 0
      }
    }

    let _tmp = _this.data.tags;

    for (let i = 0; i < _tmp.length; i++) {
      _tmp[i].active = "";
      if (i == _datas.index) {
        _tmp[i].active = "active";
        _this.setData({
          'tag': _tmp[i].id,
        })
      }
    }

    app.search(page, pageSize, _this.data.type, _this.data.tag, _this.data.keyword, function (res) {
      if (res.data.list.length < pageSize) {
        isEnd = true;
      }

      if (res) {
        if (res.data.list.length == 0) {
          _this.setData({
            'empty': true,
            'tags': _tmp,
            'hidden': true
          })
        } else {
          _this.setData({
            'datas': _this.data.datas.concat(res.data.list),
            'tags': _tmp,
            'empty': false,
            'hidden': true
          })
        }
      } else {
        _this.setData({
          'empty': true,
          'tags': _tmp,
          'hidden': true
        })
      }

    })
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


  lower: function (e) {
    let _this = this;

    if (isEnd) {
      return;
    }

    page++;

    _this.reSearch();

  },

  onShareAppMessage: function () {
    return {
      title: '涂鸦神器',
      desc: '快乐无限，涂鸦神器，让您在创意的海洋中画出自己的作品',
      path: 'pages/index/index'
    }
  }

})
