let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    Id:'',//订单id
    Info:'',//订单详情
    uid:'',//用户id
    result:'',//处理结果
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
            duration:1000,
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
            duration:1000,
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
            duration:1000,
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
  //获取处理结果
  GetResult(e){
    this.setData({
      result:e.detail.value,
    })
  },
  //提交处理结果
  Handle(){
    var that=this;
    var uid = app.globalData.userInfo.id;
    var id=that.data.Id,result=that.data.result;
    if(result==''||result==undefined){
      dd.showToast({
        content:'请填写处理结果',
        duration:1000,
      });
      return false;
    }
    dd.httpRequest({
      url:URL+'/complain/handle',
      method:'POST',
      data:{
        complain_id:id,
        uid:uid,
        result:result,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:800,
            success(){
              that.onLoad();
            }
          });
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
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
});
