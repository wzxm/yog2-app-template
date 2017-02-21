<!doctype html>
{% html lang="en" framework="common:static/js/mod.js" %}
    {% head %}
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="/static/favicon.ico">
        <title>{{ title }}</title>

        {% block requireCss %}
        {% endblock %}

    {% endhead %}

    {% body %}

        {% block header %}
        {% endblock %}

        {% block index %}
        {% endblock %}
    
        {% block footer %}
        {% endblock %}

        {% block requireJs %}
        {% endblock %}

    {% endbody %}
    <script>
        //webview返回刷新
        window.webviewOnShow = function (from) {
            if (from == 1) {
                window.location.href = window.location.href;
            }
        }
        // //调试用
        // var script = document.createElement('script'); 
        //  script.src="http://front-end.dev.ppmoney.com/hz/tool/eruda.min.js"; 
        //  document.body.appendChild(script); 
        //  script.onload = function () { eruda.init() } 
        var Config = require('home:widget/config.js')
        !function(){
            if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                if(!Config.debug) { location.href = Config.redirect }
            }
        }();
        require('home:widget/entry/index.js')
    </script>
{% endhtml %}
