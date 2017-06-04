//=============================================================================
// StateRolling.js
//=============================================================================

/*:
 * @plugindesc アクター側もエネミー同様にステート表示を回転させます。
 * @author 村人C
 *
 * @help
 *
 * 使い方
 * ステートの「メモ欄」に記述
 * <turn_hide>
 * ターン数を非表示に出来ます。
 *
 *
 * プラグインパラメータ：
 *
 * StateRolling
 * <Roll>
 * アイコンの回転速度
 * 数値が小さいほど速くなります。
 *
 * Visible
 * サイドビュー時にステータスウインドウにステートを表示する
 * 有効： on
 * 無効： off
 *
 * TextVisible
 * ステートのターン数を表示する
 * 有効： on
 * 無効： off
 *
 * TextColor
 * ターン数の表示色
 * 色の指定は
 * 英単語：  Red
 * 16進数：  #ff0000
 * RGB：  rgb(255,0,0,0)
 * どのタイプでも使用可能です。
 * RGBは(赤,緑,青,グレー)になります。
 * 他の色については「CSS Color」等で検索して下さい。
 *
 *
 * 仕様
 * ステート座標の設定はサイドビュー専用です。
 * ターン数の座標はサイドビュー、フロントビューどちらも使用可能です。
 * ステートが「自動解除のタイミング：なし」の場合は、ターン数を表示しません。
 *
 *
 * readmeやスタッフロールの明記、使用報告は任意
 *
 *
 * @param Visible
 * @desc サイドビュー時にステータスウインドウにステートを表示する
 * デフォルト: off
 * @default off
 *
 * @param TextVisible
 * @desc ステートのターン数を表示する
 * デフォルト: on
 * @default on
 *
 * @param Roll
 * @desc 回転速度
 * デフォルト: 40
 * @default 40
 *
 * @param x
 * @desc x座標
 * デフォルト: 46
 * @default 46
 *
 * @param y
 * @desc y座標
 * デフォルト: 30
 * @default 30
 *
 * @param TextColor
 * @desc ターン数の文字色
 * デフォルト: #FFFFFF
 * @default #FFFFFF
 *
 * @param TextSize
 * @desc ターン数の文字サイズ
 * デフォルト: 18
 * @default 18
 *
 * @param Text_x
 * @desc ターン数のx座標
 * デフォルト: 0
 * @default 0
 *
 * @param Text_y
 * @desc ターン数のy座標
 * デフォルト: 0
 * @default 0
 *
 */

var StateRolling = StateRolling || {};
StateRolling.Parameters = PluginManager.parameters('StateRolling');
// 初期設定
StateRolling.Roll = [];
StateRolling.Text = [];
StateRolling.Roll[0] = Number(StateRolling.Parameters["Roll"]) || 40;
StateRolling.Roll[1] = Number(StateRolling.Parameters["x"])    || 46;
StateRolling.Roll[2] = Number(StateRolling.Parameters["y"])    || 30;
StateRolling.Roll[3] = StateRolling.Parameters["Visible"] || "on";
StateRolling.Text[0] = StateRolling.Parameters["TextVisible"] || "on";
StateRolling.Text[1] = Number(StateRolling.Parameters["TextSize"]) || 18;
StateRolling.Text[2] = Number(StateRolling.Parameters["Text_x"]) || 0;
StateRolling.Text[3] = Number(StateRolling.Parameters["Text_y"]) || 0;
StateRolling.Text[4] = StateRolling.Parameters["TextColor"] || "#FFFFFF";

