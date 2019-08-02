let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    member:[],//成员列表
    countPer:'0',//默认选择人数
    count:[],
    CopMem:[],
    searchVal:'',
    page:1,
    limit:10,
    SearchNoRes:false,
  },
  onLoad() {
    var searchVal=this.data.searchVal;
    this.GetPro(searchVal);
  },
  // 在部门成员数据添加选中状态参数
  addTag(){
    for(var i = 0; i < this.data.member.length; i++){
      this.data.member[i].choseMemShow = false;
    }
  },
  //获取成员
  GetPro(searchVal){
    var that = this;
    var page=that.data.page,limit=that.data.limit;
    dd.httpRequest({
      url:URL+'/common/userList',
      method:'POST',
      data:{
        name:searchVal,
        page:page,
        limit:limit,
      },
      dataType:'json',
      success(res){
        // console.log(res.data.data)
        if(res.data.code==0){
          dd.hideLoading();
          //下拉加载
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
          page++;
          that.setData({
            page:page,
          });
          that.addTag();
          var count = that.data.count,member=that.data.member;
          for(var i=0;i<count.length;i++){//判断点击确定之前是否选择该成员
            for(var j=0;j<member.length;j++){
              if(count[i]==member[j].id){
                member[j].choseMemShow=true;
                that.setData({
                  member:member,
                })
              }
            }
          };
          if(res.data.data.length==0){
            that.setData({
              SearchNoRes:true,
            })
          }
        }
        else if(res.data.code){
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
      }
    })
  },
  //计算选择抄送人人数
  AddMem(addIndex,name,id){
    var that = this;
    if(addIndex !== ""){
      // console.log(addIndex,index)
      var count = that.data.count;//选择抄送人的id
      that.data.count.push(addIndex);//添加选中抄送人id
      var CopMem = that.data.CopMem;
      var copmenAdd = name;//获取添加用户的name
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
        if(CopMem[i]==name){
          CopMem.splice(i,1);
        }
      }
      that.setData({
        countPer:this.data.countPer-1,
        count:this.data.count,
        CopMem:that.data.CopMem,
      });
      console.log(that.data.count,that.data.CopMem);
    }
  },
  // 选择成员
  ChoseMem(e){
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    const member = this.data.member;
    member[index].choseMemShow = !member[index].choseMemShow;
    const addIndex = member[index].choseMemShow ? id : '';
    this.setData({
      member:member,
    });
    // console.log(member,addIndex,index,id)
    this.AddMem(addIndex,name,id);
  },
  //确定选择抄送人
  Sure(){
    const that = this;
    var count = that.data.count;
    var CopMem = that.data.CopMem;
    // console.log(count,CopMem);
    var ProMemId = count.toString();
    var ProMemVal = CopMem.toString();
    console.log(ProMemId,ProMemVal);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      ProMemId:ProMemId,
      ProMemVal:ProMemVal,
    })
    dd.navigateBack({delta:1});
  },
  // 搜索
  Search(e){
    var searchVal=e.detail.value;
    this.setData({
      searchVal:e.detail.value,
      SearchNoRes:true,
      page:1,//重新点击选择部门数据初始化
      member:[],//重新点击选择部门数据初始化
    })
    // console.log(searchVal);
    this.GetPro(searchVal);
  },
  //全部成员
  GetAllPro(){
    this.setData({
      SearchNoRes:false,
      searchVal:'',
      page:1,//重新点击选择部门数据初始化
      member:[],//重新点击选择部门数据初始化
    });
    var searchVal=this.data.searchVal;
    this.GetPro(searchVal);
  },
  //下拉加载部门成员数据数据不用初始化
  ScrollList(){
    this.setData({
      searchVal:'',
    });
    var searchVal=this.data.searchVal;
    this.GetPro(searchVal);
  },
});
