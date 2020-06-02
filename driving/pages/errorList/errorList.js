
let [isMoveing, startX, endX] = [false, 0, 0];

var app = getApp();

Page({

    data: {
        datas: [],
        current: {},
        opened: false,
        noData: false,
        loading: false,
        id: 0,
        correctCount: 0,
        errorCount: 0,
        subject: "1",
        model: "a1",
        test: false,
        testId: 0,
    },

    onLoad: function (options) {

        let _this = this;

        if (options.id) {

        } else {
            options.id = 0;
        }


        app.getErrorList(function (res) {
       

            if (res.length == 0) {
                _this.setData({
                    'noData': true,
                    'loading': true
                });
                return false;
            }

            let _current = res[options.id];
            _this.setData({
                'id': Number.parseInt(options.id),
                'current': _current,
                'datas': res,
                'loading': true
            });

        });




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
                url: 'errorList?id=' + (Number.parseInt(this.data.id) + 1)
            })

        }

        if (offsetX >= 50) {

            if (this.data.id == 0)
                return false;

            wx.redirectTo({
                url: 'errorList?id=' + (Number.parseInt(this.data.id) - 1)
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

        app.setRandDatasBylocal(current, id, function (res) {
            if (res) {
                app.getErrorListForRand(function ([correctCount, errorCount]) {

                    _this.setData({
                        'correctCount': correctCount,
                        'errorCount': errorCount
                    });

                })
            }

            _this.setData({
                'datas': res,
            });

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
            url: 'errorList?id=' + id
        })

    },

    del: function () {

        let _this = this;

        app.delErrorLisByIndex(_this.data.id, function (res) {

            let i = Number.parseInt(_this.data.id);
            i--;
            if (i <= 0) {
                i = 0;
            }
            wx.redirectTo({
                url: 'errorList?id=' + i + '&test=' + this.data.test + '&index' + this.options.testId
            })
        })
    }

})
