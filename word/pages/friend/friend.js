// pages/friend/friend.js
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
    message: "room ",
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
    wait: true,
    invite: true,
    showStart: false,
    waitStart: false,
    back: false,
    exit: "",
    gamerExit: false,
    dialog: false,
    full: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()

    let _this = this

    this.login = this.selectComponent("#login")

    app.getSystemInfo((res) => {
      this.setData({
        bgHeight: res.windowHeight
      })
    })

    if (!app.isNull(options.roomID)) {
      _this.setData({
        roomID: options.roomID,
        back: true,
        own: true
      })
    }


    app.getUser((res) => {

      if (res) {
        this.setData({
          name: res.name,
          head: res.head,
          userID: res.userID
        })
        this.login.hideLogin()

        if (!app.isNull(options.roomID)) {

          if (res.userID == options.userID) {
            _this.setData({
              dialog: true
            })
          } else {

            let exitRoom = 'exitRoom {"roomID":' + options.roomID + '}'
            _this.setData({
              exitRoom: exitRoom,
              roomID: options.roomID,
              invite: false,
            })

            wx.onSocketOpen((res) => {
              console.log('WebSocket连接已打开！')
              let message = 'joinRoom {"roomID":' + options.roomID + '}'
              // console.log('发送消息=' + message)
              //发送的消息
              app.send(message)
              //接收的消息
              app.accept((res) => {
                //接收的用户信息
                if (res) {

                  //用户信息
                  if (res.foeNickName) {

                    if (this.data.userID != res.creatorUID && this.data.userID != res.foeUID) {
                      _this.setData({
                        full: true
                      })
                    }

                    if (res.creatorExit) {
                      _this.setData({
                        dialog: true
                      })
                    }

                    _this.setData({
                      userA: res.foeNickName,
                      userB: res.creatorNickName,
                      headA: res.foePhotoUrl,
                      headB: res.creatorPhotoUrl,
                      waitStart: true,
                      invite: false,
                      waitFriend: false
                    })
                  }

                  //退出房间
                  if (res.exitTime) {
                    if (this.data.waitStart || this.data.end) {
                      _this.setData({
                        dialog: true
                      })
                    }
                    _this.setData({
                      gamerExit: true
                    })
                  }

                  //接收的题目信息
                  if (res.word) {
                    let exit = 'ExitFight {"fightID":' + res.fightID + '}'
                    _this.countDown(res.time)
                    _this.setData({
                      waitStart: false,
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
                      exit: exit,
                      wait: false
                    })
                    wx.setNavigationBarColor({
                      frontColor: '#ffffff',
                      backgroundColor: '#4E84E5',
                      animation: {
                        duration: 0,
                        timingFunc: 'easeIn'
                      }
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
                    let avgAnswerA = ""
                    let avgAnswerB = ""
                    if (userTimeA == userID) {
                      // console.log('是A用户')
                      avgAnswerA = res.avgAnswerA
                      avgAnswerB = res.avgAnswerB
                    } else {
                      // console.log('是B用户')
                      avgAnswerA = res.avgAnswerB
                      avgAnswerB = res.avgAnswerA
                    }
                    let resA = _this.sixDecimal(avgAnswerA)
                    let resB = _this.sixDecimal(avgAnswerB)
                    if (userID == winUser) {
                      victory = true
                    } else {
                      victory = false
                    }
                    let title = '我在一场单词对决中获得了' + this.data.scoreA + '分，快来挑战吧！'
                    let path = '/pages/index/index'
                    clearInterval(this.data.timerID)
                    _this.setData({
                      victory: victory,
                      userInfo: false,
                      content: false,
                      end: true,
                      avgAnswerA: resA,
                      avgAnswerB: resB,
                      exit: "",
                      title: title,
                      path: path
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
                  console.log('接收的信息错误')
                }
              })
            })
          }

        } else {


          let message = 'room '
          //发送的消息
          app.send(message)

          //接收的消息
          app.accept((res) => {
            //接收的用户信息
            if (res) {
              //接收的房间号
              if (res.roomID) {
                let title = '快来和' + this.data.name + '对战单词量'
                let path = '/pages/friend/friend?roomID=' + res.roomID + '&userID=' + this.data.userID
                let exitRoom = 'exitRoom {"roomID":' + res.roomID + '}'
                _this.setData({
                  roomID: res.roomID,
                  title: title,
                  path: path,
                  exitRoom: exitRoom
                })
              }

              //用户信息
              if (res.creatorNickName) {
                _this.setData({
                  userA: res.creatorNickName,
                  userB: res.foeNickName,
                  headA: res.creatorPhotoUrl,
                  headB: res.foePhotoUrl,
                  showStart: true,
                  waitFriend: false
                })
              }

              //退出房间
              if (res.exitTime) {
                if (this.data.showStart || this.data.end) {
                  _this.setData({
                    dialog: true
                  })
                }
                _this.setData({
                  gamerExit: true
                })
              }

              //接收的题目信息
              if (res.word) {
                let exit = 'ExitFight {"fightID":' + res.fightID + '}'
                _this.countDown(res.time)
                _this.setData({
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
                  exit: exit,
                  wait: false
                })
                wx.setNavigationBarColor({
                  frontColor: '#ffffff',
                  backgroundColor: '#4E84E5',
                  animation: {
                    duration: 0,
                    timingFunc: 'easeIn'
                  }
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
                let avgAnswerA = ""
                let avgAnswerB = ""
                if (userTimeA == userID) {
                  // console.log('是A用户')
                  avgAnswerA = res.avgAnswerA
                  avgAnswerB = res.avgAnswerB
                } else {
                  // console.log('是B用户')
                  avgAnswerA = res.avgAnswerB
                  avgAnswerB = res.avgAnswerA
                }
                let resA = _this.sixDecimal(avgAnswerA)
                let resB = _this.sixDecimal(avgAnswerB)
                if (userID == winUser) {
                  victory = true
                } else {
                  victory = false
                }
                let title = '我在一场单词对决中获得了' + this.data.scoreA + '分，快来挑战吧！'
                let path = '/pages/index/index'
                clearInterval(this.data.timerID)
                _this.setData({
                  victory: victory,
                  userInfo: false,
                  content: false,
                  end: true,
                  avgAnswerA: resA,
                  avgAnswerB: resB,
                  exit: "",
                  title: title,
                  path: path
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
              console.log('接收的信息错误')
            }
          })

        }

      } else {
        console.log('未登录')
        this.login.showLogin()
      }
    })

  },

  //取消事件 
  _cancelEvent() {
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  },

  //确认事件
  _confirmEvent() {
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })
    app.getUser((res) => {
      if (res) {
        this.setData({
          name: res.name,
          head: res.head,
          userID: res.userID
        })
        //连接Socket
        app.connectSocket()

        let _this = this

        wx.onSocketOpen((res) => {
          console.log('WebSocket连接已打开！')
          // console.log(this.data.roomID)
          let message = 'joinRoom {"roomID":' + this.data.roomID + '}'
          // console.log('发送消息=' + message)
          //发送的消息
          app.send(message)
          //接收的消息
          app.accept((res) => {
            //接收的用户信息
            if (res) {

              //用户信息
              if (res.foeNickName) {

                if (this.data.userID != res.creatorUID && this.data.userID != res.foeUID) {
                  _this.setData({
                    full: true
                  })
                }

                if (res.creatorExit) {
                  _this.setData({
                    dialog: true
                  })
                }

                _this.setData({
                  userA: res.foeNickName,
                  userB: res.creatorNickName,
                  headA: res.foePhotoUrl,
                  headB: res.creatorPhotoUrl,
                  waitStart: true,
                  invite: false,
                  waitFriend: false
                })
              }

              //退出房间
              if (res.exitTime) {
                if (this.data.waitStart || this.data.end) {
                  _this.setData({
                    dialog: true
                  })
                }
                _this.setData({
                  gamerExit: true
                })
              }

              //接收的题目信息
              if (res.word) {
                let exit = 'ExitFight {"fightID":' + res.fightID + '}'
                _this.countDown(res.time)
                _this.setData({
                  waitStart: false,
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
                  exit: exit,
                  wait: false
                })
                wx.setNavigationBarColor({
                  frontColor: '#ffffff',
                  backgroundColor: '#4E84E5',
                  animation: {
                    duration: 0,
                    timingFunc: 'easeIn'
                  }
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
                let avgAnswerA = ""
                let avgAnswerB = ""
                if (userTimeA == userID) {
                  // console.log('是A用户')
                  avgAnswerA = res.avgAnswerA
                  avgAnswerB = res.avgAnswerB
                } else {
                  // console.log('是B用户')
                  avgAnswerA = res.avgAnswerB
                  avgAnswerB = res.avgAnswerA
                }
                let resA = _this.sixDecimal(avgAnswerA)
                let resB = _this.sixDecimal(avgAnswerB)
                if (userID == winUser) {
                  victory = true
                } else {
                  victory = false
                }
                let title = '我在一场单词对决中获得了' + this.data.scoreA + '分，快来挑战吧！'
                let path = '/pages/index/index'
                clearInterval(this.data.timerID)
                _this.setData({
                  victory: victory,
                  userInfo: false,
                  content: false,
                  end: true,
                  avgAnswerA: resA,
                  avgAnswerB: resB,
                  exit: "",
                  title: title,
                  path: path
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
              console.log('接收的信息错误')
            }
          })
        })



      } else {
        //未登录
        this.login.showLogin()
      }
    })
    this.login.hideLogin()
  },

  //开始
  start() {
    let message = 'RoomFight {"roomID":' + this.data.roomID + '}'
    if (this.data.gamerExit) {
      this.setData({
        dialog: true
      })
      return false
    }
    app.send(message)
    this.setData({
      showStart: false
    })
  },

  determine() {
    if (this.data.dialog) {
      this.setData({
        dialog: false
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
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
  play() {
    let audio = this.data.audio
    wx.playBackgroundAudio({
      dataUrl: audio,
      success: function(res) {},
    })
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

  //返回首页
  back() {
    this.setData({
      waitStart: false,
      showStart: false,
      end: false
    })
    app.send(this.data.exitRoom)
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  //继续挑战
  challenge() {
    if (this.data.gamerExit) {
      _this.setData({
        dialog: true
      })
      return false
    }

    this.setData({
      end: false,
      scoreA: 0,
      scoreB: 0,
      earlyA: false,
      earlyB: false,
      height: 0,
      time: 10,
      wait: true,
      gamerExit: false
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#093D73',
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    let message = 'ResetRoom {"roomID":' + this.data.roomID + '}'
    app.send(message)
  },

  //放弃
  giveUp() {
    this.setData({
      waitStart: false,
      showStart: false,
      end: false
    })
    app.send(this.data.exitRoom)
    wx.reLaunch({
      url: '/pages/index/index'
    })
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
      if (this.data.share) {
        // console.log('分享不用退出房间')
      } else {
        app.send(this.data.exitRoom)
      }
    } else {
      if (app.isNull(this.data.exit)) {
        if (this.data.showStart) {
          app.send(this.data.exitRoom)
        }
        if (this.data.waitStart) {
          app.send(this.data.exitRoom)
        }
      } else {
        app.send(this.data.exit)
        app.send(this.data.exitRoom)

        if (this.data.own) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }

      }
    }



  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

    clearInterval(this.data.timerID)

    if (this.data.end) {
      this.setData({
        waitStart: false,
        showStart: false,
        end: false
      })
      app.send(this.data.exitRoom)
    } else {
      if (app.isNull(this.data.exit)) {
        app.send(this.data.exitRoom)
      } else {
        app.send(this.data.exit)
        app.send(this.data.exitRoom)
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
    _this.setData({
      share: true
    })
    if (res.from === 'button') {
      return {
        title: this.data.title,
        imageUrl: '/images/vs.png',
        path: this.data.path,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {
          _this.setData({
            invite: false,
            waitFriend: true,
            share: false
          })
        }
      }
    } else {
      return {
        title: '快来和' + this.data.name + '对战单词量',
        // imageUrl: this.data.inviteImg + '?x-oss-process=image/resize,m_fill,h_500,w_400,limit_0',
        path: '/pages/friend/friend?roomID=' + this.data.roomID + '&userID=' + this.data.userID,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {}
      }
    }
  }
})