//=============================================================================
// GachaBook.js
//
// (c)2016 KADOKAWA CORPORATION./YOJI OJIMA
//=============================================================================

/*:
 * @plugindesc Displays detailed statuses of "gacha" items.
 * @author Takeya Kimura
 *
 * @param Unknown Data
 * @desc The index name for an unknown item.
 * @default ??????
 *
 * @param Price Text
 * @desc The text for "Price".
 * @default Price
 *
 * @param Equip Text
 * @desc The text for "Equip".
 * @default Equip
 *
 * @param Type Text
 * @desc The text for "Type".
 * @default Type
 *
 * @param Rank Text
 * @desc The text for "Rank".
 * @default Rank
 *
 * @param Simple Display
 * @desc The switch to display the name and description only.
 * @default 0
 *
 * @help
 *
 * Plugin Command:
 *   GachaBook open            # Open the gacha book screen
 *   GachaBook add weapon 3    # Add weapon #3 to the gacha book
 *   GachaBook add armor 4     # Add armor #4 to the gacha book
 *   GachaBook remove armor 5  # Remove armor #5 from the gacha book
 *   GachaBook remove item 6   # Remove item #6 from the gacha book
 *   GachaBook clear           # Clear the item book
 */

/*:ja
 * @plugindesc ガチャアイテム一覧を表示します。
 * @author Takeya Kimura
 *
 * @param Unknown Data
 * @desc 未確認のガチャアイテムの名前です。
 * @default ??????
 *
 * @param Price Text
 * @desc 「価格」の文字列です。
 * @default Price
 *
 * @param Equip Text
 * @desc 「装備」の文字列です。
 * @default Equip
 *
 * @param Type Text
 * @desc 「タイプ」の文字列です。
 * @default Type
 *
 * @param Rank Text
 * @desc 「ランク」の文字列です。
 * @default Rank
 *
 * @param Simple Display
 * @desc 1と入力すると詳細表示が名前と説明だけになります。[0: 通常表示 1: シンプル表示]
 * @default 0
 *
 * @help
 * 図鑑の解除実績をセーブデータ間で共有する仕様を追加
 * by トリアコンタン
 *
 * Plugin Command:
 *   GachaBook open            # ガチャブックを開きます
 *   GachaBook add weapon 3    # 武器３番をガチャブックに追加
 *   GachaBook add armor 4     # 防具4番をガチャブックに追加
 *   GachaBook remove armor 5  # 防具5番をガチャブックから削除
 *   GachaBook remove item 6   # アイテム6番をガチャブックから削除
 *   GachaBook clear           # ガチャブックをクリアする
 */

