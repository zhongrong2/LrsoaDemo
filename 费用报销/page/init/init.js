let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    navItem:{
      nav:[
        {title:'待审批',count:'',status:'1'},
        {title:'已驳回',count:'',status:'3'},
        {title:'已完成',count:'',status:'4'},
        {title:'已撤销',count:'',status:'5'},
        {title:'已取消',count:'',status:'6'},
      ],
      navIndex:0,
      NavTap:'NavTap',
      status:1,
    },
    type:'isend',
    page:1,
    limit:10,
    searchVal:'',
    List:[],
    hasOnshow:false,
  },
  onLoad() {
    const that=this,status=that.data.navItem.status;
    this.GetInit(that,status);
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
      that.GetInit(that,status);
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
    console.log(role)
    dd.httpRequest({
      url:URL+'/payapply/tipsCount',
      method:'POST',
      data:{
        uid:uid,
        type:'isend',
        role:role,
      },
      dataType:'json',
      success(res){
        that.setData({
          'navItem.nav[0].count':res.data.data.audit,
          'navItem.nav[1].count':res.data.data.back,
        })
        // console.log(res.data.data);
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
    that.GetInit(that,status);
  },
  //下拉加载数据
  onReachBottom(){
    var that= this,status=that.data.navItem.status;
    this.GetInit(that,status);
  },
  //点击查看详情
  InfoTap(e){
    var that=this,id=e.currentTarget.dataset.id,status=that.data.navItem.status;
    dd.navigateTo({
      url:'/page/init/DetailPendAppr/DetailPendAppr?id='+JSON.stringify(id)+'&status='+status
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
    that.GetInit(that,status);
  },
  //获取我发起首页数据
  GetInit(that,status){
    that.setData({
      userInfo:app.globalData.userInfo
    })
    const uid=that.data.userInfo.id,role=that.data.userInfo.role;
    var Page = that.data.page,searchVal=that.data.searchVal;
    dd.httpRequest({
      url:URL+'/payapply/iSend',
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
        dd.hideLoading();
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
            content: '加载中1...',
            delay: 1000,
          });
        }
      },
      fail(err){
        console.log(err);
        dd.showLoading({
          content: '加载中2...',
          delay: 1000,
        });
      }
    })
  },
});
