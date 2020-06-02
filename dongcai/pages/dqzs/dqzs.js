// pages/dqzs/dqzs.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 1,
    dates: [],
    dateIndex: 0,
    showEnd: false,
    params: { 
      date: "2018-11-11", 
      str_code: "2.8.2", 
      city: "重庆", 
      match_id: "1008318", 
      ip: "123.147.250.4", 
      device_type: "MI 6", 
      source_code: "102", 
      token: "4BED0C3493644B2CBF160345EEC3F6FA"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let date = new Date()
    let _date = date.getFullYear() + '-' + app.addZero(date.getMonth() + 1) + '-' + app.addZero(date.getDate())

    let _arr = []

    let show_day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

    //获取一个月内的数据
    for (let i = 0; i < 30; i++) {
      let _today = new Date(date.getTime() - 86400 * 1000 * i)
      let __date = _today.getFullYear() + '-' + app.addZero(_today.getMonth() + 1) + "-" + app.addZero(_today.getDate())
      let __week = show_day[_today.getDay()]
      _arr.push({
        date: __date,
        week: __week
      })
    }    

    let params = this.data.params

    params.date = _date

    this.setData({
      params: params,
      dates: _arr,
    })

    this.getData()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    

  },

  getData(){
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/home',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          console.log(res)
        }
      }
    })


  },

  changeShowType(e){
    let val = e.target.dataset.value || e.currentTarget.dataset.value

    this.setData({
      showType: val
    })

  },

  changeShowEnd(e) {
    let val = e.target.dataset.value || e.currentTarget.dataset.value

    console.log(e)

    this.setData({
      showEnd: val
    })

  },

  yesterday(){

    let index = this.data.dateIndex

    if(index == 0)
      return

    index -- 

    let params = this.data.params

    params.date = this.data.dates[index].date

    this.setData({
      params,
      dateIndex: index
    })

    this.getData()

  },

  changeDate(){

  },

  tomorrow(){
    let index = this.data.dateIndex

    if (index >= 29)
      return

    index++

    let params = this.data.params

    params.date = this.data.dates[index].date

    this.setData({
      params,
      dateIndex: index
    })

    this.getData()
  },

  
})