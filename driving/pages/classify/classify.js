//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    subject: 1,
    model: "c1",
  },
  onLoad: function (options) {

    if (options.subject) { } else {
      options.subject = 1;
    }
    if (options.model) { } else {
      options.model = 'c1';
    }

    this.setData({
      'subject': options.subject,
      'model': options.model
    })

  },


})
