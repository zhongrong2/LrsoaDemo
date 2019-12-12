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
    dataList:[],//数据列表
    ShowConsComp:'',//是否显示客户投诉
  },
  onLoad() {
    this.ShowConsumerComplain();
  },
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
  //选择筛选条件
  ChoseScreen(){
    dd.navigateTo({
      url:'/page/complain/screen/screen'
    })
  },
  //是否显示客户投诉
  ShowConsumerComplain(){
    var that = this;
    var id = app.globalData.userInfo.id;
    dd.httpRequest({
      url:URL+'/complain/showConsumerComplain',
      method:'POST',
      data:{
        uid:id,
      },
      dataType:'json',
      success(res){
        if(res.data.code==0){
          that.setData({
            // ShowConsComp:res.data.data.show,
            ShowConsComp:true,
          })
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          })
        }
      },
      fail(){
        console.log(res);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
      },
    })
  },
});
