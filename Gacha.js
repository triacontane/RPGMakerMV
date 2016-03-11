//=============================================================================
// Gacha.js
//
// (c)2016 KADOKAWA CORPORATION./YOJI OJIMA
//=============================================================================

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
 * @param ME
 * @desc アイテム取得時のMEを指定します。
 * @default Organ
 * @require 1
 * @dir audio/me/
 * @type file
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
 * @param  Cost Unit
 * @desc ガチャのコストに使う変数の単位です。
 * @default 回
 *
 * @noteParam gachaImage
 * @noteRequire 1
 * @noteDir img/gacha/
 * @noteType file
 * @noteData items
 *
 * @help 変数でガチャを引けるように修正
 * 可能な限りガチャを引き続ける機能を追加
 * by トリアコンタン
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
 */

(function () {

    var parameters = PluginManager.parameters('Gacha');
    var message = String(parameters['Help Message Text'] || '1回Required Amount\\Gでガチャを引きます');
    var buttonText = String(parameters['Button Text'] || 'ガチャを引く');
    var buttonTextAll = String(parameters['Button Text All'] || '');
    var getText = String(parameters['Get Message Text'] || 'GET Item Name');
    var itemDescEnable = !!Number(parameters['Show Item Description'] || 0);
    var effect = Number(parameters['Effect'] || '119');
    var rankEffect = [];
    rankEffect.push(Number(parameters['Rank1 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank2 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank3 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank4 Effect'] || '-1'));
    rankEffect.push(Number(parameters['Rank5 Effect'] || '-1'));
    var me = String(parameters['ME'] || 'Organ');
    var amount = Number(parameters['Required Amount'] || '100');
    var variable = Number(parameters['Required Variable'] || '0');
    var costUnit = String(parameters['Cost Unit'] || '回');
    var reg = /Required Amount/gi;
    message = message.replace(reg, String(amount));


    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === "Gacha") {
            switch (args[0]) {
                case "open":
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


    function Scene_Gacha() {
        this.initialize.apply(this, arguments);
    }

    Scene_Gacha.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Gacha.prototype.constructor = Scene_Gacha;

    Scene_Gacha.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
        this._item = null;
        this._effectPlaying = false;
        this._resultShowing = false;
        this._wait = 0;
        this._effectSprite = null;
        this._windowFadeSprite = null;
        this._screenFadeOutDuration = 0;
        this._screenFadeInDuration = 0;

        this._lot = [];
        this._itemList = {};
        this._execCount = 0;

        var numLot;
        var item, i, j;
        for (i = 1; i < $dataItems.length; i++) {
            item = $dataItems[i];
            if ($gameSystem.isInGacha(item)) {
                numLot = Number(item.meta.gachaNumLot || '0');
                for (j = 0; j < numLot; j++) {
                    this._lot.push(item);
                }
            }
        }
        for (i = 1; i < $dataWeapons.length; i++) {
            item = $dataWeapons[i];
            if ($gameSystem.isInGacha(item)) {
                numLot = Number(item.meta.gachaNumLot || '0');
                for (j = 0; j < numLot; j++) {
                    this._lot.push(item);
                }
            }
        }
        for (i = 1; i < $dataArmors.length; i++) {
            item = $dataArmors[i];
            if ($gameSystem.isInGacha(item)) {
                numLot = Number(item.meta.gachaNumLot || '0');
                for (j = 0; j < numLot; j++) {
                    this._lot.push(item);
                }
            }
        }
    };

    Scene_Gacha.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);

        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createGetCommandWindow();
        this.createGetWindow();
        this.createMessageWindow();

        this._rankSprite = new Sprite_GachaEffect();
        this._rankSprite.keepDisplay(true);
        this.addChild(this._rankSprite);

        this._windowFadeSprite = new ScreenSprite();
        this._windowFadeSprite.setColor(0, 0, 0);
        this._windowFadeSprite.opacity = 0;
        this._windowFadeSprite.visible = false;
        this.addChild(this._windowFadeSprite);

        this._effectSprite = new Sprite_GachaEffect();
        this._effectSprite.x = Graphics.boxWidth / 2;
        this._effectSprite.y = Graphics.boxHeight / 2;
        this.addChild(this._effectSprite);

        this._helpWindow.setText(message);
    };

    Scene_Gacha.prototype.createGoldWindow = function () {
        var y = this._helpWindow.height;
        this._goldWindow = this.isCostTypeVariable() ? new Window_Cost(0, y) : new Window_Gold(0, y);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };

    Scene_Gacha.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_GachaCommand(this._goldWindow.x, this._purchaseOnly);
        this._commandWindow.y = this._helpWindow.height;
        this._commandWindow.setHandler('gachaAll', this.commandGachaAll.bind(this));
        this._commandWindow.setHandler('gacha', this.commandGacha.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.lotIsValid(this._lot.length > 0);
        this._commandWindow.clearCommandList();
        this._commandWindow.makeCommandList();
        this._commandWindow.refresh();
        this.addWindow(this._commandWindow);
    };

    Scene_Gacha.prototype.createDummyWindow = function () {
        var wy = this._commandWindow.y + this._commandWindow.height;
        var wh = Graphics.boxHeight - wy;
        this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
        this.addWindow(this._dummyWindow);
    };

    Scene_Gacha.prototype.createGetCommandWindow = function () {
        this._getCommandWindow = new Window_GachaGetCommand(Graphics.boxWidth, false);
        this._getCommandWindow.y = Graphics.boxHeight - this._getCommandWindow.height;
        this._getCommandWindow.setHandler('ok', this.commandOk.bind(this));
        this._getCommandWindow.setHandler('cancel', this.commandCancel.bind(this));
        this._getCommandWindow.hide();
        this.addWindow(this._getCommandWindow);
    };

    Scene_Gacha.prototype.createGetWindow = function () {
        var wy = this._helpWindow.height;
        var wh = Graphics.boxHeight - wy - this._getCommandWindow.height;
        this._getWindow = new Window_GachaGet(0, wy, Graphics.boxWidth, wh);
        this._getWindow.itemDescEnable(itemDescEnable);
        this._getWindow.hide();
        this.addWindow(this._getWindow);
    };

    Scene_Gacha.prototype.createMessageWindow = function() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    };

    Scene_Gacha.prototype.isCostTypeVariable = function () {
        return variable > 0;
    };

    Scene_Gacha.prototype.commandGacha = function (allBet) {
        this._allBet = !!allBet;
        // Draw lots
        if (this._lot.length <= 0) {
            this._item = null;
        }
        else {
            this._item = this._lot[(Math.random() * this._lot.length) >> 0];
            this.consumeCost();
            this.getGacha();


            this._goldWindow.refresh();

        }

        this._commandWindow.deactivate();
        this._getCommandWindow.deactivate();

        if (this._item) {
            this._getWindow.setItem(this._item);

            this._screenFadeOut();
            this._effectPlaying = true;
            this._wait = 0;

            var animation = $dataAnimations[effect];
            this._effectSprite.startAnimation(animation, false, 0);

            AudioManager.playMe({"name": me, "volume": 90, "pitch": 100, "pan": 0});
        }
        else {
            this._commandWindow.activate();
        }

    };

    Scene_Gacha.prototype.commandGachaAll = function () {
        this.commandGacha(true);
    };

    Scene_Gacha.prototype.consumeCost = function () {
        if (this.isCostTypeVariable()) {
            var value = $gameVariables.value(variable);
            $gameVariables.setValue(variable, value - amount);
        } else {
            $gameParty.loseGold(amount);
        }
    };

    Scene_Gacha.prototype.getGacha = function () {
        $gameParty.gainItem(this._item, 1);
        var name = this._item.name;
        if (!this._itemList[name]) this._itemList[name] = 0;
        this._itemList[name]++;
        this._execCount++;
    };

    Scene_Gacha.prototype.commandOk = function () {
        this._effectSprite.allRemove();
        this._rankSprite.allRemove();
        if (this._allBet && this._commandWindow.canGacha()) {
            this._getWindow.hide();
            this.commandGacha(true);
            return;
        } else {
            if (this._execCount >= 2) {
                Object.keys(this._itemList).forEach(function(key) {
                    $gameMessage.add(key + ' × ' + this._itemList[key]);
                }.bind(this));
                $gameMessage.add('を手に入れた！');
                this._textShowing = true;
                return;
            }
        }
        this.backToCommand();
    };

    Scene_Gacha.prototype.backToCommand = function () {
        this._itemList = {};
        this._execCount = 0;
        this._goldWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._getCommandWindow.hide();
        this._getWindow.hide();
        this._helpWindow.setText(message);
        this._item = null;

        this._commandWindow.clearCommandList();
        this._commandWindow.makeCommandList();
        this._commandWindow.refresh();
    };

    Scene_Gacha.prototype.commandCancel = function () {
        this._allBet = false;
        this.commandOk();
    };

    Scene_Gacha.prototype.update = function () {
        Scene_Menu.prototype.update.call(this);
        this._updateScreenFlashSprite();

        if (this._textShowing && !$gameMessage.isBusy()) {
            this._textShowing = false;
            this.backToCommand();
        }

        this._wait++;
        if (this._wait > 12) {
            if (this._effectPlaying) {
                if (!this._effectSprite.isAnimationPlaying()) {
                    this._screenFadeIn();
                    if (!!this._item.meta.gachaImage) {
                        var rank = Number(this._item.meta.gachaRank || '-1');
                        if (rank > 0 && rank < 6) {
                            if (rankEffect[rank - 1] > 0) {
                                var animation = $dataAnimations[rankEffect[rank - 1]];
                                this._rankSprite.x = this._getWindow.width / 2 + this._getWindow.x - 20;
                                this._rankSprite.y = this._getWindow.contentsHeight() + this._getWindow.y;
                                if (itemDescEnable) {
                                    this._rankSprite.y -= this._getWindow.lineHeight() * 3;
                                }
                                this._rankSprite.startAnimation(animation, false, 0);
                            }
                        }
                    }

                    this._effectPlaying = false;
                    this._goldWindow.hide();
                    this._commandWindow.hide();
                    this._dummyWindow.hide();
                    this._getCommandWindow.show();
                    this._getWindow.show();
                    var message = getText;
                    var reg = /Item Name/gi;
                    message = message.replace(reg, String(this._item.name));
                    this._helpWindow.setText(message);
                    this._wait = 0;
                    this._resultShowing = true;
                }
                else {
                    if (TouchInput.isTriggered() || Input.isTriggered("ok")) {
                        this._effectSprite.allRemove();
                    }
                }
            }
            else if (this._resultShowing) {
                this._resultShowing = false;
                this._getCommandWindow.activate();
            }
        }
    };

    Scene_Gacha.prototype._updateScreenFlashSprite = function () {
        var d;
        if (this._screenFadeOutDuration > 0) {
            d = this._screenFadeOutDuration--;
            this._windowFadeSprite.opacity += 255 * (1 - (d - 1) / d);
        }
        if (this._screenFadeInDuration > 0) {
            d = this._screenFadeInDuration--;
            this._windowFadeSprite.opacity *= (d - 1) / d;
            this._windowFadeSprite.visible = (this._screenFadeInDuration > 0);
        }
    };

    Scene_Gacha.prototype._screenFadeOut = function() {
        this._windowFadeSprite.visible = true;
        this._screenFadeOutDuration = 15;
        this._screenFadeInDuration = 0;
    };

    Scene_Gacha.prototype._screenFadeIn = function() {
        this._windowFadeSprite.visible = true;
        this._screenFadeOutDuration = 0;
        this._screenFadeInDuration = 15;
    };


    function Window_Gacha() {
        this.initialize.apply(this, arguments);
    }

    Window_Gacha.prototype = Object.create(Window_Selectable.prototype);
    Window_Gacha.prototype.constructor = Window_Gacha;

    Window_Gacha.prototype.initialize = function (x, y) {
        var width = Graphics.boxWidth;
        var height = this.fittingHeight(6);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.activate();
    };


    function Window_GachaCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaCommand.prototype = Object.create(Window_HorzCommand.prototype);
    Window_GachaCommand.prototype.constructor = Window_GachaCommand;

    Window_GachaCommand.prototype.initialize = function (width, purchaseOnly) {
        this._windowWidth = width;
        this._purchaseOnly = purchaseOnly;
        Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    };

    Window_GachaCommand.prototype.windowWidth = function () {
        return this._windowWidth;
    };

    Window_GachaCommand.prototype.maxCols = function () {
        return buttonTextAll ? 3 : 2;
    };

    Window_GachaCommand.prototype.makeCommandList = function () {
        this.addCommand(buttonText, 'gacha', this.canGacha());
        if (buttonTextAll) {
            this.addCommand(buttonTextAll, 'gachaAll', this.canGacha());
        }
        this.addCommand(TextManager.cancel, 'cancel');
    };

    Window_GachaCommand.prototype.isCostTypeVariable = function () {
        return variable > 0;
    };

    Window_GachaCommand.prototype.canGacha = function () {
        return (this.isCostTypeVariable() ? $gameVariables.value(variable) : $gameParty.gold()) >= amount &&
            !!this._lotIsValid;
    };

    Window_GachaCommand.prototype.lotIsValid = function(value) {
        this._lotIsValid = value;
    };


    function Window_GachaGetCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaGetCommand.prototype = Object.create(Window_HorzCommand.prototype);
    Window_GachaGetCommand.prototype.constructor = Window_GachaGetCommand;

    Window_GachaGetCommand.prototype.initialize = function (width, purchaseOnly) {
        this._windowWidth = width;
        this._purchaseOnly = purchaseOnly;
        Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    };

    Window_GachaGetCommand.prototype.windowWidth = function () {
        return this._windowWidth;
    };

    Window_GachaGetCommand.prototype.maxCols = function () {
        return 1;
    };

    Window_GachaGetCommand.prototype.makeCommandList = function () {
        this.addCommand('OK', 'ok');
    };


    function Window_GachaGet() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaGet.prototype = Object.create(Window_Base.prototype);
    Window_GachaGet.prototype.constructor = Window_GachaGet;

    Window_GachaGet.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._item = null;
        this._itemDescEnable = true;
        this._gachaSprite = new Sprite();
        this._gachaSprite.anchor.x = 0.5;
        this._gachaSprite.anchor.y = 0;
        this._gachaSprite.x = width / 2 - 20;
        this._gachaSprite.y = this.padding;
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
            var bitmapHeight = this._gachaSprite.bitmap.height;
            var contentsHeight = this.contents.height;
            if (this._itemDescEnable) {
                contentsHeight -= this.lineHeight() * 3
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
            return;
        }
        else {
            var bitmap;
            bitmap = ImageManager.loadBitmap("img/gacha/", this._item.meta.gachaImage);
            this._gachaSprite.bitmap = bitmap;
            bitmap.smooth = true;
        }
    };

    Window_GachaGet.prototype.drawDescription = function(x, y) {
        if (this._item) this.drawTextEx(this._item.description, x, y);
    };

    Window_GachaGet.prototype.drawHorzLine = function(y) {
        var lineY = y + this.lineHeight() / 2 - 1;
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

    Sprite_GachaEffect.prototype = Object.create(Sprite.prototype);
    Sprite_GachaEffect.prototype.constructor = Sprite_GachaEffect;

    Sprite_GachaEffect.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._animationSprites = [];
        this._endSprites = [];
        this._effectTarget = this;
        this._hiding = false;
        this._keepDisplay = false;
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
            var sprites = this._animationSprites.clone();
            this._animationSprites = [];
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                if (sprite.isPlaying()) {
                    this._animationSprites.push(sprite);
                } else {
                    if (!this._keepDisplay) {
                        sprite.remove();
                    }
                    else {
                        this._endSprites.push(sprite);
                    }
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
            sprites = this._animationSprites.clone();
            this._animationSprites = [];
            for (i = 0; i < sprites.length; i++) {
                sprite = sprites[i];
                sprite.remove();
            }
        }
        if (this._endSprites.length > 0) {
            sprites = this._endSprites.clone();
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

    Window_Cost.prototype = Object.create(Window_Gold.prototype);
    Window_Cost.prototype.constructor = Window_Cost;

    Window_Cost.prototype.value = function() {
        return $gameVariables.value(variable);
    };

    Window_Cost.prototype.currencyUnit = function() {
        return costUnit;
    };
})();