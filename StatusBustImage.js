//=============================================================================
// StatusBustImage.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.9.3 2020/09/13 廃止になったパラメータが設定できてしまっていた問題を修正
// 1.9.2 2020/09/13 表示優先度をウィンドウの下に設定した場合もウィンドウの下に表示されない問題を修正
// 1.9.1 2020/09/06 MZ向けに全体的に修正。一部機能は無効になっています。
// 1.9.0 2020/04/22 各画像に拡大率を設定できる設定を追加
// 1.8.1 2019/11/10 1.8.0でZ座標の指定された装備、ステート画像を複数表示すると、アクター追加画像の表示順が入れ替わる場合がある問題を修正
// 1.8.0 2019/11/02 装備品以外にもステートや職業でも追加画像を表示できる機能を追加
// 1.7.4 2019/01/02 MOG_SceneMenu.jsと併用した場合、アイテムを使用時に2回使用してしまう場合がある問題を修正
// 1.7.3 2018/11/04 GraphicalDesignMode.jsとの間で競合が発生する場合がある問題を修正
// 1.7.2 2018/09/17 TMSoloMenu.jsと両立できるよう修正（TMSoloMenu.js側の修正も必須）
// 1.7.1 2017/02/02 特定条件下で戦闘画面にもバストアップが表示されていた問題を修正
// 1.7.0 2017/09/25 ベース画像と追加画像に原点を変更できる機能を追加
// 1.6.0 2017/09/25 バストアップ画像に表情差分用の追加グラフィックを重ねて表示できる機能を追加
// 1.5.0 2017/09/04 バストアップ画像をウィンドウの下に表示できる機能を追加
// 1.4.0 2017/07/05 メインメニュー画面でも先頭アクターの画像を表示できる機能を追加
// 1.3.2 2017/02/20 装備画面での「最強装備」と「全て外す」時に装備品画像が更新されなかった問題を修正
// 1.3.1 2016/10/13 装備品の画像がトリミングの対象外になっていたのを修正
// 1.3.0 2016/10/13 画像を指定した矩形でトリミングして表示できる機能を追加
// 1.2.0 2016/10/08 装備品画像にZ座標を付与できるよう修正
// 1.1.0 2016/10/06 装備画面とスキル画面にも画像を表示できる機能を追加
// 1.0.1 2016/08/12 キャラクターを切り替えたときにグラフィックが切り替わらない問題を修正
// 1.0.0 2016/07/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc StatusBustImagePlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StatusBustImage.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param BustImageX
 * @desc バストアップ画像を表示するX座標(足下原点)です。
 * @default 640
 *
 * @param BustImageY
 * @desc バストアップ画像を表示するY座標(足下原点)です。
 * @default 620
 *
 * @param EquipBustImageX
 * @desc 装備画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param EquipBustImageY
 * @desc 装備画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param SkillBustImageX
 * @desc スキル画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param SkillBustImageY
 * @desc スキル画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param MainBustImageX
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param MainBustImageY
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param BustPriority
 * @desc バストアップ画像の表示優先度（プライオリティ）です。
 * @default 0
 * @type select
 * @option ウィンドウの下
 * @value 0
 * @option ウィンドウの上
 * @value 1
 *
 * @param BaseImageOrigin
 * @desc ベース画像の原点です。
 * @default 2
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @option 足下
 * @value 2
 *
 * @param AddImageOrigin
 * @desc 追懐画像および装備品画像の原点です。
 * @default 2
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @option 足下
 * @value 2
 *
 * @command IMAGE_CHANGE
 * @text 画像差し替え
 * @desc アクターのバストアップ画像を差し替えます。
 *
 * @arg actorId
 * @text アクターID
 * @desc 差し替え対象のアクターIDです。
 * @default 1
 * @type actor
 *
 * @arg fileName
 * @text ファイル名
 * @desc 差し替える画像ファイルです。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @help ステータス画面にアクターごとのバストアップ画像を表示します。
 * 足下を原点として表示位置を自由に調整できます。
 *
 * 装備画面とスキル画面にも同一のバストアップ画像を表示できますが
 * デフォルト画面サイズではスペースがないので、使用する場合は必要に応じて
 * 画面サイズを変更してください。
 *
 * また、メインメニュー画面にも同一のバストアップ画像を表示できますが
 * 表示されるのは「先頭のアクター」のみです。
 * 主にアクターが一人の場合に使用します。
 *
 * アクターのメモ欄に以下の通り指定してください。
 *
 * <SBI画像:file>   # /img/pictures/file.pngが表示されます。
 * <SBIImage:file>  # /img/pictures/file.pngが表示されます。
 * <SBI矩形:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 * <SBIRect:0,0,100,100> # 切り出して（トリミング）表示します。(カンマ区切り)
 * <SBI画像拡大率X:100>  # 画像の横方向の拡大率を設定します。
 * <SBIImageScaleX:100> # 同上
 * <SBI画像拡大率Y:100>  # 画像の縦方向の拡大率を設定します。
 * <SBIImageScaleY:100> # 同上
 *
 * さらに以下のメモ欄で追加差分を複数表示することが可能です。
 * <SBI追加画像1:file2>       # /img/pictures/file2.pngが表示されます。
 * <SBIAddImage1:file2>       # 同上
 * <SBI追加条件1:\v[1] === 3> # 変数[1]が[3]と等しい時のみ追加画像が表示されます。
 * <SBIAddCond1:\v[1] === 3>  # 同上
 * <SBI追加座標X1:30>         # 追加画像のX座標を[30]に設定します。
 * <SBIAddPosX1:30>           # 同上
 * <SBI追加座標Y1:30>         # 追加画像のY座標を[30]に設定します。
 * <SBIAddPosY1:30>           # 同上
 * <SBI追加座標拡大率X1:100>   # 追加画像の横方向の拡大率を設定します。
 * <SBIAddPosScaleX1:100>     # 同上
 * <SBI追加座標拡大率Y1:100>   # 追加画像の縦方向の拡大率を設定します。
 * <SBIAddPosScaleY1:100>     # 同上
 * 複数の追加画像を表示したい場合は最後の数字を[2]以降に変更してください。
 *
 * 指定する座標はベース画像の足下からの相対座標です。
 *
 * 計算式中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<SBIAddCond1:\v[2] &gt; 1> // 変数[2]が1より大きい場合
 *
 * さらに動画(データベースのアニメーション)を再生することもできます。
 * 画像の上に重ねてまばたき等を表現するのに使用します。
 *
 * <SBI動画:1>      # ID[1]のアニメーションがループ再生されます。
 * <SBIAnimation:1> # ID[1]のアニメーションがループ再生されます。
 *
 * 装備品、ステート、職業ごとに画像を上乗せできます。
 * それぞれデータベースのメモ欄に以下の通り指定してください。
 * <SBI画像:item>   # /img/pictures/item.pngが表示されます。
 * <SBIImage:item>  # /img/pictures/item.pngが表示されます。
 * <SBIPosX:30>     # 装備品画像のX座標を[30]に設定します。
 * <SBI座標X:30>    # 装備品画像のX座標を[30]に設定します。
 * <SBIPosY:30>     # 装備品画像のY座標を[30]に設定します。
 * <SBI座標Y:30>    # 装備品画像のY座標を[30]に設定します。
 * <SBIPosZ:3>      # 装備品画像のZ座標を[3]に設定します。
 * <SBI座標Z:3>     # 装備品画像のZ座標を[3]に設定します。
 * <SBI矩形:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 * <SBIRect:0,0,100,100> # 切り出して（トリミング）表示します。(カンマ区切り)
 * <SBIScaleX:100>   # 装備品画像の横方向の拡大率を設定します。
 * <SBI拡大率X:100>   # 同上
 * <SBIScaleY:100>   # 装備品画像の縦方向の拡大率を設定します。
 * <SBI拡大率Y:100>   # 同上
 *
 * 指定する座標はベース画像の足下からの相対座標です。
 *
 * Z座標が大きい値ほど手前に表示されます。指定しない場合は[1]になります。
 * アクター画像のZ座標は[0]で固定です。
 *
 * プラグインコマンドの実行により画像や動画を変更することもできます。
 * ストーリーの進行によって差し替えたい場合に使用します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SBI画像差し替え 1 file2  # ID[1]のアクターの画像を
 *                          「file2.png」に差し替えます。
 * SBI_IMAGE_CHANGE 1 file2 # ID[1]のアクターの画像を
 *                          「file2.png」に差し替えます。
 * SBI動画差し替え 1 3  # ID[1]のアクターの動画を「3」に差し替えます。
 * SBI_ANIME_CHANGE 1 3 # ID[1]のアクターの動画を「3」に差し替えます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc バストアップ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StatusBustImage.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param 画像X座標
 * @desc バストアップ画像を表示するX座標(足下原点)です。
 * @default 640
 *
 * @param 画像Y座標
 * @desc バストアップ画像を表示するY座標(足下原点)です。
 * @default 620
 *
 * @param 装備_画像X座標
 * @desc 装備画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param 装備_画像Y座標
 * @desc 装備画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param スキル_画像X座標
 * @desc スキル画面でバストアップ画像を表示するX座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param スキル_画像Y座標
 * @desc スキル画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param メイン_画像X座標
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param メイン_画像Y座標
 * @desc メインメニュー画面でバストアップ画像を表示するY座標(足下原点)です。指定しない場合、表示されなくなります。
 * @default
 *
 * @param 表示優先度
 * @desc バストアップ画像の表示優先度（プライオリティ）です。
 * @default 0
 * @type select
 * @option ウィンドウの下
 * @value 0
 * @option ウィンドウの上
 * @value 1
 *
 * @param ベース画像原点
 * @desc ベース画像の原点です。
 * @default 2
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @option 足下
 * @value 2
 *
 * @param 追加画像原点
 * @desc 追懐画像および装備品画像の原点です。
 * @default 2
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @option 足下
 * @value 2
 *
 * @command IMAGE_CHANGE
 * @text 画像差し替え
 * @desc アクターのバストアップ画像を差し替えます。
 *
 * @arg actorId
 * @text アクターID
 * @desc 差し替え対象のアクターIDです。
 * @default 1
 * @type actor
 *
 * @arg fileName
 * @text ファイル名
 * @desc 差し替える画像ファイルです。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @help ステータス画面にアクターごとのバストアップ画像を表示します。
 * 足下を原点として表示位置を自由に調整できます。
 *
 * 装備画面とスキル画面にも同一のバストアップ画像を表示できますが
 * デフォルト画面サイズではスペースがないので、使用する場合は必要に応じて
 * 画面サイズを変更してください。
 *
 * また、メインメニュー画面にも同一のバストアップ画像を表示できますが
 * 表示されるのは「先頭のアクター」のみです。
 * 主にアクターが一人の場合に使用します。
 *
 * アクターのメモ欄に以下の通り指定してください。
 *
 * <SBI画像:file>   # /img/pictures/file.pngが表示されます。
 * <SBIImage:file>  # 同上
 * <SBI矩形:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 * <SBIRect:0,0,100,100> # 切り出して（トリミング）表示します。(カンマ区切り)
 * <SBI画像拡大率X:100>  # 画像の横方向の拡大率を設定します。
 * <SBIImageScaleX:100> # 同上
 * <SBI画像拡大率Y:100>  # 画像の縦方向の拡大率を設定します。
 * <SBIImageScaleY:100> # 同上
 *
 * さらに以下のメモ欄で追加差分を複数表示することが可能です。
 * <SBI追加画像1:file2>       # /img/pictures/file2.pngが表示されます。
 * <SBIAddImage1:file2>       # 同上
 * <SBI追加条件1:\v[1] === 3> # 変数[1]が[3]と等しい時のみ追加画像が表示されます。
 * <SBIAddCond1:\v[1] === 3>  # 同上
 * <SBI追加座標X1:30>         # 追加画像のX座標を[30]に設定します。
 * <SBIAddPosX1:30>           # 同上
 * <SBI追加座標Y1:30>         # 追加画像のY座標を[30]に設定します。
 * <SBIAddPosY1:30>           # 同上
 * <SBI追加座標拡大率X1:100>   # 追加画像の横方向の拡大率を設定します。
 * <SBIAddPosScaleX1:100>     # 同上
 * <SBI追加座標拡大率Y1:100>   # 追加画像の縦方向の拡大率を設定します。
 * <SBIAddPosScaleY1:100>     # 同上
 *
 * 複数の追加画像を表示したい場合は最後の数字を[2]以降に変更してください。
 *
 * 指定する座標はベース画像の足下からの相対座標です。
 *
 * 計算式中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<SBIAddCond1:\v[2] &gt; 1> // 変数[2]が1より大きい場合
 *
 * 装備品、ステート、職業ごとに画像を上乗せできます。
 * それぞれデータベースのメモ欄に以下の通り指定してください。
 * <SBI画像:item>   # /img/pictures/item.pngが表示されます。
 * <SBIImage:item>  # /img/pictures/item.pngが表示されます。
 * <SBIPosX:30>     # 装備品画像のX座標を[30]に設定します。
 * <SBI座標X:30>    # 装備品画像のX座標を[30]に設定します。
 * <SBIPosY:30>     # 装備品画像のY座標を[30]に設定します。
 * <SBI座標Y:30>    # 装備品画像のY座標を[30]に設定します。
 * <SBIPosZ:3>      # 装備品画像のZ座標を[3]に設定します。
 * <SBI座標Z:3>     # 装備品画像のZ座標を[3]に設定します。
 * <SBI矩形:0,0,100,100> # 画像を指定した矩形(X座標、Y座標、横幅、高さ)で
 * <SBIRect:0,0,100,100> # 切り出して（トリミング）表示します。(カンマ区切り)
 * <SBIScaleX:100>   # 装備品画像の横方向の拡大率を設定します。
 * <SBI拡大率X:100>   # 同上
 * <SBIScaleY:100>   # 装備品画像の縦方向の拡大率を設定します。
 * <SBI拡大率Y:100>   # 同上
 *
 * 指定する座標はベース画像の足下からの相対座標です。
 *
 * Z座標が大きい値ほど手前に表示されます。指定しない場合は[1]になります。
 * アクター画像のZ座標は[0]で固定です。
 *
 * プラグインコマンドの実行により画像や動画を変更することもできます。
 * ストーリーの進行によって差し替えたい場合に使用します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'StatusBustImage';
    var metaTagPrefix = 'SBI';
    var script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'IMAGE_CHANGE', args => {
        var actor1 = $gameActors.actor(args.actorId);
        actor1.setBustImageName(args.fileName);
    });

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramBustImageX = getParamNumber(['BustImageX', '画像X座標']);
    var paramBustImageY = getParamNumber(['BustImageY', '画像Y座標']);
    var paramEquipBustImageX = getParamNumber(['EquipBustImageX', '装備_画像X座標']);
    var paramEquipBustImageY = getParamNumber(['EquipBustImageY', '装備_画像Y座標']);
    var paramSkillBustImageX = getParamNumber(['SkillBustImageX', 'スキル_画像X座標']);
    var paramSkillBustImageY = getParamNumber(['SkillBustImageY', 'スキル_画像Y座標']);
    var paramMainBustImageX = getParamNumber(['MainBustImageX', 'メイン_画像X座標']);
    var paramMainBustImageY = getParamNumber(['MainBustImageY', 'メイン_画像Y座標']);
    var paramBustPriority = getParamNumber(['BustPriority', '表示優先度'], 0);
    var paramBaseImageOrigin = getParamNumber(['BaseImageOrigin', 'ベース画像原点'], 0);
    var paramAddImageOrigin = getParamNumber(['AddImageOrigin', '追加画像原点'], 0);

    //=============================================================================
    // Game_Actor
    //  バスト画像を設定します。
    //=============================================================================
    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function () {
        _Game_Actor_initMembers.apply(this, arguments);
        this._bustImageName = null;
        this._bustAnimationId = null;
    };

    Game_Actor.prototype.getMetaInfoForBustImage = function (names) {
        names = names.map(function (value) {
            return metaTagPrefix + value;
        })
        return PluginManagerEx.findMetaValue(this.actor(), names);
    };

    Game_Actor.prototype.setBustImageName = function (value) {
        this._bustImageName = value;
    };

    Game_Actor.prototype.getBustImageName = function () {
        return this._bustImageName || this.getMetaInfoForBustImage(['画像', 'Image']);
    };

    Game_Actor.prototype.getBustImageData = function () {
        var name = this.getBustImageName();
        if (!name) {
            return null;
        }
        return {
            name: name,
            scaleX: this.getMetaInfoForBustImage(['画像拡大率X', 'ImageScaleX']),
            scaleY: this.getMetaInfoForBustImage(['画像拡大率Y', 'ImageScaleY']),
            rect: this.getBustImageRect()
        }
    };

    Game_Actor.prototype.getBustImageRect = function () {
        var rectString = this.getMetaInfoForBustImage(['矩形', 'Rect']);
        if (!rectString) {
            return null;
        }
        var rect = rectString.split(',').map(function (value) {
            return parseInt(value);
        })
        return new Rectangle(rect[0], rect[1], rect[2], rect[3]);
    };

    Game_Actor.prototype.getAdditionalBustImage = function (index) {
        var fileName = this.getMetaInfoForBustImage(['追加画像' + index, 'AddImage' + index]);
        if (!fileName) {
            return null;
        }
        var image = {};
        image.fileName = fileName;
        image.cond = this.getMetaInfoForBustImage(['追加条件' + index, 'AddCond' + index]);
        image.x = this.getMetaInfoForBustImage(['追加座標X' + index, 'AddPosX' + index]) || 0;
        image.y = this.getMetaInfoForBustImage(['追加座標Y' + index, 'AddPosY' + index]) || 0;
        image.scaleX = this.getMetaInfoForBustImage(['追加座標拡大率X' + index, 'AddPosScaleX' + index]) || 100;
        image.scaleY = this.getMetaInfoForBustImage(['追加座標拡大率Y' + index, 'AddPosScaleY' + index]) || 100;
        return image;
    };

    Game_Actor.prototype.getAdditionalBustImageList = function () {
        var bustList = [];
        var index = 1;
        var image = null;
        do {
            image = this.getAdditionalBustImage(index);
            if (image) {
                bustList.push(image);
            }
            index++;
        } while (image);
        return bustList;
    };

    //=============================================================================
    // Window_Base
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function () {
        if (this.isNeedBust()) this._bustSprite = null;
        _Window_Base_initialize.apply(this, arguments);
    };

    Window_Base.prototype._createAllParts = function () {
        Window.prototype._createAllParts.call(this);
        if (this.isNeedBust()) this.createBustSprite();
    };

    Window_Base.prototype.isNeedBust = function () {
        if ($gameParty.inBattle()) {
            return false;
        }
        var pos = this.getBustPosition();
        return pos !== null && (pos[0] !== 0 || pos[1] !== 0);
    };

    Window_Base.prototype.createBustSprite = function () {
        this._bustContainer = new Sprite();
        this._bustSprite = new Sprite_Bust();
        this._bustContainer.addChild(this._bustSprite);
        this._bustAddContainer = false;
    };

    Window_Base.prototype.setBustPosition = function (x, y) {
        this._bustSprite.move(x, y);
    };

    Window_Base.prototype.getBustPosition = function () {
        return null;
    };

    Window_Base.prototype.refreshBust = function () {
        if (this._actor && this.isNeedBust()) {
            this.setBustPosition.apply(this, this.getBustPosition());
            this._bustSprite.refresh(this._actor);
            if (!this._bustAddContainer) {
                this.tryAddBustContainer();
            }
        }
    };

    Window_Base.prototype.tryAddBustContainer = function () {
        if (!this.parent) {
            return;
        }
        if (this.isUnderWindow()) {
            this.parent.parent.addChildAt(this._bustContainer, 1);
        } else {
            this.parent.addChild(this._bustContainer);
        }
        this._bustAddContainer = true;
    };

    Window_Base.prototype.isUnderWindow = function () {
        return paramBustPriority === 0;
    };

    //=============================================================================
    // Window_MenuStatus
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_MenuStatus_refresh = Window_MenuStatus.prototype.refresh;
    Window_MenuStatus.prototype.refresh = function () {
        _Window_MenuStatus_refresh.apply(this, arguments);
        this._actor = $gameParty.members()[0];
        this.refreshBust();
    };

    var _Window_MenuStatus_setPendingIndex = Window_MenuStatus.prototype.setPendingIndex;
    Window_MenuStatus.prototype.setPendingIndex = function (index) {
        _Window_MenuStatus_setPendingIndex.apply(this, arguments);
        var actor = $gameParty.members()[0];
        if (actor === this._actor) return;
        this._actor = actor;
        this.refreshBust();
    };

    Window_MenuStatus.prototype.getBustPosition = function () {
        return [paramMainBustImageX, paramMainBustImageY];
    };

    //=============================================================================
    // Window_MenuActor
    //  アクター選択ウィンドウにはバストアップは表示しない
    //=============================================================================
    Window_MenuActor.prototype.getBustPosition = function () {
        return null;
    };

    // Resolve conflict for TMSoloMenu.js
    if (typeof Window_SoloStatus !== 'undefined') {
        var _Window_SoloStatus_refresh = Window_SoloStatus.prototype.refresh;
        Window_SoloStatus.prototype.refresh = function () {
            _Window_SoloStatus_refresh.apply(this, arguments);
            this._actor = $gameParty.members()[0];
            this.refreshBust();
        };

        Window_SoloStatus.prototype.getBustPosition = function () {
            return [paramMainBustImageX, paramMainBustImageY];
        };
    }

    //=============================================================================
    // Window_Status
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_Status_refresh = Window_Status.prototype.refresh;
    Window_Status.prototype.refresh = function () {
        _Window_Status_refresh.apply(this, arguments);
        this.refreshBust();
    };

    Window_Status.prototype.getBustPosition = function () {
        return [paramBustImageX, paramBustImageY];
    };

    //=============================================================================
    // Window_EquipItem
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    Window_EquipItem.prototype.refresh = function () {
        if (!this._actor) {
            return;
        }
        Window_ItemList.prototype.refresh.apply(this, arguments);
        this.refreshBust();
    };

    Window_EquipItem.prototype.getBustPosition = function () {
        return [paramEquipBustImageX, paramEquipBustImageY];
    };

    //=============================================================================
    // Window_SkillList
    //  バスト画像表示用スプライトを追加定義します。
    //=============================================================================
    var _Window_SkillList_refresh = Window_SkillList.prototype.refresh;
    Window_SkillList.prototype.refresh = function () {
        _Window_SkillList_refresh.apply(this, arguments);
        this.refreshBust();
    };

    Window_SkillList.prototype.getBustPosition = function () {
        return [paramSkillBustImageX, paramSkillBustImageY];
    };

    //=============================================================================
    // Scene_Equip
    //  装備変更時にバストイメージを更新します。
    //=============================================================================
    var _Scene_Equip_commandOptimize = Scene_Equip.prototype.commandOptimize;
    Scene_Equip.prototype.commandOptimize = function () {
        _Scene_Equip_commandOptimize.apply(this, arguments);
        this._itemWindow.refreshBust();
    };

    var _Scene_Equip_commandClear = Scene_Equip.prototype.commandClear;
    Scene_Equip.prototype.commandClear = function () {
        _Scene_Equip_commandClear.apply(this, arguments);
        this._itemWindow.refreshBust();
    };

    //=============================================================================
    // Sprite_Bust
    //  バスト画像のクラスです。
    //=============================================================================
    function Sprite_Bust() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Bust._anchorListX = [0.0, 0.5, 0.5];
    Sprite_Bust._anchorListY = [0.0, 0.5, 1.0];

    Sprite_Bust.prototype = Object.create(Sprite.prototype);
    Sprite_Bust.prototype.constructor = Sprite_Bust;

    Sprite_Bust.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this.anchor.x = Sprite_Bust._anchorListX[paramBaseImageOrigin];
        this.anchor.y = Sprite_Bust._anchorListY[paramBaseImageOrigin];
        this._actor = null;
        this._equipSprites = [];
        this._additonalSprite = [];
        this.z = 0;
    };

    Sprite_Bust.prototype.refresh = function (actor) {
        this._actor = actor;
        this.drawMain();
        this.drawAdditions();
        this.drawEquips();
    };

    Sprite_Bust.prototype.drawMain = function () {
        var data = this._actor.getBustImageData();
        if (!data) {
            this.bitmap = null;
            return;
        }
        this.bitmap = ImageManager.loadPicture(data.name);
        var rect = data.rect;
        if (rect) {
            this.setFrame(rect.x, rect.y, rect.width, rect.height);
        }
        if (data.scaleX) {
            this.scale.x = data.scaleX / 100;
        }
        if (data.scaleY) {
            this.scale.y = data.scaleY / 100;
        }
    };

    Sprite_Bust.prototype.drawAdditions = function () {
        this.clearAdditions();
        var additionalList = this._actor.getAdditionalBustImageList();
        additionalList.forEach(function (additionalImage) {
            this.makeAdditionSprite(additionalImage);
        }, this);
    };

    Sprite_Bust.prototype.clearAdditions = function () {
        this._additonalSprite.forEach(function (sprite) {
            this.parent.removeChild(sprite);
        }.bind(this));
        this._additonalSprite = [];
    };

    Sprite_Bust.prototype.drawEquips = function () {
        this.clearEquips();
        this._actor.traitObjects().forEach(function (traitObj) {
            if (traitObj && traitObj !== this._actor.actor()) {
                this.makeSubSprite(traitObj);
            }
        }, this);
        this.sortEquips();
    };

    Sprite_Bust.prototype.clearEquips = function () {
        this._equipSprites.forEach(function (sprite) {
            this.parent.removeChild(sprite);
        }.bind(this));
        this._equipSprites = [];
    };

    Sprite_Bust.prototype.sortEquips = function () {
        this.parent.children.sort(this._compareChildOrder.bind(this));
    };

    Sprite_Bust.prototype._compareChildOrder = function (a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    Sprite_Bust.prototype.findMetaValue = function (traitObj, names) {
        names = names.map(function (value) {
            return metaTagPrefix + value;
        });
        return PluginManagerEx.findMetaValue(traitObj, names);
    }

    Sprite_Bust.prototype.makeSubSprite = function (traitObj) {
        var itemFileName = this.findMetaValue(traitObj, ['画像', 'Image']);
        if (!itemFileName) {
            return;
        }
        var sprite = new Sprite();
        sprite.anchor.x = Sprite_Bust._anchorListX[paramAddImageOrigin];
        sprite.anchor.y = Sprite_Bust._anchorListY[paramAddImageOrigin];
        sprite.bitmap = ImageManager.loadPicture(itemFileName, 0);
        var x = this.findMetaValue(traitObj, ['PosX', '座標X']) || 0;
        sprite.x = this.x + x;
        var y = this.findMetaValue(traitObj, ['PosY', '座標Y']) || 0;
        sprite.y = this.y + y;
        var z = this.findMetaValue(traitObj, ['PosZ', '座標Z']) || 0;
        sprite.z = z || 0;
        var rectString = this.findMetaValue(traitObj, ['矩形', 'Rect']);
        if (rectString) {
            var rect = rectString.split(',').map(function (value) {
                return parseInt(value);
            })
            sprite.setFrame(rect[0], rect[1], rect[2], rect[3]);
        }
        var scaleX = this.findMetaValue(traitObj, ['ScaleX', '拡大率X']);
        if (scaleX) {
            sprite.scale.x = scaleX / 100;
        }
        var scaleY = this.findMetaValue(traitObj, ['ScaleY', '拡大率Y']);
        if (scaleY) {
            sprite.scale.y = scaleY / 100;
        }
        this.parent.addChild(sprite);
        this._equipSprites.push(sprite);
    };

    Sprite_Bust.prototype.makeAdditionSprite = function (image) {
        if (image.cond && !eval(image.cond)) {
            return;
        }
        var sprite = new Sprite();
        sprite.anchor.x = Sprite_Bust._anchorListX[paramAddImageOrigin];
        sprite.anchor.y = Sprite_Bust._anchorListY[paramAddImageOrigin];
        sprite.bitmap = ImageManager.loadPicture(image.fileName);
        sprite.x = this.x + image.x;
        sprite.y = this.y + image.y;
        sprite.z = 0;
        if (image.scaleX) {
            sprite.scale.x = image.scaleX / 100;
        }
        if (image.scaleY) {
            sprite.scale.y = image.scaleY / 100;
        }
        this.parent.addChild(sprite);
        this._additonalSprite.push(sprite);
    };
})();

