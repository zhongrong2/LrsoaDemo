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
      dd.redirectTo({
        url:'/page/appr/DetailPendAppr/DetailPendAppr?id='+id+'&type='+type
      })
    }
    else if(type=="isend"){
      dd.redirectTo({
        url:'/page/init/DetailPendAppr/DetailPendAppr?id='+id+'&type='+type
      })
    }
    else if(type=="copytome"){
      dd.redirectTo({
        url:'/page/CC/DetailInfo/DetailInfo?id='+id+'&type='+type
      })
    }
  },
});
