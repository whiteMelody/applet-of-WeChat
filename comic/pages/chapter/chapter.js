// pages/lesson/lesson.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 0,
    work_id: 0,
    comic: {},
    datas: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    isRead: false,
    showShare: false,
    freeNum: 5,
    read_title: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      work_id: options.work_id
    })

    //获取漫画详情
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.ComicInfo',
      data: { work_id: options.work_id },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {

        if(res.data.data.code == 200){
          this.setData({
            comic: res.data.data.data
          })
        }
        console.log(res.data.data.data)
        
      }
    })

    //章节列表
    wx.request({
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.ChapterList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { work_id: options.work_id },
      method: 'GET',
      success: (res) => {
        console.log(res.data.data.data)
        if (res.data.data.code == 200) {
          let _tmp = res.data.data.data
          for(let i=0; i<_tmp.length; i++){
            _tmp[i].updatetime2 = app.timestampToTime(_tmp[i].updatetime)
          }

          let freeNum = 5
          let isRead = false
          let read_title = _tmp[0].title

          //获取本地书架
          let bookShelf = app.getBookShelf()

          if (bookShelf.length > 0){
            for (let i = 0; i < bookShelf.length; i++){
              if(bookShelf[i].work_id == options.work_id){
                //阅读过
                isRead = true
                //查询是否解锁过
                if (bookShelf[i].isLock == false){
                  freeNum = 9999
                }

                read_title = bookShelf[i].read_title

              }
            }
          }

          this.setData({
            read_title: read_title,
            isRead: isRead,
            datas: _tmp,
            freeNum: freeNum
          })

        }
      }
    })

  },

  changeType(e){
    this.setData({
      showType: e.currentTarget.dataset.value
    })
  },

  showDonwLoad() {
    this.setData({
      showDownload: true
    })
  },

  closeDownload() {
    this.setData({
      showDownload: false
    })
  },

  readChapter(){
    //开始 | 继续 阅读章节

    let isRead = this.data.isRead
    let work_id = this.data.work_id

    if(isRead){
      //读取上一次阅读的位置
      let index = 0
      //获取本地书架
      let bookShelf = app.getBookShelf()
      for (let i = 0; i < bookShelf.length; i++) {
        if (bookShelf[i].work_id == work_id) {
          //阅读过
          index = bookShelf[i].readIndex
        }
      }
      wx.navigateTo({
        url: '/pages/comic/comic?work_id=' + work_id + '&chapter_id=' + this.data.datas[index].id,
      })
    }else{
      //阅读本章第一节
      wx.navigateTo({
        url: '/pages/comic/comic?work_id=' + work_id + '&chapter_id=' + this.data.datas[0].id,
      })
    }

  },

  toDetail(e){
    let index = e.currentTarget.dataset.index || e.target.dataset.index
    let work_id = e.currentTarget.dataset.work_id || e.target.dataset.work_id
    let chapter_id = e.currentTarget.dataset.chapter_id || e.target.dataset.chapter_id

    if (index >= this.data.freeNum){
      this.openShare()
    }else{
      wx.navigateTo({
        url: '/pages/comic/comic?work_id=' + work_id + '&chapter_id=' + chapter_id,
      })
    }

  },

  openShare() {
    this.setData({
      showShare: true
    })
  },

  closeShare() {
    this.setData({
      showShare: false
    })
  },

  unlock(){

    this.setData({
      freeNum: 99999
    })

    //存入本地书架

    let isRead = false

    let bookShelf = app.getBookShelf()

    if (bookShelf.length > 0) {
      for (let i = 0; i < bookShelf.length; i++) {
        if (bookShelf[i].work_id == this.data.options.work_id) {
          //阅读过
          isRead = true
          //解锁
          bookShelf[i].isLock = false
        }
      }

      if (!isRead){
        //加入书架
        bookShelf.push({
          work_id: this.data.comic.id,
          work_title: this.data.comic.book_name,
          read_title: this.data.datas[0].title,
          work_thumb: this.data.comic.thumb,
          readIndex: 0,
          isLock: false,
        })
      }
    }else{
      //加入书架
      bookShelf.push({
        work_id: this.data.comic.id,
        work_title: this.data.comic.book_name,
        read_title: this.data.datas[0].title,
        work_thumb: this.data.comic.thumb,
        readIndex: 0,
        isLock: false,
      })
    }

    app.setBookShelf(bookShelf)

  },

  onShareAppMessage(){
    let _this = this
    return{
      title: "快搜免费漫画",
      imageUrl: _this.data.comic.thumb,
      success(){
        console.log('分享成功')
        //分享成功，解锁本章内容
        _this.closeShare()
        _this.unlock()
      },
      fail(e){
        console.log(e)
      }
    }
  }

})