(function() {

    var parameters = PluginManager.parameters('GachaBook');
    var unknownData = String(parameters['Unknown Data'] || '??????');
    var priceText = String(parameters['Price Text'] || 'Price');
    var equipText = String(parameters['Equip Text'] || 'Equip');
    var typeText = String(parameters['Type Text'] || 'Type');
    var rankText = String(parameters['Rank Text'] || 'Rank');
    var simpleDisplay = !!Number(parameters['Simple Display'] || 0);

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'GachaBook') {
            switch (args[0]) {
                case 'open':
                    SceneManager.push(Scene_GachaBook);
                    break;
                case 'add':
                    $gameSystem.addToGachaBook(args[1], Number(args[2]));
                    break;
                case 'remove':
                    $gameSystem.removeFromGachaBook(args[1], Number(args[2]));
                    break;
                case 'complete':
                    $gameSystem.completeGachaBook();
                    break;
                case 'clear':
                    $gameSystem.clearGachaBook();
                    break;
            }
        }
    };

    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        $gameSystem.loadGachaBook();
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameSystem.loadGachaBook();
    };

    //=============================================================================
    // StorageManager
    //  ガチャブックを保存します。
    //=============================================================================
    StorageManager.gachaBookId = -74635;
    var _StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function(savefileId) {
        if (savefileId === StorageManager.gachaBookId) {
            return this.localFileDirectoryPath() + 'GachaBook.rpgsave';
        } else {
            return _StorageManager_localFilePath.apply(this, arguments);
        }
    };

    var _StorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey = function(savefileId) {
        if (savefileId === StorageManager.gachaBookId) {
            return 'RPG GachaBook';
        } else {
            return _StorageManager_webStorageKey.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_System
    //  ガチャブックを保存します。
    //=============================================================================
    Game_System.prototype.saveGachaBook = function() {
        if (this._GachaBookFlags) {
            StorageManager.save(StorageManager.gachaBookId, JSON.stringify(this._GachaBookFlags));
        }
    };

    Game_System.prototype.loadGachaBook = function() {
        var json;
        try {
            json = StorageManager.load(StorageManager.gachaBookId);
        } catch (e) {
            console.error(e);
        }
        if (json) {
            this._GachaBookFlags = JSON.parse(json);
        }
    };

    Game_System.prototype.addToGachaBook = function(type, dataId) {
        if (!this._GachaBookFlags) {
            this.clearGachaBook();
        }
        var typeIndex = this.gachaBookTypeToIndex(type);
        if (typeIndex >= 0) {
            this._GachaBookFlags[typeIndex][dataId] = true;
        }
        this.saveGachaBook();
    };

    Game_System.prototype.removeFromGachaBook = function(type, dataId) {
        if (this._GachaBookFlags) {
            var typeIndex = this.gachaBookTypeToIndex(type);
            if (typeIndex >= 0) {
                this._GachaBookFlags[typeIndex][dataId] = false;
            }
        }
        this.saveGachaBook();
    };

    Game_System.prototype.gachaBookTypeToIndex = function(type) {
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

    Game_System.prototype.completeGachaBook = function() {
        var i;
        this.clearGachaBook();
        for (i = 1; i < $dataItems.length; i++) {
            this._GachaBookFlags[0][i] = true;
        }
        for (i = 1; i < $dataWeapons.length; i++) {
            this._GachaBookFlags[1][i] = true;
        }
        for (i = 1; i < $dataArmors.length; i++) {
            this._GachaBookFlags[2][i] = true;
        }
        this.saveGachaBook();
    };

    Game_System.prototype.clearGachaBook = function() {
        this._GachaBookFlags = [[], [], []];
        this.saveGachaBook();
    };

    Game_System.prototype.isInGachaBook = function(item) {
        if (this._GachaBookFlags && item) {
            var typeIndex = -1;
            if (DataManager.isItem(item)) {
                typeIndex = 0;
            } else if (DataManager.isWeapon(item)) {
                typeIndex = 1;
            } else if (DataManager.isArmor(item)) {
                typeIndex = 2;
            }
            if (typeIndex >= 0) {
                return !!this._GachaBookFlags[typeIndex][item.id];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    var _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.call(this, item, amount, includeEquip);
        if (item && amount > 0) {
            var type;
            if (DataManager.isItem(item)) {
                type = 'item';
            } else if (DataManager.isWeapon(item)) {
                type = 'weapon';
            } else if (DataManager.isArmor(item)) {
                type = 'armor';
            }
            $gameSystem.addToGachaBook(type, item.id);
        }
    };


    function Scene_GachaBook() {
        this.initialize.apply(this, arguments);
    }

    Scene_GachaBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_GachaBook.prototype.constructor = Scene_GachaBook;

    Scene_GachaBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_GachaBook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_GachaBookIndex(0, 0);
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        var wy = this._indexWindow.height;
        var ww = Graphics.boxWidth;
        var wh = Graphics.boxHeight - wy;
        this._statusWindow = new Window_GachaBookStatus(0, wy, ww, wh);
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        this._indexWindow.setStatusWindow(this._statusWindow);
    };

    function Window_GachaBookIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_GachaBookIndex.prototype.constructor = Window_GachaBookIndex;

    Window_GachaBookIndex.lastTopRow = 0;
    Window_GachaBookIndex.lastIndex  = 0;

    Window_GachaBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth;
        var height = this.fittingHeight(6);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(Window_GachaBookIndex.lastTopRow);
        this.select(Window_GachaBookIndex.lastIndex);
        this.activate();
    };

    Window_GachaBookIndex.prototype.maxCols = function() {
        return 3;
    };

    Window_GachaBookIndex.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };

    Window_GachaBookIndex.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };

    Window_GachaBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };

    Window_GachaBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var item = this._list[this.index()];
            this._statusWindow.setItem(item);
        }
    };

    Window_GachaBookIndex.prototype.refresh = function() {
        var i, item;
        this._list = [];
        for (i = 1; i < $dataItems.length; i++) {
            item = $dataItems[i];
            //if (item.name && item.itypeId === 1 && $gameSystem.isInGacha(item)) { //itypeIdはみない
            if (item.name && $gameSystem.isInGacha(item)) { //itypeIdはみない
                this._list.push(item);
            }
        }
        for (i = 1; i < $dataWeapons.length; i++) {
            item = $dataWeapons[i];
            if (item.name && $gameSystem.isInGacha(item)) {
                this._list.push(item);
            }
        }
        for (i = 1; i < $dataArmors.length; i++) {
            item = $dataArmors[i];
            if (item.name && $gameSystem.isInGacha(item)) {
                this._list.push(item);
            }
        }
        this.createContents();
        this.drawAllItems();
    };

    Window_GachaBookIndex.prototype.drawItem = function(index) {
        var item = this._list[index];
        var rect = this.itemRect(index);
        var width = rect.width - this.textPadding();
        if ($gameSystem.isInGachaBook(item)) {
            this.drawItemName(item, rect.x, rect.y, width);
        } else {
            var iw = Window_Base._iconWidth + 4;
            this.drawText(unknownData, rect.x + iw, rect.y, width - iw);
        }
    };

    Window_GachaBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_GachaBookIndex.lastTopRow = this.topRow();
        Window_GachaBookIndex.lastIndex = this.index();
    };

    function Window_GachaBookStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_GachaBookStatus.prototype = Object.create(Window_Base.prototype);
    Window_GachaBookStatus.prototype.constructor = Window_GachaBookStatus;

    Window_GachaBookStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._itemSprite = new Sprite();
        this._itemSprite.anchor.x = 0.5;
        this._itemSprite.anchor.y = 0.5;
        this._itemSprite.x = width / 2 - 20;
        this._itemSprite.y = height / 2;
        this.addChildToBack(this._itemSprite);
        this.refresh();
    };

    Window_GachaBookStatus.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    Window_GachaBookStatus.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._itemSprite.bitmap) {
            var bitmapHeight = this._itemSprite.bitmap.height;
            var contentsHeight = this.contents.height;
            var scale = 1;
            if (bitmapHeight > contentsHeight) {
                scale = contentsHeight / bitmapHeight;
            }
            this._itemSprite.scale.x = scale;
            this._itemSprite.scale.y = scale;
        }
    };

    Window_GachaBookStatus.prototype.refresh = function() {
        var item = this._item;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();

        this.contents.clear();

        if (!item || !$gameSystem.isInGachaBook(item)) {
            this._itemSprite.bitmap = null;
            return;
        }

        var bitmap;
        if (!!item.meta.gachaImage) {
            bitmap = ImageManager.loadBitmap("img/gacha/", item.meta.gachaImage);
            bitmap.smooth = true;
        }
        this._itemSprite.bitmap = bitmap;

        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.drawItemName(item, x, y);
        this.drawItemNumber(item, x + this.textWidth(item.name) + iconBoxWidth, y);

        x = this.textPadding();
        y = lineHeight + this.textPadding();

        if (!simpleDisplay) {
            var rank = "-";
            if (item.meta.gachaRank) rank = item.meta.gachaRank;
            this.changeTextColor(this.systemColor());
            this.drawText(rankText, x, y, 120);
            this.resetTextColor();
            this.drawText(rank, x + 120, y, 120, 'right');
            y += lineHeight;

            var price = item.price > 0 ? item.price : '-';
            this.changeTextColor(this.systemColor());
            this.drawText(priceText, x, y, 120);
            this.resetTextColor();
            this.drawText(price, x + 120, y, 120, 'right');
            y += lineHeight;

            if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                var etype = $dataSystem.equipTypes[item.etypeId];
                this.changeTextColor(this.systemColor());
                this.drawText(equipText, x, y, 120);
                this.resetTextColor();
                this.drawText(etype, x + 120, y, 120, 'right');
                y += lineHeight;

                var type;
                if (DataManager.isWeapon(item)) {
                    type = $dataSystem.weaponTypes[item.wtypeId];
                } else {
                    type = $dataSystem.armorTypes[item.atypeId];
                }
                this.changeTextColor(this.systemColor());
                this.drawText(typeText, x, y, 120);
                this.resetTextColor();
                this.drawText(type, x + 120, y, 120, 'right');

                //x = this.textPadding() + 300;
                //y = lineHeight + this.textPadding();
                var rewardsWidth = 220;
                x = this.contents.width - rewardsWidth;
                y = lineHeight + this.textPadding();
                for (var i = 2; i < 8; i++) {
                    this.changeTextColor(this.systemColor());
                    this.drawText(TextManager.param(i), x, y, 160);
                    this.resetTextColor();
                    this.drawText(item.params[i], x + 160, y, 60, 'right');
                    y += lineHeight;
                }
            }
        }

        x = 0;
        y = this.textPadding() * 2 + lineHeight * 7;
        this.drawTextEx(item.description, x, y);
    };

    Window_GachaBookStatus.prototype.numberWidth = function() {
        return this.textWidth('000');
    };

    Window_GachaBookStatus.prototype.drawItemNumber = function(item, x, y) {
        this.drawText(':', x, y);
        this.drawText($gameParty.numItems(item), x + this.textWidth('00'), y);
    };

})();
