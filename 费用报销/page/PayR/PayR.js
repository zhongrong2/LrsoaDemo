let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    states:[
      {id:'1',name:'非常紧急',value:'非常紧急',checked:''},
      {id:'2',name:'紧急',value:'紧急',checked:''},
      {id:'3',name:'一般',value:'一般',checked:'true'},
    ],//紧急程度
    dateVal:'',//日期
    showSelect:false,//下拉框发票信息展示
    selectId:'',//选择发票信息的id
    selectVal:'',//选择发票信息值
    accountId:'',//选择收款账户id
    account:'',//收款账户
    images:[],//图片
    count:'',//抄送人id
    CopMem:[],//抄送人信息
    level:'3',//默认紧急程度
    hasOnshow:false,
  },
  onLoad(options) {
    this.setData({
      userInfo:app.globalData.userInfo,
      id:options.id,
    })    
    console.log(options.id);
    if(options.id!=undefined){
      this.GetInfo();
      this.CopAllShow();
    }
  },
  onShow(){
    var that = this;
    if(that.data.hasOnshow){
      that.CopAllShow();
    }
    that.setData({
      hasOnshow:true,
    })
  },
  //选择时间
  ChoseData(){
    const _this = this;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var time;
    if(month>0 && month<10){
      if(day>0 && day<10){
        time = year+"-"+"0"+month+"-"+"0"+day;
      }
      else{
        time = year+"-"+"0"+month+"-"+day;
      }
    }
    else{
      if(day>0 && day<10){
        time = year+"-"+month+"-"+"0"+day;
      }
      else{
        time = year+"-"+month+"-"+day;
      }
    }
    // console.log(time);
    dd.datePicker({
      format:'yyyy-MM-dd',
      success:(res) => {
        // console.log(res);
        if(time >= res.date){
          dd.alert({content:'不能选择当天'})
        }
        else{
           _this.setData({
            dateVal:res.date
          })
        }
      }
    })
  },
  //显示下拉框
  ShowSelect(){
    const url = URL+'/payapply/getInvoice';
    app.ShowSelect(this,url);
  },
  //选择下拉框值
  SelectItem(e){
    app.SelectItem(this,e);
  },
  // 添加图片
  AddImg(){
    const _this = this;
    dd.chooseImage({
      count:10,
      success:(res) => {
        const addImages =res.filePaths;
        const Imgs = _this.data.images.concat(addImages);
        _this.setData({
          images:Imgs,
        })
        console.log(_this.data.images);
        app.uploadimg({
          url:app.globalData.http+'/payapply/uploadimg',
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
    app.globalData.imgArr.splice(index,1);
    console.log(index,Imgs,app.globalData.imgArr);
    this.setData({
      images:Imgs,
    })
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
  // 选择抄送人
  ChoseCopier(){
    dd.navigateTo({
      url:'/page/PayR/ChoseCopier/ChoseCopier'
    })
  },
  // 多个抄送人显示
  CopAllShow(){
    const CopMem = this.data.CopMem;
    if(CopMem.length>3){
      const newCopMem = CopMem.slice(0,2);
      // console.log(CopMem,newCopMem);
      this.setData({
        newCopMem:newCopMem
      })
    }
    else{
      this.setData({
        CopMem:CopMem
      })
    }
  },
  //取消选中抄送人
  DelCopier(e){
    const index = e.currentTarget.dataset.index;
    this.data.CopMem.splice(index,1);
    const NewDelCop = this.data.CopMem;
    console.log(this.data.count);
    this.data.count.splice(index,1);
    const NewDelCount = this.data.count;
    console.log(index,this.data.CopMem,NewDelCop);
    this.setData({
      CopMem:NewDelCop
    });
    this.CopAllShow();
  },
  // 超过3个抄送跳转页面
  ShowCopAll(){
    var count = JSON.stringify(this.data.count);
    var CopMem = JSON.stringify(this.data.CopMem);
    console.log(count);
    dd.navigateTo({
      url:'/page/PayR/Copiers/Copiers?count='+count+'&CopMem='+CopMem
    })
  },
  //选择收款账户
  ChoseAccount(){
    dd.navigateTo({
      url:'/page/PayR/ChoseAccount/ChoseAccount'
    })
  },
  //获取付款事由
  GetReason(e){
    this.setData({
      reason:e.detail.value,
    })
  },
  //获取金额
  GetMoneny(e){
    this.setData({
      money:e.detail.value,
    })
  },
  //获取支付对象
  GetPayment(e){
    this.setData({
      payment:e.detail.value,
    })
  },
  //获取紧急程度
  GetLevel(e){
    this.setData({
      level:e.detail.value,
    })
  },
  //获取备注
  GetContent(e){
    this.setData({
      content:e.detail.value,
    })
  },
  // 提交数据
  onSubmit(){
    // console.log(this.data.reason);
    const that = this,uid = that.data.userInfo.id,departId = that.data.userInfo.department_id,reason = that.data.reason,money = that.data.money,dateVal = that.data.dateVal,selectId = that.data.selectId,payment = that.data.payment,accountId = that.data.accountId,pics = app.globalData.imgArr,arr = that.data.count,level = that.data.level,content = that.data.content;
    console.log(pic);
    if(reason == '' || reason == undefined){
      dd.showToast({
        content:'请输入申请事由',
        duration:3000,
      });
      return false;
    }
    if(money == '' || money == undefined){
      dd.showToast({
        content:'请输入付款金额',
        duration:3000,
      });
      return false;
    }
    if(dateVal == '' || dateVal == undefined){
      dd.showToast({
        content:'请选择支付时间',
        duration:3000,
      });
      return false;
    }
    if(selectId == '' || selectId == undefined){
      dd.showToast({
        content:'请选择发票信息',
        duration:3000,
      });
      return false;
    }
    if(payment == '' || payment == undefined){
      dd.showToast({
        content:'请输入支付对象名称/单位',
        duration:3000,
      });
      return false;
    }
    if(accountId == '' || accountId == undefined){
      dd.showToast({
        content:'请填写收款账号',
        duration:3000,
      });
      return false;
    }
    var cc_uids = arr.toString(),pic = JSON.stringify(pics);
    // console.log(uid,departId,reason,money,dateVal,selectId,payment,accountId,pic,cc_uids,level,content);
    dd.httpRequest({
      url:URL+'/payapply/submit',
      method:'POST',
      data:{
        uid:uid,
        department_id:departId,
        title:reason,
        money:money,
        pay_time:dateVal,
        invoice_type:selectId,
        payment:payment,
        account_id:accountId,
        pic: pic,
        cc_uids:cc_uids,
        level:level,
        content:content,
      },
      dataType:'json',
      success(res){
        console.log(res.data);
        if(res.data.code == 0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          });
          dd.switchTab({
            url:'/page/init/init'
          })
          that.setData({
            reason:'',
            money:'',
            dateVal:'',//日期
            showSelect:false,//下拉框发票信息展示
            selectId:'',//选择发票信息的id
            selectVal:'',//选择发票信息值
            payment:'',
            accountId:'',//选择收款账户id
            account:'',//收款账户
            content:'',
            images:[],//图片
            count:'',//抄送人id
            CopMem:[],//抄送人信息
            level:'3',//默认紧急程度
            'states[0].checked':false,
            'states[1].checked':false,
            'states[2].checked':true,
          })
        }
        else{
          dd.showToast({
            content:res.data.msg,
            duration:3000,
          });
        }
      },
      fail(err){
        console.log(err);
      },
    })
    return true;
  },
  // 获取修改订单详情
  GetInfo(){
    var that=this,id =that.data.id;
    that.setData({
      userInfo:app.globalData.userInfo
    });
    // console.log(id)
    var uid=that.data.userInfo.id;
    dd.httpRequest({
      url:URL+'/payapply/detail',
      method:'POST',
      data:{
        id:id,
        uid:uid,
        type:'isend',
      },
      dataType:'json',
      success(res){
        console.log(res);
        var Info = res.data.data,level;
        if(Info.bill_info.level=='一般'){
          level=3;
          that.setData({
            'states[0].checked':false,
            'states[1].checked':false,
            'states[2].checked':true,
          })
        }
        else if(Info.bill_info.level=='紧急'){
          level=2;
          that.setData({
            'states[0].checked':false,
            'states[1].checked':true,
            'states[2].checked':false,
          })
        }
        else if(Info.bill_info.level=='非常紧急'){
          level=1;
          that.setData({
            'states[0].checked':true,
            'states[1].checked':false,
            'states[2].checked':false,
          })
        };
        var arr = Info.bill_info.cc_uids.split(',');
        for(var i in arr){
          arr[i]
        }
        console.log(Info.bill_info,arr)
        that.setData({
          reason:Info.bill_info.title,
          money:Info.bill_info.money,
          dateVal:Info.bill_info.pay_time,
          selectVal:Info.bill_info.invoice_type,
          selectId:Info.bill_info.invoice_id,
          payment:Info.bill_info.payment,
          account:Info.account_info.account,
          accountId:Info.bill_info.id,
          content:Info.account_info.content,
          images:Info.account_info.pic,
          count:arr,
          CopMem:Info.cc_uids,
          level:level,
        })
        console.log(that.data.count,that.data.CopMem);
        dd.hideLoading();
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
