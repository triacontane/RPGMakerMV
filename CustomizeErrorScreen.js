//=============================================================================
// CustomizeErrorScreen.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.1 2021/03/07 ヘルプ微修正
// 1.4.0 2021/03/07 MZで動作するよう全面的に修正
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeErrorScreen.js
 * @base PluginCommonBase
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeErrorScreen.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param MainMessage
 * @text メインメッセージ
 * @desc エラー画面に共通で表示されるメッセージ
 * @default エラーが発生しました。エラー内容を添えて以下にお問い合わせください。
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
 * @help CustomizeErrorScreen.js
 *
 * エラー画面の表示を改善します。
 * 固定メッセージと連絡先のハイパーリンクを指定できるほか、
 * エラーの詳細情報（スタックトレース）も表示されるようになります。
 * またURL用にエンコードされて表示される全角文字列をもとの文字列に
 * デコードして表示します。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // SceneManager
    //  エラー情報の出力処理を追加します。
    //=============================================================================
    const _SceneManager_onError = SceneManager.onError;
    SceneManager.onError      = function(e) {
        _SceneManager_onError.apply(this, arguments);
        try {
            Graphics.printErrorDetail(e.error, decodeURIComponent(e.filename));
        } catch (e2) {
        }
    };

    const _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException      = function(e) {
        _SceneManager_catchException.apply(this, arguments);
        Graphics.printErrorDetail(e);
    };

    //=============================================================================
    // Graphics
    //  エラー情報を出力します。
    //=============================================================================
    const _Graphics__makeErrorHtml = Graphics._makeErrorHtml;
    Graphics._makeErrorHtml      = function(name, message) {
        arguments[1] = decodeURIComponent(message);
        return _Graphics__makeErrorHtml.apply(this, arguments);
    };

    Graphics.printErrorDetail = function(e) {
        if (this._errorPrinter) {
            this._makeMainMessage();
            if (param.HyperLink) {
                this._makeHyperLink();
            }
            if (param.OutputDetail && e.stack) {
                let stack = String(e.stack) || '';
                if (Utils.isNwjs()) {
                    stack = stack.replace(/file:.*js\//g, '');
                    stack = stack.replace(/ at /g, '<br/>');
                }
                this._makeStackTrace(stack);
            }
        }
    };

    Graphics._makeMainMessage = function() {
        const mainMessage     = document.createElement('div');
        const style           = mainMessage.style;
        style.color           = 'white';
        style.textAlign       = 'center';
        style.fontSize        = '18px';
        mainMessage.innerHTML = '<hr>' + param.MainMessage;
        this._errorPrinter.appendChild(mainMessage);
    };

    Graphics._makeHyperLink = function() {
        const hyperLink          = document.createElement('a');
        const style              = hyperLink.style;
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
        const exec = require('child_process').exec;
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
        const stackTrace       = document.createElement('div');
        const style            = stackTrace.style;
        style.color            = 'white';
        style.textAlign        = 'left';
        style.fontSize         = '12px';
        style.userSelect       = 'text';
        style.msUserSelect     = 'text';
        style.mozUserSelect    = 'text';
        style['overflow-wrap'] = 'break-word';
        stackTrace.innerHTML   = '<br><hr>' + stack + '<hr>';
        this._errorPrinter.appendChild(stackTrace);
    };

    const _Graphics__updateErrorPrinter = Graphics._updateErrorPrinter;
    Graphics._updateErrorPrinter = function() {
        _Graphics__updateErrorPrinter.apply(this, arguments);
        this._errorPrinter.style.width  = `${this._width * 0.9}px`;
        this._errorPrinter.style.height = `${this._height * 0.9}px`;
    };
})();

