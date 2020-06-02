//app.js

let _type1 = ['1', '4'], _type2 = ['c1', 'c2', 'a1', 'a2', 'b1', 'b2'];

let [_i1, _i2] = [0, 0];

App({


  //获取用户接口
  getUserInfo: function (cb) {

    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {

      //查看本地是否有数据
      wx.getStorage({
        key: "userInfo",
        success: function (res) {
          if (res) {
            that.globalData.userInfo = res.data;
            cb(that.globalData.userInfo)
          }
        },
        fail: function (res111) {
          //调用登录接口
          wx.login({
            success: function () {
              wx.getUserInfo({
                
                complete: function(res) {

                  if(res.errMsg == "getUserInfo:cancel"){
                    //默认生成一个userInfo
                    res.userInfo = {};
                  }
                  
                  res.userInfo.userId = that.getUuid();

                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)

                  //保存在本地

                  wx.setStorage({
                    key: 'userInfo',
                    data: res.userInfo,
                    complete: function () {
                      cb(res.userInfo);
                      wx.request({
                        url: 'https://www.gmbridge.cn/drive/user/login',
                        data: res.userInfo
                      })
                    }
                  })

                }
              })
            }
          })
        }
      })

   
    }
  },
  //全局临时对象（保存在系统缓存，而不是本地缓存）
  globalData: {
    indexEd : false,
    listEd : false
  },

  formatTime: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  //函数主入口
  init: function (fnc) {

    let _this = this;

    wx.getStorage({
      key: _type1[_i1] + '_' + _type2[_i2] + "_user_order_list",
      success: function (res) {
        console.log("inited by local");
        fnc(true);
        return true;
      },
      fail: function (res) {
        _this.initDatas(fnc);
      }
    })

  },

  //从服务器拉取数据 第一次缓存
  initDatas: function (fnc) {
    let _this = this;

    wx.request({
      url: 'https://apis.baidu.com/bbtapi/jztk/jztk_query',
      data: {
        subject: _type1[_i1],
        model: _type2[_i2],
        testType: 'order'
      },
      header: {
        'apikey': '58171503cf4d9afb5ecf5515cf813df7',
        'Content-Type': 'application/json',
      },
      success: function (res) {
        //原始数据
        //-由于缓存空间有限，暂时停用该功能
        // wx.setStorage({
        //   key: _type1[_i1] + '_' + _type2[_i2] + "_order_list",
        //   data: res.data.result
        // })
        //用户数据
        wx.setStorage({
          key: _type1[_i1] + '_' + _type2[_i2] + "_user_order_list",
          data: res.data.result
        })


        //学习模式数据
        //-由于缓存空间有限，暂时停用该功能

        // let arr = res.data.result;

        // for (let item of arr) {

        //   for (let i = 1; i <= 4; i++) {

        //     if (item.option) {
        //       item['option' + i] = {
        //         show: true,
        //         class: '',
        //       };
        //     } else {
        //       item['option' + i] = {
        //         show: true,
        //         class: '',
        //       };
        //     }

        //   }

        //   item.subject = _type1[_i1];
        //   item.model = _type2[_i2];

        //   if (item['option' + item.answer] == null || item['option' + item.answer] == undefined) {
        //     // console.log(item);
        //     continue;
        //   }

        //   item['option' + item.answer].show = false;
        //   item['option' + item.answer].class = 'success';

        //   item.isSelected = true;

        //   if (item.answer == 1) item.answer2 = 'A';
        //   if (item.answer == 2) item.answer2 = 'B';
        //   if (item.answer == 3) item.answer2 = 'C';
        //   if (item.answer == 4) item.answer2 = 'D';

        // }

        // wx.setStorage({
        //   key: _type1[_i1] + '_' + _type2[_i2] + "_study_order_list",
        //   data: arr
        // })

        if (_i2 == _type2.length && _i1 == _type1.length - 1) {
          console.log("inited by api");
          fnc(true);
          return true;
        }

        _this.initDatas(fnc);

        _i2++;

        if (_i2 == _type2.length && _i1 != _type1.length - 1) {
          _i2 = 0;
          _i1++;
        }
      }
    })
  },



  //通过key获取本地数据
  getDatasByKey: function (key, fnc) {
    wx.getStorage({
      key: key,
      success: function (res) {
        console.log("get success");
        fnc(res.data);
      },
      fail: function (res) {
        console.log("get fail");
        fnc(false);
      }
    })
  },

  //通过key覆盖本地数据
  setDatasByKey: function (key, val, fnc) {
    wx.setStorage({
      key: key,
      data: val,
      success: function (res) {
        fnc(true);
      },
      fail: function (res) {
        fnc(false);
      }
    })
  },

  //通过key和index获取本地数据
  getDataByKeyAndIndex: function (key, index, fnc) {
    index = Number.parseInt(index);
    this.getDatasByKey(key, function (res) {
      if (res)
        fnc(res[index - 1]);
      else
        fnc(false);
    });
  },

  //通过key和index覆盖本地数据
  setDataByKeyAndIndex: function (key, val, index, fnc) {
    index = Number.parseInt(index);
    let _this = this;
    _this.getDatasByKey(key, function (data) {

      data[index - 1] = val;
      _this.setDatasByKey(key, data, function (res) {

        if (res) {
          _this.getDatasByKey(key, function (res2) {
            fnc(res2);
          })

        }

      });
    });

  },

  //通过key获取本地数据的答对数量和答错数量
  getErrorListByKey: function (key, fnc) {
    this.getDatasByKey(key, function (res) {

      let [count1, count2] = [0, 0];

      if (res == false) {
        return fnc([0, 0]);
      }

      for (let item of res) {
        if (item.isCorrect != undefined) {
          if (item.isCorrect) {
            count1++;
          } else {
            count2++;
          }
        }
      }

      fnc([count1, count2]);

    })

  },


  //随机获取100条数据
  //返回存储的key
  getRandDatas: function (subject, model, fnc) {

    wx.request({
      url: 'https://apis.baidu.com/bbtapi/jztk/jztk_query',
      data: {
        subject: subject,
        model: model,
        testType: 'rand'
      },
      header: {
        'apikey': '58171503cf4d9afb5ecf5515cf813df7',
        'Content-Type': 'application/json',
      },
      success: function (res) {

        //存入本地缓存，固定Key random_list
        wx.setStorage({
          key: "random_list",
          data: res.data.result,
          success: function (res2) {
            fnc(res.data.result);
          },
          fail: function (re2s) {
            fnc(false);
          }
        })

      },
      fail: function (res) {
        fnc(false);
      }
    })
  },

  //获取本地缓存的随机题目
  getRandDatasBylocal: function (fnc) {
    console.log("getLocal");
    this.getDatasByKey("random_list", fnc);
  },

  //覆盖本地的随机题目
  setRandDatasBylocal: function (val, index, fnc) {

    let _this = this;
    this.getDatasByKey("random_list", function (data) {

      data[Number.parseInt(index)] = val;

      wx.setStorage({
        key: "random_list",
        data: data,
        success: function (res) {

          _this.getRandDatasBylocal(function (res) {
            fnc(res);
          })

        },
        fail: function (res) {
          fnc(false);
        }
      })
    })
  },

  //获取随机题目的答对数量和答错数量
  getErrorListForRand: function (fnc) {

    this.getErrorListByKey("random_list", fnc);

  },

  //获取考试题目的答对数量和答错数量
  getTestErrorList: function (id, fnc) {



  },

  //清空本地指定数据
  clearDataByKey: function (key, fnc) {
    let _this = this;
    let arr = key.split("_");
    arr.splice(2, 1);
    let key2 = arr.join("_");

    _this.getDatasByKey(key2, function (res) {
      _this.setDatasByKey(key, res, function (res2) {
        fnc(res2);
      })
    })

  },

  //获取错题集
  getErrorList: function (fnc) {
    this.getDatasByKey("error_list", function (res) {
      if (res) {
        fnc(res);
      } else {
        fnc([]);
      }
    });
  },

  delErrorLisByIndex: function (index, fnc) {

    this.getErrorList(function (res) {
      let datas = res;
      datas.splice(index, 1);
      wx.setStorage({
        key: "error_list",
        data: datas,
        success: function (res) {
          if (fnc)
            fnc(datas);
        },
        fail: function (res) {
          fnc(false);
        }
      })

    })

  },

  //加入错题集
  addToErrorList: function (item, fnc) {

    this.getErrorList(function (res) {
      let datas = res, _flag = true;

      for(let i=0; i<res.length; i++){
        let item = res[i];
        if (res.subject == item.subject && res.id == item.id && res.model == item.model){
          _flag = false;
          break;
        }
      }

      // for (let item of res) {
      //   if (res.subject == item.subject && res.id == item.id && res.model == item.model)
      //     _flag = false;
      // }

      if (_flag) {
        datas.push(item);
        wx.setStorage({
          key: "error_list",
          data: datas,
          success: function (res) {
            if (fnc)
              fnc(datas);
          },
          fail: function (res) {
            fnc(false);
          }
        })
      }

    })

  },

  //获取考试记录
  getPaperList: function (fnc) {
    this.getDatasByKey("paper_list", function (res) {
      if (res) {
        fnc(res);
      } else {
        fnc([]);
      }
    });
  },

  //获取单个考试记录
  getTestRecordByIndex: function (index, fnc) {
    this.getDatasByKey("paper_list", function (res) {
      if (res) {
        fnc(res[index]);
      } else {
        fnc([]);
      }
    });
  },

  //覆盖重考信息
  getReTest: function (index, fnc) {
    let _this = this;
    let [count1, count2] = [0, 0];

    _this.getDatasByKey("re_test", function (datas) {

      if (datas) {

        for (let item of datas.datas) {
          if (item.isCorrect != undefined) {
            if (item.isCorrect) {
              count1++;
            } else {
              count2++;
            }
          }
        }

        fnc([datas, count1, count2]);
      } else {

        _this.getTestRecordByIndex(index, function (res) {

          for (let item of res.datas) {

            if (item.isCorrect != undefined) {
              if (item.isCorrect) {
                count1++;
              } else {
                count2++;
              }
            }

            for (let i = 1; i <= 4; i++) {
              item['option' + i] = {
                show: true,
                class: '',
              };
            }

            item['option' + item.answer].show = false;
            item['option' + item.answer].class = 'success';

            item.isCorrect = undefined;
            item.isSelected = false;
            item.answer2 = '';

          }

          wx.setStorage({
            key: "re_test",
            data: res,
            success: function (flag) {
              fnc([res, count1, count2]);
            },
            fail: function (flag) {
              fnc(false);
            }
          })

        })
      }
    });
  },

  //覆盖本地的随机题目
  setReTest: function (val, index, testId, fnc) {

    index = Number.parseInt(index);
    let _this = this;
    _this.getReTest(testId, function ([data, c1, c2]) {

      for (var i = 0; i < data.length; i++) {
        if (data[i].id == index) {
          data[i] = val;
        }
      }

      wx.setStorage({
        key: "re_test",
        data: data,
        success: function (res) {

          let [count1, count2] = [0, 0];
          for (let item of data.datas) {
            if (item.isCorrect != undefined) {
              if (item.isCorrect) {
                count1++;
              } else {
                count2++;
              }
            }
          }

          fnc([data.datas, count1, count2]);
        },
        fail: function (res) {
          fnc(false);
        }
      })
    })
  },

  //交卷
  addToPaperList: function (datas, s, m, fnc) {

    let _this = this;

    this.getPaperList(function (res) {

      let [arr, count1, count2, _temp, _temp2] = [res, 0, 0];

      if (datas == undefined || datas == null) {
        return [0, 0];
      }

      for (let item of datas) {
        if (item.isCorrect != undefined) {
          if (item.isCorrect) {
            count1++;
          } else {
            count2++;
          }
        }
      }


      if (count1 < 60) {
        _temp = '马路杀手';
        _temp2 = 'Fred';
      }
      if (count1 >= 50 && count1 < 60) {
        _temp = '新手上路';
        _temp2 = 'orange';
      }
      if (count1 >= 60 && count1 < 80) {
        _temp = '年轻的司机';
        _temp2 = 'green';
      }
      if (count1 > 80) {
        _temp = '老司机';
        _temp2 = 'blue';
      }

      let temp = {
        correctCount: count1,
        errorCount: count2,
        sumCount: 100,
        time: _this.formatTime(new Date()),
        title: _temp,
        color: _temp2,
        subject: s,
        model: m,
        datas: datas,
      }

      arr.push(temp);

      wx.setStorage({
        key: "paper_list",
        data: arr,
        success: function (res) {
          if (fnc)
            fnc(arr);
        },
        fail: function (res) {
          fnc(false);
        }
      })

    })


  },

  //获取考试记录的答案
  getTestByIndex: function (index, fnc) {
    this.getTestRecordByIndex(index, function (res) {

      let [count1, count2] = [0, 0];

      if (res.datas == false) {
        return fnc([0, 0, null]);
      }

      for (let item of res.datas) {

        for (let i = 1; i <= 4; i++) {
          item['option' + i] = {
            show: true,
            class: '',
          };
        }

        item['option' + item.answer].show = false;
        item['option' + item.answer].class = 'success';

        item.isSelected = true;

        if (item.answer == 1) item.answer2 = 'A';
        if (item.answer == 2) item.answer2 = 'B';
        if (item.answer == 3) item.answer2 = 'C';
        if (item.answer == 4) item.answer2 = 'D';

        if (item.isCorrect != undefined) {
          if (item.isCorrect) {
            count1++;
          } else {
            count2++;
          }
        }

      }

      fnc([count1, count2, res]);


    })
  },

  //获取考试记录的错题记录
  getErrorTestListByIndex: function (index, fnc) {
    this.getTestRecordByIndex(index, function (res) {

      let [count1, count2, temp] = [0, 0, []];

      if (res.datas == false) {
        return fnc([0, 0]);
      }

      for (let item of res.datas) {
        if (item.isCorrect != undefined) {
          if (item.isCorrect) {
            count1++;
          } else {
            count2++;
            temp.push(item);
          }
        }
      }

      fnc([count1, count2, temp]);

    })

  },




  /*
  
  2016年12月26日14:49:59
  采用新的数据接口，废弃以前的本地缓存模式
  
   */

  
	//保留2位小数
	twoDecimal : function(oNum){
		var num = parseFloat(oNum);
		if (isNaN(length)) return false;
		
		var num = Math.round(oNum*100)/100;
		return num;
	},

  getUuid: function () {
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = [], i; radix = radix || chars.length; if (len) { for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]; } else { var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } } }
    return uuid.join('');
  },

  //获取单个顺序练习
  getDataById: function (subject, lisence, id, fnc) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/one',
      data: {
        lisence: lisence,
        subject: subject,
        id: id,
        userID: that.globalData.userInfo.userId,
      },
      success: function (res) {
        fnc(res);
      }
    })
  },

  //获取顺序练习
  getList: function (subject, lisence, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/orderExam',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //回答单个顺序练习
  answerExercise: function (subject, lisence, answer, id, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/orderAnswer',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence,
        answer: answer,
        id: id,
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },


  //获取模拟考试
  getRandomTest: function (subject, lisence, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/newRandom',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },


  //获取模拟考试
  getTestByNumber: function (number, count, func) {
    var that = this;

    // console.log("      number:"+number+"      count:"+count+"      userID:"+that.globalData.userInfo.userId);

    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/oldRandom',
      data: {
        userID: that.globalData.userInfo.userId,
        number: number,
        count: count
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //回答单个考试练习
  answerTest: function (number, answer, count, func) {
    var that = this;

    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/answerRandom',
      data: {
        userID: that.globalData.userInfo.userId,
        number: number,
        answer: answer,
        count: Number.parseInt(count) + 1,
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },


  //获取用户答题记录
  getUsetTest: function (subject, lisence, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/randStats',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence,
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //提交用户考试记录
  sendTest: function (subject, lisence, number, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/submit',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence,
        number: number
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //获取用户单个考试记录
  clearTest: function (subject, lisence, number, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/clear',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence,
        number: number || 0
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },


  //获取用户单个考试记录
  getRandScore: function (number, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/randScore',
      data: {
        userID: that.globalData.userInfo.userId,
        number: number
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //获取用户考试统计
  getStatistics: function (subject, lisence, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/current',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence,
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //随机获取100条数据
  //返回存储的key
  getRandLists: function (subject, lisence, func) {

    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/practice',
      data: {
        subject: subject,
        lisence: lisence,
      },
      success: function (res) {

        //存入本地缓存，固定Key random_list
        wx.setStorage({
          key: "random_list",
          data: res.data.result,
          success: function (res2) {
            func(res.data.result);
          },
          fail: function (re2s) {
            func(false);
          }
        })

      },
      fail: function (res) {
        func(false);
      }
    })
  },


  //获取指定考试记录
  getTestDetail: function (number, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/randAll',
      data: {
        userID: that.globalData.userInfo.userId,
        number: number,
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //重新考试
  reExam: function (number, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/reExam',
      data: {
        userID: that.globalData.userInfo.userId,
        number: number,
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  },

  //获取首页信息
  getIndexInfo: function (subject, lisence, func) {
    var that = this;
    wx.request({
      url: 'https://www.gmbridge.cn/drive/user/index',
      data: {
        userID: that.globalData.userInfo.userId,
        subject: subject,
        lisence: lisence
      },
      success: function (res) {
        func(res);
      },
      fail: function (res) {
        func(false);
      }
    })
  }


})

