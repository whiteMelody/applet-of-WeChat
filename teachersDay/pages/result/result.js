// pages/result/result.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    teather: '',
    content: '',
    minHeight: 0,
    minWidth: 0,
    ratio: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    wx.getSystemInfo({
      success: (res) => {

        this.setData({
          minWidth: res.windowWidth,
          minHeight: res.windowHeight,
        })

        let content = ''

        let title = ''

        let best = options.best ? options.best : '班主任'

        if (app.isNull) {
          best = '班主任'
        }

        let rd = this.random_num(1, 3)  // => 1,2,3

        if (options.res == 'smart') {
          title = '超级学霸'
          if (rd == 1) {
            content = '老师一直为你有很强的学习积极性和班级荣誉感而高兴。希望你能再接再励，争取更好的成绩。'
          } else if (rd == 2) {
            content = '该生在校关心同学，本学期学业成绩有很大提高，望今后再接再励争取更好的成绩。'
          } else if (rd == 3) {
            content = '作为班主任我理解你也感谢你，在班里也能起到先锋模范作用，坚强点，你会做得更好！'
          }
        } else if (options.res == 'poor') {
          title = '操碎了心'
          if (rd == 1) {
            content = '老师认为你是位头脑灵活的学生，然而没把你的聪明用在好的地方，用自己的行动来表明你的决心！'
          } else if (rd == 2) {
            content = '你的脑子不错，可是你的勤奋度大约只有六七成，假如你利用好早晚自修及平时时间，更耐心一些。'
          } else if (rd == 3) {
            content = '有时分辨不出写了些什么字，虽然你的缺点很多，但只要你能改掉这些缺点，依然还是个好学生。'
          }
        } else if (options.res == 'art') {
          title = '文艺青年'
          if (rd == 1) {
            content = '不要计较老师总批评你，其实老师是喜欢你的，喜欢你聪明，对老师、同学热情。'
          } else if (rd == 2) {
            content = '老师赞赏你胆大、乐观，又很关心集体；能歌善舞，字也写得很好，可谓多才多艺。'
          } else if (rd == 3) {
            content = '如果能把这种态度用到课堂上，那么所有的同学包括老师一定会对你另眼相看，那时的你一定是很优秀的。'
          }
        } else if (options.res == 'temperament') {
          title = '才貌双全'
          if (rd == 1) {
            content = '课堂上很高兴听到你那清脆悦耳的回答声，作业认真完成，书写端正，学习成绩优异，是个品学兼优的学生。'
          } else if (rd == 2) {
            content = '该生聪慧、文静、热心助人。人有一定的主见，敢于发表自己的见解。多加努力，争创隹绩！'
          } else if (rd == 3) {
            content = '这次有的科目发挥不正常，不过没有关系，成绩不代表一切。希望假期时能认真总结，补缺补漏。'
          }
        } else if (options.res == 'sports') {
          title = '运动王者'
          if (rd == 1) {
            content = '老师希望你在假期好好思考，为什么自己就不能在各个方面都表现的非常好？好好努力吧！'
          } else if (rd == 2) {
            content = '你活泼好动，很顽皮，爱说话。有时上课不够留心。当然你也有你的优点如：在田径赛上，为班级争得荣誉。'
          } else if (rd == 3) {
            content = '你尊敬师长又有很强的集体感，在参加学校组织的各项活动中为班级争得了荣誉。'
          }
        }



        const ctx = wx.createCanvasContext('myCanvas')

        let ratio = res.windowWidth / 750;

        this.setData({
          ratio: ratio,
          title: title,
          teather: best,
          content: content
        })


        // drawBg
        ctx.drawImage('/images/resultBg.png', 0, 0, 650 * ratio, 754 * ratio);

        //drawCode
        ctx.drawImage('/images/code.jpg', 50 * ratio, 480 * ratio, 250 * ratio, 250 * ratio);

        //drawTitle
        ctx.drawImage('/images/titleBg.png', 167 * ratio, 200 * ratio, 316 * ratio, 113 * ratio);

        ctx.setFontSize(18)
        ctx.setFillStyle('#973922')
        ctx.fillText(title, 240 * ratio, 270 * ratio)

        var text = content
        var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        ctx.setFontSize(14)
        ctx.setFillStyle("#ffffff")
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 550 * ratio) {
            temp += chr[a];
          }
          else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);

        //如果数组长度大于3 则截取前两个
        // if (row.length > 4) {
        //   var rowCut = row.slice(0, 4);
        //   var rowPart = rowCut[3];
        //   var test = "";
        //   var empty = [];
        //   for (var a = 0; a < rowPart.length; a++) {
        //     if (ctx.measureText(test).width < 220) {
        //       test += rowPart[a];
        //     }
        //     else {
        //       break;
        //     }
        //   }
        //   empty.push(test);
        //   var group = empty[0] + "..."//这里只显示两行，超出的用...表示
        //   rowCut.splice(1, 3, group);
        //   row = rowCut;
        // }
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], 20, 350 * ratio + b * 20, 300);
        }


        ctx.setFontSize(14)
        //绘制老师的话
        ctx.fillText('——' + best + '老师', 400 * ratio, 380 * ratio + b * 20)

        ctx.fillText('扫描左侧二维码', 340 * ratio, 650 * ratio)
        ctx.fillText('测试你的形象吧', 340 * ratio, 700 * ratio)

        ctx.stroke()

        ctx.draw()

      },
    })

    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  
  },

  /**
     * 随机数 传数字区间
     * @param smin		最小值
     * @param smax		最大值
     * @returns {*}	随机值
     */
  random_num(smin, smax) {
    const Range = smax - smin;
    const Rand = Math.random();
    return smin + Math.round(Rand * Range);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  
  },

  saveImg(){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 650 * this.data.ratio,
      height: 754 * this.data.ratio,
      destWidth: 650 * this.data.ratio,
      destHeight: 754 * this.data.ratio,
      canvasId: 'myCanvas',
      success: (res) => {

        console.log(res);

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res2) => {
            wx.showToast({
              title: '已保存至相册',
              icon: 'success',
              duration: 2000
            })
            console.log(res2);
          },
          fail: (res2) => {
            console.log(res2);
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    return {
      title: '快来测测你在老师眼里的形象，超准',
      path: '/pages/index/index'
    }
  },

})