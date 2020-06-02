// pages/everyList/everyList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
  },

  
  onLoad(options) {
    
    let _mthis = this;
    let date = new Date();
    //未传递参数
    let _date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    //--暂时没有新的数据
    // _date = '2017-03-30';

    //获取数据
    wx.request({
      method: "post",
      url: app.globalData.requestUrl + 'hot/getEveryDayEnglishByDateV2',
      data: { date: _date, learningType: 0, userID: 0, rating: 0, deviceID: 0, type: 4 },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status == 1) {

          let _arr = [];

          let _data = res.data.returnJSON

          for (let i = 0; i < _data.length; i++) {
            let _this = _data[i];
            let __date = this.toLocalTime(_this.belongsTimestamp)[0];
            if (_arr.length == 0) {
              _arr.push({
                date: __date,
                date2: this.toLocalTime(_this.belongsTimestamp)[2],
                datas: []
              })
            }
            let _flag = true;
            for (let j = 0; j < _arr.length; j++) {
              if (_arr[j].date == __date) {
                _flag = false;
                break;
              }
            }
            if (_flag) {
              _arr.push({
                date: __date,
                date2: this.toLocalTime(_this.belongsTimestamp)[2],
                datas: []
              })
            }

          }

          for (let i = 0; i < _data.length; i++) {
            let _this = _data[i];
            let __date = this.toLocalTime(_this.belongsTimestamp)[0];

            var _flag = false, _index = 0;
            for (let j = 0; j < _arr.length; j++) {
              if (_arr[j].date == __date) {
                _flag = true;
                _index = j;
                break;
              }
            }
            if (_flag) {
              _arr[_index].datas.push(_this);
            }

          }

          this.setData({
            datas: _arr
          })

        }

      }
    })

  },

  /**
	 * 小于9补0函数
	 * @param num		原始数值
	 * @returns {*}	新数值
	 */
  addZero(num) {
    let str = num.toString();
    if (str.length == 1) return "0" + num;
    else return num;
  },

  /**
	 * 时间戳格式化函数
	 * @param nS	秒数时间戳（非js时间戳，js时间戳是毫秒数，需要/=1000
	 * @returns {string}
	 */
  toLocalTime(nS) {
    let date = new Date(parseInt(nS) * 1000);
    let myDate = this.addZero(date.getMonth() + 1) + "月" + this.addZero(date.getDate()) + "日";
    let _linkDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return [myDate, date, _linkDate];
  },

 
})