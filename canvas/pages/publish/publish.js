var app = getApp();
Page({
  data: {
    index: 0,
    tag: "",
    gifID: "",
    type: "1",
    tags: [],
    tags2: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;

    let _tmp = [];

    for (let i = 0; i < app.globalData.tagList.length; i++) {
      _tmp.push(app.globalData.tagList[i].tag);
    }

    _this.setData({
      'tags': _tmp,
      'tags2': app.globalData.tagList,
      'gifID': options.gifID
    })
  

  },
  bindPickerChange: function (e) {
    let _this = this;
    _this.setData({
      'index': e.detail.value,
      'tag': _this.data.tags2[e.detail.value].id
    })
  },
  radioChange: function (e) {
    this.setData({
      'type': e.detail.value
    })
  },
  formSubmit: function (e) {

    let values = e.detail.value;

    let _this = this;

    app.publish(_this.data.gifID, _this.data.tag, values.title, values.content, _this.data.type, function (res) {

      if (res) {
        wx.showToast({
          title: '提交成功，页面跳转中',
          icon: 'success',
          duration: 2000,
          complete: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)

          }
        })

      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'success',
          duration: 2000
        })
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