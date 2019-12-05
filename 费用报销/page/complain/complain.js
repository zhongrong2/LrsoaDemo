let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    radios:[{id:'1',title:'投诉',ShowIcon:true},{id:'2',title:'建议',ShowIcon:false}],//反馈类型
    radioImg:'/image/radio.png',//显示投诉人信息按钮
    ShowCompInfo:false,//投诉人信息
    ShowComp:true,//判断是否显示建议人信息
  },
  onLoad() {},
  //选择反馈类型
  ChoseComptype(e){
    var index=e.currentTarget.dataset.index;
    var id=e.currentTarget.dataset.id;
    this.setData({
      radios:[{id:'1',title:'投诉',ShowIcon:false},{id:'2',title:'建议',ShowIcon:false}],//反馈类型初始化
    })
    var radios = 'radios['+index+'].ShowIcon'
    this.setData({
      [radios]:!this.data.radios[index].ShowIcon,
    })
    console.log(index,id);
    //判断是否显示建议人信息
    if(id==1){
      this.setData({
        ShowComp:true,
      })
    }
    else if(id==2){
      this.setData({
        ShowComp:false,
      })
    }
  },
  //展示投诉人信息
  ShowCompinfo(){
    this.setData({
      ShowCompInfo:!this.data.ShowCompInfo,
    })
    //显示投诉人信息按钮
    if(this.data.ShowCompInfo){
      this.setData({
        radioImg:'/image/radio2.png',
      })
    }
    else{
      this.setData({
        radioImg:'/image/radio.png',
      })
    }
  }
});
