
let [isMoveing, startX, endX] = [false, 0, 0];

var app = getApp();

Page({

    data: {
        datas: [],
        current: {},
        opened: false,
        id: 0,
        subject: "1",
        model: "a1",
        testId: 0,
        correctCount: 0,
        errorCount: 0,
        radio: true,
        test: true,
    },

    onLoad: function (options) {

        let _this = this;
        if (options.id) { } else { options.id = 0 }

        app.getReTest(options.testId, function ([res, correctCount, errorCount]) {

            let _current = res.datas[options.id];
            if (_current.isSelected) {
                _this.setData({
                    'id': Number.parseInt(options.id),
                    'current': _current,
                    'datas': res.datas,
                    'testId': options.testId,
                    'correctCount': res.correctCount,
                    'errorCount': res.errorCount,
                });

            } else {
                for (let i = 1; i <= 4; i++) {
                    _current['option' + i] = {
                        show: true,
                        class: '',
                    };
                }

                _this.setData({
                    'id': Number.parseInt(options.id),
                    'current': _current,
                    'datas': res.datas,
                    'correctCount': res.correctCount,
                    'errorCount': res.errorCount,
                });

            }

        })
    },

    touchstart: function (event) {
        isMoveing = true;
        startX = event.changedTouches[0].pageX;
    },
    touchmove: function (event) {
        isMoveing = true;
        endX = event.changedTouches[0].pageX;
    },
    touchend: function (event) {
        isMoveing = false;
        endX = event.changedTouches[0].pageX;

        let offsetX = endX - startX;

        if (offsetX <= -50) {

            if (this.data.id == this.data.datas.length - 1)
                return false;

            wx.redirectTo({
                url: 'reTest?id=' + (Number.parseInt(this.data.id) + 1) + '&testId=' + this.data.testId
            })

        }

        if (offsetX >= 50) {

            if (this.data.id == 0)
                return false;

            wx.redirectTo({
                url: 'reTest?id=' + (Number.parseInt(this.data.id) + 1) + '&testId=' + this.data.testId
            })

        }

    },

    tapOption: function (event) {

        let current = this.data.current, _this = this, data = event.currentTarget.dataset;

        if (current.isSelected)
            return false;

        let [id, oid, answer, explains] = [data.id, Number.parseInt(data.oid), Number.parseInt(data.answer), data.explains];

        for (let i = 1; i <= 4; i++) {
            current['option' + i] = {
                show: true,
                class: '',
            };
        }

        current['option' + oid].show = false;
        current.subject = this.data.subject;
        current.model = this.data.model;

        if (oid == answer) {
            current['option' + oid].class = 'success';
            current.isCorrect = true;

        } else {
            current['option' + oid].class = 'error';
            current.isCorrect = false;
            app.addToErrorList(current);
        }


        current['option' + answer].show = false;
        current['option' + answer].class = 'success';

        current.isSelected = true;

        if (answer == 1) current.answer2 = 'A';
        if (answer == 2) current.answer2 = 'B';
        if (answer == 3) current.answer2 = 'C';
        if (answer == 4) current.answer2 = 'D';

        this.setData({
            'current': current,
        });

        app.setReTest(current, id, _this.data.testId, function ([res, correctCount, errorCount]) {


            if (res) {

                _this.setData({
                    'correctCount': correctCount,
                    'errorCount': errorCount,
                    'datas': res,
                });

            }

            if (_this.data.test && _this.data.id != _this.data.datas.length) {
                wx.redirectTo({
                    url: 'reTest?id=' + (Number.parseInt(_this.data.id) + 1) + '&testId=' + this.data.testId
                })

            }

        })

    },

    openFooter: function () {
        this.setData({
            'opened': true,
        });
    },

    closeFooter: function () {
        this.setData({
            'opened': false,
        });
    },

    choose: function (event) {
        let id = event.currentTarget.dataset.id - 1;

        wx.redirectTo({
            url: 'reTest?id=' + id + '&testId=' + this.data.testId
        })

    },

    subPaper: function (event) {
        let _this = this;
        //交卷，将最近一次的随机测试保存在本地
        app.getRandDatasBylocal(_this.data.study, function (res) {
            app.addToPaperList(res, _this.data.subject, _this.data.model, function (arr) {
                if (res) {
                    wx.redirectTo({
                        url: '../subPaper/subPaper?subject=' + _this.data.subject + '&model=' + _this.data.model + '&testId=' + (arr.length - 1)
                    })
                }
            })
        })
    },


})
