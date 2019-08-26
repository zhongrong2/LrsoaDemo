let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    BankSubName:''
  },
  onLoad(options) {
    this.setData({
      bankId:options.bankId,
      ProId:options.ProId,
      CityId:options.CityId,
    })
    console.log(this.data.bankId,this.data.ProId,this.data.CityId);
  },
  //获取支行名称
  GetName(e){
    this.setData({
      BankSubName:e.detail.value,
    })
  },
  //添加支行
  onSubmit(){
    var that = this;
    var bankId=that.data.bankId,ProId=that.data.ProId,CityId=that.data.CityId,BankSubName=that.data.BankSubName;
    console.log(bankId,ProId,CityId,BankSubName);
    if(BankSubName==undefined||BankSubName==''){
      dd.showToast({
        content:'请输入银行支行',
        duration:3000,
      });
      return;
    }
    dd.httpRequest({
      url:URL+'/common/addSubBank',
      method:'POST',
      data:{
        bank_id:bankId,
        province_id:ProId,
        city_id:CityId,
        sub_bank:BankSubName,
      },
      success(res){
        // console.log(res);
        if(res.data.code == 0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          });
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