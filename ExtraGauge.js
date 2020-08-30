/*=============================================================================
 ExtraGauge.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0,1 2020/08/30 非表示のときは画像を更新しないよう修正
 1.0.0 2020/08/29 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 汎用ゲージ追加プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ExtraGauge.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param GaugeList
 * @text ゲージリスト
 * @desc 各画面に追加するゲージのリストです。
 * @default []
 * @type struct<Gauge>[]
 *
 * @help ExtraGauge.js
 *
 * 各画面に追加で任意のゲージを好きなだけ表示できます。
 * 現在値や最大値を変数、スクリプトから指定すれば、あとは値の変動に応じて
 * 自動的にゲージが増減します。
 *
 * ゲージは、マップ画面と戦闘画面ではピクチャの上かつウィンドウの下に、
 * それ以外の画面ではウィンドウの上に表示されます。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Gauge:
 *
 * @param SceneName
 * @text 対象シーン
 * @desc 追加対象のシーンです。オリジナルのシーンを対象にする場合はシーンクラス名を直接記入します。
 * @type select
 * @default Scene_Title
 * @option タイトル
 * @value Scene_Title
 * @option マップ
 * @value Scene_Map
 * @option ゲームオーバー
 * @value Scene_Gameover
 * @option バトル
 * @value Scene_Battle
 * @option メインメニュー
 * @value Scene_Menu
 * @option アイテム
 * @value Scene_Item
 * @option スキル
 * @value Scene_Skill
 * @option 装備
 * @value Scene_Equip
 * @option ステータス
 * @value Scene_Status
 * @option オプション
 * @value Scene_Options
 * @option セーブ
 * @value Scene_Save
 * @option ロード
 * @value Scene_Load
 * @option ゲーム終了
 * @value Scene_End
 * @option ショップ
 * @value Scene_Shop
 * @option 名前入力
 * @value Scene_Name
 * @option デバッグ
 * @value Scene_Debug
 *
 * @param Id
 * @text 識別子
 * @desc ゲージの識別子です。特に使用されませんが、分かりやすい名称を設定すると管理がしやすくなります。
 * @default gauge01
 *
 * @param SwitchId
 * @text 表示スイッチID
 * @desc 指定したスイッチがONの場合のみ画面に表示されます。0を指定すると常に表示されます。
 * @default 0
 * @type switch
 *
 * @param OpacityVariable
 * @text 不透明度変数ID
 * @desc 不透明度を取得する変数番号です。0を指定すると常に不透明度255で表示されます。
 * @default 0
 * @type variable
 *
 * @param Layout
 * @text レイアウト
 * @desc ゲージの表示座標と幅、高さです。スクリプトを使用する場合、変数witch, heightでUIエリアの幅と高さを取得できます。
 * @type struct<Layout>
 * @default {"x":"width / 2","y":"30","width":"width * 0.8","height":"36","GaugeX":"0","GaugeHeight":"0","Vertical":"false"}
 *
 * @param CurrentMethod
 * @text 現在値取得方法
 * @desc ゲージの現在値を取得する方法です。変数、スクリプトのいずれかを設定します。
 * @default {"VariableId":"1","Script":"","FixedValue":""}
 * @type struct<Method>
 *
 * @param MaxMethod
 * @text 最大値取得方法
 * @desc ゲージの最大値を取得する方法です。変数、スクリプト、固定値のいずれかを設定します。
 * @default {"VariableId":"0","Script":"","FixedValue":"100"}
 * @type struct<Method>
 *
 * @param Detail
 * @text 詳細設定
 * @desc ゲージの配置や色などの細かい設定です。
 * @type struct<Detail>
 * @default
 *
 * @param LowerPicture
 * @text 下ピクチャ
 * @desc ゲージの下に表示されるピクチャです。ゲージの中心と画像の中心が合わせて表示されます。
 * @default
 * @type struct<Picture>
 *
 * @param UpperPicture
 * @text 上ピクチャ
 * @desc ゲージの上に表示されるピクチャです。ゲージの中心と画像の中心が合わせて表示されます。
 * @default
 * @type struct<Picture>
 *
 * @param Battler
 * @text バトラー情報
 * @desc ゲージの主体となるバトラー情報の参照方法を指定します。現在値、最大値をスクリプトで決める場合のみ使用します。
 * @default
 * @type struct<Battler>
 */

