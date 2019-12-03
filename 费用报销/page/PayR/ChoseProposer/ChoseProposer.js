let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    member:[],//成员列表
    count:'',
    CopMem:'',
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
          //判断点击确定之前是否选择该成员
          for(var j=0;j<member.length;j++){
            if(count==member[j].id){
              member[j].choseMemShow=true;
              that.setData({
                member:member,
              })
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
  // 选择成员
  ChoseMem(e){
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    const member = this.data.member;
    this.addTag();
    member[index].choseMemShow = !member[index].choseMemShow;
    this.setData({
      member:member,
      count:id,
      CopMem:name,
    });
    // console.log(member,index,id,name);
  },
  //确定选择抄送人
  Sure(){
    const that = this;
    var count = that.data.count;
    var CopMem = that.data.CopMem;
    // console.log(count,CopMem);
    var ProMemId = count.toString();
    var ProMemVal = CopMem.toString();
    // console.log(ProMemId,ProMemVal);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      ProMemId:ProMemId,
      ProMemVal:ProMemVal,
    })
    dd.navigateBack({delta:1});
    that.addTag();
  },
  // 搜索
  Search(e){
    var searchVal=e.detail.value;
    this.setData({
      searchVal:e.detail.value,
      SearchNoRes:false,
      page:1,//重新选择部门数据初始化
      member:[],//重新选择部门数据初始化
    })
    // console.log(this.data.member);
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
