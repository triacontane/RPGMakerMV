//=============================================================================
// StatusBustImage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2017/07/05 メインメニュー画面でも先頭アクターの画像を表示できる機能を追加
// 1.3.2 2017/02/20 装備画面での「最強装備」と「全て外す」時に装備品画像が更新されなかった問題を修正
// 1.3.1 2016/10/13 装備品の画像がトリミングの対象外になっていたのを修正
// 1.3.0 2016/10/13 画像を指定した矩形でトリミングして表示できる機能を追加
// 1.2.0 2016/10/08 装備品画像にZ座標を付与できるよう修正
// 1.1.0 2016/10/06 装備画面とスキル画面にも画像を表示できる機能を追加
// 1.0.1 2016/08/12 キャラクターを切り替えたときにグラフィックが切り替わらない問題を修正
// 1.0.0 2016/07/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc StatusBustImagePlugin
 * @author triacontane
 *
 * @param BustImageX
 * @desc バストアップ画像を表示するX座標(足下原点)です。
 * @default 640
 *
 * @param BustImageY
 * @desc バストアップ画像を表示するY座標(足下原点)です。
 * @default 620
 *
 * @param EquipBustImageX
 * @desc 装備画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param EquipBustImageY
 * @desc 装備画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param SkillBustImageX
 * @desc スキル画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param SkillBustImageY
 * @desc スキル画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param MainBustImageX
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param MainBustImageY
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param UnderContents
 * @desc 有効にするとステータス等の下に画像が表示されます。
 * @default true
 * @type boolean
 *
 * @help ステータス画面にアクターごとのバストアップ画像を表示します。
 * 足下を原点として表示位置を自由に調整できます。
 *
 * 装備画面とスキル画面にも同一のバストアップ画像を表示できますが
 * デフォルト画面サイズではスペースがないので、使用する場合は必要に応じて
 * 画面サイズを変更してください。
 *
 * アクターのメモ欄に以下の通り指定してください。
 *
 * <SBIImage:file>  # /img/pictures/file.pngが表示されます。
 * <SBIRect:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 *                       # 切り出して（トリミング）表示します。(カンマ区切り)
 *
 * さらに動画(データベースのアニメーション)を再生することもできます。
 * 画像の上に重ねてまばたき等を表現するのに使用します。
 *
 * <SBIAnimation:1> # ID[1]のアニメーションがループ再生されます。
 *
 * 装備品ごとに画像を上乗せできます。
 * アイテムのメモ欄に以下の通り指定してください。
 * <SBIImage:item>  # /img/pictures/item.pngが表示されます。
 * <SBIPosX:30>     # 装備品画像のX座標を[30]に設定します。
 * <SBIPosY:30>     # 装備品画像のY座標を[30]に設定します。
 * <SBIPosZ:3>      # 装備品画像のZ座標を[3]に設定します。
 * <SBIRect:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 *                       # 切り出して（トリミング）表示します。(カンマ区切り)
 *
 * Z座標が大きい値ほど手前に表示されます。指定しない場合は[1]になります。
 * アクター画像のZ座標は[0]で固定です。
 *
 * プラグインコマンドの実行により画像や動画を変更することもできます。
 * ストーリーの進行によって差し替えたい場合に使用します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SBI_IMAGE_CHANGE 1 file2 # ID[1]のアクターの画像を
 *                          「file2.png」に差し替えます。
 * SBI_ANIME_CHANGE 1 3 # ID[1]のアクターの動画を「3」に差し替えます。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc バストアップ表示プラグイン
 * @author トリアコンタン
 *
 * @param 画像X座標
 * @desc バストアップ画像を表示するX座標(足下原点)です。
 * @default 640
 *
 * @param 画像Y座標
 * @desc バストアップ画像を表示するY座標(足下原点)です。
 * @default 620
 *
 * @param 装備_画像X座標
 * @desc 装備画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param 装備_画像Y座標
 * @desc 装備画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param スキル_画像X座標
 * @desc スキル画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param スキル_画像Y座標
 * @desc スキル画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param メイン_画像X座標
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param メイン_画像Y座標
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param コンテンツの下に表示
 * @desc 有効にするとステータス等の下に画像が表示されます。
 * @default true
 * @type boolean
 *
 * @help ステータス画面にアクターごとのバストアップ画像を表示します。
 * 足下を原点として表示位置を自由に調整できます。
 *
 * 装備画面とスキル画面にも同一のバストアップ画像を表示できますが
 * デフォルト画面サイズではスペースがないので、使用する場合は必要に応じて
 * 画面サイズを変更してください。
 *
 * また、メインメニュー画面にも同一のバストアップ画像を表示できますが
 * 表示されるのは「先頭のアクター」のみです。
 * 主にアクターが一人の場合に使用します。
 *
 * アクターのメモ欄に以下の通り指定してください。
 *
 * <SBI画像:file>   # /img/pictures/file.pngが表示されます。
 * <SBIImage:file>  # /img/pictures/file.pngが表示されます。
 * <SBI矩形:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 * <SBIRect:0,0,100,100> # 切り出して（トリミング）表示します。(カンマ区切り)
 *
 * さらに動画(データベースのアニメーション)を再生することもできます。
 * 画像の上に重ねてまばたき等を表現するのに使用します。
 *
 * <SBI動画:1>      # ID[1]のアニメーションがループ再生されます。
 * <SBIAnimation:1> # ID[1]のアニメーションがループ再生されます。
 *
 * 装備品ごとに画像を上乗せできます。
 * アイテムのメモ欄に以下の通り指定してください。
 * <SBI画像:item>   # /img/pictures/item.pngが表示されます。
 * <SBIImage:item>  # /img/pictures/item.pngが表示されます。
 * <SBIPosX:30>     # 装備品画像のX座標を[30]に設定します。
 * <SBI座標X:30>    # 装備品画像のX座標を[30]に設定します。
 * <SBIPosY:30>     # 装備品画像のY座標を[30]に設定します。
 * <SBI座標Y:30>    # 装備品画像のY座標を[30]に設定します。
 * <SBIPosZ:3>      # 装備品画像のZ座標を[3]に設定します。
 * <SBI座標Z:3>     # 装備品画像のZ座標を[3]に設定します。
 * <SBI矩形:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 * <SBIRect:0,0,100,100> # 切り出して（トリミング）表示します。(カンマ区切り)
 *
 * Z座標が大きい値ほど手前に表示されます。指定しない場合は[1]になります。
 * アクター画像のZ座標は[0]で固定です。
 *
 * プラグインコマンドの実行により画像や動画を変更することもできます。
 * ストーリーの進行によって差し替えたい場合に使用します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SBI画像差し替え 1 file2  # ID[1]のアクターの画像を
 *                          「file2.png」に差し替えます。
 * SBI_IMAGE_CHANGE 1 file2 # ID[1]のアクターの画像を
 *                          「file2.png」に差し替えます。
 * SBI動画差し替え 1 3  # ID[1]のアクターの動画を「3」に差し替えます。
 * SBI_ANIME_CHANGE 1 3 # ID[1]のアクターの動画を「3」に差し替えます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'StatusBustImage';
    var metaTagPrefix = 'SBI';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgArrayEval = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = eval(values[i]).clamp(min, max);
        return values;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramBustImageX      = getParamNumber(['BustImageX', '画像X座標']);
    var paramBustImageY      = getParamNumber(['BustImageY', '画像Y座標']);
    var paramEquipBustImageX = getParamNumber(['EquipBustImageX', '装備_画像X座標']);
    var paramEquipBustImageY = getParamNumber(['EquipBustImageY', '装備_画像Y座標']);
    var paramSkillBustImageX = getParamNumber(['SkillBustImageX', 'スキル_画像X座標']);
    var paramSkillBustImageY = getParamNumber(['SkillBustImageY', 'スキル_画像Y座標']);
    var paramMainBustImageX  = getParamNumber(['MainBustImageX', 'メイン_画像X座標']);
    var paramMainBustImageY  = getParamNumber(['MainBustImageY', 'メイン_画像Y座標']);
    var paramUnderContents   = getParamBoolean(['UnderContents', 'コンテンツの下に表示']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        this.pluginCommandBustStatus(command.replace(metaTagPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandBustStatus = function(command, args) {
        switch (getCommandName(command)) {
            case '_IMAGE_CHANGE' :
            case '画像差し替え' :
                var actor1 = $gameActors.actor(getArgNumber(args[0], 1));
                actor1.setBustImageName(getArgString(args[1]));
                break;
            case '_ANIME_CHANGE' :
            case '動画差し替え' :
                var actor2 = $gameActors.actor(getArgNumber(args[0], 1));
                actor2.setBustAnimationId(getArgNumber(args[1]), 0);
                break;
        }
    };

    //=============================================================================
    // Game_Actor
    //  バスト画像を設定します。
    //=============================================================================
    var _Game_Actor_initMembers      = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.apply(this, arguments);
        this._bustImageName   = null;
        this._bustAnimationId = null;
    };

    Game_Actor.prototype.setBustImageName = function(value) {
        this._bustImageName = value;
    };

    Game_Actor.prototype.getBustImageName = function() {
        return this._bustImageName || getMetaValues(this.actor(), ['画像', 'Image']);
    };

    Game_Actor.prototype.getBustImageRect = function() {
        var rectString = getMetaValues(this.actor(), ['矩形', 'Rect']);
        var rect       = rectString ? getArgArrayEval(rectString, 0) : null;
        return rect ? new Rectangle(rect[0], rect[1], rect[2], rect[3]) : null;
    };

    Game_Actor.prototype.setBustAnimationId = function(value) {
        this._bustAnimationId = value || null;
    };

    Game_Actor.prototype.getBustAnimationId = function() {
        if (this._bustAnimationId) return this._bustAnimationId;
        var value = getMetaValues(this.actor(), ['動画', 'Animation']);
        return value ? getArgNumber(value, 1) : 0;
    };

    //=============================================================================
    // Window_Base
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_Base_initialize      = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function() {
        if (this.isNeedBust()) this._bustSprite = null;
        _Window_Base_initialize.apply(this, arguments);
    };

    Window_Base.prototype._createAllParts = function() {
        Window.prototype._createAllParts.call(this);
        if (this.isNeedBust()) this.createBustSprite();
    };

    Window_Base.prototype.isNeedBust = function() {
        var pos = this.getBustPosition();
        return pos !== null && (pos[0] !== 0 || pos[1] !== 0);
    };

    Window_Base.prototype.createBustSprite = function() {
        this._bustContainer = new Sprite();
        this._bustSprite    = new Sprite_Bust();
        this._bustContainer.addChild(this._bustSprite);
        this.addChildAt(this._bustContainer, paramUnderContents ? 2 : 3);
    };

    Window_Base.prototype.setBustPosition = function(x, y) {
        this._bustSprite.move(x - this.x, y - this.y);
    };

    Window_Base.prototype.getBustPosition = function() {
        return null;
    };

    Window_Base.prototype.refreshBust = function() {
        if (this._actor && this.isNeedBust()) {
            this.setBustPosition.apply(this, this.getBustPosition());
            this._bustSprite.refresh(this._actor);
        }
    };

    //=============================================================================
    // Window_MenuStatus
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_MenuStatus_refresh = Window_MenuStatus.prototype.refresh;
    Window_MenuStatus.prototype.refresh = function() {
        _Window_MenuStatus_refresh.apply(this, arguments);
        this._actor = $gameParty.members()[0];
        this.refreshBust();
    };

    var _Window_MenuStatus_setPendingIndex = Window_MenuStatus.prototype.setPendingIndex;
    Window_MenuStatus.prototype.setPendingIndex = function(index) {
        _Window_MenuStatus_setPendingIndex.apply(this, arguments);
        var actor = $gameParty.members()[0];
        if (actor === this._actor) return;
        this._actor = actor;
        this.refreshBust();
    };

    Window_MenuStatus.prototype.getBustPosition = function() {
        return [paramMainBustImageX, paramMainBustImageY];
    };

    //=============================================================================
    // Window_Status
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_Status_refresh      = Window_Status.prototype.refresh;
    Window_Status.prototype.refresh = function() {
        _Window_Status_refresh.apply(this, arguments);
        this.refreshBust();
    };

    Window_Status.prototype.getBustPosition = function() {
        return [paramBustImageX, paramBustImageY];
    };

    //=============================================================================
    // Window_EquipItem
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    Window_EquipItem.prototype.refresh = function() {
        Window_ItemList.prototype.refresh.apply(this, arguments);
        this.refreshBust();
    };

    Window_EquipItem.prototype.getBustPosition = function() {
        return [paramEquipBustImageX, paramEquipBustImageY];
    };

    //=============================================================================
    // Window_SkillList
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_SkillList_refresh      = Window_SkillList.prototype.refresh;
    Window_SkillList.prototype.refresh = function() {
        _Window_SkillList_refresh.apply(this, arguments);
        this.refreshBust();
    };

    Window_SkillList.prototype.getBustPosition = function() {
        return [paramSkillBustImageX, paramSkillBustImageY];
    };

    //=============================================================================
    // Scene_Equip
    //  装備変更時にバストイメージを更新します。
    //=============================================================================
    var _Scene_Equip_commandOptimize      = Scene_Equip.prototype.commandOptimize;
    Scene_Equip.prototype.commandOptimize = function() {
        _Scene_Equip_commandOptimize.apply(this, arguments);
        this._itemWindow.refreshBust();
    };

    var _Scene_Equip_commandClear      = Scene_Equip.prototype.commandClear;
    Scene_Equip.prototype.commandClear = function() {
        _Scene_Equip_commandClear.apply(this, arguments);
        this._itemWindow.refreshBust();
    };

    //=============================================================================
    // Sprite_Bust
    //  バスト画像のクラスです。
    //=============================================================================
    function Sprite_Bust() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Bust.prototype             = Object.create(Sprite_Base.prototype);
    Sprite_Bust.prototype.constructor = Sprite_Bust;

    Sprite_Bust.prototype.initialize = function() {
        Sprite_Base.prototype.initialize.call(this);
        this.anchor.x      = 0.5;
        this.anchor.y      = 1.0;
        this._actor        = null;
        this._equipSprites = [];
        this.z             = 0;
    };

    Sprite_Bust.prototype.refresh = function(actor) {
        this._actor = actor;
        this.drawMain();
        this.drawEquips();
        this.drawAnimation();
    };

    Sprite_Bust.prototype.drawMain = function() {
        var fileName = this._actor.getBustImageName();
        this.bitmap  = (fileName ? ImageManager.loadPicture(getArgString(fileName), 0) : null);
        var rect     = this._actor.getBustImageRect();
        if (rect) {
            this.setFrame(rect.x, rect.y, rect.width, rect.height);
        }
    };

    Sprite_Bust.prototype.drawAnimation = function() {
        var animationId = this._actor.getBustAnimationId();
        if (this._animationId === animationId && this.isAnyAnimationExist()) return;
        this._animationId = animationId;
        if (this.isAnyAnimationExist()) return;
        if (this.isNeedAnimation()) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    };

    Sprite_Bust.prototype.drawEquips = function() {
        this.clearEquips();
        this._actor.equips().forEach(function(equip) {
            if (equip) this.makeEquipSprite(equip);
        }.bind(this));
        this.sortEquips();
    };

    Sprite_Bust.prototype.clearEquips = function() {
        this._equipSprites.forEach(function(sprite) {
            this.parent.removeChild(sprite);
        }.bind(this));
        this._equipSprites = [];
    };

    Sprite_Bust.prototype.sortEquips = function() {
        this.parent.children.sort(this._compareChildOrder.bind(this));
    };

    Sprite_Bust.prototype._compareChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    Sprite_Bust.prototype.makeEquipSprite = function(equip) {
        var itemFileName = getMetaValues(equip, ['画像', 'Image']);
        if (itemFileName) {
            var sprite      = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.bitmap   = ImageManager.loadPicture(getArgString(itemFileName), 0);
            var xStr        = getMetaValues(equip, ['PosX', '座標X']);
            sprite.x        = this.x + (xStr ? getArgNumber(xStr) : 0);
            var yStr        = getMetaValues(equip, ['PosY', '座標Y']);
            sprite.y        = this.y + (yStr ? getArgNumber(yStr) : 0);
            var zStr        = getMetaValues(equip, ['PosZ', '座標Z']);
            sprite.z        = zStr !== undefined ? getArgNumber(zStr) : 1;
            var rectString  = getMetaValues(equip, ['矩形', 'Rect']);
            if (rectString) {
                var rect = getArgArrayEval(rectString, 0);
                sprite.setFrame(rect[0], rect[1], rect[2], rect[3]);
            }
            this.parent.addChild(sprite);
            this._equipSprites.push(sprite);
        }
    };

    Sprite_Bust.prototype.startAnimation = function() {
        Sprite_Base.prototype.startAnimation.call(this, $dataAnimations[this._animationId], false, 0);
    };

    Sprite_Bust.prototype.update = function() {
        Sprite_Base.prototype.update.call(this);
        if (this.isNeedAnimation()) this.updateAnimation();
    };

    Sprite_Bust.prototype.updateAnimation = function() {
        if (!this.isAnyAnimationExist()) {
            this.startAnimation();
        }
    };

    Sprite_Bust.prototype.isNeedAnimation = function() {
        return this._animationId > 0;
    };

    Sprite_Bust.prototype.isAnyAnimationExist = function() {
        if (this.isAnimationPlaying()) {
            return this._animationSprites.some(function(sprite) {
                return sprite.isPlaying();
            });
        } else {
            return false;
        }
    };

    Sprite_Base.prototype.stopAnimation = function() {
        if (this._animationSprites.length > 0) {
            this._animationSprites.forEach(function(animation) {
                animation.remove();
            });
        }
        this._animationSprites = [];
    };
})();

