// pages/test/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: [],
    answes: [],
    answes2: [],
    currentIndex: 0,
    paper: {},
    user: {},
    height: 0,
    showMsg: false,
    showCover: true,
    showResult: false,
    userInfo: {
      sex: 'M'
    },
    res: '',
    title: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.login = this.selectComponent("#login");

    wx.getSystemInfo({
      success: (res)=> {
        this.setData({
          height: res.windowHeight
        })
      },
    })

    this.setData({
      id: options.id
    })
   
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //判断用户登录

    let user = wx.getStorageSync('user')

    if (app.isNull(user)) {
      this.login.showLogin()
    } else {
      this.setData({
        user: JSON.parse(user)
      })

      this.getData()
    }

  },

  //取消事件 
  _cancelEvent() {
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  },
  //确认事件
  _confirmEvent() {
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })
    this.login.hideLogin()

    let user = wx.getStorageSync('user')
  
    this.setData({
      user: JSON.parse(user)
    })

    this.getData()
  },

  getData(){

    let openId = this.data.user.openID

    wx.request({
      url: app.globalData.requestUrl + 'exam/choicephtpaper',
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
          
          let list = res.data.data.items

          let paper = res.data.data.paper

          wx.setNavigationBarTitle({
            title: paper.name
          })

          paper.sum = res.data.data.sum

          paper.analysis = JSON.parse(paper.analysis)

          for(let i=0; i<list.length; i++){
            if (list[i].item_type == 'single'){
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
                key:'true',
                name: '正确'
              },{
                  key: 'false',
                  name: '错误'
                },
              ]
            }

          }

          this.setData({
            paper: paper,
            list: list
          })

        }
      }
    })
    
  },

  inputChange(e){
    let value = e.detail.value

    let answes = this.data.answes

    answes[this.data.currentIndex] = value

    this.setData({
      answes: answes
    })

  },

  choice(e){

    let index = e.currentTarget.dataset.index
    let score = e.currentTarget.dataset.score

    let answes = this.data.answes
    let answes2 = this.data.answes2

    answes2[this.data.currentIndex] = {
      i: index,
      socre: score
    }

    answes[this.data.currentIndex] = index

    this.setData({
      answes: answes,
      answes2: answes2
    })

    this.next()

  },

  choices(e){
    let index = e.currentTarget.dataset.index

    console.log(index)

    let answes = this.data.answes

    let _arr = ['', '', '', '', '', '', '', '', '', '', '', '',]

    if (answes[this.data.currentIndex]){
      _arr = answes[this.data.currentIndex]
    }else{
      answes[this.data.currentIndex] = ['', '', '', '', '', '', '', '', '', '', '', '',]
      _arr = ['', '', '', '', '', '', '', '', '', '', '', '',]
    }

    if (_arr[index] == ''){
      _arr[index] = true
    }else{
      _arr[index] = ''
    }

    answes[this.data.currentIndex] = _arr

    this.setData({
      answes: answes
    })
  },

  changeSwiper(e){

    this.setData({
      currentIndex: e.detail.current
    })

  },
  

  /**
   * 提交答案
   */
  submit(){

    let answes2 = this.data.answes2
    let list = this.data.list

    let flag = true

    //判断回答完毕
    for (let i = 0; i < answes2.length; i++) {
      if (answes2[i]) {
        if (answes2[i].socre) {

        } else {
          flag = false
        }
      } else {
        flag = false
      }
    }

    if (answes2.length != list.length) {
      flag = false
    }

    if (!flag) {
      wx.showToast({
        title: '回答完所有题才可以提交哦',
        icon: 'none'
      })
      return
    }

    //判断是否填写过用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if (app.isNull(userInfo)){
      this.openDialog()
      return
    }

    this.submit3()

  },

  /**
   * 提交用户信息
   */
  submit2(){

    //判断是否填写过用户信息
    let userInfo = this.data.userInfo

    //判断是否填写完

    if(app.isNull(userInfo.name)){
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

    //判断年龄格式
    if (isNaN(userInfo.age)){
      wx.showToast({
        title: '年龄只能填写1-2位数字',
        icon: 'none'
      })
      return
    }else{
      if (userInfo.age <= 0 || userInfo.age>100){
        wx.showToast({
          title: '年龄只能填写1-2位数字',
          icon: 'none'
        })
        return
      }
    }
    
    //判断手机号格式
    if (isNaN(userInfo.tel)) {
      wx.showToast({
        title: '手机号只能填写11位数字',
        icon: 'none'
      })
      return
    }else{

      let _tel = userInfo.tel + ''

      if (_tel.length != 11){
        wx.showToast({
          title: '手机号只能填写11位数字',
          icon: 'none'
        })
        return
      }
    }

    wx.setStorage({
      key: 'userInfo',
      data: JSON.stringify(userInfo),
    })

    this.closeDialog()

    this.submit3()

  },

  submit3(){

    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    //判断分数
    let list = this.data.list

    let answes = this.data.answes

    let item = ''

    let score = 0

    // 2019年1月4日14:22:40 计算分数
    // for (let i = 0; i < list.length; i++) {
    //   if (answes[i]) {
    //     item = answes[i]
    //     if (list[i].item_type == 'single') {
    //       if (list[i].correct_answer == this.parseSimple(item))
    //         score += list[i].score
    //     } else if (list[i].item_type == 'multi') {
    //       if (list[i].correct_answer == this.parseMulti(item))
    //         score += list[i].score
    //     } else if (list[i].item_type == 'fills') {
    //       //填空题
    //       if (list[i].correct_answer.includes(item))
    //         score += list[i].score

    //     } else if (list[i].item_type == 'answer') {
    //       //解答题
    //       if (list[i].correct_answer.includes(item))
    //         score += list[i].score
    //     } else if (list[i].item_type == 'charge') {
    //       if (list[i].correct_answer == this.parseCharge(item))
    //         score += list[i].score
    //     }

    //   }
    // }

    // 2019年1月4日14:22:52 心理测试计算方式

    let answes2 = this.data.answes2


    for (let i = 0; i < answes2.length; i++){
      if (answes2[i]){
        if (answes2[i].socre)
          score += answes2[i].socre
      }
    }

    let openId = this.data.user.openID

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
          
          // wx.showToast({
          //   title: res.data.msg,
          // })

          //计算分数

          let data = this.data.paper.analysis

          let res = ''
          let title = ''

          for (let i = 0; i < data.length; i++) {
            if (score >= data[i].min && score <= data[i].max) {
              res = data[i].text
              title = data[i].title
              break;
            }
          }

          
          // 2019年1月5日14:50:16 改为跳转到结果页
          // this.setData({
          //   showResult: true,
          //   title: title,
          //   res: res,
          // })


          wx.navigateTo({
            url: '/pages/testResult/testResult?id=' + this.data.id + '&title=' + title + '&res=' + res +'&paperName=' + this.data.paper.name,
          })

          // showResult: false,

        }
      }
    })
  },

  /**
   * 上一题
   */
  prev(){
    let index = Number.parseInt(this.data.currentIndex)

    if (index<=0){
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

    if (index >= this.data.list.length-1) {
      return
    }

    this.setData({
      currentIndex: ++index
    })
  },

  parseSimple(val){
    if(val == 0 || val == '0'){
      return 'A'
    }else if(val == 1 || val == '1'){
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
  
  parseMulti(arr){
    let _arr = []
    for(let i=0; i<arr.length; i++){
      if (arr[i]){
        _arr.push(this.parseMulti(i))
      }
      
    }

    return _arr.join(",")

  },

  parseCharge(val){
    if (val == true || val == 'true') {
      return '正确'
    } else if (val == false || val == 'false') {
      return '错误'
    }
  },

  inputChange2(e){

    let _type = e.currentTarget.dataset.name

    let _val = e.detail.value
    
    let userInfo = this.data.userInfo

    if(_type == 'name'){
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

  changeSex(e){
    let val = e.currentTarget.dataset.value

    let userInfo = this.data.userInfo

    userInfo.sex = val

    this.setData({
      userInfo: userInfo
    })

  },

  closeDialog(){
    this.setData({
      showMsg: false
    })
  },

  openDialog(){
    this.setData({
      showMsg: true
    })
  },

  closeCover(){

    this.setData({
      showCover: false
    })

  },

  onShareAppMessage() {
    return {
      path: '/pages/testCover/testCover?id=' + this.data.id
    }
  }
})