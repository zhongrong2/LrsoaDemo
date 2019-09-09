let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    name:'',
    hasOnshow:false
  },
  onLoad() {
    this.GetBank();
  },
  //获取银行
  GetBank(){
    var that=this;
    dd.httpRequest({
      url:URL+'/common/bankList',
      method:'POST',
      dataType:'json',
      data:{
        name:that.data.name,
      },
      success(res){
        // console.log(res)
        if(res.data.code==0){
          dd.hideLoading();
          that.setData({
            bankList:res.data.data
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
        console.log(err)
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
  //选择银行
  ChoseBank(e){
    var id=e.currentTarget.dataset.id,name=e.currentTarget.dataset.name;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      bankId:id,
      bankName:name,
    })
    dd.navigateBack({delta:1});
  },
  //搜索银行
  Search(e){
    this.setData({
      name:e.detail.value,
    })
    this.GetBank();
  },
  //添加银行
  AddBank(){
    dd.navigateTo({
      url:'/page/PayR/AddBank/AddBank'
    })
  },
  //返回该页面刷新页面
  changeData(){
    this.setData({
      name:'',
    });
    this.GetBank();
  }
});
