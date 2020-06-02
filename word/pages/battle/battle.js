// pages/battle/battle.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    time: 10,
    timerID: 0,
    earlyA: false,
    earlyB: false,
    message: "match ",
    word: "",
    audio: "",
    answer: "",
    userA: 'userA',
    userB: 'userB',
    scoreA: 0,
    scoreB: 0,
    question: "",
    isSelect: false,
    cancel: "cancelMatch ",
    loading: true,
    userInfo: false,
    content: false,
    end: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()

    let _this = this

    let message = 'match {"level":' + options.level + '}'
    let cancel = 'cancelMatch {"level":' + options.level + '}'

    this.setData({
      message: message,
      cancel: cancel,
      level: options.level,
      mylevel: options.mylevel
    })

    //监听Socket

    app.getUser((res) => {
      if (res) {
        this.setData({
          head: res.head,
          userID: res.userID
        })
      } else {
        console.log('未登录')
      }
    })

    app.getSystemInfo((res) => {
      this.setData({
        bgHeight: res.windowHeight
      })
    })


    //发送的消息
    app.send(message)
    //接收的消息
    app.accept((res) => {
      //接收的用户信息
      if (res) {
        if (res.userA) {
          _this.setData({
            userA: res.userA,
            userB: res.userB,
            headA: res.headA,
            headB: res.headB,
            cityA: res.cityA,
            cityB: res.cityB,
            loading: false,
            game: true
          })
        }

        //接收的题目信息
        if (res.word) {
          let exit = 'ExitFight {"fightID":' + res.fightID + '}'
          _this.countDown(res.time)
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#4E84E5',
            animation: {
              duration: 0,
              timingFunc: 'easeIn'
            }
          })
          _this.setData({
            game: false,
            question: res.question,
            word: res.word,
            questionList: res.questionList,
            audio: res.audio,
            fightID: res.fightID,
            serialNo: res.serialNo,
            answer: res.answer,
            multiple: res.multiple,
            isSelect: res.isSelect,
            earlyA: res.earlyA,
            earlyB: res.earlyB,
            height: res.serialNo / 10 * 796,
            userInfo: true,
            content: true,
            exit: exit
          })
          // _this.play()
        }
        //接收的用户得分信息
        if (res.user || res.foeUser) {
          let serialNo = this.data.serialNo
          let scoreA = this.data.scoreA
          let scoreB = this.data.scoreB
          let earlyA = this.data.earlyA
          let earlyB = this.data.earlyB
          if (earlyA) {
            if (res.foeUser) {
              let nowScoreB = scoreB + res.foeUser.score
              _this.setData({
                scoreB: nowScoreB
              })
              return false
            }
          }
          if (earlyB) {
            if (res.user) {
              let nowScoreA = scoreA + res.user.score
              _this.setData({
                scoreA: nowScoreA
              })
              return false
            }
          }
          if (res.user) {
            let nowScoreA = scoreA + res.user.score
            _this.setData({
              scoreA: nowScoreA,
              earlyA: true
            })
          }
          if (res.foeUser) {
            let nowScoreB = scoreB + res.foeUser.score
            _this.setData({
              scoreB: nowScoreB,
              earlyB: true
            })
          }

        }
        //接收的结束得分信息
        if (res.endTime) {
          let userID = this.data.userID
          let scoreA = this.data.scoreA
          let scoreB = this.data.scoreB
          let userTimeA = res.userTimeA
          let winUser = res.winUser
          let victory = ""
          let result = ""
          let avgAnswerA = ""
          let avgAnswerB = ""
          if (userTimeA == userID) {
            console.log('是A用户')
            avgAnswerA = res.avgAnswerA
            avgAnswerB = res.avgAnswerB
          } else {
            console.log('是B用户')
            avgAnswerA = res.avgAnswerB
            avgAnswerB = res.avgAnswerA
          }
          let resA = _this.sixDecimal(avgAnswerA)
          let resB = _this.sixDecimal(avgAnswerB)
          if (userID == winUser) {
            result = '挑战成功'
            victory = true
          } else {
            result = '挑战失败'
            victory = false
          }

          clearInterval(this.data.timerID)
          _this.setData({
            victory: victory,
            result: result,
            userInfo: false,
            content: false,
            end: true,
            avgAnswerA: resA,
            avgAnswerB: resB,
            exit: ""
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#093D73',
            animation: {
              duration: 0,
              timingFunc: 'easeIn'
            }
          })
          //获取等级
          app.getUserLevel((res) => {})
        }
      } else {

      }
    })



  },

  //保留4位小数
  sixDecimal(x) {

    var f = parseFloat(x);

    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x * 10000) / 10000;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 4) {
      s += '0';
    }

    return s;

  },

  //播放读音
  // play() {
  //   let audio = this.data.audio
  //   wx.playBackgroundAudio({
  //     dataUrl: audio,
  //     success: function(res) {},
  //   })
  // },

  //继续挑战
  challenge() {
    this.setData({
      loading: true,
      end: false,
      scoreA: 0,
      scoreB: 0,
      earlyA: false,
      earlyB: false,
      height: 0,
      time: 10
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#093D73',
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    app.send(this.data.message)
  },


  //选择答案
  select(e) {
    let index = e.currentTarget.dataset.index + 1
    let answer = this.data.answer
    let isSelect = this.data.isSelect
    let questionList = this.data.questionList

    let fightID = this.data.fightID
    let serialNo = this.data.serialNo
    let message = 'answer {"fightID":' + fightID + ',"serialNo":' + serialNo + ',"answer":' + index + '}'

    if (isSelect) {

    } else {
      app.send(message)
      if (answer == index) {
        questionList[index - 1].state = 1
        this.setData({
          questionList: questionList,
          isSelect: true
        })
        this.playRgiht()
      } else {
        questionList[index - 1].state = 2
        questionList[answer - 1].state = 1
        this.setData({
          questionList: questionList,
          isSelect: true
        })
        this.playError()
      }
    }
  },

  //正确答案
  playRgiht() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/sound/right.mp3'
  },

  //错误答案
  playError() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/sound/error.mp3'
  },

  //倒计时
  countDown(time) {
    this.setData({
      time: time
    })
    if (time == 10) {
      clearInterval(this.data.timerID)
      this.data.timerID = setInterval(() => {
        time--
        this.setData({
          time: time
        })
        if (time == 0) {
          let answer = this.data.answer
          let questionList = this.data.questionList
          questionList[answer - 1].state = 1
          this.setData({
            questionList: questionList,
            isSelect: true
          })
          clearInterval(this.data.timerID)
        }
      }, 1000)
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.timerID)
    if (this.data.end) {

    } else {
      if (app.isNull(this.data.exit)) {
        app.send(this.data.cancel)
      } else {
        app.send(this.data.exit)
      }
      wx.navigateBack({
        delta: 1
      })
    }


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timerID)
    if (this.data.end) {
      console.log('结束返回')
    } else {
      if (app.isNull(this.data.exit)) {
        app.send(this.data.cancel)
      } else {
        app.send(this.data.exit)
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

    let _this = this

    if (res.from === 'button') {

      return {
        title: '我在一场单词对决中获得了' + this.data.scoreA + '分，快来挑战吧！',
        path: '/pages/index/index',
        success: function(res) {

        },
        fail: function(res) {

        },
        complete: function(res) {

        }
      }

    } else {
      return {
        title: '我在一场单词对决中获得了' + this.data.scoreA + '分，快来挑战吧！',
        path: '/pages/index/index',
        success: function(res) {


        },
        fail: function(res) {

        },
        complete: function(res) {

        }
      }
    }

  }
})