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
    var that=this,uId;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    if(options.type==undefined){
      // console.log(options.type);
      that.setData({
        id:JSON.parse(options.id),
        uid:that.data.userInfo.id,
      })
      // console.log(this.data.id);
      var id = that.data.id;
      that.ReadInfo(id);
      that.GetInfo();
    }
    else{      
      dd.getStorage({
        key:'uid',
        success(res){
          uId = res.data.uid;
          // console.log(uid);
           that.setData({
            id:options.id,
            type:options.type,
            uid:uId,
          })
        },
        fail(err){
          dd.showToast({
            content:'网络出错',
            duration:3000,
          })
        }
      })
      // console.log(this.data.id);
      var id = that.data.id;
      that.ReadInfo(id);
      that.GetInfo();
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
        // console.log(res);
        if(res.data.code==0){
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
        }
        else if(res.data.code==1){
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
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
