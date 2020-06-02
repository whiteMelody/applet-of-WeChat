//index.js
const app = getApp()
Page({
  data: {
    bookShelf: [],
    banner: [],
    check: true,
    showDelete: false,
    bookID: "",
    inedxData: {},
    isVerify: false,
    date: '',
    everyDay: {},
    audioList: [1, 2, 3, 4],
    videoList: [1, 2, 3, 4],
    newList: [1, 2, 3, 4, 5],
  },

  onLoad: function() {

    app.login()

    // //首页推荐
    wx.request({
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.Recommend',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: (res)=> {
        // console.log(res)

        if(res.data.data.code == 200){
          this.setData({
            inedxData: res.data.data.data
          })
        }

      }
    })

    // banner
    wx.request({
      url: app.globalData.requestUrl + '?s=App.Cartoon_Common.Banner',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      method: 'GET',
      success: (res) => {
        // console.log(res)

        if (res.data.data.code == 200) {
          this.setData({
            banner: res.data.data.data
          })
        }

      }
    })

    // //原始接口
    // wx.request({
    //   method: "post",
    //   url: 'https://api.7english.cn/hot/v3/hotChannel',
    //   data: { learningType: 0, userID: 0, rating: 0, deviceID: 0, type: 4 },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: (res) => {
    //     if (res.data.status == 1) {

    //       let _data = res.data.returnJSON

    //       let _audioList = []

    //       let _videoList = []

    //       let _newList = []

    //       for (let i = 0; i < _data.length; i++) {

    //         if (_data[i].moduleType == 1) {
    //           //为您订制
    //         }
    //         if (_data[i].moduleType == 2) {
    //           //每日推荐
    //         }
    //         if (_data[i].moduleType == 3) {
    //           //大卡推荐
    //         }
    //         if (_data[i].moduleType == 4) {
    //           //热门音频
    //           _audioList = _data[i].dataList.slice(0, 4);
    //         }
    //         if (_data[i].moduleType == 5) {
    //           //热门视频
    //           _videoList = _data[i].dataList.slice(0, 4);
    //         }
    //         if (_data[i].moduleType == 6) {
    //           //最近更新
    //           _newList = _data[i].dataList;
    //         }

    //       }

    //       this.setData({
    //         audioList: _audioList,
    //         videoList: _videoList,
    //         newList: _newList,
    //       })

    //     }

    //   }
    // })

    // //获取每日一句
    // let date = new Date();
    // let _date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    // //获取数据
    // wx.request({
    //   method: "post",
    //   url: 'https://api.7english.cn/hot/getEveryDayEnglishByDateV2',
    //   data: { date: _date, learningType: 0, userID: 0, rating: 0, deviceID: 0, type: 4 },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: (res) => {
    //     if (res.data.status == 1) {

    //       let _data = res.data.returnJSON[0]

    //       this.setData({
    //         date: _date,
    //         everyDay: _data
    //       })

    //     }

    //   }
    // })


    // if (date.getDate()>= 21){
    //   this.setData({
    //     isVerify: false
    //   })
    // }

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})