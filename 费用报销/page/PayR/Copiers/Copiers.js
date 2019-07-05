Page({
  data: {
    CopMemNum:'0',
    CopMem:[
      {title:'明日香'},
      {title:'二丫'},
      {title:'五人'},
      {title:'五人'},
      {title:'明日香'},
      {title:'二丫'},
      {title:'五人'},
      {title:'五人'},
      {title:'明日香'},
      {title:'五人'},
      {title:'明日香'},
      {title:'二丫'},
      {title:'五人'},
      {title:'五人'},
    ]
  },
  onLoad() {
    const CopMem = this.data.CopMem;
    const CopMemNum = CopMem.length;
    this.setData({
      CopMemNum:CopMemNum,
    })
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
