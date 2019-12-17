let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    Id:'',//订单id
    Info:'',//订单详情
    uid:'',//用户id
  },
  onLoad(options) {
    // console.log(options);
    //选择指派人完成
    if(options==undefined){
      this.GetInfo();
      return;
    }
    this.setData({
      Id:options.ID,
    })
    var that = this;
    if(options.noinfor==1){
      var uid = app.globalData.userInfo.id;
      that.setData({
        uid:uid,
      })
      this.GetInfo();
      this.Read();
    }
    //从通知跳转
    else{
      dd.getStorage({
        key:'uid',
        success(res){
          var uid = res.data.uid;
          console.log(uid);
          that.setData({
            uid:uid,
          });
          that.GetInfo();
          that.Read();
        },
        fail(err){
          dd.showToast({
            content:'网络出错',
            duration:3000,
          })
        }
      })
    }
  },
  //获取订单详情
  GetInfo(){
    var that = this;
    var uid=this.data.uid;
    var Id=this.data.Id;
    // console.log(uid,Id);
    dd.httpRequest({
      url:URL+'/complain/employeeComplainDetail',
      method:'POST',
      data:{
        uid:uid,
        id:Id,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.code==0){
          that.setData({
            Info:res.data.data
          })
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
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      },
    })
  },
  //跳转指派处理人
  ChoseDealPeople(){
    var Id=this.data.Id;
    dd.navigateTo({
      url:'/page/complain/compOrder/ChoseDealPeople/ChoseDealPeople?ID='+Id,
    })
  },
  //订单详情已读
  Read(){
    var uid = app.globalData.userInfo.id;
    var Id=this.data.Id;
    dd.httpRequest({
      url:URL+'/complain/read',
      method:'POST',
      data:{
        uid:uid,
        id:Id,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.code==0){
          
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
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
  // 预览图片
  previewImage(e){
    const index = e.currentTarget.dataset.index;
    const Imgs = this.data.Info.pic;
    dd.previewImage({
      current:index,
      urls:Imgs,
    })
  },
});
