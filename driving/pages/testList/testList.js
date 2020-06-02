//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        datas: [],
        noData: false,
    },
    onLoad: function (options) {
        let _this = this;
        app.getUsetTest(options.subject, options.model, function (res) {

            if (res.data.data == null || res.data.data.length == 0) {
                _this.setData({
                    'noData': true,
                     'loading': true
                });
                return false;
            }


            _this.setData({
                'datas': res.data.data,
            });
        })
    },
    showPaper: function (e) {

        wx.redirectTo({
            url: '../subPaper/subPaper?number=' + e.currentTarget.dataset.id
        })

    },


})
