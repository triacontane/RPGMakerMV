//=============================================================================
// CharacterPictureManager.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.3.0 2022/04/21 シーン設定のパラメータにもタッチスイッチ設定を追加
//                  タッチスイッチ有効時は、他のタッチ処理を無効化するよう変更
// 3.2.0 2022/04/18 タッチ時に任意のスイッチをONにできる機能を追加
// 3.1.0 2022/02/08 立ち絵のフェードイン・アウト機能、アンフォーカス機能、反転表示切替機能を追加
// 3.0.0 2022/01/22 バトラーのモーションに合わせた立ち絵を指定できる機能を追加(パラメータ：ダメージ条件は廃止)
//                  表示座標をパーティメンバーの並び順ではなく、アクターIDごとに設定できる機能を追加
// 2.7.0 2022/01/16 画像ごとにシェイクの対象外にできるオプションを追加
// 2.6.1 2022/01/06 立ち絵リストを空にすると動的ファイル名が参照されなくなる問題を修正
// 2.6.0 2021/12/01 任意のスイッチをトリガーに立ち絵のシェイクできる機能を追加
//                  立ち絵のシェイク時にシェイク方向を指定できる機能を追加
// 2.5.0 2021/11/22 ダメージを受けたときに立ち絵を自動で振動させる機能を追加
// 2.4.2 2021/08/08 APNGピクチャを立ち絵に使用したとき、シーン遷移するとエラーになる場合がある問題を修正
// 2.4.1 2021/05/28 2.3.2の修正によりAPNGピクチャプラグインと連携するとAPNGピクチャ以外が立ち絵として表示できなくなっていた問題を修正
// 2.4.0 2021/05/20 立ち絵の座標に制御文字を使ったとき、変数の変更が即座に反映されるよう修正
// 2.3.2 2021/04/26 ヘルプの記述を修正
//                  APNGピクチャプラグインとの連携でGIFファイルを使用できなかった問題を修正
// 2.3.1 2021/04/06 拡大率をシーン単位で設定できる機能を追加
// 2.3.0 2021/04/06 立ち絵に拡大率を設定できる機能を追加
// 2.2.2 2021/02/15 アクター登録していないメンバーを表示させようとするとエラーになる問題を修正
// 2.2.1 2021/02/14 パラメータの防具条件のデータベースタイプが武器になっていた問題を修正
// 2.2.0 2021/02/14 スプライトシート形式の表示に対応
//                  ドラッグ機能をベースごと動かせるように修正
// 2.1.0 2021/02/14 立ち絵をドラッグして座標の確認と調整ができる機能を追加
// 2.0.0 2021/02/12 MZ向けに仕様から再設計
// 1.0.0 2016/05/01 タクポンさん依頼版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 立ち絵表示管理プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CharacterPictureManager.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param PictureList
 * @text 立ち絵リスト
 * @desc アクターごとの立ち絵リストです。ひとりのアクターに対して複数の画像を重ねて表示できます。(リストの下が手前に表示)
 * @default []
 * @type struct<StandPictureActor>[]
 *
 * @param SceneList
 * @text 表示対象シーンリスト
 * @desc 立ち絵を表示したいシーンのリストです。シーンごとに基準座標を設定します。
 * @default ["{\"SceneName\":\"Scene_Title\",\"MemberPosition\":\"[\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"150\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"300\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"450\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\",\"ScaleX\":\"100\",\"ScaleY\":\"100\",\"ShowPictureSwitch\":\"0\",\"Mirror\":\"false\",\"Priority\":\"0\"}"]
 * @type struct<Scene>[]
 *
 * @param Origin
 * @text 原点
 * @desc 立ち絵画像の原点です。全画像で共通の設定です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @option 中央下
 * @value 2
 *
 * @param UsePointAdjust
 * @text 座標調整機能を使う
 * @desc 有効にすると、テストプレー時に立ち絵をドラッグすることで座標を調整する機能が使えます。
 * @default true
 * @type boolean
 *
 * @param ShakeOnDamage
 * @text ダメージ時にシェイク
 * @desc 有効にするとダメージを受けたときに立ち絵をシェイクします。
 * @default false
 * @type boolean
 *
 * @param ShakePower
 * @text シェイク強さ
 * @desc 立ち絵がシェイクの強さです。
 * @default 5
 * @type number
 * @min 1
 *
 * @param ShakeSpeed
 * @text シェイク速さ
 * @desc 立ち絵シェイクの速さです。
 * @default 8
 * @type number
 * @min 1
 *
 * @param ShakeDuration
 * @text シェイク時間
 * @desc 立ち絵シェイク時間(フレーム数)です。
 * @default 30
 * @type number
 * @min 1
 *
 * @param ShakeRotation
 * @text シェイク方向
 * @desc 立ち絵シェイク方向(0-360)です。
 * @default 0
 * @type number
 * @min 0
 * @max 360
 *
 * @param UnFocusPower
 * @text アンフォーカス強さ
 * @desc 立ち絵がアンフォーカスしたときの強さ(暗さ)です。大きいほど暗くなります。
 * @default 68
 * @type number
 * @min -255
 * @max 255
 *
 * @help CharacterPictureManager.js
 *
 * 複数の画像から構成される立ち絵を管理、表示できます。
 * プラグインパラメータから画像と表示条件、表示したいシーンを登録します。
 * 以下の特徴があります。
 * ・HP残量やステート、装備、職業、スイッチなど条件に応じた立ち絵の変化
 * ・戦闘中は行動時、ダメージ時など戦況に応じた画像の切り替え
 * ・複数の画像を使った衣装差分や表情差分の作成
 * ・同一の立ち絵を戦闘画面、メニュー画面、マップ画面で使い回しが可能
 *
 * また、別途公開しているAPNGピクチャプラグインと組み合わせると
 * 立ち絵をアニメーションできます。ただし、使いすぎに注意してください。
 *
 * ●メモ欄条件に指定方法
 * 表示条件のメモ欄に『aaa』と指定した場合、対象アクターのデータベース(※)に
 * 以下のメモ欄が含まれているときに立ち絵が表示されます。
 * <StandPicture:aaa>
 * ※アクター、職業、武器、防具、ステートが該当
 *
 * ●画像の座標指定支援機能
 * テストプレー時のみ、立ち絵をドラッグすることで座標の確認、調整ができます。
 * 画面上に現在の基準座標と固有座標が表示されます。
 * Ctrlキーを押していると奥の画像が、押していないと手前の画像が選択されます。
 * Shiftキーを押していると基準座標を、押していないと固有座標を調整します。
 *
 * ●立ち絵ファイルの動的設定(上級者向け)
 * 立ち絵を大量に使いたい場合にファイル名を命名規則に従って動的に決定できます。
 * ファイルが存在しないとエラーになること、未使用ファイルの自動削除機能で
 * ファイルが削除される場合があるので上級者向けです。
 * 以下の規則に従ってファイル名が変換されます。
 *
 * {hp:40,60,80}
 * HPレートが指定した閾値に従ってインデックスに変換されます。
 * 上記の例では以下の数値に変換されます。
 *   0%-39% のとき:0
 *  40%-59% のとき:1
 *  60%-80% のとき:2
 *  80%-100%のとき:3
 *
 * {stateId}
 *  もっとも優先度の高いステートIDに変換されます。
 *  ただしステートのメモ欄に<NoStandPicture>と記述すると対象外になります。
 *
 * {switch:3}
 *  スイッチ[3]がONのとき[1]に、OFFのとき[0]に変換されます。
 *
 * {variable:4}
 *  変数[4]の値に変換されます。
 *
 * {action}
 *  行動中のとき[1]に、そうでないときに[0]に変換されます。
 *
 * {damage}
 *  被ダメージ時に[1]に、そうでないときに[0]に変換されます。
 *
 * {note}
 *  データベースのメモ欄の<StandPicture>で指定した値に変換されます。
 *  <StandPicture:aaa>と記述するとaaaに変換されます。
 *  アクター、職業、武器、防具、ステートのメモ欄が対象です。
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

