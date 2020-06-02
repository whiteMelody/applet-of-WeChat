// pages/gpxc/gpxc.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    params: {
      str_code: "2.8.2",
      size: "20",
      city: "重庆",
      ip: "106.81.228.184",
      index: "0",
      device_type: "MI 6",
      source_code: "102",
      token: "4BED0C3493644B2CBF160345EEC3F6FA"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/highOdd/home',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let result = {
            "msg": null,
            "code": "200",
            "data": {
              "over_count": "148",
              "series_hit_count": "17",
              "win_lose": "-30.38",
              "trend": [{
                "date": "2018-10-31",
                "return_rate": 0.3333333333333333
              }, {
                "date": "2018-11-01",
                "return_rate": 1
              }, {
                "date": "2018-11-02",
                "return_rate": 0.5
              }, {
                "date": "2018-11-03",
                "return_rate": 1
              }, {
                "date": "2018-11-04",
                "return_rate": 1
              }, {
                "date": "2018-11-05",
                "return_rate": 1
              }, {
                "date": "2018-11-06",
                "return_rate": 0.5
              }, {
                "date": "2018-11-07",
                "return_rate": 1
              }, {
                "date": "2018-11-08",
                "return_rate": 0
              }, {
                "date": "2018-11-09",
                "return_rate": 1
              }, {
                "date": "2018-11-10",
                "return_rate": 0
              }, {
                "date": "2018-11-11",
                "return_rate": 0.5
              }, {
                "date": "2018-11-12",
                "return_rate": 1
              }, {
                "date": "2018-11-13",
                "return_rate": 1
              }],
              "count": "149",
              "sys_time": 1542179282777,
              "color_tv": {
                "code": "42453",
                "is_show": "N",
                "url": "http://m.87.cn/html/down_pc_v2.html",
                "shop": "如意发体彩店"
              },
              "hit_count": "108",
              "highodd": [{
                "date_no": "DQFA20181114001",
                "create_time": 1542127201000,
                "program_start_time": 1542239100000,
                "date": "2018-11-14",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": null,
                "status": "0",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.62,
                "award_money": null,
                "rate": 0.76,
                "hit_back": null,
                "win_lose_money": null,
                "lower_back": 0.89,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181113001",
                "create_time": 1542040801000,
                "program_start_time": 1542138300000,
                "date": "2018-11-13",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.8,
                "award_money": 5.3,
                "rate": 0.74,
                "hit_back": 1.32,
                "win_lose_money": 1.298,
                "lower_back": 1.01,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181111002",
                "create_time": 1541868001000,
                "program_start_time": 1541957400000,
                "date": "2018-11-11",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.62,
                "award_money": 5.29,
                "rate": 0.72,
                "hit_back": 1.32,
                "win_lose_money": 1.294,
                "lower_back": 1.07,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181111001",
                "create_time": 1541868001000,
                "program_start_time": 1541916000000,
                "date": "2018-11-11",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 0,
                "status": "1",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.75,
                "award_money": 0.0,
                "rate": 0.73,
                "hit_back": 0.0,
                "win_lose_money": -4.0,
                "lower_back": 0.91,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181110002",
                "create_time": 1541781601000,
                "program_start_time": 1541883600000,
                "date": "2018-11-10",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 0,
                "status": "1",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.55,
                "award_money": 0.0,
                "rate": 0.77,
                "hit_back": 0.0,
                "win_lose_money": -4.0,
                "lower_back": 0.92,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181110001",
                "create_time": 1541781601000,
                "program_start_time": 1541860200000,
                "date": "2018-11-10",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 0,
                "status": "1",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.65,
                "award_money": 0.0,
                "rate": 0.74,
                "hit_back": 0.0,
                "win_lose_money": -4.0,
                "lower_back": 0.98,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181109002",
                "create_time": 1541695201000,
                "program_start_time": 1541790000000,
                "date": "2018-11-09",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.49,
                "award_money": 5.12,
                "rate": 0.74,
                "hit_back": 1.28,
                "win_lose_money": 1.117,
                "lower_back": 0.9,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181109001",
                "create_time": 1541695201000,
                "program_start_time": 1541808000000,
                "date": "2018-11-09",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.5,
                "award_money": 5.14,
                "rate": 0.75,
                "hit_back": 1.28,
                "win_lose_money": 1.137,
                "lower_back": 0.92,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181108001",
                "create_time": 1541608801000,
                "program_start_time": 1541707200000,
                "date": "2018-11-08",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 0,
                "status": "1",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.75,
                "award_money": 0.0,
                "rate": 0.77,
                "hit_back": 0.0,
                "win_lose_money": -4.0,
                "lower_back": 0.88,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181107002",
                "create_time": 1541524201000,
                "program_start_time": 1541634300000,
                "date": "2018-11-07",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.7,
                "award_money": 5.05,
                "rate": 0.75,
                "hit_back": 1.26,
                "win_lose_money": 1.05,
                "lower_back": 0.76,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181107001",
                "create_time": 1541521801000,
                "program_start_time": 1541613300000,
                "date": "2018-11-07",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.75,
                "award_money": 5.15,
                "rate": 0.74,
                "hit_back": 1.29,
                "win_lose_money": 1.153,
                "lower_back": 0.86,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181106002",
                "create_time": 1541436001000,
                "program_start_time": 1541534400000,
                "date": "2018-11-06",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.65,
                "award_money": 5.22,
                "rate": 0.73,
                "hit_back": 1.3,
                "win_lose_money": 1.218,
                "lower_back": 0.96,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181106001",
                "create_time": 1541435401000,
                "program_start_time": 1541498400000,
                "date": "2018-11-06",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 0,
                "status": "1",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.85,
                "award_money": 0.0,
                "rate": 0.75,
                "hit_back": 0.0,
                "win_lose_money": -4.0,
                "lower_back": 0.96,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181105001",
                "create_time": 1541349601000,
                "program_start_time": 1541448000000,
                "date": "2018-11-05",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.57,
                "award_money": 5.15,
                "rate": 0.75,
                "hit_back": 1.29,
                "win_lose_money": 1.149,
                "lower_back": 0.9,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181104001",
                "create_time": 1541263201000,
                "program_start_time": 1541340000000,
                "date": "2018-11-04",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.7,
                "award_money": 5.17,
                "rate": 0.75,
                "hit_back": 1.29,
                "win_lose_money": 1.168,
                "lower_back": 0.89,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181103002",
                "create_time": 1541176801000,
                "program_start_time": 1541242800000,
                "date": "2018-11-03",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.77,
                "award_money": 5.21,
                "rate": 0.75,
                "hit_back": 1.3,
                "win_lose_money": 1.212,
                "lower_back": 0.92,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181103001",
                "create_time": 1541176801000,
                "program_start_time": 1541257200000,
                "date": "2018-11-03",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.66,
                "award_money": 5.19,
                "rate": 0.74,
                "hit_back": 1.3,
                "win_lose_money": 1.191,
                "lower_back": 0.93,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181102002",
                "create_time": 1541115601000,
                "program_start_time": 1541206800000,
                "date": "2018-11-02",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.68,
                "award_money": 5.19,
                "rate": 0.72,
                "hit_back": 1.3,
                "win_lose_money": 1.192,
                "lower_back": 0.92,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181102001",
                "create_time": 1541090401000,
                "program_start_time": 1541185200000,
                "date": "2018-11-02",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 0,
                "status": "1",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.55,
                "award_money": 0.0,
                "rate": 0.71,
                "hit_back": 0.0,
                "win_lose_money": -4.0,
                "lower_back": 0.9,
                "is_best_choice": "0"
              }, {
                "date_no": "DQFA20181101001",
                "create_time": 1541004001000,
                "program_start_time": 1541085300000,
                "date": "2018-11-01",
                "type": "1X2",
                "base_money": 4.0,
                "hit_count": 1,
                "status": "2",
                "up_count": 0,
                "down_count": 0,
                "high_back": 1.57,
                "award_money": 5.29,
                "rate": 0.74,
                "hit_back": 1.32,
                "win_lose_money": 1.288,
                "lower_back": 1.09,
                "is_best_choice": "0"
              }]
            }
          }

          console.log(result.data.highodd)

          let _tmp = result.data.highodd

          for (let i = 0; i < _tmp.length; i++) {
            let _res = this.formatDuring((_tmp[i].program_start_time - new Date().getTime()))
            _tmp[i].program_start_time2 = _tmp[i].program_start_time - new Date().getTime() <= 0 ? '已截止' : _res
          }

          //获取截止时间

          this.setData({
            datas: result.data.highodd
          })

        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  formatDuring(mss) {
    let days = Number.parseInt(mss / (1000 * 60 * 60 * 24));
    let hours = Number.parseInt(mss / (1000 * 60 * 60));
    let minutes = Number.parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Number.parseInt((mss % (1000 * 60)) / 1000);
    return hours + "小时" + minutes + "分钟" + seconds + "秒";
  }

})