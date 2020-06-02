// pages/dktj/dktj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ballType: 0,            // 0 足球 1 蓝球
    datas: {},
    maths: [],
    param: { 
      date: "2018-11-11", 
      str_code: "2.8.2", 
      union_name: "", 
      city: "重庆", 
      net_type: "0", 
      ip: "123.147.250.4", 
      device_type: "MI 6", 
      type: "2", 
      source_code: "102", 
      status: "2", 
      token: "4BED0C3493644B2CBF160345EEC3F6FA" 
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // [0]	Object
    // date	String	2018 - 11 - 11
    // match_id	String	1008318
    // number	String	周日010
    // number_bd	Null	null
    // number_zc	Null	null
    // union_name	String	J2联赛
    // match_start_time	String	2018 - 11 - 11 14: 00: 00
    // host_team_name	String	爱媛FC
    // guest_team_name	String	町田泽维
    // create_time	Long	1541691051000
    // final_score	String	0: 2
    // collect_type	String	1
    // video_type	Null	null
    // match_status	String	2
    // index_one_win	Number	0.851676
    // index_one_flat	Number	0.924855
    // index_one_defeat	Number	0.926059
    // standard_disc	Number	0.76
    // win_odd	Number	4.413
    // flat_odd	Number	3.37
    // defeat_odd	Number	1.762
    // win_percent	Number	0.3437339953576392
    // defeat_percent	Number	0.6562660046423608
    // valid	String	命中
    // type String	2
    // host_logo	String	null
    // guest_logo	String	null
    // host_rank	String	日乙18
    // guest_rank	String	日乙3
    // source_type	String	1
    // wid	String	713660
    // match_start_date	String	2018 - 11 - 11
    // home_score	Integer	0
    // away_score	Integer	2
    // home_half_score	Integer	0
    // away_half_score	Integer	0
    // status	String	4
    // live_match_status	String	2
    // fact_count	Integer	0

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

          this.setData({
            datas: res.data.data
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

  changeBallType(e) {
    this.setData({
      ballType: e.target.dataset.value
    })
  },  

  
})