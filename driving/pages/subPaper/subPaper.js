
let [isMoveing, startX, endX] = [false, 0, 0];

var app = getApp();

Page({

    data: {
        title: '老司机',
        color: 'blue',
        userName: '游客学员',
        userIcon: '../../image/user-head.png',
        testType: '小车',
        testSub: '科目一',
        testPoint: 100,
        testAddress: '驾考题库',
        time: 0,
        testId: 0,
        subject: '',
        model: '',
        number: ''
    },

    onLoad: function (options) {

        let _this = this;

        if (options.subject) {

            _this.setData({
                'subject': options.subject,
            });
        }

        if (options.model) {

            _this.setData({
                'model': options.model,
            });
        }

        if (options.number) {

            _this.setData({
                'number': options.number,
            });
        }

        app.getRandScore(options.number, function (_res) {

            var res = _res.data.data;

            let [subject, model, temp1, temp2, color] = [res.subject, res.lisence];

            res.score = Number.parseInt(res.score);

            if (subject == 1) {
                temp1 = '科目一';
            } else {
                temp1 = '科目四';
            }

            if (model == 'a1' || model == 'a2') {
                temp2 = '客车';
            }
            if (model == 'b1' || model == 'b2') {
                temp2 = '火车';
            }
            if (model == 'c1' || model == 'c2') {
                temp2 = '小车';
            }

            if (res.score < 60) {
                color = 'Fred';
            }

            if (res.score >= 60 && res.score < 80) {
                color = 'Fblue';
            }
            if (res.score >= 80) {
                color = 'Fgreen';
            }

            _this.setData({
                'time': res.time,
                'testType': temp2,
                'testSub': temp1,
                'testPoint': res.score,
                'title': res.des,
                'color': color,
                'number': options.number,
                'userIcon': app.globalData.userInfo.avatarUrl || '../../image/user-head.png',
                'userName': app.globalData.userInfo.nickName || "游客学员",
            });

        })

    },
    reTest: function () {

        let _this = this;

        app.reExam(_this.data.number, function (res) {

            wx.redirectTo({
                url: '../randList/randList?id=0&subject=' + _this.data.subject + '&model=' + _this.data.model + '&test=true&study=false&number=' + res.data.data
            })
        })

    },

    viewError: function () {
        //查询当前考试的错题
        let _this = this;

        wx.redirectTo({
            url: '../showTest/showTest?number=' + _this.data.number + '&type=error'
        })

    },

    viewPaper: function () {
        //查询当前考试的记录
        let _this = this;

        wx.redirectTo({
            url: '../showTest/showTest?number=' + _this.data.number
        })

    }

})
