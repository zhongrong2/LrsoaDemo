let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    BankName:'',
  },
  onLoad() {},
  //获取名称
  GetName(e){
    this.setData({
      BankName:e.detail.value,
    })
  },
  //添加支行
  onSubmit(){
    var that = this;
    var BankName=that.data.BankName;
    console.log(BankName);
    if(BankName==undefined||BankName==''){
      dd.showToast({
        content:'请输入银行',
        duration:3000,
      });
      return;
    }
    dd.httpRequest({
      url:URL+'/common/addBank',
      method:'POST',
      data:{
        bank_name:BankName,
      },
      success(res){
        // console.log(res);
        if(res.data.code == 0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          });
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 2];
          beforePage.changeData();
          dd.navigateBack({delta:1});
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
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
      }
    })
  }
});
