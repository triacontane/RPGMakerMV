//=============================================================================
// NeedchangeSS_re.js
// Version : 5.01
// -----------------------------------------------------------------------------
// [Version]
// 1.00 2017/10/04 PC⇔スマホ／戦闘時の解像度変更に対応
// 2.00 2017/10/05 タイトル画面の解像度変更に対応
// 3.00 2017/10/05 メニュー画面の解像度変更に対応
// 4.00 2017/10/06 プラグインコマンドに対応
// 5.01 2017/10/06 フォントサイズの変更を追加
//=============================================================================
/*:ja
 * @plugindesc 各種画面の解像度変更／フォントサイズ変更を行います。
 * @author rainxxrain
 * 
 * @param PC Width
 * @desc PCの解像度（横）
 * デフォルトは 816
 * @default 816
 *
 * @param PC Height
 * @desc PCの解像度（縦）
 * デフォルトは 624
 * @default 624
 *
 * @param Phone Width
 * @desc スマホでの解像度（横）
 * @default 816
 *
 * @param Phone Height
 * @desc スマホでの解像度（縦）
 * @default 624
 *
 * @param Battle Width
 * @desc 戦闘中の幅
 * @type number
 * @min 1
 * @max 2000
 * @default 816
 * 
 * @param Battle Height
 * @desc 戦闘中の高さ
 * @type number
 * @min 1
 * @max 2000
 * @default 624
 *
 * @param Title Width
 * @desc タイトル画面の幅
 * @type number
 * @min 1
 * @max 2000
 * @default 816
 * 
 * @param Title Height
 * @desc タイトル画面の高さ
 * @type number
 * @min 1
 * @max 2000
 * @default 624
 *
 * @param Menu Width
 * @desc メニュー画面の幅
 * @type number
 * @min 1
 * @max 2000
 * @default 816
 * 
 * @param Menu Height
 * @desc メニュー画面の高さ
 * @type number
 * @min 1
 * @max 2000
 * @default 624
 *
 * @param Font Size
 * @desc デフォルトのフォントサイズ
 * @type number
 * @default 28
 * 
 * @help
 * スマホと認識するのは、iPhone、iPad、Androidです。
 * 
 * -------------------------------
 * プラグインコマンドの使い方：
 * -------------------------------
 * 例）解像度「600x800」に変更したいとき
 *   CHNAGE_RESOLUTION 600 800:
 * 
 * プラグインコマンドで
 * [CHNAGE_RESOLUTION(コマンド名)] [幅] [高さ]:
 * と記述することで、マップ上でデフォルト解像度を変更することができます。
 * 
 * -------------------------------
 * 例）フォントを「24px」に変更したいとき
 *   FONT_SIZE 24:
 * 
 * プラグインコマンドで
 * [FONT_SIZE(コマンド名)] [サイズ(px)]:
 * と記述することで、フォントを変更することができます。
 * （画面の解像度を変更することで文字がはみ出る場合に、
 *   フォントサイズを同時に調整できます。）
 * -------------------------------
 * 
 * ベースプラグイン作成者様：
 * 　まっつＵＰ様（NeedchangeSS.js）
 * 　ぶちょー様（KZR_ScreenSizePCorNot.js）
 * 　月雨 春人様（FontCustom.js）
 * 
 * 免責事項：
 * 本プラグインのご利用は、自己責任にてお願いいたします。
 */

