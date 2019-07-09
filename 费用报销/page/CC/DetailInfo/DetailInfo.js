let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    id:'',
    type:'copytome',
    Info:'',
    apprExam:[],
  },
  onLoad(options) {
    if(options.type==undefined){
      // console.log(options.type);
      this.setData({
        id:JSON.parse(options.id),
      })
      // console.log(this.data.id);
      var id = this.data.id;
      this.ReadInfo(id);
      this.GetInfo();
    }
    else{
      this.setData({
        id:options.id,
        uid:options.uid,
        type:options.type,
      })
      // console.log(this.data.id);
      var id = this.data.id;
      this.ReadInfo(id);
      this.GetInfo();
    }
  },
  //阅读订单
  ReadInfo(id){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var uid=that.data.userInfo.id;
    // console.log(uid);
    dd.httpRequest({
      url:URL+'/payapply/read',
      method:'POST',
      data:{
        id:id,
        uid:uid,
      },
      dataType:'json',
      success(res){
        // console.log(res);
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
  // 获取订单详情
  GetInfo(){
    var that=this,id =that.data.id,type=that.data.type;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var uid=that.data.userInfo.id;
    dd.httpRequest({
      url:URL+'/payapply/detail',
      method:'POST',
      data:{
        id:id,
        uid:uid,
        type:type,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        dd.hideLoading();
        that.setData({
          Info:res.data.data,
          apprExam:res.data.data.run_log,
        })
        //判断紧急程度显示样式
        var status=that.data.Info.bill_info.status,level=that.data.Info.bill_info.level;
        if(status=='1'||status=='2'){
          if(level=='一般'){
            that.setData({level:'level1'})
          }
          else if(level=='紧急'){
            that.setData({level:'level2'})
          }
          else if(level=='非常紧急'){
            that.setData({level:'level3'})
          }
        }else{
          that.setData({level:'level4'})
        }
        // console.log(that.data.Info.account_info.pic);
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
    const srcs = this.data.Info.account_info.pic;
    const index = e.currentTarget.dataset.index;
    dd.previewImage({
      current:index,
      urls:srcs,
    })
  },
});
