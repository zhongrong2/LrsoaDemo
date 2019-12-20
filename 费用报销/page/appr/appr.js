let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    navItem:{
      nav:[
        {title:'待审批',count:'',status:'1'},
        {title:'已驳回',count:'',status:'3'},
        {title:'已通过',count:'',status:'4'},
        {title:'已打款',count:'',status:'7'},
      ],
      navIndex:0,
      NavTap:'NavTap',
      status:1,
      InfoTap:'InfoTap',
    },
    type:'iaudit',
    page:1,
    limit:10,
    searchVal:'',
    List:[],
    hasOnshow:false,
  },
  onLoad() {
    const that=this,status=that.data.navItem.status;
    that.setData({
      page:1,
      List:[],
      hasOnshow:false,
    })
    this.GetAppr(that,status);
    this.GetCount(); 
  },
  onShow(){
    var that = this,status=that.data.navItem.status;
    if(that.data.hasOnshow){
      that.setData({
        page:1,
        List:[],
        'navItem.navIndex':that.data.navItem.navIndex,
      })
      that.GetCount();
      that.GetAppr(that,status);
    }
    that.setData({
      hasOnshow:true,
    })
  },
  //获取待审批和已驳回的数量
  GetCount(){
    var that=this;
    that.setData({
      userInfo:app.globalData.userInfo
    })
    const uid=that.data.userInfo.id,role=that.data.userInfo.role;
    dd.httpRequest({
      url:URL+'/payapply/tipsCount',
      method:'POST',
      data:{
        uid:uid,
        type:'iaduit',
        role:role,
      },
      dataType:'json',
      success(res){
        // console.log(res.data.data.back);
        that.setData({
          'navItem.nav[0].count':res.data.data.audit,
        })
        app.addTag(that.data);
        app.InfoShow(that);
      },
      fail(err){
        console.log(err);
      }
    })
  },
  // 选择状态导航栏
  NavTap(e){
    var that = this;
    app.NavTap(e,that);
    const Index = e.currentTarget.dataset.index;
    const status = that.data.navItem.nav[Index].status;
    that.setData({
      List:[],
      page:1,
      searchVal:'',
      'navItem.status':status,
    })
    // console.log(Index,status);
    this.GetCount();
    that.GetAppr(that,status);
  },
  //下拉加载数据
  onReachBottom(){
    var that= this,status=that.data.navItem.status;
    that.GetAppr(that,status);
  },
  //点击查看详情
  InfoTap(e){
    var that=this,id=e.currentTarget.dataset.id,status=that.data.navItem.status;
    // console.log(status);
    //初始化
    that.setData({
      hasOnshow:false,
    })
    dd.navigateTo({
      url:'/page/appr/DetailPendAppr/DetailPendAppr?id='+JSON.stringify(id)+'&status='+status
    });
  },
  //搜索
  Search(e){
    const that=this,status=that.data.navItem.status;
    that.setData({
      searchVal:e.detail.value,
      page:1,
      List:[],
    });
    // console.log(that.data.page,status);
    that.GetAppr(that,status);
  },
  //获取我审批首页数据
  GetAppr(that,status){
    that.setData({
      userInfo:app.globalData.userInfo
    })
    const uid=that.data.userInfo.id,role=that.data.userInfo.role;
    var Page = that.data.page,searchVal=that.data.searchVal;
    dd.httpRequest({
      url:URL+'/payapply/iAudit',
      method:'POST',
      data:{
        status:status,
        uid:uid,
        role:role,
        page:Page,
        limit:that.data.limit,
        text:searchVal,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.code==0){
          dd.hideLoading();
          if(res.data.data == '' && that.data.List != ''){
            dd.showToast({
              content:'没有更多数据！',
              duration:3000,
            })
          }
          var arr = that.data.List;
          for(var i = 0;i < res.data.data.length;i++){
            arr.push(res.data.data[i]);
          }
          that.setData({
            List:arr,
          })
          Page++;
          that.setData({
            page:Page,
          });
        }
        else if(res.data.code==1){
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
        }
      },
      fail(err){
        console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
        that.onShow()
        // setTimeout(()=>{},3000);
      }
    })
  },
});
