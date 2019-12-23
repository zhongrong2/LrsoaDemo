let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    navItem:{
      nav:[
        {title:'客户投诉',count:'',status:1},
        {title:'员工反馈',count:'',status:2},
      ],
      navIndex:0,
    },//nav
    dataList:[],//数据列表
    ShowConsComp:'',//是否显示客户投诉
    status:'',//筛选条件类型
    departId:'',//筛选条件部门
    page:1,//当前页
    limit:10,//每页条数
    hasOnshow:false,
  },
  onLoad() {
    //初始化
    this.setData({
      dataList:[],//数据列表
      page:1,//当前页
      hasOnshow:false,
    })
    this.ShowConsumerComplain();//是否显示客户投诉
    // console.log(this.data.navItem.navIndex);
  },
  onShow(){
    if(this.data.hasOnshow){
      //初始化
      this.setData({
        dataList:[],//数据列表
        page:1,//当前页
      })
      this.ShowConsumerComplain();//是否显示客户投诉
    }
    this.setData({
      hasOnshow:true,
    });
  },
  // 选择状态导航栏
  NavTap(e){
    const that = this;
    app.NavTap(e,that);//调用公共选择状态栏方法
    const Index = e.currentTarget.dataset.index;
    var type = that.data.navItem.nav[Index].status;
    //初始化
    this.setData({
      dataList:[],//数据列表
      status:'',//筛选条件类型
      departId:'',//筛选条件部门
      page:1,//当前页
      // hasOnshow:false,
    })
    var status=this.data.status,departId=this.data.departId;
    // console.log(this.data.navItem.navIndex,type,status,departId);
    this.GetComplainList(type,status,departId)//获取客户投诉列表
  },
  //选择筛选条件
  ChoseScreen(){
    var navIndex = this.data.navItem.navIndex;
    var type = this.data.navItem.nav[navIndex].status,status = this.data.status,departId = this.data.departId;
    // console.log(type,status,departId);
    dd.navigateTo({
      url:'/page/complain/screen/screen?type='+type+'&status='+status+'&departId='+departId
    })
  },
  //是否显示客户投诉
  ShowConsumerComplain(){
    var that = this;
    var id = app.globalData.userInfo.id;
    dd.httpRequest({
      url:URL+'/complain/showConsumerComplain',
      method:'POST',
      data:{
        uid:id,
      },
      dataType:'json',
      success(res){
        if(res.data.code==0){
          that.setData({
            ShowConsComp:res.data.data.show,
          })
          // console.log(that.data.ShowConsComp);
          //判断获取数据列表类型
          if(!that.data.ShowConsComp){
            that.setData({
              'navItem.navIndex':1,
            })
          }
          var type=that.data.navItem.nav[that.data.navItem.navIndex].status;
          var status=that.data.status,departId=that.data.departId;
          // console.log(type,status,departId);
          that.GetComplainList(type,status,departId)//获取客户投诉列表
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:1000,
          })
        }
      },
      fail(res){
        console.log(res);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      },
    })
  },
  //获取客户投诉列表
  GetComplainList(type,status,departId){
    var that = this;
    var uid=app.globalData.userInfo.id,page=this.data.page,limit=this.data.limit;
    dd.httpRequest({
      url:URL+'/complain/complainList',
      method:'POST',
      data:{
        type:type,
        uid:uid,
        status:status,
        department_id:departId,
        page:page,
        limit:limit,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.code==0){
          if(res.data.data == '' && that.data.dataList != ''){
            dd.showToast({
              content:'没有更多数据！',
              duration:1000,
            })
          }
          var arr = that.data.dataList;
          for(var i = 0;i < res.data.data.length;i++){
            arr.push(res.data.data[i]);
          }
          that.setData({
            dataList:arr,
          })
          page++;
          that.setData({
            page:page,
          });
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:1000,
          })
        }
      },
      fail(err){
        console.log(err);
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      },
    })
  },
  //下拉加载数据
  onReachBottom(){
    var type=this.data.navItem.nav[this.data.navItem.navIndex].status;
    var status=this.data.status,departId=this.data.departId;
    this.GetComplainList(type,status,departId)//获取客户投诉列表
  },
  //跳转订单详情
  CheckInfo(e){
    var type = this.data.navItem.nav[this.data.navItem.navIndex].status;
    var id = e.currentTarget.dataset.id;
    // console.log(type,id);
    if(type==1){
      dd.navigateTo({
        url:'/page/complain/compOrder/DetailCustComp/DetailCustComp?ID='+id
      })
    }
    else if(type==2){
      dd.navigateTo({
        url:'/page/complain/compOrder/DetailEmplFeed/DetailEmplFeed?ID='+id+'&noinfor='+1
      })
    }
  },
  //跳转员工反馈
  ComplainSub(){
    dd.navigateTo({
      url:'/page/complain/complain'
    })
  },
  //删除订单
  DelOrder(e){
    var that=this;
    var type=that.data.navItem.nav[that.data.navItem.navIndex].status;
    var uid=app.globalData.userInfo.id,id = e.currentTarget.dataset.id;
    // console.log(type,uid,id);
    dd.showActionSheet({
      title: '龙瑞森',
      items: ['删除'],
      cancelButtonText: '取消',
      success: (res) => {
        // console.log(res.index);
        if(res.index==0){
          dd.httpRequest({
            url:URL+'/complain/delComplain',
            method:'POST',
            data:{
              type:type,
              uid:uid,
              key:id,
            },
            dataType:'json',
            success(res){
              // console.log(res);
              if(res.data.code==0){
                dd.showToast({
                  content:res.data.data,
                  duration:800,
                  success:()=>{
                    that.onLoad();
                  }
                })
              }
              else{
                dd.showToast({
                  content:res.data.msg,
                  duration:1000,
                })
              }
            },
            fail(err){
              console.log(err);
              dd.showLoading({
                content: '加载中...',
                delay: 1000,
              });
            }
          })
        }
      },
    });
  },
});
