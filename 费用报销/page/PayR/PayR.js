let app = getApp();
let URL = app.globalData.http;

Page({
  data: {
    states:[
      {id:'1',name:'非常紧急',value:'非常紧急',checked:''},
      {id:'2',name:'紧急',value:'紧急',checked:''},
      {id:'3',name:'一般',value:'一般',checked:'true'},
    ],//紧急程度
    DepartId:'',//申请部门id
    DepartVal:'',//申请部门
    ProMemId:'',//申请人id
    ProMemVal:'',//申请人
    BillTypeId:'',//付款类型Id
    BillType:'',//付款类型
    dateVal:'',//日期
    showSelect:false,//下拉框发票信息展示
    selectId:'',//选择发票信息的id
    selectVal:'',//选择发票信息值
    accountId:'',//选择收款账户id
    accountName:'',//收款账户名称
    account:'',//收款账户
    images:[],//图片
    count:'',//抄送人id
    CopMem:[],//抄送人信息
    level:'3',//默认紧急程度
    hasOnshow:false,
  },
  onLoad(options) {
    var that = this;
    that.setData({
      userInfo:app.globalData.userInfo,
      id:options.id,//订单id
    })
    console.log(options.id);
    if(options.id!=undefined){
      that.GetInfo();
      var CopMem = that.data.CopMem;
      if(CopMem.length>0){//判断有抄送人调用多个抄送人显示方法
        that.CopAllShow();
      }
    }
  },
  onShow(){
    if(this.data.hasOnshow){
     this.CopAllShow();
    }
    this.setData({
      hasOnshow:true,
    });
  },
  //选择付款类型
  ChoseBillType(){
    this.setData({
      reason:'',
      money:'',
      dateVal:'',
      selectId:'',//选择发票信息的id
      selectVal:'',//选择发票信息值
      accountId:'',//选择收款账户id
      accountName:'',//收款账户名称
      account:'',//收款账户
      images:[],//图片
      count:'',//抄送人id
      CopMem:[],//抄送人信息
      level:'3',//默认紧急程度
    })
    dd.navigateTo({
      url:'/page/PayR/BillType/BillType'
    })
  },
  //选择时间
  ChoseData(){
    const _this = this;
    dd.datePicker({
      format:'yyyy-MM-dd',
      success:(res) => {
        // console.log(res);
        
           _this.setData({
            dateVal:res.date
          })
        
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
    // console.log(index,this.data.CopMem,NewDelCop);
    this.setData({
      CopMem:NewDelCop
    });
    this.CopAllShow();
  },
  // 超过3个抄送跳转页面
  ShowCopAll(){
    var count = JSON.stringify(this.data.count);
    var CopMem = JSON.stringify(this.data.CopMem);
    // console.log(count);
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
  // 选择申请部门
  ChoseDepart(){
    dd.navigateTo({
      url:'/page/PayR/ChoseDepart/ChoseDepart'
    })
  },
  // 选择申请人
  ChoseProposer(){
    dd.navigateTo({
      url:'/page/PayR/ChoseProposer/ChoseProposer'
    })
  },
  // 提交数据
  onSubmit(){
    var that = this,uid = that.data.userInfo.id,departId = that.data.userInfo.department_id,BillTypeId=that.data.BillTypeId,reason = that.data.reason,money = that.data.money,dateVal = that.data.dateVal,selectId = that.data.selectId,payment = that.data.payment,accountId = that.data.accountId,pics = that.data.images,arr = that.data.count,level = that.data.level,content = that.data.content,DepartId=that.data.DepartId,ProMemId=that.data.ProMemId,BillType=that.data.BillType;
    if(DepartId == '' || DepartId == undefined){
      dd.showToast({
        content:'请选择申请部门',
        duration:3000,
      });
      return false;
    }
    if(ProMemId == '' || ProMemId == undefined){
      dd.showToast({
        content:'请选择申请人',
        duration:3000,
      });
      return false;
    }
    if(BillTypeId == '' || BillTypeId == undefined){
      dd.showToast({
        content:'请选择付款类型',
        duration:3000,
      });
      return false;
    }
    if(reason == '' || reason == undefined){
      dd.showToast({
        content:'请输入申请事由',
        duration:3000,
      });
      return false;
    }
    if(BillTypeId==34){
      this.setData({
        accountId:1,//选择收款账户id
      });
      if(dateVal == '' || dateVal == undefined){
        dd.showToast({
          content:'请选择支付时间',
          duration:3000,
        });
        return false;
      }
    }
    if(BillTypeId!=34){
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
      if(payment == '' || payment == undefined){
        dd.showToast({
          content:'请输入收款对象名称/单位',
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
    }
    if(BillTypeId==35){
      if(content==''||content==undefined){
        dd.showToast({
          content:'请填写油号、吨位、供应商信息',
          duration:3000,
        });
        return false;
      }
    }
    var cc_uids = arr.toString(),pic = JSON.stringify(pics);
    var accountId = that.data.accountId;
    console.log(pic);
    dd.httpRequest({
      url:URL+'/payapply/submit',
      method:'POST',
      data:{
        uid:uid,
        department_id:departId,
        type:BillTypeId,
        department_id:DepartId,
        apply_uids:ProMemId,
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
        id:that.data.id,
      },
      dataType:'json',
      success(res){
        // console.log(res.data);
        if(res.data.code == 0){
          dd.showToast({
            content:res.data.data,
            duration:3000,
          });
          // console.log(Page);
          dd.switchTab({
            url:'/page/init/init',
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
        dd.showToast({
          content:'网络出错',
          duration:3000,
        });
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
        // console.log(res.data.data);
        dd.hideLoading();
        if(res.data.code==0){//判断状态
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
          
          if(Info.bill_info.content!=null){//判断备注是否有值
            that.setData({
              content:Info.bill_info.content
            })
          }
          var uids = Info.bill_info.cc_uids;//抄送人
          if(uids!=null){//判断抄送人是否有值
            var arr = uids.split(',');
            for(var i in arr){
              arr[i]
            }
          }
          else{
            arr = [];
          }
          if(Info.account_info.pic!=null){//如果没有图片
            // console.log(Info.account_info.pic);
            that.setData({
              images:Info.account_info.pic,
            })
          }
          // console.log(Info,arr)
          that.setData({
            DepartId:Info.bill_info.department,//申请部门id
            DepartVal:Info.bill_info.department_id,//申请部门
            ProMemId:Info.bill_info.apply_uids,//申请人id
            ProMemVal:Info.bill_info.apply_names,//申请人
            BillTypeId:Info.bill_info.type_id,
            BillType:Info.bill_info.type,
            reason:Info.bill_info.title,
            money:Info.bill_info.money,
            dateVal:Info.bill_info.pay_time,
            selectVal:Info.bill_info.invoice_type,
            selectId:Info.bill_info.invoice_id,
            payment:Info.bill_info.payment,
            account:Info.account_info.account,
            accountName:Info.account_info.name,
            accountId:Info.account_info.id,
            count:arr,
            CopMem:Info.cc_uids,
            level:level,
          });
          if(Info.account_info.id==1){//判断是现金显示现金
            that.setData({
              accountName:Info.account_info.type,
            })
          }
        }
        else if(res.data.code==1){
          dd.showLoading({
            content: '加载中...',
            delay: 1000,
          });
        }
        // console.log(that.data.count,that.data.CopMem);
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
