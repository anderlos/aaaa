(function (window, document, undefined) {
    var SDK_VERSION = '0.0.1';
    var ww = {
        SDK_VERSION: SDK_VERSION,
        createWWLoginPanel: function (options) {
            var width = '480px';
            var height = '510px';
            var params = options.params || {};
            var host = params.host || 'https://mcos.bjrcb.com';
            var iframeEl = createTransparentIFrame(width, height, options.el);
            params.appid = params.appid || '';
            params.agentid = params.agentid || '';
            params.redirect_uri = params.redirect_uri || '';
            params.redirect_type = params.redirect_type || '';
            var url = host + '/wework_admin/new_web_login/login_panel?appid=' + params.appid + '&agentid=' + params.agentid + '&redirect_uri=' + encodeURIComponent(params.redirect_uri)  + '&state=' + encodeURIComponent(params.state) + '&redirect_type=' + params.redirect_type;
            iframeEl.src = url;

            iframeEl.onload = function() {
                if (iframeEl.contentWindow.postMessage && window.addEventListener) {
                    window.addEventListener('message', function (event) {
                        var data = event.data;
                        var hostArr = host.split(':');
                        if (hostArr[1] == 80) host = hostArr[0];
                        if (data && typeof data === 'string' && event.origin.indexOf(host) > -1) {
                            window.location.href = data;
                        } else if (data.type === 'qykit.sendLoginCode' && data.data && data.data.code) {
                            options.onLoginSuccess && options.onLoginSuccess(data.data);
                        }
                    });
                    iframeEl.contentWindow.postMessage('ask_usePostMessage', '*');
                }
            };
        }
    };

    function createTransparentIFrame(width, height, el) {
        var iframeEl = document.createElement('iframe');
        var style = iframeEl.style;

        style.display = 'block';
        style.border = 'none';
        style.background = 'transparent';
        style.width = width;
        style.height = height;

        iframeEl.referrerPolicy = 'origin';
        iframeEl.setAttribute('frameborder', '0');
        iframeEl.setAttribute('allowtransparency', 'true');

        var containerEl = resolveEl(el);
        if (containerEl) {
            containerEl.appendChild(iframeEl);
        }

        return iframeEl;
    }

    function resolveEl(el) {
        if (typeof el === 'string') {
            return document.querySelector(el);
        }
        return el;
    }

    window.ww = ww;
})(window, document);