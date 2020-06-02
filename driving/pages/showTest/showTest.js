
let [isMoveing, startX, endX] = [false, 0, 0];

var app = getApp();

Page({

    data: {
        datas: [],
        current: {},
        noData: false,
        opened: false,
        id: 0,
        correctCount: 0,
        errorCount: 0,
        number: 0,
        type: "",
        radio: true,
    },

    onLoad: function (options) {

        let _this = this;

        if (options.id) {

        } else {
            options.id = 0;
        }

        if (options.number) {
            _this.setData({
                'number': options.number,
            });
        }

        if (options.type) {
            _this.setData({
                'type': options.type,
            });
        }

        app.getTestDetail(options.number, function (res) {

            if (res == false) {
                _this.setData({
                    'noData': true,
                     'loading': true
                });
                return false;
            }


            let [_current, _list, correctCount, errorCount] = [res.data.data[options.id], res.data.data, 0, 0];


            for (let j = 0; j < _list.length; j++) {
                let item = _list[j];
                if (item.isCorrect != undefined) {
                    if (item.isCorrect == 1 || item.isCorrect == "1") {
                        correctCount++;
                    } else if (item.isCorrect == 2 || item.isCorrect == "2") {
                        errorCount++;
                    }
                }
            }

            //ES6
            // for (let item of _list) {

            //     if (item.isCorrect != undefined) {
            //         if (item.isCorrect == 1 || item.isCorrect == "1") {
            //             correctCount++;
            //         } else if (item.isCorrect == 2 || item.isCorrect == "2") {
            //             errorCount++;
            //         }
            //     }
            // }

            //显示答案
            for (let i = 1; i <= 4; i++) {
                _current['option' + i] = {
                    show: true,
                    class: '',
                };
            }

            _current.isSelected = true;

            console.log(_current.answer2);

            if (_current.answer2 != 0 && _current.answer2 != "0" && _current.answer2 != null) {

                _current['option' + _current.answer2].show = false;

                if (_current.isCorrect == 1) {
                    _current['option' + _current.answer2].class = 'success';
                } else {
                    _current['option' + _current.answer2].class = 'error';
                }

            }

            _current['option' + _current.answer].show = false;
            _current['option' + _current.answer].class = 'success';

            if (_current.answer == 1) _current.answer = 'A';
            if (_current.answer == 2) _current.answer = 'B';
            if (_current.answer == 3) _current.answer = 'C';
            if (_current.answer == 4) _current.answer = 'D';

            _this.setData({
                'id': Number.parseInt(options.id),
                'current': _current,
                'datas': _list,
                'correctCount': correctCount,
                'errorCount': errorCount,
                'loading': true
            });


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
                url: 'showTest?id=' + (Number.parseInt(this.data.id) + 1) + '&number=' + this.data.number + '&type=' + this.data.type
            })

        }

        if (offsetX >= 50) {

            if (this.data.id == 0)
                return false;

            wx.redirectTo({
                url: 'showTest?id=' + (Number.parseInt(this.data.id) - 1) + '&number=' + this.data.number + '&type=' + this.data.type
            })

        }

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
        let id = event.currentTarget.dataset.id;

        wx.redirectTo({
            url: 'showTest?id=' + id + '&number=' + this.data.number + '&type=' + this.data.type
        })

    },


})