/*~struct~StandPictureActor:
 *
 * @param ActorId
 * @text アクター
 * @desc 立ち絵を表示する対象のアクターです。
 * @default 1
 * @type actor
 *
 * @param Name
 * @text 名称
 * @desc 区別するための名称です。プラグイン上は特に意味はありません。
 * @default
 *
 * @param Opacity
 * @text 不透明度
 * @desc 立ち絵の不透明度です。
 * @default 255
 * @type number
 * @max 255
 *
 * @param X
 * @text 固有X座標
 * @desc 立ち絵のX座標です。シーンごとの基準座標を加算した値が実際の表示座標です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param Y
 * @text 固有Y座標
 * @desc 立ち絵のY座標です。シーンごとの基準座標を加算した値が実際の表示座標です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param ScaleX
 * @text X拡大率
 * @desc 立ち絵の横方向の拡大率です。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param ScaleY
 * @text Y拡大率
 * @desc 立ち絵の縦方向の拡大率です。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param OutOfShake
 * @text シェイク対象外
 * @desc この画像を立ち絵シェイクの対象から外します。
 * @default false
 * @type boolean
 *
 * @param SpriteSheet
 * @text スプライトシート
 * @desc 立ち絵の画像をスプライトシートから取得したい場合に指定します。
 * @type struct<SpriteSheet>

 * @param FileList
 * @text 立ち絵リスト
 * @desc 表示する立ち絵と条件のリストです。条件を満たした立ち絵が1枚だけ(リストの下が優先)表示されます。
 * @default []
 * @type struct<StandPicture>[]
 *
 * @param DynamicFileName
 * @text 動的ファイル名
 * @desc 立ち絵ファイル名を動的に生成します。立ち絵リストに条件を満たしたファイルがあればそちらが優先されます。
 * @default
 * @type combo
 * @option image_{hp:40,60,80}
 * @option image_{stateId}
 * @option image_{switch:1}
 * @option image_{variable:1}
 * @option image_{damage}
 * @option image_{action}
 * @option image_{note}
 *
 * @param ShowPictureSwitch
 * @text 表示スイッチ
 * @desc 指定した場合、スイッチがONのときのみ立ち絵が表示されます。
 * @default 0
 * @type switch
 *
 * @param UnFocusSwitch
 * @text アンフォーカススイッチ
 * @desc 指定した場合、スイッチがONのとき立ち絵が暗くなります。
 * @default 0
 * @type switch
 *
 * @param MirrorSwitch
 * @text 反転スイッチ
 * @desc 指定した場合、スイッチがONのとき立ち絵が反転します。
 * @default 0
 * @type switch
 *
 * @param TouchSwitch
 * @text タッチスイッチ
 * @desc 指定した場合、ピクチャをタッチ、クリックすることでスイッチがONになります。ピクチャの透明色は考慮しません。
 * @default 0
 * @type switch
 *
 */

