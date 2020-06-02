// pages/wordList/wordList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.globalData.chapterID = options.chapterID
    let getUnitWord = app.getUnitWord()
    if (app.isNull(getUnitWord)){
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
        } else {
          console.log('数据错误')
        }
      })
    }else{
      let list = app.getUnitByID(options.chapterID)
      if (app.isNull(list)){
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
          } else {
            console.log('数据错误')
          }
        })
      }else{
        console.log('是本章单词缓存')
        let wordList = list.wordList
        this.setData({
          wordList: wordList
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})