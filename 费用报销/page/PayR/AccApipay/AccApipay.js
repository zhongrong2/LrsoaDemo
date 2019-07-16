let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    type:'1',
    name:'',
    account:'',
  },
  onLoad() {},
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
    var name=that.data.name,account=that.data.account,uid=that.data.userInfo.id;
    if(name == '' || name == undefined){
      dd.showToast({
        content:'请输入账户名称',
        duration:3000,
      });
      return false;
    }
    if(account == '' || account == undefined){
      dd.showToast({
        content:'请输入账户账户',
        duration:3000,
      })
      return false;
    }
    dd.httpRequest({
      url:URL+'/payapply/createAccount',
      method:'POST',
      data:{
        type:that.data.type,
        name:name,
        account:account,
        uid:uid,
      },
      success(res){
        // console.log(res)
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
