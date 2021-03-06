let app = getApp();
let URL = app.globalData.http;


Page({
  onLoad(query) {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.onLoad();
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'page/index/index',
    };
  },
  data:{
    grid:{
      arr:[
        {
          icon:'/image/index_PR.png',
          title:'采购申请',
          path:'',
        },
        {
          icon:'/image/index_PayR.png',
          title:'付款申请',
          path:'/page/PayR/PayR',
        },
        {
          icon:'/image/index_AR.png',
          title:'报销申请',
          path:'',
        },
        {
          icon:'/image/index_BR.png',
          title:'借款申请',
          path:'',
        },
        {
          icon:'/image/index_Payroll.png',
          title:'工资发放',
          path:''
        },
        {
          icon:'/image/index_Complain.png',
          title:'投诉管理',
          path:'/page/complain/compOrder/compOrder'
        },
      ],
    },
  },
  GridItem(e){
    var index = e.currentTarget.dataset.index;
    if(index == "1"||index == "5"){
      var URL = this.data.grid.arr[index].path;
      // console.log(URL);
      dd.navigateTo({
        url:URL
      })
    }
  },
  //清理缓存
  ClearStorage(){
    dd.removeStorage({
      key: 'uid',
      success: function(){
        dd.alert({content: '清理成功,请退出重新进入',buttonText: '确定'});
      }
    });
  }
});
