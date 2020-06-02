// pages/payFees/payFees.js
import {
  md5
} from "../../utils/md5.js"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    step: 0,
    userInfo: {
      sex: 'M'
    },
    money: 300,
    user: {},
    showAlipay: false,
    showHelp: false,
    payType: 'wepay',       // wepay | alipay
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.login = this.selectComponent("#login");

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      },
    })

  //  this.openAliPay()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //判断用户登录
    let user = wx.getStorageSync('user')

    if (app.isNull(user)) {
      this.login.showLogin()
    } else {
      
      user = JSON.parse(user)

      this.setData({
        user: user
      })

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
  },

  mixedencryMD5(res_paydata, randomString, timeStamp, key){
    return md5("appId=wx91d9effc05bbacc0&nonceStr=" + randomString + "&package=" + res_paydata + "&signType=MD5" + "&timeStamp=" + timeStamp + "&key=" + key);
  },

  getTimeStamp() {
    return Number.parseInt(new Date().getTime() / 1000) + ''
  },

  getRandomString() {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },

  pay(){

    let payType = this.data.payType

    let user = this.data.user

    let userInfo = this.data.userInfo

    let money = Number.parseInt(this.data.money * 100)

    wx.request({
      url: app.globalData.requestUrl + 'prepay/prepay',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: userInfo.name,
        sex: userInfo.sex,
        idcard: userInfo.idcard,
        parent: userInfo.parent,
        tel: userInfo.tel,
        address: userInfo.address,
        graduation: userInfo.graduation,
        class: userInfo.class,
        openId: user.openID,
        paymethod: payType,
        qq: userInfo.qq,
        wechat: userInfo.wechat,
        body: '预缴费',
        total_fee: money,
      },
      method: 'POST',
      success: (res) => {

        console.log(res)

        if (res.data.code == 200) {
          
          if (payType == 'alipay'){
            //支付宝支付
            this.openAliPay()

          }else{
            let data = res.data.data

            let orderId = data.out_trade_no

            // 发起微信支付
            wx.requestPayment({
              timeStamp: data.timeStamp + '',
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.sing,
              success: (res) => {
                //完成支付
                console.log(res)

                if (res.errMsg == 'requestPayment:ok') {

                  app.checkOrder(user.openID, orderId)

                  wx.navigateTo({
                    url: '/pages/paySuccess/paySuccess?money=' + this.data.money,
                  })

                }

              },
              fail: (res) => {
                //取消支付
                console.log(res)
              }
            })

          }

          
        }
      }
    })
   
  },  

  backStep(){
    this.setData({
      step: 0
    })
  },

  changeMoney(e){
    this.setData({
        money: e.currentTarget.dataset.value
    })
  },

  moneyChange(e){
    this.setData({
        money: e.detail.value
    })
  },

  changePayType(e) {
    let val = e.currentTarget.dataset.value
    this.setData({
      payType: val
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

  inputChange2(e) {

    let _type = e.currentTarget.dataset.name
    let _val = e.detail.value
    let userInfo = this.data.userInfo

    if (_type == 'name') {
      userInfo.name = _val
    } else if (_type == 'idcard') {
      userInfo.idcard = _val
    } else if (_type == 'graduation') {
      userInfo.graduation = _val
    } else if (_type == 'class') {
      userInfo.class = _val
    } else if (_type == 'parent') {
      userInfo.parent = _val
    } else if (_type == 'tel') {
      userInfo.tel = _val
    } else if (_type == 'address') {
      userInfo.address = _val
    } else if (_type == 'qq') {
      userInfo.qq = _val
    } else if (_type == 'wechat') {
      userInfo.wechat = _val
    }

    this.setData({
      userInfo: userInfo
    })

  },
  
  /**
   * 下一步
   */
  nextStep(){
    
    //判断是否填写过用户信息
    let userInfo = this.data.userInfo

    //判断是否填写完
    if (app.isNull(userInfo.name)) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.idcard)) {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.graduation)) {
      wx.showToast({
        title: '请填写毕业学校',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.class)) {
      wx.showToast({
        title: '请填写班级',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.parent)) {
      wx.showToast({
        title: '请填写父母',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.tel)) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.qq)) {
      wx.showToast({
        title: '请填写QQ号',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.wechat)) {
      wx.showToast({
        title: '请填写微信号',
        icon: 'none'
      })
      return
    } if (app.isNull(userInfo.address)) {
      wx.showToast({
        title: '请填写联系地址',
        icon: 'none'
      })
      return
    }

    if (userInfo.idcard.length != 18) {
      wx.showToast({
        title: '身份证号只能填写18位',
        icon: 'none'
      })
      return
    }

    //判断手机号格式
    if (isNaN(userInfo.tel)) {
      wx.showToast({
        title: '手机号只能填写11位数字',
        icon: 'none'
      })
      return
    } else {
      let _tel = userInfo.tel + ''
      if (_tel.length != 11) {
        wx.showToast({
          title: '手机号只能填写11位数字',
          icon: 'none'
        })
        return
      }
    }

    this.setData({
      step: 1
    })

  },

  closeAliPay(){
    this.setData({
      showAlipay: false
    })
  },

  openAliPay() {
    this.setData({
      showAlipay: true
    })
  },

  saveImg(){
    wx.getImageInfo({
      src: '../../images/alipay-img.jpg',
      success: function (res) {
        wx.getSetting({
          success(res2) {
            console.log(res2)
            // scope.writePhotosAlbum
            if (!res2.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(result) {
                      wx.showToast({
                        title: '保存成功',
                      })
                    }
                  })
                }, fail(){
                  wx.showToast({
                    title: '获取保存图片权限失败',
                    icon: 'none'
                  })
                }
              })
            }
            else{
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success(result) {
                  wx.showToast({
                    title: '保存成功',
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  openHelp(){
    this.setData({
      showHelp: true
    })
  },

  closeHelp() {
    this.setData({
      showHelp: false
    })
  },

  onShareAppMessage() {

  },

})