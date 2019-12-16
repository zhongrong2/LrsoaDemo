let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    Id:'',//订单id
    Info:'',//订单详情
  },
  onLoad(options) {
    this.setData({
      Id:options.ID,
    })
    this.GetInfo();
  },
  //获取订单详情
  GetInfo(){
    var that = this;
    var Id=this.data.Id;
    // console.log(Id);
    dd.httpRequest({
      url:URL+'/complain/consumerComplainDetail',
      method:'POST',
      data:{
        id:Id,
      },
      dataType:'json',
      success(res){
        dd.hideLoading();
        console.log(res.data);
        if(res.data.code==0){
          that.setData({
            Info:res.data.data
          })
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          })
        }
      },
      fail(err){
        console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      },
    })
  }
});
