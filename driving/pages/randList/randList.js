
let [isMoveing, startX, endX] = [false, 0, 0];

var app = getApp();

Page({

    data: {
        datas: [],
        current: {},
        opened: false,
        loaded: false,
        loading: false,
        id: 0,
        correctCount: 0,
        errorCount: 0,
        subject: "1",
        model: "a1",
        test: false,
        study: false,
        isReTest: false,
        radio: true,
        number: 1,
    },

    onLoad: function (options) {

        let _this = this;


        if (app.globalData.listEd == true || app.globalData.listEd == 'true') {
            _this.setData({
                'loaded': true
            });
        } else {
            _this.setData({
                'loaded': false
            });
        }

        wx.getStorage({
            key: 'listEd',
            success: function (res) {
                app.globalData.listEd = false;
                _this.setData({
                    'loaded': false
                });
            },
            fail: function () {
                app.globalData.listEd = true;
                _this.setData({
                    'loaded': true
                });
            }
        })


        if (options.subject) {
            _this.setData({
                'subject': options.subject,
            });
        }

        if (options.model) {
            _this.setData({
                'model': options.model,
            });
        }

        if (options.study == "true" || options.study == true) {

            _this.setData({
                'study': true,
            });
        } else {
            _this.setData({
                'study': false,
            });
        }


        if (options.test == "true" || options.test == true) {
            _this.setData({
                'test': true,
            });

            if (options.id == -1 || options.id == "-1") {

                options.id = 0;

                app.getRandomTest(options.subject, options.model, function (res) {

                    console.log(res);

                    if (res == false) {
                        _this.setData({
                            'noData': true,
                             'loading': true
                        });
                        return false;
                    }

                    let [_current, _list, correctCount, errorCount] = [res.data.data, res.data.data2, 0, 0];


                    if (_list != null && _list.length != 0) {

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

                    } else {
                        _list = [];
                        for (let i = 1; i <= 100; i++) {
                            _list.push({
                                id: i,
                                isCorrect: 0
                            })
                        }
                    }

                    if (_current.isCorrect) {
                        if (_current.isCorrect == 0) {
                            for (let i = 1; i <= 4; i++) {
                                _current['option' + i] = {
                                    show: true,
                                    class: '',
                                };
                            }
                        }

                    } else {
                        for (let i = 1; i <= 4; i++) {
                            _current['option' + i] = {
                                show: true,
                                class: '',
                            };
                        }
                    }


                    console.log(_current);


                    _this.setData({
                        'id': Number.parseInt(options.id),
                        'current': _current,
                        'datas': _list,
                        'correctCount': correctCount,
                        'errorCount': errorCount,
                        'number': _current.number,
                    });

                    // console.log(res);

                })

            } else {

                app.getTestByNumber(options.number, Number.parseInt(options.id) + 1, function (res) {

                    console.log(res);

                    if (res == false) {
                        _this.setData({
                            'noData': true,
                        });
                        return false;
                    }

                    let [_current, _list, correctCount, errorCount, _currentId] = [res.data.data, res.data.data2, 0, 0];


                    if (_list != null && _list.length != 0) {

                        for (var i = 0; i < _list.length; i++) {
                            var item = _list[i];
                            if (item.id == options.id) {
                                _currentId = i;
                            }

                            if (item.isCorrect != undefined) {
                                if (item.isCorrect == 1 || item.isCorrect == "1") {
                                    correctCount++;
                                } else if (item.isCorrect == 2 || item.isCorrect == "2") {
                                    errorCount++;
                                }
                            }
                        }


                    }


                    if (_current.isCorrect) {
                        //已答题      
                        if (_current.isCorrect == 0) {
                            //未答题
                            for (let i = 1; i <= 4; i++) {
                                _current['option' + i] = {
                                    show: true,
                                    class: '',
                                };
                            }

                        } else {
                            //已答题
                            for (let i = 1; i <= 4; i++) {
                                _current['option' + i] = {
                                    show: true,
                                    class: '',
                                };
                            }

                            if (_current.answer2 == "A") _current.answer2 == 0;
                            if (_current.answer2 == "B") _current.answer2 == 1;
                            if (_current.answer2 == "C") _current.answer2 == 2;
                            if (_current.answer2 == "D") _current.answer2 == 3;

                            _current.isSelected = true;
                            _current['option' + _current.answer2].show = false;

                            if (_current.isCorrect == 1) {
                                _current['option' + _current.answer2].class = 'success';
                            } else {

                                _current['option' + _current.answer2].class = 'error';
                            }

                            _current['option' + _current.answer].show = false;
                            _current['option' + _current.answer].class = 'success';

                        }
                    } else {
                        //未答题
                        for (let i = 1; i <= 4; i++) {
                            _current['option' + i] = {
                                show: true,
                                class: '',
                            };
                        }
                    }


                    // console.log(_current);


                    _this.setData({
                        'id': Number.parseInt(options.id),
                        'current': _current,
                        'datas': _list,
                        'correctCount': correctCount,
                        'errorCount': errorCount,
                        'number': options.number,
                    });

                    // console.log(res);

                })

            }

            _this.setData({
                'loading': true
            });

        } else {

            //随机练习
            if (options.id) {
                //本地缓存题

                app.getRandDatasBylocal(function (res) {

                    console.log(111);

                    let [_current, _list, correctCount, errorCount] = [res[options.id], res, 0, 0];


                    console.log(_list[0]);
                    console.log(typeof (_list));

                    if (_list.length != 0) {

                        //ES5
                        for (let i = 0; i < _list.length; i++) {
                            let item = _list[i];
                            if (item.isCorrect) {
                                if (item.isCorrect) {
                                    correctCount++;
                                } else {
                                    errorCount++;
                                }
                            }
                        }

                        //ES6
                        // for (let item of _list) {
                        //     if (item.isCorrect) {
                        //         if (item.isCorrect) {
                        //             correctCount++;
                        //         } else {
                        //             errorCount++;
                        //         }
                        //     }
                        // }

                    }

                    if (_current.isSelected) {

                        if (_current.answer2 == "A") _current.answer2 = 1;
                        if (_current.answer2 == "B") _current.answer2 = 2;
                        if (_current.answer2 == "C") _current.answer2 = 3;
                        if (_current.answer2 == "D") _current.answer2 = 4;

                        _current.isSelected = true;

                        _current['option' + _current.answer2].show = false;

                        if (_current.isCorrect) {
                            _current['option' + _current.answer2].class = 'success';
                        } else {
                            _current['option' + _current.answer2].class = 'error';
                        }

                        _current['option' + _current.answer].show = false;
                        _current['option' + _current.answer].class = 'success';


                    } else {

                        //未答题
                        for (let i = 1; i <= 4; i++) {
                            _current['option' + i] = {
                                show: true,
                                class: '',
                            };
                        }
                    }


                    console.log(444);

                    if (options.study == "true" || options.study == true) {
                        //显示答案
                        for (let i = 1; i <= 4; i++) {
                            _current['option' + i] = {
                                show: true,
                                class: '',
                            };
                        }

                        _current['option' + _current.answer].show = false;
                        _current['option' + _current.answer].class = 'success';
                    }


                    _this.setData({
                        'id': Number.parseInt(options.id),
                        'current': _current,
                        'datas': _list,
                        'correctCount': correctCount,
                        'errorCount': errorCount,
                    });
                })
            } else {
                options.id = 0;

                //新题
                app.getRandDatas(options.subject, options.model, function (res) {

                    console.log(res);

                    let [_current, _list, correctCount, errorCount] = [res[options.id], res, 0, 0];

                    for (let i = 1; i <= 4; i++) {
                        _current['option' + i] = {
                            show: true,
                            class: '',
                        };
                    }

                    // console.log(_current);

                    _this.setData({
                        'id': Number.parseInt(options.id),
                        'current': _current,
                        'datas': _list,
                        'correctCount': 0,
                        'errorCount': 0,
                    });

                })

            }

            _this.setData({
                'loading': true
            });

        }

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
                url: 'randList?id=' + (Number.parseInt(this.data.id) + 1) + '&subject=' + this.data.subject + '&model=' + this.data.model + '&test=' + this.data.test + '&study=' + this.data.study + '&number=' + this.data.number
            })

        }

        if (offsetX >= 50) {

            if (this.data.id == 0)
                return false;

            wx.redirectTo({
                url: 'randList?id=' + (Number.parseInt(this.data.id) - 1) + '&subject=' + this.data.subject + '&model=' + this.data.model + '&test=' + this.data.test + '&study=' + this.data.study + '&number=' + this.data.number
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

        _this.setData({
            'current': current,
        });

        if (_this.data.test) {
            app.answerTest(_this.data.number, oid, _this.data.id, function (res) {

                let [_list, correctCount, errorCount] = [res.data.data, 0, 0];

                if (_list != null && _list.length != 0) {

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

                } else {
                    _list = [];
                    for (let i = 1; i <= 100; i++) {
                        _list.push({
                            id: i,
                            isCorrect: 0
                        })
                    }
                }


                _this.setData({
                    'datas': _list,
                    'correctCount': correctCount,
                    'errorCount': errorCount,
                });

                if (_this.data.test && _this.data.id != _this.data.datas.length) {
                    wx.redirectTo({
                        url: 'randList?id=' + (Number.parseInt(_this.data.id) + 1) + '&subject=' + _this.data.subject + '&model=' + _this.data.model + '&test=' + _this.data.test + '&study=' + _this.data.study + '&number=' + _this.data.number
                    })

                }

            })
        } else {


            app.setRandDatasBylocal(current, _this.data.id, function (res) {


                let [_list, correctCount, errorCount] = [res, 0, 0];

                if (_list.length != 0) {

                    for (let j = 0; j < _list.length; j++) {
                        let item = _list[j];
                        if (item.isCorrect != undefined) {
                            if (item.isCorrect) {
                                correctCount++;
                            } else {
                                errorCount++;
                            }
                        }
                    }

                    //ES6
                    // for (let item of _list) {
                    //     if (item.isCorrect != undefined) {
                    //         if (item.isCorrect) {
                    //             correctCount++;
                    //         } else {
                    //             errorCount++;
                    //         }
                    //     }
                    // }

                }


                _this.setData({
                    'datas': _list,
                    'correctCount': correctCount,
                    'errorCount': errorCount,
                });
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

    closeLoad: function (e) {
        let _this = this;
        wx.setStorage({
            key: 'listEd',
            data: false,
            success: function (res) {
                _this.setData({
                    'loaded': false
                })
            }
        })
    },


    choose: function (event) {
        let id = event.currentTarget.dataset.id;

        wx.redirectTo({
            url: 'randList?id=' + id + '&subject=' + this.data.subject + '&model=' + this.data.model + '&test=' + this.data.test + '&study=' + this.data.study + '&number=' + this.data.number
        })

    },

    subPaper: function (event) {
        let _this = this;

        wx.showModal({
            title: '提交试题',
            content: '是否确认提交试题？',
            success: function (res) {
                if (res.confirm) {
                    app.sendTest(_this.data.subject, _this.data.model, _this.data.number, function (res) {
                        if (res.data.code == 0) {
                            wx.redirectTo({
                                url: '../subPaper/subPaper?&subject=' + _this.data.subject + '&model=' + _this.data.model + '&number=' + _this.data.number
                            })
                        }
                    })
                }
            }
        })

    },


})
