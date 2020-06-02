// pages/material/material.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allList: [],
    gradeList: [],
    bookList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let getBid = app.getCurrentBook()
    // console.log(getBid)
    if (!app.isNull(getBid)) {
      this.setData({
        bid: getBid
      })
    }


    app.getUser((res) => {
      if (res) {
        this.setData({
          userID: res.userID,
          openID: res.openID
        })
      }
    })

    app.getSystemInfo((res) => {
      this.setData({
        height: res.windowHeight
      })
    })


    app.getTeachData((res) => {

      //所有列表
      let allList = res
      // console.log(allList)

      let tmp = res.map(v => v.bookGroup)
      let set = new Set(tmp)

      //级别列表
      let gradeList = Array.from(set)
      // console.log(gradeList)

      //级别
      let grade = gradeList[0]
      // console.log(grade)

      //书列表
      let bookList = allList.filter((item) => {
        return item.bookGroup == grade
      })
      // console.log(bookList)

      this.setData({
        allList: allList,
        gradeList: gradeList,
        bookList: bookList,
        grade: grade
      })

    })

  },

  //选择级别
  select(e) {
    let grade = e.currentTarget.dataset.grade
    let allList = this.data.allList
    let bookList = allList.filter((item) => {
      return item.bookGroup == grade
    })
    this.setData({
      grade: grade,
      bookList: bookList
    })
  },

  //选择书籍
  choose(e) {
    let bookID = e.currentTarget.dataset.bookid
    let grade = e.currentTarget.dataset.title
    let userID = this.data.userID
    let openID = this.data.openID

    this.setData({
      bid: bookID
    })

    let sign = app.getAjaxSign({
      bookID: bookID,
      uuid: userID,
      deviceID: openID,
      deviceType: '4',
      source: 'WeChat_Applet'
    })
    wx.request({
      url: app.globalData.requestUrl + 'api/word/chapters',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        bookID: sign.bookID,
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
          let gradeList = tmp

          let bookList = {
            bookID: bookID,
            grade: grade,
            index: 0,
            gradeList: gradeList
          }

          app.setCurrentBook(bookID)

          let _res = app.addNewBook(bookList)

          let books = app.getBooks()

          if (_res) {
            wx.showToast({
              title: '选择成功',
              icon: 'success',
              duration: 2000,
              success: function(res) {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
          } else {
            //
            console.log('添加失败')
          }

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