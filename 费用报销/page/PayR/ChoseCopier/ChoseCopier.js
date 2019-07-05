let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    departShow:true,
    subdepartShow:false,
    memberShow:false,
    searchResShow:false,
    searchNoResShow:false,
    page:1,
    limit:10,
    member:[],//部门成员列表
    parentName:'',
    department:'石油公司',
    class:'人事部',
    position:'人事经理',
    searchRes:[
      {src:'/image/head.jpg',petname:'骄阳',name:'骄阳',position:'石油公司人事部经理'},
      {src:'/image/head.jpg',petname:'骄阳',name:'骄阳',position:'科技公司人事部经理'},
      {src:'/image/head.jpg',petname:'骄阳',name:'骄阳',position:'石油公司人事部经理'},
    ],
    countPer:'0',
    count:[],
    CopMem:[],
  },
  onLoad() {
    this.GetDepartList();
    this.addResTag();
  },
  // 在部门成员数据添加选中状态参数
  addTag(){
    for(var i = 0; i < this.data.member.length; i++){
      this.data.member[i].choseMemShow = false;
    }
  },
  // 在搜索结果添加选中状态参数
  addResTag(){
    for(var i = 0; i < this.data.searchRes.length; i++){
      this.data.searchRes[i].choseMemShow = false;
    }
  },
  //获取部门列表
  GetDepartList(){
    const that = this;
    dd.httpRequest({
      url:URL+'/common/departmentList',
      method:'POST',
      dataType:'json',
      success(res){
        // console.log(res.data.data);
        //判断是否还有子级部门
        for(var i = 0;i < res.data.data.length;i++){
          const childs = res.data.data[i]._child;
          for(var j = 0;j < childs.length;j++){
            if(childs[j]._child){
              childs[j].departs = true;
            }
            else{
              childs[j].departs = false;
            }
          }
        }
        that.setData({
          depart:res.data.data,
        });
        // console.log(that.data.depart);
      },
      fail(err){
        console.log(err);
      }
    })
  },
  //获取子级部门列表
  GetChildDepartList(e){
    const that = this;
    const id = e.currentTarget.dataset.id;
    // console.log(name);
    dd.httpRequest({
      url:URL+'/common/subDepartmentList',
      method:'POST',
      data:{
        department_id:id,
      },
      dataType:'json',
      success(res){
        // console.log(res.data.data);
        that.setData({
          subdepart:res.data.data,
          departShow:false,
          subdepartShow:true,
        });
      },
      fail(err){
        console.log(err);
      }
    })
  },
  //获取部门成员列表
  GetMemList(e){
    const id = e.currentTarget.dataset.id;
    const that = this,page = that.data.page,limit = that.data.limit;
    const parName = e.currentTarget.dataset.parName;
    // console.log(id,parName);
    dd.httpRequest({
      url:URL+'/common/userList',
      method:'POST',
      data:{
        page:page,
        limit:limit,
        department_id:id,
      },
      dataType:'json',
      success(res){
        // console.log(res.data.data);
        that.setData({
          departShow:false,
          subdepartShow:false,
          memberShow:true,
          member:res.data.data,
          parentName:parName,
        });
        that.addTag();
      },
      fail(err){
        console.log(err);
      }
    })
  },
  // 选择成员
  ChoseMem(e){
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    const member = this.data.member;
    // console.log(index,id)
    member[index].choseMemShow = !member[index].choseMemShow;
    const addIndex = member[index].choseMemShow ? id : '';
    this.setData({
      member:member,
    });
    this.AddMem(addIndex,index);
  },
  //选择搜索结果成员
  ChoseResMem(e){
    const index = e.currentTarget.dataset.index;
    const Res = this.data.searchRes;
    Res[index].choseMemShow = !Res[index].choseMemShow;
    const addIndex = Res[index].choseMemShow ? index : '';
    this.setData({
      searchRes:Res,
    });
    this.AddMem(addIndex,index);
  },
  //计算选择抄送人人数
  AddMem(addIndex,index){
    if(addIndex !== ""){
      var countMem = this.data.count.concat(addIndex);
      this.setData({
        countPer:this.data.countPer-1+2,
        count:countMem,
      })
      // console.log(index,addIndex,this.data.count);
    }
    else{
      this.data.count.splice(index,1);
      var countMem = this.data.count;
      this.setData({
        countPer:this.data.countPer-1,
        count:countMem,
      })
      // console.log(index,addIndex,this.data.count);
    }
  },
  // 返回第一级公司部门
  DepTap(){
    this.setData({
      departShow:true,
      memberShow:false,
      subdepartShow:false,
    })
  },
  //确定选择抄送人
  Sure(){
    const that = this;
    const count = that.data.count;
    var CopMem = that.data.CopMem;
    for(var i = 0;i < count.length;i++){
      var Id = count[i];
      var CopMemInfo = that.data.member.filter(function(item){
        return item.id == Id
      })
      for(var j = 0;j < CopMemInfo.length;j++){
        var CopMemInfos = CopMemInfo[j];
      }
      CopMem.push(CopMemInfos);
    }
    console.log(count,CopMem);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      CopMem:CopMem,
      count:count,
    })
    dd.navigateBack({delta:1});
  }
});
