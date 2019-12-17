let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    Id:'',//订单ID
    member:[],//成员列表
    count:[],
    CopMem:[],
    searchVal:'',
    page:1,
    limit:10,
    SearchNoRes:false,
  },
  onLoad(options) {
    this.setData({
      Id:options.ID,
    })
    this.GetUserList();
  },
  // 在部门成员数据添加选中状态参数
  addTag(){
    for(var i = 0; i < this.data.member.length; i++){
      this.data.member[i].choseMemShow = false;
    }
  },
  //计算选择抄送人人数
  AddMem(addIndex,index,id){
    var that = this;
    if(addIndex !== ""){
      var count = that.data.count;//选择抄送人的id
      that.data.count.push(addIndex);//添加选中抄送人id
      that.setData({
        count:that.data.count,
      })
    }
    else{
      // console.log(addIndex,id)
      var count = that.data.count;
      for(var j=0;j<count.length;j++){//删除取消的抄送人id
        if(count[j]==id){
          count.splice(j,1);
        }
      }      
      that.setData({        
        count:this.data.count,
      });
    }
    // console.log(that.data.count);
  },
  // 选择成员
  ChoseMem(e){
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    const member = this.data.member;
    member[index].choseMemShow = !member[index].choseMemShow;
    this.setData({
      member:member,
      CopMem:name,
    });
    const addIndex = member[index].choseMemShow ? id : '';
    this.AddMem(addIndex,index,id);
    // console.log(index,id,name,addIndex);
  },
  //获取处理人列表
  GetUserList(searchVal){
    var that=this;
    var page=this.data.page,limit=this.data.limit;
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
        // console.log(res.data);
        if(res.data.code==0){
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
          //判断搜索成员之前是否已选择该成员
          for(var j=0;j<member.length;j++){
            for(var i=0;i<count.length;i++){
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
        else{
          dd.showToast({
            content:res.data.msg,
            duration:3000,
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
  //下拉加载部门成员数据数据不用初始化
  ScrollList(){
    this.setData({
      searchVal:'',
    });
    var searchVal=this.data.searchVal;
    this.GetUserList(searchVal);
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
    this.GetUserList(searchVal);
  },
  //全部成员
  GetAllUser(){
    this.setData({
      SearchNoRes:false,
      searchVal:'',
      page:1,//重新点击选择部门数据初始化
      member:[],//重新点击选择部门数据初始化
    });
    var searchVal=this.data.searchVal;
    this.GetUserList(searchVal);
  },
  //确定选择成员
  Sure(){
    var count=this.data.count,Id=this.data.Id;
    var uids=count.join(',');
    console.log(count,uids,Id);
    dd.httpRequest({
      url:URL+'/complain/assign',
      method:'POST',
      data:{
        manage_uids:uids,
        id:Id,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.code==0){
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          dd.navigateBack({
            delta:1,
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          });
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
        dd.showLoading({
          content: '加载中...',
          delay: 1000,
        });
      }
    })
  },
});
