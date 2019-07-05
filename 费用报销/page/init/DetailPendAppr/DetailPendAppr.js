let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    id:'',
    status:'',
    Info:'',
    apprExam:[],
    CC:[],
    ReasonShow:false,
  },
  onLoad(options) {
    this.setData({
      id:JSON.parse(options.id),
      status:options.status,
    })
    console.log(options.status,this.data.status);
    this.GetInfo();
  },
  // 获取订单详情
  GetInfo(){
    var that=this,id =that.data.id;
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
        type:'isend',
      },
      dataType:'json',
      success(res){
        console.log(res);
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
        console.log(that.data.Info.account_info.pic);
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
        console.log(res);
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          })
          dd.navigateBack();
        }
      },
      fail(err){
        console.log(err);
      }
    })
  },
  //取消
  Cancel(){
    dd.navigateBack();
  },
  //修改
  Revise(){
    var that=this,id=that.data.Info.bill_info.id;
    // console.log(id);
    dd.navigateTo({
      url:'/page/PayR/PayR?id='+id
    })
  }
});