/*~struct~Layout:
 *
 * @param x
 * @text X座標
 * @desc X座標です。原点は中央です。数値以外を指定した場合はスクリプトとして評価します。
 * @default width / 2
 *
 * @param y
 * @text Y座標
 * @desc Y座標です。原点は中央です。数値以外を指定した場合はスクリプトとして評価します。
 * @default 30
 *
 * @param width
 * @text 横幅
 * @desc 横幅です。数値以外を指定した場合はスクリプトとして評価します。
 * @default width * 0.8
 *
 * @param height
 * @text 高さ
 * @desc 高さです。数値以外を指定した場合はスクリプトとして評価します。
 * @default 36
 *
 * @param GaugeX
 * @text ゲージX座標
 * @desc ゲージのX座標です。ラベルが長い文字の場合は変更してください。
 * @default 0
 *
 * @param GaugeHeight
 * @text ゲージ高さ
 * @desc ゲージの高さです。0を指定すると全体の高さに合わせられます。
 * @default 0
 *
 * @param Vertical
 * @text 縦ゲージ
 * @desc 有効にすると縦方向ゲージになります。ラベルなども縦方向になるので注意してください。
 * @default false
 * @type boolean
 */

/*~struct~Picture:
 *
 * @param FileName
 * @text ファイル名
 * @desc ピクチャのファイル名です。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param OffsetX
 * @text X座標補正値
 * @desc X座標の補正値です。
 * @default 0
 * @type number
 * @min -9999
 *
 * @param OffsetY
 * @text Y座標補正値
 * @desc Y座標の補正値です。
 * @default 0
 * @type number
 * @min -9999
 */

/*~struct~Method:
 *
 * @param VariableId
 * @text 取得変数ID
 * @desc ゲージの値を取得する変数番号です。スクリプトより優先して参照されます。
 * @default 0
 * @type variable
 *
 * @param Script
 * @text 取得スクリプト
 * @desc ゲージの値を取得するスクリプトです。固定値より優先して参照されます。
 * @default
 * @type combo
 * @option battler.hp; // HP
 * @option battler.mhp; // 最大HP
 * @option battler.mp; // MP
 * @option battler.mhp; // 最大MP
 * @option battler.tp; // TP
 * @option battler.maxTp(); // 最大MP
 * @option meta.value; // メモ欄[value]の値
 *
 * @param FixedValue
 * @text 固定値
 * @desc ゲージの値を固定値で設定します。現在値に固定値を指定することは推奨しません。
 * @default
 * @type number
 * @min 1
 */

