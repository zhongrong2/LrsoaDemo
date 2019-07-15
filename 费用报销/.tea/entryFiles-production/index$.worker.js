if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;


function success() {
require('../..//app');
require('../../page/index/index');
require('../../page/PayR/PayR');
require('../../page/PayR/ChoseCopier/ChoseCopier');
require('../../page/PayR/Copiers/Copiers');
require('../../page/PayR/AccApipay/AccApipay');
require('../../page/PayR/ChoseAccount/ChoseAccount');
require('../../page/PayR/AccPersonal/AccPersonal');
require('../../page/PayR/AccPublic/AccPublic');
require('../../page/PayR/ChoseArea/ChoseArea');
require('../../page/appr/appr');
require('../../page/appr/DetailPendAppr/DetailPendAppr');
require('../../page/init/init');
require('../../page/init/DetailPendAppr/DetailPendAppr');
require('../../page/CC/CC');
require('../../page/CC/DetailInfo/DetailInfo');
require('../../component/grid/grid');
require('../../component/select/select');
require('../../component/nav/nav');
require('../../component/dataList/dataList');
require('../../component/dataInfo/apprInfo/apprInfo');
require('../../component/dataInfo/apprExam/apprExam');
require('../../component/dataInfo/CC/CC');
require('../../page/PayR/ChoseBank/ChoseBank');
require('../../component/dataInfo/headInfo/headInfo');
require('../../page/PayR/ChoseBankSub/ChoseBankSub');
require('../../page/detail/detail');
require('../../page/PayR/BillType/BillType');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}