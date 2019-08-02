let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    List:[],
    searchVal:'',
    SearchNoRes:false,
  },
  onLoad() {
    var searchVal=this.data.searchVal;
    this.GetDepart(searchVal);
  },
  //获取部门
  GetDepart(searchVal){
    var that = this;
    dd.httpRequest({
      url:URL+'/common/applyDepartmentList',
      method:'POST',
      data:{
        name:searchVal,
      },
      dataType:'json',
      success(res){
        // console.log(res.data.data)
        if(res.data.code==0){
          dd.hideLoading();
          that.setData({
            List:res.data.data
          })
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
  // 选择部门
  ChoseDepart(e){
    const index = e.currentTarget.dataset.index,title = e.currentTarget.dataset.title;
    console.log(index,title);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      DepartId:index,
      DepartVal:title,
    })
    dd.navigateBack({delta:1});
  },
  //搜索
  Search(e){
    var searchVal=e.detail.value;
    this.setData({
      searchVal:e.detail.value,
    })
    this.GetDepart(searchVal);
  },
  //未搜索到部门
  GetDeparts(){
    var that=this;
    that.setData({
      searchVal:'',
      SearchNoRes:false,
    })
    var searchVal=this.data.searchVal;
    this.GetDepart(searchVal);
  }
});
