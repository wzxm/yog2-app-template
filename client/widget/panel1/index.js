/**
 * Created by lianxc on 2016/10/21.
 */
/* 严格模式 */
"use strict";

/* 公共方法 */

const panelHtml = __inline("./index.handlebars");
const util = require("common:widget/lib/util");

let config = {
    goldTimes: 0, //金蛋机会
    colorTimes: 0, //彩蛋机会
    isLogin: false,
    actTimeObj: {
        isEnd : false
    }
};

class activityOne {
    /* 构造方法 */
    constructor(wrapper, _opt) {
        
    }
    getFestivalImg() {
        $('#middle').append(panelHtml(config))
        
    }
}
module.exports = activityOne;
