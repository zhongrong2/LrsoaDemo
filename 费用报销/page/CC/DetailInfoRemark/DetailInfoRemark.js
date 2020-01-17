let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    id:'',
  },
  onLoad(options) {
    var Id = options.Id;
    this.setData({
      id:Id,
    })
  },
  //获取皮批注
  GetContent(e){
    this.setData({
      content:e.detail.value,
    })
  },
  // 确认
  Sure(){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var id=that.data.id,uid=that.data.userInfo.id,content=that.data.content;
    // console.log(id,uid,content);
    dd.httpRequest({
      url:URL+'/payapply/comment',
      method:'POST',
      data:{
        id:id,
        uid:uid,
        content:content,
      },
      dataType:'json',
      success(res){
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:1000,
          })
          var page = getCurrentPages();// 获取当前页面栈
          var beforePage = page[page.length - 3]; // 跳转页面的栈
          dd.navigateBack({
            delta: 3,
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          })
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:1000,
          });
        }
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:1000,
        });
      },
    })
  },
});
