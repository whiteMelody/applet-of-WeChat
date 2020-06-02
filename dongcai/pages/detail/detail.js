// pages/detail/detail.js
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
    showType: 0,                    // 0 文字直播 | 
    doubles: 2,                   
    detailHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    wx.getSystemInfo({
      success: (res)=> {
        const query = wx.createSelectorQuery()
        query.select('#matchDetail').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec( (res2)=> {
          this.setData({
            doubles: 750 / res.windowWidth,
            detailHeight: res.windowHeight - res2[0].height - (210 / (750 / res.windowWidth))
          }) 
        })
        
      },
    })

    let params = this.data.params

    params.match_id = options.matchID

    let date = new Date();
    let _date = date.getFullYear() + "-" + app.addZero(date.getMonth() + 1) + "-" + app.addZero(date.getDate());

    if (options.date){
      params.date = options.date
    }else{
      params.date = _date
    }
   
    this.setData({
      params,
      matchID: options.matchID
    })

    this.getMatchDetail()

    this.getLiveWord()

    // cancel_en_num:null
    // code:"517"
    // en_num:1
    // event_re_num:null
    // font_style:"1"
    // msg_id:7
    // msg_place:"1"
    // msg_text:"直播信号恢复"
    // play_info:null
    // state:"0"
    // time:0

    
    // /live/footLiveScore

    // { "date": "2018-10-24", "str_code": "2.8.2", "city": "重庆", "match_id": "1045893", "ip": "125.86.57.200", "device_type": "MI 6", "source_code": "102", "token": "4BED0C3493644B2CBF160345EEC3F6FA" }


    // /live/forbids

    // { "str_code": "2.8.2", "city": "重庆", "ip": "125.86.57.200", "device_type": "MI 6", "source_code": "102", "token": "4BED0C3493644B2CBF160345EEC3F6FA" }

    
    // /live/footLiveStatistics

    // { "date": "2018-10-24", "str_code": "2.8.2", "city": "重庆", "match_id": "1045893", "ip": "125.86.57.200", "device_type": "MI 6", "source_code": "102", "token": "4BED0C3493644B2CBF160345EEC3F6FA" }

    // /live/footLiveWord

    // { "date": "2018-10-24", "str_code": "2.8.2", "size": "0", "city": "重庆", "match_id": "1045893", "ip": "125.86.57.200", "index": "0", "device_type": "MI 6", "source_code": "102", "token": "4BED0C3493644B2CBF160345EEC3F6FA" }

    // /live/footLiveEvent
    // { "date": "2018-10-24", "str_code": "2.8.2", "city": "重庆", "match_id": "1045893", "ip": "125.86.57.200", "device_type": "MI 6", "source_code": "102", "token": "4BED0C3493644B2CBF160345EEC3F6FA" }


    // /live/footLiveBattle
    // { "date": "2018-10-24", "str_code": "2.8.2", "city": "重庆", "match_id": "1045893", "ip": "125.86.57.200", "device_type": "MI 6", "source_code": "102", "token": "4BED0C3493644B2CBF160345EEC3F6FA" }


    


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 获取赛事详情
   */
  getMatchDetail(){
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footLiveScore',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          
          let _tmp = res.data.data

          _tmp.defeat_percent2 = Math.round(_tmp.defeat_percent * 100)
          _tmp.win_percent2 = Math.round(_tmp.win_percent * 100)

          this.setData({
            match: _tmp
          })
        }
      }
    })
  },

  /**
   * 获取文字直播
   */
  getLiveWord(){
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footLiveWord',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          let _tmp = res.data.data

          //处理数组

          let _arr = [], _flag = true

          //去重
          for(let i=0; i< _tmp.length; i++){
            _tmp[i].time2 = Math.round(_tmp[i].time / 1000 / 60)
            if(_arr.length == 0){
              _arr.push(_tmp[i])
            }else{
              _flag = true
              for (let j = 0; j < _arr.length; j++){
                if (_arr[j].msg_text == _tmp[i].msg_text && _arr[j].time == _tmp[i].time){
                  _flag = false
                  break
                }
              }

              if (_flag) {
                _arr.push(_tmp[i])
              }

            }
          }

          // console.log(_arr)

          this.setData({
            liveWord: _arr.reverse()
          })


        }
      }
    })
  },


  /**
   * 足球比分详情数据统计
   */
  getLiveStatistics() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footLiveStatistics',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let _tmp = res.data.data

          if (!app.isNull(_tmp)){
            _tmp[0].power2 = Math.round(_tmp[0].power * 100)
            _tmp[1].power2 = Math.round(_tmp[1].power * 100)
            _tmp[0].ball_control_rate2 = Math.round(_tmp[0].ball_control_rate * 100)
            _tmp[1].ball_control_rate2 = Math.round(_tmp[1].ball_control_rate * 100) 
          }

          this.setData({
            liveStatistics: _tmp
          })
        }
      }
    })
  },

  /**
   * 事件
   */
  getLiveEvent() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footLiveEvent',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          
          let _tmp = res.data.data

          let _arr = []

          let _flag = true

          //去重  time

          for (let i = 0; i < _tmp.length; i++) {
            _tmp[i].time2 = Math.round(_tmp[i].time / 1000 / 60)
            if (_arr.length == 0) {
              _arr.push(_tmp[i])
            } else {
              _flag = true
              for (let j = 0; j < _arr.length; j++) {
                if (_arr[j].chat_desc == _tmp[i].chat_desc && _arr[j].time == _tmp[i].time) {
                  _flag = false
                  break
                }
              }

              if (_flag) {
                _arr.push(_tmp[i])
              }

            }
          }

          let _home = []
          let _away = []
          let _data2 = []

          let homeCount1 = 0        // 主队进球数
          let awayCount1 = 0        // 客队进球数
          let homeCount2 = 0        // 主队乌龙球数
          let awayCount2 = 0        // 客队乌龙球数
          let homeCount3 = 0        // 主队点球数
          let awayCount3 = 0        // 客队点球数
          let homeCount4 = 0        // 主队角球数
          let awayCount4 = 0        // 客队角球数
          let homeCount5 = 0        // 主队换人数
          let awayCount5 = 0        // 客队换人数
          let homeCount6 = 0        // 主队黄牌数
          let awayCount6 = 0        // 客队黄牌数
          let homeCount7 = 0        // 主队黄变红数
          let awayCount7 = 0        // 客队黄变红数
          let homeCount8 = 0        // 主队红牌数
          let awayCount8 = 0        // 客队红牌数
          
          for (let i = 0; i < _arr.length; i++){
            let _text = _arr[i].match_desc
            //进球
            if (_text.includes('进球')){
              if (_text.includes('主队')){
                homeCount1 ++ 
                _arr[i].count = homeCount1 + awayCount1
                _arr[i].scoreType = 1
                _arr[i].team = 1
                _arr[i].desc2 = '进球'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else{
                awayCount1++
                _arr[i].count = homeCount1 + awayCount1
                _arr[i].scoreType = 1
                _arr[i].team = 2
                _arr[i].desc2 = '进球'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            }else if (_text.includes('乌龙球')) {
              if (_text.includes('主队')) {
                homeCount2++
                _arr[i].count = homeCount2 + awayCount2
                _arr[i].scoreType = 2
                _arr[i].team = 1
                _arr[i].desc2 = '乌龙球'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount2++
                _arr[i].count = homeCount2 + awayCount2
                _arr[i].scoreType = 2
                _arr[i].team = 2
                _arr[i].desc2 = '乌龙球'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            } else if (_text.includes('点球')) {
              if (_text.includes('主队')) {
                homeCount3++
                _arr[i].count = homeCount3 + awayCount3
                _arr[i].scoreType = 3
                _arr[i].team = 1
                _arr[i].desc2 = '点球'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount3++
                _arr[i].count = homeCount3 + awayCount3
                _arr[i].scoreType = 3
                _arr[i].team = 2
                _arr[i].desc2 = '点球'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            } else if (_text.includes('角球')) {
              if (_text.includes('主队')) {
                homeCount4++
                _arr[i].count = homeCount4 + awayCount4
                _arr[i].scoreType = 4
                _arr[i].team = 1
                _arr[i].desc2 = '角球'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount4++
                _arr[i].count = homeCount4 + awayCount4
                _arr[i].scoreType = 4
                _arr[i].team = 2
                _arr[i].desc2 = '角球'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            } else if (_text.includes('换人')) {
              if (_text.includes('主队')) {
                homeCount5++
                _arr[i].count = homeCount5 + awayCount5
                _arr[i].scoreType = 5
                _arr[i].team = 1
                _arr[i].desc2 = '换人'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount5++
                _arr[i].count = homeCount5 + awayCount5
                _arr[i].scoreType = 5
                _arr[i].team = 2
                _arr[i].desc2 = '换人'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            } else if (_text.includes('黄牌')) {
              if (_text.includes('主队')) {
                homeCount6++
                _arr[i].count = homeCount6 + awayCount6
                _arr[i].scoreType = 6
                _arr[i].team = 1
                _arr[i].desc2 = '黄牌'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount6++
                _arr[i].count = homeCount6 + awayCount6
                _arr[i].scoreType = 6
                _arr[i].team = 2
                _arr[i].desc2 = '黄牌'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            } else if (_text.includes('黄变红')) {
              if (_text.includes('主队')) {
                homeCount7++
                _arr[i].count = homeCount7 + awayCount7
                _arr[i].scoreType = 7
                _arr[i].team = 1
                _arr[i].desc2 = '黄变红'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount7++
                _arr[i].count = homeCount7 + awayCount7
                _arr[i].scoreType = 7
                _arr[i].team = 2
                _arr[i].desc2 = '黄变红'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            } else if (_text.includes('红牌')) {
              if (_text.includes('主队')) {
                homeCount8++
                _arr[i].count = homeCount8 + awayCount8
                _arr[i].scoreType = 8
                _arr[i].team = 1
                _arr[i].desc2 = '红牌'
                _home.push(_arr[i])
                _data2.push(_arr[i])
              }
              else {
                awayCount8++
                _arr[i].count = homeCount8 + awayCount8
                _arr[i].scoreType = 8
                _arr[i].team = 2
                _arr[i].desc2 = '红牌'
                _away.push(_arr[i])
                _data2.push(_arr[i])
              }
            }

          }

          let _data = {
            home: _home,
            away: _away
          }

          console.log(_data2)

          this.setData({
            liveEvent: _data2
          })
        }
      }
    })
  },

  /**
   * 首发阵容
   */
  getLiveBattle() {
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footLiveBattle',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let _tmp = res.data.data

          _tmp.home_line_up = JSON.parse(_tmp.home_line_up)
          _tmp.away_line_up = JSON.parse(_tmp.away_line_up)

          this.setData({
            liveBattle: _tmp
          })
        }
      }
    })
  },

  changeShowType(e){

    let val = e.target.dataset.value || e.currentTarget.dataset.value

    if (val == 0) {
      // 文字直播
      this.getLiveWord()
    } else if (val == 1) {
      // 数据统计
      this.getLiveStatistics()
    } else if (val == 2) {
      // 事件记录
      this.getLiveEvent()
    } else if (val == 3) {
      // 首发阵容
      this.getLiveBattle()
    }

    this.setData({
      showType: val
    })

  },

 
})