/*~struct~StandPicture:
 *
 * @param FileName
 * @text ファイル名
 * @desc 立ち絵のファイル名です。
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param HpUpperLimit
 * @text HP条件(上限)
 * @desc HP割合が指定値以下の場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type number
 * @max 100
 * @min 0
 *
 * @param HpLowerLimit
 * @text HP条件(下限)
 * @desc HP割合が指定値以上の場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type number
 * @max 100
 * @min 0
 *
 * @param Action
 * @text 行動中条件
 * @desc アクターが行動中の場合に表示条件を満たします。
 * @default false
 * @type boolean
 *
 * @param Motion
 * @text モーション条件
 * @desc アクターが指定モーションを取っている間、表示条件を満たします。フロントビューでも機能します。
 * @default
 * @type select
 * @option なし
 * @value
 * @option 前進
 * @value walk
 * @option 待機
 * @value wait
 * @option 詠唱待機
 * @value chant
 * @option 防御
 * @value guard
 * @option ダメージ
 * @value damage
 * @option 回避
 * @value evade
 * @option 突き
 * @value thrust
 * @option 振り
 * @value swing
 * @option 飛び道具
 * @value missile
 * @option 汎用スキル
 * @value skill
 * @option 魔法
 * @value spell
 * @option アイテム
 * @value item
 * @option 逃走
 * @value escape
 * @option 勝利
 * @value victory
 * @option 瀕死
 * @value dying
 * @option 状態異常
 * @value abnormal
 * @option 睡眠
 * @value sleep
 * @option 戦闘不能
 * @value dead
 *
 * @param State
 * @text ステート条件
 * @desc 指定したステートが有効な場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type state
 *
 * @param Weapon
 * @text 武器条件
 * @desc 指定した武器を装備している場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type weapon
 *
 * @param Armor
 * @text 防具条件
 * @desc 指定した防具を装備している場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type armor
 *
 * @param Note
 * @text メモ欄条件
 * @desc データベースのメモ欄<StandPicture:aaa>が指定値と等しい場合に表示条件を満たします。
 * @default
 *
 * @param Switch
 * @text スイッチ条件
 * @desc 指定したスイッチがONの場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type switch
 *
 * @param Script
 * @text スクリプト条件
 * @desc 指定したスクリプトがtrueを返した場合に表示条件を満たします。aでアクターオブジェクトを参照できます。
 * @default
 * @type combo
 * @option a.mpRate() < 0.5; // MPが50%以下
 * @option a.tpRate() < 0.5; // TPが50%以下
 *
 */

