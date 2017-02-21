/**
 * @file FIS 配置
 * @author
 */
var sconfig = require('./client/widget/config.js');
var path = require('path');
fis.config.set('namespace', sconfig.name);
fis.set('project.fileType.text', 'es');
var domain = sconfig.domain;
var url = sconfig.domainFolder;
var namespace = sconfig.name;


fis.set('project.ignore', ['*.bat', '*.md', 'fis-conf.js','prod.js', 'package-conf.js','package.json', '*.bak','node_modules/**']);

// chrome下可以安装插件实现livereload功能
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
fis.config.set('livereload.port', 35729);

if (fis.IS_FIS3) {

    fis.match('**/*.scss', {
      parser: fis.plugin('node-sass', {
        // options...
      }),
      rExt: '.css'
    })

    fis.match('*.es', {
        parser: fis.plugin('babel-6.x', {
            // presets: [
            // 注意一旦这里在这里添加了 presets 配置，则会覆盖默认加载的 preset-2015 等插件，因此需要自行添加所有需要使用的 presets
            // ]
        }),
        rExt: 'js'
    });

    //npm install -g fis-parser-handlebars-3.x
    fis.match('*.handlebars', {
        parser: fis.plugin('handlebars-3.x', {
            //fis-parser-handlebars-3.x option
        }),
        rExt: '.js', // from .handlebars to .js 虽然源文件不需要编译，但是还是要转换为 .js 后缀
        release: false // handlebars 源文件不需要编译
    });

    // fis.match('::image',{
    //     useMap: true
    // });

    // fis.match('::package', {
    //     spriter: fis.plugin('csssprites')
    // });

    // fis.match('*.{js,css,png,gif,jpg,ico,eot,svg,ttf,woff}', {
    //     useHash: true,
    //     useSprite: true,
    //     // release: '/static/$0',
    //     // url: url + '/static$0',
    //     //domain: domain
    // });

    // fis.match('*.js', {
    //     // fis-optimizer-uglify-js 插件进行压缩，已内置
    //     optimizer: fis.plugin('uglify-js')
    // });

    // fis.match('*.css', {
    //     // fis-optimizer-clean-css 插件进行压缩，已内置
    //     optimizer: fis.plugin('clean-css')
    // });

    // fis.match('*.min.js', {
    //     optimizer: false
    // }, true);

    // fis.match('*.png', {
    //     // fis-optimizer-png-compressor 插件进行压缩，已内置
    //     optimizer: fis.plugin('png-compressor')
    // });

    // fis.media('sp').match('*.{js,css,png,gif,jpg,ico,eot,svg,ttf,woff}', {
    //     release: '$0',
    //     url: url + '$0',
    //     domain: domain
    // });

    //http://fis.baidu.com/fis3/docs/api/dev-plugin.html
    // fis.match('::packager', {
    //     packager : function(ret, conf, settings, opt){
    //         // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
    //         // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
    //         // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
    //         //         可以修改静态资源列表或者其他
    //         var root = fis.project.getProjectPath();
    //         var json ={}
    //         json.root = root;
    //         // json.ret = ret;
    //         json.retMap = ret.map;
    //         var resourceMapFiles = []; //存放所有文件的file对象
    //         var imgSourceMap={};       //存放需要替换的image路径
    //         //生成文件数组
    //         Object.keys(ret.src).forEach(function(key){
    //         resourceMapFiles.push(ret.src[key]);
    //         });
    //         //找到所有图片的路径
    //         Object.keys(ret.map.res).forEach(function(key){
    //         isImageFile(key) && (imgSourceMap[key] = ret.map.res[key]);
    //         });
    //         json.imgMap = imgSourceMap;
    //         resourceMapFiles.forEach(function(file){
    //         if(file.isJsLike || file.isHtmlLike){
    //             var content = file.getContent();
    //             //将js文件的图片路径替换掉
    //             Object.keys(imgSourceMap).forEach(function(key){
    //             var baseName = path.basename(key);
    //             var baseMapName = path.basename(imgSourceMap[key].uri);
    //             var findAllReg = new RegExp('(\"|\')(\\w*\/)*'+baseName+'(\"|\')');
    //             var basenameReg = new RegExp(baseName,"g");
    //             var resultAttr = content.match(findAllReg);
                
    //             if(!!resultAttr){
    //                 content = content.replace(basenameReg,"_REPLACE_"+baseMapName);
    //                 var resultStr = resultAttr[0].slice(1,resultAttr[0].length-1);
    //                 var lcpResult = LCP(resultStr,baseName);
    //                 json.resultStr = resultStr;
    //                 json.lcpResult = lcpResult;
                    
    //                 var replacePreReg = new RegExp(lcpResult.diff.largeStr+"_REPLACE_","g");
    //                 content = content.replace(replacePreReg,path.dirname(imgSourceMap[key].uri)+"/");
    //             }
    //             })
    //             file.setContent(content);
    //         }
    //         })
    //     }
    // });

    fis.media('debug').match('*', {
        optimizer: null,
        useHash: false,
        deploy: fis.plugin('http-push', {
            receiver: 'http://127.0.0.1:8085/yog/upload',
            to: '/'
        })
    });

    fis.media('prod').match('*.{js,css,png,gif,jpg,ico,eot,svg,ttf,woff}', {
        url: url + namespace + '$0',
        domain: domain
    });

    fis.media('prod').match('::package', {
        packager: fis.plugin('map', {
            '/client/widget/pkgall.js': '/client/widget/**.js',
            '/client/widget/pkgall.css': '/client/widget/**.scss'
        })
    })

    fis.media('prod').match('*', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://127.0.0.1:8085/yog/upload',
            to: '/'
        })
    });
}
else {
    fis.config.set('deploy', {
        debug: {
            to: '/',
            // yog2 默认的部署入口，使用调试模式启动 yog2 项目后，这个入口就会生效。IP与端口请根据实际情况调整。
            receiver: 'http://127.0.0.1:8085/yog/upload'
        }
    });
}

function isImageFile(filename){
    return filename.toLocaleLowerCase().match('.png|.jpg|.gif|.jpeg|.css|.js');
}

/**
 * [LCP 最长公共子序列]
 * @anotherdate 2015-11-13T10:36:42+0800
 * @author huangzhen
 * @param       {[type]}                 str1  [字符串1]
 * @param       {[type]}                 str2  [字符串2]
 */
function LCP(str1, str2) {
    var largeStr, shortStr;
    if (str1.length < str2.length) {
        largeStr = str2;
        shortStr = str1;
    } else {
        largeStr = str1;
        shortStr = str2;
    }
    var offsetIndex = largeStr.length - shortStr.length;
    var result = {};
    var flag = false;
    for (var i = shortStr.length - 1; i >= 0; i--) {
        if (shortStr[i] != largeStr[i + offsetIndex]) {
        result.lcp = shortStr.slice(i + 1);
        result.diff = {
            shortStr: shortStr.slice(0, i + 1),
            largeStr: largeStr.slice(0, i + offsetIndex + 1)
        }
        return result;
        }
        if (i == 0) {
        result.lcp = shortStr;
        result.diff = {
            shortStr: -1,
            largeStr: largeStr.slice(0, i + offsetIndex)
        }
        return result;
        }
    };
    return result;
}

