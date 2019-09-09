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
    var that = this,uId;;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    if(options.type==undefined){
      // console.log(options);
      that.setData({
        id:JSON.parse(options.id),
        status:options.status,
        uid:that.data.userInfo.id,
      })
      // console.log(that.data.uid);
      that.GetInfo();
    }
    else{      
      dd.getStorage({
        key:'uid',
        success(res){
          uId = res.data.uid;
          // console.log(uid);
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
      // console.log(options.status,this.data.status);
    }
  },
  // 获取订单详情
  GetInfo(){
    var that=this,id =that.data.id,type=that.data.type,uid=that.data.uid;
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
            CC:res.data.data.cc_uids,
            status:res.data.data.bill_info.status,
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
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          })
          // dd.navigateBack();
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
        }
      },
      fail(err){
        // console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
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
      url:URL+'/payapply/cancel',
      method:'POST',
      data:{
        id:id,
        uid:uid,
        role:role,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          })
          // dd.navigateBack();
          var page = getCurrentPages()  ;// 获取当前页面栈
          var beforePage = page[page.length - 2]; // 跳转页面的栈
          dd.navigateBack({
            success: function () {
              beforePage.onShow(); // 执行前一个页面的onLoad方法
            }
          })
        }
        else if(res.data.code==1){
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          })
        }
      },
      fail(err){
        // console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
      }
    })
  },
  //修改
  Revise(){
    var that=this,id=that.data.Info.bill_info.id;
    console.log(id);
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
