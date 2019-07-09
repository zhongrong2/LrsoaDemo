let app = getApp();
let URL = app.globalData.http;

Page({
  data: {},
  onLoad(options) {
    this.setData({
      bankId:JSON.parse(options.bankId),
      ProId:options.ProId,
      CityId:options.CityId,
    })
    this.GetBankSub();
  },
  //获取支行银行
  GetBankSub(){
    var that=this;
    dd.httpRequest({
      url:URL+'/common/subBankList',
      method:'POST',
      data:{
        bank_id:that.data.bankId,
        province_id:that.data.ProId,
        city_id:that.data.CityId,
      },
      dataType:'json',
      success(res){
        console.log(res.data);
        dd.hideLoading();
        if(res.data.code == 0){
          dd.hideLoading();
          that.setData({
            bankList:res.data.data,
          });
        }
        else{
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
        }
      },
      fail(err){
        console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
  //选择支行银行
  ChoseBankSub(e){
    var id=e.currentTarget.dataset.id,name=e.currentTarget.dataset.name;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      bankSubId:id,
      banSubName:name,
    })
    dd.navigateBack({delta:1});
  }
});
