let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    count:'',//抄送人id
    CopMem:[],//抄送人信息
    hasOnshow:false,
  },
  onLoad(option) {
    var that=this;
    that.setData({
      id:JSON.parse(option.id),
      count:option.count,
      CopMem:JSON.parse(option.CopMem),
    })
    // console.log(that.data.id,that.data.count,that.data.CopMem);
    var uids = that.data.count;
    if(uids!=null){//判断抄送人是否有值
      var arr = uids.split(',');
      for(var i in arr){
        arr[i]
      }
    }
    else{
      arr = [];
    };
    // console.log(arr);
    that.setData({
      count:arr,
    });
    that.CopAllShow();
  },
  onShow(){
    if(this.data.hasOnshow){
     this.CopAllShow();
    }
    this.setData({
      hasOnshow:true,
    });
  },
  // 多个抄送人显示
  CopAllShow(){
    const CopMem = this.data.CopMem;
    if(CopMem.length>3){
      const newCopMem = CopMem.slice(0,2);
      // console.log(CopMem,newCopMem);
      this.setData({
        newCopMem:newCopMem
      })
    }
    else{
      this.setData({
        CopMem:CopMem
      })
    }
  },
  //取消选中抄送人
  DelCopier(e){
    const index = e.currentTarget.dataset.index;
    this.data.CopMem.splice(index,1);
    const NewDelCop = this.data.CopMem;
    console.log(this.data.count);
    this.data.count.splice(index,1);
    const NewDelCount = this.data.count;
    // console.log(index,this.data.CopMem,NewDelCop);
    this.setData({
      CopMem:NewDelCop
    });
    this.CopAllShow();
  },
  // 超过3个抄送跳转页面
  ShowCopAll(){
    var count = JSON.stringify(this.data.count);
    var CopMem = JSON.stringify(this.data.CopMem);
    // console.log(count);
    dd.navigateTo({
      url:'/page/PayR/Copiers/Copiers?count='+count+'&CopMem='+CopMem
    })
  },
  // 选择抄送人
  ChoseCopier(){
    dd.navigateTo({
      url:'/page/PayR/ChoseCopier/ChoseCopier'
    })
  },
  //获取备注
  GetContent(e){
    this.setData({
      content:e.detail.value,
    })
  },
  // 确认
  Sure(){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    var id=that.data.id,uid=that.data.userInfo.id,role=that.data.userInfo.role,content=that.data.content,count=that.data.count;
    console.log(id,uid,role,content,count);
    var cc_uids;
    if(count=='null'){
      cc_uids = ''
    }
    else{
      cc_uids = count.toString();
    }
    console.log(cc_uids);
    dd.httpRequest({
      url:URL+'/payapply/pass',
      method:'POST',
      data:{
        id:id,
        uid:uid,
        role:role,
        content:content,
        second_cc_uids:cc_uids,
      },
      dataType:'json',
      success(res){
        if(res.data.code==0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          })
          dd.switchTab({
            url:'/page/appr/appr'
          })
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          });
        }
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        });
      },
    })
  }
});
