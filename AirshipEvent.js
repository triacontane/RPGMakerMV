//=============================================================================
// AirshipEvent.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/04/01 Help等の追加
// 1.0.0 ?          初版
//=============================================================================

/*:
 * @plugindesc 飛行船のイベント起動
 * @author s.f.
 *
 * @help 飛行船からイベントに接触して起動します。
 *
 * プライオリティは「通常キャラの下」
 * 　　　トリガーは「プレイヤーから接触」
 * である必要があります。
 *
 * イベントのメモ欄に「AirEvent」を記述します。
 *
 * このプラグインにはプラグインコマンドはありません。
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 */

var Imported = Imported || {};
Imported.airshipEventll = {};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('AirshipEvent');



/* 再定義　*/
  Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
             
               if (event.event().note.indexOf('AirEvent') !== -1){
                   event.start();return;  /*alert(event.event().note);return;*/
               }

               if($gamePlayer.vehicle() === $gameMap.vehicle(2)){
                 return;
               }


               event.start();  /*alert(event.event().note)*/



            }
        });
    }
};





/* 再定義*/
Game_Player.prototype.canStartLocalEvents = function() {
           return  -1; /*!this.isInAirship();*/
};




})();