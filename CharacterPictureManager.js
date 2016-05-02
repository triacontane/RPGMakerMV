//=============================================================================
// CharacterPictureManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/01 タクポンさん依頼版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 立ち絵表示管理プラグイン
 * @author トリアコンタン
 *
 * @help アクターの立ち絵画像の表示を管理します。
 * 画像はステートやHPの残量に応じて自在に変化できます。
 *
 * ・アクターのメモ欄に以下の通り記述すると、条件に応じて立ち絵が変化します。
 * <CPMノーマル:aaa> // 平常時は「aaa.png」が表示されます。
 * <CPM残HP50:bbb>   // HPが50%(10%単位で指定可)を下回ったら「bbb.png」が表示されます。
 * <CPMダメージ:kkk> // ダメージを受けた瞬間「kkk.png」が表示されます。
 * ※ファイル名には制御文字が利用可能です。
 *
 * 表示座標は以下のとおり定義します。
 * <CPM_X:100> // 立ち絵のX座標を100に設定します。
 * <CPM_Y:100> // 立ち絵のY座標を100に設定します。
 *
 * ・ステートのメモ欄に以下の通り記述すると、ステート有効時に立ち絵が変化します。
 * <CPMノーマル:ccc>  // 対象のステートが有効なら「ccc.png」が表示されます。
 *
 * ・スキルのメモ欄に以下の通り記述すると、スキルを使用した瞬間、立ち絵が変化します。
 * <CPMノーマル:ddd>  // スキルを使用した瞬間「ddd.png」が表示されます。
 *
 * 上層ピクチャ（衣装など）を定義することもできます。元画像の上に被るように表示されます。
 * 衣装は耐久値の割合によって画像を変更することができます。
 * 防具のメモ欄に以下の通り設定してください。
 * <CPM耐久:300>
 *
 * ・アクターのメモ欄に以下の通り記述すると、条件に応じて衣装が変化します。
 * <CPM上層ノーマル:eee> // 平常時は「eee.png」が表示されます。
 * <CPM上層耐久50:fff>   // 耐久度が50%(10%単位で指定可)を下回ったら「fff.png」が表示されます。
 * <CPM上層ダメージ:kkk> // ダメージを受けた瞬間「kkk.png」が表示されます。
 * <CPM上層耐久50ダメージ:lll>
 * // 耐久度が50%(10%単位で指定可)を下回った状態でダメージを受けた瞬間「lll.png」が表示されます。
 *
 * ・ステートのメモ欄に以下の通り記述すると、ステート有効時に立ち絵が変化します。
 * <CPM上層ノーマル:ggg> // 対象のステートが有効なら「ggg.png」が表示されます。
 * <CPM上層耐久50:hhh>   // 耐久度が50%(10%単位で指定可)を下回ったら「hhh.png」が表示されます。
 *
 * ・スキルのメモ欄に以下の通り記述すると、スキルを使用した瞬間、立ち絵が変化します。
 * <CPM上層ノーマル:iii> // スキルを使用した瞬間「iii.png」が表示されます。
 * <CPM上層耐久50:jjj>   // 耐久度が50%(10%単位で指定可)を下回ったら「jjj.png」が表示されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * CPM_SHOW [アクターID] [X座標] [Y座標]
 * 立ち絵表示 [アクターID] [X座標] [Y座標]
 *  戦闘で表示しているものと同じ立ち絵をマップの指定座標に表示します。
 *  例：CPM_SHOW 1 100 200
 *
 * CPM_HIDE [アクターID]
 * 立ち絵消去 [アクターID]
 *  表示している立ち絵を消去します。
 *  例：CPM_HIDE 1
 *
 * CPM_DAMAGE_ENDURANCE [アクターID] [減算値]
 * 耐久ダメージ [アクターID] [減算値]
 *  装備している全ての防具の耐久値を指定した値だけ減らします。
 *  例：CPM_DAMAGE_ENDURANCE 1 100
 *
 * CPM_RESTORE_ENDURANCE [アクターID]
 * 耐久回復 [アクターID]
 *  装備している全ての防具の耐久値を完全に回復します。
 *  例：CPM_RESTORE_ENDURANCE 1
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'CharacterPictureManager';
    var metaTagPrefix = 'CPM';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };
    
    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return evalFlg ? eval(text) : text;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandCharacterPictureManager(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandCharacterPictureManager = function (command, args) {
        switch (getCommandName(command)) {
            case '立ち絵表示' :
            case 'CPM_SHOW' :
                var x = getArgNumber(args[1], 1);
                var y = getArgNumber(args[2], 1);
                $gameActors.actor(getArgNumber(args[0], 1)).showCpForMap(x, y);
                break;
            case '立ち絵消去' :
            case 'CPM_HIDE' :
                $gameActors.actor(getArgNumber(args[0], 1)).hideCpForMap();
                break;
            case '耐久ダメージ' :
            case 'CPM_DAMAGE_ENDURANCE' :
                $gameActors.actor(getArgNumber(args[0], 1)).damageEndurance(getArgNumber(args[1], 0));
                break;
            case '耐久回復' :
            case 'CPM_RESTORE_ENDURANCE' :
                $gameActors.actor(getArgNumber(args[0], 1)).restoreEndurance();
                break;
        }
    };

    //=============================================================================
    // Game_Item
    //  耐久度の管理をします。
    //=============================================================================
    var _Game_Item_setEquip = Game_Item.prototype.setEquip;
    Game_Item.prototype.setEquip = function(isWeapon, itemId) {
        _Game_Item_setEquip.apply(this, arguments);
        this._endurance = this.getMaxEndurance();
    };

    Game_Item.prototype.getMaxEndurance = function() {
        var value = this.object() ? getMetaValue(this.object(), '耐久') : null;
        return value ? getArgNumber(value, 1) : 0;
    };

    Game_Item.prototype.getEndurance = function() {
        return this._endurance;
    };

    Game_Item.prototype.damageEndurance = function(value) {
        this._endurance = Math.max(this._endurance - value, 0);
    };

    Game_Item.prototype.restoreEndurance = function() {
        this._endurance = this.getMaxEndurance();
    };

    //=============================================================================
    // Game_Battler
    //  キャラクターピクチャの情報を定義します。
    //=============================================================================
    var _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.apply(this, arguments);
        this._cpAnimationName = null;
        this._cpAnimationNameUpper = null;
        this._cpAnimationCount = 0;
    };

    Game_Battler.prototype.updateCpAnimation = function() {
        if (this._cpAnimationCount <= 0) {
            this._cpAnimationName      = null;
            this._cpAnimationNameUpper = null;
        } else {
            this._cpAnimationCount--;
        }
    };

    Game_Battler.prototype.getCharacterPictureNameLower = function() {
        this._upperPicture = false;
        return this.getCpAnimation() || this.getCpState() || this.getCpHp() || this.getPictureName('ノーマル');
    };

    Game_Battler.prototype.getCharacterPictureNameUpper = function() {
        this._upperPicture = true;
        return this.getCpAnimation() || this.getCpState() || this.getCpCloth(null) || this.getPictureName('ノーマル');
    };

    Game_Battler.prototype.isUseCharacterPicture = function() {
        this._upperPicture = false;
        return this.getPictureName('ノーマル');
    };

    Game_Battler.prototype.setCpAnimation = function(lowerName, upperName, frame) {
        this._cpAnimationName      = lowerName;
        this._cpAnimationNameUpper = upperName;
        this._cpAnimationCount     = frame;
    };

    Game_Battler.prototype.setCpAnimationSkill = function() {
        var action = this.currentAction();
        this._upperPicture = false;
        var lowerName = this.getCpSkill(action.item());
        this._upperPicture = true;
        var upperName = this.getCpSkill(action.item());
        this.setCpAnimation(lowerName, upperName, 30);
    };

    Game_Battler.prototype.setCpAnimationDamage = function() {
        this._upperPicture = false;
        var lowerName = this.getCpDamage();
        this._upperPicture = true;
        var upperName = this.getCpDamage();
        this.setCpAnimation(lowerName, upperName, 30);
    };

    Game_Battler.prototype.getCpAnimation = function() {
        return this._upperPicture ? this._cpAnimationNameUpper : this._cpAnimationName;
    };

    Game_Battler.prototype.getCpSkill = function(skill) {
        return (this._upperPicture ? this.getCpCloth(skill) : null) || this.getPictureName('ノーマル', skill);
    };

    Game_Battler.prototype.getCpDamage = function() {
        return (this._upperPicture ? this.getCpCloth(null, 'ダメージ') : null) || this.getPictureName('ダメージ');
    };

    Game_Battler.prototype.getCpState = function() {
        this.sortStates();
        var states = this.states(), pictureName = null;
        for (var i = 0, n = states.length; i < n; i++) {
            if (this._upperPicture) {
                pictureName = this.getCpCloth(states[i]);
                if (pictureName) return pictureName;
            }
            pictureName = this.getPictureName('ノーマル', states[i]);
            if (pictureName) return pictureName;
        }
        return null;
    };

    Game_Battler.prototype.getCpHp = function() {
        for (var i = 0; i < 10; i++) {
            var pictureName = this.getPictureName('残HP' + String(i * 10));
            if (pictureName && this.hpRate() <= i / 10) return pictureName;
        }
        return null;
    };

    Game_Battler.prototype.getCpCloth = function(data, addition) {
        for (var i = 0; i < 10; i++) {
            var pictureName = this.getPictureName('耐久' + String(i * 10) + (addition ? addition : ''), data);
            if (pictureName && this.getClothHp() <= i * 10) return pictureName;
        }
        return null;
    };

    Game_Battler.prototype.getCpX = function() {
        var x = getMetaValue(this.getData(), '_X');
        return x ? getArgNumber(x) : 0;
    };

    Game_Battler.prototype.getCpY = function() {
        var y = getMetaValue(this.getData(), '_Y');
        return y ? getArgNumber(y) : 0;
    };

    Game_Battler.prototype.getClothHp = function() {
        var max = this.getMaxEndurance();
        if (max === 0) max = 1;
        return this.getEndurance() / max * 100;
    };

    Game_Battler.prototype.getPictureName = function(name, data) {
        if (!data) data = this.getData();
        var pictureName = getMetaValue(data, (this._upperPicture ? '上層' : '') + name);
        return pictureName ? getArgString(pictureName) : null;
    };

    Game_Battler.prototype.getData = function() {
        return null;
    };

    Game_Actor.prototype.getData = function() {
        return this.actor();
    };

    Game_Enemy.prototype.getData = function() {
        return this.enemy();
    };

    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.apply(this, arguments);
        this._mapPictureVisible = false;
        this._mapPictureX       = 0;
        this._mapPictureY       = 0;
        this._characterPictureVisible = false;
        this._characterPictureX = 0;
        this._characterPictureY = 0;
    };

    Game_Actor.prototype.showCpForMap = function(x, y) {
        this._mapPictureVisible = true;
        this._mapPictureX       = x;
        this._mapPictureY       = y;
        this.setPositionForMap();
    };

    Game_Actor.prototype.hideCpForMap = function() {
        this._mapPictureVisible = false;
        this.setPositionForMap();
    };

    Game_Actor.prototype.setPositionForMap = function() {
        this._characterPictureX = this._mapPictureX;
        this._characterPictureY = this._mapPictureY;
        this._characterPictureVisible = this._mapPictureVisible;
    };

    Game_Actor.prototype.setPositionForBattle = function() {
        this._characterPictureX = this.getCpX();
        this._characterPictureY = this.getCpY();
        this._characterPictureVisible = true;
    };

    Game_Actor.prototype.getCharacterPictureX = function() {
        return this._characterPictureX;
    };

    Game_Actor.prototype.getCharacterPictureY = function() {
        return this._characterPictureY;
    };

    Game_Actor.prototype.getCharacterPictureVisible = function() {
        return this._characterPictureVisible;
    };

    Game_Actor.prototype.getHasEnduranceArmors = function() {
        return this._equips.filter(function(item) {
            return item && item.isArmor() && item.getMaxEndurance() > 0;
        });
    };

    Game_Actor.prototype.getEndurance = function() {
        var endurance = 0;
        this.getHasEnduranceArmors().forEach(function (armor) {
            endurance += armor.getEndurance();
        }.bind(this));
        return endurance;
    };

    Game_Enemy.prototype.getEndurance = function() {
        return 0;
    };

    Game_Actor.prototype.getMaxEndurance = function() {
        var maxEndurance = 0;
        this.getHasEnduranceArmors().forEach(function (armor) {
            maxEndurance += armor.getMaxEndurance();
        }.bind(this));
        return maxEndurance;
    };

    Game_Enemy.prototype.getMaxEndurance = function() {
        return 0;
    };

    Game_Actor.prototype.damageEndurance = function(value) {
        this.getHasEnduranceArmors().forEach(function (armor) {
            armor.damageEndurance(value);
        }.bind(this));
    };

    Game_Enemy.prototype.damageEndurance = function() {
    };

    Game_Actor.prototype.restoreEndurance = function() {
        this.getHasEnduranceArmors().forEach(function (armor) {
            armor.restoreEndurance();
        }.bind(this));
    };

    Game_Enemy.prototype.restoreEndurance = function() {
    };

    //=============================================================================
    // Game_Action
    //  キャラクターピクチャにアニメーションを設定します。
    //=============================================================================
    var _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        _Game_Action_executeDamage.apply(this, arguments);
        if (value > 0) target.setCpAnimationDamage();
    };

    //=============================================================================
    // BattleManager
    //  キャラクターピクチャにアニメーションを設定します。
    //=============================================================================
    var _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        this._subject.setCpAnimationSkill();
    };

    //=============================================================================
    // Scene_Base
    //  キャラクターピクチャを作成します。
    //=============================================================================
    Scene_Base.prototype.createCharacterPicture = function() {
        this._characterPictures = {};
        $gameParty.members().forEach(function (actor) {
            var sprite = new Sprite_CharacterPicture();
            sprite.setActor(actor);
            this._characterPictures[actor.actorId()] = sprite;
            this.addChild(sprite);
        }.bind(this));
    };

    var _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function() {
        _Scene_Battle_createSpriteset.apply(this, arguments);
        this.createCharacterPicture();
        $gameParty.members().forEach(function (actor) {
            actor.setPositionForBattle();
        }.bind(this));
    };

    var _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.apply(this, arguments);
        this.createCharacterPicture();
        $gameParty.members().forEach(function (actor) {
            actor.setPositionForMap();
        }.bind(this));
    };

    //=============================================================================
    // Sprite_CharacterPicture
    //  キャラクターピクチャのスプライトです。下層と上層の二段重ねになっています。
    //=============================================================================
    function Sprite_CharacterPicture() {
        this.initialize.apply(this, arguments);
    }

    Sprite_CharacterPicture.prototype = Object.create(Sprite_Base.prototype);
    Sprite_CharacterPicture.prototype.constructor = Sprite_CharacterPicture;

    Sprite_CharacterPicture.prototype.initialize = function() {
        Sprite_Base.prototype.initialize.apply(this, arguments);
        this.visible    = true;
        this._actor     = null;
        this._lowerName = null;
        this._upperName = null;
        this.createUpperSprite();
    };

    Sprite_CharacterPicture.prototype.setActor = function(actor) {
        if (actor.isUseCharacterPicture()) this._actor = actor;
    };

    Sprite_CharacterPicture.prototype.createUpperSprite = function() {
        this._upperSprite = new Sprite();
        this.addChild(this._upperSprite);
    };

    Sprite_CharacterPicture.prototype.update = function() {
        if (this._actor) {
            this.updateProperty();
            this._actor.updateCpAnimation();
            this.updateLower();
            this.updateUpper();
        }
    };

    Sprite_CharacterPicture.prototype.updateProperty = function() {
        this.x       = this._actor.getCharacterPictureX();
        this.y       = this._actor.getCharacterPictureY();
        this.visible = this._actor.getCharacterPictureVisible();
    };

    Sprite_CharacterPicture.prototype.updateLower = function() {
        var name = this._actor.getCharacterPictureNameLower();
        if (name !== this._lowerName) {
            this.setBitmap(this, name);
            this._lowerName = name;
        }
    };

    Sprite_CharacterPicture.prototype.updateUpper = function() {
        var name = this._actor.getCharacterPictureNameUpper();
        if (name !== this._upperName) {
            this.setBitmap(this._upperSprite, name);
            this._upperName = name;
        }
    };

    Sprite_CharacterPicture.prototype.setBitmap = function(target, name) {
        if (name) {
            var newBitmap = ImageManager.loadPicture(name, 0);
            newBitmap.addLoadListener(function () {
                target.bitmap = newBitmap;
            }.bind(this));
        } else {
            target.bitmap = null;
        }
    };
})();

