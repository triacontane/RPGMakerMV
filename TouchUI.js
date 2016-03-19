//=============================================================================
// TouchUI.js
//
// (c)2016 KADOKAWA CORPORATION./YOJI OJIMA
//=============================================================================

/*:
 * @plugindesc Change the UI for the touch operation.
 * @author Takeya Kimura
 * @mobileOnly 1
 *
 * @param Menu Command Text
 * @desc The Menu Command Text for map scene.
 * @default メニュー
 *
 * @param Previous Command Text
 * @desc The Previous Command Text for menu scene.
 * @default 前
 *
 * @param Next Command Text
 * @desc The Next Command Text for menu scene.
 * @default 次
 *
 * @help This plugin does not provide plugin commands.
 * This plugin is the only for standard UI.
 */

/*:ja
 * @plugindesc UIをタッチ操作に適したものへ変更します。
 * @author Takeya Kimura
 * @mobileOnly 1
 *
 * @param Menu Command Text
 * @desc マップシーンに表示されるメニューボタンのテキストです。
 * @default メニュー
 *
 * @param Previous Command Text
 * @desc メニューに表示される前へボタンのテキストです。
 * @default 前
 *
 * @param Next Command Text
 * @desc メニューに表示される次へボタンのテキストです。
 * @default 次
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * このプラグインはUIを変更する他のプラグインと共存はできません。
 */

