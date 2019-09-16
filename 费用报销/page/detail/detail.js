Page({
  data: {
    id:'',
    type:'',
  },
  onLoad(options) {
    // console.log(query);
    var that=this;
    that.setData({
      id:options.id,
      type:options.type,
    })
    var id=that.data.id,type=that.data.type;
    if(type=="iaudit"){
      dd.reLaunch({
        url:'/page/appr/DetailPendAppr/DetailPendAppr?id='+JSON.stringify(id)+'&type='+type
      })
    }
    else if(type=="isend"){
      dd.reLaunch({
        url:'/page/init/DetailPendAppr/DetailPendAppr?id='+JSON.stringify(id)+'&type='+type
      })
    }
    else if(type=="copytome"){
      dd.reLaunch({
        url:'/page/CC/DetailInfo/DetailInfo?id='+JSON.stringify(id)+'&type='+type
      })
    }
  },
});
