App({
  onLaunch(options) {
    // 第一次打开
    const that = this;
    // console.info('App onLaunch');
    dd.getAuthCode({
      success(res){
        const code = res.authCode;
        console.log(code);
        if(code=='200, 注意：这不是一个真实的 authCode，请登录并关联应用后再次执行'){
          dd.showToast({
            content:'请登录',
            duration:3000,
          })
          return;
        }
        that.GetUid(that,code);
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
      }
    });
  },
  //获取缓存uid
  GetUid(that,code){
    var KeyRes;
    dd.getStorage({
      key:'uid',
      success: function(res) {
        // console.log(res);
        KeyRes = res.data;
        // console.log(res.data);
        if(KeyRes!=null){
          var uid = KeyRes.uid;
          dd.httpRequest({
            url:that.globalData.http+'/common/userInfo',
            method:'POST',
            data:{
              uid:uid,
            },
            dataType:'json',
            success(res){
              const data = res.data;
              // console.log(data);
              if(data.code == 0){
                that.globalData.userInfo = data.data;
                // console.log(that.globalData.userInfo);
              }
              else{
                dd.showToast({
                  content:res.data.msg,
                  duration:3000,
                })
              }
            },
            fail(err){
              dd.showToast({
                content:'网络出错',
                duration:3000,
              })
            }
          })
        }
        else{
          dd.httpRequest({
            url:that.globalData.http+'/ding/index',
            method:'POST',
            data:{
              code:code,
            },
            dataType:'json',
            success(res){
              const data = res.data;
              // console.log(data);
              if(data.code == 0){
                // console.log(data.data.id,'获取uid');
                const Id = data.data.id;
                dd.setStorage({
                  key:'uid',
                  data:{
                    uid:Id,
                  }
                });
                that.globalData.userInfo = data.data;
                // console.log(that.globalData.userInfo);
              }
              else{
                dd.showToast({
                  content:res.data.msg,
                  duration:3000,
                })
              }
                      
            },
            fail(err){
              dd.showToast({
                content:'网络出错',
                duration:3000,
              })
            }
          })
        }
      },
      fail: function(res){
        console.log(res);
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
      }
    });
  },
  onShow(options) {
    // 从后台被scheme重新打开
    // options.query == {number:1}
  },
  globalData:{
    userInfo:'',
    imgArr:[],
    http:"http://www.longshihua.cn:8009",
  },
  // 显示下拉框
  ShowSelect(that,URL){
    dd.httpRequest({
      url:URL,
      method:'POST',
      dataType:'json',
      success(res){
        // console.log(res.data.data);
        if(res.data.code == 0){
          that.setData({
            showSelect:!that.data.showSelect,
            select:res.data.data,
          });
        }
        else{
          dd.showToast({
            content:'请稍等',
            duration:3000,
          })
        }
      },
      fail(err){
        dd.showToast({
          content:'网络出错',
          duration:3000,
        })
      }
    })
  },
  // 选择下拉框
  SelectItem(that,index){
    const Index = index.currentTarget.dataset.index;
    const Val = index.currentTarget.dataset.text;
    // console.log(Index,Val);
    that.setData({
      selectVal:Val,
      selectId:Index,
      showSelect:false,
    })
  },
  // 上传多张图片
  uploadimg(data){
    // console.log(data.filePath);
    var that = this,i = data.i ? data.i : 0,success = data.success ? data.success : 0,fail = data.fail ? data.fail: 0;
    // console.log(i,success,fail);
    dd.uploadFile({
      url:data.url,
      fileType:'image',
      fileName:'file',
      filePath:data.filePath[i],
      success(res){
        success++;
        var resData = JSON.parse(res.data);
        // console.log(resData.data);
        that.globalData.imgArr == that.globalData.imgArr.push(resData.data);
        console.log(that.globalData.imgArr);
      },
      fail(res){
        fail++;
        // console.log(fail);
      },
      complete(res){
        i++;
        if(i == data.filePath.length){
          console.log("执行完毕，成功"+success+"失败"+fail);
        }else{
          // console.log(i);
          data.i=i;
          data.success=success;
          data.fail=fail;
          that.uploadimg(data);
        }
      }
    })
  },
  // 在数据中添加消息展示参数
  addTag(data){
    for(var i = 0; i < data.navItem.nav.length; i++){
      data.navItem.nav[i].numShow = true;
    }
    // console.log(data.navItem.nav)
  },
  // 判断没有消息时不显示
  InfoShow(that){
    const nav = that.data.navItem.nav;
    var _this = that;
    nav.forEach(function(item,index){
      // console.log(item.count);
      if(item.count == 0 || item.count == ''){
        nav[index].numShow = !nav[index].numShow
        _this.setData({
          'navItem.nav':nav
        })
      }
    })
  },
  // 选择状态导航栏
  NavTap(index,that){
    const Index = index.currentTarget.dataset.index;
    // console.log(Index);
    that.setData({
      'navItem.navIndex':Index,
    })
  },
});
