//=============================================================================
// Gacha.js
//
// (c)2016 KADOKAWA CORPORATION./YOJI OJIMA
//=============================================================================
// Version(modify triacontane)
// 1.8.3 2020/06/13 1.8.2の修正の中に本体バージョン1.5.x以前では動作しない記述があったため1.5.xでも動作するよう修正
// 1.8.2 2020/03/16 複数種類のアイテム入手時のメッセージに武器防具が含まれる場合、アイテム扱いされる不具合を修正
// 1.8.1 2019/09/09 Scene_Gachaクラスを外部から参照できるようグローバル領域に出しました。
// 1.8.0 2019/09/09 ガチャの詳細結果画面に専用画像を指定できる機能を追加
// 1.7.0 2019/08/25 ガチャの結果表示画面を追加
// 1.6.0 2018/02/22 ガチャのロット数に変数を使用できるよう修正
// 1.5.0 2018/01/14 新規アイテム入手時にアニメーションを設定できる機能を追加
// 1.4.0 2017/12/05 ガチャの演出を省略できるスイッチを追加。アイテム入手時に効果音を演奏する機能を追加。
// 1.3.0 2017/11/11 新規アイテム入手時に通知する機能を追加
// 1.2.0 2017/11/05 10連ガチャの機能を追加
// 1.1.0 2016/03/11 変数でガチャを引ける機能を追加。可能な限りガチャを引き続ける機能を追加
// 1.0.0 2016/01/01 初版
// ----------------------------------------------------------------------------

/*:
 * @plugindesc Get the item at random
 * @author Takeya Kimura
 *
 * @param Help Message Text
 * @desc The help message for gacha window. "Required Amount" is replaced with the Required Amount.
 * @default 1回Required Amount\Gでガチャを引きます
 *
 * @param Button Text
 * @desc The button text for gacha commands.
 * @default ガチャを引く
 *
 * @param Button Text 10 Time
 * @desc The button text for 10 times gacha commands.
 * @default 10連ガチャを引く
 *
 * @param Button Text All
 * @desc 全額ガチャボタンに表示するテキストです。
 * 機能を使わない場合は空にしてください。
 * @default 全額でガチャを引く
 *
 * @param Get Message Text
 * @desc The message of After receiving. "Item Name" is replaced with the received item name.
 * @default GET Item Name
 *
 * @param Show Item Description
 * @desc The switch of item description display
 * @default 0
 * @type select
 * @option Hidden
 * @value 0
 * @option Show
 * @value 1
 *
 * @param New Item Notice
 * @desc 新規アイテム入手時の通知です。指定しない場合は表示されません。
 * @default \C[2]New!!\C[0]
 *
 * @param Effect
 * @desc The animation number for get effect.
 * @default 119
 * @require 1
 * @type animation
 *
 * @param Rank1 Effect
 * @desc The animation number for rank 1 effect. If you specify -1, does not display the animation.
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank2 Effect
 * @desc The animation number for rank 2 effect. If you specify -1, does not display the animation.
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank3 Effect
 * @desc The animation number for rank 3 effect. If you specify -1, does not display the animation.
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank4 Effect
 * @desc The animation number for rank 4 effect. If you specify -1, does not display the animation.
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank5 Effect
 * @desc The animation number for rank 5 effect. If you specify -1, does not display the animation.
 * @default -1
 * @require 1
 * @type animation
 *
 * @param New Effect
 * @desc The animation number for new item effect. If you specify -1, does not display the animation.
 * @default -1
 * @require 1
 * @type animation
 *
 * @param ME
 * @desc The ME name for get music effect.
 * @default Organ
 * @require 1
 * @dir audio/me/
 * @type file
 *
 * @param  Required Amount
 * @desc The Gold for gacha.
 * @default 100
 *
 * @param  Required Amount
 * @desc ガチャを引くのに必要なGです。
 * @default 100
 *
 * @param  Required Variable
 * @desc ガチャのコストを指定された変数に変更します。
 * 1回ごとに「Required Amount」の値だけ変数が減ります。
 * @default 0
 *
 * @param Effect Stop Switch
 * @desc 対象スイッチがONになっているとき、ガチャの演出を省略します。
 * @default 0
 * @type switch
 *
 * @param SE
 * @desc ガチャ終了時に演奏される効果音です。演出省略時も演奏されます。
 * @default Item3
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @noteParam gachaImage
 * @noteRequire 1
 * @noteDir img/gacha/
 * @noteType file
 * @noteData items
 *
 * @help 変数でガチャを引けるように修正
 * 可能な限りガチャを引き続ける機能を追加
 * by triacontane
 *
 * Plugin Command:
 *   Gacha open                 # Open the Gacha screen
 *   Gacha add item 1           # Add item #1 to the Gacha
 *   Gacha remove item 1        # Remove item #1 from the Gacha
 *   Gacha clear                # Clear the Gacha
 *
 *
 * Item Note:
 *   <gachaImage:image>        # Gacha image file name. Please image put in "img/gacha/" folder.
 *   <gachaNumLot:10>          # The number of the lottery.
 *   <gachaRank:5>             # The rank of the item(1-5).
 *   <gachaResultX: 20>        # ガチャ結果画面で表示する際の中心X座標です。省略すると画像の中央が指定されます。
 *   <gachaResultY: 20>        # ガチャ結果画面で表示する際の中心Y座標です。省略すると画像の中央が指定されます。
 */

