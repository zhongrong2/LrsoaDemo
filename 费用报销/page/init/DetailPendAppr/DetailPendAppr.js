let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    id:'',
    status:'',
    type:'isend',
    Info:'',
    apprExam:[],
    CC:[],
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
        uid:options.uid,
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
          CC:res.data.data.cc_uids,
        })
        //判断紧急程度显示样式
        var status=that.data.Info.bill_info.status,level=that.data.Info.bill_info.level;
        if(status=='4'||status=='5'){
          that.setData({
            Top:'Top'
          })
        }
        if(status=='1'||status=='2'){
          that.setData({
            Top:'hidden'
          })
        } 
        if(status=='1'||status=='2'||status=='5'){
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
          that.setData({level:'level4'});
        }
        // console.log(that.data.Info.account_info.pic);
      },
      fail(err){
        // console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
  //撤销
  Repeal(){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    })
    var id=that.data.id,uid=that.data.userInfo.id,role=that.data.userInfo.role;
    dd.httpRequest({
      url:URL+'/payapply/repeal',
      method:'POST',
      data:{
        uid:uid,
        role:role,
        id:id,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        dd.hideLoading();
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          })
          dd.navigateBack();
        }
      },
      fail(err){
        // console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
  //取消
  Cancel(){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    })
    var id=that.data.id,uid=that.data.userInfo.id,role=that.data.userInfo.role;
    // console.log(id,uid,role);
    dd.httpRequest({
      url:URL+'/payapply/repeal',
      method:'POST',
      data:{
        id:id,
        uid:uid,
        role:role,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        dd.hideLoading();
        dd.showToast({
          content:res.data.data,
          duration:3000,
        })
        dd.navigateBack();
      },
      fail(err){
        // console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
  //修改
  Revise(){
    var that=this,id=that.data.Info.bill_info.id;
    // console.log(id);
    dd.navigateTo({
      url:'/page/PayR/PayR?id='+id
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
