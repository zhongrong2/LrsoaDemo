let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    AccountListShow:false,//添加账户显示
    AccountUrl:[
      {Url:'/page/PayR/AccApipay/AccApipay'},
      {Url:'/page/PayR/AccPersonal/AccPersonal'},
      {Url:'/page/PayR/AccPublic/AccPublic'},
    ],//选择添加账户列表
    delBtnWidth:140,
    page:1,//默认加载第一次
    limit:10,//每页条数
    Account:[],//账户列表
    hasOnshow:false,
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
    var Page = that.data.page;
    dd.httpRequest({
      url:URL+'/payapply/accountList',
      method:'POST',
      data:{
        page:Page,
        limit:that.data.limit,
      },
      dataType:'json',
      success(res){
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
        dd.hideLoading();
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
          that.setData({
            AccountListShow:!that.data.AccountListShow,
            AccountList:res.data.data,
          })
        }
      },
      fail(err){
        console.log(err);
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
        console.log(err)
      }
    })
  },
  //选择收款账户
  ChoseAccountList(e){
    const account = e.currentTarget.dataset.account;
    const id = e.currentTarget.dataset.index;
    // console.log(account,id);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      account:account,
      accountId:id,
    })
    dd.navigateBack({delta:1});
  },
  //下拉加载数据
  onReachBottom(){
    this.GetAccountList();
  }
});
