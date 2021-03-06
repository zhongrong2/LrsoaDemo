let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    AccountListShow:false,//添加账户显示
    AccountUrl:[
      {Url:'/page/PayR/AccApipay/AccApipay'},
      {Url:'/page/PayR/AccPersonal/AccPersonal'},
      {Url:'/page/PayR/AccPublic/AccPublic'},
      {Url:'/page/PayR/AccCredit/AccCredit'},
    ],//选择添加账户列表
    delBtnWidth:140,
    page:1,//默认加载第一次
    limit:10,//每页条数
    Account:[],//账户列表
    hasOnshow:false,
    Payments:[
      {id:'2',name:'备用金',imgUrl:'../../../image/Payment1.png'},
      {id:'3',name:'借款',imgUrl:'../../../image/Payment2.png'},
      {id:'4',name:'银行卡',imgUrl:'../../../image/account_personal.png'},
      {id:'5',name:'公司信用卡',imgUrl:'../../../image/account-bank.png'},
    ],
  },
  onLoad() {
    this.setData({
      page:1,
      Account:[],
    })
    this.GetAccountList();
  },
  onShow(){
    var that = this;
    if(that.data.hasOnshow){
      that.setData({
        AccountListShow:false,//添加账户显示
        page:1,
        Account:[],
      })
      that.GetAccountList();
    }
    that.setData({
      hasOnshow:true,
    })
  },
  //获取账户列表
  GetAccountList(){
    const that = this; 
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var Page = that.data.page,uid=that.data.userInfo.id;
    dd.httpRequest({
      url:URL+'/payapply/accountList',
      method:'POST',
      data:{
        page:Page,
        limit:that.data.limit,
        uid:uid,
      },
      dataType:'json',
      success(res){
        if(res.data.code==0){
          // console.log(res.data);
          if(res.data.data == '' && that.data.Account != ''){
            dd.showToast({
              content:'没有更多数据！',
              duration:3000,
            })
          }
          var arr = that.data.Account//旧的数组
          for(var i = 0;i < res.data.data.length;i++){
            arr.push(res.data.data[i]);
          }
          that.setData({
            Account:arr,
          });
          Page++;
          that.setData({
            page:Page,
          });
        }
        else if(res.data.code==1){
          dd.showLoading({
            content: res.data.msg,
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
  //添加收款账户
  AddAccount(){
    const that = this;
    dd.httpRequest({
      url:URL+'/payapply/getAccount',
      method:'POST',
      dataType:'json',
      success(res){
        if(res.data.code == 0){
          dd.hideLoading();
          that.setData({
            AccountListShow:!that.data.AccountListShow,
            AccountList:res.data.data,
          })
        }
        else if(res.data.code==1){
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
  //选择添加的收款账户
  ChoseAccount(e){
    const index = e.currentTarget.dataset.index;
    dd.navigateTo({
      url:this.data.AccountUrl[index-1].Url
    })
  },
  // 删除收款账户
  DelAccount(e){
    var index = e.currentTarget.dataset.index;
    const that = this;
    dd.httpRequest({
      url:URL+'/payapply/delAccount',
      method:'POST',
      data:{
        id:index,
      },
      dataType:'json',
      success(res){
        if(res.data.code == 0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          });
          that.onShow();
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
          content:'删除失败',
          duration:3000,
        })
      }
    })
  },
  //选择收款账户
  ChoseAccountList(e){
    const account = e.currentTarget.dataset.account,id = e.currentTarget.dataset.index,name = e.currentTarget.dataset.name;
    // console.log(account,id,name);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if(id==2||id==3||id==4){
      prevPage.setData({
        account:account,
        accountId:id,
        accountName:'已付款/'+name,
      })
    }
    else{
      prevPage.setData({
        account:account,
        accountId:id,
        accountName:name,
      })
    }
    dd.navigateBack({delta:1});
  },
  //下拉加载数据
  onReachBottom(){
    this.GetAccountList();
  }
});
