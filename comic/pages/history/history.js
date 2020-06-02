// pages/history/history.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bookShelf = app.getBookShelf()

    this.setData({
      datas: bookShelf
    })

    console.log(bookShelf)
    
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

  readChapter(e) {
    //开始 | 继续 阅读章节

    // let work_id = e.currentTarget.dataset.id

    // //读取上一次阅读的位置
    // let index = 0
    // //获取本地书架
    // let bookShelf = app.getBookShelf()
    // for (let i = 0; i < bookShelf.length; i++) {
    //   if (bookShelf[i].work_id == work_id) {
    //     //阅读过
    //     index = bookShelf[i].readIndex
    //   }
    // }
    // wx.navigateTo({
    //   url: '/pages/comic/comic?work_id=' + work_id + '&chapter_id=' + this.data.datas[index].id,
    // })

  },

})