if (Utils.isMobileDevice()) {
(function () {

var parameters = PluginManager.parameters('TouchUI');
var menuCommandText = String(parameters['Menu Command Text'] || 'メニュー');
var prevCommandText = String(parameters['Previous Command Text'] || '前');
var nextCommandText = String(parameters['Next Command Text'] || '次');

//-----------------------------------------------------------------------------
// Window_SwipeContainer
//
// Swipe container for vertical scroll

function Window_SwipeContainer() {
    this.initialize.apply(this, arguments);
}

Window_SwipeContainer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Window_SwipeContainer.prototype.constructor = Window_SwipeContainer;

Window_SwipeContainer.CONFIRM_GAP = 10;

Window_SwipeContainer.prototype.initialize = function () {

    PIXI.DisplayObjectContainer.call(this);

    this._scrollY = 0;
    this._lastY = 0;
    this._lastScrollY = 0;
    this._touching = false;
    this._overGap = false;
    this._swiped = false;
    this._contentsWidth = 0;
    this._contentsHeight = 0;
    this._maxWidth = 0;
    this._maxHeight = 0;
    this._overDist = 0;
    this._activate = false;
};

Object.defineProperty(Window_SwipeContainer.prototype, 'scrollY', {
    get: function () {
        return this._scrollY;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'overGap', {
    get: function () {
        return this._overGap;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'swiped', {
    get: function () {
        return this._swiped;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'contentsWidth', {
    get: function () {
        return this._contentsWidth;
    },
    set: function (value) {
        if (this._contentsWidth !== value) this._contentsWidth = value;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'contentsHeight', {
    get: function () {
        return this._contentsHeight;
    },
    set: function (value) {
        if (this._contentsHeight !== value) this._contentsHeight = value;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'maxWidth', {
    get: function () {
        return this._maxWidth;
    },
    set: function (value) {
        if (this._maxWidth !== value) this._maxWidth = value;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'maxHeight', {
    get: function () {
        return this._maxHeight;
    },
    set: function (value) {
        if (this._maxHeight !== value) this._maxHeight = value;
    },
    configurable: true
});

Object.defineProperty(Window_SwipeContainer.prototype, 'overDist', {
    get: function () {
        return this._overDist;
    },
    set: function (value) {
        if (this._overDist !== value) this._overDist = value;
    },
    configurable: true
});

Window_SwipeContainer.prototype.activate = function() {
    this._activate = true;
};

Window_SwipeContainer.prototype.deactivate = function() {
    this._activate = false;
};

Window_SwipeContainer.prototype.update = function () {

    var dy;
    var overDistY;
    var ratio = 1;

    if (TouchInput.isTriggered() && this.isTouchedInsideFrame() && this._activate) {
        this._touching = true;
        this._lastY = TouchInput.y;
        this._overGap = false;
        this._swiped = false;
        this._lastScrollY = this._scrollY;
    }
    else if (TouchInput.isReleased()) {
        this._touching = false;
        this._swiped = false;
    }

    if (TouchInput.isMoved() && this._touching && this._activate) {
        dy = TouchInput.y - this._lastY;

        var ny = this._scrollY + dy;

        if (ny <= 0 && ny + this.maxHeight >= this.contentsHeight) {}
        else {
            if (ny > 0) {
                overDistY = ny.clamp(0, this._overDist);
            }
            else if (ny + this.maxHeight < this.contentsHeight) {
                if (this.maxHeight < this.contentsHeight) {
                    overDistY = Math.abs(ny).clamp(0, this._overDist);
                }
                else {
                    overDistY = (this.contentsHeight - (ny + this.maxHeight)).clamp(0, this._overDist);
                }
            }
            ratio = Math.abs((this._overDist - overDistY) / this._overDist);
            dy *= ratio;
        }

        this._scrollY += dy;

        this._swiped = true;
        if (Math.abs(this._scrollY - this._lastScrollY) > Window_SwipeContainer.CONFIRM_GAP) {
            this._overGap = true;
        }

        this._lastY = TouchInput.y;
    }
    else if (!this._touching) {
        dy = 0;

        if (this._scrollY > 0) {
            overDistY = this._scrollY;
            dy = -overDistY * 0.3;
        }
        else if (this._scrollY + this.maxHeight < this.contentsHeight) {
            if (this.maxHeight < this.contentsHeight) {
                overDistY = -this._scrollY;
            }
            else {
                overDistY = this.contentsHeight - (this._scrollY + this.maxHeight);
            }
            dy = overDistY * 0.3;
        }

        this._scrollY += dy;
    }
};

Window_SwipeContainer.prototype.isTouchedInsideFrame = function () {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.contentsWidth && y < this.contentsHeight;
};

Window_SwipeContainer.prototype.setScroll = function (y) {
    this._scrollY = y;
};

Window_SwipeContainer.prototype.canvasToLocalX = function (x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

Window_SwipeContainer.prototype.canvasToLocalY = function (y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

//-----------------------------------------------------------------------------
// Window_MapCommand
//
// This button to open the menu from the map scene.

function Window_MapCommand() {
    this.initialize.apply(this, arguments);
}

Window_MapCommand.prototype = Object.create(Window_Command.prototype);
Window_MapCommand.prototype.constructor = Window_MapCommand;

Window_MapCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.updatePlacement();
    this.openness = 0;
};

Object.defineProperty(Window_MapCommand.prototype, 'isTouching', {
    get: function () {
        return this._touching;
    },
    configurable: true
});

Window_MapCommand.prototype.updatePlacement = function() {
    this.x = Graphics.boxWidth - this.windowWidth();
    this.y = Graphics.boxHeight - this.windowHeight();
};

Window_MapCommand.prototype.makeCommandList = function() {
    this.addCommand(menuCommandText,  'menu');
};

//The top priority to open the menu
Window_MapCommand.prototype.preUpdate = function() {
    Window_Selectable.prototype.update.call(this);
};
Window_MapCommand.prototype.update = function() {
};

Window_MapCommand.prototype.itemTextAlign = function() {
    return 'center';
};


function Window_CancelCommand() {
    this.initialize.apply(this, arguments);
}

Window_CancelCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_CancelCommand.prototype.constructor = Window_CancelCommand;

Window_CancelCommand.prototype.initialize = function(x, y) {
    this._pagingEnable = false;
    Window_Command.prototype.initialize.call(this, x, y);
    this.setColumnRatio([0.25, 0.25, 0.5]);
    this.refresh();
};

Window_CancelCommand.prototype.makeCommandList = function() {
    this.addCommand(prevCommandText,  'previous', this._pagingEnable);
    this.addCommand(nextCommandText,  'next', this._pagingEnable);
    this.addCommand(TextManager.cancel,  'cancel');
};

Window_CancelCommand.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_CancelCommand.prototype.maxCols = function() {
    return 3;
};

Window_CancelCommand.prototype.pagingEnable = function(value) {
    if (this._pagingEnable !== value) {
        this._pagingEnable = value;
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
    }
};

Window_CancelCommand.prototype.itemTextAlign = function() {
    return 'center';
};

function Window_BattleCancelCommand() {
    this.initialize.apply(this, arguments);
}

Window_BattleCancelCommand.prototype = Object.create(Window_CancelCommand.prototype);
Window_BattleCancelCommand.prototype.constructor = Window_BattleCancelCommand;

Window_BattleCancelCommand.prototype.initialize = function(x, y) {
    Window_CancelCommand.prototype.initialize.call(this, x, y);
    this._pagingEnable = false;
    this.openness = 0;
    this.deactivate();
};

Window_BattleCancelCommand.prototype.windowWidth = function() {
    return 192;
};

Window_BattleCancelCommand.prototype.numVisibleRows = function() {
    return 1;
};

Window_BattleCancelCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.cancel,  'cancel');
};

Window_BattleCancelCommand.prototype.maxCols = function() {
    return 1;
};

Window_BattleCancelCommand.prototype.setup = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.setColumnRatio([1]);
    this.refresh();
    this.activate();
    this.open();
};

function Window_ShopCancelCommand() {
    this.initialize.apply(this, arguments);
}

Window_ShopCancelCommand.prototype = Object.create(Window_CancelCommand.prototype);
Window_ShopCancelCommand.prototype.constructor = Window_ShopCancelCommand;

Window_ShopCancelCommand.prototype.initialize = function(x, y) {
    Window_CancelCommand.prototype.initialize.call(this, x, y);
    this._pagingEnable = false;
    this.clearCommandList();
    this.makeCommandList();
    this.setColumnRatio([1]);
    this.refresh();
    this.activate();
};

Window_ShopCancelCommand.prototype.windowWidth = function() {
    return 192;
};

Window_ShopCancelCommand.prototype.numVisibleRows = function() {
    return 1;
};

Window_ShopCancelCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.cancel,  'cancel');
};

Window_ShopCancelCommand.prototype.maxCols = function() {
    return 1;
};

function Window_MessageCancel() {
    this.initialize.apply(this, arguments);
}

Window_MessageCancel.prototype = Object.create(Window_Command.prototype);
Window_MessageCancel.prototype.constructor = Window_MessageCancel;

Window_MessageCancel.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._background = 0;
};

Window_MessageCancel.prototype.makeCommandList = function() {
    this.addCommand(TextManager.cancel,  'cancel');
};

Window_MessageCancel.prototype.maxCols = function() {
    return 1;
};

Window_MessageCancel.prototype.itemTextAlign = function() {
    return 'center';
};

Window_MessageCancel.prototype.start = function() {
    this.updatePlacement();
    this.refresh();
    this.deselect();
    this.open();
    this.activate();
};

Window_MessageCancel.prototype.updatePlacement = function() {
    this.x = Graphics.boxWidth - this.width;
    this.y = Graphics.boxHeight - this.height;
};

Window_MessageCancel.prototype.callOkHandler = function() {
    TouchInput._events.cancelled = true;
};

Window_MessageCancel.prototype.callSelectHandler = function() {
    this._messageWindow.choiceDeselect();
};

var Scene_Map_initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
    Scene_Map_initialize.call(this);
    this._menuWindow = null;
};

var Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    Scene_Map_createDisplayObjects.call(this);
    this._menuWindow = new Window_MapCommand();
    this._menuWindow.setHandler('menu', this.menu.bind(this));
    this.addWindow(this._menuWindow);
    this._stillCount = 0;
};

Scene_Map.prototype.menu = function() {
    this.menuCalling = true;
};

var Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    this._menuWindow.hide();
    Scene_Map_terminate.call(this)
};

var Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    if ($gameMap.isEventRunning() || $gamePlayer.isMoving()) {
        this._stillCount = 0;
        this._menuWindow.close()
    }
    else {
        if (this._stillCount > 60) {
            this._menuWindow.open();
        }
        else {
            this._stillCount++;
        }
    }

    this._menuWindow.preUpdate();

    Scene_Map_update.call(this);
};

/*
 * Enable this method by the 1 touch operation (case of release handler)
 */
//var Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
//Scene_Map.prototype.isMapTouchOk = function() {
//    var result = Scene_Map_isMapTouchOk.call(this);
//    return result && !this._menuWindow.isTouching;
//};

var _Scene_Menu_create = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
    _Scene_Menu_create.call(this);

    this._cancelWindow = new Window_CancelCommand();
    this._cancelWindow.setHandler('cancel', this.cancel.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;
    this._cancelWindow.deselect();

    this._commandWindow.setHandler('select', this.selectCommand.bind(this));

    var h = Graphics.boxHeight - this._cancelWindow.height;
    this._statusWindow.move(this._statusWindow.x, this._statusWindow.y, this._statusWindow.width, h);
    this._goldWindow.y = Graphics.boxHeight - this._cancelWindow.height - this._goldWindow.height;
    h = this._goldWindow.y;
    this._commandWindow.move(this._commandWindow.x, this._commandWindow.y, this._commandWindow.width, h);
    this._commandWindow.refresh();
};

Scene_Menu.prototype.selectCommand = function() {
    this._cancelWindow.deselect();
};

Scene_Menu.prototype.selectCancel = function() {
    if (this._commandWindow.active) this._commandWindow.deselect();
};

Scene_Menu.prototype.cancel = function() {
    if (this._commandWindow.active) {
        this.popScene();
    }
    else {
        if (this._statusWindow.formationMode()) {
            this.onFormationCancel();
        }
        else {
            this.onPersonalCancel();
            //Explicit deactivate
            this._statusWindow.deactivate();
        }
        this._cancelWindow.activate();
    }
};

Scene_Menu.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        //Explicit deactivate
        this._statusWindow.deactivate();
        this._commandWindow.activate();
    }
};

var Scene_File_create = Scene_File.prototype.create;
Scene_File.prototype.create = function() {
    Scene_File_create.call(this);

    this._cancelWindow = new Window_CancelCommand();
    this._cancelWindow.setHandler('cancel', this.popScene.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;
    this._cancelWindow.deselect();

    this._listWindow.setHandler('select', this.selectList.bind(this));

    var h = this._listWindow.height - this._cancelWindow.height;
    this._listWindow.move(this._listWindow.x, this._listWindow.y, this._listWindow.width, h);
};

Scene_File.prototype.selectCancel = function() {
    this._listWindow._windowCursorSprite.alpha = 1;
    this._listWindow._allowCursorBlink = false;
};

Scene_File.prototype.selectList = function() {
    this._listWindow._allowCursorBlink = true;
    this._cancelWindow.deselect();
};

Scene_ItemBase.prototype.createActorWindow = function() {
    this._actorWindow = new Window_MenuActor(this);
    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

var _Scene_Item_create = Scene_Item.prototype.create;
Scene_Item.prototype.create = function() {
    _Scene_Item_create.call(this);

    this._cancelWindow = new Window_CancelCommand();
    this._cancelWindow.setHandler('cancel', this.cancel.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;
    this._cancelWindow.deselect();

    this._categoryWindow.setHandler('select', this.selectCommand.bind(this));
    this._itemWindow.setHandler('select', this.selectCommand.bind(this));
    this._actorWindow.setHandler('select', this.selectCommand.bind(this));

    var h = this._itemWindow.height - this._cancelWindow.height;
    this._itemWindow.move(this._itemWindow.x, this._itemWindow.y, this._itemWindow.width, h);
    this._itemWindow.refresh();
    h = Graphics.boxHeight - this._cancelWindow.height;
    this._actorWindow.move(this._actorWindow.x, this._actorWindow.y, this._actorWindow.width, h);
    this._actorWindow.refresh();
};

Scene_Item.prototype.selectCommand = function() {
    this._cancelWindow.deselect();
};

Scene_Item.prototype.selectCancel = function() {
    if (this._categoryWindow.active) {
        this._categoryWindow.deselect();
    }
    else if (this._itemWindow.active) {
        this._itemWindow.deselect();
    }
    else if (this._actorWindow.active) {
        this._actorWindow.deselect();
        this._actorWindow.setCursorRect(0, 0, 0, 0);
    }
};

Scene_Item.prototype.cancel = function() {
    if (this._categoryWindow.active) {
        this.popScene();
    }
    else if (this._itemWindow.active) {
        this.onItemCancel();
        //Explicit deactivate
        this._itemWindow.deactivate();
        this._cancelWindow.activate();
    }
    else if (this._actorWindow.active) {
        this.onActorCancel();
        this._actorWindow.deactivate();
        this._cancelWindow.activate();
    }
};

var _Scene_Skill_create = Scene_Skill.prototype.create;
Scene_Skill.prototype.create = function() {
    _Scene_Skill_create.call(this);

    this._cancelWindow = new Window_CancelCommand();
    this._cancelWindow.setHandler('cancel', this.cancel.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this._cancelWindow.setHandler('next', this.nextActor.bind(this));
    this._cancelWindow.setHandler('previous', this.previousActor.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;
    this._cancelWindow.deselect();
    this._cancelWindow.pagingEnable(true);

    this._skillTypeWindow.setHandler('select', this.selectCommand.bind(this));
    this._itemWindow.setHandler('select', this.selectCommand.bind(this));
    this._actorWindow.setHandler('select', this.selectCommand.bind(this));

    var h = this._itemWindow.height - this._cancelWindow.height;
    this._itemWindow.move(this._itemWindow.x, this._itemWindow.y, this._itemWindow.width, h);
    this._itemWindow.refresh();
    h = Graphics.boxHeight - this._cancelWindow.height;
    this._actorWindow.move(this._actorWindow.x, this._actorWindow.y, this._actorWindow.width, h);
    this._actorWindow.refresh();
};

Scene_Skill.prototype.selectCommand = function() {
    this._cancelWindow.deselect();
};

Scene_Skill.prototype.selectCancel = function() {
    if (this._skillTypeWindow.active) {
        this._skillTypeWindow.deselect();
    }
    else if (this._itemWindow.active) {
        this._itemWindow.deselect();
    }
    else if (this._actorWindow.active) {
        this._actorWindow.deselect();
        this._actorWindow.setCursorRect(0, 0, 0, 0);
    }
};

Scene_Skill.prototype.cancel = function() {
    if (this._skillTypeWindow.active) {
        this.popScene();
    }
    else if (this._itemWindow.active) {
        this.onItemCancel();
        //Explicit deactivate
        this._itemWindow.deactivate();
        this._cancelWindow.activate();
        this._cancelWindow.pagingEnable(true);
    }
    else if (this._actorWindow.active) {
        this.onActorCancel();
        this._actorWindow.deactivate();
        this._cancelWindow.activate();
    }
};

var _Scene_Skill_commandSkill = Scene_Skill.prototype.commandSkill;
Scene_Skill.prototype.commandSkill = function() {
    _Scene_Skill_commandSkill.call(this);
    this._cancelWindow.pagingEnable(false);
};

Scene_Skill.prototype.nextActor = function() {
    if (!this._skillTypeWindow.active) return;
    Scene_MenuBase.prototype.nextActor.call(this);
    this._cancelWindow.activate();
};

Scene_Skill.prototype.previousActor = function() {
    if (!this._skillTypeWindow.active) return;
    Scene_MenuBase.prototype.previousActor.call(this);
    this._cancelWindow.activate();
};

var _Scene_Equip_create = Scene_Equip.prototype.create;
Scene_Equip.prototype.create = function() {
    _Scene_Equip_create.call(this);
    this._itemWindow.hide();

    this._cancelWindow = new Window_CancelCommand();
    this._cancelWindow.setHandler('cancel', this.cancel.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this._cancelWindow.setHandler('next', this.nextActor.bind(this));
    this._cancelWindow.setHandler('previous', this.previousActor.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;
    this._cancelWindow.deselect();
    this._cancelWindow.pagingEnable(true);

    this._commandWindow.setHandler('select', this.selectCommand.bind(this));
    this._slotWindow.setHandler('select', this.selectCommand.bind(this));
    this._itemWindow.setHandler('select', this.selectCommand.bind(this));

    var h = Graphics.boxHeight - this._helpWindow.height - this._cancelWindow.height;
    this._statusWindow.move(this._statusWindow.x, this._statusWindow.y, this._statusWindow._width, h);
    h = this._statusWindow.height;
    this._itemWindow.move(this._commandWindow.x, this._commandWindow.y, this._commandWindow.width, h);
    h -= this._commandWindow.height;
    this._slotWindow.move(this._slotWindow.x, this._slotWindow.y, this._slotWindow.width, h);
    this._slotWindow.refresh();
};

Scene_Equip.prototype.selectCommand = function() {
    this._cancelWindow.deselect();
};

Scene_Equip.prototype.selectCancel = function() {
    if (this._commandWindow.active) {
        this._commandWindow.deselect();
    }
    else if (this._slotWindow.active) {
        this._slotWindow.deselect();
    }
    else if (this._itemWindow.active) {
        this._itemWindow.deselect();
    }
};

Scene_Equip.prototype.cancel = function() {
    if (this._commandWindow.active) {
        this.popScene();
    }
    else if (this._slotWindow.active) {
        this.onSlotCancel();
        //Explicit deactivate
        this._slotWindow.deactivate();
        this._cancelWindow.activate();
        this._cancelWindow.pagingEnable(true);
    }
    else if (this._itemWindow.active) {
        this.onItemCancel();
        this._cancelWindow.activate();
        this._itemWindow.hide();
        this._commandWindow.show();
        this._slotWindow.show();
    }
};

var Scene_Equip_commandEquip = Scene_Equip.prototype.commandEquip;
Scene_Equip.prototype.commandEquip = function() {
    Scene_Equip_commandEquip.call(this);
    this._cancelWindow.pagingEnable(false);
};

var Scene_Equip_onSlotOk = Scene_Equip.prototype.onSlotOk;
Scene_Equip.prototype.onSlotOk = function() {
    this._commandWindow.hide();
    this._slotWindow.hide();
    this._itemWindow.show();
    Scene_Equip_onSlotOk.call(this);
};

var Scene_Equip_onItemOk = Scene_Equip.prototype.onItemOk;
Scene_Equip.prototype.onItemOk = function() {
    Scene_Equip_onItemOk.call(this);
    this._itemWindow.hide();
    this._commandWindow.show();
    this._slotWindow.show();
};

Scene_Equip.prototype.nextActor = function() {
    if (!this._commandWindow.active) return;
    Scene_MenuBase.prototype.nextActor.call(this);
    this._cancelWindow.activate();
};

Scene_Equip.prototype.previousActor = function() {
    if (!this._commandWindow.active) return;
    Scene_MenuBase.prototype.previousActor.call(this);
    this._cancelWindow.activate();
};

var _Scene_Status_create = Scene_Status.prototype.create;
Scene_Status.prototype.create = function() {
    _Scene_Status_create.call(this);

    this._cancelWindow = new Window_CancelCommand();
    this._cancelWindow.setHandler('cancel', this.popScene.bind(this));
    this._cancelWindow.setHandler('next', this.nextActor.bind(this));
    this._cancelWindow.setHandler('previous', this.previousActor.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;
    this._cancelWindow.select(2);
    this._cancelWindow.pagingEnable(true);

    var h = Graphics.boxHeight - this._cancelWindow.height;
    this._statusWindow.move(this._statusWindow.x, this._statusWindow.y, this._statusWindow._width, h);
    this._statusWindow.refresh();
};

Scene_Status.prototype.nextActor = function() {
    Scene_MenuBase.prototype.nextActor.call(this);
    this._cancelWindow.activate();
};

Scene_Status.prototype.previousActor = function() {
    Scene_MenuBase.prototype.previousActor.call(this);
    this._cancelWindow.activate();
};
var _Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
    _Scene_Battle_create.call(this);

    this._cancelWindow = new Window_BattleCancelCommand();
    this._cancelWindow.setHandler('cancel', this.commandCancel.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this.addWindow(this._cancelWindow);
    this._cancelWindow.x = Graphics.boxWidth - this._cancelWindow.width;
    this._cancelWindow.y = Graphics.boxHeight - this._cancelWindow.height;

    this._miniStatusWindow = new Window_MiniBattleStatus();
    this.addWindow(this._miniStatusWindow);
    this._miniStatusWindow.x = this._actorCommandWindow.width;

    this._actorCommandWindow.setHandler('select', this.selectCommand.bind(this));
    this._skillWindow.setHandler('select', this.selectCommand.bind(this));
    this._itemWindow.setHandler('select', this.selectCommand.bind(this));
    this._actorWindow.setHandler('select', this.selectCommand.bind(this));
    this._enemyWindow.setHandler('select', this.selectCommand.bind(this));

    this._actorWindow.move(0, 0, Graphics.boxWidth, this._miniStatusWindow.y);
    this._enemyWindow.move(0, 0, Graphics.boxWidth, this._miniStatusWindow.y);
    var h = Graphics.boxHeight - this._helpWindow.height - this._miniStatusWindow.height;
    this._skillWindow.move(this._skillWindow.x, this._skillWindow.y, this._skillWindow.width, h);
    this._itemWindow.move(this._itemWindow.x, this._itemWindow.y, this._itemWindow.width, h);
};

var Scene_Battle_stop = Scene_Battle.prototype.stop;
Scene_Battle.prototype.stop = function() {
    Scene_Battle_stop.call(this);
    this._miniStatusWindow.close();
};

var Scene_Battle_updateStatusWindow = Scene_Battle.prototype.updateStatusWindow;
Scene_Battle.prototype.updateStatusWindow = function() {
    Scene_Battle_updateStatusWindow.call(this);
    if ($gameMessage.isBusy()) {
        this._miniStatusWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        if (!this._statusWindow.visible) {
            this._miniStatusWindow.open();
        }
    }
};

var Scene_Battle_refreshStatus = Scene_Battle.prototype.refreshStatus;
Scene_Battle.prototype.refreshStatus = function() {
    Scene_Battle_refreshStatus.call(this);
    this._miniStatusWindow.refresh();
};


Scene_Battle.prototype.selectCommand = function() {
    this._cancelWindow.deselect();
};

Scene_Battle.prototype.selectCancel = function() {
    if (this._actorCommandWindow.active) {
        this._actorCommandWindow.deselect();
    }
    else if (this._skillWindow.active) {
        this._skillWindow.deselect();
    }
    else if (this._itemWindow.active) {
        this._itemWindow.deselect();
    }
    else if (this._actorWindow.active) {
        this._actorWindow.deselect();
    }
    else if (this._enemyWindow.active) {
        this._enemyWindow.deselect();
    }
};

Scene_Battle.prototype.commandCancel = function() {
    if (this._actorCommandWindow.active) {
        this.selectPreviousCommand();
        //Explicit deactivate
        this._actorCommandWindow.deactivate();
        this._cancelWindow.activate();
    }
    else if (this._skillWindow.active) {
        this.onSkillCancel();
        this._skillWindow.deactivate();
        this._cancelWindow.activate();
    }
    else if (this._itemWindow.active) {
        this.onItemCancel();
        this._itemWindow.deactivate();
        this._cancelWindow.activate();
    }
    else if (this._actorWindow.active) {
        this.onActorCancel();
        this._actorWindow.deactivate();
        this._cancelWindow.activate();
    }
    else if (this._enemyWindow.active) {
        this.onEnemyCancel();
        this._enemyWindow.deactivate();
        this._cancelWindow.activate();
    }
};

var Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    Scene_Battle_startPartyCommandSelection.call(this);
    this._cancelWindow.close();
    this._statusWindow.show();
    this._miniStatusWindow.deselect();
    this._miniStatusWindow.close();
};

var Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function() {
    Scene_Battle_startActorCommandSelection.call(this);
    this._cancelWindow.setup();
    this._statusWindow.hide();
    this._miniStatusWindow.select(BattleManager.actor().index());
    this._miniStatusWindow.open();
};

var Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
Scene_Battle.prototype.endCommandSelection = function() {
    Scene_Battle_endCommandSelection.call(this);
    this._cancelWindow.close();
    this._miniStatusWindow.close();
    this._statusWindow.show();
};


var _Scene_Shop_create = Scene_Shop.prototype.create;
Scene_Shop.prototype.create = function() {
    _Scene_Shop_create.call(this);

    this._cancelWindow = new Window_ShopCancelCommand();
    this._cancelWindow.setHandler('cancel', this.cancel.bind(this));
    this._cancelWindow.setHandler('select', this.selectCancel.bind(this));
    this.addWindow(this._cancelWindow);
    var ww = this._numberWindow.width;
    var wh = this._cancelWindow.height;
    var wx = Graphics.boxWidth - ww;
    var wy = Graphics.boxHeight - wh;
    this._cancelWindow.move(wx, wy, ww, wh);
    this._cancelWindow.refresh();
    this._cancelWindow.deselect();

    this._commandWindow.setHandler('select', this.selectCommand.bind(this));
    this._numberWindow.setHandler('change', this.selectCommand.bind(this));
    this._buyWindow.setHandler('select', this.selectCommand.bind(this));
    this._categoryWindow.setHandler('select', this.selectCommand.bind(this));
    this._sellWindow.setHandler('select', this.selectCommand.bind(this));

    this._commandWindow.move(wx, this._commandWindow.y, ww, this._commandWindow.height);
    this._commandWindow.refresh();

    wh = this._dummyWindow.height - this._cancelWindow.height;
    this._dummyWindow.move(wx, this._dummyWindow.y, ww, wh);

    this._numberWindow.move(wx, this._numberWindow.y, ww, wh);

    wy = this._goldWindow.y + this._goldWindow.height;
    this._statusWindow.move(0, wy, this._statusWindow.width, Graphics.boxHeight - wy);
    //This class does not inherit the Window_Selectable class, resize of the bitmap
    this._statusWindow.contents.resize(this._statusWindow.contentsWidth(), this._statusWindow.contentsHeight());

    this._goldWindow.move(0, this._goldWindow.y, this._statusWindow.width, this._goldWindow.height);
    //This class does not inherit the Window_Selectable class, resize of the bitmap
    this._goldWindow.contents.resize(this._goldWindow.contentsWidth(), this._goldWindow.contentsHeight());
    this._goldWindow.refresh();

    this._buyWindow.move(wx, this._buyWindow.y, this._buyWindow.width, wh);
    this._sellWindow.move(this._sellWindow.x, this._sellWindow.y,
        this._sellWindow.width, wh - this._categoryWindow.height);

    this.createDummyWindow2();
};

Scene_Shop.prototype.createDummyWindow2 = function() {
    var wy = this._goldWindow.y + this._goldWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._dummyWindow2 = new Window_Base(0, wy, this._goldWindow.width, wh);
    this.addWindow(this._dummyWindow2);
};

var Scene_Shop_commandBuy = Scene_Shop.prototype.commandBuy;
Scene_Shop.prototype.commandBuy = function() {
    Scene_Shop_commandBuy.call(this);
    this._dummyWindow2.hide();
};

var Scene_Shop_commandSell = Scene_Shop.prototype.commandSell;
Scene_Shop.prototype.commandSell = function() {
    Scene_Shop_commandSell.call(this);
    this._dummyWindow2.hide();
};

var Scene_Shop_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
Scene_Shop.prototype.onBuyCancel = function() {
    Scene_Shop_onBuyCancel.call(this);
    this._dummyWindow2.show();
};

var Scene_Shop_onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
Scene_Shop.prototype.onCategoryCancel = function() {
    Scene_Shop_onCategoryCancel.call(this);
    this._dummyWindow2.show();
};

Scene_Shop.prototype.selectCommand = function() {
    this._cancelWindow.deselect();
};

Scene_Shop.prototype.selectCancel = function() {
    if (this._commandWindow.active) {
        this._commandWindow.deselect();
    }
    else if (this._numberWindow.active) {
        this._numberWindow.deselect();
    }
    else if (this._buyWindow.active) {
        this._buyWindow.deselect();
    }
    else if (this._categoryWindow.active) {
        this._categoryWindow.deselect();
    }
    else if (this._sellWindow.active) {
        this._sellWindow.deselect();
    }
};

Scene_Shop.prototype.cancel = function() {
    if (this._commandWindow.active) {
        this.popScene();
    }
    else {
        if (this._numberWindow.active) {
            this.onNumberCancel();
            //Explicit deactivate
            this._numberWindow.deactivate();
        }
        else if (this._buyWindow.active) {
            this.onBuyCancel();
            this._buyWindow.deactivate();
        }
        else if (this._categoryWindow.active) {
            this.onCategoryCancel();
        }
        else if (this._sellWindow.active) {
            this.onSellCancel();
            this._sellWindow.deactivate();
        }
        this._cancelWindow.activate();
    }
};

//vertical align center
var Window_Base_drawIcon = Window_Base.prototype.drawIcon;
Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
    y += Math.floor((this.lineHeight() - Window_Base._iconHeight) / 2) - 2;
    Window_Base_drawIcon.call(this,iconIndex, x, y);
};

var Window_Selectable_initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function (x, y, width, height) {
    this._lastTopRow = 0;
    this._windowButtonSprite = null;
    this._swipeContainer = null;
    this._columnRatios = [];
    for (var i = 0; i < this.maxCols(); i++) {
        this._columnRatios.push(1 / this.maxCols());
    }
    if (typeof this._swipeable === "undefined") this._swipeable = false;
    Window_Selectable_initialize.call(this, x, y, width, height);
};

/**
 * The bitmap used for the button image contents.
 *
 * @property buttonBase
 * @type Bitmap
 */
Object.defineProperty(Window_Selectable.prototype, 'buttonBase', {
    get: function () {
        return this._windowButtonSprite.bitmap;
    },
    set: function (value) {
        this._windowButtonSprite.bitmap = value;
    },
    configurable: true
});

var Window_Selectable_itemWidth = Window_Selectable.prototype.itemWidth;
Window_Selectable.prototype.itemWidth = function (columnIndex) {
    if (typeof columnIndex !== "undefined" && columnIndex >= 0) {
        return Math.floor((this.width - this.padding * 2 +
            this.spacing()) * this._columnRatios[columnIndex] - this.spacing());
    }

    return Window_Selectable_itemWidth.call(this);
};

var Window_Selectable_activate = Window_Selectable.prototype.activate;
Window_Selectable.prototype.activate = function () {
    Window_Selectable_activate.call(this);
    this._swipeContainer.activate();
};

var Window_Selectable_deactivate = Window_Selectable.prototype.deactivate;
Window_Selectable.prototype.deactivate = function () {
    Window_Selectable_deactivate.call(this);
    this._swipeContainer.deactivate();
};

var Window_Selectable_select = Window_Selectable.prototype.select;
Window_Selectable.prototype.select = function (index) {
    Window_Selectable_select.call(this, index);

    if (this._index >= 0) {
        if (this.isHandled('select')) {
            this._handlers['select']();
        }
        else {
            this.callSelectHandler()
        }
    }
};

var Window_Selectable_setTopRow = Window_Selectable.prototype.setTopRow;
Window_Selectable.prototype.setTopRow = function (row) {
    if (!this._swipeable) {
        Window_Selectable_setTopRow.call(this, row);
    }
    else {
        var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
        if (this._swipeContainer.scrollY !== -scrollY) {
            this._swipeContainer.setScroll(-scrollY);
            this.refresh();
            this.updateCursor();
        }
    }
};

var Window_Selectable_maxPageRows = Window_Selectable.prototype.maxPageRows;
Window_Selectable.prototype.maxPageRows = function () {
    if (this._swipeable) {
        var pageHeight = this.height - this.padding * 2;
        return Math.ceil(pageHeight / this.itemHeight());
    }
    else {
        return Window_Selectable_maxPageRows.call(this);
    }
};

var Window_Selectable_itemRect = Window_Selectable.prototype.itemRect;
Window_Selectable.prototype.itemRect = function (index) {
    var rect = Window_Selectable_itemRect.call(this, index);

    if (this._swipeable) {
        rect.y -= rect.height * this._lastTopRow;
    }

    // Depend column width
    var x = 0;
    for (var i = 0; i < index % this.maxCols(); i++) {
        x += this.itemWidth(i) + this.spacing();
    }
    rect.x = x;
    rect.width = this.itemWidth(index % this.maxCols());

    return rect;
};

var Window_Selectable_update = Window_Selectable.prototype.update;
Window_Selectable.prototype.update = function () {
    if (this._swipeable) {
        Window_Base.prototype.update.call(this);
        this.updateArrows();

        var currentTopRow = Math.floor((this._swipeContainer.scrollY) / this.itemHeight()) * -1;
        currentTopRow = Math.max(0, currentTopRow - 1);
        if (currentTopRow !== this._lastTopRow) {
            this._lastTopRow = currentTopRow;
            this.refresh();
        }
        var maskOffsetY = this._lastTopRow * this.itemHeight();
        this.origin.x = 0;
        this.origin.y = -this._swipeContainer.scrollY - maskOffsetY;

        this.processHandling();
        this.processTouch();
        this._stayCount++;
    }
    else {
        Window_Selectable_update.call(this);
    }
};

Window_Selectable.prototype.updateArrows = function () {
    var topRow = this._lastTopRow;
    var maxTopRow = this.maxTopRow();
    this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
    this.upArrowVisible = topRow > 0;
};

/*
 * Enable this method by the 1 touch operation (case of release handler)
 */
//var Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
//Window_Selectable.prototype.processTouch = function () {
//    if (this._swipeable) {
//        if (this.isOpenAndActive()) {
//            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
//                this._touching = true;
//                this.onTouch(true);
//            } else if (TouchInput.isCancelled()) {
//                if (this.isCancelEnabled()) {
//                    this.processCancel();
//                }
//            } else if (TouchInput.isReleased() && this.isTouchedInsideFrame()) {
//                this.onRelease();
//            }
//            if (this._touching) {
//                if (TouchInput.isPressed()) {
//                    this.onTouch(false);
//                } else {
//                    this._touching = false;
//                }
//            }
//        } else {
//            this._touching = false;
//        }
//    }
//    else {
//        Window_Selectable_processTouch.call(this);
//    }
//};

Window_Selectable.prototype.onRelease = function () {
    var lastIndex = this.index();
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    var hitIndex = this.hitTest(x - 0, y - this._swipeContainer.scrollY);
    if (hitIndex >= 0 && !this._swipeContainer.overGap) {
        if (hitIndex === lastIndex) {
            if (this.isTouchOkEnabled()) {
                this.processOk();
            }
        }
    }
};

/*
 * Disable the "processOk" by the 1 touch operation (case of release handler)
 */
var Window_Selectable_onTouch = Window_Selectable.prototype.onTouch;
Window_Selectable.prototype.onTouch = function (triggered) {
    if (this._swipeable) {
        var lastIndex = this.index();
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitIndex = this.hitTest(x - 0, y - this._swipeContainer.scrollY);
        if (hitIndex >= 0) {
            if (hitIndex === this.index()) {
                if (triggered && this.isTouchOkEnabled()) {
                    this.processOk();
                }
            } else if (this.isCursorMovable() && triggered) {
                this.select(hitIndex);
            }
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
    else {
        Window_Selectable_onTouch.call(this, triggered);
    }
};

var Window_Selectable_hitTest = Window_Selectable.prototype.hitTest;
Window_Selectable.prototype.hitTest = function (x, y) {
    if (this._swipeable) {
        var cx = x - this.padding;
        var cy = y - this.padding;
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxItems(); i++) {
            var index = topIndex + i;
            var rect = this.itemRect(index + this._lastTopRow * this.maxCols());
            var right = rect.x + rect.width;
            var bottom = rect.y + rect.height;
            if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                return index;
            }
        }
        return -1;
    }
    else {
        return Window_Selectable_hitTest.call(this, x, y);
    }
};

var Window_Selectable_updateCursor = Window_Selectable.prototype.updateCursor;
Window_Selectable.prototype.updateCursor = function () {
    if (this._swipeable) {
        if (this._cursorAll) {
            var allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            var rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }
    else {
        Window_Selectable_updateCursor.call(this);
    }
};

var Window_Selectable_isCursorVisible = Window_Selectable.prototype.isCursorVisible;
Window_Selectable.prototype.isCursorVisible = function () {
    if (this._swipeable) return true;
    else return Window_Selectable_isCursorVisible.call(this);
};

var Window_Selectable_drawAllItems = Window_Selectable.prototype.drawAllItems;
Window_Selectable.prototype.drawAllItems = function () {

    var bitmap = this.buttonBase;
    bitmap.clear();

    if (this._swipeable) {
        var topIndex = this._lastTopRow * this.maxCols();
        var maxPageItems = this.maxPageItems() + this.maxCols();
        for (var i = 0; i < maxPageItems; i++) {
            var index = topIndex + i;
            if (index >= 0 && index < this.maxItems()) {
                this.drawItem(index);
                this.drawButtonImage(index);
            }
        }
        var tone = this._colorTone;
        bitmap.adjustTone(tone[0], tone[1], tone[2]);

        this.updateCursor();
    }
    else {
        Window_Selectable_drawAllItems.call(this);
    }
};

Window_Selectable.prototype.drawButtonImage = function (index) {
    var itemRect = this.itemRect(index);
    var x = itemRect.x;
    var y = itemRect.y;
    var w = itemRect.width;
    var h = itemRect.height;
    var m = 5;
    var bitmap = this.buttonBase;
    this.changePaintOpacity(true);

    bitmap.clearRect(x, y, w, h);

    if (w > 0 && h > 0 && this.windowskin) {
        var skin = this.windowskin;

        var p = 96;
        var q = 96;

        bitmap.blt(skin, 0, 0 + 192, m, m, x, y, m, m);
        bitmap.blt(skin, 0, m + 192, m, q - m * 2, x, y + m, m, h - m * 2);
        bitmap.blt(skin, 0, q - m + 192, m, m, x, y + h - m, m, m);

        bitmap.blt(skin, m, 0 + 192, p - m * 2, m, x + m, y, w - m * 2, m);
        bitmap.blt(skin, m, m + 192, p - m * 2, q - m * 2, x + m, y + m, w - m * 2, h - m * 2);
        bitmap.blt(skin, m, q - m + 192, p - m * 2, m, x + m, y + h - m, w - m * 2, m);

        bitmap.blt(skin, p - m, 0 + 192, m, m, x + w - m, y, m, m);
        bitmap.blt(skin, p - m, m + 192, m, q - m * 2, x + w - m, y + m, m, h - m * 2);
        bitmap.blt(skin, p - m, q - m + 192, m, m, x + w - m, y + h - m, m, m);
    }
};

/*
 * Expand the contents bitmap
 */
var _Window_Selectable_contentsWidth = Window_Selectable.prototype.contentsWidth;
Window_Selectable.prototype.contentsWidth = function () {
    var contentsWidth = _Window_Selectable_contentsWidth.call(this);
    if (this._swipeable) contentsWidth += this.itemWidth();
    return contentsWidth;
};

var _Window_Selectable_contentsHeight = Window_Selectable.prototype.contentsHeight;
Window_Selectable.prototype.contentsHeight = function () {
    var contentsHeight = _Window_Selectable_contentsHeight.call(this);
    if (this._swipeable) contentsHeight += this.itemHeight();
    return contentsHeight;
};

/*
 * Create the button contents
 */
Window_Selectable.prototype.createContents = function () {
    Window_Base.prototype.createContents.call(this);
    this.buttonBase = new Bitmap(this.contentsWidth(), this.contentsHeight());
};

/*
 * Set the swipe container
 */
Window_Selectable.prototype._createAllParts = function () {
    Window.prototype._createAllParts.call(this);

    this._swipeContainer = new Window_SwipeContainer();
    this._windowButtonSprite = new Sprite();
    this.addChild(this._windowButtonSprite);
    this.addChild(this._windowCursorSprite);
    this.addChild(this._windowContentsSprite);
    this.addChild(this._downArrowSprite);
    this.addChild(this._upArrowSprite);
    this.addChild(this._windowPauseSignSprite);

    if (this._swipeable) {
        this._swipeContainer.addChild(this._windowButtonSprite);
        this._swipeContainer.addChild(this._windowCursorSprite);
        this._swipeContainer.addChild(this._windowContentsSprite);
        this.addChild(this._swipeContainer);
        this.addChild(this._downArrowSprite);
        this.addChild(this._upArrowSprite);
        this.addChild(this._windowPauseSignSprite);
    }
};

Window_Selectable.prototype._refreshAllParts = function () {
    Window.prototype._refreshAllParts.call(this);
    this._refreshButtonImage();
    this._refreshSwipeContainer();
    if (!!this.contents) {
        this.contents.resize(this.contentsWidth(), this.contentsHeight());
    }
    if (!!this._windowButtonSprite.bitmap) {
        this._windowButtonSprite.bitmap.resize(this.contentsWidth(), this.contentsHeight());
    }
};

/*
 * Expand bitmap for cursor
 */
Window_Selectable.prototype._refreshCursor = function () {
    if (this._swipeable) {
        var x = this._cursorRect.x;
        var y = this._cursorRect.y;
        var w = this._cursorRect.width;
        var h = this._cursorRect.height;
        var m = 4;
        var ox = x;
        var oy = y;
        var bitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());

        this._windowCursorSprite.bitmap = bitmap;
        this._windowCursorSprite.setFrame(0, 0, this._width - this._padding * 2, this._height - this._padding * 2);
        this._windowCursorSprite.move(this.padding, this.padding);

        if (w > 0 && h > 0 && this._windowskin) {
            var skin = this._windowskin;
            var p = 96;
            var q = 48;
            bitmap.blt(skin, p + m, p + m, q - m * 2, q - m * 2, ox + m, oy + m, w - m * 2, h - m * 2);
            bitmap.blt(skin, p + m, p + 0, q - m * 2, m, ox + m, oy + 0, w - m * 2, m);
            bitmap.blt(skin, p + m, p + q - m, q - m * 2, m, ox + m, oy + h - m, w - m * 2, m);
            bitmap.blt(skin, p + 0, p + m, m, q - m * 2, ox + 0, oy + m, m, h - m * 2);
            bitmap.blt(skin, p + q - m, p + m, m, q - m * 2, ox + w - m, oy + m, m, h - m * 2);
            bitmap.blt(skin, p + 0, p + 0, m, m, ox + 0, oy + 0, m, m);
            bitmap.blt(skin, p + q - m, p + 0, m, m, ox + w - m, oy + 0, m, m);
            bitmap.blt(skin, p + 0, p + q - m, m, m, ox + 0, oy + h - m, m, m);
            bitmap.blt(skin, p + q - m, p + q - m, m, m, ox + w - m, oy + h - m, m, m);
        }
    }
    else {
        Window.prototype._refreshCursor.call(this);
    }
};

Window_Selectable.prototype._refreshButtonImage = function () {
    this._windowButtonSprite.move(this.padding, this.padding);
};

Window_Selectable.prototype._refreshSwipeContainer = function () {
    if (this._swipeable) {
        this._swipeContainer.maxWidth = this._width - this.padding * 2;
        this._swipeContainer.maxHeight = this.maxRows() * this.itemHeight();
        this._swipeContainer.contentsWidth = this._width - this._padding * 2;
        this._swipeContainer.contentsHeight = this._height - this._padding * 2;
        this._swipeContainer.overDist = this.itemHeight();
    }
};

/*
 * Clipping the button image and the cursor
 */
Window_Selectable.prototype._updateContents = function () {
    Window.prototype._updateContents.call(this);

    if (this._swipeable) {
        var w = this._width - this._padding * 2;
        var h = this._height - this._padding * 2;
        if (w > 0 && h > 0) {
            this._windowButtonSprite.setFrame(this.origin.x, this.origin.y, w, h);
            this._windowCursorSprite.setFrame(this.origin.x, this.origin.y, w, h);
        }
    }
};

var Window_Selectable_ensureCursorVisible = Window_Selectable.prototype.ensureCursorVisible;
Window_Selectable.prototype.ensureCursorVisible = function () {
    if (!this._swipeable) {
        Window_Selectable_ensureCursorVisible.call(this);
    }
    else if (this._index !== -1) {
        var scrollY = this._swipeContainer.scrollY;
        var scrollTopY = -scrollY;
        var scrollBottomY = scrollTopY + this._swipeContainer.contentsHeight - this.itemHeight();
        var row = this.row();
        var itemY = row * this.itemHeight();
        if (scrollTopY <= itemY && itemY <= scrollBottomY) {
        }
        else {
            if (itemY < scrollTopY) {
                this.setTopRow(row);
            }
            else if (itemY > scrollBottomY) {
                this.setBottomRow(row);
            }
        }
    }
};

Window_Selectable.prototype.callSelectHandler = function () {
};

/*
 * Variable column width
 * Array of ratio in accordance with the number of elements.
 */
Window_Selectable.prototype.setColumnRatio = function (ratios) {
    var i;
    if (ratios.length !== this._columnRatios.length) {
        this._columnRatios = [];
        for (i = 0; i < ratios.length; i++) {
            this._columnRatios.push(ratios[i]);
        }
    }
    else {
        for (i = 0; i < this.maxCols(); i++) {
            this._columnRatios[i] = ratios[i];
        }
    }
};

var Window_SavefileList_initialize = Window_SavefileList.prototype.initialize;
Window_SavefileList.prototype.initialize = function(x, y, width, height) {
    Window_SavefileList_initialize.call(this, x, y, width, height);
    this._allowCursorBlink = true;
};

var Window_SavefileList_updateCursor = Window_SavefileList.prototype._updateCursor;
Window_SavefileList.prototype._updateCursor = function() {
    if (this._allowCursorBlink) Window_SavefileList_updateCursor.call(this);
};

Window_Options.prototype.makeCommandList = function() {
    this.addGeneralOptions();
    this.addVolumeOptions();
    this.addCommand(TextManager.cancel, 'cancel');
};

var Window_Options_drawItem = Window_Options.prototype.drawItem;
Window_Options.prototype.drawItem = function(index) {
    if (this._list[index].symbol === "cancel") {
        var rect = this.itemRectForText(index);
        var statusWidth = this.statusWidth();
        var titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
    }
    else {
        Window_Options_drawItem.call(this, index);
    }
};

var Window_Options_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    Window_Options_processOk.call(this);
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol === "cancel" && this.isHandled('cancel')) {
        this._handlers['cancel']();
    }
};

Window_EquipItem.prototype.maxCols = function() {
    return 1;
};

//Adjust of the position, and omit the display of equipment.
Window_Status.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawHorzLine(lineHeight * 1);
        this.drawBlock2(lineHeight * 2);
        this.drawHorzLine(lineHeight * 6);
        this.drawBlock3(lineHeight * 7);
        this.drawHorzLine(lineHeight * 10);
        this.drawBlock4(lineHeight * 11);
    }
};

Window_Status.prototype.drawBlock3 = function(y) {
    this.drawParameters(48, y);
};

Window_Status.prototype.drawParameters = function(x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 6; i++) {
        var paramId = i + 2;
        var column = i / 3 >> 0;
        var row = i % 3;
        var x2 = x + column * 384;
        var y2 = y + lineHeight * row;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x2, y2, 160);
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x2 + 160, y2, 60, 'right');
    }
};

var Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
Window_MenuActor.prototype.initialize = function(scene) {
    this._scene = scene;
    Window_MenuActor_initialize.call(this);
};

//Add reselect all
Window_MenuActor.prototype.onTouch = function (triggered) {
    Window_Selectable.prototype.onTouch.call(this, triggered);
    var item = this._scene.item();
    if (item) {
        var actor = $gameParty.menuActor();
        var action = new Game_Action(actor);
        action.setItemObject(item);
        if (action.isForAll()) {
            this.setCursorAll(true);
            this.select(0);
        }
    }
};
//Change face image height
Window_MenuStatus.prototype.drawItemImage = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, this.itemHeight() - 3);
    this.changePaintOpacity(true);
};

//-----------------------------------------------------------------------------
// Window_MiniBattleStatus
//
// The window for displaying the status of party members on the battle screen.
// Omit the numerical display

function Window_MiniBattleStatus() {
    this.initialize.apply(this, arguments);
}

Window_MiniBattleStatus.prototype = Object.create(Window_BattleStatus.prototype);
Window_MiniBattleStatus.prototype.constructor = Window_MiniBattleStatus;

Window_MiniBattleStatus.prototype.initialize = function() {
    Window_BattleStatus.prototype.initialize.call(this);
};

Window_MiniBattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - 192 - 192;
};

