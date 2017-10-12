//=============================================================================
// NeedchangeSS.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 戦闘とそれ以外での解像度の変更
 * @author まっつＵＰ
 * 
 * @param width
 * @desc デフォルトの幅
 * @type number
 * @min 1
 * @max 2000
 * @default 816
 * 
 * @param width2
 * @desc 戦闘中の幅
 * @type number
 * @min 1
 * @max 2000
 * @default 816
 * 
 * @param height
 * @desc デフォルトの高さ
 * @type number
 * @min 1
 * @max 2000
 * @default 624
 * 
 * @param height2
 * @desc 戦闘中の高さ
 * @type number
 * @min 1
 * @max 2000
 * @default 624
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * このプラグインを利用する場合は
 * 素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {

var parameters = PluginManager.parameters('NeedchangeSS');
var NSSwidth = Number(parameters['width'] || 816);
var NSSwidth2 = Number(parameters['width2'] || NSSwidth);
var NSSheight = Number(parameters['height'] || 624);
var NSSheight2 = Number(parameters['height2'] || NSSheight);

SceneManager._screenWidth = NSSwidth;
SceneManager._screenHeight = NSSheight;
SceneManager._boxWidth = SceneManager._screenWidth;
SceneManager._boxHeight = SceneManager._screenHeight;

var _SceneManager_goto = SceneManager.goto;
SceneManager.goto = function(sceneClass) {
    if(this._scene){
        if(this._scene.constructor === Scene_Battle){
            SceneManager._screenWidth = NSSwidth;
            SceneManager._screenHeight = NSSheight;
            this._boxWidth = this._screenWidth;
            this._boxHeight = this._screenHeight;
            Graphics.removeAllElements();
            Graphics.initialize();
        }else if(sceneClass === Scene_Battle){
            SceneManager._screenWidth = NSSwidth2;
            SceneManager._screenHeight = NSSheight2;
            this._boxWidth = this._screenWidth;
            this._boxHeight = this._screenHeight;
            Graphics.removeAllElements();
            Graphics.initialize();
        }
    }
    _SceneManager_goto.call(this, sceneClass);
};

    Graphics.removeAllElements = function() {
        document.body.removeChild(this._canvas);
        document.body.removeChild(this._video);
        document.body.removeChild(this._upperCanvas);
        document.body.removeChild(this._errorPrinter);
    };
 
})();
