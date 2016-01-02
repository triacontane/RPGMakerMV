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
 */
//=============================================================================

(function() {

    //var parameters = PluginManager.parameters('PictureOnAnimation');

    //-----------------------------------------------------------------------------
    // Game_Interpreter
    //
    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (command === 'PictureOnAnimation') {
            var pictureId = Number(args[0]);
            var animationId = Number(args[1]);
            var picture = $gameScreen.picture(pictureId);
            picture.requestAnimation(animationId);
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
