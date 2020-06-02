// pages/mean/mean.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rememberNum: 1,
    wordNum: 0,
    index: 0,
    width: 0,
    chance: 2,
    errorList: [],
    end: false,
    score: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.globalData.chapterID = options.chapterID
    let getUnitWord = app.getUnitWord()
    if (app.isNull(getUnitWord)) {
      // console.log('没有单词缓存')
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
        } else {
          // console.log('数据错误')
        }
      })
    } else {
      let list = app.getUnitByID(options.chapterID)
      if (app.isNull(list)) {
        // console.log('不是本章单词缓存')
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
          } else {
            // console.log('数据错误')
          }
        })
      } else {
        // console.log('是本章单词缓存')
        let wordList = list.wordList
        this.setData({
          wordList: wordList
        })
        this.getWord()
      }
    }

  },

  //获取单词
  getWord() {
    let wordList = this.data.wordList
    let wordNum = wordList.length
    let word = wordList[0].word
    let explain = wordList[0].explain
    let audio = wordList[0].audio
    let index = this.data.index + 1
    let width = index / wordList.length * 100
    this.getExplain(explain)

    this.setData({
      word: word,
      explain: explain,
      audio: audio,
      wordNum: wordNum,
      index: 0,
      width: width
    })
    this.play()
  },

  //组成选择的词义数组
  getExplain(e) {
    let wordList = this.data.wordList
    let arr = wordList.filter((item) => {
      return item.explain == e
    })
    let tmp = wordList.filter((item) => {
      return item.explain != e
    })
    //随机取3个数组出来
    let _tmp = []
    let num = 3
    for (let i = 0; i < num; i++) {
      let _arr = Math.floor(Math.random() * (tmp.length - i))
      _tmp.push(tmp[_arr])
      tmp[_arr] = tmp[tmp.length - i - 1]
    }
    //连接数组
    let __tmp = arr.concat(_tmp)
    //乱序
    let explainList = []
    for (let i = 0, len = __tmp.length; i < len; i++) {
      let randomIndex = Math.floor(Math.random() * __tmp.length);
      explainList[i] = __tmp[randomIndex];
      __tmp.splice(randomIndex, 1);
    }
    //增加一个选择正确错误的字段
    for (let i = 0; i < explainList.length; i++) {
      explainList[i].select = 0
    }
    this.setData({
      explainList: explainList
    })

  },


  //选择词义
  select(e) {
    let wordMean = e.currentTarget.dataset.mean
    let index = e.currentTarget.dataset.index
    let explain = this.data.explain
    let chance = this.data.chance
    let explainList = this.data.explainList

    let errorList = this.data.errorList
    let word = this.data.word

    for (let i = 0; i < explainList.length; i++) {
      explainList[i].select = 0
    }
    if (this.data.answer) {
      return false
    }
    if (chance == 2) {
      if (wordMean == explain) {
        explainList[index].select = 1
        this.setData({
          explainList: explainList,
          answer: true
        })
        this.playRgiht()
        setTimeout(() => {
          this.next()
        }, 1000)
      } else {
        explainList[index].select = 2
        this.setData({
          chance: 1,
          explainList: explainList
        })
        this.playError()
      }
    }
    if (chance == 1) {
      if (wordMean == explain) {
        explainList[index].select = 1
        this.setData({
          explainList: explainList,
          answer: true
        })
        this.playRgiht()
        setTimeout(() => {
          this.next()
        }, 1000)
      } else {
        errorList.push({
          word: word,
          explain: explain
        })
        explainList[index].select = 2
        this.setData({
          chance: 0,
          explainList: explainList,
          errorList: errorList
        })
        this.playError()
      }
    }

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
        width: width,
        rememberNum: index,
        score: score,
        end: true
      })
    } else {
      this.getExplain(wordList[index].explain)
      this.setData({
        chance: 2,
        answer: false,
        word: wordList[index].word,
        explain: wordList[index].explain,
        audio: wordList[index].audio,
        index: index,
        width: width,
        rememberNum: index + 1
      })
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