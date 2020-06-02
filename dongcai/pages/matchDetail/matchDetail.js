// pages/matchDetail/matchDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    match: {},                      // 比赛详情
    matchID: '',                    // 比赛ID
    liveWord: {},                   // 文字直播数据
    liveStatistics: [],             // 数据统计数据
    liveEvent: {},                  // 事件记录数据
    LiveBattle: {},                 // 首发阵容

    betfair: {},                    // 必发
    odds: {},                       // 赔率
    analyze: {},                    // 分析

    params: {                       // 参数
      date: '',
      str_code: '2.8.2',
      city: '重庆',
      match_id: '',
      ip: '125.86.57.200',
      device_type: 'MI 6',
      source_code: 102,
      token: '4BED0C3493644B2CBF160345EEC3F6FA',
    },

    showType: 0,                    // 0 必发 | 1 赔率 | 2 分析 | 3 情报 | 4 点评 | 5 大咖 
    doubles: 2,

    showType1: 0,                   // 0 欧赔 | 1 亚盘 | 2 大小球
    showType2: 1,                   // 0 临场 | 1 基本面 | 2 参谋
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let params = this.data.params

    params.match_id = options.matchID

    let date = new Date();
    let _date = date.getFullYear() + "-" + app.addZero(date.getMonth() + 1) + "-" + app.addZero(date.getDate());

    if (options.date) {
      params.date = options.date
    } else {
      params.date = _date
    }

    this.setData({
      params,
      matchID: options.matchID
    })

    this.getMatchDetail()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 获取赛事详情
   * 默认获取必发数据
   */
  getMatchDetail() {
    

    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/top',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let data = {
            "msg": null,
            "code": "200",
            "data": {
              "live_match_start_time": "2018-11-11 14:00",
              "date": "2018-11-11",
              "away": "町田泽维亚",
              "live_away_half_score": 0,
              "trade_describe": "",
              "home_rank": "日乙18",
              "win_percent": 0.3437339953576392,
              "result": "负",
              "score": "0-2",
              "number": "周日010",
              "wid": "713660",
              "half_score": "0-0",
              "live_home_score": 0,
              "away_rank": "日乙3",
              "live_match_status": "2",
              "live_status": "4",
              "away_logo": "http://www.okooo.com/Upload/Team/soccer/2412.png",
              "live_home_half_score": 0,
              "live_match_start_date": "2018-11-11",
              "source_type": "1",
              "match_start_time": "2018-11-11 14:00:00",
              "live_minute": 95,
              "home": "爱媛FC",
              "union_name": "J2联赛",
              "ok_status": "2",
              "round": "第41轮",
              "home_logo": "http://www.okooo.com/Upload/Team/201109271342270.jpg",
              "live_away_score": 2,
              "defeat_percent": 0.6562660046423608
            }
          }

          // this.setData({
          //   match: res.data.data
          // })


          this.setData({
            match: data.data
          })

        }
      }
    })


    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/betfair',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          console.log(res)

          let data2 = {
            "msg": null,
            "code": "200",
            "data": {
              "date": "2018-11-11",
              "all_odds_away": "1.94",
              "status_win": "33",
              "win_lost_tui": "3,1",
              "hot_cold_home": "-73",
              "cross_tui": "3,0",
              "trade_tui": "3,0",
              "hot": "86",
              "per_home": "6.01",
              "status_lost": "33",
              "win_lose_away": "-2,750",
              "cross_win": "57",
              "radio_draw": "27",
              "cross_drawn": "14",
              "trade_lost": "61",
              "cross_lost": "29",
              "per_away": "55.61",
              "win_lose_home": "25,054",
              "hot_cold_away": "10",
              "win": "82",
              "statement_betfa_scale": "本场比赛必发成交量倾向于<span class=\"font_red\">客胜</span>,与99家平均概率倾向相差<span class=\"font_red\">较大</span>。",
              "all_trade_home": "2,099",
              "hot_cold_draw": "40",
              "all_trade_away": "19,417",
              "create_time": 1541951407153,
              "trade_win": "20",
              "win_lost_lost": "27",
              "match_id": "1008318",
              "all_odds_draw": "3.7",
              "radio_away": "51",
              "win_lost_drawn": "36",
              "per_draw": "38.38",
              "trade_drawn": "19",
              "status_drawn": "33",
              "win_lose_draw": "-14,672",
              "win_lost_win": "36",
              "all_odds_home": "4.7",
              "sum_money": "34,919",
              "radio_tui": "1,0",
              "status_tui": "",
              "statement_win_lost": "本场比赛必发交易规模<span class=\"font_red\">较小</span>，投注比例不一定能反映真实用户心理。",
              "all_trade_draw": "13,403",
              "radio_home": "22",
              "statement_jc_scale": "本场比赛竞彩成交量倾向于<span class=\"font_red\">客胜</span>,与99家平均概率倾向相差<span class=\"font_red\">较大</span>。"
            }
          }

          // this.setData({
          //   match: res.data.data
          // })


          this.setData({
            betfair: data2.data
          })

        }
      }
    })


    // 获取赔率    
    this.getOdds()
    // 获取分析
    this.getAnalyze()
    // 获取点评
    this.getAttitude()
    // 获取大咖
    this.getDaka()



  },

  /**
   * 获取赔率
   */
  getOdds(){
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/odds',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let result = res.data.data

          //赔率变化 上升赔率公司总数
          result.data.odd_top.change_up_totle = Number.parseInt(result.data.odd_top.change_up_home) + Number.parseInt(result.data.odd_top.change_up_draw) + Number.parseInt(result.data.odd_top.change_up_away)

          //赔率变化 降低赔率公司总数
          result.data.odd_top.change_down_totle = Number.parseInt(result.data.odd_top.change_down_home) + Number.parseInt(result.data.odd_top.change_down_draw) + Number.parseInt(result.data.odd_top.change_down_away)

          //赔付控制 总家数
          result.data.odd_top.control_totle = Number.parseInt(result.data.odd_top.control_home) + Number.parseInt(result.data.odd_top.control_draw) + Number.parseInt(result.data.odd_top.control_away)

          //赔付控制 胜的家数
          result.data.odd_top.control_home2 = Math.floor(app.twoDecimal(result.data.odd_top.control_home / result.data.odd_top.control_totle) * 100)

          //赔付控制 平的家数
          result.data.odd_top.control_draw2 = Math.floor(app.twoDecimal(result.data.odd_top.control_draw / result.data.odd_top.control_totle) * 100)

          //赔付控制 负的家数
          result.data.odd_top.control_away2 = Math.floor(app.twoDecimal(result.data.odd_top.control_away / result.data.odd_top.control_totle) * 100)
        
          //盘位水位升降 升降盘公司总数
          result.data.plate_top.change_up_totle = Number.parseInt(result.data.plate_top.change_up_boundary) + Number.parseInt(result.data.plate_top.change_down_boundary)

          //主队水位公司数
          result.data.plate_top.totle_level = Number.parseInt(result.data.plate_top.high_level) + Number.parseInt(result.data.plate_top.low_level)
          
          //change 0 未改变 1 下降 2上升
          for (let i = 0; i < result.data.odd_kelly.length; i++){
            let _tmp = result.data.odd_kelly[i]

            if (Number.parseFloat(_tmp.start_home) > Number.parseFloat(_tmp.end_home))  _tmp.home_change = 2
            else if (Number.parseFloat(_tmp.start_home) < Number.parseFloat(_tmp.end_home)) _tmp.home_change = 1
            else  _tmp.home_change = 0

            if (Number.parseFloat(_tmp.start_draw) > Number.parseFloat(_tmp.end_draw)) _tmp.draw_change = 2
            else if (Number.parseFloat(_tmp.start_draw) < Number.parseFloat(_tmp.end_draw)) _tmp.draw_change = 1
            else _tmp.draw_change = 0

            if (Number.parseFloat(_tmp.start_away) > Number.parseFloat(_tmp.end_away)) _tmp.away_change = 2
            else if (Number.parseFloat(_tmp.start_away) < Number.parseFloat(_tmp.end_away)) _tmp.away_change = 1
            else _tmp.away_change = 0
          }

          for (let i = 0; i < result.data.plate_kelly.length; i++) {
            let _tmp = result.data.plate_kelly[i]

            if (Number.parseFloat(_tmp.start_home) > Number.parseFloat(_tmp.end_home)) _tmp.home_change = 2
            else if (Number.parseFloat(_tmp.start_home) < Number.parseFloat(_tmp.end_home)) _tmp.home_change = 1
            else _tmp.home_change = 0

            if (Number.parseFloat(_tmp.start_boundary_cn_name) > Number.parseFloat(_tmp.end_boundary_cn_name)) _tmp.boundary_change = 2
            else if (Number.parseFloat(_tmp.start_boundary_cn_name) < Number.parseFloat(_tmp.end_boundary_cn_name)) _tmp.boundary_change = 1
            else _tmp.boundary_change = 0

            if (Number.parseFloat(_tmp.start_away) > Number.parseFloat(_tmp.end_away)) _tmp.away_change = 2
            else if (Number.parseFloat(_tmp.start_away) < Number.parseFloat(_tmp.end_away)) _tmp.away_change = 1
            else _tmp.away_change = 0
          }


          for (let i = 0; i < result.data.plate_ball.length; i++) {
            let _tmp = result.data.plate_ball[i]

            if (Number.parseFloat(_tmp.start_over) > Number.parseFloat(_tmp.end_over)) _tmp.over_change = 2
            else if (Number.parseFloat(_tmp.start_over) < Number.parseFloat(_tmp.end_over)) _tmp.over_change = 1
            else _tmp.over_change = 0

            if (Number.parseFloat(_tmp.start_boundary) > Number.parseFloat(_tmp.end_boundary)) _tmp.boundary_change = 2
            else if (Number.parseFloat(_tmp.start_boundary) < Number.parseFloat(_tmp.end_boundary)) _tmp.boundary_change = 1
            else _tmp.boundary_change = 0

            if (Number.parseFloat(_tmp.start_under) > Number.parseFloat(_tmp.end_under)) _tmp.under_change = 2
            else if (Number.parseFloat(_tmp.start_under) < Number.parseFloat(_tmp.end_under)) _tmp.under_change = 1
            else _tmp.under_change = 0
          }


          this.setData({
            odds: result.data
          })

        }
      }
    })
  },

  /**
    * 获取分析
    */
  getAnalyze() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/xi',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let _tmp = res.data.data

          //实力对比
          _tmp.compute.complex_home_power2 = app.twoDecimal(_tmp.compute.complex_home_power / (_tmp.compute.complex_home_power + _tmp.compute.complex_away_power) * 100)
          _tmp.compute.complex_away_power2 = app.twoDecimal(_tmp.compute.complex_away_power / (_tmp.compute.complex_home_power + _tmp.compute.complex_away_power) * 100)

          //进攻实力
          _tmp.compute.attack_home_power2 = app.twoDecimal(_tmp.compute.attack_home_power / (_tmp.compute.attack_away_power + _tmp.compute.attack_home_power) * 100)
          _tmp.compute.attack_away_power2 = app.twoDecimal(_tmp.compute.attack_away_power / (_tmp.compute.attack_away_power + _tmp.compute.attack_home_power) * 100)

          //防守实力
          _tmp.compute.attend_home_power2 = app.twoDecimal(_tmp.compute.attend_home_power / (_tmp.compute.attend_away_power + _tmp.compute.attend_home_power) * 100)
          _tmp.compute.attend_away_power2 = app.twoDecimal(_tmp.compute.attend_away_power / (_tmp.compute.attend_away_power + _tmp.compute.attend_home_power) * 100)

          //近期交锋
          _tmp.compute.cross_home_power2 = app.twoDecimal(_tmp.compute.cross_home_power / (_tmp.compute.cross_home_power + _tmp.compute.cross_away_power) * 100)
          _tmp.compute.cross_away_power2 = app.twoDecimal(_tmp.compute.cross_away_power / (_tmp.compute.cross_home_power + _tmp.compute.cross_away_power) * 100)

          //进10场战绩 总数
          _tmp.xi.all_home_totle = Number.parseInt(_tmp.xi.all_home_win) + Number.parseInt(_tmp.xi.all_home_draw) + Number.parseInt(_tmp.xi.all_home_away)
          _tmp.xi.all_away_totle = Number.parseInt(_tmp.xi.all_away_win) + Number.parseInt(_tmp.xi.all_away_draw) + Number.parseInt(_tmp.xi.all_away_away)
          _tmp.xi.site_home_totle = Number.parseInt(_tmp.xi.site_home_win) + Number.parseInt(_tmp.xi.site_home_draw) + Number.parseInt(_tmp.xi.site_home_away)
          _tmp.xi.site_away_totle = Number.parseInt(_tmp.xi.site_away_win) + Number.parseInt(_tmp.xi.site_away_draw) + Number.parseInt(_tmp.xi.site_away_away)
          _tmp.xi.home_grade_home_totle = Number.parseInt(_tmp.xi.home_grade_home_win) + Number.parseInt(_tmp.xi.home_grade_home_draw) + Number.parseInt(_tmp.xi.home_grade_home_lose)
          _tmp.xi.home_grade_away_totle = Number.parseInt(_tmp.xi.home_grade_away_win) + Number.parseInt(_tmp.xi.home_grade_away_draw) + Number.parseInt(_tmp.xi.home_grade_away_lose)
          _tmp.xi.away_grade_home_totle = Number.parseInt(_tmp.xi.away_grade_home_win) + Number.parseInt(_tmp.xi.away_grade_home_draw) + Number.parseInt(_tmp.xi.away_grade_home_lose)
          _tmp.xi.away_grade_away_totle = Number.parseInt(_tmp.xi.away_grade_away_win) + Number.parseInt(_tmp.xi.away_grade_away_draw) + Number.parseInt(_tmp.xi.away_grade_away_lose)
          
          console.log(_tmp)

          this.setData({
            analyze: _tmp
          })

        }
      }
    })
  },


  /**
    * 获取情报
    */
  getInfo() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/info',
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
              "date": "2018-11-11",
              "results_home_dec": "不敗",
              "away": "町田泽维亚",
              "status_home_percent": 0.52,
              "express_away_content": "【劍指冠軍】\r\n由於不具備J1牌照，町田澤維亞本賽季無法升級，但可以爭取聯賽冠軍\r\n\r\n【進球先鋒】\r\n除了烏龍球以外，町田澤維亞過去的9個進球有4個都由頭號射手中島裕希參与（3球1助）\r\n\r\n【大將復出】\r\n町田澤維亞主力中衛酒井隆介（23場1球）本輪解禁復出，球隊防守實力提升\r\n\r\n【頭球殺招】\r\n町田澤維亞日乙前40輪通過頭球破門20次，日乙最多，佔全隊總進球的34%",
              "match_content": "",
              "status_away_dec": "[\"町田澤維亞上輪主場2:1力克勁敵福岡黃蜂，球隊在一球落後的情況下連入兩球逆轉。\",\"愛媛FC近4個聯賽主場有3場都至少丟2球，遠不如客戰連續3場零封的表現。\"]",
              "number": "周日010",
              "home_percent": 0.49,
              "match_home_content": "【町田澤維亞傷停】\r\n下坂晃城（替補後衛，8場1球）\r\n\r\n【主帥留任】\r\n愛媛FC周中宣布，現任主帥川井健太將在下賽季繼續執教球隊",
              "power_home_dec": "[\"弱旅愛媛FC本賽季日乙40戰積48分排名第18，已提前保級。\",\"愛媛FC近7次對陣町田澤維亞4勝1平2負，不敗率達到71%。\"]",
              "away_percent": 0.51,
              "express_content": "",
              "power_away_dec": "[\"勁旅町田澤維亞本賽季日乙40戰積72分排名第3，僅落後榜首球隊1分。\",\"町田澤維亞主力中場平戶太貴目前以16次助攻領跑日乙助攻榜。\",\"町田澤維亞日乙前40輪場均攻擊次數最多（141.3），射門轉化率第4高（11.2%）。\"]",
              "match_away_content": "",
              "away_logo": "https://zqmfcdn.huanhuba.net/app_static/team_icon/13135.png",
              "status_away_percent": 0.48,
              "question": "愛媛FC近年交鋒不怵，町田澤維亞客戰何時反彈？",
              "express_home_content": "【核心坐鎮】\r\n愛媛FC中場核心神谷優太上一個主場奉獻一射一傳幫助球隊戰平勁旅東京綠茵，聯賽至今已有7球6助攻，值得一提的是，其中6球2助都是面對現積分榜前8的球隊時獲得",
              "league": "日职乙",
              "status_home_dec": "[\"愛媛FC上輪客場1:0擊敗弱旅京都不死鳥，近12輪4勝6平2負表現穩健。\",\"町田澤維亞近3個聯賽客場1平2負未嘗勝績，包括1:1冷平副班長贊岐釜玉海。\"]",
              "results_away_dec": "勝",
              "match_time": "2018-11-11 14:00:00",
              "data_away_dec": "[\"本場亞指最初定位在客讓0.5低水的位置，後市升至0.5/1高水，町田澤維亞客戰狀態欠佳，升盤存在阻上之嫌。\"]",
              "home": "爱媛FC",
              "power_away_percent": 0.53,
              "power_home_percent": 0.47,
              "data_home_dec": "[\"主流歐指為本場比賽開出4.75 3.40 1.80的初始組合，歷史相同組合近8場比賽客隊取勝3場，勝率僅為37.5%。\"]",
              "home_logo": "https://zqmfcdn.huanhuba.net/app_static/team_icon/6521.png",
              "data_home_percent": 0.49,
              "data_away_percent": 0.51
            }
          }

          console.log(result)
          
        }
      }
    })
  },

  /**
    * 获取点评
    */
  getAttitude() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/attitude',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          console.log(res.data.data)
        }
      }
    })
  },


  /**
    * 获取大咖
    */
  getDaka() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/index/daka',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let result = {
            "msg": null,
            "code": "200",
            "data": [{
              "union_name": "J2联赛",
              "date": "2018-11-11",
              "number": "周日010",
              "host_team_name": "爱媛FC",
              "guest_team_name": "町田泽维亚",
              "host_team_logo": null,
              "guest_team_logo": null,
              "match_start_date": "2018-11-11",
              "match_start_time": "02:00:00",
              "sell_stop_time": "2018-11-11 13:50:00",
              "score": "0:2",
              "result": "1",
              "status": "1",
              "is_hit": "Y",
              "user_id": "314DCC7EB97549E3AEC85B3C8298FE0D",
              "post_id": "4898A18C1BD540389743E0037710DD92",
              "type": "9",
              "is_pay": "Y",
              "money": 38.0,
              "is_top": "N",
              "buy_type": "1",
              "title": "14点日乙推荐，勿错过",
              "program_status": "3",
              "create_time": 1541900160000,
              "return_rate": 1.83,
              "program_type": "3",
              "week_star_count": 1,
              "effect_count": 2057,
              "user_name": "日盈竞彩",
              "head_img": "http://www.dqkey.com/data/img/head/2018-10-02/1648238169651005.jpg",
              "auth_rank": "2",
              "is_vip": "0"
            }]
          }

          console.log(result)
        }
      }
    })
  },


  changeShowType(e) {

    let val = e.target.dataset.value || e.currentTarget.dataset.value

    this.setData({
      showType: val
    })

  },


  changeShowType1(e) {

    console.log(1111)

    let val = e.target.dataset.value || e.currentTarget.dataset.value

    this.setData({
      showType1: val
    })

  },


})