let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    id:'',
    status:'',
    type:'iaudit',
    Info:'',
    apprExam:[],
    ReasonShow:false,
  },
  onLoad(options) {
    if(options.type==undefined){
      // console.log(options.type);
      this.setData({
        id:JSON.parse(options.id),
        status:options.status,
      })
      // console.log(options.status,this.data.status);
      this.GetInfo();
    }
    else{
      this.setData({
        id:options.id,
        status:options.status,
        uid:optionsuid,
        type:options.type,
      })
      // console.log(options.status,this.data.status);
      this.GetInfo();
    }
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
  //获取备注信息
  GetContent(e){
    // console.log(e.detail.value);
    this.setData({
      content:e.detail.value,
    })
  },
  //审批通过
  Pass(){
    var that=this;
    that.reasonTap();
    that.setData({
      ReaType:'0'
    })
  },
  //审批驳回
  Back(){
    var that=this;
    that.reasonTap();
    that.setData({
      ReaType:'1'
    })
  },
  //确认
  Submit(){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var id=that.data.Info.bill_info.id,role=that.data.userInfo.role,uid=that.data.userInfo.id,content=that.data.content,ReaType=that.data.ReaType,url='';
    if(ReaType==0){
      url='/payapply/pass';
    }
    else if(ReaType==1){
      url='/payapply/back';
      if(content==''||content==undefined){
        dd.showToast({
          content:'请输入驳回原因',
          duration:3000,
        });
        return
      }
    }
    dd.httpRequest({
      url:URL+url,
      method:'POST',
      data:{
        id:id,
        role:role,
        uid:uid,
        content:content,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        dd.showToast({
          content:res.data.data,
          duration:3000,
        })
        that.CloseReason();
        dd.navigateBack();
      },
      fail(err){
        console.log(err);
      }
    })
  },
  //弹出备注弹框
  reasonTap(){
    this.setData({
      ReasonShow:true,
    })
  },
  //关闭备注
  CloseReason(){
    this.setData({
      ReasonShow:false,
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
