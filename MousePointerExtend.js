//=============================================================================
// MousePointerExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/07/20 独自画像をpictures以外のフォルダに格納できる機能を追加
// 1.1.0 2016/07/18 形状の種類と独自画像の最大数を3から5に拡張
// 1.0.0 2016/07/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Mouse Pointer Extend Plugin
 * @author triacontane
 *
 * @param PointerType1
 * @desc スイッチ1がONになった場合のマウス形状です。
 * @default auto
 *
 * @param PointerSwitch1
 * @desc 形状タイプ1が有効になるスイッチ番号です。
 * @default 0
 *
 * @param PointerType2
 * @desc スイッチ2がONになった場合のマウス形状です。
 * @default auto
 *
 * @param PointerSwitch2
 * @desc 形状タイプ2が有効になるスイッチ番号です。
 * @default 0
 *
 * @param PointerType3
 * @desc スイッチ3がONになった場合のマウス形状です。
 * @default auto
 *
 * @param PointerSwitch3
 * @desc 形状タイプ3が有効になるスイッチ番号です。
 * @default 0
 *
 * @param PointerType4
 * @desc スイッチ4がONになった場合のマウス形状です。
 * @default auto
 *
 * @param PointerSwitch4
 * @desc 形状タイプ4が有効になるスイッチ番号です。
 * @default 0
 *
 * @param PointerType5
 * @desc スイッチ5がONになった場合のマウス形状です。
 * @default auto
 *
 * @param PointerSwitch5
 * @desc 形状タイプ5が有効になるスイッチ番号です。
 * @default 0
 *
 * @param DefaultType
 * @desc デフォルトのマウス形状です。
 * @default auto
 *
 * @param CustomImage1
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CustomImage2
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CustomImage3
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CustomImage4
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CustomImage5
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param ErasePointer
 * @desc キーもしくはパッド入力によりポインタを一時的に消去します。マウスを動かすと再び出現します。
 * @default ON
 *
 * @param PointerPath
 * @desc カーソル用の独自画像を/pictures/以外に配置したい場合にパス名を指定してください。区切り文字[/]は不要。
 * @default
 *
 * @help マウスポインタの形状や表示可否を拡張します。
 * スイッチ条件に応じた多彩な形状変化や、独自画像のポインタ利用
 * 何らかのキー・パッド入力で非表示化する機能を提供します。
 *
 * ポインタの形状タイプは以下の文字列を指定します。
 * auto : 自動(初期値)
 * none : 非表示
 * default : デフォルト
 * pointer : リンク
 * crosshair : 十字
 * move : 移動
 * text : テキスト
 * wait : 処理中
 * help : ヘルプ
 * url1 : 独自画像1(パラメータ参照)
 * url2 : 独自画像2(パラメータ参照)
 * url3 : 独自画像3(パラメータ参照)
 * url4 : 独自画像4(パラメータ参照)
 * url5 : 独自画像5(パラメータ参照)
 *
 * ※独自画像を指定する場合は、別途画像ファイル名をパラメータに設定してください。
 * ファイル名に加えて拡張子の設定が必要です。(例：icon.png)
 *
 * スイッチ条件を満たしたのに画像が表示されない場合は、ファイルパスが間違っているか
 * 指定した画像をアイコンとして利用できないかのどちらかの可能性が高いです。
 *
 * 形状変化用のスイッチは3つまで指定可能で複数の条件を満たした場合は
 * 「1」→「2」→「3」の優先度になります。
 *
 * また、「キー入力で消去」を有効にするとキーもしくはパッド入力により
 * ポインタを一時的に画面から消去できます。
 * マウス主体の操作を行わない場合にポインタが邪魔にならないための仕様です。
 * マウス関連のイベントが発生すると再びポインタが表示されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マウスポインタ拡張プラグイン
 * @author トリアコンタン
 *
 * @param 形状タイプ1
 * @desc スイッチ1がONになった場合のマウス形状です。
 * @default auto
 *
 * @param スイッチ1
 * @desc 形状タイプ1が有効になるスイッチ番号です。
 * @default 0
 *
 * @param 形状タイプ2
 * @desc スイッチ2がONになった場合のマウス形状です。
 * @default auto
 *
 * @param スイッチ2
 * @desc 形状タイプ2が有効になるスイッチ番号です。
 * @default 0
 *
 * @param 形状タイプ3
 * @desc スイッチ3がONになった場合のマウス形状です。
 * @default auto
 *
 * @param スイッチ3
 * @desc 形状タイプ3が有効になるスイッチ番号です。
 * @default 0
 *
 * @param 形状タイプ4
 * @desc スイッチ4がONになった場合のマウス形状です。
 * @default auto
 *
 * @param スイッチ4
 * @desc 形状タイプ4が有効になるスイッチ番号です。
 * @default 0
 *
 * @param 形状タイプ5
 * @desc スイッチ5がONになった場合のマウス形状です。
 * @default auto
 *
 * @param スイッチ5
 * @desc 形状タイプ5が有効になるスイッチ番号です。
 * @default 0
 *
 * @param デフォルト形状タイプ
 * @desc デフォルトのマウス形状です。
 * @default auto
 *
 * @param 独自画像1
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 独自画像2
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 独自画像3
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 独自画像4
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 独自画像5
 * @desc マウスポインタに使用する画像ファイル名(/img/picture/)です。正方形の32*32程度の画像を用意してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param キー入力で消去
 * @desc キーもしくはパッド入力によりポインタを一時的に消去します。マウスを動かすと再び出現します。
 * @default ON
 *
 * @param ポインタファイルパス
 * @desc カーソル用の独自画像を/pictures/以外に配置したい場合にパス名を指定してください。区切り文字[/]は不要。
 * @default
 *
 * @help マウスポインタの形状や表示可否を拡張します。
 * スイッチ条件に応じた多彩な形状変化や、独自画像のポインタ利用
 * 何らかのキー・パッド入力で非表示化する機能を提供します。
 *
 * ポインタの形状タイプは以下の文字列を指定します。
 * auto : 自動(初期値)
 * none : 非表示
 * default : デフォルト
 * pointer : リンク
 * crosshair : 十字
 * move : 移動
 * text : テキスト
 * wait : 処理中
 * help : ヘルプ
 * url1 : 独自画像1(パラメータ参照)
 * url2 : 独自画像2(パラメータ参照)
 * url3 : 独自画像3(パラメータ参照)
 * url4 : 独自画像4(パラメータ参照)
 * url5 : 独自画像5(パラメータ参照)
 *
 * ※独自画像を指定する場合は、別途画像ファイル名をパラメータに設定してください。
 * ファイル名に加えて拡張子の設定が必要です。(例：icon.png)
 *
 * スイッチ条件を満たしたのに画像が表示されない場合は、ファイルパスが間違っているか
 * 指定した画像をアイコンとして利用できないかのどちらかの可能性が高いです。
 * アニメーションカーソル(.ani)は使用できません。
 * また、gifファイルは使用できますがアニメーションしません。
 *
 * 形状変化用のスイッチは複数指定可能で複数の条件を満たした場合は
 * より数字の小さい方（「1」→「2」→「3」...の順番）が優先されます。
 *
 * また、「キー入力で消去」を有効にするとキーもしくはパッド入力により
 * ポインタを一時的に画面から消去できます。
 * マウス主体の操作を行わない場合にポインタが邪魔にならないための仕様です。
 * マウス関連のイベントが発生すると再びポインタが表示されます。
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
    var pluginName    = 'MousePointerExtend';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
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
    var paramPointerTypes    = {};
    var paramPointerSwitches = {};
    for (var i = 1; i < 6; i++) {
        paramPointerTypes[i]    = getParamString(['PointerType' + i, '形状タイプ' + i]);
        paramPointerSwitches[i] = getParamNumber(['PointerSwitch' + i, 'スイッチ' + i]);
    }
    var paramCustomImages = {};
    for (var j = 1; j < 6; j++) {
        paramCustomImages[j] = getParamString(['CustomImage' + j, '独自画像' + j]);
    }
    var paramDefaultType  = getParamString(['DefaultType', 'デフォルト形状タイプ']);
    var paramErasePointer = getParamBoolean(['ErasePointer', 'キー入力で消去']);
    var paramPointerPath  = getParamString(['PointerPath', 'ポインタファイルパス']);

    //=============================================================================
    // SceneManager
    //  スイッチに応じてポインタの形状を変更します。
    //=============================================================================
    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene      = function() {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene) this.updateMousePointer();
    };

    SceneManager.updateMousePointer = function() {
        var result = paramDefaultType;
        if ($gameSwitches) {
            Object.keys(paramPointerTypes).some(function(i) {
                var switchNumber = paramPointerSwitches[i];
                if (switchNumber && $gameSwitches.value(switchNumber)) {
                    result = paramPointerTypes[i];
                    return true;
                }
                return false;
            });
        }
        if (result) Graphics.setPointerType(result.toLowerCase());
    };

    //=============================================================================
    // Input
    //  何らかの入力でポインタを非表示にします。
    //=============================================================================
    var _Input_update = Input.update;
    Input.update      = function() {
        var oldDate = this.date;
        _Input_update.apply(this, arguments);
        if (paramErasePointer && this.date !== oldDate) {
            Graphics.setHiddenPointer(true);
        }
    };

    //=============================================================================
    // TouchInput
    //  マウスポインタの移動でポインタの表示を復元します。
    //=============================================================================
    var _TouchInput__onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove      = function(event) {
        _TouchInput__onMouseMove.apply(this, arguments);
        if (paramErasePointer) Graphics.setHiddenPointer(false);
    };

    //=============================================================================
    // Graphics
    //  ポインタの形状を変更します。
    //=============================================================================
    Graphics._PointerType   = 'auto';
    Graphics._hiddenPointer = false;

    Graphics.setHiddenPointer = function(value) {
        this._hiddenPointer = !!value;
        this.updateMousePointer();
    };

    Graphics.setPointerType = function(type) {
        this._PointerType = null;
        Object.keys(paramCustomImages).forEach(function(index) {
            this._setPointerTypeCustom(type, index);
        }.bind(this));
        if (!this._PointerType) this._PointerType = type;
        this.updateMousePointer();
    };

    Graphics._setPointerTypeCustom = function(type, index) {
        if (type === 'url' + index && paramCustomImages[index]) {
            this._PointerType = 'url(img/' + (paramPointerPath || 'pictures') + '/' + paramCustomImages[index] + '), default';
        }
    };

    Graphics.updateMousePointer = function() {
        document.body.style.cursor = this._hiddenPointer ? 'none' : this._PointerType;
    };
})();

