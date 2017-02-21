var sconfig = require('./client/widget/config.js');
var config = require('../yog/config.js');
var url = sconfig.domainFolder;
var path = require('path');
var fs = require('fs'),stat = fs.stat;
var upyunSDK = require("node-upyun-sdk");
var upyun = upyunSDK(config.space, config.name, config.pwd);
var namespace = sconfig.name;
var folder = '../yog/static/' + namespace;

if (upyun) {
    console.log('UPYUN连接成功...')
    getPackage(folder)
}

function upload(fileName,localFile) {
    if(localFile.match('server/')) return false;
    upyun.upload(fileName, localFile).then(function(data){
        console.log("上传成功:"+fileName);
    }).catch(function(error){
        console.log("上传失败:"+fileName);
    });
}

/*
* 遍历目录中的所有文件包括子目录
* @param{ String } 需要复制的目录
* @param{ String } 复制到指定的目录
*/
function getPackage(src) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function(err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function(copypath) {
            var _src = src + '/' + copypath,
                _dst = 'res/' + src + '/' + copypath,
                readable,writeable;
            stat(_src, function(err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                   upload(url + namespace + '/client' + _src.split(folder)[1],_src);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    getPackage(_src);
                }
            });
        });
    });
}