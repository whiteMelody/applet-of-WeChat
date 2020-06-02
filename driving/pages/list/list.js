
let [isMoveing, startX, endX, data_key] = [false, 0, 0, ''];

var app = getApp();

Page({

  data: {
    datas: [],
    current: {},
    opened: false,
    loaded: false,
    loading: false,
    id: 1,
    correctCount: 0,
    errorCount: 0,
    subject: "1",
    model: "a1",
    study: false,
    radio: true,
    noData: false,
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


    if (options.id == 0) {
      options.id = 1;
    }

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



    app.getDataById(options.subject, options.model, options.id, function (res) {

      if (res == false) {
        _this.setData({
          'noData': true,
           'loading': true
        });
        return false;
      }

      let _arr = [];

      let [_current, _list, correctCount, errorCount] = [res.data.data, res.data.data3, 0, 0];

      for (let i = 1; i <= res.data.data2; i++) {
        _arr.push({
          id: i,
          isCorrect: 0
        })
      }

      if (_list.length != 0) {

        for (let i = 0; i < _arr.length; i++) {

          for (let j = 0; j < _list.length; j++) {
            let item = _list[j];
            if (item.id == _arr[i].id) {
              _arr[i].isCorrect = item.isCorrect;
            }
          }

          //ES6
          // for (let item of _list) {
          //   if (item.id == _arr[i].id) {
          //     _arr[i].isCorrect = item.isCorrect;
          //   }
          // }

        }

        for (let k = 0; k < _list.length; k++) {
          let item = _list[k];
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

        //   if (item.isCorrect != undefined) {
        //     if (item.isCorrect == 1 || item.isCorrect == "1") {
        //       correctCount++;
        //     } else if (item.isCorrect == 2 || item.isCorrect == "2") {
        //       errorCount++;
        //     }
        //   }
        // }

      }


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
        'datas': _arr,
        'correctCount': correctCount,
        'errorCount': errorCount
      });

      _this.setData({
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
        url: 'list?id=' + (Number.parseInt(this.data.id) + 1) + '&subject=' + this.data.subject + '&model=' + this.data.model + '&study=' + this.data.study
      })

    }

    if (offsetX >= 50) {

      if (this.data.id == 0)
        return false;

      wx.redirectTo({
        url: 'list?id=' + (Number.parseInt(this.data.id) - 1) + '&subject=' + this.data.subject + '&model=' + this.data.model + '&study=' + this.data.study
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

    current['option' + answer].show = false;
    current['option' + answer].class = 'success';

    current.isSelected = true;

    if (answer == 1) current.answer2 = 'A';
    if (answer == 2) current.answer2 = 'B';
    if (answer == 3) current.answer2 = 'C';
    if (answer == 4) current.answer2 = 'D';


    if (oid == answer) {
      current['option' + oid].class = 'success';
      current.isCorrect = true;

    } else {
      current['option' + oid].class = 'error';
      current.isCorrect = false;
      app.addToErrorList(current);
    }


    this.setData({
      'current': current,
    });

    app.answerExercise(this.data.subject, this.data.model, oid, id, function (res) {

      console.log(res);

      if (res) {

        let [_arr, _list, correctCount, errorCount] = [[], res.data.data3, 0, 0];

        for (let i = 1; i <= res.data.data2; i++) {
          _arr.push({
            id: i,
            isCorrect: 0
          })
        }

        if (_list.length != 0) {


          for (let i = 0; i < _arr.length; i++) {

            for (let j = 0; j < _list.length; j++) {
              let item = _list[j];
              if (item.id == _arr[i].id) {
                _arr[i].isCorrect = item.isCorrect;
              }

            }


            //ES6
            // for (let item of _list) {

            //   if (item.id == _arr[i].id) {
            //     _arr[i].isCorrect = item.isCorrect;
            //   }

            // }

          }

          for (let i = 0; i < _arr.length; i++) {

            for (let j = 0; j < _list.length; j++) {
              let item = _list[j];
              if (item.id == _arr[i].id) {
                _arr[i].isCorrect = item.isCorrect;
              }
            }
            //ES6
            // for (let item of _list) {

            //   if (item.id == _arr[i].id) {
            //     _arr[i].isCorrect = item.isCorrect;
            //   }
            // }

          }

          for (let k = 0; k < _list.length; k++) {
            let item = _list[k];
            if (item.isCorrect != undefined) {
              if (item.isCorrect == 1 || item.isCorrect == "1") {
                correctCount++;
              } else if (item.isCorrect == 2 || item.isCorrect == "2") {
                errorCount++;
              }
            }

          }

          // for (let item of _list) {

          //   if (item.isCorrect != undefined) {
          //     if (item.isCorrect == 1 || item.isCorrect == "1") {
          //       correctCount++;
          //     } else if (item.isCorrect == 2 || item.isCorrect == "2") {
          //       errorCount++;
          //     }
          //   }
          // }



        }

        _this.setData({
          'datas': _arr,
          'correctCount': correctCount,
          'errorCount': errorCount
        });
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
      url: 'list?id=' + id + '&subject=' + this.data.subject + '&model=' + this.data.model + '&study=' + this.data.study
    })

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



  clear: function () {

    var _this = this;
    wx.showModal({
      title: '清空记录',
      content: '将清空答题记录',
      success: function (res) {
        if (res.confirm) {
          app.clearTest(_this.data.subject, _this.data.model, _this.data.number, function (res) {
            if (res.data.code == 0 || res.data.code == "0") {
              wx.redirectTo({
                url: 'list?id=' + 0 + '&subject=' + _this.data.subject + '&model=' + _this.data.model + '&study=' + _this.data.study
              })
            }

          })
        }
      }
    })
  }

})
