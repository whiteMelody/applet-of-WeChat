// pages/loader/loader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideLoader(){
      setTimeout(()=>{
        this.setData({
          show: false
        })
      }, 1000)
    },
    showLoader(){
      this.setData({
        show: true
      })
    }
  }
})
