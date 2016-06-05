//=============================================================================
// TitleImageChange.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/06/05 セーブデータに歯抜けがある場合にエラーが発生する問題を修正
//                  進行状況のみをセーブする機能を追加
// 1.0.0 2016/04/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc タイトル画面変更プラグイン
 * @author トリアコンタン
 *
 * @param 進行度変数
 * @desc ゲームの進行度に対応する変数番号(1...)
 * @default 1
 *
 * @param タイトル1の進行度
 * @desc 進行度変数の値がこの値以上ならタイトル1の画像が表示されます。
 * @default 1
 *
 * @param タイトル1の画像
 * @desc 進行度変数の値がタイトル1の進行度以上のときに表示される画像(img/titles1)のファイル名です。
 * @default
 * @require 1
 * @dir img/titles1/
 * @type file
 *
 * @param タイトル2の進行度
 * @desc 進行度変数の値がこの値以上ならタイトル2の画像が表示されます。
 * @default 2
 *
 * @param タイトル2の画像
 * @desc 進行度変数の値がタイトル2の進行度以上のときに表示される画像(img/titles1)のファイル名です。
 * @default
 * @require 1
 * @dir img/titles1/
 * @type file
 *
 * @param タイトル3の進行度
 * @desc 進行度変数の値がこの値以上ならタイトル3の画像が表示されます。
 * @default 3
 *
 * @param タイトル3の画像
 * @desc 進行度変数の値がタイトル3の進行度以上のときに表示される画像(img/titles1)のファイル名です。
 * @default
 * @require 1
 * @dir img/titles1/
 * @type file
 *
 * @help ゲームの進行度に応じてタイトル画面の画像を変更します。
 * 進行度には任意の変数が指定でき、全セーブデータの中の最大値が反映されます。
 *
 * タイトル画像は最大3つまで指定可能で、複数の条件を満たした場合は
 * 以下のような優先順位になります。
 *
 * 1. タイトル3の画像
 * 2. タイトル2の画像
 * 3. タイトル1の画像
 * 4. デフォルトのタイトル画像
 *
 * ゲームデータをセーブせず進行状況のみをセーブしたい場合は、
 * イベントコマンドの「スクリプト」から以下を実行してください。
 * DataManager.saveOnlyGradeVariable();
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
    var pluginName = 'TitleImageChange';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramGradeVariable = getParamNumber(['GradeVariable', '進行度変数'], 1, 5000);
    var paramTitleGrades = [];
    paramTitleGrades.push(getParamNumber(['TitleGrade3', 'タイトル3の進行度']));
    paramTitleGrades.push(getParamNumber(['TitleGrade2', 'タイトル2の進行度']));
    paramTitleGrades.push(getParamNumber(['TitleGrade1', 'タイトル1の進行度']));
    var paramTitleImages = [];
    paramTitleImages.push(getParamString(['TitleImage3', 'タイトル3の画像']));
    paramTitleImages.push(getParamString(['TitleImage2', 'タイトル2の画像']));
    paramTitleImages.push(getParamString(['TitleImage1', 'タイトル1の画像']));

    //=============================================================================
    // DataManager
    //  ゲーム進行状況を保存します。
    //=============================================================================
    var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        var info = _DataManager_makeSavefileInfo.apply(this, arguments);
        info.gradeVariable = $gameVariables.value(paramGradeVariable);
        return info;
    };

    DataManager.getMaxGradeVariable = function() {
        var globalInfo = this.loadGlobalInfo();
        var gradeVariable = 0;
        if (globalInfo) {
            for (var i = 1; i < globalInfo.length; i++) {
                if (globalInfo[i] && globalInfo[i].gradeVariable > gradeVariable) {
                    gradeVariable = globalInfo[i].gradeVariable;
                }
            }
        }
        return gradeVariable;
    };

    DataManager.saveOnlyGradeVariable = function() {
        var saveFileId = this.lastAccessedSavefileId();
        var globalInfo = this.loadGlobalInfo() || [];
        globalInfo[saveFileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
    };

    //=============================================================================
    // Scene_Title
    //  進行状況が一定以上の場合、タイトル画像を差し替えます。
    //=============================================================================
    var _Scene_Title_initialize = Scene_Title.prototype.initialize;
    Scene_Title.prototype.initialize = function() {
        _Scene_Title_initialize.apply(this, arguments);
        this.changeTitleImage();
    };

    Scene_Title.prototype.changeTitleImage = function() {
        var gradeVariable = DataManager.getMaxGradeVariable();
        for (var i = 0, n = paramTitleGrades.length; i < n; i++) {
            if (paramTitleImages[i] && gradeVariable >= paramTitleGrades[i]) {
                $dataSystem.title1Name = paramTitleImages[i];
                break;
            }
        }
    };
})();

