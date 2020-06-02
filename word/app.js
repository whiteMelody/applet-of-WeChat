//app.js
import {
  md5
} from "utils/md5.js"

App({

  //each 函数
  each(object, callback) {
    var type = (function() {
      switch (object.constructor) {
        case Object:
          return 'Object';
          break;
        case Array:
          return 'Array';
          break;
        case NodeList:
          return 'NodeList';
          break;
        default:
          return 'null';
          break;
      }
    })();
    if (type === 'Array' || type === 'NodeList') {
      [].every.call(object, function(v, i) {
        return callback.call(v, i, v) === false ? false : true;
      });
    } else if (type === 'Object') {
      for (var i in object) {
        if (callback.call(object[i], i, object[i]) === false) {
          break;
        }
      }
    }
  },

  //签名函数
  getAjaxSign(params) {
    var _timestamp = Math.round(new Date().getTime() / 1000);
    var arr = [];
    var str = '';
    if (this.isNull(params)) {
      params = {};
    }
    params.timestemp = _timestamp;
    this.each(params, function(key, value) {
      arr.push(key);
    });
    arr = arr.sort();
    for (var i = 0; i < arr.length; i++) {
      var _tmp = arr[i] + '=' + params[arr[i]] + '&';
      str += _tmp;
    }
    str += 'key=7DF87DDAB965433292F0E7D28A09EA36';
    params.sign = md5(str);
    return params;
  },

  //连接Socket
  connectSocket() {
    let _this = this

    _this.getUser((res) => {
      if (res) {
        let userID = res.userID
        //deapi.7english.cn:6188

        wx.connectSocket({
          // url: 'wss://tests.bombsport.com:6188/' + userID,
          url: 'wss://deapi.7english.cn:6188/' + userID,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function() {
            console.log("连接成功...")
          },
          fail: function() {
            console.log("连接失败...")
          }
        })

        wx.onSocketOpen((res) => {
          console.log('WebSocket连接已打开！')
        })

        wx.onSocketError(function(res) {
          console.log('WebSocket连接打开失败，请检查！')
        })


      } else {
        console.log('未登录')
      }
    })

  },

  //发送Socket消息
  send(msg) {
    console.log('发送的消息=' + msg)
    wx.sendSocketMessage({
      data: msg
    })
  },

  //收到的信息
  accept(call) {
    let _this = this
    wx.onSocketMessage(function(res) {
      console.log(res)

      let match = res.data.substring(0, 5)
      let testnext = res.data.substring(0, 8)
      let Answer = res.data.substring(0, 6)
      let room = res.data.substring(0, 4)


      //好友对战创建房间
      if (room == 'room' || room == 'Room') {
        let roomNum = JSON.parse(res.data.substring(5))
        call(roomNum)
      }

      //好友对战加入房间
      if (testnext == 'JoinRoom' || testnext == 'joinRoom') {
        let roomInfo = JSON.parse(res.data.substring(9))
        call(roomInfo)
      }

      //退出房间
      if (testnext == 'ExitRoom' || testnext == 'exitRoom') {
        let exitInfo = JSON.parse(res.data.substring(9))
        call(exitInfo)
      }

      //匹配
      if (match == 'match' || match == 'Match') {
        let userInfo = JSON.parse(res.data.substring(6))
        let userA = userInfo.me.nickName
        let userB = userInfo.foeUser.nickName
        let headA = userInfo.me.photoUrl
        let headB = userInfo.foeUser.photoUrl
        let cityA = userInfo.me.city
        let cityB = userInfo.foeUser.city
        let battleinfo = {}
        battleinfo = {
          userA,
          userB,
          headA,
          headB,
          cityA,
          cityB
        }
        call(battleinfo)
      }

      //题目
      if (testnext == 'testnext') {
        let question = JSON.parse(res.data.substring(9))
        let time = question.answerSecond
        let word = question.word
        let tmp = question.option

        let questionList = []
        for (let i = 0; i < tmp.length; i++) {
          questionList.push({
            val: tmp[i],
            state: 0, // 0 未选择 1 true 2 false
          })
        }

        let audio = question.audio
        let fightID = question.fightID
        let serialNo = question.serialNo
        let answer = question.answer
        let multiple = question.multiple
        let isSelect = false
        let earlyA = false
        let earlyB = false
        let questioninfo = {}
        questioninfo = {
          question,
          time,
          word,
          questionList,
          audio,
          fightID,
          serialNo,
          answer,
          multiple,
          isSelect,
          earlyA,
          earlyB
        }
        call(questioninfo)
        _this.play(audio)
      }

      //得分
      if (Answer == 'Answer') {
        let result = JSON.parse(res.data.substring(7))
        call(result)
      }

      //结束
      if (testnext == 'gameover') {
        // console.log('结束')
        let gameover = JSON.parse(res.data.substring(9))
        // console.log(gameover)

        let endTime = gameover.endTime
        let avgAnswerA = gameover.avgAnswerA
        let avgAnswerB = gameover.avgAnswerB
        let userTimeA = gameover.userA
        let winUser = gameover.winUser

        let gameoverinfo = {
          endTime,
          avgAnswerA,
          avgAnswerB,
          userTimeA,
          winUser
        }
        call(gameoverinfo)
      }

      //再来一局


    })
  },

  //查询房间号
  getRoomID() {
    let res = wx.getStorageSync('RoomID')
    return res
  },

  //存房间号
  setRoomID(roomID) {
    wx.setStorageSync('RoomID', roomID)
    return true
  },

  //播放读音
  play(audio) {
    // wx.playBackgroundAudio({
    //   dataUrl: audio,
    //   success: function(res) {},
    // })
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = audio
  },

  //心跳重连
  heartCheck() {
    let msg = '心跳重连'
    console.log(msg)
    this.send(msg)
    this.accept((res) => {
      console.log(res)
    })
  },


  //监听Socket
  getSocket() {
    wx.onSocketOpen(function(res) {
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败，请检查！')

    })
  },

  //关闭Socket
  closeSocket() {
    wx.closeSocket()
    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！')
    })
  },

  //存用户等级经验
  setLevel(val) {

    let level = val.level
    let levelName = val.levelName
    let exp = val.exp
    let maxexp = val.maxexp
    let width = val.width

    wx.setStorage({
      key: "level",
      data: {
        level,
        levelName,
        exp,
        maxexp,
        width
      },
      success: function(res) {

      }
    })
  },

  //获取用户等级经验
  getLevel(call) {
    wx.getStorage({
      key: 'level',
      success: (res) => {
        let userLevel = res
        if (userLevel) {
          call(userLevel.data)
        } else {
          call(false)
        }
      },
      fail: (res) => {
        call(false)
      }
    })
  },

  //获取用户等级
  getUserLevel(call) {
    let _this = this
    this.getUser((res) => {
      if (res) {
        let userID = res.userID
        let openID = res.openID
        let sign = this.getAjaxSign({
          uuid: userID,
          deviceID: openID,
          deviceType: '4',
          source: 'WeChat_Applet'
        })
        wx.request({
          url: this.globalData.requestUrl + 'api/user/userInfo',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            uuid: sign.uuid,
            deviceID: sign.deviceID,
            deviceType: sign.deviceType,
            source: sign.source,
            sign: sign.sign,
            timestemp: sign.timestemp
          },
          method: 'POST',
          success: function(res) {
            let message = res.data.message
            if (res.data.status == 1) {
              let level = res.data.returnJSON.level
              let levelName = res.data.returnJSON.levelName
              let exp = res.data.returnJSON.exp
              let maxexp = res.data.returnJSON.maxexp
              let width = exp / maxexp * 100
              let userLevel = {
                level,
                levelName,
                exp,
                maxexp,
                width
              }
              call(userLevel)
              _this.setLevel(userLevel)
            } else {
              wx.showModal({
                title: '提示',
                content: message,
                showCancel: false,
                success: function(res) {}
              })
            }
          }
        })
      } else {
        console.log('未登录')
      }
    })
  },

  //获取错题
  getErrorWord(call) {
    let _this = this
    this.getUser((res) => {
      if (res) {
        let userID = res.userID
        let openID = res.openID
        let sign = this.getAjaxSign({
          uuid: userID,
          deviceID: openID,
          deviceType: '4',
          source: 'WeChat_Applet'
        })
        wx.request({
          url: this.globalData.requestUrl + 'api/fight/errorWorkList',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            uuid: sign.uuid,
            deviceID: sign.deviceID,
            deviceType: sign.deviceType,
            source: sign.source,
            sign: sign.sign,
            timestemp: sign.timestemp
          },
          method: 'POST',
          success: function(res) {
            let message = res.data.message
            if (res.data.status == 1) {
              let tmp = res.data.returnJSON
              call(tmp)
            } else {
              wx.showModal({
                title: '提示',
                content: message,
                showCancel: false,
                success: function(res) {}
              })
            }
          }
        })
      } else {
        console.log('未登录')
      }
    })
  },


  //获取屏幕详情
  getSystemInfo(call) {
    wx.getSystemInfo({
      success: function(res) {
        let windowWidth = res.windowWidth
        let windowHeight = res.windowHeight
        let screen = {
          windowWidth,
          windowHeight
        }
        call(screen)
      }
    })
  },

  //获取所有的书籍
  getTeachData(call) {
    this.getUser((res) => {
      if (res) {
        let openID = res.openID
        let sign = this.getAjaxSign({
          deviceID: openID,
          deviceType: '4',
          source: 'WeChat_Applet'
        })
        wx.request({
          url: this.globalData.requestUrl + 'api/word/books',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            deviceID: sign.deviceID,
            deviceType: sign.deviceType,
            source: sign.source,
            sign: sign.sign,
            timestemp: sign.timestemp
          },
          method: 'POST',
          success: function(res) {
            let message = res.data.message
            if (res.data.status == 1) {
              let tmp = res.data.returnJSON
              call(tmp)
            } else {
              call(false)
            }
          }
        })
      } else {
        console.log('未登录')
      }
    })
  },


  //单词列表
  getWord(call) {
    let chapterID = this.globalData.chapterID
    this.getUser((res) => {
      if (res) {
        let userID = res.userID
        let openID = res.openID
        let sign = this.getAjaxSign({
          chapterID: chapterID,
          uuid: userID,
          deviceID: openID,
          deviceType: '4',
          source: 'WeChat_Applet'
        })
        wx.request({
          url: this.globalData.requestUrl + 'api/word/words',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            chapterID: sign.chapterID,
            uuid: sign.uuid,
            deviceID: sign.deviceID,
            deviceType: sign.deviceType,
            source: sign.source,
            sign: sign.sign,
            timestemp: sign.timestemp
          },
          method: 'POST',
          success: function(res) {
            var str = "|";
            let message = res.data.message
            if (res.data.status == 1) {
              let tmp = res.data.returnJSON
              call(tmp)
            } else {
              call(false)
            }
          }
        })
      } else {
        console.log('未登录')
      }
    })
  },

  //存已背单词
  setRememberWord(list) {
    wx.setStorageSync('RememberWord', JSON.stringify(list))
    return true
  },

  //获取已背单词
  getRememberWord() {
    let res = wx.getStorageSync('RememberWord')
    if (this.isNull(res)) {
      return []
    } else {
      return JSON.parse(res)
    }
  },

  //获取已背单词ID
  getRememberID(id) {
    let RememberWord = this.getRememberWord()
    let res = RememberWord.filter((item) => {
      return item.chapterID == id
    })
    if (res.length > 0) {
      return res[0]
    } else {
      return null
    }
  },

  //覆盖已背单词
  setRememberID(word) {
    let RememberWord = this.getRememberWord()
    for (let i = 0; i < RememberWord.length; i++) {
      if (word.chapterID == RememberWord[i].chapterID) {
        RememberWord[i] = word
      }
    }
    this.setRememberWord(RememberWord)
  },

  //增加已背单词
  addRememberWord(word) {
    let RememberWord = this.getRememberWord()

    if (RememberWord.length > 0) {
      //push
      let res = this.getRememberID(word.chapterID)
      if (res) {
        //覆盖
        let _word = this.setRememberID(word)
        console.log('覆盖')
        //--
      } else {
        //新增
        RememberWord.push(word)
        this.setRememberWord(RememberWord)
        console.log('新增')
      }
    } else {
      //new
      RememberWord = []
      RememberWord.push(word)
      this.setRememberWord(RememberWord)
    }
    return RememberWord
  },


  onLaunch: function() {

  },

  onShow: function() {
    this.connectSocket()
  },

  onHide: function() {
    console.log('退出小程序')
    this.closeSocket()
  },


  // 登录
  getUser(call) {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        let user = res
        if (user) {
          call(user.data)
        } else {
          call(false)
        }
      },
      fail: (res) => {
        call(false)
      }
    })
  },

  //查询书id
  getCurrentBook() {
    let res = wx.getStorageSync('bid')
    return res
  },

  //存书id
  setCurrentBook(bid) {
    wx.setStorageSync('bid', bid)
    return true
  },

  //查询章节单词
  getUnitWord() {
    let res = wx.getStorageSync('word')
    if (this.isNull(res)) {
      return []
    } else {
      return JSON.parse(res)
    }
  },

  //章节单词
  setUnitWord(list) {
    wx.setStorageSync('word', JSON.stringify(list))
    return true
  },

  //是否是本章节单词
  getUnitByID(id) {
    let list = this.getUnitWord()
    let _res = list.filter((item) => {
      return item.chapterID == id
    })
    if (_res.length > 0) {
      return _res[0]
    } else {
      return null
    }
  },

  //获取选择的书
  getBooks() {
    let res = wx.getStorageSync('books')
    if (this.isNull(res)) {
      return []
    } else {
      return JSON.parse(res)
    }
  },


  setBooks(list) {
    wx.setStorageSync('books', JSON.stringify(list))
    return true
  },

  getBookByID(id) {
    let books = this.getBooks()
    let _res = books.filter((item) => {
      return item.bookID == id
    })
    if (_res.length > 0) {
      return _res[0]
    } else {
      return null
    }
  },

  setBookByID(newBook) {
    let books = this.getBooks()
    for (let i = 0; i < books.length; i++) {
      if (newBook.bookID == books[i].bookID) {
        books[i] = newBook
      }
    }
    this.setBooks(books)
  },

  setBookIndex(id, index) {
    let book = this.getBookByID(id)
    book.index = index
    this.setBookByID(book)
  },

  addNewBook(newBook) {
    let books = this.getBooks()

    if (books.length > 0) {
      //push
      let _res = this.getBookByID(newBook.bookID)
      if (_res) {
        //覆盖
        let _book = this.setBookByID(newBook)
        console.log('覆盖')
        //--
      } else {
        //新增
        books.push(newBook)
        this.setBooks(books)
        console.log('新增')
      }
    } else {
      //new
      books = []
      books.push(newBook)
      this.setBooks(books)
    }
    return books
  },

  removeBookByID(id) {
    let books = this.getBooks()
    for (let i = 0; i < books.length; i++) {
      if (newBook.bookID == books.bookID) {
        books.splice(i, 1)
      }
    }
    this.setBooks(books)
  },


  isNull: function isNull(obj) {
    if (obj == undefined || obj == 'undefined' || obj == null || obj == 'null' || obj == "" || obj.length == 0) return true;
    else return false;
  },

  globalData: {
    // requestUrl: 'https://tests.bombsport.com:4431/',
    requestUrl: 'https://deapi.7english.cn:4433/',
    book: {},
    chapterID: 0,
    userInfo: {},
    socket: {},
    userID: 0,
    timerID: 0,
    level: {},
    time: 10
  }
})