let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    AreaShow:true,
    CityShow:false,
    letterItem:'',
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    top:1,
    areaList:[],
    cityList:[],
    procinceName:'',
    procinceId:'',
    cityId:'',
    searchVal:'',
  },
  onLoad() {
    this.GetArea();
  },
  // 获取省份列表
  GetArea(name){
    var that = this;
    dd.httpRequest({
      url:URL+'/common/provinceList',
      method:'POST',
      data:{
        name:name,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        if(res.data.code==0){
          dd.hideLoading();
          that.setData({
            areaList:res.data.data
          })
        }
        else if(res.data.code==1){
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
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
  //获取市列表
  GetCity(id,name){
    var that = this;
    dd.httpRequest({
      url:URL+'/common/cityList',
      method:'POST',
      data:{
        name:name,
        province_id:id,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        if(res.data.code==0){
          dd.hideLoading();
          that.setData({
            cityList:res.data.data
          })
        }
        else if(res.data.code==1){
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
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
  //选择省
  ChoseArea(e){
    const Proid = e.currentTarget.dataset.id,name = e.currentTarget.dataset.name;
    // console.log(id,name);
    this.setData({
      searchVal:'',
      AreaShow:false,
      CityShow:true,
      procinceName:name,
      procinceId:Proid,
    })
    var cityname='';
    this.GetCity(Proid,cityname);
  },
  //选择市
  ChoseCity(e){
    const that = this,id = e.currentTarget.dataset.id,name = e.currentTarget.dataset.name,Proid = that.data.procinceId,procinceName = that.data.procinceName;
    var selectAddress;
    that.setData({
      searchVal:'',
    })
    // console.log(name,procinceName);
    if(procinceName == '北京市' || procinceName == '天津市' || procinceName == '上海市' || procinceName == '重庆市'){
      selectAddress = procinceName;
    }
    else{
      selectAddress = procinceName+name;
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      selectAddress:selectAddress,
      ProId:Proid,
      CityId:id,
    })
    dd.navigateBack({delta:1});
  },
  //根据字母选择城市
  LetterTap(e){
    const item = e.currentTarget.dataset.item;
    console.log(item);
    this.setData({
      letterItem:item
    })
  },
  //搜索
  Search(e){
    const that=this;
    that.setData({
      searchVal:e.detail.value,
    });
    var searchVal = this.data.searchVal,Proid='',CityShow=this.data.CityShow;
    // console.log(searchVal);
    if(CityShow){
      this.GetCity(Proid,searchVal);
      return;
    }
    this.GetArea(searchVal)
  },
});
