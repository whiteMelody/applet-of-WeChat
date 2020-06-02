// pages/test/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    answes: [],
    currentIndex: 0,
    height: 0,
    showMsg: false,
    userInfo: {
      sex: 'F'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {

        this.setData({
          height: res.windowHeight
        })

      },
    })

    this.setData({
      id: options.id
    })

    this.getData()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getData() {

    let openId = wx.getStorageSync('openID')

    wx.request({
      url: app.globalData.requestUrl + 'exam/choicepaper',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        paperId: this.data.id
      },
      method: 'GET',
      success: (res) => {

        if (res.data.code == 200) {

          let list = res.data.data

          for (let i = 0; i < list.length; i++) {
            if (list[i].item_type == 'single') {
              //单选题
              list[i].selects = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'multi') {
              //多选题
              list[i].selects = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'fills') {
              //填空题
              list[i].content2 = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'answer') {
              //解答题
              list[i].content2 = JSON.parse(list[i].content)
            } else if (list[i].item_type == 'charge') {
              //判断题
              list[i].selects = [{
                key: 'true',
                name: '正确'
              }, {
                key: 'false',
                name: '错误'
              },
              ]
            }

          }

          console.log(list)

          this.setData({
            list: res.data.data
          })

        }
      }
    })

  },

  inputChange(e) {
    let value = e.detail.value

    let answes = this.data.answes

    answes[this.data.currentIndex] = value

    this.setData({
      answes: answes
    })

  },

  choice(e) {

    let index = e.currentTarget.dataset.index

    let answes = this.data.answes

    answes[this.data.currentIndex] = index

    this.setData({
      answes: answes
    })

  },

  choices(e) {
    let index = e.currentTarget.dataset.index

    console.log(index)

    let answes = this.data.answes

    let _arr = ['', '', '', '', '', '', '', '', '', '', '', '',]

    if (answes[this.data.currentIndex]) {
      _arr = answes[this.data.currentIndex]
    } else {
      answes[this.data.currentIndex] = ['', '', '', '', '', '', '', '', '', '', '', '',]
      _arr = ['', '', '', '', '', '', '', '', '', '', '', '',]
    }

    if (_arr[index] == '') {
      _arr[index] = true
    } else {
      _arr[index] = ''
    }

    console.log(_arr)

    answes[this.data.currentIndex] = _arr

    this.setData({
      answes: answes
    })
  },

  changeSwiper(e) {

    this.setData({
      currentIndex: e.detail.current
    })

  },


  /**
   * 提交答案
   */
  submit() {

    //判断是否填写过用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if (app.isNull(userInfo)) {
      this.openDialog()
      return
    }

    this.submit3()

  },

  /**
   * 提交用户信息
   */
  submit2() {

    //判断是否填写过用户信息
    let userInfo = this.data.userInfo

    //判断是否填写完

    if (app.isNull(userInfo.name)) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })

      return
    } if (app.isNull(userInfo.age)) {
      wx.showToast({
        title: '请填写年龄',
        icon: 'none'
      })

      return
    } if (app.isNull(userInfo.tel)) {
      wx.showToast({
        title: '请填写电话',
        icon: 'none'
      })

      return
    } if (app.isNull(userInfo.address)) {
      wx.showToast({
        title: '请填写地址',
        icon: 'none'
      })

      return
    }

    wx.setStorage({
      key: 'userInfo',
      data: JSON.stringify(userInfo),
    })

    this.closeDialog()

    this.submit3()

  },

  submit3() {
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    //判断分数
    let list = this.data.list

    let answes = this.data.answes

    let item = ''

    let score = 0

    for (let i = 0; i < list.length; i++) {
      if (answes[i]) {
        item = answes[i]
        if (list[i].item_type == 'single') {
          if (list[i].correct_answer == this.parseSimple(item))
            score += list[i].score
        } else if (list[i].item_type == 'multi') {
          if (list[i].correct_answer == this.parseMulti(item))
            score += list[i].score
        } else if (list[i].item_type == 'fills') {
          //填空题
          if (list[i].correct_answer.includes(item))
            score += list[i].score

        } else if (list[i].item_type == 'answer') {
          //解答题
          if (list[i].correct_answer.includes(item))
            score += list[i].score
        } else if (list[i].item_type == 'charge') {
          if (list[i].correct_answer == this.parseCharge(item))
            score += list[i].score
        }

      }
    }


    let openId = wx.getStorageSync('openID')

    wx.request({
      url: app.globalData.requestUrl + 'exam/commitpaper',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        paperId: this.data.id,
        score: score,
        u_name: userInfo.name,
        u_tel: userInfo.tel,
        u_address: userInfo.address,
        u_sex: userInfo.sex,
        u_age: userInfo.age,
      },
      method: 'POST',
      success: (res) => {

        if (res.data.code == 200 || res.data.code == 2) {

          wx.showToast({
            title: res.data.msg,
          })

        }
      }
    })
  },

  /**
   * 上一题
   */
  prev() {
    let index = Number.parseInt(this.data.currentIndex)

    if (index <= 0) {
      return
    }

    this.setData({
      currentIndex: --index
    })

  },

  /**
   * 下一题
   */
  next() {
    let index = Number.parseInt(this.data.currentIndex)

    if (index >= this.data.list.length - 1) {
      return
    }

    this.setData({
      currentIndex: ++index
    })
  },

  parseSimple(val) {
    if (val == 0 || val == '0') {
      return 'A'
    } else if (val == 1 || val == '1') {
      return 'B'
    } else if (val == 2 || val == '2') {
      return 'C'
    } else if (val == 3 || val == '3') {
      return 'D'
    } else if (val == 4 || val == '4') {
      return 'E'
    } else if (val == 5 || val == '5') {
      return 'F'
    }
  },

  parseMulti(arr) {
    let _arr = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        _arr.push(this.parseMulti(i))
      }

    }

    return _arr.join(",")

  },

  parseCharge(val) {
    if (val == true || val == 'true') {
      return '正确'
    } else if (val == false || val == 'false') {
      return '错误'
    }
  },

  inputChange2(e) {

    let _type = e.currentTarget.dataset.name

    let _val = e.detail.value

    let userInfo = this.data.userInfo

    if (_type == 'name') {
      userInfo.name = _val
    } else if (_type == 'age') {
      userInfo.age = _val
    } else if (_type == 'tel') {
      userInfo.tel = _val
    } else if (_type == 'address') {
      userInfo.address = _val
    }

    this.setData({
      userInfo: userInfo
    })

  },

  changeSex(e) {
    let val = e.currentTarget.dataset.value

    let userInfo = this.data.userInfo

    userInfo.sex = val

    this.setData({
      userInfo: userInfo
    })

  },

  closeDialog() {
    this.setData({
      showMsg: false
    })
  },

  openDialog() {
    this.setData({
      showMsg: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})