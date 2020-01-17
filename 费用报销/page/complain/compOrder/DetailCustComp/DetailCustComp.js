let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    Id:'',//订单id
    Info:'',//订单详情
  },
  onLoad(options) {
    var that=this,uid;
    if(options==undefined){
      uid = app.globalData.userInfo.id;
      that.GetInfo(uid);
      return;
    }
    dd.getStorage({
      key:'uid',
      success(res){
        uid = res.data.uid;
        that.setData({
          Id:options.ID,
        })
        that.GetInfo(uid);
      },
      fail(err){
        dd.showToast({
          content:'网络出错',
          duration:1000,
        })
      }
    })
  },
  //获取订单详情
  GetInfo(uid){
    var that = this;
    var Id=this.data.Id;
    // console.log(Id);
    dd.httpRequest({
      url:URL+'/complain/consumerComplainDetail',
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
  // 预览图片
  previewImage(e){
    const index = e.currentTarget.dataset.index;
    const Imgs = this.data.Info.img;
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
      url:URL+'/complain/handleConsumer',
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
