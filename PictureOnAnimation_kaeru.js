//=============================================================================
// Plugin - PictureOnAnimation
// PictureOnAnimation.js
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc PictureOnAnimation ピクチャ番号 アニメーションID
 * @author 名無し蛙
 *
 * @help
 * 突発でｔｋったものなのでサポートとかはあまり考えてません
 * 大した事もしていないのでクレジット名表記とかも不要です。好きに改変してくだしあ
 *
 * Version 0.:
 * -
 * 名無し蛙さんとトリアコンタンさんの助けで色々と助かりました。ponidog
 * ponidogの悩むツイートを見て名無し蛙さんがまず作り、トリアコンタンさんのプラグインとの競合が発生したので
 * トリアコンタンさん自ら競合を回避する改修を行いました。それの微調整をしたプラグインです。
* 2016 1/2
 */
//=============================================================================

(function() {

    //var parameters = PluginManager.parameters('PictureOnAnimation');

    //=============================================================================
    // PluginManager
    //  多言語とnullに対応したパラメータの取得を行います。
    //  このコードは自動生成され、全てのプラグインで同じものが使用されます。
//トリアコンタンさんのプラグインから利用しました。ponidog
    //=============================================================================
    PluginManager.getParamBoolean = function(pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return (value || '').toUpperCase() == 'ON';
    };

    PluginManager.getParamOther = function(pluginName, paramEngName, paramJpgName) {
        var value = this.parameters(pluginName)[paramEngName];
        if (value == null) value = this.parameters(pluginName)[paramJpgName];
        return value;
    };

    PluginManager.getParamNumber = function (pluginName, paramEngName, paramJpgName, min, max) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        if (arguments.length <= 3) min = -Infinity;
        if (arguments.length <= 4) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    PluginManager.getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    PluginManager.checkCommandName = function(command, value) {
        return this.getCommandName(command) === value;
    };

    PluginManager.getArgString = function (index, args) {
        return this.convertEscapeCharacters(args[index]);
    };

    PluginManager.getArgNumber = function (index, args, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(this.convertEscapeCharacters(args[index]), 10) || 0).clamp(min, max);
    };

    PluginManager.convertEscapeCharacters = function(text) {4
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    PluginManager.actorName = function(n) {
        var actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : '';
    };

    PluginManager.partyMemberName = function(n) {
        var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : '';
    };


//================================================

    //-----------------------------------------------------------------------------
    // Game_Interpreter
    //
    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (command === 'PictureOnAnimation') {

//            var pictureId = Number(args[0]);
var pictureId = PluginManager.getArgNumber(0, args, 1, $gameScreen.maxPictures() );// 

    //        var animationId = Number(args[1]);
var animationId = PluginManager.getArgNumber(1, args, 1, 119 );//effect数は119個
 
            var picture = $gameScreen.picture(pictureId);
if(picture)  picture.requestAnimation(animationId);//ponidog 変更。ifでnullでない場合のみに実行。エラーを避ける。
        }
        Game_Interpreter_pluginCommand.call(this, command, args);
    };

    //-----------------------------------------------------------------------------
    // Game_Picture
    //
    var Game_Picture_initialize = Game_Picture.prototype.initialize;
    Game_Picture.prototype.initialize = function() {
        Game_Picture_initialize.call(this);
        this.initAnimation();
    };

    Game_Picture.prototype.initAnimation = function(){
        this._animationId = 0;
    };

    Game_Picture.prototype.requestAnimation = function(animationId){
        this._animationId = animationId;
    };

    Game_Picture.prototype.animationId = function(){
        return this._animationId;
    };

    //-----------------------------------------------------------------------------
    // Sprite_PictureAnimation
    //
    function Sprite_PictureAnimation() {
        this.initialize.apply(this, arguments);
    }

    Sprite_PictureAnimation.prototype = Object.create(Sprite_Animation.prototype);
    Sprite_PictureAnimation.prototype.constructor = Sprite_PictureAnimation;

    Sprite_PictureAnimation.prototype.updatePosition = function() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        } else {
            var parent = this._target.parent;
            var grandparent = parent ? parent.parent : null;
            this.x = this._target.x + ((0.5 - this._target.anchor.x) * this._target.width);
            this.y = this._target.y + ((1 - this._target.anchor.y) * this._target.height);

            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
            if (this._animation.position === 0) {
                this.y -= this._target.height;
            } else if (this._animation.position === 1) {
                this.y -= this._target.height / 2;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Sprite_Picture
    //
    var _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        this._animationSprites = [];
        this._effectTarget = this;
        this._hiding = false;
        _Sprite_Picture_initialize.apply(this, arguments);
        this.update();
    };

    var _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        this.updateVisibility();
        _Sprite_Picture_update.apply(this, arguments);
        this.updateAnimationSprites();
        if (this.visible) {
            this.updateAnimation();
        }
    };

    Sprite_Picture.prototype.updateAnimation = function() {
      var picture = this.picture();
      if (picture.animationId() > 0) {
          var animation = $dataAnimations[picture.animationId()];
          this.startAnimation(animation, false, 0);
          picture.initAnimation();
      }
    };

    Sprite_Picture.prototype.hide = function() {
        this._hiding = true;
        this.updateVisibility();
    };

    Sprite_Picture.prototype.show = function() {
        this._hiding = false;
        this.updateVisibility();
    };

    Sprite_Picture.prototype.updateVisibility = function() {
        this.visible = !this._hiding;
    };

    Sprite_Picture.prototype.updateAnimationSprites = function() {
        if (this._animationSprites.length > 0) {
            var sprites = this._animationSprites.clone();
            this._animationSprites = [];
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                if (sprite.isPlaying()) {
                    this._animationSprites.push(sprite);
                } else {
                    sprite.remove();
                }
            }
        }
    };

    Sprite_Picture.prototype.startAnimation = function(animation, mirror, delay) {
        var sprite = new Sprite_PictureAnimation();
        sprite.setup(this._effectTarget, animation, mirror, delay);
        this.parent.addChild(sprite);
        this._animationSprites.push(sprite);
    };

    Sprite_Picture.prototype.isAnimationPlaying = function() {
        return this._animationSprites.length > 0;
    };



})();

//=============================================================================
// End of File
//=============================================================================
