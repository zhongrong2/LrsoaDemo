let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    navItem:{
      nav:[
        {title:'客户投诉',count:'',status:1},
        {title:'员工反馈',count:'',status:2},
      ],
      navIndex:'0',
    },//nav
    dataList:[
      {station:'十八里店加油站',time:'2019-6-12  19:59',com:'加油站',state:'未处理',des:'我今天加油，加油员让我另交费，我明明有余额的！',comType:'投诉'},
      {station:'十八里店加油站',time:'2019-6-12  19:59',com:'加油站',state:'已处理',des:'我今天加油，加油员让我另交费，我明明有余额的！…刚想起来！',comType:'建议'},
      {station:'十八里店加油站',time:'2019-6-12  19:59',com:'加油站',state:'已处理',des:'我今天加油，加油员让我另交费，我明明有余额的！…刚想起来！',comType:'建议'},
      {station:'十八里店加油站',time:'2019-6-12  19:59',com:'加油站',state:'已处理',des:'我今天加油，加油员让我另交费，我明明有余额的！…刚想起来！',comType:'建议'},
      {station:'十八里店加油站',time:'2019-6-12  19:59',com:'加油站',state:'未处理',des:'我今天加油，加油员让我另交费，我明明有余额的！…刚想起来！…我今天加油，加油员让我另交费，我明明有余额的！…刚想起来！…我今天加油，加油员让我另交费，我明明有余额的！…刚想起来',comType:'投诉'},
    ],//数据列表
  },
  onLoad() {},
  // 选择状态导航栏
  NavTap(e){
    const that = this;
    app.NavTap(e,that);//调用公共选择状态栏方法
    const Index = e.currentTarget.dataset.index;
    const status = that.data.navItem.nav[Index].status;
    // that.setData({
    //   dataList:[],
    // })
    console.log(Index,status,that.data.navItem.navIndex);
  },
});
