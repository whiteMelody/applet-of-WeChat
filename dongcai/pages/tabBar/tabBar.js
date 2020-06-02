// pages/tabBar/tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selected: {
      type: String,
      value: 'dynamic'  // album | dynamic
    },
    newMsg: {
      type: Boolean,
      value: false      // true | false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(){
      // this.setData({
      //   selected: 'album'
      // })
      let pages = getCurrentPages()
      if (pages.length > 1){
        if (pages[pages.length - 2].route == 'pages/index/index'){
          //返回至首页
          wx.navigateBack({
            delta: 1,
          })
        }else{
          //跳转至首页
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }else{
        //跳转至首页
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    },
    changeTab2() {
      // this.setData({
      //   selected: 'dynamic'
      // })
      let pages = getCurrentPages()
      if (pages.length > 1) {
        if (pages[pages.length - 2].route == 'pages/dynamic/dynamic') {
          //返回至动态页
          wx.navigateBack({
            delta: 1,
          })
        } else {
          //跳转至动态页
          wx.navigateTo({
            url: '/pages/dynamic/dynamic',
          })
        }
      } else {
        //跳转至动态页
        wx.navigateTo({
          url: '/pages/dynamic/dynamic',
        })
      }
     
    },
  }
})
