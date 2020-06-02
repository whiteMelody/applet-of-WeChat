//index.js
//获取应用实例
var app = getApp();
Page({
    data: {
        correctCount: 30,
        errorCount: 20,
        sumCount: 100,
        complete: 10,
        count1: 1,
        count2: 2,
        count3: 3,
    },
    onLoad: function (options) {
        let _this = this;


        app.getStatistics(options.subject, options.model, function (res) {

            let _item = res.data.data

            _this.setData({
                'correctCount': _item.right,
                'errorCount': _item.wrong,
                // 'sumCount':100,
                'complete': app.twoDecimal(_item.right + _item.wrong) / 100 * 100,
                'count1': app.twoDecimal(_item.right / 100 * 100),
                'count2': app.twoDecimal(_item.wrong / 100 * 100),
                'count3': app.twoDecimal((_item.right + _item.wrong) / 100 * 100),
            })
        })


    },


})
