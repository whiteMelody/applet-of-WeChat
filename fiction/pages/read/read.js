// pages/read/read.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapterList: [],
    index: 0,
    animationData: {},
    setUp: false,
    isClick: false,
    changed: false,
    isMove: false,
    chapter: false,
    bgcolor: '#faf6ed',
    fcolor: '#000000',
    color: false,
    titleSize: 36,
    fontSize: 32,
    top: 0,
    doubles: 0,
    articleList: [],
    isUp: false,
    loading: true,
    current: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.getSystemInfo((res) => {
      let doubles = 750 / res.windowWidth
      this.setData({
        doubles: doubles,
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        height: res.windowHeight * doubles,
        innerHeight: res.windowHeight,
        innerWidth: res.windowWidth - 60 / doubles
      })
    })
    //获取字体大小颜色
    let tmp = app.getFont()
    if (app.isNull(tmp)) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#faf6ed',
      })
      let font = {
        frontColor: '#000000',
        backgroundColor: '#faf6ed',
        titleSize: 36,
        fontSize: 32,
        scroll: false
      }
      tmp.push(font)
      app.setFont(tmp)
      this.setData({
        fontList: tmp,
        scroll: false
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: tmp[0].frontColor,
        backgroundColor: tmp[0].backgroundColor,
      })
      let fcolor = '#000000'
      if (tmp[0].frontColor == '#ffffff') {
        fcolor = '#7f7f7f'
      }
      this.setData({
        fontList: tmp,
        titleSize: tmp[0].titleSize,
        fontSize: tmp[0].fontSize,
        bgcolor: tmp[0].backgroundColor,
        fcolor: fcolor,
        scroll: tmp[0].scroll
      })
    }
    wx.setNavigationBarTitle({
      title: options.bookName
    })
    //获取文章
    let arr = this.getChapters(options.bookID)
    if (arr) {
      this.getChapterList(options.bookID, arr[0].index)
      this.setData({
        current: arr[0].current
      })
    }
  },

  //章节列表
  getChapterList(bookID, index) {
    let _this = this
    wx.request({
      url: 'https://api.zhuishushenqi.com/mix-atoc/' + bookID + '?view=chapter',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: function(res) {
        let tmp = res.data.mixToc.chapters
        let title = tmp[index].title
        let link = tmp[index].link
        _this.setData({
          chapterList: tmp,
          title: title,
          bookID: bookID,
          index: index
        })
        _this.getArticle(link)
      }
    })
  },

  //判断章节
  getChapters(bookID, index) {
    let chapter = app.getChapter()
    if (app.isNull(chapter)) {
      let _chapter = {
        bookID: bookID,
        index: 0,
        current: 0
      }
      chapter.push(_chapter)
      app.setChapter(chapter)
      this.setData({
        currentList: chapter
      })
      return chapter
    } else {
      let tmp = chapter.filter((item) => {
        return item.bookID == bookID
      })
      if (app.isNull(tmp)) {
        let _chapter = {
          bookID: bookID,
          index: 0,
          current: 0
        }
        chapter.push(_chapter)
        app.setChapter(chapter)
        this.setData({
          currentList: chapter
        })
        let arr = chapter.filter((item) => {
          return item.bookID == bookID
        })
        return arr
      } else {
        //获取章节
        if (app.indexNull(index)) {
          console.log('获取章节')
          console.log(tmp)
          this.setData({
            currentList: chapter
          })
          return tmp
        } else {
          //改变章节
          console.log('改变章节')
          for (let i = 0; i < chapter.length; i++) {
            if (bookID == chapter[i].bookID) {
              chapter[i].index = index
              chapter[i].current = 0
            }
          }
          this.setData({
            currentList: chapter
          })
          app.setChapter(chapter)
        }
      }
    }
  },

  //获取文章
  getArticle(link) {
    let _this = this
    let title = this.data.title
    _this.setData({
      loading: true
    })
    wx.request({
      url: 'https://chapter2.zhuishushenqi.com/chapter/' + encodeURIComponent(link),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: function(res) {

        let article = (title + '\n' + '\n' + res.data.chapter.body).replace(/\n/g, '\n' + '&emsp;' + '&emsp;')

        _this.setData({
          article: article
        })
        _this.pageArticle()
      }
    })
  },

  //拼接文章
  pageArticle() {
    let _this = this
    let article = this.data.article
    let fontSize = this.data.fontSize
    let innerWidth = this.data.innerWidth
    let innerHeight = this.data.innerHeight
    let doubles = this.data.doubles
    let current = this.data.current
    let _arr = article.split('\n')
    let _textArr = []
    let _row = 0
    let _prevRow = 0
    //每行显示字数
    let rowCount = Math.floor(innerWidth / (fontSize / doubles))
    //每页显示行数
    let _maxRow = Math.floor(innerHeight / (60 / doubles))
    let _page = 0
    let prevText = ''
    for (let i = 0; i < _arr.length; i++) {
      _row += Math.ceil(_arr[i].length / rowCount)
      // console.log('_row:' + _row)
      if (!_textArr[_page]) {
        _textArr[_page] = {
          page: 0,
          datas: []
        }
      }
      if (_textArr[_page].page) {
        _textArr[_page].page = _page + 1
      } else {
        _textArr[_page].page = 0
        _textArr[_page].page = _page + 1
      }
      if (_textArr[_page].datas) {
        _textArr[_page].datas.push(_arr[i])
      } else {
        _textArr[_page].datas = []
        _textArr[_page].datas.push(_arr[i])
      }
      if (_row > _maxRow) {
        let _tmp = _maxRow - _prevRow
        let _tmpStr = _arr[i]
        let _tmpStr1 = _arr[i].substring(0, _tmp * rowCount)
        let _tmpStr2 = _arr[i].substring(_tmp * rowCount)
        _arr.splice(i, 1, _tmpStr1, _tmpStr2)
        _textArr[_page].datas.push(_tmpStr1)
        _row = 0
        _prevRow = 0
        _page++

      } else if (_row == _maxRow) {
        _row = 0
        _prevRow = 0
        _page++
      } else {
        _prevRow += Math.ceil(_arr[i].length / rowCount)
      }
    }
    _this.setData({
      articleList: _textArr,
      articleLength: _textArr.length,
      top: current
    })

    setTimeout(function() {
      _this.setData({
        loading: false
      })
    }, 500)

  },

  touchStart(e) {
    this.setData({
      changed: false,
    })
  },

  //滑动
  getChange(e) {
    let current = e.detail.current
    let currentList = this.data.currentList
    let bookID = this.data.bookID
    for (let i = 0; i < currentList.length; i++) {
      if (bookID == currentList[i].bookID) {
        currentList[i].current = current
      }
    }
    app.setChapter(currentList)
    this.setData({
      changed: true,
      isClick: false,
      current: current
    })
  },

  finish(e) {
    let articleLength = this.data.articleLength
    let current = e.detail.current
    if (current == articleLength - 1 && !this.data.changed) {
      if (this.data.isClick) {
        console.log('点击事件')
        this.setData({
          isClick: false
        })
      } else {
        console.log('已经到底了')
        this.next()
        this.setData({
          isClick: true
        })
      }
    }
    if (current == 0 && !this.data.changed) {
      if (this.data.isClick) {
        console.log('点击事件')
        this.setData({
          isClick: false
        })
      } else {
        console.log('上一章')
        this.up()
        this.setData({
          isClick: true
        })
      }
    }
  },

  //左右侧滑
  slide() {
    let fontList = this.data.fontList
    for (let i = 0; i < fontList.length; i++) {
      fontList[i].scroll = false
    }
    app.setFont(fontList)
    this.setData({
      scroll: false,
    })
  },

  //上下滚动
  scroll() {
    let fontList = this.data.fontList
    for (let i = 0; i < fontList.length; i++) {
      fontList[i].scroll = true
    }
    app.setFont(fontList)
    this.setData({
      scroll: true,
    })
  },

  //滚动到底部
  lower: function(e) {
    console.log(e)
    this.next()
  },

  //弹出设置
  click() {
    this.setData({
      setUp: true,
      isClick: true,
      color: false
    })
  },

  //关闭
  close() {
    this.setData({
      setUp: false,
      color: false,
      isClick: false
    })
  },

  //上一章
  up() {
    let _this = this
    let index = this.data.index - 1
    let chapterList = this.data.chapterList
    let bookID = this.data.bookID
    if (index < 0) {
      wx.showToast({
        title: '已到书籍第一章',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let title = chapterList[index].title
    let link = chapterList[index].link
    _this.setData({
      index: index,
      title: title,
      setUp: false,
      top: 0,
      current: 0,
      isClick: false
    })
    _this.getArticle(link)
    _this.getChapters(bookID, index)
  },

  //下一章
  next() {
    let _this = this
    let index = this.data.index + 1
    let chapterList = this.data.chapterList
    let bookID = this.data.bookID
    if (index == chapterList.length) {
      wx.showToast({
        title: '已到书籍最后一章',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let title = chapterList[index].title
    let link = chapterList[index].link
    _this.setData({
      index: index,
      title: title,
      setUp: false,
      top: 0,
      current: 0,
      isClick: false
    })
    _this.getArticle(link)
    _this.getChapters(bookID, index)
  },


  //设置章节
  set() {
    let chapter = this.data.chapter
    if (chapter) {
      this.setData({
        chapter: false
      })
    } else {
      this.setData({
        chapter: true
      })
    }
  },

  //改变颜色
  change() {
    let color = this.data.color
    if (color) {
      this.setData({
        color: false
      })
    } else {
      this.setData({
        color: true
      })
    }
  },

  //选择章节
  select(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    let chapterList = this.data.chapterList
    let bookID = this.data.bookID
    let title = chapterList[index].title
    let link = chapterList[index].link
    _this.setData({
      index: index,
      title: title,
      chapter: false,
      color: false,
      setUp: false,
      top: 0,
      current: 0,
      articleList: []
    })
    _this.getArticle(link)
    _this.getChapters(bookID, index)
  },

  //选择颜色
  selectColor(e) {
    let bgcolor = e.currentTarget.dataset.bgcolor
    let fcolor = e.currentTarget.dataset.fcolor
    let fontList = this.data.fontList
    let frontColor = '#000000'
    if (fcolor != '#000000') {
      frontColor = '#ffffff'
    }
    wx.setNavigationBarColor({
      frontColor: frontColor,
      backgroundColor: bgcolor,
    })
    for (let i = 0; i < fontList.length; i++) {
      fontList[i].backgroundColor = bgcolor
      fontList[i].frontColor = frontColor
    }
    app.setFont(fontList)
    this.setData({
      bgcolor: bgcolor,
      fcolor: fcolor
    })
  },

  //字体减小
  cut() {
    let titleSize = this.data.titleSize
    let fontSize = this.data.fontSize
    let fontList = this.data.fontList
    titleSize = titleSize - 2
    fontSize = fontSize - 2
    if (fontSize == 24) {
      return
    }
    for (let i = 0; i < fontList.length; i++) {
      fontList[i].titleSize = titleSize
      fontList[i].fontSize = fontSize
    }
    app.setFont(fontList)
    this.setData({
      titleSize: titleSize,
      fontSize: fontSize
    })
    this.pageArticle()
  },
  //字体增大
  add() {
    let titleSize = this.data.titleSize
    let fontSize = this.data.fontSize
    let fontList = this.data.fontList
    titleSize = titleSize + 2
    fontSize = fontSize + 2
    if (fontSize == 46) {
      return
    }
    for (let i = 0; i < fontList.length; i++) {
      fontList[i].titleSize = titleSize
      fontList[i].fontSize = fontSize
    }
    app.setFont(fontList)
    this.setData({
      titleSize: titleSize,
      fontSize: fontSize
    })
    this.pageArticle()
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
  // onShareAppMessage: function() {

  // }
})