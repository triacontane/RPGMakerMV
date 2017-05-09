//=============================================================================
// drowsepost Plugins - Map Zooming Controller
// DP_MapZoom.js
// Version: 0.511
// https://github.com/drowsepost/rpgmaker-mv-plugins/blob/master/DP_MapZoom.js
//=============================================================================

var Imported = Imported || {};
Imported.DP_MapZoom = true;

var drowsepost = drowsepost || {};

//=============================================================================
/*:
 * @plugindesc Control the magnification of the map scene.
 * @author drowsepost
 *
 * @param Base Scale
 * @desc Set the basic magnification ratio.(Start up)
 * Default: 1 (0 or more)
 * @default 1
 *
 * @param Encount Effect
 * @desc Corrected code of encounter effect
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @param Camera Controll
 * @desc camera control during magnification processing
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @param Weather Patch
 * @desc Change weather sprite generation range
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @param Use Hack
 * @desc Fix problem on the RPG Maker MV native code
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @help
 * ============================================================================
 * About
 * ============================================================================
 * It controls the enlargement ratio of the map scene by
 * reflecting the calculation of the enlargement ratio
 * to various coordinate processing.
 * (sorry... english support is immature. by drowsepost)
 * 
 * ============================================================================
 * How To Use
 * ============================================================================
 * plugin command: 
 * mapSetZoom {zoom ratio} {animate frames} {event id or "this" or "player"}
 * 
 * e.g.:
 * mapSetZoom 0.8 360 this
 * -> zoom out to 0.8x , animate 360 frames, centering to event of called
 * 
 * mapSetZoom 1
 * -> zoom to 1x(reset), Immediate
 * 
 * mapSetZoom 3 60 1
 * -> zoom to 3x , animate 60 frames, centering to Event id:001
 * 
 * if you need setting to Default Magnification on the map,
 * fill in the following in the "Note" field
 * <zoomScale:{zoom ratio}>
 * 
 * e.g.:
 * <zoomScale:0.5>
 * -> zoom out to 0.5x , Immediate
 * 
 * ============================================================================
 * Technical information
 * ============================================================================
 * If "screenX" or "screenY" used by another plugin is misaligned,
 * multiply "screenX" or "screenY" by "$gameScreen.zoomScale()".
 * 
 * This plugin controls "$gameScreen"
 * 
 * license: MIT
 * 
 */
 /*:ja
 * @plugindesc マップの拡大率を制御します。
 * @author drowsepost
 *
 * @param Base Scale
 * @desc 基本の拡大率を設定します。(0以上)
 * Default: 1
 * @default 1
 *
 * @param Encount Effect
 * @desc エンカウントエフェクトに拡大率を反映
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @param Camera Controll
 * @desc 拡大処理中のカメラ制御をこのプラグインが行う
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @param Weather Patch
 * @desc 天候スプライトの生成範囲を広げる修正を適用します。
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @param Use Hack
 * @desc 画面拡大率変更時に画面にゴミが残る問題への対応を行う。
 * Default: true (ON: true / OFF: false)
 * @default true
 *
 * @help
 * ============================================================================
 * About
 * ============================================================================
 * 各種座標処理に拡大率の計算を反映し
 * マップシーンの拡大率を制御します。
 * 
 * ============================================================================
 * How To Use
 * ============================================================================
 * マップのメモ欄に対して
 * <zoomScale:0.5>
 * などと記述すると、マップごとに基準になる拡大率を指定することが出来ます。
 * 
 * プラグインコマンドにて
 * mapSetZoom {倍率} {変更にかけるフレーム数} {対象イベントID / this / player}
 * 
 * を呼ぶと、
 * 指定したイベントの位置を中心にゲーム中で画面の拡大率を変更できます。
 * 
 * 例)
 * プラグインコマンドにおいて対象イベントの部分に
 * 「this」もしくは「このイベント」と指定すると、
 * イベント実行中のオブジェクトを指定します。
 * mapSetZoom 2 360 this
 * たとえば上記はそのイベントを中心にして6秒かけて2倍の拡大率に変化します。
 * 
 * ============================================================================
 * Settings
 * ============================================================================
 * Base Scale
 * ゲーム開始時の拡大倍率を指定します。
 * 倍率には0以上を指定してください。
 * 
 * Encount Effect
 * エンカウントエフェクトを置き換えるかどうかを指定します。
 * オリジナルのエフェクトで置き換えている場合はこちらをfalseにしてください。
 * しかしその場合、画面の拡大率をそれぞれ反映できるように調整する必要があります。
 * 
 * Camera Controll
 * falseの場合はイベントを指定した拡大を含む拡大中のカメラ制御は動作しません。
 * 別プラグインでカメラ制御を行う場合にご利用ください。
 * 
 * Weather Patch
 * trueの場合、天候スプライトの生成範囲に関する修正を行い、
 * 拡大率変更後も天候スプライトをまんべんなく分布させます
 * 別プラグインで天候演出の制御を行っている場合等はfalseにしてください。
 * 
 * Use Hack
 * trueの場合マップサイズ変更時に古いオブジェクトが画面に残ってしまうバグを解決します。
 * Tilemap内のBitmapを使いまわす変更をしている場合はfalseにしてください。
 * 
 * ============================================================================
 * Technical information
 * ============================================================================
 * 現在の画面の拡大率は$gameScreen.zoomScale()で取得できます。
 * これはプラグインの利用に関わらず元から存在する関数です。
 * 他のプラグインで利用する「screenX」や「screenY」がずれる場合は、
 * 「screenX」や「screenY」にそれぞれ$gameScreen.zoomScale()を掛けて下さい。
 * 
 * このプラグインは$gameScreenを制御します。
 * 
 * 指定された拡大率設定は$gameMap._dp_scaleが保持します。
 * シーン離脱時のスクロール量は$gameMap._dp_panが保持します。
 * 
 * ライセンス: MIT
 * 
 */
