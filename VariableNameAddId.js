//=============================================================================
// VariableNameAddId.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 ローカル環境以外で動作しないよう修正
// 1.0.0 2016/03/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 変数名およびコモンイベント名のID自動付与プラグイン
 * @author トリアコンタン
 *
 * @param バックアップ
 * @desc データベースファイルを上書きする前にバックアップします。
 * 動作に問題がないことを確認したらOFFにしても問題ありません。
 * @default ON
 *
 * @help テストプレー開始時に以下の名称の先頭にIDを自動付与して再保存します。
 * 既にIDが付与されているものに対しては何も行いません。
 * ・スイッチ
 * ・変数
 * ・コモンイベント
 * 例：「スイッチA」→「1:スイッチA」
 *
 * 要注意！
 * 本プラグインは、データベースを動的に書き換えるプラグインです。
 * 必ずご自身の責任の下で利用してください。
 *
 * 手順
 * 1. プラグインを適用後、テストプレーを実行する。
 *
 * 2. プロジェクトを開き直して、コモンイベントや変数、スイッチの
 *    名前の先頭にIDが付いていることを確認する。
 *
 * 初期状態では誤作動した場合に備えて対象データベースファイルを
 * バックアップする処理が実行されます。
 * 何回か動作させ、問題なく動いていることを確認したら、自己責任で
 * バックアップを無効にすることができます。
 *
 * 開発支援プラグインなので製品版には付属しないことを推奨します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'VariableNameAddId';

    // テストプレー時以外は無効
    if (!Utils.isOptionValid('test') || !Utils.isNwjs()) return;

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var paramBackup = getParamBoolean(['Backup', 'バックアップ']);

    //=============================================================================
    // DataManager
    //  データベースファイルを書き込みます。
    //=============================================================================
    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        if (object === $dataCommonEvents) {
            if (paramBackup) {
                StorageManager.saveToLocalDataFile('CommonEvents_bk.json', object);
                console.log('CommonEvents.jsonをバックアップしました。');
            }
            this.addIdForCommonEvent(object);
            StorageManager.saveToLocalDataFile('CommonEvents.json', object);
        }
        if (object === $dataSystem) {
            if (paramBackup) {
                StorageManager.saveToLocalDataFile('System_bk.json', object);
                console.log('System.jsonをバックアップしました。');
            }
            this.addIdForVariables(object.variables);
            this.addIdForVariables(object.switches);
            StorageManager.saveToLocalDataFile('System.json', object);
        }
    };

    DataManager.addIdForCommonEvent = function(dataArray) {
        for (var i = 1, n = dataArray.length; i < n; i++) {
            var data = dataArray[i];
            data.name = data.name.replace(/^[0-9]+\:/g, '');
            data.name = data.id + ':' + data.name;
        }
    };

    DataManager.addIdForVariables = function(dataArray) {
        for (var i = 1, n = dataArray.length; i < n; i++) {
            var data = dataArray[i];
            data = data.replace(/^[0-9]+\:/g, '');
            dataArray[i] = i + ':' + data;
        }
    };

    //=============================================================================
    // StorageManager
    //  データベースファイルを保存します。
    //=============================================================================
    StorageManager.saveToLocalDataFile = function(fileName, json) {
        var data = JSON.stringify(json);
        var fs = require('fs');
        var dirPath = this.localDataFileDirectoryPath();
        var filePath = dirPath + fileName;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    };

    StorageManager.localDataFileDirectoryPath = function() {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        return decodeURIComponent(path);
    };

})();

