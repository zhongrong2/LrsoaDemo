let app = getApp();
let URL = app.globalData.http;
Page({
  data: {
    radios:[{id:'1',title:'投诉',ShowIcon:true},{id:'2',title:'建议',ShowIcon:false}],//反馈类型
    radioImg:'/image/radio.png',//显示投诉人信息按钮
    ShowCompInfo:false,//投诉人信息
    ShowComp:true,//判断是否显示建议人信息
    DepartId:'',//选择部门id
    DepartVal:'',//选择部门
    type:'1',//反馈类型
    payment:'',//投诉对象
    content:'',//内容描述
    CompName:'',//投诉人姓名
    CompPhone:'',//投诉人电话
    images:[],//图片
  },
  onLoad() {},
  //选择部门
  ChoseDepart(){
    dd.navigateTo({
      url:'/page/complain/ChoseCompDepart/ChoseCompDepart'
    })
  },
  //选择反馈类型
  ChoseComptype(e){
    var index=e.currentTarget.dataset.index;
    var id=e.currentTarget.dataset.id;
    this.setData({
      radios:[{id:'1',title:'投诉',ShowIcon:false},{id:'2',title:'建议',ShowIcon:false}],//反馈类型初始化
      radioImg:'/image/radio.png',//显示投诉人信息按钮
      ShowCompInfo:false,//投诉人信息
      CompName:'',//投诉人姓名
      CompPhone:'',//投诉人电话
    })
    var radios = 'radios['+index+'].ShowIcon'
    this.setData({
      [radios]:!this.data.radios[index].ShowIcon,
      type:id,
    })
    // console.log(index,id);
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
  //获取投诉对象
  GetPayment(e){
    this.setData({
      payment:e.detail.value,
    })
  },
  //获取备注
  GetContent(e){
    this.setData({
      content:e.detail.value,
    })
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
  },
  //获取投诉对象
  GetName(e){
    this.setData({
      CompName:e.detail.value,
    })
  },
  //获取备注
  GetPhone(e){
    this.setData({
      CompPhone:e.detail.value,
    })
  },
  //提交数据
  onSubmit(){
    var uid=app.globalData.userInfo.id;
    var DepartId=this.data.DepartId,DepartVal=this.data.DepartVal,type=this.data.type,payment=this.data.payment,content=this.data.content,CompName=this.data.CompName,CompPhone=this.data.CompPhone,pic=this.data.images;
    var ShowCompInfo=this.data.ShowCompInfo;
    if(DepartVal==''||DepartVal==undefined){
      dd.showToast({
        content:'请选择反馈部门',
        duration:3000,
      });
      return false;
    }
    if(type==1){
      if(payment==''||payment==undefined){
        dd.showToast({
          content:'请填写投诉对象',
          duration:3000,
        });
        return false;
      }
    }
    if(content==''||content==undefined){
      dd.showToast({
          content:'请填写内容描述',
          duration:3000,
        });
      return false;
    }
    if(type==1){
      if(ShowCompInfo){
        var if_real=1//是
        if(CompName==''||CompName==undefined){
          dd.showToast({
            content:'请填写投诉人姓名',
            duration:3000,
          });
          return false;
        }
        if(CompPhone==''||CompPhone==undefined){
          dd.showToast({
            content:'请填写投诉人电话',
            duration:3000,
          });
          return false;
        }
      }
      else{
        var if_real=2//否
      }
    }
    else if(type==2){
      if(CompName==''||CompName==undefined){
        dd.showToast({
          content:'请填写建议人姓名',
          duration:3000,
        });
        return false;
      }
      if(CompPhone==''||CompPhone==undefined){
        dd.showToast({
          content:'请填写建议人电话',
          duration:3000,
        });
        return false;
      }
    }
    console.log(uid,DepartId,DepartVal,type,payment,content,if_real,CompName,CompPhone,pic);
    dd.httpRequest({
      url:URL+'/complain/submit',
      method:'POST',
      data:{
        uid:uid,
        type:type,
        department_id:DepartId,
        if_real:if_real,
        content:content,
        payment:payment,
        complain_name:CompName,
        complain_phone:CompPhone,
        pic:JSON.stringify(pic),
      },
      dataType:'json',
      success(res){
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
          // console.log(res.data.msg);
          dd.showToast({
            content:res.data.msg,
            duration:3000,
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
  // 添加图片
  AddImg(){
    const _this = this;
    dd.chooseImage({
      count:10,
      sourceType:['album', 'camera'],//可以指定来源是相册还是相机，默认二者都有  
      success:(res) => {
        const addImages =res.filePaths;
        // console.log(addImages);
        _this.uploadimg({
          url:URL+'/payapply/uploadimg',
          filePath:addImages,
        });
      },
    })
  },
  // 删除图片
  DelImg(e){
    const index = e.currentTarget.dataset.index;
    this.data.images.splice(index,1);
    const Imgs = this.data.images;
    this.setData({
      images:Imgs,
    });
    console.log(index,this.data.images);
  },
  // 预览图片
  previewImage(e){
    const index = e.currentTarget.dataset.index;
    const Imgs = this.data.images;
    dd.previewImage({
      current:index,
      urls:Imgs,
    })
  },
  // 上传多张图片
  uploadimg(data){
    // console.log(data.filePath);
    var that = this,i = data.i ? data.i : 0,success = data.success ? data.success : 0,fail = data.fail ? data.fail: 0;
    dd.uploadFile({
      url:data.url,
      fileType:'image',
      fileName:'file',
      filePath:data.filePath[i],
      success(res){
        success++;
        var resData = JSON.parse(res.data);
        // console.log(resData.data);
        const Imgs = that.data.images.concat(resData.data);
        that.setData({
          images:Imgs,
        })
        // console.log(that.data.images);
      },
      fail(res){
        fail++;
      },
      complete(res){
        i++;
        if(i == data.filePath.length){
          console.log("执行完毕，成功"+success+"失败"+fail);
        }else{
          data.i=i;
          data.success=success;
          data.fail=fail;
          that.uploadimg(data);
        }
      }
    })
  },
});
