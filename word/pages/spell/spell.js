// pages/spell/spell.js
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
    spellList: [],
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
    let imgUrl = wordList[0].imgUrl
    let index = this.data.index + 1
    let width = index / wordList.length * 100
    this.wordsFormat(word)
    this.setData({
      word: word,
      explain: explain,
      audio: audio,
      wordNum: wordNum,
      imgUrl: imgUrl,
      index: 0,
      width: width
    })
    this.play()
  },

  //拼接单词为数组
  wordsFormat(word) {

    //单词长度
    let arr = new Array(word.length);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i
    }
    let chars = word.split("") //字符分割 
    // console.log(chars)
    let _newArr = []
    let _tmpStr = ''
    for (let i = 0; i < chars.length; i++) {
      if (i % 2 == 0) {
        _tmpStr += chars[i]
      } else {
        _tmpStr += chars[i]
        _newArr.push({
          click: false,
          word: _tmpStr
        })
        _tmpStr = ''
      }
    }
    if (chars.length % 2 != 0) {
      _newArr.push({
        click: false,
        word: chars[chars.length - 1]
      })
    }
    let oldWord = []
    oldWord = oldWord.concat(_newArr)
    let newWord = [];
    for (let i = 0, len = _newArr.length; i < len; i++) {
      // 随机选一个
      let randomIndex = Math.floor(Math.random() * _newArr.length);
      // 出列到新数组
      newWord[i] = _newArr[randomIndex];
      // 原来的数组越来越少，因此上面的 randomIndex 需要实时获取 _newArr.length
      _newArr.splice(randomIndex, 1);
    }

    this.setData({
      arr: arr,
      oldWord: oldWord,
      newWord: newWord
    })

  },

  //选择单词
  select(e) {
    let spell = e.currentTarget.dataset.spell
    let word = this.data.word
    let arr = spell.split("")
    let spellList = this.data.spellList
    //判断是否有错误的值
    let _errorWords = spellList.filter((item) => {
      return item.state == 2
    })
    if (_errorWords.length > 0) {
      let ___i = 0
      spellList.length -= _errorWords.length
      let w1 = []
      for (let i = 0; i < arr.length; i++) {
        w1.push({
          i,
          val: arr[i],
          state: 0, // 0 未选择 1 true 2 false
        })
      }
      w1 = spellList.concat(w1)
      this.check(w1, word, spell)
    } else {
      let w1 = []
      for (let i = 0; i < arr.length; i++) {
        w1.push({
          i,
          val: arr[i],
          state: 0, // 0 未选择 1 true 2 false
        })
      }
      w1 = this.data.spellList.concat(w1)
      //检查单词正确与否
      this.check(w1, word, spell)
    }
  },


  //检查单词正确与否
  check(w1, w2, str) {
    let chance = this.data.chance
    let errorList = this.data.errorList
    let explain = this.data.explain
    let right = true
    let _tmp1 = w1
    let _tmp2 = w2.split('')
    let w3 = str.split('')
    let _tmp3 = []
    for (let i = 0; i < _tmp2.length; i++) {
      _tmp3.push({
        i,
        val: _tmp2[i],
        state: 0, // 0 未选择 1 true 2 false
      })
    }
    for (let i = 0; i < _tmp3.length; i++) {
      if (_tmp1[i]) {
        if (_tmp3[i].val == _tmp1[i].val) {
          _tmp1[i].state = 1
        } else {
          _tmp1[i].state = 2
          right = false
        }
      }
    }
    let newWord = this.data.newWord
    if (right) {
      for (let i = 0; i < newWord.length; i++) {
        if (newWord[i].word == str) {
          newWord[i].click = true
        }
      }
    } else {
      if (chance == 2) {
        this.setData({
          chance: 1,
        })
      } else {
        errorList.push({
          word: w2,
          explain: explain
        })
        this.setData({
          chance: 0,
          errorList: errorList
        })
        this.playError()
      }
    }

    this.setData({
      newWord: newWord,
      spellList: _tmp1,
    })

    let _tmp4 = _tmp3
    for (let i = 0; i < _tmp4.length; i++) {
      _tmp4[i].state = 1
    }


    if (_tmp1.toString() == _tmp4.toString()) {
      this.playRgiht()
      setTimeout(() => {
        this.next()
      }, 3000)
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

      this.wordsFormat(wordList[index].word)

      this.setData({
        chance: 2,
        spellList: [],
        word: wordList[index].word,
        explain: wordList[index].explain,
        audio: wordList[index].audio,
        imgUrl: wordList[index].imgUrl,
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
    innerAudioContext.onEnded((res) => {
      this.play()
    })
  },

  //错误答案
  playError() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/sound/error.mp3'
    innerAudioContext.onEnded((res) => {
      this.play()
    })
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