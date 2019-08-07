let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    bankId:'',//银行id
    bankName:'',//银行名称
    type:'4',//账户类型
    name:'',//账户名称
    account:'',//账户卡号
  },
  onLoad() {},
  //选择银行
  ChoseBank(){
    dd.navigateTo({
      url:'/page/PayR/ChoseBank/ChoseBank'
    })
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
    const that = this;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var bank=that.data.bankName,name=that.data.name,account=that.data.account,uid=that.data.userInfo.id;
    if(bank == '' || bank == undefined){
      dd.showToast({
        content:'请选择银行',
        duration:3000,
      });
      return false;
    }
    if(name == '' || name == undefined){
      dd.showToast({
        content:'请输入账户名称',
        duration:3000,
      });
      return false;
    }
    if(account == '' || account == undefined){
      dd.showToast({
        content:'请输入账户账号',
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
        name:name,
        account:account,
        uid:uid,
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
