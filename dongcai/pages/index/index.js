//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: [
      {
        list: [1,2,3]
      },
      {
        list: [1, 2, 3]
      },
    ],
    filtrateIndex: 0,       // 0 全部 1 竞彩 2 北单 3 足彩
    showFiltrate: false,     //显示筛选弹窗
    date: '',               // 今天的日期
    ballType: 0,            // 0 足球 1 蓝球
    showType: 0,            // 0 全部 1 进行中 2 热门 3 已结束 4 已关注
    showSetting: false,     // true | false
    userID: "",
    endMatchs: [],          // 已结束的赛程
    ingMatchs: [],          // 进行中的赛程
    othMatchs: [],          // 其他赛程（非本日）
    preMatchs: [],          // 未开始的赛程
    fliterData: {},         // 筛选数据
    fliterList: [],         // 筛选数据
    params: {
      str_code: '2.8.2',
      match_start_date: '',
      city: '重庆',
      leagues: '',
      net_type: 1,
      ip: '125.86.57.200',
      order_by: '1',
      device_type: 'MI 6',
      type: 'ALL_MATCHS',   // ALL_MATCHS 全部 | ING_MATCHS 进行中 | HOT_MATCHS 热门 | END_MATCHS 已结束 | COLLECT_MATCHS 已关注
      source_code: 102,
      token: '4BED0C3493644B2CBF160345EEC3F6FA'
    }
  },

  onLoad() {

    this.login = this.selectComponent("#login");
    this.loader = this.selectComponent("#loader");

    //获取今天的时间

    let date = new Date();
    let _date = date.getFullYear() + "-" + app.addZero(date.getMonth() + 1) + "-" + app.addZero(date.getDate());

    let _params = this.data.params

    _params.match_start_date = _date

    this.setData({
      date: date,
      params: _params
    })

    this.getMatch()  

    this.getFilter()


  },

  onShow() {

  },

  getMatch(){
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footScore',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {

          let data = res.data.data

          if (app.isNull(data)){
            this.setData({
              endMatchs: [],
              ingMatchs: [],
              othMatchs: [],
              preMatchs: [],
            })
            return
          }

          let endMatchs = data.end_matchs
          let ingMatchs = data.ing_matchs
          let _othMatchs = data.oth_matchs
          let othMatchs = []
          let preMatchs = data.pre_matchs

          if (endMatchs.length){
            for (let i = 0; i < endMatchs.length; i++){
              let _str = endMatchs[i].match_start_time
              endMatchs[i].match_start_time3 = _str.substring(0, 10)
              endMatchs[i].match_start_time2 = _str.substring(11, 16)
            }
          }
          if (ingMatchs.length) {
            for (let i = 0; i < ingMatchs.length; i++) {
              let _str = ingMatchs[i].match_start_time
              ingMatchs[i].match_start_time3 = _str.substring(0, 10)
              ingMatchs[i].match_start_time2 = _str.substring(11, 16)
            }
          }
          if (preMatchs.length) {
            for (let i = 0; i < preMatchs.length; i++) {
              let _str = preMatchs[i].match_start_time
              preMatchs[i].match_start_time3 = _str.substring(0, 10)
              preMatchs[i].match_start_time2 = _str.substring(11, 16)
            }
          }

          // 重组othMatchs
          if (!app.isNull(_othMatchs)){
            app.each(_othMatchs, (key, val)=>{
              for (let i = 0; i < val.length; i++) {
                let _str = val[i].match_start_time
                val[i].match_start_time3 = _str.substring(0, 10)
                val[i].match_start_time2 = _str.substring(11, 16)
              }
              othMatchs.push({
                date: key,
                list: val
              })
            })
          }

          this.setData({
            endMatchs,
            ingMatchs,
            othMatchs,
            preMatchs,
          })
        }
      }
    })
  },

  getFilter(){
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '/interface/dcb/live/footFilter',
      data: { param: JSON.stringify(this.data.params) },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.code == 200 || res.data.code == '200') {
          console.log(res)

          let _data = res.data.data

          let _all = _data.all
          let _bd = _data.bd
          let _jc = _data.jc
          let _zc = _data.zc


          if(!app.isNull(_all)){
            let _tmp = []
            app.each(_all, (key, val)=>{
              _tmp.push({
                name: key,
                selected: true,
                val,
              })
            })
            _all = _tmp
          }

          if (!app.isNull(_bd)) {
            let _tmp = []
            app.each(_bd, (key, val) => {
              _tmp.push({
                name: key,
                selected: true,
                val
              })
            })
            _bd = _tmp
          }

          if (!app.isNull(_jc)) {
            let _tmp = []
            app.each(_jc, (key, val) => {
              _tmp.push({
                name: key,
                selected: true,
                val
              })
            })
            _jc = _tmp
          }

          if (!app.isNull(_zc)) {
            let _tmp = []
            app.each(_zc, (key, val) => {
              _tmp.push({
                name: key,
                selected: true,
                val
              })
            })
            _zc = _tmp
          }


          _data = {
            all: _all,
            bd: _bd,
            jc: _jc,
            zc: _zc,
          }

          this.setData({
            fliterList: _all,
            fliterData: _data
          })

        }
      }
    })
  },

  //取消事件 
  _cancelEvent(){
    wx.showToast({
      title: '登录取消',
      icon: 'none',
      duration: 1000
    })
    this.login.hideLogin()
  }, 
  //确认事件
  _confirmEvent(){

    let _this = this

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })

    app.getUser((res) => {

      if (res) {
        _this.setData({
          userID: res.userID,
        })

        _this.onReachBottom()

        this.loader.hideLoader()

      } else {
        //未登录
        this.login.showLogin()
      }

    })

    this.login.hideLogin()
  },

  changeBallType(e){
    this.setData({
      ballType: e.target.dataset.value
    })
  },  

  changeShowType(e){
    let val = e.target.dataset.value

    let _params = this.data.params

    if (val == 0){
      _params.type = 'ALL_MATCHS'
    } else if (val == 1) {
      _params.type = 'ING_MATCHS'
    } else if (val == 2) {
      _params.type = 'HOT_MATCHS'
    } else if (val == 3) {
      _params.type = 'END_MATCHS'
    } else if (val == 4) {
      _params.type = 'COLLECT_MATCHS'
    }

    this.setData({
      showType: val
    })

    this.getMatch()

  },

  /**
   * 标记为选中
   */
  selectOn(e, item){
    let _item = e.target.dataset.value || e.currentTarget.dataset.value

    if (item)
      _item = item


    let _data = this.data.fliterData

    //渲染其他筛选项
    for (let i = 0; i < _data.all.length; i++) {
      if (_data.all[i].name == _item.name) {
        _data.all[i].selected = true
      }
    }
    for (let i = 0; i < _data.bd.length; i++) {
      if (_data.bd[i].name == _item.name) {
        _data.bd[i].selected = true
      }
    }
    for (let i = 0; i < _data.jc.length; i++) {
      if (_data.jc[i].name == _item.name) {
        _data.jc[i].selected = true
      }
    }
    for (let i = 0; i < _data.zc.length; i++) {
      if (_data.zc[i].name == _item.name) {
        _data.zc[i].selected = true
      }
    }

    let _list = []

    if (this.data.filtrateIndex == 0) {
      //全部
      _list = _data.all
    } else if (this.data.filtrateIndex == 1) {
      //竞彩
      _list = _data.jc
    } else if (this.data.filtrateIndex == 2) {
      //北单
      _list = _data.bd
    } else if (this.data.filtrateIndex == 3) {
      //足彩
      _list = _data.zc
    }

    this.setData({
      fliterList: _list,
      fliterData: _data
    })

  },

  /**
   * 标记为未选中
   */
  selectOff(e, item){
    let _item = e.target.dataset.value || e.currentTarget.dataset.value

    if(item)
      _item = item
    
    let _data = this.data.fliterData

    //渲染其他筛选项
    for (let i = 0; i <_data.all.length; i++){
      if (_data.all[i].name == _item.name){
        _data.all[i].selected = false
      }
    } 
    for (let i = 0; i < _data.bd.length; i++) {
      if (_data.bd[i].name == _item.name) {
        _data.bd[i].selected = false
      }
    } 
    for (let i = 0; i < _data.jc.length; i++) {
      if (_data.jc[i].name == _item.name) {
        _data.jc[i].selected = false
      }
    } 
    for (let i = 0; i < _data.zc.length; i++) {
      if (_data.zc[i].name == _item.name) {
        _data.zc[i].selected = false
      }
    }
    
    let _list = []

    if (this.data.filtrateIndex == 0){
      //全部
      _list = _data.all
    }else if (this.data.filtrateIndex == 1) {
      //竞彩
      _list = _data.jc
    } else if (this.data.filtrateIndex == 2) {
      //北单
      _list = _data.bd
    } else if (this.data.filtrateIndex == 3) {
      //足彩
      _list = _data.zc
    }

    this.setData({
      fliterList: _list,
      fliterData: _data
    })

  },

  changeFliterType(e){

    let val = e.target.dataset.index || e.currentTarget.dataset.index

    let _data = this.data.fliterData

    let _list = []

    if (val == 0) {
      //全部
      _list = _data.all
    } else if (val == 1) {
      //竞彩
      _list = _data.jc
    } else if (val == 2) {
      //北单
      _list = _data.bd
    } else if (val == 3) {
      //足彩
      _list = _data.zc
    }

    this.setData({
      fliterList: _list,
      fliterData: _data,
      filtrateIndex: val
    })

  },

  /**
   * 全选
   */
  selectAll(e){
    
    let val = this.data.filtrateIndex

    let _data = this.data.fliterData

    let _list = []

    if (val == 0) {
      //全部
      _list = _data.all
    } else if (val == 1) {
      //竞彩
      _list = _data.jc
    } else if (val == 2) {
      //北单
      _list = _data.bd
    } else if (val == 3) {
      //足彩
      _list = _data.zc
    }

    for (let i = 0; i < _list.length; i++){
      this.selectOn(e, _list[i]) 
    }

  },

  /**
   * 反选
   */
  selectInvert(e){
    let val = this.data.filtrateIndex

    let _data = this.data.fliterData

    let _list = []

    if (val == 0) {
      //全部
      _list = _data.all
    } else if (val == 1) {
      //竞彩
      _list = _data.jc
    } else if (val == 2) {
      //北单
      _list = _data.bd
    } else if (val == 3) {
      //足彩
      _list = _data.zc
    }

    for (let i = 0; i < _list.length; i++) {
      if(_list[i].selected)
        this.selectOff(e, _list[i])
      else
        this.selectOn(e, _list[i])
    }
  },

  /**
   * 选中五大联赛
   */
  selectFive(e){

    let _list = [
      { name: '英超' },
      { name: '意甲' },
      { name: '德甲' },
      { name: '西甲' },
      { name: '法甲' },
    ]

    let _all = this.data.fliterData.all

    for (let i = 0; i < _all.length; i++) {
      this.selectOff(e, _all[i])
    }

    for (let i = 0; i < _list.length; i++) {
        this.selectOn(e, _list[i])
    }

  },

  /**
   * 开启筛选
   */
  openFiltrate(){
    this.setData({
      showFiltrate: true
    })
  },

  /**
   * 关闭筛选
   */
  closeFiltrate(e){

    let val = e.target.dataset.val || e.currentTarget.dataset.val


    if(val == 'ok'){
      
      let val = this.data.filtrateIndex

      let _data = this.data.fliterData

      let _list = []

      if (val == 0) {
        //全部
        _list = _data.all
      } else if (val == 1) {
        //竞彩
        _list = _data.jc
      } else if (val == 2) {
        //北单
        _list = _data.bd
      } else if (val == 3) {
        //足彩
        _list = _data.zc
      }

      let _res = _list.filter((item)=>{
        return item.selected == true
      })

      if(_res.length){
        let _tmp = []

        for(let i=0; i<_res.length; i++){
          _tmp.push(_res[i].name)
        }

        let _params = this.data.params

        _params.leagues = _tmp.join(',')

        this.setData({
          params: _params
        })

        this.getMatch()

      }

    }


    this.setData({
      showFiltrate: false
    })
  },

  /**
   * 开启设置
   */
  openSettting(){

  },

  closeSetting(){

  },

  /**
   * 开启日期查询
   */
  openDate(){
    wx.navigateTo({
      url: '/pages/date/date',
    })
  },

  closeDate(){

  },

  /**
   * 收藏
   */
  fav(){

  },

  /**
   * 现场直播
   */
  toLive(){

  },


  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom () {

    return

    let _this = this

    if (this.data.disable == true) {
      return false;
    }
    let userID = this.data.userID
    let page = this.data.page
    let perpage = this.data.perpage
    page++;
    

    //获取相册列表
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + '?s=App.Album_Photo.GetList',
      data: { user_id: userID, page: page, perpage: perpage },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.ret == 200){

          let tmp = res.data.data.photos
          console.log(tmp)
  
          if(page > 1){
            var empty = false
          }else{
            //判断相册数量 如果有相册empty为false
            if (tmp.length > 0) {
              var empty = false
            } else {
              var empty = true
            }
          }

          if (tmp.length == 0 || tmp.length < 10) {
            console.log('暂无更多数据')
            _this.setData({
              disable: true,
            })
          }

          let photoList = _this.data.photoList;

          photoList = photoList.concat(tmp)
         
          //相册数量大于4 vain为false
          if (photoList.length > 4) {
            var vain = false
          } else {
            var vain = true
          }

          _this.setData({
            empty: empty,
            vain: vain,
            photoList: photoList,
            page: page
          })
          
        }

      }
    })
  },
})
