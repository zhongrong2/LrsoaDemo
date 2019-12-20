let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    list:[],//类型列表
    DepartmentList:[],//部门列表
    navIndex1:'',//类型
    navIndex2:'',//部门
    status:'',//选择类型
    departId:'',//选择部门ID
    AllStatu:true,//展示类型All
    AllDepart:true,//展示部门All
  },
  onLoad(options) {
    // console.log(options);
    var that=this;
    if(options.type==1){
      this.setData({
        list:[{title:'待处理',status:'0'},{title:'已处理',status:'1'}],
      })
    }
    else if(options.type==2){
      this.setData({
        list:[{title:'投诉',status:'1'},{title:'建议',status:'2'}],
      })
    } 
    this.setData({
      status:options.status,
      departId:options.departId,
    });
    this.GetDepart(options.type);
  },
  //选择类型所有
  ChoseStatuAll(){
    this.setData({
      AllStatu:true,
      navIndex1:'',//类型
      status:'',
    })
  },
  //选择部门所有
  ChoseDepartAll(){
    this.setData({
      AllDepart:true,
      navIndex2:'',//部门
      departId:'',
    })
  },
  //选择类型
  ChoseStatu(e){
    var index = e.currentTarget.dataset.index;
    var status = e.currentTarget.dataset.status;
    this.setData({
      navIndex1:index,
      status:status,
      AllStatu:false,
    })
  },
  //选择部门
  ChoseDepart(e){
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    this.setData({
      navIndex2:index,
      departId:id,
      AllDepart:false,
    })
  },
  //获取部门列表
  GetDepart(type){
    var that = this;
    var id = app.globalData.userInfo.id;
    dd.httpRequest({
      url:URL+'/complain/departmentList',
      method:'POST',
      data:{
        type: type,
        uid: id,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        if(res.data.code==0){
          that.setData({
            DepartmentList:res.data.data,
          });
          //判断所选中的类型
          var arrList=that.data.list;
          var status=that.data.status;
          var indexSta = arrList.findIndex(function(item) {
              return item.status === status;
          });
          // console.log(status,indexSta);
          if(indexSta>=0){
            that.setData({
              navIndex1:indexSta,//类型
              AllStatu:false,//展示类型All
            })
          }
          //判断所选中的部门
          var arr=that.data.DepartmentList;
          var departId=that.data.departId;
          var index = arr.findIndex(function(item) {
              return item.id == departId;
          });
          if(index>=0){
            that.setData({
              navIndex2:index,
              AllDepart:false,//展示部门All
            })
          }
          // console.log(index,that.data.navIndex2);
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          })
        }
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:res.data.msg,
          duration:3000,
        })
      },
    })
  },
  //确定选择筛选条件
  Sure(){
    var status = this.data.status,departId = this.data.departId;
    let pages = getCurrentPages();
    let beforePage = pages[pages.length - 2];
    beforePage.setData({
      status:status,//筛选条件类型
      departId:departId,//筛选条件部门
      
    })
    dd.navigateBack({
      delta:1,
      success: function () {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },
});
