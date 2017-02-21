  /**
   * Created by huangzhen on 2016/8/29.
   */
   //格式化电话号码，用于验证码
   String.prototype.toPhone = function () {
       return '**' + this.slice(7, 11);
   }
   //转化为亿万元
   Number.prototype.toChineseUnit = function(unitIndex){
       if(this < 10000){
           return this;
       }else if(this >=10000 && this<100000000){
           return Math.floor(this/10000) + "万";
       }else if(this >= 100000000){
           if(unitIndex == 9){
               return Math.floor(this/100000000) + "亿"
           }else{
               return Math.floor(this/100000000) + "亿" + Math.floor((this-Math.floor(this/100000000)*100000000)/10000) + "万";
           }
       }
   }
   //格式化日期
   Date.prototype.format = function (fmt) {
       var year = this.getFullYear();
       var month = this.getMonth() + 1;
       var date = this.getDate();
       var hour = this.getHours();
       var minute = this.getMinutes();
       var second = this.getSeconds();
  
       fmt = fmt.replace("yyyy", year);
       fmt = fmt.replace("yy", year % 100);
       fmt = fmt.replace("MM", fix(month));
       fmt = fmt.replace("dd", fix(this.getDate()));
       fmt = fmt.replace("hh", fix(this.getHours()));
       fmt = fmt.replace("mm", fix(this.getMinutes()));
       fmt = fmt.replace("ss", fix(this.getSeconds()));
       return fmt;
       function fix(n) {
           return n < 10 ? "0" + n : n;
       }
   }
   Date.prototype.formatLong = function (format) {
       var date = this;
  
       var map = {
           "M": date.getMonth() + 1, //月份
           "d": date.getDate(), //日
           "h": date.getHours(), //小时
           "m": date.getMinutes(), //分
           "s": date.getSeconds(), //秒
           "q": Math.floor((date.getMonth() + 3) / 3), //季度
           "S": date.getMilliseconds() //毫秒
       };
  
       format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
           var v = map[t];
           if (v !== undefined) {
               if (all.length > 1) {
                   v = '0' + v;
                   v = v.substr(v.length - 2);
               }
               return v;
           }
           else if (t === 'y') {
               return (date.getFullYear() + '').substr(4 - all.length);
           }
           return all;
       });
       return format;
   };
  var util = {
  };
  /**
   * 获取cms配置
   * @param callback
   */
  util.getCmsSetting = function(cmsId,callback){
      window['fn_activityGetData_'+ cmsId] = function (data){
          //var cmsData = eval("(" +data.content+")");
          //!!callback && callback(cmsData);
      };
      $.ajax({
          url: Config.cmsUrl +'/json/'+ cmsId+'.json',
          type: 'get',
          dataType: 'jsonp',
          jsonpCallback: 'fn_activityGetData_'+ cmsId,
          timeout: 5000,
          success:function(data){
              var cmsData = eval("(" +data.content+")");
              var cmsSetting = {};
              cmsData.configArray.forEach(function(item){
                  cmsSetting[item.name] = {
                      value:item.src,
                      des:item.des
                  }
              });
              !!callback && callback(cmsSetting);
          },
          error: function(data) {
              console.log(data);
              $("#js-rule-wrap").hide();
              pp.loading.close();
              pp.toast("网络出错，请稍后再试");
          }
      });
  };
  util.isWeixin = function(){
      return navigator.userAgent.indexOf('MicroMessenger') > -1;
  };
  /**
   * 判断活动时间
   * @param data
   */
  util.checkActivityTime = function(data){
      var serverNow = util.strToDate(data.time).getTime();
      var actStart = util.strToDate(data.start).getTime();
      var actEnd = util.strToDate(data.end).getTime();
      var rankEnd = util.strToDate(data.end).getTime() + 24*60*60*1000;//排行榜数据多展示一天
      var actTimeObj = {
          isStart:false,
          isEnd:false,
          isStopRank: false
      };
  
      if(serverNow < actStart){
          actTimeObj.isStart = false;
      }else if(serverNow < actEnd){
          actTimeObj.isStart = true;
          actTimeObj.isEnd = false;
      }else{
          actTimeObj.isStart = true;
          actTimeObj.isEnd = true;
          if(serverNow < rankEnd){
              actTimeObj.isStopRank = false;
          }else{
              actTimeObj.isStopRank = true;
          }
  
      }
      return actTimeObj;
  };
  /**
   * 将字符串 /Date(1473402432000)/转成Date对象
   * @param string
   * @returns {Date}
   */
  util.strToDate = function(str){
      var date = new Date(str);
      if (date == "Invalid Date") {
          date = new Date(parseFloat(str.match(/\d+/)));
      }
      if (date == "Invalid Date") {
          return false;
      }
  
      return date;
  };
  //如果不传参时返回Url中的所有参数
  util.getUrlParam = function(){
      var result = {};
      var search = [];
      var url = !!arguments[1] ? arguments[1] : location.search.slice(1);
      var search = url.split("&");
      var secArray=[]
      for(var i =0;i<search.length;i++){
          secArray = search[i].split("=");
          if(secArray[0]!=''){
              result[secArray[0]] = secArray[1];
          }
      }
      if(arguments[0]!=undefined){
          return  result[arguments[0]];
      }else{
          return result;
      }
  },
  //重置Url参数，并将Url返回
  util.setUrlparam = function(key,value){
      var urlParam = getUrlParam();
      if(typeof key =="object"){
          for(var item in key){
              isLoad = (urlParam[item] != key[item]);
              urlParam[item] = key[item];
          }
      }else{
          isLoad = (urlParam[key] != value);
          urlParam[key] = value;
      };
      var search = "?";
      for(var item in urlParam){
          if(urlParam[item] === undefined){
              search+=item+"&";
          }else{
              search+=item+"="+urlParam[item]+"&";
          }
      }
      search = search.slice(0,search.length-1);
      var returnUrl=''
      if(location.href.indexOf("?")>-1){
          returnUrl = location.href.slice(0, location.href.indexOf("?")) + search;
      }else{
          returnUrl = location.href +search;
      }
      return returnUrl;
  };
  util.checkPc = function(){
      if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
          return false;
      }
      else {
          return true;
      }
  };
  /**
   * 构建handlebars活动规则
   * @param cmsRule
   */
  util.buildRuleListFromCmsData = function(cmsRule){
      var result = []
      if($.isArray(cmsRule)){
          cmsRule.forEach(function(item,index){
              result.push((index+1)+"、"+item)
          });
      }
      return result;
  }
  util.UserCookie = {
      init: window.navigator.cookieEnabled ? true : false,
      setItem: function (key, value, expireTimes) {
          if (!util.UserCookie.init) {
              return;
          }
          var expires = new Date();
          expires.setTime(expires.getTime() + expireTimes)
          var val = escape(value);
          document.cookie = key + "=" + val +
  //                        ((expireTimes == null) ? "" : ";expires=" + expires.toGMTString() + "; path=/;")
              ((expireTimes == null) ? "" : ";expires=" + expires.toGMTString() + "; path=/;" + (window.location.toString().indexOf(".ppmoney.") > 0 ? "domain=.ppmoney.com" : ""))
      },
      getItem: function (key) {
          if (!util.UserCookie.init) {
              return;
          }
          if (document.cookie.length > 0) {
              var start = document.cookie.indexOf(key + "=")
              if (start != -1) {
                  start = start + key.length + 1
                  var end = document.cookie.indexOf(";", start)
                  if (end == -1)
                      end = document.cookie.length
                  return unescape(document.cookie.substring(start, end))
              }
          }
          return ""
      },
      clear: function () {
          if (!util.UserCookie.init) {
              return;
          }
          if (document.cookie.length > 0) {
              document.cookie.clear();
          }
      },
      removeItem: function (key) {
          if (!util.UserCookie.init) {
              return;
          }
          if (document.cookie.length > 0) {
              var old = util.UserCookie.getItem(key);
              if (old != null)
                  util.UserCookie.setItem(key, old, -999);
          }
      }
  };
  util.removeBr = function(str){
      str = str.replace(/(<br>)|(<\/br>)|(<br\/>)/g,"");
      return str
  };
  
  util.numFormat = function (num,length,separator) {//数字格式化，添加","
      var dd = "";
      var temp = "";
      var length = length || 0;
      var point = num.toString().split('.')[1] || 0;
      var separator = separator || ",";
      if (length == 0) {
          point = '';
      } else {
          point = '.' + (point + '000').substring(0, length);
      }
  
      function format(num) {
          num = num.toString().split('.')[0];
          if (num.length <= 3) {
              temp = num.concat(dd);
              return temp + point;
          }
          var ss = "";
          ss = separator + num.substr(num.length - 3, 3);
          dd = ss.concat(dd);
          format(num.substring(0, num.length - 3));
      }
      format(num);
      return temp + point;
  };
  
  util.wxConfig = function(url) {
      $.ajax({
  //      url: "http://weixin.ppmoney.net/ShareWeixin/ConfigAsync",
          url:url + "/ShareWeixin/ConfigAsync",
          type: "GET",
          async:true,
          dataType: "jsonp",
          data: {
              url:window.location.href
          },
          success: function (result) {
              console.log("success");
              var jsCode = "wx.config({"+
                  "appId:'"+result.AppId+
                  "',timestamp:'"+result.Data.Timestamp+
                  "',nonceStr:'"+result.Data.Noncestr+
                  "',signature:'"+result.Data.Signature+
                  "',url:'"+result.Data.Url+
                  "',debug: false,jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage']});";
              eval(jsCode);
  
          },
          error: function () {
          }
      })
  }
  
  //设置分享
  util.menuShareTimeline = function(shareTitle,shareDesc,shareImgUrl,shareUrl) {
      //分享微信朋友圈
      wx.onMenuShareTimeline({
          title: shareTitle,
          link: shareUrl,
          imgUrl: shareImgUrl,
          success: function () {},
          cancel: function () {},
          error: function () {}
      });
      //发送朋友
      wx.onMenuShareAppMessage({
          title: shareTitle, // 分享标题
          desc: shareDesc, // 分享描述
          link: shareUrl, // 分享链接
          imgUrl:shareImgUrl,
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });
      //分享到微博
      wx.onMenuShareWeibo({
          title: shareTitle, // 分享标题
          desc: shareDesc, // 分享描述
          link: shareUrl, // 分享链接
          imgUrl: shareImgUrl, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });
      //分享到QQ空间
      wx.onMenuShareQZone({
          title: shareTitle, // 分享标题
          desc: shareDesc, // 分享描述
          link: shareUrl, // 分享链接
          imgUrl: shareImgUrl, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });
      //分享到QQ
      wx.onMenuShareQQ({
          title: shareTitle, // 分享标题
          desc: shareDesc, // 分享描述
          link: shareUrl, // 分享链接
          imgUrl: shareImgUrl, // 分享图标
          success: function ()
          {
              // 用户确认分享后执行的回调函数
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
          }
      });
  }
  util.getQueryString = function(name){
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = location.search.substr(1).match(reg) || location.hash.substr(1).match(reg);
      if (r != null)
          return unescape(r[2]);
      return '';
  }
  util.bindPiwik = function() {
      pp.click(document,function(e){
          var $target = $(e.target);
          if($target.is("[data-pk]")){
              // if($target.is("a")){
              //     e.preventDefault();
              // }
              var pkData = $target.data("pk");
              pkData = eval(pkData);
              if($.isArray(pkData)){
                  pkData.unshift("trackEvent");
                  if(util.isWeixin()){
                      pkData[1] = "WX-" + pkData[1];
                  }else if(util.getUrlParam("source") == "app"){
                      pkData[1] = "APP-" + pkData[1];
                  }else{
                      pkData[1] = "WAP-" + pkData[1];
                  }
                  pkData[3] = pkData[1]+"_"+pkData[2]+"_"+pkData[3]
                  !!_paq && _paq.push(pkData);
              }
              // if($target.is("a")){
              //     location.href = $target.attr("href");
              // }
          }
      });
  }
  util.formatDate = function(str){
          var receiveDay = util.strToDate(str);
          console.log()
          var formatReceiveDay = receiveDay.format("yyyy-MM-dd");
          var today = new Date().format("yyyy-MM-dd");
          var yesterday = new Date(new Date().getTime() - 86400000).format("yyyy-MM-dd");
          var date = "---";
          if(formatReceiveDay == today){ //今天
              date = receiveDay.format("今天 hh:mm");
          }else if(formatReceiveDay == yesterday){
              date = receiveDay.format("昨天 hh:mm");
          }else{
              date = receiveDay.format("yyyy-MM-dd hh:mm");
          }
          return date;
      };
  /*倒计时 end*/
  module.exports = util;
