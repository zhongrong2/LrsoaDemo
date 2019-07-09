Page({
  data: {
    count:[],
    CopMem:[],
  },
  onLoad(options) {
    var count = JSON.parse(options.count);
    var CopMem = JSON.parse(options.CopMem);
    this.setData({
      count:count,
      CopMem:CopMem,
    })
    // console.log(this.data.count,this.data.CopMem);
  },
  // 删除图片
  DelCopier(e){
    const index = e.currentTarget.dataset.index;
    this.data.CopMem.splice(index,1);
    const CopMem = this.data.CopMem;
    const CopMemNum = CopMem.length;
    this.setData({
      CopMemNum:CopMemNum,
      CopMem:CopMem
    })
  },
  // 选择抄送人
  ChoseCopier(){
    dd.navigateTo({
      url:'/page/PayR/ChoseCopier/ChoseCopier'
    })
  },
});
