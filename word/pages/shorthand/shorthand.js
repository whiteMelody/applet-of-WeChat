// pages/shorthand/shorthand.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rememberNum: 1,
    wordNum: 0,
    index: 0,
    width: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.globalData.chapterID = options.chapterID
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
      }
    }



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    let width = (index+1) / wordList.length * 100
    if (index == wordList.length) {
      this.setData({
        width: width,
        rememberNum:index
      })
      wx.showModal({
        title: '提示',
        content: '已经记完本单元单词',
        showCancel: false,
        success: function(res) {}
      })
    } else {
      this.setData({
        word: wordList[index].word,
        phonetic: wordList[index].phonetic,
        explain: wordList[index].explain,
        sentences: wordList[index].sentences,
        audio: wordList[index].audio,
        index: index,
        width: width,
        rememberNum:index+1
      })
      this.play()
    }
  },

  //播放读音
  play(){
    let audio = this.data.audio
    wx.playBackgroundAudio({
      dataUrl: audio,
      success: function (res) {
      },
    })
  },

  //退出
  back() {
    wx.navigateBack({
      delta: 1
    })
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