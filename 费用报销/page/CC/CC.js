let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    navItem:{
      nav:[
        {title:'未读',count:'',status:2},
        {title:'已读',count:'',status:1},
      ],
      navIndex:'0',
      status:2,
    },
    type:'copytome',
    page:1,
    limit:10,
    searchVal:'',//搜索值
    List:[],//数据列表
    hasOnshow:false,
  },
  onLoad() {
    const that=this,status=that.data.navItem.status;
    this.GetCopeToMe(that,status);
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
      that.GetCopeToMe(that,status);
    }
    that.setData({
      hasOnshow:true,
    })
  },
  //获取未读的数量
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
        type:'copytome',
        role:role,
      },
      dataType:'json',
      success(res){
        that.setData({
          'navItem.nav[0].count':res.data.data.noread
        })
        // console.log(res.data.data.noread,that.data.navItem.nav[0].count);
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
    const that = this;
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
    that.GetCopeToMe(that,status);
  },
  //下拉加载数据
  onReachBottom(){
    var that= this,status=that.data.navItem.status;
    that.GetCopeToMe(that,status);
  },
  //点击查看详情
  InfoTap(e){
    var id = e.currentTarget.dataset.id;
    // console.log(id);
    dd.navigateTo({
      url:'/page/CC/DetailInfo/DetailInfo?id='+JSON.stringify(id)
    })
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
    that.GetCopeToMe(that,status);
  },
  //获取抄送我首页数据
  GetCopeToMe(that,status){
    that.setData({
      userInfo:app.globalData.userInfo
    })
    const uid=that.data.userInfo.id;
    var Page = that.data.page;
    // console.log(Page);
    dd.httpRequest({
      url:URL+'/payapply/copyToMe',
      method:'POST',
      data:{
        status:status,
        uid:uid,
        page:Page,
        limit:that.data.limit,
        text:that.data.searchVal,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.data == '' && that.data.List != ''){
          dd.showToast({
            content:'没有更多数据！',
            duration:3000,
          })
        }
        var arr = that.data.List;
        // console.log(arr);
        for(var i = 0;i < res.data.data.length;i++){
          arr.push(res.data.data[i]);
        }
        that.setData({
          List:arr,
        })
        // console.log(arr,that.data.List);
        Page++;
        that.setData({
          page:Page,
        });
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
});
