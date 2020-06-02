// pages/faDetail/faDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oddsData:{
      per1: 14678,
      per2: 5092,
      per3: 2075
    },
    datas: {},
    params: { 
      str_code: "2.8.2", 
      date_no: "DQFA20181113001", 
      city: "重庆", 
      ip: "106.81.228.184", 
      device_type: "MI 6", 
      source_code: "102", 
      token: "4BED0C3493644B2CBF160345EEC3F6FA"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取方案详情

    let params = this.data.params

    params.date_no = options.dateNo

    this.setData({
      params
    })

    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/highOdd/detail',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let result = res.data
          
          // let result = {
          //   "msg": null,
          //   "code": "200",
          //   "data": {
          //     "compute": {
          //       "complex_home_power": 3.75,
          //       "cross_away_power": 1.0,
          //       "cross_home_power": 4.0,
          //       "complex_away_power": 0.25,
          //       "attack_home_power": 2.0,
          //       "attack_away_power": 0.0,
          //       "attend_away_power": 0.0,
          //       "attend_home_power": 8.0
          //     },
          //     "is_collect": "N",
          //     "money": "10",
          //     "match": {
          //       "program_start_time": 1542138300000,
          //       "win_ticket": "23583",
          //       "hit_odd": 2.03,
          //       "flat_odd": 3.6,
          //       "host_team_name": "彼得堡联",
          //       "guest_team_name": "卢顿",
          //       "number": "周二008",
          //       "defeat_support_rate": "20%",
          //       "win_odd": 2.03,
          //       "match_id": "1045163",
          //       "host_team_rank": "英甲3",
          //       "host_team_logo": "http://www.okooo.com/Upload/Team/201109151720350.jpg",
          //       "match_start_time": "2018-11-14 03:45:00",
          //       "guest_team_rank": "英甲5",
          //       "match_status": "2",
          //       "serial_num": 1,
          //       "guest_team_logo": "http://www.okooo.com/Upload/Team/201109211043400.jpg",
          //       "hit_choice": "1",
          //       "final_score": "2:1",
          //       "union_name": "英锦赛",
          //       "defeat_odd": 2.8,
          //       "defeat_ticket": "8371",
          //       "date_no": "DQFA20181113001",
          //       "win_support_rate": "57%",
          //       "flat_ticket": "9771",
          //       "flat_support_rate": "23%",
          //       "choice": "胜,平",
          //       "status": "2"
          //     },
          //     "sys_time": 1542186205506,
          //     "down_count": 0,
          //     "up_count": 0,
          //     "vote": "1",
          //     "is_buy": false
          //   }
          // }

          result.data.match.win_support_rate2 = Number.parseFloat(result.data.match.win_support_rate.substring(0, 2))
          result.data.match.flat_support_rate2 = Number.parseFloat(result.data.match.flat_support_rate.substring(0, 2))
          result.data.match.defeat_support_rate2 = Number.parseFloat(result.data.match.defeat_support_rate.substring(0, 2))

          //实力对比
          result.data.compute.complex_home_power2 = app.twoDecimal(result.data.compute.complex_home_power / (result.data.compute.complex_home_power + result.data.compute.complex_away_power) * 100)
          result.data.compute.complex_away_power2 = app.twoDecimal(result.data.compute.complex_away_power / (result.data.compute.complex_home_power + result.data.compute.complex_away_power) * 100)

          //进攻实力
          result.data.compute.attack_home_power2 = app.twoDecimal(result.data.compute.attack_home_power / (result.data.compute.attack_away_power + result.data.compute.attack_home_power) * 100)
          result.data.compute.attack_away_power2 = app.twoDecimal(result.data.compute.attack_away_power / (result.data.compute.attack_away_power + result.data.compute.attack_home_power) * 100)

          //防守实力
          result.data.compute.attend_home_power2 = app.twoDecimal(result.data.compute.attend_home_power / (result.data.compute.attend_away_power + result.data.compute.attend_home_power) * 100)
          result.data.compute.attend_away_power2 = app.twoDecimal(result.data.compute.attend_away_power / (result.data.compute.attend_away_power + result.data.compute.attend_home_power) * 100)

          //近期交锋
          result.data.compute.cross_home_power2 = app.twoDecimal(result.data.compute.cross_home_power / (result.data.compute.cross_home_power + result.data.compute.cross_away_power) * 100)
          result.data.compute.cross_away_power2 = app.twoDecimal(result.data.compute.cross_away_power / (result.data.compute.cross_home_power + result.data.compute.cross_away_power) * 100)

          this.setData({
            datas: result.data
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

  
})