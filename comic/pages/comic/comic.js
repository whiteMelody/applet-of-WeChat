// pages/comic/comic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    chapter: [],
    currentPlay: 0,
    freeNum: 5,
    options: {},
    showShare: false,
    showMenu: false,
    read_title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      options: options
    })

    //漫画详情
    wx.request({
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.ChapterDetail',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { work_id: options.work_id, chapter_id: options.chapter_id },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code == 200) {
          let _detail = res.data.data.data
          wx.setNavigationBarTitle({
            title: _detail.work_title
          })
          let _radio = 0
          for (let i = 0; i < _detail.content.length; i++){
            if(i == 0){
              _radio = 750 / _detail.content[i].width
            }
            _detail.content[i].width2 = _radio * _detail.content[i].width
            _detail.content[i].height2 = _radio * _detail.content[i].height
          }

          this.setData({
            detail: _detail
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
              if (res.data.data.code == 200) {
                let _tmp = res.data.data.data
                let currentPlay = 0
                for (let i = 0; i < _tmp.length; i++) {
                  _tmp[i].updatetime2 = app.timestampToTime(_tmp[i].updatetime)

                  if (options.chapter_id == _tmp[i].id) {
                    currentPlay = i
                  }
                }

                //获取本地书架
                let bookShelf = app.getBookShelf()

                let isRead = false

                let freeNum = 5

                let book = {}

                if (bookShelf.length > 0) {
                  for (let i = 0; i < bookShelf.length; i++) {
                    if (bookShelf[i].work_id == options.work_id) {
                      //阅读过
                      isRead = true
                      //查询是否解锁过
                      if (bookShelf[i].isLock == false) {
                        freeNum = 99999
                      }
                    }
                  }

                  if (!isRead) {
                    //加入书架
                    bookShelf.push({
                      work_id: options.work_id,
                      work_title: _detail.work_title,
                      read_title: _detail.title,
                      work_thumb: _detail.work_thumb,
                      readIndex: currentPlay,
                      isLock: true,
                    })
                    app.setBookShelf(bookShelf)
                  }

                } else {
                  //加入书架
                  bookShelf.push({
                    work_id: options.work_id,
                    work_title: _detail.work_title,
                    read_title: _detail.title,
                    work_thumb: _detail.work_thumb,
                    readIndex: currentPlay,
                    isLock: true,
                  })
                  app.setBookShelf(bookShelf)
                }

                this.setData({
                  freeNum: freeNum,
                  currentPlay: currentPlay,
                  chapter: _tmp
                })

              }
            }
          })

        }
      }
    })

   
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  openMenu(){
    this.setData({
      showMenu: true
    })
  },

  closeMenu(){
    this.setData({
      showMenu: false
    })
  },

  changeChapter(e){
    let _value = e.currentTarget.dataset.value || e.currentTarget.target.value

    let _currentPlay = this.data.currentPlay
    if (_value == 'next'){
      if (_currentPlay >= this.data.chapter.length-1)
        return
      _currentPlay ++
    } else if (_value == 'prev'){
      if (_currentPlay <= 0)
        return
      _currentPlay -- 
    }else{
      //切换章节
      let index = e.currentTarget.dataset.index || e.currentTarget.target.index

      _currentPlay = index
    }

    if (_currentPlay >= this.data.freeNum){
      this.openShare()
      return
    }

    this.loadChapter(this.data.chapter[_currentPlay].id, _currentPlay)

  },

  openShare(){
    this.setData({
      showShare: true
    })
  },

  closeShare() {
    this.setData({
      showShare: false
    })
  },

  loadChapter(chapter_id, index){
    //加载新的章节
    wx.request({
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.ChapterDetail',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { work_id: this.data.options.work_id, chapter_id },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code == 200) {
          let _detail = res.data.data.data
          let _radio = 0
          for (let i = 0; i < _detail.content.length; i++) {
            if (i == 0) {
              _radio = 750 / _detail.content[i].width
            }
            _detail.content[i].width2 = _radio * _detail.content[i].width
            _detail.content[i].height2 = _radio * _detail.content[i].height
          }

          //更新本地书架
          let bookShelf = app.getBookShelf()
          for (let i = 0; i < bookShelf.length; i++) {
            if (bookShelf[i].work_id == this.data.options.work_id) {
              bookShelf[i].readIndex = index
              bookShelf[i].read_title = _detail.title
            }
          }

          app.setBookShelf(bookShelf)

          this.setData({
            currentPlay: index,
            detail: _detail
          })
        }
      }
    })

  },

  unlock() {

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

      if (!isRead) {
        //加入书架
        bookShelf.push({
          work_id: this.data.options.work_id,
          work_title: this.data.detail.work_title,
          read_title: this.data.chapter[0].title,
          work_thumb: this.data.detail.work_title,
          readIndex: 0,
          isLock: false,
        })
      }
    } else {
      //加入书架
      bookShelf.push({
        work_id: this.data.options.work_id,
        work_title: this.data.detail.work_title,
        read_title: this.data.chapter[0].title,
        work_thumb: this.data.detail.work_title,
        readIndex: 0,
        isLock: false,
      })
    }

    app.setBookShelf(bookShelf)

  },

  onShareAppMessage() {
    let _this = this
    return {
      title: "快搜免费漫画",
      imageUrl: _this.data.detail.work_thumb,
      success() {
        console.log('分享成功')
        //分享成功，解锁本章内容
        _this.closeShare()
        _this.unlock()
      },
      fail(e) {
        console.log(e)
      }
    }
  }

})