(function() {
	// 全てのターン取得
	Game_BattlerBase.prototype.allTurns = function() {
		return this.stateTurns().concat(this.buffTurns());
	};
	// ステートのターン取得
	Game_BattlerBase.prototype.stateTurns = function() {
		var states = this.states().map(function(state) {
			return state;
		}).filter(function(state) {
			return state.iconIndex > 0;
		});
		var state = [];
		states.forEach(function(sta) {
			if (sta.meta.turn_hide) {
				state.push(0);
			} else if (sta.autoRemovalTiming > 0) {
				state.push(this._stateTurns[sta.id]-1);
			} else {
				state.push(0);
			}
		}, this);
		return state;
	};
	// 強化のターン取得
	Game_BattlerBase.prototype.buffTurns = function() {
		var turns = [];
		for (var i = 0; i < this._buffs.length; i++) {
			if (this._buffs[i] !== 0) {
				turns.push(this._buffTurns[i]);
			}
		}
		return turns;
	};
	// 回転速度
	var Sprite_StateIcon_animationWait_StateRolling = Sprite_StateIcon.prototype.animationWait;
	Sprite_StateIcon.prototype.animationWait = function() {
		Sprite_StateIcon_animationWait_StateRolling.call(this);
		return StateRolling.Roll[0];
	};
	// アイコンの更新
	var Sprite_StateIcon_updateIcon_StateRolling = Sprite_StateIcon.prototype.updateIcon;
	Sprite_StateIcon.prototype.updateIcon = function() {
		if (this._battler && this._battler.isActor()) {
			var icons = [];
			icons = this._battler.allIcons();
			if (icons.length > 0) {
				this._animationIndex++;
				if (this._animationIndex >= icons.length) {
					this._animationIndex = 0;
				}
				this._iconIndex = icons[this._animationIndex];
			} else {
				this._animationIndex = 0;
				this._iconIndex = 0;
			}
		} else {
			return Sprite_StateIcon_updateIcon_StateRolling.call(this);
		}
	};
	// メンバーの初期化
	var Sprite_StateIcon_initMembers_StateRolling = Sprite_StateIcon.prototype.initMembers;
	Sprite_StateIcon.prototype.initMembers = function() {
		Sprite_StateIcon_initMembers_StateRolling.call(this);
		this._turnIndex = 0;
		this._sprite = new Sprite();
		this.addChild(this._sprite);
	};
	// アイコンのセット
	var Sprite_StateIcon_updateFrame_StateRolling = Sprite_StateIcon.prototype.updateFrame;
	Sprite_StateIcon.prototype.updateFrame = function() {
		Sprite_StateIcon_updateFrame_StateRolling.call(this);
		if (StateRolling.Text[0] === "on") { // ターン表示フラグ
			if (this._battler) {
				var turns = this._battler.allTurns();
				if (turns.length > 0) {
					this._turnIndex = turns[this._animationIndex]; // ターン数の取得
					this._sprite.bitmap = null; // 初期化
					if (this._turnIndex > 0) {
						var bitmap = new Bitmap(Sprite_StateIcon._iconWidth, Sprite_StateIcon._iconHeight);
						bitmap.fontSize = StateRolling.Text[1];
						bitmap.textColor = StateRolling.Text[4];
						bitmap.drawText(this._turnIndex, StateRolling.Text[2], (-6 + StateRolling.Text[3]), bitmap.width, bitmap.height, 'center');
						this._sprite.bitmap = bitmap; // 表示
			}}}
		}
	};
	// ステートスプライトの作成
	var Sprite_Actor_createStateSprite_StateRolling = Sprite_Actor.prototype.createStateSprite;
	Sprite_Actor.prototype.createStateSprite = function() {
		Sprite_Actor_createStateSprite_StateRolling.call(this);
		this._stateIconSprite = new Sprite_StateIcon();
		this._stateIconSprite.x = StateRolling.Roll[1];
		this._stateIconSprite.y = -Math.round((384 + StateRolling.Roll[2]) * 0.1);
		this.addChild(this._stateIconSprite);
	};
	// アクターのセット
	var Sprite_Actor_setBattler_StateRolling = Sprite_Actor.prototype.setBattler;
	Sprite_Actor.prototype.setBattler = function(battler) {
		Sprite_Actor_setBattler_StateRolling.call(this, battler)
		this._stateIconSprite.setup(battler); // 追加
	};
	// ステートアイコンの表示
	var Window_BattleStatus_drawActorIcons_StateRolling = Window_BattleStatus.prototype.drawActorIcons;
	Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
		if (!$gameSystem.isSideView()) { // サイドビュー判定
			if (this._stateIconSprite === undefined) {this._stateIconSprite = [];}
			if (this._stateIconSprite[actor.index()] === undefined) {
				this._stateIconSprite[actor.index()] = new Sprite_StateIcon();
				this._stateIconSprite[actor.index()].x = x + (Window_Base._iconWidth * 0);
				this._stateIconSprite[actor.index()].y = y + 2 + Window_Base._iconWidth;
				this.addChild(this._stateIconSprite[actor.index()]);
				this._stateIconSprite[actor.index()].setup(actor);
			}
		} else {
			if (StateRolling.Roll[3] === "on") { return Window_BattleStatus_drawActorIcons_StateRolling.call(this, actor, x, y, width); }
		}
	};	
})();