(function() {
    "use strict";
    var parameters = PluginManager.parameters('DP_MapZoom');
    var user_scale = Number(parameters['Base Scale'] || 1);
    var user_fix_encount = Boolean(parameters['Encount Effect'] === 'true' || false);
    var user_fix_deephack = Boolean(parameters['Use Hack'] === 'true' || false);
    var user_use_camera = Boolean(parameters['Camera Controll'] === 'true' || false);
    var user_fix_weather = Boolean(parameters['Weather Patch'] === 'true' || false);

    /*
    Bug fix
    TilemapのwidthやtileWidthを変更するたびにセッターにより_createLayersが呼ばれるが
    addChildした_lowerLayerおよび_upperLayerがremoveされないため
    参照できないゴミオブジェクトがcanvasに増えてゆくのでお掃除
    */
    (function(){
        if(!user_fix_deephack) return;
        var _Tilemap_createLayers = Tilemap.prototype._createLayers;
        Tilemap.prototype._createLayers = function() {
            if('_lowerLayer' in this) this.removeChild(this._lowerLayer);
            if('_upperLayer' in this) this.removeChild(this._upperLayer);
            _Tilemap_createLayers.call(this);
        };
    }());
    
    /*
    renderSize
    =============================================================================
    タイル拡大率を保持および仮想的なレンダリング範囲を算出します。
    */
    var renderSize = {
        _scale : 1,
        width: Graphics.boxWidth,
        height: Graphics.boxHeight,
    };
    
    Object.defineProperty(renderSize, 'scale', {
        get: function() {
            return this._scale;
        },
        set: function(val) {
            if(val != this._scale) {
                this._scale = Number(val);
                this.width = Math.ceil(Graphics.boxWidth / this._scale);
                this.height = Math.ceil(Graphics.boxHeight / this._scale);
            }
        }
    });
    
    /*
    Game Map
    =============================================================================
    拡大率の反映
    */
    (function(){
        var _Game_Map_initialize = Game_Map.prototype.initialize;
        Game_Map.prototype.initialize = function() {
            _Game_Map_initialize.call(this);
            
            //保存用変数エントリー
            this._dp_scale = user_scale;
            this._dp_pan = {'x': 0, 'y': 0};
        };
        
        Game_Map.prototype.screenTileX = function() {
            return Graphics.width / (this.tileWidth() * $gameScreen.zoomScale());
        };
        
        Game_Map.prototype.screenTileY = function() {
            return Graphics.height / (this.tileHeight() * $gameScreen.zoomScale());
        };
        
        Game_Map.prototype.canvasToMapX = function(x) {
            var tileWidth = this.tileWidth() * $gameScreen.zoomScale();
            var originX = this._displayX * tileWidth;
            var mapX = Math.floor((originX + x) / tileWidth);
            return this.roundX(mapX);
        };

        Game_Map.prototype.canvasToMapY = function(y) {
            var tileHeight = this.tileHeight() * $gameScreen.zoomScale();
            var originY = this._displayY * tileHeight;
            var mapY = Math.floor((originY + y) / tileHeight);
            return this.roundY(mapY);
        };
        
    }());
    
    /*
    Game Player
    =============================================================================
    拡大率の反映
    */
    (function(){
        Game_Player.prototype.centerX = function() {
            return ($gameMap.screenTileX() - 1) / 2.0;
        };
        
        Game_Player.prototype.centerY = function() {
            return ($gameMap.screenTileY() - 1)  / 2.0;
        };
        
    }());
    
    /*
    ScreenSprite
    =============================================================================
    描画反映変更に伴うスクリーンスプライトのプライオリティー調整(YEP_CoreEngine互換)
    */
    (function(){
        var _ScreenSprite_initialize = ScreenSprite.prototype.initialize;
        ScreenSprite.prototype.initialize = function() {
            _ScreenSprite_initialize.call(this);
            if('YEP_CoreEngine' in Imported) return;
            if(Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= '1.3.0') return;
            this.scale.x = Graphics.boxWidth * 10;
            this.scale.y = Graphics.boxHeight * 10;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.x = 0;
            this.y = 0;
        };
    }());
    
    /*
    Spriteset
    =============================================================================
    描画反映変更機能の追加
    */
    (function(){
        //天候スプライトの生成範囲をGraphic基準ではなく実際の描画範囲に合わせる
        if(!user_fix_weather) return;
        var _Spriteset_Map_createWeather = Spriteset_Map.prototype.createWeather;
        Spriteset_Map.prototype.createWeather = function() {
            _Spriteset_Map_createWeather.call(this);
            this._weather._rebornSprite = function(sprite) {
                sprite.ax = Math.randomInt(renderSize.width + 100) - 50 + this.origin.x;
                sprite.ay = Math.randomInt(renderSize.height + 200) - 100 + this.origin.y;
                sprite.opacity = 160 + Math.randomInt(60);
            };
        };
        
    }());
    
    /*
    Scene_Map
    =============================================================================
    拡大率の引継ぎ
    */
    (function(){
        /*
        マップシーンの開始
        */
        var _Scene_Map_start = Scene_Map.prototype.start;
        Scene_Map.prototype.start = function() {
            _Scene_Map_start.call(this);
            
            //移動後処理
            if(this._transfer) {
                //マップ設定情報で拡大率変更
                $gameMap._dp_scale = Number($dataMap.meta.zoomScale || $gameMap._dp_scale);
            }
            
            //マップシーン開始時に拡大率変更をフック。
            //移動後の場合、パンをリセット
            $gameMap._dp_pan = this._transfer ? {'x': 0, 'y': 0} : $gameMap._dp_pan;
            dp_setZoom($gameMap._dp_scale);
        };
        
        /*
        マップシーンの終了
        */
        var _Scene_Map_terminate = Scene_Map.prototype.terminate;
        Scene_Map.prototype.terminate = function() {
            //マップシーン終了時に拡大率情報を保存。
            zoomAnim.end();
            $gameScreen.setZoom(0, 0, renderSize.scale);
            $gameMap._dp_pan = dp_getpan();
            
            _Scene_Map_terminate.call(this);
        };
        
        /*
        エンカウントエフェクト
        置き換える場合は画面位置の変更前に $gameMap._dp_pan = dp_getpan($gameMap._dp_scale); を呼んでください
        */
        if(!user_fix_encount) return;
        var encount_effect_started = false;
        Scene_Map.prototype.updateEncounterEffect = function() {
            if (this._encounterEffectDuration <= 0) return;
            
            //パン状態を保存
            if (!encount_effect_started) {
                zoomAnim.end();
                $gameMap._dp_pan = dp_getpan($gameMap._dp_scale);
                encount_effect_started = true;
            }
            
            this._encounterEffectDuration--;
            var speed = this.encounterEffectSpeed();
            var n = speed - this._encounterEffectDuration;
            var p = n / speed;
            
            var q = Math.max( ((p * 20 * p + 5) * p + $gameMap._dp_scale), $gameMap._dp_scale );//変更部分。エンカウントエフェクトにオリジナル拡大率反映
            var zoomX = $gamePlayer.screenX();
            var zoomY = $gamePlayer.screenY();
            
            if (n === 2) {
                $gameScreen.setZoom(0, 0, $gameMap._dp_scale);//変更部分。オリジナル拡大率反映
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
            
        };
        //エンカウントエフェクトここまで
        
    }());
    
    /*
    Game_Screen
    =============================================================================
    拡大アニメーション処理のフック
    */
    (function(){
        var _Game_Screen_update = Game_Screen.prototype.update;
        Game_Screen.prototype.update = function() {
            _Game_Screen_update.call(this);
            zoomAnim.update();
        };
    }());
    
    /*
    Main Functions
    =============================================================================
    実際の拡大処理
    */
    var dp_getpan = function() {
        var centerPosX = (($gameMap.screenTileX() - 1) / 2);
        var centerPosY = (($gameMap.screenTileY() - 1) / 2);
        
        var pan_x = ($gameMap.displayX() + centerPosX) - $gamePlayer._realX;
        var pan_y = ($gameMap.displayY() + centerPosY) - $gamePlayer._realY;
        
        return {
            'x': ($gameMap.screenTileX() >= $dataMap.width )? 0 : pan_x,
            'y': ($gameMap.screenTileY() >= $dataMap.height )? 0 : pan_y,
        };
    };
    
    var dp_changeRenderSize = function(scale) {
        if(!('_scene' in SceneManager)) return;
        if(!('_spriteset' in SceneManager._scene)) return;
        var spriteset = SceneManager._scene._spriteset;
        
        /*
        拡大率からレンダリングするべきマップのサイズを設定します。
        */
        spriteset._tilemap.width = Math.ceil((Graphics.width + spriteset._tilemap._margin) * 2 / scale);
        spriteset._tilemap.height = Math.ceil((Graphics.height + spriteset._tilemap._margin) * 2 / scale);
        spriteset._tilemap.refresh();
        
        //パララックスサイズ変更
        spriteset._parallax.move(0, 0, Math.round(Graphics.width / scale), Math.round(Graphics.height / scale));

        // Foreground.jsとの競合対応
        if (spriteset._foreground) {
            spriteset._foreground.move(0, 0, Math.round(Graphics.width / scale), Math.round(Graphics.height / scale));
        }
        
        /*
        実体スクリーンサイズを算出
        */
        renderSize.scale = scale;
    };
    
    var dp_setZoom = function(scale) {
        dp_changeRenderSize(scale);
        $gameMap._dp_scale = scale;
        
        $gameScreen.setZoom(0, 0, scale);
        camera.center();
    };
    
    var zoomAnim = (function(){
        var _active = false;
        var _duration = 0;
        var _target = 1;
        var _target_pan = {
            'x': 0,
            'y': 0,
        };
        var r = {
            start : (function(scale, pos, duration) {
                var is_zoomout = ($gameMap._dp_scale > scale)? true : false;
                
                _target = scale || $gameMap._dp_scale;
                _duration = duration || 0;
                
                _target_pan = pos || _start_pan;
                
                if(is_zoomout) {
                    dp_changeRenderSize(scale);
                    camera.center();
                } else {
                    $gameMap._dp_scale = scale;
                }
                
                _active = true;
            }),
            update: (function() {
                if(!_active) return;
                if(_duration < 1) {
                    r.end();
                    return;
                }
                
                var d = _duration;
                var t = _target;
                $gameMap._dp_pan.x = (($gameMap._dp_pan.x * (d - 1) + _target_pan.x) / d);
                $gameMap._dp_pan.y = (($gameMap._dp_pan.y * (d - 1) + _target_pan.y) / d);
                
                $gameScreen.setZoom(0, 0, (($gameScreen._zoomScale * (d - 1) + t) / d));
                camera.center();
                
                _duration--;
            }),
            end : (function() {
                if(!_active) return;
                _active = false;
                _duration = 0;
                $gameMap._dp_pan = _target_pan;
                dp_setZoom(_target);
            })
        };
        
        return r;
    }());
    
    var camera = {};
    camera.zoom = function(ratio, duration, target) {
        if(typeof ratio !== 'number') return;
        zoomAnim.end();
        
        $gameMap._dp_pan = dp_getpan($gameMap._dp_scale);
        var target_pan = $gameMap._dp_pan;
        
        if(duration > 0){
            if(typeof target !== 'undefined') {
                target_pan = camera.target(target);
            }
            zoomAnim.start(ratio, target_pan, duration);
        } else {
            if(typeof target !== 'undefined') {
                $gameMap._dp_pan = camera.target(target);
            }
            dp_setZoom(ratio);
        }
    };
    
    camera.target = function(event) {
        var _target;
        if(typeof event === 'object') {
            if('_eventId' in event) _target = $gameMap.event(event._eventId);
        }
        
        if(typeof event === 'number') {
            _target = $gameMap.event(event);
        }
        
        if(!(_target instanceof Game_CharacterBase)) {
            _target = $gamePlayer;
        }
        
        return {
            'x': _target._realX - $gamePlayer._realX,
            'y': _target._realY - $gamePlayer._realY,
        };
    };
    
    camera.center = function(panX, panY) {
        if(!user_use_camera) return;
        var px = Number(panX || $gameMap._dp_pan.x);
        var py = Number(panY || $gameMap._dp_pan.y);
        $gamePlayer.center($gamePlayer._realX + px, $gamePlayer._realY + py);
    };
    
    /*
    Interface Entry
    ===================================================================================
    */
    drowsepost.camera = camera;
    
    drowsepost.setZoom = function(ratio, duration, target) {
        camera.zoom(ratio, duration, target);
    };
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        (function(_s, _c, _a){
            if (_c !== 'mapSetZoom') return;
            
            var _target;
            if(_a.length > 2) {
                if((_a[2] === 'this') || (_a[2] === 'このイベント')) _target = _s;
                else if((_a[2] === 'player') || (_a[2] === 'プレイヤー')) _target = $gamePlayer;
                else _target = Number(_a[2]);
            }
            
            drowsepost.setZoom(Number(_a[0]), Number(_a[1]), _target);
        }(this, command, args));
        
    }
    
}());
