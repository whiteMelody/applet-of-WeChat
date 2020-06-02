// pages/tabBar/tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selected: {
      type: Number,
      value: 0  // 0首页 | 1画图 | 2我的
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navs: {
      color: '#333333',
      selectedColor: '#f8e71c',
        list: [
          {
            pagePath: "pages/index/index",
            text: "首页",
            iconPath: "/image/icon-home.png",
            selectedIconPath: "/image/icon-home-on.png"
          },
          {
            pagePath: "pages/draw/draw",
            text: "画图",
            iconPath: "/image/icon-draw.png",
            selectedIconPath: "/image/icon-draw-on.png"
          },
          {
            pagePath: "pages/user/user",
            text: "我的",
            iconPath: "/image/icon-user.png",
            selectedIconPath: "/image/icon-user-on.png"
          }
        ]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    toPage(e){
      
      console.log(e)

      let _url = e.target.dataset.url || e.currentTarget.dataset.url

      console.log(_url)

      let pages = getCurrentPages()
      if (pages.length > 1) {
        if (pages[pages.length - 2].route == _url) {
          //返回
          wx.navigateBack({
            delta: 1,
          })
        } else {
          //跳转
          wx.navigateTo({
            url: '/' + _url,
          })
        }
      } else {
        //跳转
        wx.navigateTo({
          url: '/' + _url,
        })
      }
    },

  }
})
