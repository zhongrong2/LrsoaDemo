let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    member:[
      {name:'钟荣',id:1},
      {name:'钟荣',id:2},
      {name:'钟荣',id:3},
      {name:'钟荣',id:4},
      {name:'钟荣',id:5},
      {name:'钟荣',id:6},
      {name:'钟荣',id:7},
      {name:'钟荣',id:8},
      {name:'钟荣',id:9},
    ],//成员列表
    count:[],
    CopMem:[],
    searchVal:'',
    page:1,
    limit:10,
    SearchNoRes:false,
  },
  onLoad() {},
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
      // var CopMem = that.data.CopMem;
      // var copmenAdd = that.data.member[index];//获取添加用户的数据
      // that.data.CopMem.push(copmenAdd);//把要添加用户的数据放到已选择抄送人数据中
      that.setData({
        // countPer:that.data.countPer-1+2,
        count:that.data.count,
        // CopMem:that.data.CopMem,
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
      // var CopMem = that.data.CopMem;
      // for(var i=0;i<CopMem.length;i++){//删除取消的抄送人数据
      //   if(CopMem[i].id==id){
      //     CopMem.splice(i,1);
      //   }
      // }
      that.setData({
        // countPer:this.data.countPer-1,
        count:this.data.count,
        // CopMem:that.data.CopMem,
      });
    }
    console.log(that.data.count);
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
    console.log(index,id,name,addIndex);
  },
});
