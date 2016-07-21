//=============================================================================
// AltMenuScreen3.js
// Version
// 1.0.1 2016/07/22 リザーブメンバーの立ち絵が初回表示時に正しく表示されない問題の修正
//                  スクロール可能であることを示す矢印スプライトの向きがおかしい問題の修正
//=============================================================================

/*:
 * @plugindesc Yet Another menu screen layout.
 * @author Sasuke KANNAZUKI, Yoji Ojima
 * 
 * @default 
 * @param bgBitmapMenu
 * @desc background bitmap file at menu scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapItem
 * @desc background bitmap file at item scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc background bitmap file at skill scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc background bitmap file at equip scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc background bitmap file at status scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc background bitmap file at option scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapFile
 * @desc background bitmap file at save/load scene. put at img/pictures.
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc background bitmap file at gameEnd scene. put at img/pictures.
 * @default 
 * 
 * @param maxColsMenu
 * @desc max column at menu window
 * @default 4
 * 
 * @param commandRows
 * @desc number of visible rows at command window
 * @default 2
 *
 * @param isDisplayStatus
 * @desc whether display status or not. (1 = yes, 0 = no)
 * @default 1
 * 
 * @help This plugin does not provide plugin commands.
 *  The differences with AltMenuscreen are follows:
 *   - windows are transparent at all menu scene.
 *   - it can set the background bitmap for each scenes at menu.
 *   - picture is actors' original
 *
 * Actor' note:
 * <stand_picture:filename> set actor's standing picture at menu.
 *   put file at img/pictures.
 *
 * preferred size of actor's picture:
 * width: 174px(maxColsMenu=4), 240px(maxColsMenu=3)
 * height: 408px(commandRows=2), 444px(commandRows=1)
 */

/*:ja
 * @plugindesc レイアウトの異なるメニュー画面
 * @author 神無月サスケ, Yoji Ojima
 * 
 * @param bgBitmapMenu
 * @desc メニュー背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param maxColsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 * 
 * @param commandRows
 * @desc コマンドウィンドウの行数です。
 * @default 2
 *
 * @param isDisplayStatus
 * @desc ステータスを表示するかしないかを選びます。(1 = yes, 0 = no)
 * @default 1
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  AltMenuscreen との違いは以下です:
 *  - メニュー画面すべてのウィンドウが透明です
 *  - メニューそれぞれのシーンに背景ビットマップを付けることが出来ます。
 *  - アクターに立ち絵を利用します。
 *
 * アクターのメモに以下のように書いてください:
 * <stand_picture:ファイル名> ファイル名が、そのアクターの立ち絵になります。
 *   ファイルは img/pictures に置いてください。
 *
 * 望ましいアクター立ち絵のサイズ：
 * 幅：3列:240px, 4列：174px
 * 高さ： コマンドウィンドウ 1行:444px 2行:408px
 *
 */