/*~struct~Scene:
 *
 * @param SceneName
 * @text 対象シーン
 * @desc 表示対象のシーンです。オリジナルのシーンを対象にする場合はシーンクラス名を直接記入します。
 * @type select
 * @default Scene_Battle
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
 * @param MemberPosition
 * @text メンバーごとの基準座標
 * @desc メンバーごとの立ち絵の基準座標です。パーティメンバーのぶんだけ登録します。
 * @default ["{\"X\":\"0\",\"Y\":\"0\"}","{\"X\":\"150\",\"Y\":\"0\"}","{\"X\":\"300\",\"Y\":\"0\"}","{\"X\":\"450\",\"Y\":\"0\"}"]
 * @type struct<Position>[]
 *
 * @param ActorPosition
 * @text アクターごとの基準座標
 * @desc アクター単位で基準座標を決めたい場合はこちらを指定します。指定がある場合、メンバーごとの基準座標より優先されます。
 * @default []
 * @type struct<ActorPosition>[]
 *
 * @param ScaleX
 * @text X拡大率
 * @desc 立ち絵の横方向の拡大率です。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param ScaleY
 * @text Y拡大率
 * @desc 立ち絵の縦方向の拡大率です。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param ShowPictureSwitch
 * @text 表示スイッチ
 * @desc 指定した場合、スイッチがONのときのみ立ち絵が表示されます。
 * @default 0
 * @type switch
 *
 * @param ShakeSwitch
 * @text シェイクスイッチ
 * @desc 指定したスイッチにONになると立ち絵がシェイクします。シェイク後、スイッチは自動でOFFになります。
 * @default 0
 * @type switch
 *
 * @param UnFocusSwitch
 * @text アンフォーカススイッチ
 * @desc 指定した場合、スイッチがONのとき立ち絵が暗くなります。
 * @default 0
 * @type switch
 *
 * @param MirrorSwitch
 * @text 反転スイッチ
 * @desc 指定した場合、スイッチがONのとき立ち絵が反転します。
 * @default 0
 * @type switch
 *
 * @param TouchSwitch
 * @text タッチスイッチ
 * @desc 指定した場合、ピクチャをタッチ、クリックすることでスイッチがONになります。ピクチャの透明色は考慮しません。
 * @default 0
 * @type switch
 *
 * @param Priority
 * @text 表示優先度
 * @desc 立ち絵の表示優先度です。
 * @default 0
 * @type select
 * @option 最前面
 * @value 0
 * @option ウィンドウの下
 * @value 1
 * @option アニメーションの下(戦闘、マップ画面のみ有効)
 * @value 2
 *
 * @param FadeFrame
 * @text フェード時間(フレーム)
 * @desc 指定した場合、表示非表示が切り替わったときに立ち絵がフェードイン/アウトします。
 * @default 0
 * @type number
 *
 */

/*~struct~Position:
 *
 * @param X
 * @text 基準X座標
 * @desc 立ち絵の基準X座標です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param Y
 * @text 基準Y座標
 * @desc 立ち絵の基準Y座標です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 */

/*~struct~ActorPosition:
 *
 * @param ActorId
 * @text アクターID
 * @desc 基準座標を設定する対象のアクターIDです。
 * @default 1
 * @type actor
 *
 * @param X
 * @text 基準X座標
 * @desc 立ち絵の基準X座標です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param Y
 * @text 基準Y座標
 * @desc 立ち絵の基準Y座標です。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 */

