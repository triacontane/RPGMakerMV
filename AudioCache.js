/*=============================================================================
 AudioCache.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc オーディオキャッシュプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AudioCache.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param outputLog
 * @text ログ出力
 * @desc テストプレー時、キャッシュの作成や破棄時にログを出力します。
 * @default true
 * @type boolean
 *
 * @command CACHE_AUDIO
 * @text オーディオキャッシュ
 * @desc 指定したオーディオファイルのバッファを事前に作成してキャッシュします。
 *
 * @arg file
 * @text ファイル名
 * @desc キャッシュするオーディオファイル名です。SEのキャッシュはできません。
 * @default
 * @type file
 * @dir audio
 *
 * @help AudioCache.js
 *
 * 指定したオーディオファイルのバッファを事前に作成してキャッシュします。
 * キャッシュしておけば実際に演奏するときにタイムラグなしで演奏されます。
 * ただし、SEのキャッシュはできません。
 *
 * パフォーマンス上の影響を最小限にするため、一度にキャッシュできるファイルは
 * BGMなどのカテゴリごとにひとつだけです。
 * また、演奏が終わったタイミングでキャッシュは破棄されます。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CACHE_AUDIO', args => {
        AudioManager.cacheBuffer(args.file);
    });

    AudioManager._cacheBuffers = {};

    AudioManager.cacheBuffer = function(path) {
        const pathList = path.split('/');
        const folder = pathList.shift() + '/';
        const name = pathList.join('/');
        if (name && !this.isExistCache(folder, name)) {
            this.clearCache(folder);
            this._cacheBuffers[folder] = this.createBuffer(folder, name);
            this.outputCacheLog(`create : ${folder}${name}`);
        }
    };

    AudioManager.clearCache = function(folder) {
        this._cacheBuffers[folder] = null;
        this.outputCacheLog(`clear : ${folder}`);
    };

    const _AudioManager_createBuffer = AudioManager.createBuffer;
    AudioManager.createBuffer = function(folder, name) {
        if (this.isExistCache(folder, name)) {
            this.outputCacheLog(`load form cache : ${folder}${name}`);
            return this._cacheBuffers[folder];
        } else {
            return _AudioManager_createBuffer.apply(this, arguments);
        }
    };

    AudioManager.outputCacheLog = function(value) {
        if (Utils.isOptionValid('test') && param.outputLog) {
            console.log(`AudioCache ${value}`);
        }
    }

    AudioManager.isExistCache = function (folder, name) {
        return this._cacheBuffers[folder]?.name === name;
    };

    const _WebAudio_prototype_destroy = WebAudio.prototype.destroy;
    WebAudio.prototype.destroy = function() {
        const folder = this._url.split('/')[1] + '/';
        if (AudioManager.isExistCache(folder, this.name)) {
            AudioManager.clearCache(folder);
        }
        _WebAudio_prototype_destroy.apply(this, arguments);
    };
})();