Window_MiniBattleStatus.prototype.lineHeight = function () {
    return 54;
};

Window_MiniBattleStatus.prototype.basicAreaRect = function(index) {
    var rect = this.itemRectForText(index);
    return rect;
};

Window_MiniBattleStatus.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
};

Window_MiniBattleStatus.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
};

Window_MiniBattleStatus.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
};
Window_PartyCommand.prototype.numVisibleRows = function() {
    return 2;
};

Window_ActorCommand.prototype.numVisibleRows = function() {
    return 3;
};

//Refresh all parts
Window_ActorCommand.prototype.setup = function(actor) {
    this._actor = actor;
    this.clearCommandList();
    this.makeCommandList();
    this._refreshAllParts();
    this.refresh();
    this.selectLast();
    this.activate();
    this.open();
};
Window_ShopCommand.prototype.maxCols = function() {
    return 2;
};

Window_ShopCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.buy,    'buy');
    this.addCommand(TextManager.sell,   'sell',   !this._purchaseOnly);
};

var Window_ShopNumber_changeNumber = Window_ShopNumber.prototype.changeNumber;
Window_ShopNumber.prototype.changeNumber = function(amount) {
    Window_ShopNumber_changeNumber.call(this, amount);
    if (this.isHandled('change')) {
        this._handlers['change']();
    }
};

