// pages/subject/subject.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minHeight: 0,
    minWidth: 0,

    curIndex: 0,

    userInfo: {
      result: {
        poor: 0,
        smart: 0,
        art: 0,
        temperament: 0,
        sports: 0,
      }
    },

    questions: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    wx.getSystemInfo({
      success: (res)=> {

        //随机选择6道题

        let arr = this.randomSix()

        this.setData({
          minWidth: res.windowWidth,
          minHeight: res.windowHeight,
        })

      },
    })



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

  randomSix(_oldArr){
    let _arr = []
    
    let rd = this.random_num(0, 12)

    if (_oldArr){

      _arr = _oldArr
      
      //判断重复
      let _flag = true

      for (let i = 0; i < _arr.length; i++){
        if (_arr[i] == rd){
          _flag = false
          break
        }
      }

      if (_flag)
        _arr.push(rd)

    }else{
      _arr.push(rd)
    }

    if (_arr.length == 6){

      //生成题目


      let questions = [
        //题目1
        {
          id: 1,
          title: '以下位置你会选择',
          titleImg: app.globalData.sourceUrl + '/images/seat.jpg',
          imgWidth: '517rpx',
          imgHeight: '527rpx',
          // small: true,
          list: [
            {
              index: 1,
              content: '左右护法',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '学霸区',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 3,
              content: 'VIP休息',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 4,
              content: 'VIP娱乐',
              result: {
                poor: 0,
                smart: 0,
                art: 3,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 5,
              content: '高级阳光SPA专区',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 6,
              content: '高级避暑VIP专区',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            },
          ],
        },
        //题目2
        {
          id: 2,
          title: '以下图中的内容是？',
          titleImg: app.globalData.sourceUrl + '/images/runtu.jpg',
          imgWidth: '577rpx',
          imgHeight: '344rpx',
          list: [
            {
              index: 1,
              content: '《少年闰土》（节选至《故乡》）',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '哪吒',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 3,
              content: '不认识',
              result: {
                poor: 3,
                smart: 0,
                art: 0,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 4,
              content: '“今晚月色真美”',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            }
          ],
        },
        //题目3
        {
          id: 3,
          title: '下面哪个操作不会让你窒息',
          // small: true,
          list: [
            {
              index: 1,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/img1.jpg',
              imgWidth: '500rpx',
              imgHeight: '236rpx',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/img2.jpg',
              imgWidth: '500rpx',
              imgHeight: '236rpx',
              result: {
                poor: 3,
                smart: 0,
                art: 0,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 3,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/img3.jpg',
              imgWidth: '500rpx',
              imgHeight: '236rpx',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 4,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/img4.jpg',
              imgWidth: '500rpx',
              imgHeight: '236rpx',
              result: {
                poor: 3,
                smart: 0,
                art: 1,
                temperament: 0,
                sports: 1,
              },
            },

          ],
        },
        //题目4
        {
          id: 4,
          title: '以下化学式正确的是',
          list: [
            {
              index: 1,
              content: 'Ba+2Na=banana',
              result: {
                poor: 3,
                smart: 0,
                art: 1,
                temperament: 1,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '2Hf+2Fe+Co=Coffee+2HF',
              result: {
                poor: 2,
                smart: 0,
                art: 3,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 3,
              content: '2Te+2Ca+H2=2Cat+2He',
              result: {
                poor: 2,
                smart: 0,
                art: 0,
                temperament: 3,
                sports: 1,
              },
            },
            {
              index: 4,
              content: '(SCN)2+H2O = HSCN+HSCNO',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            }
          ],
        },
        //题目5
        {
          id: 5,
          title: '选出你最喜欢的一段音频(点击播放按钮试听)',
          small: true,
          voiceList: [app.globalData.sourceUrl + '/voices/voice1.mp3', app.globalData.sourceUrl + '/voices/voice2.mp3', app.globalData.sourceUrl + '/voices/voice3.mp3', app.globalData.sourceUrl + '/voices/voice4.mp3'],
          list: [
            {
              index: 1,
              content: '1',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '2',
              result: {
                poor: 0,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 5,
              },
            },
            {
              index: 3,
              content: '3',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 4,
              content: '4',
              result: {
                poor: 1,
                smart: 0,
                art: 2,
                temperament: 2,
                sports: 0,
              },
            }
          ],
        },
        //题目6
        {
          id: 6,
          title: '老师大部分说法都是正确的，不过也有错的时候，下面哪个说法是错误的？',
          list: [
            {
              index: 1,
              content: '整个年级就我们班级声音最大，隔两层楼都能听见！',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '今天体育老师有点事，我来帮忙上下这节课',
              result: {
                poor: 0,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 5,
              },
            },
            {
              index: 3,
              content: '这次考试，居然还有人没上平均分!	',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 4,
              content: '很负责任的讲，你们是我带过最差的一届学生',
              result: {
                poor: 0,
                smart: 0,
                art: 0,
                temperament: 5,
                sports: 0,
              },
            }
          ],
        },
        //题目7
        {
          id: 7,
          title: '面对两面成90°夹角的镜子，哪个选项才是小丑看到的镜中的镜象',
          titleImg: app.globalData.sourceUrl + '/images/xiaochou.png',
          imgWidth: '463rpx',
          imgHeight: '282rpx',
          small: true,
          list: [
            {
              index: 1,
              content: 'A',
              result: {
                poor: 1,
                smart: 0,
                art: 3,
                temperament: 2,
                sports: 0,
              },
            },
            {
              index: 2,
              content: 'B',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 3,
              content: 'C',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 4,
              content: 'D',
              result: {
                poor: 0,
                smart: 0,
                art: 2,
                temperament: 3,
                sports: 0,
              },
            }
          ],
        },
        //题目8
        {
          id: 8,
          title: '下面哪个文言文翻译是错误的',
          list: [
            {
              index: 1,
              content: '玉树临风美少年，揽镜自顾夜不眠。 译：每天被自己帅到睡不着',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '纸上千言俱无用，不如腰下硬邦邦。 译：道理我都懂，然而并没有什么卵用',
              result: {
                poor: 0,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 5,
              },
            },
            {
              index: 3,
              content: '君莫欺我不识字，人间安得有此事。 译：我读书少你不要骗我	',
              result: {
                poor: 0,
                smart: 0,
                art: 0,
                temperament: 5,
                sports: 0,
              },
            },
            {
              index: 4,
              content: '腰中雄剑长三尺，君家严慈知不知。 译：你这么牛，家里人知道么	',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 5,
              content: '潦水尽而寒潭清，烟光凝而暮山紫。 译：积水消尽，潭水清澈，天空凝结着淡淡的云烟，暮霭中山峦呈现一片紫色。	',
              result: {
                poor: 0,
                smart: 5,
                art: 2,
                temperament: 3,
                sports: 0,
              },
            }

          ],
        },
        //题目9
        {
          id: 9,
          title: '如果老师掉水里了，从你专业的角度讲怎么办？',
          list: [
            {
              index: 1,
              content: '计算求出老师心里阴影面积，然后计算老师浮力与重力，证明浮力<重力后，拨打119',
              result: {
                poor: 0,
                smart: 2,
                art: 1,
                temperament: 0,
                sports: 2,
              },
            },
            {
              index: 2,
              content: '利用我雄厚的计算机知识，绘制出老师在水中运动的轨迹，判断下一分钟老师所在位置，最后去水底救老师',
              result: {
                poor: 0,
                smart: 2,
                art: 0,
                temperament: 0,
                sports: 3,
              },
            },
            {
              index: 3,
              content: '先了解老师是否购买意外保险，若为购买，先帮老师购买保险后实施营救',
              result: {
                poor: 2,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 3,
              },
            },
            {
              index: 4,
              content: '拍照分享朋友圈，聊天群，寻找能游泳的爱人人士，然后找警察叔叔帮忙',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            },
          ],
        },
        //题目10
        {
          id: 10,
          title: '以下物品你最喜欢',
          small: true,
          list: [
            {
              index: 1,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods1.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 0,
                smart: 0,
                art: 5,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods2.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 0,
                smart: 5,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 3,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods3.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 0,
                smart: 0,
                art: 0,
                temperament: 5,
                sports: 0,
              },
            },
            {
              index: 4,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods4.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 5,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods5.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 0,
                smart: 2,
                art: 3,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 6,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods6.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 0,
                smart: 2,
                art: 0,
                temperament: 3,
                sports: 0,
              },
            },
            {
              index: 7,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods7.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 0,
                smart: 2,
                art: 0,
                temperament: 0,
                sports: 3,
              },
            },
            {
              index: 8,
              content: '',
              contentImg: app.globalData.sourceUrl + '/images/goods8.jpg',
              imgWidth: '220rpx',
              imgHeight: '220rpx',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },

          ],
        },
        //题目11
        {
          id: 11,
          title: '以下哪句话是老师说得最多的？',
          list: [
            {
              index: 1,
              content: '“别以为我不知道你们在下面做什么”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 2,
              content: '“睡觉的那位同学，请你来回答一下这个问题…”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 3,
              content: '“是我讲还是你讲？你要讲就到上面来讲，我让你。”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 4,
              content: '“这道题我讲100遍了！”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 5,
              content: '“考上大学你们就轻松了，想干嘛干嘛。”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 6,
              content: '“你们一人浪费一分钟，一节课就过去了。”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 7,
              content: '“我就讲最后一分钟。”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
          ],
        },
        //题目12
        {
          id: 12,
          title: '以下哪句话是你对同桌说得最多的？',
          list: [
            {
              index: 1,
              content: '“老师来了叫我一声!”',
              result: {
                poor: 5,
                smart: 0,
                art: 0,
                temperament: 0,
                sports: 0,
              },
            },
            {
              index: 2,
              content: '“笔借我用下。”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 3,
              content: '“下一节什么课啊?”“还有几分钟下课啊?”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 4,
              content: '“别说话，老师在后面! ”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 5,
              content: '“帮我传给XXX”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 6,
              content: '“哎.那个XX字怎么写? ”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
            {
              index: 7,
              content: '“饿死了，有什么吃的吗”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
            },
          ],
        },
        //题目13
        {
          id: 13,
          title: '以下最符合你老师形象的是',
          list: [
            {
              index: 1,
              content: '不用任何工具在黑板上画世界地图',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '地理'
            },
            {
              index: 2,
              content: '“数学不用死记硬背，但要举一反三”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '数学'
            },
            {
              index: 3,
              content: '不用任何工具在黑板上写出如机打一般的文章',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '语文'
            },
            {
              index: 4,
              content: '“语言的实际运用，即学会在生活中与人的沟通交流。”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '英语'
            },
            {
              index: 5,
              content: '“别在厕所待太久，会氨气中毒的”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '化学'
            },
            {
              index: 6,
              content: '“上课风都吹得倒，下课狗都撵不到”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '体育'
            },
            {
              index: 7,
              content: '“我觉得牛顿就是被你们气死的”',
              result: {
                poor: 1,
                smart: 1,
                art: 1,
                temperament: 1,
                sports: 1,
              },
              best: '物理'
            },
          ],
        },
      ];

      let quesArr = []

      for (let i = 0; i < _arr.length; i++){
        quesArr.push(questions[_arr[i]])
      }

      console.log(quesArr)

      this.setData({
        questions: quesArr
      })

      return _arr
    }else{
      this.randomSix(_arr)
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
    // //获取题目
    // wx.request({
    //   method: "post",
    //   url: app.globalData.requestUrl + '?s=App.Teacher_Common.GetQuestion',
    //   data: {},
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {

    //     if (res.data.ret == 200) {

    //       console.log(res.data.data)

    //     }


    //   }
    // })

  },

  select(e){

    //关闭音乐
    wx.createAudioContext('myAudio1').pause()
    wx.createAudioContext('myAudio2').pause()
    wx.createAudioContext('myAudio3').pause()
    wx.createAudioContext('myAudio4').pause()

    let _item = e.currentTarget.dataset.item

    let _user = this.data.userInfo

    _user.result.poor += _item.result.poor
    _user.result.smart += _item.result.smart
    _user.result.art += _item.result.art
    _user.result.temperament += _item.result.temperament
    _user.result.sports += _item.result.sports

    if (this.data.curIndex == 5){

      let _max = [_user.result.poor, _user.result.smart, _user.result.art, _user.result.temperament, _user.result.sports].sort()[0]

      let res = 'poor'

      if (_max == _user.result.poor){
        res = 'poor'
      } else if (_max == _user.result.smart) {
        res = 'smart'
      } else if (_max == _user.result.art) {
        res = 'art'
      } else if (_max == _user.result.temperament) {
        res = 'temperament'
      } else if (_max == _user.result.sports) {
        res = 'sports'
      }

      //前往结果页
      wx.navigateTo({
        url: '/pages/result/result?best=' + _item.best + '&res=' + res,
      })


    }else{
      this.setData({
        userInfo: _user,
        curIndex: this.data.curIndex + 1
      })

    }

  },
 
 
})