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
    hasOnshow:false,
  },
  onLoad(options) {
    var that=this,uId;
    that.setData({
      userInfo:app.globalData.userInfo,
      hasInform:options.type,
    });
    // console.log(options.type);
    if(options.type==undefined){
      that.setData({
        id:JSON.parse(options.id),
        status:options.status,
        uid:that.data.userInfo.id,
      })
      that.GetInfo();
    }
    else{
      dd.getStorage({
        key:'uid',
        success(res){
          uId = res.data.uid;
          that.setData({
            id:JSON.parse(options.id),
            type:options.type,
            uid:uId,
          });
          that.GetInfo();
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
  onShow(){
    if(this.data.hasOnshow){
     this.GetInfo();
    }
    this.setData({
      hasOnshow:true,
    });
  },
  // 获取订单详情
  GetInfo(){
    var that=this,id =that.data.id,type=that.data.type,uid=that.data.uid;
    // console.log(uid);
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
        // console.log(res.data.data);
        if(res.data.code==0){
          dd.hideLoading();
          that.setData({
            Info:res.data.data,
            apprExam:res.data.data.run_log,
            status:res.data.data.bill_info.status,
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
          }
          else{
            that.setData({level:'level4'})
          }
        }
        else if(res.data.code==1){
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          })
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
    var that=this,Info=that.data.Info;
    var ShowCop = Info.bill_info.if_second_cc_uids,id=Info.bill_info.id,count=Info.bill_info.cc_uids,CopMem=Info.cc_uids;
    var CopMem = JSON.stringify(CopMem);
    // console.log(ShowCop,id,count,CopMem);
    if(ShowCop){
      dd.navigateTo({
        url:'/page/appr/ApprPass/ApprPass?id='+JSON.stringify(id)+'&count='+count+'&CopMem='+CopMem
      });
      return
    }
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
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          })
          that.setData({
            ReasonShow:false,
          });
          var page = getCurrentPages();// 获取当前页面栈
          var beforePage = page[page.length - 2]; // 跳转页面的栈
          dd.navigateBack({
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          })
        }
        else if(res.data.code==1){
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          })
          that.CloseReason();
        }
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
        that.CloseReason();
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
    });
    this.onShow();
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
  //已打款
  MakeMoney(){
    var that=this;
    var Info=that.data.Info,hasInform=that.data.hasInform;
    var stateBtn = Info.bill_info.button_status,id =that.data.id,uid=that.data.uid;
    // console.log(stateBtn,id,uid);
    if(stateBtn==4){
      dd.httpRequest({
        url:URL+'/payapply/remit',
        method:'POST',
        data:{
          id:id,
          uid:uid,
        },
        success(res){
          console.log(res.data);
          dd.hideLoading();
          if(res.data.code==0){
            dd.showToast({
              content:res.data.data,
              duration:3000,
            })
            if(hasInform==undefined){
              dd.navigateBack({
                delta: 1
              });
            }
            else{
              that.onShow();
            }
          }
          if(res.data.code==1){
            dd.showToast({
              content:res.data.msg,
              duration:3000,
            })
          }
        },
        fail(err){
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
        }
      })
    }
    else{
      dd.showToast({
        content:'已打款成功',
        duration:3000,
      })
    }
  }
});