var Window_Message_subWindows = Window_Message.prototype.subWindows;
Window_Message.prototype.subWindows = function() {
    var subWindows = Window_Message_subWindows.call(this);
    subWindows.push(this._cancelWindow);
    return subWindows;
};

Window_Message.prototype.createSubWindows = function() {
    this._goldWindow = new Window_ThickGold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
    this._cancelWindow = new Window_MessageCancel(this);
};

var Window_Message_startInput = Window_Message.prototype.startInput;
Window_Message.prototype.startInput = function() {
    var result = Window_Message_startInput.call(this);
    this.showCancel();
    return result;
};

Window_Message.prototype.showCancel = function() {
    if ($gameMessage.isChoice()) {
        this._cancelWindow.start();
        this.updatePlacementSubWindow();
    } else if ($gameMessage.isItemChoice()) {
        this._cancelWindow.start();
        this.updatePlacementSubWindow();
    }
};

Window_Message.prototype.updatePlacementSubWindow = function() {
    this._goldWindow.x = 0;
    this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;

    var h;
    if (this.isAnySubWindowActive()) {
        if (this._positionType > 0) {
            if (this._positionType > 1) {
                h = this._cancelWindow.height;
                this.y -= h;
            }
            if (this._choiceWindow.height > this.y) {
                this._choiceWindow.move(this._choiceWindow.x, this.y - this._choiceWindow.height, this._choiceWindow.width, this.y);
                this._choiceWindow.refresh();
            }
            if (this._itemWindow.height > this.y) {
                this._itemWindow.move(this._itemWindow.x, this._itemWindow.y, this._itemWindow.width, this.y);
                this._itemWindow.refresh();
            }
            this._choiceWindow.y = this.y - this._choiceWindow.height;
        }
        else {
            h = this. _cancelWindow.y - this._choiceWindow.y;
            if (this._choiceWindow.height > h) {
                this._choiceWindow.move(this._choiceWindow.x, this._choiceWindow.y, this._choiceWindow.width, h);
                this._choiceWindow.refresh();
            }
        }
    }
};

var Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    Window_Message_terminateMessage.call(this);
    this._cancelWindow.close();
};

Window_Message.prototype.choiceDeselect = function() {
    this._choiceWindow.deselect();
    this._itemWindow.deselect();
};

Window_Message.prototype.cancelDeselect = function() {
    if (this._cancelWindow) {
        this._cancelWindow.deselect();
    }
};

var Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
Window_ChoiceList.prototype.updatePlacement = function() {
    Window_ChoiceList_updatePlacement.call(this);
    var messageY = this._messageWindow.y;
    if (messageY > 0) {
        this.y = 0;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};

Window_ChoiceList.prototype.callSelectHandler = function() {
    this._messageWindow.cancelDeselect();
};

//Fix Vertical align
Window_ChoiceList.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x, textState.y, w * 2, this.lineHeight());
    textState.x += w;
};

var Window_EventItem_updatePlacement = Window_EventItem.prototype.updatePlacement;
Window_EventItem.prototype.updatePlacement = function() {
    Window_EventItem_updatePlacement.call(this);
    var messageY = this._messageWindow.y;
    if (messageY > 0) {
        this.y = 0;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};

Window_EventItem.prototype.callSelectHandler = function() {
    this._messageWindow.cancelDeselect();
};

var Window_SkillList_refresh = Window_SkillList.prototype.refresh;
Window_SkillList.prototype.refresh = function() {
    Window_SkillList_refresh.call(this);
    if (this._swipeable) this._refreshSwipeContainer();
};

Window_SkillType.prototype.numVisibleRows = function() {
    return 2;
};

var Window_ItemList_refresh = Window_ItemList.prototype.refresh;
Window_ItemList.prototype.refresh = function() {
    Window_ItemList_refresh.call(this);
    if (this._swipeable) this._refreshSwipeContainer();
};

//-----------------------------------------------------------------------------
// Window_ThickGold
//
// The window for displaying the party's gold.

function Window_ThickGold() {
    this.initialize.apply(this, arguments);
}

Window_ThickGold.prototype = Object.create(Window_Gold.prototype);
Window_ThickGold.prototype.constructor = Window_ThickGold;

Window_ThickGold.prototype.initialize = function(x, y) {
    Window_Gold.prototype.initialize.call(this, x, y);
};

Window_ThickGold.prototype.lineHeight = function () {
    return 72;
};

Window_TitleCommand.prototype.itemTextAlign = function() {
    return 'center';
};

var Window_Command_initialize = Window_Command.prototype.initialize;
Window_Command.prototype.initialize = function (x, y) {
    this._swipeable = true;
    Window_Command_initialize.call(this, x, y);
};

var Window_MenuStatus_initialize = Window_MenuStatus.prototype.initialize;
Window_MenuStatus.prototype.initialize = function (x, y) {
    this._swipeable = true;
    Window_MenuStatus_initialize.call(this, x, y);
};

var Window_SavefileList_initialize2 = Window_SavefileList.prototype.initialize;
Window_SavefileList.prototype.initialize = function (x, y, width, height) {
    this._swipeable = true;
    Window_SavefileList_initialize2.call(this, x, y, width, height);
};

var Window_ItemList_initialize = Window_ItemList.prototype.initialize;
Window_ItemList.prototype.initialize = function (x, y, width, height) {
    this._swipeable = true;
    Window_ItemList_initialize.call(this, x, y, width, height);
};

var Window_SkillList_initialize = Window_SkillList.prototype.initialize;
Window_SkillList.prototype.initialize = function (x, y, width, height) {
    this._swipeable = true;
    Window_SkillList_initialize.call(this, x, y, width, height);
};

var Window_EquipSlot_initialize = Window_EquipSlot.prototype.initialize;
Window_EquipSlot.prototype.initialize = function (x, y, width, height) {
    this._swipeable = true;
    Window_EquipSlot_initialize.call(this, x, y, width, height);
};

var Window_BattleActor_initialize = Window_BattleActor.prototype.initialize;
Window_BattleActor.prototype.initialize = function (x, y) {
    this._swipeable = true;
    Window_BattleActor_initialize.call(this, x, y);
};

var Window_BattleEnemy_initialize = Window_BattleEnemy.prototype.initialize;
Window_BattleEnemy.prototype.initialize = function (x, y, width, height) {
    this._swipeable = true;
    Window_BattleEnemy_initialize.call(this, x, y, width, height);
};

var Window_ShopBuy_initialize = Window_ShopBuy.prototype.initialize;
Window_ShopBuy.prototype.initialize = function (x, y, width, height) {
    this._swipeable = true;
    Window_ShopBuy_initialize.call(this, x, y, width, height);
};

Window_Command.prototype.lineHeight = function () {
    return 72;
};

Window_ItemList.prototype.lineHeight = function () {
    return 72;
};

Window_SkillList.prototype.lineHeight = function () {
    return 72;
};

Window_EquipSlot.prototype.lineHeight = function () {
    return 72;
};

Window_ActorCommand.prototype.lineHeight = function () {
    return 72;
};

Window_BattleActor.prototype.lineHeight = function () {
    return 72;
};

Window_BattleEnemy.prototype.lineHeight = function () {
    return 72;
};

Window_ShopBuy.prototype.lineHeight = function () {
    return 72;
};

})();
}
