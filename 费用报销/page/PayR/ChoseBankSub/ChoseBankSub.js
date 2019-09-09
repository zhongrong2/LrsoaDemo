let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    name:'',
    hasOnshow:false,
  },
  onLoad(options) {
    this.setData({
      bankId:JSON.parse(options.bankId),
      ProId:options.ProId,
      CityId:options.CityId,
    })
    this.GetBankSub();
  },
  onShow(){
    if(this.data.hasOnshow){
      this.GetBankSub();
    }
    this.setData({
      hasOnshow:true,
    })
  },
  //获取支行银行
  GetBankSub(){
    var that=this;
    var name = that.data.name;
    console.log(name);
    dd.httpRequest({
      url:URL+'/common/subBankList',
      method:'POST',
      data:{
        bank_id:that.data.bankId,
        province_id:that.data.ProId,
        city_id:that.data.CityId,
        name:that.data.name,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
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
  },
  //搜索支行银行
  Search(e){
    this.setData({
      name:e.detail.value,
    })
    this.GetBankSub();
  },
  //添加支行
  AddBank(){
    var that = this;
    var bankId=that.data.bankId,ProId=that.data.ProId,CityId=that.data.CityId;
    dd.navigateTo({
      url:'/page/PayR/AddBankSub/AddBankSub?bankId='+bankId+'&ProId='+ProId+'&CityId='+CityId
    })
  },
  //返回该页面刷新页面
  changeData(){
    this.setData({
      name:'',
    });
    this.GetBankSub();
  }
});