/*~struct~SpriteSheet:
 *
 * @param MaxColumn
 * @text 列数
 * @desc スプライトシートの総列数(縦方向)です。
 * @default 1
 * @type number
 * @min 1
 *
 * @param MaxRow
 * @text 行数
 * @desc スプライトシートの総行数(横方向)です。
 * @default 1
 * @type number
 * @min 1
 *
 * @param ColumnNumber
 * @text 列番号
 * @desc 切り出したい部分の行番号(縦方向)です。
 * @default 1
 * @type number
 * @min 1
 *
 * @param RowNumber
 * @text 行番号
 * @desc 切り出したい部分の行番号(横方向)です。
 * @default 1
 * @type number
 * @min 1
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.SceneList) {
        PluginManagerEx.throwError('Parameter[SceneList] is not found. ', script);
    }
    if (!param.PictureList) {
        PluginManagerEx.throwError('Parameter[PictureList] is not found. ', script);
    }
    const usePointAdjust = param.UsePointAdjust && Utils.isOptionValid('test');

    /**
     * 立ち絵パラメータを解析します
     */
    class StandPictureParam {
        setup(actor, scene, index) {
            this._actor = actor;
            this._base = this.findBasePosition(scene, index);
            this._shakeSwitch = scene.ShakeSwitch;
            this._standPictures = param.PictureList.filter(picture => picture.ActorId === actor.actorId());
            if (this._standPictures.length <= 0) {
                return false;
            }
            this._standPictures.forEach(picture => this.setupSceneParam(picture, scene));
            this.updatePictureFiles();
            return true;
        }

        setupSceneParam(picture, scene) {
            picture.SceneShowPictureSwitch = scene.ShowPictureSwitch;
            picture.SceneMirrorSwitch = scene.MirrorSwitch;
            picture.SceneScaleX = scene.ScaleX;
            picture.SceneScaleY = scene.ScaleY;
            picture.FadeFrame = scene.FadeFrame;
            picture.SceneUnFocusSwitch = scene.UnFocusSwitch;
            picture.SceneTouchSwitch = scene.TouchSwitch;
        }

        findBasePosition(scene, index) {
            if (scene.ActorPosition) {
                const base = scene.ActorPosition.find(item => item.ActorId === this._actor.actorId());
                if (base) {
                    return base;
                }
            }
            if (scene.MemberPosition && scene.MemberPosition[index]) {
                return scene.MemberPosition[index];
            }
            return null;
        }

        getBasePoint() {
            return this._base;
        }

        updatePictureFiles() {
            this._standPictures.forEach(picture => {
                if (picture.FileList) {
                    picture.FileList.clone().reverse().some(file => this.setFileNameIfValid(file, picture));
                }
                if (!picture.FileName && picture.DynamicFileName) {
                    picture.FileName = this.createDynamicFileName(picture.DynamicFileName);
                }
            });
            return this._standPictures;
        }

        setFileNameIfValid(file, picture) {
            picture.FileName = null;
            const a = this._actor;
            const conditions = [];
            conditions.push(() => !file.HpUpperLimit || file.HpUpperLimit >= a.hpRate() * 100);
            conditions.push(() => !file.HpLowerLimit || file.HpLowerLimit <= a.hpRate() * 100);
            conditions.push(() => !file.Motion || a.isMotionTypeValid(file.Motion));
            conditions.push(() => !file.Action || a.isAction());
            conditions.push(() => !file.State || a.isStateAffected(file.State));
            conditions.push(() => !file.Weapon || a.hasWeapon($dataWeapons[file.Weapon]));
            conditions.push(() => !file.Armor || a.hasArmor($dataArmors[file.Armor]));
            conditions.push(() => !file.Note || this.findStandPictureMeta() === file.Note);
            conditions.push(() => !file.Switch || $gameSwitches.value(file.Switch));
            conditions.push(() => !file.Script || eval(file.Script));
            if (conditions.every(condition => condition())) {
                picture.FileName = file.FileName;
                return true;
            } else {
                return false;
            }
        }

        createDynamicFileName(dynamicFileName) {
            return dynamicFileName
                .replace(/{hp:(.*?)}/gi, (_, p1) => this.findHpRateIndex(p1))
                .replace(/{stateId}/gi, () => this.findActorState())
                .replace(/{switch:(\d+?)}/gi, (_, p1) => this.findSwitch(p1))
                .replace(/{variable:(\d+?)}/gi, (_, p1) => this.findVariable(p1))
                .replace(/{note}/gi, () => this.findStandPictureMeta())
                .replace(/{action}/gi, () => this._actor.isAction() ? '1' : '0')
                .replace(/{damage}/gi, () => this._actor.isDamage() ? '1' : '0');
        }

        findHpRateIndex(rateText) {
            const rates = rateText.split(',').map(item => parseInt(item));
            for (let i = 0; i < rates.length + 1; i++) {
                const min = rates[i - 1] || 0;
                const max = rates[i] || 100;
                const rate = this._actor.hpRate() * 100;
                if (rate >= min && rate <= max) {
                    return String(i);
                }
            }
            return '0';
        }

        findActorState() {
            const state = this._actor.states().filter(state => !state.meta.NoStandPicture)[0];
            return String(state ? state.id : 0);
        }

        findSwitch(switchText) {
            return $gameSwitches.value(parseInt(switchText)) ? '1' : '0';
        }

        findVariable(variableText) {
            return String($gameVariables.value(parseInt(variableText)));
        }

        findStandPictureMeta() {
            let meta = '';
            this._actor.traitObjects().some(obj => {
                meta = PluginManagerEx.findMetaValue(obj, 'StandPicture');
                return !!meta;
            });
            return meta;
        }

        isDamage() {
            return this._actor && this._actor.isDamage();
        }

        getShakeSwitch() {
            return this._shakeSwitch;
        }
    }

    /**
     * Game_Actor
     */
    Game_Actor.prototype.requestPictureMotion = function(motionType) {
        this._pictureMotion = motionType;
        this._motionFrame = Graphics.frameCount;
    };

    Game_Actor.prototype.isMotionTypeValid = function(motionType) {
        if (this._pictureMotion !== motionType) {
            return false;
        }
        if (Sprite_Actor.MOTIONS[motionType].loop) {
            return true;
        }
        if (this._motionFrame && this._motionFrame + 30 > Graphics.frameCount) {
            return true;
        }
        this._pictureMotion = '';
        this._motionFrame = 0;
        return false;
    };

    Game_Actor.prototype.isDamage = function() {
        return this.isMotionTypeValid('damage');
    };

    Game_Actor.prototype.isAction = function() {
        return this._performAction;
    };

    const _Game_Actor_performDamage = Game_Actor.prototype.performDamage;
    Game_Actor.prototype.performDamage = function() {
        _Game_Actor_performDamage.apply(this, arguments);
        this.requestPictureMotion('damage');
    };

    const _Game_Actor_performAction = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        _Game_Actor_performAction.apply(this, arguments);
        this._performAction = true;
    };

    const _Game_Actor_performActionEnd = Game_Actor.prototype.performActionEnd;
    Game_Actor.prototype.performActionEnd = function() {
        _Game_Actor_performActionEnd.apply(this, arguments);
        this._performAction = false;
    };

    const _Game_Battler_requestMotion = Game_Battler.prototype.requestMotion;
    Game_Battler.prototype.requestMotion = function(motionType) {
        _Game_Battler_requestMotion.apply(this, arguments);
        if (this instanceof Game_Actor) {
            this.requestPictureMotion(motionType);
        }
    };

    /**
     * Spriteset_Base
     */
    Spriteset_Base.prototype.appendToEffect = function(displayObject) {
        this._effectsContainer.addChild(displayObject);
    };

    const _Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function(motionType) {
        if (this._actor) {
            const newMotion = Sprite_Actor.MOTIONS[motionType];
            if (this._motion !== newMotion) {
                this._actor.requestPictureMotion(motionType);
            }
        }
        _Sprite_Actor_startMotion.apply(this, arguments);
    };

    /**
     * Scene_Base
     */
    const _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function() {
        _Scene_Base_createWindowLayer.apply(this, arguments);
        this.createAllStandPicture();
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        if (this._standSpriteScene) {
            this.updateAllStandPicture();
        }
    };

    Scene_Base.prototype.createAllStandPicture = function() {
        this._standSprites = new Map();
        const sceneName = PluginManagerEx.findClassName(this);
        this._standSpriteScene = param.SceneList.filter(item => item.SceneName === sceneName)[0];
        if (this._standSpriteScene) {
            this.createStandPictureContainer();
            this.updateAllStandPicture();
        }
    };

    Scene_Base.prototype.createStandPictureContainer = function() {
        const container = new Sprite();
        const priority = this._standSpriteScene.Priority;
        if (priority === 1) {
            const index = this.children.indexOf(this._windowLayer);
            this.addChildAt(container, index);
        } else if (priority === 2 && this._spriteset) {
            this._spriteset.appendToEffect(container);
        } else {
            this.addChild(container);
        }
        this._standSpriteContainer = container;
    };

    Scene_Base.prototype.updateAllStandPicture = function() {
        const members = this.findStandPictureMember();
        if (!members) {
            return;
        }
        members.forEach((member, index) => {
            this.updateStandPicture(member, index);
        });
        const membersId = members.map(member => member.actorId());
        this._standSprites.forEach((value, key) => {
            if (!membersId.includes(key)) {
                this.removeStandPicture($gameActors.actor(key));
            }
        });
    };

    Scene_Base.prototype.findStandPictureMember = function() {
        return $gameParty ? $gameParty.members() : null;
    };

    Scene_Base.prototype.updateStandPicture = function(actor, index) {
        const id = actor.actorId();
        if (this._standSprites.has(id)) {
            return;
        }
        const pictureParam = new StandPictureParam();
        const result = pictureParam.setup(actor, this._standSpriteScene, index);
        if (!result) {
            return;
        }
        const sprite = usePointAdjust ? new Sprite_StandPictureWithDrag(pictureParam) :
            new Sprite_StandPicture(pictureParam);
        this._standSpriteContainer.addChild(sprite);
        this._standSprites.set(id, sprite);
    };

    Scene_Base.prototype.removeStandPicture = function(actor) {
        const id = actor.actorId();
        if (!this._standSprites.has(id)) {
            return;
        }
        this._standSpriteContainer.removeChild(this._standSprites.get(id));
        this._standSprites.delete(id);
    };

    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.apply(this, arguments);
        if (this._standSprites) {
            this._standSprites.forEach(picture => picture.destroyStandApng());
        }
    };

    Scene_Skill.prototype.findStandPictureMember = function() {
        return [this.actor()];
    };

    Scene_Equip.prototype.findStandPictureMember = function() {
        return [this.actor()];
    };

    Scene_Status.prototype.findStandPictureMember = function() {
        return [this.actor()];
    };

    Scene_Name.prototype.findStandPictureMember = function() {
        return [this._actor];
    };

    /**
     * Sprite_StandPicture
     */
    class Sprite_StandPicture extends Sprite {
        constructor(pictureParam) {
            super();
            this.setup(pictureParam);
        }

        setup(pictureParam) {
            this._pictures = pictureParam;
            this._pictures.updatePictureFiles().forEach(picture => this.addChild(this.createChild(picture)));
            this._shake = 0;
            this.updatePosition();
        }

        updatePosition() {
            const basePoint = this._pictures.getBasePoint();
            this.x = basePoint.X + this.getShakeX();
            this.y = basePoint.Y + this.getShakeY();
            this.children.forEach(child => {
                if (child.isOutOfShake()) {
                    child.x -= this.getShakeX();
                    child.y -= this.getShakeY();
                }
            })
        }

        setupShake() {
            if (this._pictures.isDamage() && param.ShakeOnDamage) {
                if (!this._damage) {
                    this._damage = true;
                    this.shake();
                }
            } else {
                this._damage = false;
            }
            const shakeSwitch = this._pictures.getShakeSwitch();
            if ($gameSwitches.value(shakeSwitch)) {
                $gameSwitches.setValue(shakeSwitch, false);
                this.shake();
            }
        }

        shake() {
            this._shakePower     = param.ShakePower || 1;
            this._shakeSpeed     = param.ShakeSpeed || 1;
            this._shakeDuration  = param.ShakeDuration || 30;
            this._shakeRotation  = (param.ShakeRotation || 0) * Math.PI / 180;
            this._shakeDirection = 1;
        }

        updateShake() {
            const delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
                this._shake = 0;
            } else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        }

        getShakeX() {
            return this._shake ? this._shake * Math.cos(this._shakeRotation) : 0;
        }

        getShakeY() {
            return this._shake ? this._shake * Math.sin(this._shakeRotation) : 0;
        }

        createChild(picture) {
            return new Sprite_StandPictureChild(picture);
        }

        update() {
            this._pictures.updatePictureFiles();
            super.update();
            this.setupShake();
            if (this._shakeDuration > 0 || this._shake !== 0) {
                this.updateShake();
            } else {
                this._shakeDuration = 0;
            }
            this.updatePosition();
        }

        destroyStandApng() {
            this.children.forEach(child => {
                if (child.destroyApngIfNeed) {
                    child.destroyApngIfNeed();
                }
            })
        }
    }

    /**
     * Sprite_StandPictureChild
     */
    class Sprite_StandPictureChild extends Sprite_Clickable {
        constructor(picture) {
            super();
            this.setup(picture);
        }

        setup(picture) {
            this._picture = picture;
            this._openness = 0;
            if (param.Origin === 1) {
                this.anchor.x = 0.5;
                this.anchor.y = 0.5;
            } else if (param.Origin === 2) {
                this.anchor.x = 0.5;
                this.anchor.y = 1.0;
            }
            this.update();
        }

        updatePosition() {
            this.x = this._picture.X;
            this.y = this._picture.Y;
        }

        isOutOfShake() {
            return this._picture.OutOfShake;
        }

        update() {
            super.update();
            this.updatePosition();
            this.updateBitmap();
            this.updateScale();
            this.updateVisibility();
            this.updateFocus();
        }

        updateBitmap() {
            const file = this._picture.FileName;
            if (this._fileName === file) {
                return;
            }
            if (this.addApngChild) {
                this.addApngChild(file);
            }
            if (!this._apngSprite) {
                const bitmap = ImageManager.loadPicture(file);
                bitmap.addLoadListener(() => this.setBitmap(bitmap));
            }
            this._fileName = file;
        }

        onPress() {
            if (!this.isShowing()) {
                return;
            }
            if (this._picture.TouchSwitch > 0) {
                $gameSwitches.setValue(this._picture.TouchSwitch, true);
                TouchInput.clear();
            }
            if (this._picture.SceneTouchSwitch > 0) {
                $gameSwitches.setValue(this._picture.SceneTouchSwitch, true);
                TouchInput.clear();
            }
        }

        setBitmap(bitmap) {
            this.bitmap = bitmap;
            const sheet = this._picture.SpriteSheet;
            if (sheet) {
                const width = this.bitmap.width / sheet.MaxColumn;
                const height = this.bitmap.height / sheet.MaxRow;
                const x = (sheet.ColumnNumber - 1) * width;
                const y = (sheet.RowNumber - 1) * height;
                this.setFrame(x, y, width, height);
            }
        }

        updateVisibility() {
            this._openness = (this._openness + this.calcDeltaOpenness()).clamp(0, 1);
            this.opacity = this._picture.Opacity * this._openness;
        }

        calcDeltaOpenness() {
            const openness = 1 / (this._picture.FadeFrame || 1);
            return this.isShowing() ? openness : -openness;
        }

        isShowing() {
            const switchId = this._picture.ShowPictureSwitch;
            if (switchId && !$gameSwitches.value(switchId)) {
                return false;
            }
            const sceneSwitchId = this._picture.SceneShowPictureSwitch;
            if (sceneSwitchId && !$gameSwitches.value(sceneSwitchId)) {
                return false;
            }
            return true;
        }

        updateScale() {
            this.scale.x = (this._picture.ScaleX / 100) || 1;
            this.scale.y = (this._picture.ScaleY / 100) || 1;
            if (this._picture.SceneScaleX) {
                this.scale.x *= this._picture.SceneScaleX / 100;
            }
            if (this._picture.SceneScaleY) {
                this.scale.y *= this._picture.SceneScaleY / 100;
            }
            if (this.isMirror()) {
                this.scale.x *= -1;
            }
        }

        updateFocus() {
            if (this.isUnFocus()) {
                const power = param.UnFocusPower || 0;
                this.setColorTone([-power, -power, -power, 0]);
            } else {
                this.setColorTone([0, 0, 0, 0]);
            }
        }

        isUnFocus() {
            const switchId = this._picture.UnFocusSwitch;
            if (switchId && $gameSwitches.value(switchId)) {
                return true;
            }
            const sceneSwitchId = this._picture.SceneUnFocusSwitch;
            if (sceneSwitchId && $gameSwitches.value(sceneSwitchId)) {
                return true;
            }
            return false;
        }

        isMirror() {
            const switchId = this._picture.MirrorSwitch;
            if (switchId && $gameSwitches.value(switchId)) {
                return true;
            }
            const sceneSwitchId = this._picture.SceneMirrorSwitch;
            if (sceneSwitchId && $gameSwitches.value(sceneSwitchId)) {
                return true;
            }
            return false;
        }

        loadApngSprite(name) {
            return SceneManager.tryLoadApngPicture(name);
        }
    }

    // for Drag by test play
    if (!usePointAdjust) {
        return;
    }

    let anySpriteDrag = false;

    /**
     * Sprite_StandPictureWithDrag
     */
    class Sprite_StandPictureWithDrag extends Sprite_StandPicture {
        constructor(pictureParam) {
            super(pictureParam);
        }

        createChild(picture) {
            return new Sprite_StandPictureChildWithDrag(picture);
        }

        update() {
            super.update();
            const children = Input.isPressed('control') ? this.children : this.children.clone().reverse()
            children.forEach(sprite => sprite.updateDrag());
        }
    }

    /**
     * Sprite_StandPictureChildWithDrag
     */
    class Sprite_StandPictureChildWithDrag extends Sprite_StandPictureChild {
        constructor(picture) {
            super(picture);
            this._drag = false;
        }

        updateDrag() {
            this.startDragIfNeed();
            if (!this._drag) {
                return;
            }
            const dx = TouchInput.x - this._dx;
            const dy = TouchInput.y - this._dy;
            if (this._baseDrag) {
                this.parent.x = dx;
                this.parent.y = dy;
            } else {
                this.x = dx;
                this.y = dy;
            }
            Graphics.drawPositionInfo(`BaseX:${this.parent.x} BaseY:${this.parent.y} PictureX:${this.x} PictureY:${this.y} `);
            if (!TouchInput.isPressed()) {
                this.stopDrag();
            }
        }

        startDragIfNeed() {
            if (!this._requestDrag && !this._drag) {
                return;
            }
            this._requestDrag = false;
            if (this._drag || anySpriteDrag) {
                return;
            }
            anySpriteDrag = true;
            this._drag = true;
            if (Input.isPressed("shift")) {
                this._dx = TouchInput.x - this.parent.x;
                this._dy = TouchInput.y - this.parent.y;
                this._baseDrag = true;
            } else {
                this._dx = TouchInput.x - this.x;
                this._dy = TouchInput.y - this.y;
                this._baseDrag = false;
            }
            this.setBlendColor([255, 255, 255, 128]);
        }

        stopDrag() {
            anySpriteDrag = false;
            this._drag = false;
            this.setBlendColor([0, 0, 0, 0]);
        }

        onPress() {
            super.onPress();
            if (this.canDrag()) {
                this._requestDrag = true;
            }
        }

        canDrag() {
            if (this._apngSprite) {
                return true;
            }
            const pos = this.findLocalTouchPos();
            return this.bitmap.getAlphaPixel(pos.x, pos.y) !== 0;
        }

        findLocalTouchPos() {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            const pos = this.worldTransform.applyInverse(touchPos);
            pos.x += this.width * this.anchor.x;
            pos.y += this.height * this.anchor.y;
            return pos;
        }
    }

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements        = function() {
        _Graphics__createAllElements.apply(this, arguments);
        this._createPositionInfo();
    };

    Graphics._createPositionInfo = function() {
        const div            = document.createElement('div');
        div.id               = 'position';
        div.style.display    = 'none';
        div.style.position   = 'absolute';
        div.style.left       = '100px';
        div.style.top        = '5px';
        div.style.background = '#222';
        div.style.opacity    = '0.8';
        div.style['z-index'] = '8';
        div.style.color      = '#fff';
        this._positionDiv     = div;
        document.body.appendChild(div);
    };

    Graphics.drawPositionInfo = function(text) {
        if (text) {
            this._positionDiv.style.display = 'block';
            this._positionDiv.textContent   = text;
        } else {
            this._positionDiv.style.display = 'none';
        }
    };
})();