/*~struct~Detail:
 *
 * @param RisingSmoothness
 * @text 上昇中のなめらかさ
 * @desc 大きい数を指定するとゲージがゆっくりと上昇します。
 * @default 1
 * @type number
 * @min 1
 *
 * @param FallingSmoothness
 * @text 下降中のなめらかさ
 * @desc 大きい数を指定するとゲージがゆっくりと下降します。
 * @default 1
 * @type number
 * @min 1
 *
 * @param GaugeColorPreset
 * @text ゲージ色のプリセット
 * @desc ゲージ色をプリセットから簡易指定します。詳細指定があればそちらが優先されます。
 * @default hp
 * @type select
 * @option
 * @option hp
 * @option mp
 * @option tp
 * @option time
 *
 * @param GaugeColorLeft
 * @text ゲージ色(左)
 * @desc 左側のゲージ色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
 * @default 0
 *
 * @param GaugeColorRight
 * @text ゲージ色(右)
 * @desc 右側のゲージ色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
 * @default 0
 *
 * @param BackColor
 * @text ゲージ背景色
 * @desc ゲージ背景色です。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
 * @default 0
 *
 * @param Label
 * @text ラベル
 * @desc ゲージの左に表示されるラベル文字列です。
 * @default
 *
 * @param LabelFont
 * @text ラベルフォント
 * @desc ラベルを表示するときのフォント情報です。未指定の場合はゲージのデフォルト値が使用されます。
 * @default
 * @type struct<Font>
 *
 * @param DrawValue
 * @text 現在値を描画する
 * @desc ゲージの右側に現在値を描画します。
 * @default true
 * @type boolean
 *
 * @param ValueFont
 * @text 現在値フォント
 * @desc 現在値を表示するときのフォント情報です。未指定の場合はゲージのデフォルト値が使用されます。
 * @default
 * @type struct<Font>
 *
 * @param FlashIfFull
 * @text 満タン時にフラッシュ
 * @desc ゲージの現在値が最大値以上になるとゲージをフラッシュさせます。
 * @default false
 * @type boolean
 */

/*~struct~Font:
 *
 * @param Face
 * @text フォント名
 * @desc フォント名です。woffファイルを指定してください。
 * @default
 * @type file
 * @dir fonts
 *
 * @param Size
 * @text フォントサイズ
 * @desc フォントサイズです。
 * @default 0
 * @type number
 *
 * @param Color
 * @text テキストカラー
 * @desc テキストカラーです。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
 * @default 0
 * @type number
 *
 * @param OutlineColor
 * @text アウトラインカラー
 * @desc アウトラインカラーです。テキストカラー番号かCSS色指定(rgba(0, 0, 0, 0))を指定します。
 * @default 0
 * @type number
 *
 * @param OutlineWidth
 * @text アウトライン横幅
 * @desc アウトラインの横幅です。
 * @default 0
 * @type number
 */

