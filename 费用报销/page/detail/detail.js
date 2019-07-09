

Page({
  data: {
    id:'',
    uid:'',
    type:'',
  },
  onLoad(query) {
    console.log(query);
    var query=query,id=query.id,uid=query.uid,type=query.type;
    if(type=="iaudit"){
      dd.redirectTo({
        url:'/page/appr/DetailPendAppr/DetailPendAppr?id='+id+'&uid='+uid+'&type='+type+'&query='+query
      })
    }
    else if(type=="isend"){
      dd.redirectTo({
        url:'/page/init/DetailPendAppr/DetailPendAppr?id='+id+'&uid='+uid+'&type='+type+'&query='+query
      })
    }
    else if(type=="copytome"){
      dd.redirectTo({
        url:'/page/CC/DetailInfo/DetailInfo?id='+id+'&uid='+uid+'&type='+type+'&query='+query
      })
    }
  },
});