/*:ja
 * @plugindesc ランダムにアイテムを取得します。
 * @author Takeya Kimura
 *
 * @param Help Message Text
 * @desc ガチャ画面のヘルプメッセージです。「Required Amount」は消費Gと置換されます。
 * @default 1回Required Amount\Gでガチャを引きます
 *
 * @param Button Text
 * @desc ガチャボタンに表示するテキストです。
 * @default ガチャを引く
 *
 * @param Button Text 10 Time
 * @desc 10連ガチャボタンに表示するテキストです。
 * 機能を使わない場合は空にしてください。
 * @default 10連ガチャを引く
 *
 * @param Button Text All
 * @desc 全額ガチャボタンに表示するテキストです。
 * 機能を使わない場合は空にしてください。
 * @default 全額でガチャを引く
 *
 * @param Get Message Text
 * @desc ガチャを引いた後のメッセージです。「Item Name」は取得アイテム名と置換されます。
 * @default GET Item Name
 *
 * @param Show Item Description
 * @desc 1でアイテム取得時に説明を表示します。[0: 説明非表示 1: 説明表示]
 * @default 0
 * @type select
 * @option 説明非表示
 * @value 0
 * @option 説明表示
 * @value 1
 *
 * @param New Item Notice
 * @desc 新規アイテム入手時の通知です。指定しない場合は表示されません。
 * @default \C[2]New!!\C[0]
 *
 * @param Effect
 * @desc アイテム取得時のアニメーションIDを指定します。
 * @default 119
 * @require 1
 * @type animation
 *
 * @param Rank1 Effect
 * @desc ランク1の時のアニメーションIDを指定します。-1を指定するとアニメーションを表示しません。
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank2 Effect
 * @desc ランク2の時のアニメーションIDを指定します。-1を指定するとアニメーションを表示しません。
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank3 Effect
 * @desc ランク3の時のアニメーションIDを指定します。-1を指定するとアニメーションを表示しません。
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank4 Effect
 * @desc ランク4の時のアニメーションIDを指定します。-1を指定するとアニメーションを表示しません。
 * @default -1
 * @require 1
 * @type animation
 *
 * @param Rank5 Effect
 * @desc ランク5の時のアニメーションIDを指定します。-1を指定するとアニメーションを表示しません。
 * @default -1
 * @require 1
 * @type animation
 *
 * @param New Effect
 * @desc 新規アイテム入手時のアニメーションIDを指定します。-1を指定するとアニメーションを表示しません。
 * @default -1
 * @require 1
 * @type animation
 *
 * @param ME
 * @desc アイテム取得時のMEを指定します。
 * @default Organ
 * @require 1
 * @dir audio/me/
 * @type file
 *
 * @param Required Amount
 * @desc ガチャを引くのに必要なGです。
 * @default 100
 *
 * @param Required Variable
 * @desc ガチャのコストを指定された変数に変更します。
 * 1回ごとに「Required Amount」の値だけ変数が減ります。
 * @default 0
 *
 * @param Cost Unit
 * @desc ガチャのコストに使う変数の単位です。
 * @default 回
 *
 * @param Effect Stop Switch
 * @desc 対象スイッチがONになっているとき、ガチャの演出を省略します。
 * @default 0
 * @type switch
 *
 * @param SE
 * @desc ガチャ終了時に演奏される効果音です。演出省略時も演奏されます。
 * @default Item3
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @noteParam gachaImage
 * @noteRequire 1
 * @noteDir img/gacha/
 * @noteType file
 * @noteData items
 *
 * @help
 * もともとの公式ガチャプラグインに対して以下の機能追加を行いました。
 * ・変数でガチャを引けるように修正
 * ・可能な限りガチャを引き続ける機能を追加
 * ・10連ガチャの機能を追加
 * ・専用の画像やトリミング画像を使ったガチャの結果画面を追加
 * ・新規アイテム入手時の通知とエフェクトを追加（新規アイテムのエフェクトは最後のコマで停止します）
 * ・ガチャの演出をカットするスイッチを追加
 * ・ガチャのロット数に変数を使用できるよう修正
 *
 *
 * Plugin Command:
 *   Gacha open                 # ガチャ画面を開きます。
 *   Gacha add item 1           # アイテム番号1をガチャ対象に追加します。
 *   Gacha remove item 1        # アイテム番号1をガチャ対象から外します。
 *   Gacha clear                # 全てのガチャ対象をクリアします。
 *
 *
 * Item Note:
 *   <gachaImage:image>        # ガチャアイテムの画像を指定します。画像はimg/gacha/フォルダ内に入れてください。
 *   <gachaNumLot:10>          # ガチャアイテムのくじ数を指定します。
 *   <gachaRank:5>             # ガチャアイテムのランクを1から5の間で指定します。
 *   <gachaResultX:20>         # ガチャ結果画面で表示する際の中心X座標です。ガチャアイテムの画像が
 *                               トリミングされて表示されます。省略すると画像の中央が指定されます。
 *   <gachaResultY:20>         # ガチャ結果画面で表示する際の中心Y座標です。
 *   <gachaResultImage:image2> # ガチャ結果画面で表示する画像を個別に指定する場合に記述します。
 */

