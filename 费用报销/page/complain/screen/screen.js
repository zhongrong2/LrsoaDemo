let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    list:[{title:'已处理'},{title:'未处理'}],
    DepartmentList:[],//部门列表
    navIndex1:'',//类型
    navIndex2:'',//部门
    All:true,//展示All
    ShowNav2:false,//是否选中部门
  },
  onLoad() {
    this.GetDepart();
  },
  //选择所有
  ChoseAll(){
    this.setData({
      All:true,
      navIndex1:'',//类型
      navIndex2:'',//部门
      ShowNav2:false,//是否选中部门
    })
  },
  //选择类型
  Chose(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      navIndex1:index,
      All:false,
    })
  },
  //选择部门
  Chose2(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      navIndex2:index,
      ShowNav2:true,//是否选中部门
    })
  },
  //获取部门列表
  GetDepart(){
    var that = this;
    var id = app.globalData.userInfo.id;
    dd.httpRequest({
      url:URL+'/complain/departmentList',
      method:'POST',
      data:{
        "type": 1,
        "uid": id,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        if(res.data.code==0){
          that.setData({
            DepartmentList:res.data.data,
          })
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
});
