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
    my: "",
    isFav: false,
    isLike: false,
  },
  onLoad: function (options) {
    let _this = this;

    if (options.my) {
      _this.setData({
        my: true
      })
    } else {
      _this.setData({
        my: false
      })
    }

    app.detail(options.id, function (res) {

      let _item = res.data;
      let _collect = true, _zan = true, _tag = "未设置";

      if (res.data2.collect == 0 || res.data2.collect == "") {
        _collect = false;
      }
      if (res.data2.zan == 0 || res.data2.zan == "") {
        _zan = false;
      }

      if (_item.userID == app.globalData.userInfo.userId) {
        _this.setData({
          my: true
        })
      }

      for (let i = 0; i < app.globalData.tagList.length; i++) {

        if (_item.tag == app.globalData.tagList[i].id) {
          _tag = app.globalData.tagList[i].tag;
          break;
        }

      }

      _this.setData({
        id: options.id,
        imgUrl: _item.gifUrl,
        count: _item.number,
        count2: _item.zan,
        author: _item.username,
        title: _item.title,
        tag: _tag,
        content: _item.intro,
        isFav: _collect,
        isLike: _zan,
        isOpen: _item.open
      })
    });
  },

  onShow: function () {
    let _this = this;

    if (_this.data.my) {
      _this.setData({
        my: true
      })
    }

    if (_this.data.id) {

      app.detail(_this.data.id, function (res) {

        let _item = res.data;
        let _collect = true, _zan = true, _tag = "未设置";

        if (res.data2.collect == 0 || res.data2.collect == "") {
          _collect = false;
        }
        if (res.data2.zan == 0 || res.data2.zan == "") {
          _zan = false;
        }

        if (_item.userID == app.globalData.userInfo.userId) {
          _this.setData({
            my: true
          })
        }

        for (let i = 0; i < app.globalData.tagList.length; i++) {

          if (_item.tag == app.globalData.tagList[i].id) {
            _tag = app.globalData.tagList[i].tag;
            break;
          }

        }

        _this.setData({
          id: options.id,
          imgUrl: _item.gifUrl,
          count: _item.number,
          count2: _item.zan,
          author: _item.username,
          title: _item.title,
          tag: _tag,
          content: _item.intro,
          isFav: _collect,
          isLike: _zan,
          isOpen: _item.open
        })

      });

    }
  },

  showImg: function () {

    let _this = this;

    wx.getStorage({
      key: 'isShareImg',
      success: function (res) {
        // success
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '长按图片或点击右上角，选择发送给好友',
          complete: function (res) {
            wx.previewImage({
              current: _this.data.imgUrl, // 当前显示图片的http链接
              urls: [_this.data.imgUrl] // 需要预览的图片http链接列表
            })
            wx.setStorage({
              key: 'isShareImg',
              data: 'true'
            })
          }
        })
      },
      success: function () {
        wx.previewImage({
          current: _this.data.imgUrl, // 当前显示图片的http链接
          urls: [_this.data.imgUrl] // 需要预览的图片http链接列表
        })
      }
    })


  },
  fav: function (e) {
    let _this = this;
    let _type = e.currentTarget.dataset.type;
    app.collect(_this.data.id, _type, function (res) {
      if (res) {

        _this.setData({
          count: res.data,
          isFav: !_this.data.isFav
        })
      }
    })

  },
  like: function (e) {

    let _this = this;
    let _type = e.currentTarget.dataset.type;

    app.like(_this.data.id, _type, function (res) {
      if (res) {
        _this.setData({
          count2: res.data,
          isLike: !_this.data.isLike
        })
      }
    })

  },

  publish: function () {

    let _this = this;

    wx.navigateTo({
      url: '../publish/publish?gifID=' + _this.data.id
    })
  },

  del: function () {

    let _this = this;

    app.del(_this.data.id, function (res) {

      if (res.code == 0 || res.code == "0") {
        wx.showToast({
          title: '删除成功，页面跳转中',
          icon: 'success',
          duration: 1000,
          complete: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)

          }
        })
      }

    })

  },

  loaded: function () {
    this.setData({
      load1: "show",
      load2: "hidden"
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