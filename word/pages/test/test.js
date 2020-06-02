// pages/test/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timerID: 0,
    rememberNum: 1,
    wordNum: 0,
    index: 0,
    width: 0,
    widthback: 0,
    writeWord: "",
    answer: false,
    right:false,
    error:false,
    rememberWord:[],
    errorList: [],
    end: false,
    score: 0,
    focus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.getSystemInfo((res) => {
      this.setData({
        height: res.windowHeight,
        windowWidth: res.windowWidth
      })
    })

    app.globalData.chapterID = options.chapterID

    this.setData({
      chapterID: options.chapterID
    })

    let getUnitWord = app.getUnitWord()
    if (app.isNull(getUnitWord)) {
      console.log('没有单词缓存')
      app.getWord((res) => {
        if (res) {
          let chapterID = options.chapterID
          let wordList = res
          let tmp = {
            chapterID: chapterID,
            wordList: wordList
          }
          let arr = []
          arr.push(tmp)
          app.setUnitWord(arr)
          this.setData({
            wordList: res
          })
          this.getWord()
          this.getTime()
        } else {
          console.log('数据错误')
        }
      })
    } else {
      let list = app.getUnitByID(options.chapterID)
      if (app.isNull(list)) {
        console.log('不是本章单词缓存')
        app.getWord((res) => {
          if (res) {
            let chapterID = options.chapterID
            let wordList = res
            let tmp = {
              chapterID: chapterID,
              wordList: wordList
            }
            let arr = []
            arr.push(tmp)
            app.setUnitWord(arr)
            this.setData({
              wordList: res
            })
            this.getWord()
            this.getTime()
          } else {
            console.log('数据错误')
          }
        })
      } else {
        console.log('是本章单词缓存')
        let wordList = list.wordList
        this.setData({
          wordList: wordList
        })
        this.getWord()
        this.getTime()
      }
    }

  },

  getTime() {
    let timerID = this.data.timerID
    timerID = setInterval(() => {
      if (this.data.paused) {
        clearInterval(timerID)
        // console.log('暂停')
      }
      let windowWidth = this.data.windowWidth
      let widthback = this.data.widthback

      widthback++
      // console.log(widthback)
      if (widthback == windowWidth) {
        console.log('时间到')
       
        let errorList = this.data.errorList
        let word = this.data.word
        let explain = this.data.explain
        errorList.push({
          word: word,
          explain: explain
        })

        this.setData({
          widthback: 0,
          answer: true,
          paused: true,
          errorList: errorList
        })
        setTimeout(() => {
          this.next()
        }, 1000)
      } else {
        this.setData({
          widthback: widthback
        })
      }
    }, 50)

  },

  //获取单词
  getWord() {
    let wordList = this.data.wordList
    let wordNum = wordList.length
    let word = wordList[0].word
    let phonetic = wordList[0].phonetic
    let explain = wordList[0].explain
    let sentences = wordList[0].sentences
    let audio = wordList[0].audio
    let index = this.data.index + 1
    let width = index / wordList.length * 100
    this.setData({
      word: word,
      phonetic: phonetic,
      explain: explain,
      sentences: sentences,
      audio: audio,
      wordNum: wordNum,
      index: 0,
      width: width
    })
    this.play()
  },

  //记住了，下一个
  next() {
    wx.stopBackgroundAudio()
    let wordList = this.data.wordList
    let index = this.data.index + 1
    let width = (index + 1) / wordList.length * 100

    if (index == wordList.length) {
      let errorList = this.data.errorList
      let score = Math.round((wordList.length - errorList.length) / wordList.length * 100)
      this.setData({
        focus:false,
        width: width,
        rememberNum: index,
        paused: true,
        score: score,
        end: true
      })
    } else {
      this.setData({
        widthback: 0,
        paused: false,
        writeWord: "",
        answer: false,
        word: wordList[index].word,
        phonetic: wordList[index].phonetic,
        explain: wordList[index].explain,
        sentences: wordList[index].sentences,
        audio: wordList[index].audio,
        index: index,
        width: width,
        rememberNum: index + 1
      })
      this.getTime()
      this.play()
    }
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

  //退出
  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  //获取拼写的单词
  bindinput: function(e) {
    let word = this.data.word.toLowerCase()
    let writeWord = e.detail.value.toLowerCase()
    let chapterID = this.data.chapterID
    let rememberWord = this.data.rememberWord
    
    if (writeWord == word) {
      // 单词拼写正确
      this.playRgiht()
      rememberWord.push(word)
      let arr = {
        chapterID: chapterID,
        rememberWord: rememberWord
      }
      let res = app.addRememberWord(arr)

      this.setData({
        paused: true,
        right:true,
        writeWord: writeWord,
        rememberWord: rememberWord
      })
      this.delay()
    }
  },

  //完成
  bindconfirm: function(e) {
    let writeWord = e.detail.value.toLowerCase()
    let word = this.data.word.toLowerCase()
    let chapterID = this.data.chapterID
    
    if (writeWord == word) {
      // 单词拼写正确
      this.setData({
        right: true,
        paused: true
      })
      this.delay()
    } else {
      // 单词拼写错误

      let errorList = this.data.errorList
      let _word = this.data.word
      let explain = this.data.explain
      errorList.push({
        word: _word,
        explain: explain
      })

      this.playError()
      this.setData({
        error:true,
        answer: true,
        paused: true,
        writeWord: writeWord,
        errorList: errorList
      })
      this.delay()
    }
  },

  //我不会
  cant() {
    let errorList = this.data.errorList
    let word = this.data.word
    let explain = this.data.explain
    errorList.push({
      word: word,
      explain: explain
    })
    this.setData({
      answer: true,
      paused: true,
      errorList: errorList
    })
    this.delay()
  },

  //延迟
  delay() {
    setTimeout(() => {
      this.setData({
        widthback: 0,
        right: false,
        error: false
      })
      this.next()
    }, 1000)
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


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      paused: true
    })
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
  onShareAppMessage: function() {

  }
})