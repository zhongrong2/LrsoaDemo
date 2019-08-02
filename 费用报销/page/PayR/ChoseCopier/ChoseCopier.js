let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    searchResShow:false,
    searchNoResShow:false,
    page:1,
    limit:10,
    depart:[],//部门列表
    subdepart:[],//子级部门列表
    member:[],//部门成员列表
    memListShow:false,//部门成员列表
    SearchMember:[],//搜索部门成员列表
    SearchFlag:false,//搜索显示
    parentName:'',
    countPer:'0',
    count:[],
    CopMem:[],
    searchVal:'',
  },
  onLoad() {
    var that=this;
    that.GetDepartList();
    that.setData({
      countPer:that.data.CopMem.length,
    })
  },
  // 在部门成员数据添加选中状态参数
  addTag(){
    for(var i = 0; i < this.data.member.length; i++){
      this.data.member[i].choseMemShow = false;
    }
  },
  //获取部门列表
  GetDepartList(){
    const that = this;
    that.setData({
      subdepart:[],
      member:[],
      SearchMember:[],
      SearchFlag:false,
    });
    dd.httpRequest({
      url:URL+'/common/departmentList',
      method:'POST',
      dataType:'json',
      success(res){
        dd.hideLoading();
        console.log(res.data.data);
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
        // console.log(that.data.depart);
        that.setData({
          depart:res.data.data,
        });
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
  //获取子级部门列表
  GetChildDepartList(e){
    const that = this;
    const id = e.currentTarget.dataset.id;
    that.setData({
      depart:[],
      member:[],
      SearchMember:[],
    });
    // console.log(that.data.depart)
    // console.log(name);
    dd.httpRequest({
      url:URL+'/common/subDepartmentList',
      method:'POST',
      data:{
        department_id:id,
      },
      dataType:'json',
      success(res){
        dd.hideLoading();
        console.log(res.data.data);
        that.setData({
          subdepart:res.data.data,
        });
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
  //获取部门成员列表
  GetMemList(e){
    const id = e.currentTarget.dataset.id;
    // console.log(id);
    const parName = e.currentTarget.dataset.parName; 
    this.setData({
      id:id,
      parName:parName,
      page:'1',//重新点击选择部门数据初始化
      member:[],//重新点击选择部门数据初始化
      memListShow:true,
    })
    this.MemList(id,parName);
  },
  //部门成员列表
  MemList(id,parName){
    console.log(id,parName)
    const that = this;
    var Page = that.data.page,limit = that.data.limit;
    var count = that.data.count;
    that.setData({
      depart:[],
      subdepart:[],
      SearchMember:[],
    });
    // console.log(Page);
    dd.httpRequest({
      url:URL+'/common/userList',
      method:'POST',
      data:{
        page:Page,
        limit:limit,
        department_id:id,
      },
      dataType:'json',
      success(res){
        console.log(res.data.data);
        dd.hideLoading();
        that.setData({
          parentName:parName,
        });
        if(res.data.data == '' && that.data.member != ''){
          dd.showToast({
            content:'没有更多数据！',
            duration:3000,
          })
        }
        var arr = that.data.member;
        for(var i = 0;i < res.data.data.length;i++){
          arr.push(res.data.data[i]);
        }
        that.setData({
          member:arr,
        })
        Page++;
        that.setData({
          page:Page,
        });
        var member = that.data.member;
        // console.log(member);
        that.addTag();
        for(var i=0;i<count.length;i++){//判断点击确定之前是否选择该成员
          for(var j=0;j<member.length;j++){
            if(count[i]==member[j].id){
              member[j].choseMemShow=true;
              that.setData({
                member:member,
              })
              // console.log("存在",member)
            }
          }
        };
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
  // 选择成员
  ChoseMem(e){
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    const member = this.data.member;
    member[index].choseMemShow = !member[index].choseMemShow;
    const addIndex = member[index].choseMemShow ? id : '';
    this.setData({
      member:member,
    });
    // console.log(member,addIndex,index,id)
    this.AddMem(addIndex,index,id);
  },
  //计算选择抄送人人数
  AddMem(addIndex,index,id){
    var that = this;
    if(addIndex !== ""){
      // console.log(addIndex,index)
      var count = that.data.count;//选择抄送人的id
      that.data.count.push(addIndex);//添加选中抄送人id
      var CopMem = that.data.CopMem;
      var copmenAdd = that.data.member[index];//获取添加用户的数据
      that.data.CopMem.push(copmenAdd);//把要添加用户的数据放到已选择抄送人数据中
      that.setData({
        countPer:that.data.countPer-1+2,
        count:that.data.count,
        CopMem:that.data.CopMem,
      })
      // console.log(that.data.count,that.data.CopMem);
    }
    else{
      // console.log(addIndex,id)
      var count = that.data.count;
      for(var j=0;j<count.length;j++){//删除取消的抄送人id
        if(count[j]==id){
          count.splice(j,1);
        }
      } 
      var CopMem = that.data.CopMem;
      for(var i=0;i<CopMem.length;i++){//删除取消的抄送人数据
        if(CopMem[i].id==id){
          CopMem.splice(i,1);
        }
      }
      that.setData({
        countPer:this.data.countPer-1,
        count:this.data.count,
        CopMem:that.data.CopMem,
      });
      // console.log(that.data.count,that.data.CopMem);
    }
  },
  // 返回第一级公司部门
  DepTap(){
    this.setData({
      memListShow:false
    })
    this.GetDepartList();
  },
  //搜索
  Search(e){
    var that = this,page = that.data.page,limit = that.data.limit;
    that.setData({
      depart:[],
      subdepart:[],
      member:[],
      searchVal:e.detail.value,
      SearchFlag:true,
    });
    console.log(that.data.SearchFlag);
    dd.httpRequest({
      url:URL+'/common/userList',
      method:'POST',
      data:{
        name:that.data.searchVal,
        page:1,
        limit:limit,
        member:[],
      },
      dataType:'json',
      success(res){
        console.log(res.data.data);
        if(res.data.data.length>0){
          that.setData({
            member:res.data.data,
          });
        }
        else{
          that.setData({
            member:[],
          });
        }
        that.addTag();
        var count = that.data.count;
        var member = that.data.member;
        for(var i=0;i<count.length;i++){//判断点击确定之前是否选择该成员
          for(var j=0;j<member.length;j++){
            if(count[i]==member[j].id){
              member[j].choseMemShow=true;
              that.setData({
                member:member,
              })
              // console.log("存在",member)
            }
          }
        }
      },
      err(){
        console.log(err)
      }
    })
  },
  //获取所有的
  GetAllDepartList(){
    var that = this;
    that.setData({
      SearchFlag:false,
    });
    that.GetDepartList();
  },
  //下拉加载部门成员数据数据不用初始化
  ScrollMem(){
    var that= this,id=that.data.id,parName=that.data.parName;
    // console.log(id,parName);
    that.MemList(id,parName);
  },
  //确定选择抄送人
  Sure(){
    const that = this;
    var count = that.data.count;
    var CopMem = that.data.CopMem;
    // console.log(count,CopMem);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      CopMem:CopMem,
      count:count,
    })
    dd.navigateBack({delta:1});
  }
});
