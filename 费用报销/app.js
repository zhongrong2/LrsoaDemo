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
          dd.alert({
            title: '提示',
            content:'请退出重新登录',
            buttonText: '知道了',
            success: () => {},
          })
          return;
        }
        that.GetUid(that,code);
      },
      fail(err){
        console.log(err);
        dd.showToast({
          content:'网络出错',
          duration:1000,
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
                // that.globalData.userInfo = data.data;
                that.globalData.userInfo = data.data.user_info;
                that.SaveSession(data.data.token);
              }
              else{
                dd.showToast({
                  content:res.data.msg,
                  duration:1000,
                })
              }
            },
            fail(err){
              dd.showToast({
                content:'网络出错',
                duration:1000,
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
                // const Id = data.data.id;
                const Id = data.data.user_info.id;
                dd.setStorage({
                  key:'uid',
                  data:{
                    uid:Id,
                  }
                });
                // that.globalData.userInfo = data.data;
                that.globalData.userInfo = data.data.user_info;
                that.SaveSession(data.data.token);
              }
              else{
                dd.showToast({
                  content:res.data.msg,
                  duration:1000,
                })
              }
                      
            },
            fail(err){
              dd.showToast({
                content:'网络出错',
                duration:1000,
              })
            }
          })
        }
      },
      fail: function(res){
        console.log(res);
        dd.showToast({
          content:'网络出错',
          duration:1000,
        })
      }
    });
  },
  //保存session
  SaveSession(token){
    var that = this;
    dd.httpRequest({
      url:that.globalData.http+'/ding/session',
      method:'POST',
      data:{
        token:token,
      },
      dataType:'json',
      success(res){
        // console.log(res);
        var data = res.data;
        if(data.code==0){}
        else{
          dd.showToast({
            content:'网络出错',
            duration:1000,
          })
        }
      },
      fail: function(res){
        console.log(res);
        dd.showToast({
          content:'网络出错',
          duration:1000,
        })
      }
    })
  },
  onShow(options) {
    // 从后台被scheme重新打开
    // options.query == {number:1}
  },
  globalData:{
    userInfo:'',
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
            duration:1000,
          })
        }
      },
      fail(err){
        dd.showToast({
          content:'网络出错',
          duration:1000,
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