/*~struct~Battler:
 *
 * @param Type
 * @text バトラー種別
 * @desc ゲージの主体となるバトラーの取得方法です。
 * @default
 * @type select
 * @option アクターID
 * @value ActorId
 * @option パーティの並び順
 * @value PartyIndex
 * @option 敵キャラID
 * @value EnemyId
 * @option 敵グループの並び順(戦闘画面で有効)
 * @value TroopIndex
 * @option メニュー画面で選択したアクター(メニュー詳細画面で有効)
 * @value MenuActor
 *
 * @param ActorId
 * @text アクターID
 * @desc 種別選択で『アクターID』を選択したときのアクターIDです。
 * @default 0
 * @type actor
 *
 * @param EnemyId
 * @text 敵キャラID
 * @desc 種別選択で『敵キャラID』を選択したときの敵キャラIDです。
 * @default 0
 * @type enemy
 *
 * @param Index
 * @text 並び順
 * @desc 種別選択で『パーティの並び順』『敵グループの並び順』を選択したときの並び順です。先頭は[0]です。
 * @default 0
 * @type number
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.GaugeList) {
        param.GaugeList = [];
    }

    const _Scene_Base_create    = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        _Scene_Base_create.apply(this, arguments);
        this._extraGauges = this.findExtraGaugeList().map(data => {
            return new Sprite_ExtraGaugeContainer(data, data.Detail || {}, data.Layout || {});
        });
    };

    const _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function() {
        if (this instanceof Scene_Message) {
            this.addExtraGauge();
        }
        _Scene_Base_createWindowLayer.apply(this, arguments);
    };

    const _Scene_Base_start    = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.apply(this, arguments);
        this.addExtraGauge();
    };

    Scene_Base.prototype.addExtraGauge = function() {
        if (this._extraGaugesAdd) {
            return;
        }
        this._extraGauges.forEach(extraGauge => {
            this.addChild(extraGauge);
        });
        this._extraGaugesAdd = true;
    };

    Scene_Base.prototype.findExtraGaugeList = function() {
        const currentSceneName = PluginManagerEx.findClassName(this);
        return (param.GaugeList || []).filter(function(data) {
            return data.SceneName === currentSceneName;
        }, this);
    };

    const _Sprite_Gauge_initialize = Sprite_Gauge.prototype.initialize;
    Sprite_Gauge.prototype.initialize = function(data, detail, layout) {
        if (data) {
            this._data = data;
            this._detail = detail;
            this._layout = layout;
        }
        _Sprite_Gauge_initialize.apply(this, arguments);
    };

    /**
     * Sprite_ExtraGaugeContainer
     * 追加ゲージとピクチャを含むコンテナです。
     */
    class Sprite_ExtraGaugeContainer extends Sprite {
        constructor(data, detail, layout) {
            super();
            this._data = data;
            this._detail = detail;
            this._layout = layout;
            this.create();
        }

        create() {
            this._gauge = new Sprite_ExtraGauge(this._data, this._detail, this._layout);
            this._lower = this.createPicture(this._data.LowerPicture);
            this.addChild(this._gauge);
            this._upper = this.createPicture(this._data.UpperPicture);
            this.setupPosition();
            this.update();
        }

        setupPosition() {
            this.x = this._gauge.findLayoutValue(this._layout.x);
            this.y = this._gauge.findLayoutValue(this._layout.y);
        }

        update() {
            super.update();
            this.updateVisibly();
            this.updateOpacity();
        }

        updateVisibly() {
            this.visible = this.isVisible();
        }

        updateOpacity() {
            if (this._detail.OpacityVariable) {
                this.opacity = $gameVariables.value(this._detail.OpacityVariable);
            }
        }

        isVisible() {
            return !this._data.SwitchId || $gameSwitches.value(this._data.SwitchId);
        }

        createPicture(pictureData) {
            if (!pictureData || !pictureData.FileName) {
                return null;
            }
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.bitmap = ImageManager.loadPicture(pictureData.FileName);
            sprite.x = pictureData.OffsetX || 0;
            sprite.y = pictureData.OffsetY || 0;
            this.addChild(sprite);
            return sprite;
        }
    }

    /**
     * Sprite_ExtraGauge
     * 追加ゲージを扱うクラスです。
     */
    class Sprite_ExtraGauge extends Sprite_Gauge {
        constructor(data, detail, layout) {
            super(data, detail, layout);
            this.setup(this.findBattler(), this._detail.GaugeColorPreset);
            this.setupPosition();
        }

        findBattler() {
            const battlerData = this._data.Battler;
            if (!battlerData) {
                return $gameParty.menuActor();
            }
            const methodName = `findBattler${battlerData.Type}`;
            if (this[methodName]) {
                return this[methodName](battlerData);
            } else {
                return $gameParty.menuActor();
            }
        }

        findBattlerActorId(battlerData) {
            return $gameActors.actor(battlerData.ActorId);
        }

        findBattlerPartyIndex(battlerData) {
            return $gameParty.members()[battlerData.Index];
        }

        findBattlerEnemyId(battlerData) {
            return new Game_Enemy(battlerData.EnemyId, 0, 0);
        }

        findBattlerTroopIndex(battlerData) {
            return $gameTroop.members()[battlerData.Index];
        }

        updateBitmap() {
            const visible = this.parent ? this.parent.visible : false;
            if (visible) {
                if (!this._prevVisible) {
                    this._value = this._targetValue;
                    this._maxValue = this._targetMaxValue;
                }
                super.updateBitmap();
            }
            this._prevVisible = visible;
        }

        updateFlashing() {
            if (!this._detail.FlashIfFull) {
                return;
            }
            if (this.isFull()) {
                this._flashingCount++;
                if (this._flashingCount % 20 < 10) {
                    this.setBlendColor(this.flashingColor1());
                } else {
                    this.setBlendColor(this.flashingColor2());
                }
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }

        flashingColor1() {
            return [255, 255, 255, 96];
        }

        flashingColor2() {
            return [255, 255, 255, 64];
        }

        isFull() {
            return this._value >= this._maxValue;
        }

        setupPosition() {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            if (this._layout.Vertical) {
                this.rotation = (270 * Math.PI) / 180;
            }
        }

        bitmapWidth() {
            return this.findLayoutValue(this._layout.width) || super.bitmapWidth();
        }

        bitmapHeight() {
            return this.findLayoutValue(this._layout.height) || super.bitmapHeight();
        }

        gaugeHeight() {
            return this.findLayoutValue(this._layout.GaugeHeight) || this.bitmapHeight();
        }

        gaugeX() {
            return this.findLayoutValue(this._layout.GaugeX) || 0;
        }

        findLayoutValue(value) {
            if (isNaN(value)) {
                try {
                    const width = $dataSystem.advanced.uiAreaWidth;
                    const height = $dataSystem.advanced.uiAreaHeight;
                    return eval(value);
                } catch (e) {
                    console.error(e);
                    return 0;
                }
            } else {
                return value;
            }
        }

        currentValue() {
            return this.findValue(this._data.CurrentMethod);
        }

        currentMaxValue() {
            return Math.max(this.findValue(this._data.MaxMethod), 1)
        }

        findValue(method) {
            if (!method) {
                return 0;
            } else if (method.VariableId) {
                return $gameVariables.value(method.VariableId)
            } else if (method.Script) {
                const battler = this._battler;
                const meta = battler.isActor() ? battler.actor().meta : battler.enemy().meta;
                try {
                    return eval(method.Script);
                } catch (e) {
                    console.error(e);
                    return 0;
                }
            } else {
                return method.FixedValue;
            }
        }

        label() {
            return this._detail.Label || '';
        }

        labelColor() {
            return this.findColor(this.findLabelFont().Color, super.labelColor());
        }

        labelOutlineColor() {
            return this.findColor(this.findLabelFont().OutlineColor, super.labelOutlineColor());
        }

        labelOutlineWidth() {
            return this.findLabelFont().OutlineWidth || super.labelOutlineWidth();
        }

        labelFontFace() {
            return this.findLabelFont().Face || super.labelFontFace();
        }

        labelFontSize() {
            return this.findLabelFont().Size || super.labelFontSize();
        }

        findLabelFont() {
            return this._detail.LabelFont || {};
        }

        valueColor() {
            return this.findColor(this.findValueFont().Color, super.valueColor());
        }

        valueOutlineColor() {
            return this.findColor(this.findValueFont().OutlineColor, super.valueOutlineColor());
        }

        valueOutlineWidth() {
            return this.findValueFont().OutlineWidth || super.valueOutlineWidth();
        }

        valueFontFace() {
            return this.findValueFont().Face || super.valueFontFace();
        }

        valueFontSize() {
            return this.findValueFont().Size || super.valueFontSize();
        }

        findValueFont() {
            return this._detail.ValueFont || {};
        }

        gaugeBackColor() {
            return this.findColor(this._detail.BackColor, super.gaugeBackColor());
        }

        gaugeColor1() {
            return this.findColor(this._detail.GaugeColorLeft, super.gaugeColor1());
        }

        gaugeColor2() {
            return this.findColor(this._detail.GaugeColorRight, super.gaugeColor2());
        }

        isValid() {
            return true;
        }

        smoothness() {
            if (this._value <= this._targetValue) {
                return this._detail.RisingSmoothness || 1;
            } else {
                return this._detail.FallingSmoothness || 1;
            }
        }

        drawValue() {
            if (this._detail.DrawValue) {
                super.drawValue();
            }
        }

        findColor(code, defaultColor = null) {
            if (!code) {
                return defaultColor ? defaultColor : ColorManager.normalColor();
            } else if (isNaN(code)) {
                return code;
            } else {
                return ColorManager.textColor(code);
            }
        }
    }
})();
