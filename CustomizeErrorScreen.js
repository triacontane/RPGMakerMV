//=============================================================================
// CustomizeErrorScreen.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2020/11/29 パラメータの型指定機能に対応
// 1.2.1 2020/11/29 非同期処理でエラーイベントを捕捉したときスタックトレースの表示が正しく行えない問題を修正
// 1.2.0 2016/11/10 連絡先のリンクを開く際に、既定のブラウザで開くよう変更
// 1.1.1 2016/07/13 表記方法を少しだけ変更
// 1.1.0 2016/07/13 ローカル実行時、エラー情報のパスを出力しないよう修正
// 1.0.1 2016/06/25 エラー発生時のリンク先を別画面で開くよう修正
// 1.0.0 2016/05/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Customize Error Screen
 * @author triacontane
 *
 * @param MainMessage
 * @desc
 * @default !!Error!!
 *
 * @param HyperLink
 * @desc
 * @default
 *
 * @param OutputDetail
 * @desc
 * @default ON
 *
 * @help Visualize detail information for Error Screen.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc エラー画面表示改善プラグイン
 * @author トリアコンタン
 *
 * @param MainMessage
 * @text メインメッセージ
 * @desc エラー画面に共通で表示されるメッセージ
 * @default 以下のエラーが発生しました。
 *
 * @param HyperLink
 * @text リンク先URL
 * @desc エラー画面に表示するリンク先URL
 * @default
 * 
 * @param OutputDetail
 * @text 詳細情報出力
 * @desc エラー情報の詳細(スタックトレース)を出力します。
 * @default true
 * @type boolean
 *
 * @help エラー画面の表示を改善します。固定メッセージと連絡先のハイパーリンクを
 * 指定できるほか、エラーの詳細情報（スタックトレース）も表示されるようになります。
 * またURL用にエンコードされて表示される全角文字列をもとの文字列に
 * デコードして表示します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('CustomizeErrorScreen');

    //=============================================================================
    // SceneManager
    //  エラー情報の出力処理を追加します。
    //=============================================================================
    var _SceneManager_onError = SceneManager.onError;
    SceneManager.onError      = function(e) {
        _SceneManager_onError.apply(this, arguments);
        try {
            Graphics.printErrorDetail(e.error, decodeURIComponent(e.filename));
        } catch (e2) {
        }
    };

    var _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException      = function(e) {
        _SceneManager_catchException.apply(this, arguments);
        Graphics.printErrorDetail(e);
    };

    //=============================================================================
    // Graphics
    //  エラー情報を出力します。
    //=============================================================================
    var _Graphics__makeErrorHtml = Graphics._makeErrorHtml;
    Graphics._makeErrorHtml      = function(name, message) {
        arguments[1] = decodeURIComponent(message);
        return _Graphics__makeErrorHtml.apply(this, arguments);
    };

    Graphics.printErrorDetail = function(e) {
        this.hideFps();
        this._setErrorPrinterStyle();
        if (this._errorPrinter) {
            this._makeMainMessage();
            if (param.HyperLink)    this._makeHyperLink();
            if (param.OutputDetail) {
                var stack = String(e.stack) || '';
                if (Utils.isNwjs()) {
                    stack = stack.replace(/file:.*js\//g, '');
                    stack = stack.replace(/ at /g, '<br/>');
                }
                this._makeStackTrace(stack);
            }
        }
    };

    Graphics._makeMainMessage = function() {
        var mainMessage       = document.createElement('div');
        var style             = mainMessage.style;
        style.color           = 'white';
        style.textAlign       = 'left';
        style.fontSize        = '18px';
        mainMessage.innerHTML = '<hr>' + param.MainMessage;
        this._errorPrinter.appendChild(mainMessage);
    };

    Graphics._makeHyperLink = function() {
        var hyperLink            = document.createElement('a');
        var style                = hyperLink.style;
        style.color              = 'blue';
        style.textAlign          = 'left';
        style.fontSize           = '20px';
        style['text-decoration'] = 'underline';
        style.cursor             = 'pointer';
        hyperLink.addEventListener('click', this._openUrl.bind(this, param.HyperLink));
        hyperLink.innerHTML = param.HyperLink;
        this._errorPrinter.appendChild(hyperLink);
    };

    Graphics._openUrl = function(url) {
        if (!Utils.isNwjs()) {
            window.open(url);
            return;
        }
        var exec = require('child_process').exec;
        switch (process.platform) {
            case 'win32':
                exec('rundll32.exe url.dll,FileProtocolHandler "' + url + '"');
                break;
            default:
                exec('open "' + url + '"');
                break;
        }
    };

    Graphics._makeStackTrace = function(stack) {
        var stackTrace         = document.createElement('div');
        var style              = stackTrace.style;
        style.color            = 'white';
        style.textAlign        = 'left';
        style.fontSize         = '18px';
        style.userSelect       = 'text';
        style.webkitUserSelect = 'text';
        style.msUserSelect     = 'text';
        style.mozUserSelect    = 'text';
        stackTrace.innerHTML   = '<br><hr>' + stack + '<hr>';
        this._errorPrinter.appendChild(stackTrace);
    };

    Graphics._setErrorPrinterStyle = function() {
        this._errorPrinter.width  = this._width * 0.9;
        this._errorPrinter.height = this._height * 0.9;
        var style                 = this._errorPrinter.style;
        style.textAlign           = 'center';
        style.textShadow          = '1px 1px 3px #000';
        style.fontSize            = '22px';
        style.zIndex              = 99;
        this._centerElement(this._errorPrinter);
    };
})();