function Scene_Gacha() {
    this.initialize.apply(this, arguments);
}

(function() {

    var parameters     = PluginManager.parameters('Gacha');
    var message        = String(parameters['Help Message Text'] || '1回Required Amount\\Gでガチャを引きます');
    var buttonText     = String(parameters['Button Text'] || 'ガチャを引く');
    var buttonText10   = String(parameters['Button Text 10 Time'] || '');
    var buttonTextAll  = String(parameters['Button Text All'] || '');
    var getText        = String(parameters['Get Message Text'] || 'GET Item Name');
    var itemDescEnable = !!Number(parameters['Show Item Description'] || 0);
    var newItemNotice  = String(parameters['New Item Notice'] || 'New!!');
    var effect         = Number(parameters['Effect'] || '119');
    var rankEffect     = [];
    rankEffect.push(Number(parameters['Rank1 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank2 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank3 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank4 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank5 Effect'] || '-1'));
    var newEffect          = Number(parameters['New Effect'] || '-1');
    var me                 = String(parameters['ME'] || 'Organ');
    var amount             = Number(parameters['Required Amount'] || '100');
    var variable           = Number(parameters['Required Variable'] || '0');
    var costUnit           = String(parameters['Cost Unit'] || '回');
    var effectStopSwitchId = Number(parameters['Effect Stop Switch'] || 0);
    var se                 = String(parameters['SE'] || '');

    var reg = /Required Amount/gi;
    message = message.replace(reg, String(amount));

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Gacha') {
            switch (args[0]) {
                case 'open':
                    SceneManager.push(Scene_Gacha);
                    break;

                case 'add':
                    $gameSystem.addToGacha(args[1], Number(args[2]));
                    break;

                case 'remove':
                    $gameSystem.removeFromGacha(args[1], Number(args[2]));
                    break;

                case 'clear':
                    $gameSystem.clearGacha();
                    break;
            }
        }
    };

    Game_System.prototype.addToGacha = function(type, dataId) {
        if (!this._GachaFlags) {
            this.clearGacha();
        }
        var typeIndex = this.gachaTypeToIndex(type);
        if (typeIndex >= 0) {
            this._GachaFlags[typeIndex][dataId] = true;
        }
    };

    Game_System.prototype.removeFromGacha = function(type, dataId) {
        if (this._GachaFlags) {
            var typeIndex = this.gachaTypeToIndex(type);
            if (typeIndex >= 0) {
                this._GachaFlags[typeIndex][dataId] = false;
            }
        }
    };

    Game_System.prototype.gachaTypeToIndex = function(type) {
        switch (type) {
            case 'item':
                return 0;
            case 'weapon':
                return 1;
            case 'armor':
                return 2;
            default:
                return -1;
        }
    };

    Game_System.prototype.clearGacha = function() {
        this._GachaFlags = [[], [], []];
    };

    Game_System.prototype.isInGacha = function(item) {
        if (this._GachaFlags && item) {
            var typeIndex = -1;
            if (DataManager.isItem(item)) {
                typeIndex = 0;
            } else if (DataManager.isWeapon(item)) {
                typeIndex = 1;
            } else if (DataManager.isArmor(item)) {
                typeIndex = 2;
            }
            if (typeIndex >= 0) {
                return !!this._GachaFlags[typeIndex][item.id];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    Scene_Gacha.prototype             = Object.create(Scene_MenuBase.prototype);
    Scene_Gacha.prototype.constructor = Scene_Gacha;

    Scene_Gacha.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._item                  = null;
        this._effectPlaying         = false;
        this._rankEffectPlaying     = false;
        this._wait                  = 0;
        this._effectSprite          = null;
        this._windowFadeSprite      = null;
        this._screenFadeOutDuration = 0;
        this._screenFadeInDuration  = 0;
        this._lot        = [];
        this._resultList = [];

        var numLot;
        var item, i, j;
        for (i = 1; i < $dataItems.length; i++) {
            item = $dataItems[i];
            if ($gameSystem.isInGacha(item)) {
                numLot = this.getItemNumLot(item);
                for (j = 0; j < numLot; j++) {
                    this._lot.push(item);
                }
            }
        }
        for (i = 1; i < $dataWeapons.length; i++) {
            item = $dataWeapons[i];
            if ($gameSystem.isInGacha(item)) {
                numLot = this.getItemNumLot(item);
                for (j = 0; j < numLot; j++) {
                    this._lot.push(item);
                }
            }
        }
        for (i = 1; i < $dataArmors.length; i++) {
            item = $dataArmors[i];
            if ($gameSystem.isInGacha(item)) {
                numLot = this.getItemNumLot(item);
                for (j = 0; j < numLot; j++) {
                    this._lot.push(item);
                }
            }
        }
    };

    Scene_Gacha.prototype.getItemNumLot = function(item) {
        var text = item.meta.gachaNumLot || '0';
        text = text.replace(/\\V\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\\V\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        return parseInt(text) || 0;
    };

    Scene_Gacha.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);

        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createGetCommandWindow();
        this.createGetWindow();
        this.createMessageWindow();
        this.createResultWindow();

        this._rankSprite = new Sprite_GachaEffect();
        this._rankSprite.keepDisplay(true);
        this.addChild(this._rankSprite);

        this._windowFadeSprite = new ScreenSprite();
        this._windowFadeSprite.setColor(0, 0, 0);
        this._windowFadeSprite.opacity = 0;
        this._windowFadeSprite.visible = false;
        this.addChild(this._windowFadeSprite);

        this._effectSprite   = new Sprite_GachaEffect();
        this._effectSprite.x = Graphics.boxWidth / 2;
        this._effectSprite.y = Graphics.boxHeight / 2;
        this.addChild(this._effectSprite);

        this._helpWindow.setText(message);
    };

    Scene_Gacha.prototype.createGoldWindow = function() {
        var y              = this._helpWindow.height;
        this._goldWindow   = this.isCostTypeVariable() ? new Window_Cost(0, y) : new Window_Gold(0, y);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };

    Scene_Gacha.prototype.createCommandWindow = function() {
        this._commandWindow   = new Window_GachaCommand(this._goldWindow.x, this._purchaseOnly);
        this._commandWindow.y = this._helpWindow.height;
        this._commandWindow.setHandler('gachaAll', this.commandGacha.bind(this, Infinity));
        this._commandWindow.setHandler('gacha10', this.commandGacha.bind(this, 10));
        this._commandWindow.setHandler('gacha', this.commandGacha.bind(this, 1));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.lotIsValid(this._lot.length > 0);
        this._commandWindow.clearCommandList();
        this._commandWindow.makeCommandList();
        this._commandWindow.refresh();
        this.addWindow(this._commandWindow);
    };

    Scene_Gacha.prototype.createDummyWindow = function() {
        var wy            = this._commandWindow.y + this._commandWindow.height;
        var wh            = Graphics.boxHeight - wy;
        this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
        this.addWindow(this._dummyWindow);
    };

    Scene_Gacha.prototype.createGetCommandWindow = function() {
        this._getCommandWindow   = new Window_GachaGetCommand(Graphics.boxWidth, false);
        this._getCommandWindow.y = Graphics.boxHeight - this._getCommandWindow.height;
        this._getCommandWindow.setHandler('ok', this.commandOk.bind(this));
        this._getCommandWindow.setHandler('cancel', this.commandCancel.bind(this));
        this._getCommandWindow.hide();
        this.addWindow(this._getCommandWindow);
    };

    Scene_Gacha.prototype.createGetWindow = function() {
        var wy          = this._helpWindow.height;
        var wh          = Graphics.boxHeight - wy - this._getCommandWindow.height;
        this._getWindow = new Window_GachaGet(0, wy, Graphics.boxWidth, wh);
        this._getWindow.itemDescEnable(itemDescEnable);
        this._getWindow.hide();
        this.addWindow(this._getWindow);
    };

    Scene_Gacha.prototype.createResultWindow = function() {
        var wy          = this._helpWindow.height;
        var wh          = Graphics.boxHeight - wy - this._messageWindow.height;
        this._resultWindow = new Window_GachaResult(0, wy, Graphics.boxWidth, wh);
        this._resultWindow.hide();
        this.addWindow(this._resultWindow);
    };

    Scene_Gacha.prototype.createMessageWindow = function() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    };

    Scene_Gacha.prototype.isCostTypeVariable = function() {
        return variable > 0;
    };

    Scene_Gacha.prototype.commandGacha = function(remainCount) {
        if (remainCount) {
            this._remainCount = remainCount;
        }
        // Draw lots
        if (this._lot.length <= 0) {
            this._item = null;
        } else {
            this._item = this._lot[(Math.random() * this._lot.length) >> 0];
            this.consumeCost();
            this.getGacha();

            this._goldWindow.refresh();
        }

        this._commandWindow.deactivate();
        this._getCommandWindow.deactivate();

        if (this.isEffectStop()) {
            this.commandOk();
        } else if (this._item) {
            this._getWindow.setItem(this._item);

            this._screenFadeOut();
            this._effectPlaying = true;
            this._wait          = 0;

            var animation = $dataAnimations[effect];
            this._effectSprite.startAnimation(animation, false, 0);

            AudioManager.playMe({'name': me, 'volume': 90, 'pitch': 100, 'pan': 0});
        } else {
            this._commandWindow.activate();
        }
    };

    Scene_Gacha.prototype.isEffectStop = function() {
        return effectStopSwitchId > 0 && $gameSwitches.value(effectStopSwitchId);
    };

    Scene_Gacha.prototype.consumeCost = function() {
        if (this.isCostTypeVariable()) {
            var value = $gameVariables.value(variable);
            $gameVariables.setValue(variable, value - amount);
        } else {
            $gameParty.loseGold(amount);
        }
    };

    Scene_Gacha.prototype.getGacha = function() {
        this._newItem = !$gameParty.hasItem(this._item, true);
        $gameParty.gainItem(this._item, 1);
        this._resultList.push(this._item);
    };

    Scene_Gacha.prototype.getNewItemText = function() {
        return this._newItem ? (newItemNotice) : '';
    };

    Scene_Gacha.prototype.commandOk = function() {
        this._effectSprite.allRemove();
        this._rankSprite.allRemove();
        if (this._remainCount > 1 && this._commandWindow.canGacha()) {
            this._getWindow.hide();
            this._remainCount--;
            this.commandGacha(null);
        } else {
            if (this.isEffectStop() || this.twoOrMoreKindOfResultItem()) {
                this.showAllResult();
            } else {
                this.backToCommand();
            }
        }
    };

    Scene_Gacha.prototype.twoOrMoreKindOfResultItem = function() {
      return this._resultList.some(function(data, index, self) {
        return self.filter(function(d) {
          return d !== data;
        }).length > 0;
      });
    };

    Scene_Gacha.prototype.generateResultMessage = function() {
      var resultsForMessage = {
        items: [],
        weapons: [],
        armors: []
      };
      this._resultList.forEach(function(data) {
        var array = DataManager.isItem(data) ? resultsForMessage.items : DataManager.isWeapon(data) ?
            resultsForMessage.weapons : resultsForMessage.armors;
        if (!array[data.id]) {
          array[data.id] = 0;
        }
        array[data.id]++;
      });
      resultsForMessage.items.forEach(function(itemNum, id) {
        $gameMessage.add($dataItems[id].name + ' x ' + itemNum);
      });
      resultsForMessage.weapons.forEach(function(weaponNum, id) {
        $gameMessage.add($dataWeapons[id].name + ' x ' + weaponNum);
      });
      resultsForMessage.armors.forEach(function(armorNum, id) {
        $gameMessage.add($dataArmors[id].name + ' x ' + armorNum);
      });
    };

    Scene_Gacha.prototype.showAllResult = function() {
        this.generateResultMessage();
        if (se) {
            AudioManager.playSe({name: se, volume: 90, pitch: 100, pan: 0});
        }
        this._resultWindow.drawResult(this._resultList);
        this._resultWindow.open();
        $gameMessage.add('を手に入れた！');
        this._textShowing = true;
    };

    Scene_Gacha.prototype.backToCommand = function() {
        this._resultList = [];
        this._goldWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._getCommandWindow.hide();
        this._getWindow.hide();
        this._helpWindow.setText(message);
        this._resultWindow.close();
        this._item = null;

        this._commandWindow.clearCommandList();
        this._commandWindow.makeCommandList();
        this._commandWindow.refresh();
    };

    Scene_Gacha.prototype.commandCancel = function() {
        if (this._remainCount === Infinity) {
            this._remainCount = 0;
        }
        this.commandOk();
    };

    Scene_Gacha.prototype.update = function() {
        Scene_Menu.prototype.update.call(this);
        this._updateScreenFlashSprite();

        if (this._textShowing && !$gameMessage.isBusy()) {
            this._textShowing = false;
            this.backToCommand();
        }
        this._wait++;
        if (this._wait <= 12) {
            return;
        }
        if (this._effectPlaying) {
            this.updateResultEffect();
        } else if (this._rankEffectPlaying) {
            this.updateRankEffectPlaying();
        }
    };

    Scene_Gacha.prototype.updateResultEffect = function() {
        if (!this._effectSprite.isAnimationPlaying() || this.isTriggeredEffectCancel()) {
            this._effectSprite.allRemove();
            this._screenFadeIn();
            if (this._item.meta.gachaImage) {
                this.setupRankAnimation();
            }
            this.showResult();
            this._effectPlaying = false;
        }
    };

    Scene_Gacha.prototype.showResult = function() {
        this._goldWindow.hide();
        this._commandWindow.hide();
        this._dummyWindow.hide();
        this._getCommandWindow.show();
        this._getWindow.show();
        var message = this.getNewItemText() + getText;
        var reg     = /Item Name/gi;
        message     = message.replace(reg, String(this._item.name));
        this._helpWindow.setText(message);
        this._wait = 0;
        this._getCommandWindow.activate();
    };

    Scene_Gacha.prototype.updateRankEffectPlaying = function() {
        if (!this._rankSprite.isAnimationPlaying()) {
            if (this._newItem) {
                this.setupNewAnimation();
            }
            this._rankEffectPlaying = false;
        }
    };

    Scene_Gacha.prototype.setupRankAnimation = function() {
        var rank = Number(this._item.meta.gachaRank || '-1');
        if (rank > 0 && rank < 6) {
            if (rankEffect[rank - 1] > 0) {
                var animation      = $dataAnimations[rankEffect[rank - 1]];
                this._rankSprite.x = this._getWindow.width / 2 + this._getWindow.x - 20;
                this._rankSprite.y = this._getWindow.contentsHeight() + this._getWindow.y;
                if (itemDescEnable) {
                    this._rankSprite.y -= this._getWindow.lineHeight() * 3;
                }
                this._rankSprite.startAnimation(animation, false, 0);
                this._rankEffectPlaying = true;
            }
        }
    };

    Scene_Gacha.prototype.setupNewAnimation = function() {
        var animation = $dataAnimations[newEffect];
        this._rankSprite.startAnimation(animation, false, 0);
    };

    Scene_Gacha.prototype.isTriggeredEffectCancel = function() {
        return TouchInput.isTriggered() || Input.isTriggered('ok') || Input.isTriggered('cancel');
    };

    Scene_Gacha.prototype._updateScreenFlashSprite = function() {
        var d;
        if (this._screenFadeOutDuration > 0) {
            d = this._screenFadeOutDuration--;
            this._windowFadeSprite.opacity += 255 * (1 - (d - 1) / d);
        }
        if (this._screenFadeInDuration > 0) {
            d                              = this._screenFadeInDuration--;
            this._windowFadeSprite.opacity *= (d - 1) / d;
            this._windowFadeSprite.visible = (this._screenFadeInDuration > 0);
        }
    };

    Scene_Gacha.prototype._screenFadeOut = function() {
        this._windowFadeSprite.visible = true;
        this._screenFadeOutDuration    = 15;
        this._screenFadeInDuration     = 0;
    };

    Scene_Gacha.prototype._screenFadeIn = function() {
        this._windowFadeSprite.visible = true;
        this._screenFadeOutDuration    = 0;
        this._screenFadeInDuration     = 15;
    };

    function Window_Gacha() {
        this.initialize.apply(this, arguments);
    }

    Window_Gacha.prototype             = Object.create(Window_Selectable.prototype);
    Window_Gacha.prototype.constructor = Window_Gacha;

    Window_Gacha.prototype.initialize = function(x, y) {
        var width  = Graphics.boxWidth;
        var height = this.fittingHeight(6);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.activate();
    };

    function Window_GachaCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaCommand.prototype             = Object.create(Window_HorzCommand.prototype);
    Window_GachaCommand.prototype.constructor = Window_GachaCommand;

    Window_GachaCommand.prototype.initialize = function(width, purchaseOnly) {
        this._windowWidth  = width;
        this._purchaseOnly = purchaseOnly;
        Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    };

    Window_GachaCommand.prototype.windowWidth = function() {
        return this._windowWidth;
    };

    Window_GachaCommand.prototype.maxCols = function() {
        return 2 + (buttonText10 ? 1 : 0) + (buttonTextAll ? 1 : 0);
    };

    Window_GachaCommand.prototype.makeCommandList = function() {
        this.addCommand(buttonText, 'gacha', this.canGacha());
        if (buttonText10) {
            this.addCommand(buttonText10, 'gacha10', this.canGacha(10));
        }
        if (buttonTextAll) {
            this.addCommand(buttonTextAll, 'gachaAll', this.canGacha());
        }
        this.addCommand(TextManager.cancel, 'cancel');
    };

    Window_GachaCommand.prototype.isCostTypeVariable = function() {
        return variable > 0;
    };

    Window_GachaCommand.prototype.canGacha = function(count) {
        return this.getGachaResource() >= amount * (count || 1) && !!this._lotIsValid;
    };

    Window_GachaCommand.prototype.getGachaResource = function() {
        return this.isCostTypeVariable() ? $gameVariables.value(variable) : $gameParty.gold();
    };

    Window_GachaCommand.prototype.lotIsValid = function(value) {
        this._lotIsValid = value;
    };

    function Window_GachaGetCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaGetCommand.prototype             = Object.create(Window_HorzCommand.prototype);
    Window_GachaGetCommand.prototype.constructor = Window_GachaGetCommand;

    Window_GachaGetCommand.prototype.initialize = function(width, purchaseOnly) {
        this._windowWidth  = width;
        this._purchaseOnly = purchaseOnly;
        Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    };

    Window_GachaGetCommand.prototype.windowWidth = function() {
        return this._windowWidth;
    };

    Window_GachaGetCommand.prototype.maxCols = function() {
        return 1;
    };

    Window_GachaGetCommand.prototype.makeCommandList = function() {
        this.addCommand('OK', 'ok');
    };

    function Window_GachaResult() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaResult.prototype             = Object.create(Window_Base.prototype);
    Window_GachaResult.prototype.constructor = Window_GachaResult;

    Window_GachaResult.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.apply(this, arguments);
    };

    Window_GachaResult.prototype.drawResult = function(resultList) {
        this.contents.clear();
        resultList.forEach(function(item, index) {
            if (item && item.meta.gachaImage) {
                this.drawResultItem(item, index);
            }
        }.bind(this));
        this.show();
    };

    Window_GachaResult.prototype.drawResultItem = function(item, index) {
        var param = {
            bitmap: null,
            x: 0,
            y: 0,
            original: false
        };
        var resultImage = item.meta.gachaResultImage;
        if (resultImage) {
            param.bitmap = ImageManager.loadBitmap('img/gacha/', resultImage);
            param.original = true;
        } else {
            param.bitmap = ImageManager.loadBitmap('img/gacha/', item.meta.gachaImage);
            param.x = parseInt(item.meta.gachaResultX) || 0;
            param.y = parseInt(item.meta.gachaResultY) || 0;
        }
        param.bitmap.smooth = true;
        this.drawResultImage(param, index);
    };

    Window_GachaResult.prototype.drawResultImage = function(param, index) {
        var size = this.contentsWidth() / 5;
        var padding = 12;
        var x = index % 5 * size + padding;
        var y = Math.floor(index / 5) * size + padding;
        var imageSize = size - padding * 2;
        var origin = imageSize / 2;
        var sx = param.original ? 0 : param.x ? param.x - origin : origin;
        var sy = param.original ? 0 : param.y ? param.y - origin : origin;
        if (sy + imageSize > this.contentsHeight()) {
            return;
        }
        param.bitmap.addLoadListener(function() {
            var width = param.original ? param.bitmap.width : imageSize;
            var height = param.original ? param.bitmap.height : imageSize;
            this.contents.blt(param.bitmap, sx , sy, width, height, x, y);
        }.bind(this));
    };

    function Window_GachaGet() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaGet.prototype             = Object.create(Window_Base.prototype);
    Window_GachaGet.prototype.constructor = Window_GachaGet;

    Window_GachaGet.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._item                 = null;
        this._itemDescEnable       = true;
        this._gachaSprite          = new Sprite();
        this._gachaSprite.anchor.x = 0.5;
        this._gachaSprite.anchor.y = 0;
        this._gachaSprite.x        = width / 2 - 20;
        this._gachaSprite.y        = this.padding;
        this.addChildToBack(this._gachaSprite);
        this.refresh();
    };

    Window_GachaGet.prototype.itemDescEnable = function(value) {
        if (this._itemDescEnable !== value) {
            this._itemDescEnable = value;
            this.refresh();
        }
    };

    Window_GachaGet.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    Window_GachaGet.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._gachaSprite.bitmap) {
            var bitmapHeight   = this._gachaSprite.bitmap.height;
            var contentsHeight = this.contents.height;
            if (this._itemDescEnable) {
                contentsHeight -= this.lineHeight() * 3;
            }
            var scale = 1;
            if (bitmapHeight > contentsHeight) {
                scale = contentsHeight / bitmapHeight;
            }
            this._gachaSprite.scale.x = scale;
            this._gachaSprite.scale.y = scale;
        }
    };

    Window_GachaGet.prototype.refresh = function() {
        var item = this._item;
        this.contents.clear();

        if (this._itemDescEnable) {
            var y = this.contentsHeight() - this.lineHeight() * 3;
            this.drawHorzLine(y);
            this.drawDescription(0, y + this.lineHeight());
        }

        if (!item || !item.meta.gachaImage) {
            this._gachaSprite.bitmap = null;
        } else {
            this._gachaSprite.bitmap = ImageManager.loadBitmap('img/gacha/', this._item.meta.gachaImage);
            this._gachaSprite.smooth = true;
        }
    };

    Window_GachaGet.prototype.drawDescription = function(x, y) {
        if (this._item) this.drawTextEx(this._item.description, x, y);
    };

    Window_GachaGet.prototype.drawHorzLine = function(y) {
        var lineY                  = y + this.lineHeight() / 2 - 1;
        this.contents.paintOpacity = 48;
        this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
        this.contents.paintOpacity = 255;
    };

    Window_GachaGet.prototype.lineColor = function() {
        return this.normalColor();
    };

    function Sprite_GachaEffect() {
        this.initialize.apply(this, arguments);
    }

    Sprite_GachaEffect.prototype             = Object.create(Sprite.prototype);
    Sprite_GachaEffect.prototype.constructor = Sprite_GachaEffect;

    Sprite_GachaEffect.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._animationSprites = [];
        this._endSprites       = [];
        this._effectTarget     = this;
        this._hiding           = false;
        this._keepDisplay      = false;
    };

    Sprite_GachaEffect.prototype.keepDisplay = function(value) {
        this._keepDisplay = value;
    };

    Sprite_GachaEffect.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateVisibility();
        this.updateAnimationSprites();
    };

    Sprite_GachaEffect.prototype.hide = function() {
        this._hiding = true;
        this.updateVisibility();
    };

    Sprite_GachaEffect.prototype.show = function() {
        this._hiding = false;
        this.updateVisibility();
    };

    Sprite_GachaEffect.prototype.updateVisibility = function() {
        this.visible = !this._hiding;
    };

    Sprite_GachaEffect.prototype.updateAnimationSprites = function() {
        if (this._animationSprites.length > 0) {
            var sprites            = this._animationSprites.clone();
            this._animationSprites = [];
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                if (sprite.isPlaying()) {
                    this._animationSprites.push(sprite);
                } else if (!this._keepDisplay) {
                    sprite.remove();
                } else {
                    this._endSprites.push(sprite);
                }
            }
        }
    };

    Sprite_GachaEffect.prototype.startAnimation = function(animation, mirror, delay) {
        var sprite = new Sprite_Animation();
        sprite.setup(this._effectTarget, animation, mirror, delay);
        this.parent.addChild(sprite);
        this._animationSprites.push(sprite);
    };

    Sprite_GachaEffect.prototype.isAnimationPlaying = function() {
        return this._animationSprites.length > 0;
    };

    Sprite_GachaEffect.prototype.allRemove = function() {
        var sprites, sprite, i;
        if (this._animationSprites.length > 0) {
            sprites                = this._animationSprites.clone();
            this._animationSprites = [];
            for (i = 0; i < sprites.length; i++) {
                sprite = sprites[i];
                sprite.remove();
            }
        }
        if (this._endSprites.length > 0) {
            sprites          = this._endSprites.clone();
            this._endSprites = [];
            for (i = 0; i < sprites.length; i++) {
                sprite = sprites[i];
                sprite.remove();
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Window_Cost
    //-----------------------------------------------------------------------------
    function Window_Cost() {
        this.initialize.apply(this, arguments);
    }

    Window_Cost.prototype             = Object.create(Window_Gold.prototype);
    Window_Cost.prototype.constructor = Window_Cost;

    Window_Cost.prototype.value = function() {
        return $gameVariables.value(variable);
    };

    Window_Cost.prototype.currencyUnit = function() {
        return costUnit;
    };
})();