(function() {

    var parameters   = PluginManager.parameters('NeedchangeSS_re');
    var PC_Width     = Number(parameters['PC Width'] || 816);
    var PC_Height    = Number(parameters['PC Height'] || 624);
    var Phone_Width  = Number(parameters['Phone Width'] || 816);
    var Phone_Height = Number(parameters['Phone Height'] || 624);
    var BattleWidth  = Number(parameters['Battle Width'] || 816);
    var BattleHeight = Number(parameters['Battle Height'] || 624);
    var TitleWidth   = Number(parameters['Title Width'] || 816);
    var TitleHeight  = Number(parameters['Title Height'] || 624);
    var MenuWidth    = Number(parameters['Menu Width'] || 816);
    var MenuHeight   = Number(parameters['Menu Height'] || 624);
    var font_size    = Number(parameters['Font Size'] || 28);
    var NSSstretch   = parameters['stretch'] === 'true';

// PCとスマホで、デフォルト解像度を分ける
    var ua        = navigator.userAgent.toLowerCase();
    var isiPhone  = (ua.indexOf('iphone') > -1);
    var isiPad    = (ua.indexOf('ipad') > -1);
    var isAndroid = (ua.indexOf('android') > -1);
    if (isiPhone || isiPad || isAndroid) {
        var screenWidth  = Phone_Width;
        var screenHeight = Phone_Height;
    } else {
        var screenWidth  = PC_Width;
        var screenHeight = PC_Height;
    }

//=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[CHNAGE_RESOLUTION]などを追加定義します。
    //=============================================================================

    // プラグインコマンドの取得
    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pictureId, touchParam, trigger, variableNum, transparent;
        switch (getCommandName(command)) {
            case 'CHNAGE_RESOLUTION' :

                // コマンドパラメータから幅×高さを取得
                screenWidth  = getArgNumber(args[0], 1);
                screenHeight = getArgNumber(args[1], 1);

                //プレイヤーの移動
                if (NSSstretch) Graphics._switchStretchMode();
                $gamePlayer.reserveTransfer(
                    $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);

                return;
            case 'FONT_SIZE' :
                // コマンドパラメータからフォントサイズを取得
                font_size = getArgNumber(args[0], 1);
                return;
        }
    };

//=============================================================================
// SceneManager
//   解像度の変更
//=============================================================================

// デフォルト値設定
    SceneManager._screenWidth  = screenWidth;
    SceneManager._screenHeight = screenHeight;
    SceneManager._boxWidth     = SceneManager._screenWidth;
    SceneManager._boxHeight    = SceneManager._screenHeight;
    var _SceneManager_goto     = SceneManager.goto;
    SceneManager.goto          = function(sceneClass) {
        if (this._scene) {
            if (sceneClass === Scene_Title) {
                // タイトル画面の解像度
                this.NSSreso(TitleWidth, TitleHeight);
            } else if (sceneClass === Scene_Battle) {
                // 戦闘時の解像度
                this.NSSreso(BattleWidth, BattleHeight);
            } else if (sceneClass === Scene_Menu ||
                sceneClass === Scene_Item ||
                sceneClass === Scene_Skill ||
                sceneClass === Scene_Equip ||
                sceneClass === Scene_Status ||
                sceneClass === Scene_Save ||
                sceneClass === Scene_Load ||
                sceneClass === Scene_Options ||
                sceneClass === Scene_GameEnd) {
                // メニュー画面の解像度
                this.NSSreso(MenuWidth, MenuHeight);
            } else if (this._scene.constructor === Scene_Battle) {
                // 戦闘終了後、通常時の解像度に戻す
                this.NSSreso(screenWidth, screenHeight);
            } else {
                // 通常時の解像度
                this.NSSreso(screenWidth, screenHeight);
            }
        }
        _SceneManager_goto.call(this, sceneClass);
    };

    SceneManager.NSSreso = function(bw, bh) {
        if (this._screenWidth === bw && this._screenHeight === bh) {
            return;
        }
        this._screenWidth  = bw;
        this._screenHeight = bh;
        this._boxWidth     = this._screenWidth;
        this._boxHeight    = this._screenHeight;
        Graphics.resize(bw, bh);
    };

    Graphics.resize = function(width, height) {
        this._width     = width;
        this._height    = height;
        this._boxWidth  = this._width;
        this._boxHeight = this._height;
        this._renderer.resize(this._width, this._height);
        this._updateAllElements();
    };

    //=============================================================================
// フォントサイズの変更処理
//=============================================================================

    Window_Base.prototype.standardFontSize = function() {
        return font_size;
    };

})();
 
