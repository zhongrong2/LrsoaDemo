let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    showSelectSub:false,
    select:[],
    bankId:'',
    bankName:'',
    ProId:'',
    CityId:'',
    selectAddress:'',
    bankSubId:'',
    banSubName:'',
    type:3,
  },
  onLoad() {},
  //选择银行
  ChoseBank(){
    dd.navigateTo({
      url:'/page/PayR/ChoseBank/ChoseBank'
    })
  },
  //选择所在地区
  ChoseArea(){
    dd.navigateTo({
      url:'/page/PayR/ChoseArea/ChoseArea'
    })
  },
  //选择支行
  ChoseBankSub(){
    var that=this,bank=that.data.bankName,city=that.data.selectAddress,bankId=that.data.bankId,ProId=that.data.ProId,CityId=that.data.CityId;
    if(bank==''||bank==undefined){
      dd.showToast({
        content: '请选择银行',
        duration: 3000,
      });
      return false;
    }
    if(city==''||city==undefined){
      dd.showToast({
        content: '请选择所在地区',
        duration: 3000,
      });
      return false;
    }
    dd.navigateTo({
      url:'/page/PayR/ChoseBankSub/ChoseBankSub?bankId='+JSON.stringify(bankId)+'&ProId='+ProId+'&CityId='+CityId
    })
    return true;
  },
  //获取名称
  GetName(e){
    this.setData({
      name:e.detail.value,
    })
  },
  //获取账户
  GetAccount(e){
    this.setData({
      account:e.detail.value,
    })
  },
  //添加账户
  onSubmit(){
    const that = this,bank = that.data.bankName,area = that.data.selectAddress,sub_bank = that.data.banSubName,name = that.data.name,account = that.data.account;
    if(bank == '' || bank == undefined){
      dd.showToast({
        content:'请选择银行',
        duration:3000,
      });
      return false;
    }
    if(area == '' || area == undefined){
      dd.showToast({
        content:'请选择地区',
        duration:3000,
      });
      return false;
    }
    if(sub_bank == '' || sub_bank == undefined){
      dd.showToast({
        content:'请选择支行',
        duration:3000,
      });
      return false;
    }
    if(name == '' || name == undefined){
      dd.showToast({
        content:'请输入户主名称',
        duration:3000,
      })
      return false;
    }
    if(account == '' || account == undefined){
      dd.showToast({
        content:'请输入银行卡号',
        duration:3000,
      })
      return false;
    }
    dd.httpRequest({
      url:URL+'/payapply/createAccount',
      method:'POST',
      data:{
        type:that.data.type,
        bank:that.data.bankId,
        city:that.data.CityId,
        sub_bank:that.data.bankSubId,
        name:name,
        account:account,
      },
      success(res){
        // console.log(res);
        if(res.data.code == 0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          });
          dd.navigateBack();
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
          content:'添加失败',
          duration:3000,
        })
      }
    });
    return true;
  }
});