(function() {

    // set parameters
    var parameters = PluginManager.parameters('AltMenuScreen3');
    var bgBitmapMenu = parameters['bgBitmapMenu'] || '';
    var bgBitmapItem = parameters['bgBitmapItem'] || '';
    var bgBitmapSkill = parameters['bgBitmapSkill'] || '';
    var bgBitmapEquip = parameters['bgBitmapEquip'] || '';
    var bgBitmapStatus = parameters['bgBitmapStatus'] || '';
    var bgBitmapOptions = parameters['bgBitmapOptions'] || '';
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
    var bgBitmapGameEnd = parameters['bgBitmapGameEnd'] || '';
    var maxColsMenuWnd = Number(parameters['maxColsMenu'] || 4);
    var rowsCommandWnd = Number(parameters['commandRows'] || 2);
    var isDisplayStatus = !!Number(parameters['isDisplayStatus']);

   //
   // make transparent windows for each scenes in menu.
   //
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this._statusWindow.x = 0;
        this._statusWindow.y = this._commandWindow.height;
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        // make transparent for all windows at menu scene.
        this._statusWindow.opacity = 0;
        this._goldWindow.opacity = 0;
        this._commandWindow.opacity = 0;
    };

    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this._helpWindow.opacity = 0;
        this._categoryWindow.opacity = 0;
        this._itemWindow.opacity = 0;
        this._actorWindow.opacity = 0;
    };

    var _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        _Scene_Skill_create.call(this);
        this._helpWindow.opacity = 0;
        this._skillTypeWindow.opacity = 0;
        this._statusWindow.opacity = 0;
        this._itemWindow.opacity = 0;
        this._actorWindow.opacity = 0;
    };

    var _Scene_Equip_create = Scene_Equip.prototype.create;
    Scene_Equip.prototype.create = function() {
        _Scene_Equip_create.call(this);
        this._helpWindow.opacity = 0;
        this._statusWindow.opacity = 0;
        this._commandWindow.opacity = 0;
        this._slotWindow.opacity = 0;
        this._itemWindow.opacity = 0;
    };

    var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function() {
        _Scene_Status_create.call(this);
        this._statusWindow.opacity = 0;
    };

    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.opacity = 0;
    };

    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this._helpWindow.opacity = 0;
        this._listWindow.opacity = 0;
    };

    var _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function() {
        _Scene_GameEnd_create.call(this);
        this._commandWindow.opacity = 0;
    };

    //
    // load bitmap that set in plugin parameter
    //
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if(bgBitmapMenu){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapMenu);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Menu_createBackground.call(this);
    };

    var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
    Scene_Item.prototype.createBackground = function(){
        if(bgBitmapItem){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapItem);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Item_createBackground.call(this);
    };

    var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
    Scene_Skill.prototype.createBackground = function(){
        if(bgBitmapSkill){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapSkill);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Skill_createBackground.call(this);
    };

    var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
    Scene_Equip.prototype.createBackground = function(){
        if(bgBitmapEquip){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapEquip);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Equip_createBackground.call(this);
    };

    var _Scene_Status_createBackground =
     Scene_Status.prototype.createBackground;
    Scene_Status.prototype.createBackground = function(){
        if(bgBitmapStatus){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapStatus);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Status_createBackground.call(this);
    };

    var _Scene_Options_createBackground =
     Scene_Options.prototype.createBackground;
    Scene_Options.prototype.createBackground = function(){
        if(bgBitmapOptions){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapOptions);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Options_createBackground.call(this);
    };

    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function(){
        if(bgBitmapFile){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_File_createBackground.call(this);
    };

    var _Scene_GameEnd_createBackground =
     Scene_GameEnd.prototype.createBackground;
    Scene_GameEnd.prototype.createBackground = function(){
        if(bgBitmapGameEnd){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapGameEnd);
            this.addChild(this._backgroundSprite);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_GameEnd_createBackground.call(this);
    };

    //
    // alt menu screen processes
    //
    Window_MenuCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuCommand.prototype.maxCols = function() {
        return 4;
    };

    Window_MenuCommand.prototype.numVisibleRows = function() {
        return rowsCommandWnd;
    };

    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuStatus.prototype.windowHeight = function() {
        var h1 = this.fittingHeight(1);
        var h2 = this.fittingHeight(rowsCommandWnd);
        return Graphics.boxHeight - h1 - h2;
    };

    Window_MenuStatus.prototype.maxCols = function() {
        return maxColsMenuWnd;
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    var _Window_MenuStatus_drawItem = Window_MenuStatus.prototype.drawItem;
    Window_MenuStatus.prototype.drawItem = function(index) {
        var actor = $gameParty.members()[index];
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        if (bitmap && !bitmap.isReady()) {
            bitmap.addLoadListener(_Window_MenuStatus_drawItem.bind(this, index));
        } else {
            _Window_MenuStatus_drawItem.apply(this, arguments);
        }
    };

    Window_MenuStatus.prototype._refreshArrows = function() {
        Window.prototype._refreshArrows.call(this);
        var w = this._width;
        var h = this._height;
        var p = 24;
        var q = p / 2;

        this._downArrowSprite.rotation = 270 * Math.PI / 180;
        this._downArrowSprite.move(w - q, h / 2);
        this._upArrowSprite.rotation = 270 * Math.PI / 180;
        this._upArrowSprite.move(q, h / 2);
    };

    Window_MenuStatus.prototype.drawItemImage = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if(bitmap){
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
        } else { // when bitmap is not set, do the original process.
            this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
        }
        this.changePaintOpacity(true);
    };

    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        if(!isDisplayStatus){
            return;
        }
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorLevel(actor, x, y + lineHeight * 1, width);
        this.drawActorClass(actor, x, bottom - lineHeight * 4, width);
        this.drawActorHp(actor, x, bottom - lineHeight * 3, width);
        this.drawActorMp(actor, x, bottom - lineHeight * 2, width);
        this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
    };

    var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function() {
        _Window_MenuActor_initialize.call(this);
        this.y = this.fittingHeight(2);
    };

})();
