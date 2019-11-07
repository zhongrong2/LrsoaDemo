let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    List:[],
  },
  onLoad() {
    this.GetBillType();
  },
  //获取付款类型
  GetBillType(){
    var that = this;
    dd.httpRequest({
      url:URL+'/payapply/getBillType',
      method:'POST',
      dataType:'json',
      success(res){
        console.log(res)
        if(res.data.code==0){
          dd.hideLoading();
          that.setData({
            List:res.data.data
          })
        }
        else if(res.data.code){
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          });
        }
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        });
      }
    })
  },
  //选择付款类型
  ChoseType(e){
    const index = e.currentTarget.dataset.index,title = e.currentTarget.dataset.title;
    // console.log(index);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      BillTypeId:index,
      BillType:title,
    })
    dd.navigateBack({delta:1});
  },
});
