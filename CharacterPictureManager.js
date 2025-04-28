//=============================================================================
// CharacterPictureManager.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.18.2 2025/04/28 アクターが複数のStandPictureのタグを持てるよう変更
// 3.18.1 2025/04/28 3.18.0の機能でシェイクスイッチを一切指定していない立ち絵を表示させようとするとエラーになる問題を修正
// 3.18.0 2025/04/27 立ち絵のシェイク機能を立ち絵ごとに行う仕様に変更
// 3.17.3 2025/01/19 表示優先度に関するヘルプを追記
// 3.17.2 2024/08/08 誤って購入したログを削除
// 3.17.1 2024/08/07 パラメータにスクリプトを使ったときアクター変数[a]が使えない問題を修正
// 3.17.0 2024/07/20 立ち絵の合成方法を変更できる機能を追加
// 3.16.1 2024/05/19 表示優先度を「アニメーションの下」に設定しているとき、戦闘画面で立ち絵の表示位置がずれる問題を修正
// 3.16.0 2024/01/24 入力中のアクターコマンドによって立ち絵を切り替える機能を追加
// 3.15.1 2023/12/05 プラグインパラメータの一部初期値を使いやすいように変更
// 3.15.0 2023/12/05 立ち絵ファイルの切り替わり時にクロスフェードできる機能を追加
// 3.14.1 2023/10/06 動的ファイル名のみを指定しているとき、画像が適切に更新されなくなっていた問題を修正
// 3.14.0 2023/09/20 アイテム、スキル画面ではアクターウィンドウで選択中のアクターのみ立ち絵が表示される設定を追加
// 3.13.0 2023/05/06 行動中条件、入力中条件の立ち絵は、戦闘中以外では常に条件を満たすよう仕様変更
// 3.12.0 2023/04/09 カスタムメニュープラグインで作成した画面に立ち絵を表示するとき、単一アクターのカスタムメニューなら立ち絵も単一表示になるよう修正
// 3.11.0 2022/12/30 アクターがコマンド入力中のみ立ち絵を表示する機能を追加
// 3.10.0 2022/12/22 フロントビュー採用時、戦闘アニメの表示対象を立ち絵にできる機能を追加
//                   パラメータ「原点」の設定が正常に動作していなかった問題を修正
// 3.9.0 2022/11/10 ショップ画面と装備画面において装備を選んだ時点で立ち絵に反映できる機能を追加
// 3.8.1 2022/11/06 ヘルプの記述を修正
// 3.8.0 2022/10/22 立ち絵の更新を手動(スイッチ)で行える機能を追加
// 3.7.0 2022/10/20 パフォーマンス対策
// 3.6.0 2022/10/08 立ち絵の表示条件にメッセージ表示中かどうかと変数による判定を追加
// 3.5.0 2022/09/11 基準座標が取得できないメンバーがいた場合にエラーになる問題を修正
// 3.4.0 2022/09/07 現在のシーンによって表示する立ち絵画像を出し分けられる機能を追加
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
 * @orderAfter PluginCommonBase
 * @orderAfter SceneCustomMenu
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
 * @desc 立ち絵を表示したいシーンのリストです。シーンごとに基準座標を設定します。同一シーンのデータは複数定義できません。
 * @default ["{\"SceneName\":\"Scene_Battle\",\"MemberPosition\":\"[\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"160\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"480\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"320\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"480\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"480\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"480\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"640\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"480\\\\\\\"}\\\"]\",\"ActorPosition\":\"[]\",\"ScaleX\":\"100\",\"ScaleY\":\"100\",\"ShowPictureSwitch\":\"0\",\"ShakeSwitch\":\"0\",\"UnFocusSwitch\":\"0\",\"MirrorSwitch\":\"0\",\"TouchSwitch\":\"0\",\"Priority\":\"0\",\"FadeFrame\":\"0\",\"CrossFadeFrame\":\"0\",\"UpdateInterval\":\"1\",\"UpdateSwitch\":\"0\"}"]
 * @type struct<Scene>[]
 *
 * @param Origin
 * @text 原点
 * @desc 立ち絵画像の原点です。全画像で共通の設定です。戦闘アニメを立ち絵に表示する際は『中央下』を設定します。
 * @default 2
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
 * @param MenuActorOnly
 * @text メニューアクターのみ表示
 * @desc 装備、スキル、ステータス、名前画面では表示対象のアクターの立ち絵のみを表示します。
 * @default true
 * @type boolean
 *
 * @param SelectActorOnly
 * @text 選択アクターのみ表示
 * @desc アイテム、スキル画面ではアクターウィンドウで選択中のアクターの立ち絵のみを表示します。
 * @default false
 * @type boolean
 *
 * @param DressUp
 * @text 試着機能
 * @desc ショップ画面と装備画面において装備を選んだ時点で立ち絵に反映されます。
 * @default true
 * @type boolean
 *
 * @param UseAnimationTarget
 * @text 戦闘アニメ対象にする
 * @desc フロントビューの戦闘アニメの対象が立ち絵になります。立ち絵の表示優先度を『アニメーションの下』に設定してください。
 * @default false
 * @type boolean
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
 * APNGはクロスフェード機能の対象外となります。
 *
 * ●メモ欄条件の指定方法
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
 * @param ShakeSwitch
 * @text シェイクスイッチ
 * @desc 指定したスイッチにONになると立ち絵がシェイクします。シェイク後、スイッチは自動でOFFになります。
 * @default 0
 * @type switch
 *
 * @param OutOfShake
 * @text シェイク対象外
 * @desc この画像パーツを立ち絵シェイクの対象から外します。
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
 * @param BlendMode
 * @text 合成方法
 * @desc 立ち絵の合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
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
 * @param Inputting
 * @text 入力中条件
 * @desc アクターがコマンド入力の場合に表示条件を満たします。戦闘中以外は常に表示条件を満たします。
 * @default false
 * @type boolean
 *
 * @param InputCommand
 * @text 入力コマンド条件
 * @desc 入力中条件を有効にしたときの対象コマンドを指定します。なしを設定すると、常に表示条件を満たします。
 * @default
 * @type select
 * @parent Inputting
 * @option なし
 * @value
 * @option 攻撃
 * @value attack
 * @option 防御
 * @value guard
 * @option スキル
 * @value skill
 * @option アイテム
 * @value item
 *
 * @param InputSkillType
 * @text 入力スキルタイプ条件
 * @desc 入力コマンド条件をスキルにしたときの対象スキルタイプを指定します。
 * @default 1
 * @type number
 * @min 1
 * @parent Inputting
 *
 * @param Action
 * @text 行動中条件
 * @desc アクターが行動中の場合に表示条件を満たします。戦闘中以外は常に表示条件を満たします。
 * @default false
 * @type boolean
 *
 * @param Motion
 * @text モーション条件
 * @desc アクターが指定モーションを取っている間、表示条件を満たします。フロントビューでも機能します。戦闘中以外は表示条件を満たしません。
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
 * @param Scene
 * @text シーン条件
 * @desc 現在のシーンが選択したシーンであるときに表示条件を満たします。
 * @default none
 * @type select
 * @default
 * @option 条件なし
 * @value
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
 * @param Note
 * @text メモ欄条件
 * @desc データベースのメモ欄<StandPicture:aaa>が指定値と等しい場合に表示条件を満たします。
 * @default
 *
 * @param Message
 * @text メッセージ条件
 * @desc 指定した場合、メッセージ表示中のみ条件を満たします。
 * @default false
 * @type boolean
 *
 * @param Face
 * @text フェイス条件
 * @desc 指定した場合、メッセージ表示中かつフェイス画像がアクターのフェイスと一致するとき条件を満たします。
 * @default false
 * @type boolean
 *
 * @param Speaker
 * @text スピーカー条件
 * @desc 指定した場合、メッセージ表示中かつメッセージの名前がアクターの名前と一致するとき条件を満たします。
 * @default false
 * @type boolean
 *
 * @param Switch
 * @text スイッチ条件
 * @desc 指定したスイッチがONの場合に表示条件を満たします。0を指定すると条件判定を行いません。
 * @default 0
 * @type switch
 *
 * @param Variable
 * @text 変数条件
 * @desc 指定した変数が条件を満たしたときに表示条件を満たします。判定種別とオペランドを別途指定します。
 * @default 0
 * @type variable
 *
 * @param VariableType
 * @parent Variable
 * @text 判定種別
 * @desc 変数と値との比較方法です。変数値が左辺、オペランドが右辺です。
 * @default 0
 * @type select
 * @option =(等しい)
 * @value 0
 * @option >=(以上)
 * @value 1
 * @option <=(以下)
 * @value 2
 * @option >(より大きい)
 * @value 3
 * @option <(より小さい)
 * @value 4
 * @option !=(異なる)
 * @value 5
 *
 * @param VariableOperand
 * @parent Variable
 * @text オペランド
 * @desc 変数と比較される値です。変数値との比較にしたい場合は制御文字\v[n]を指定します。
 * @default 0
 * @type number
 * @min -999999999
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
 * @default ["{\"X\":\"160\",\"Y\":\"480\"}","{\"X\":\"320\",\"Y\":\"480\"}","{\"X\":\"480\",\"Y\":\"480\"}","{\"X\":\"640\",\"Y\":\"480\"}"]
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
 * @desc 立ち絵の表示優先度です。画面のフェードアウトに立ち絵を含めたい場合2を選択してください。
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
 * @text フェード時間
 * @desc 指定した場合、表示非表示が切り替わったときに立ち絵がフェードイン/アウトします。
 * @default 0
 * @type number
 *
 * @param CrossFadeFrame
 * @text クロスフェード時間
 * @desc 指定した場合、表示された立ち絵が切り替わったときに立ち絵がクロスフェードします。
 * @default 0
 * @type number
 *
 * @param UpdateInterval
 * @text 更新間隔
 * @desc 立ち絵の表示条件を確認するインターバルです。多数の立ち絵を表示してパフォーマンスが低下する場合に変更します。
 * @default 1
 * @type number
 *
 * @param UpdateSwitch
 * @text 更新スイッチ
 * @desc スイッチがONのとき立ち絵の表示条件を確認します。この設定を有効にすると、フレーム毎の自動更新は無効になります。
 * @default 0
 * @type switch
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
            if (!this._base) {
                return false;
            }
            this._standPictures = param.PictureList.filter(picture => picture.ActorId === actor.actorId());
            this._updateCondition = {
                UpdateInterval: scene.UpdateInterval,
                UpdateSwitch: scene.UpdateSwitch
            }
            if (this._standPictures.length <= 0) {
                return false;
            }
            this._standPictures.forEach(picture => this.setupSceneParam(picture, scene));
            this._shakeSwitch = this._standPictures.find(picture => picture.ShakeSwitch)?.ShakeSwitch || 0;
            this.createCondition();
            this.updatePictureFiles();
            return true;
        }

        changeActorIfNeed(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
            }
        }

        createCondition() {
            const conditions = [];
            const a = this._actor;
            conditions.push(file => !file.HpUpperLimit || file.HpUpperLimit >= this._actor.hpRate() * 100);
            conditions.push(file => !file.HpLowerLimit || file.HpLowerLimit <= this._actor.hpRate() * 100);
            conditions.push(file => !file.Motion || this._actor.isMotionTypeValid(file.Motion));
            conditions.push(file => !file.Action || this._actor.isAction() || !$gameParty.inBattle());
            conditions.push(file => !file.Inputting ||
                this._actor.isInputCommand(file.InputCommand, file.InputSkillType) ||!$gameParty.inBattle());
            conditions.push(file => !file.State || this._actor.isStateAffected(file.State));
            conditions.push(file => !file.Weapon || this._actor.hasWeapon($dataWeapons[file.Weapon]));
            conditions.push(file => !file.Armor || this._actor.hasArmor($dataArmors[file.Armor]));
            conditions.push(file => !file.Scene || SceneManager._scene.isStandPictureScene(file.Scene));
            conditions.push(file => !file.Note || this.hasStandPictureMeta(file.Note));
            conditions.push(file => !file.Message || $gameMessage.isBusy());
            conditions.push(file => !file.Face || $gameMessage.isFaceActor(this._actor));
            conditions.push(file => !file.Speaker || $gameMessage.isSpeakerActor(this._actor));
            conditions.push(file => !file.Switch || $gameSwitches.value(file.Switch));
            conditions.push(file => !file.Variable || this.isVariableValid(file));
            conditions.push(file => !file.Script || eval(file.Script));
            this._conditions = conditions;
        }

        isNeedUpdatePicture() {
            const condition = this._updateCondition;
            if (condition.UpdateSwitch) {
                const value = $gameSwitches.value(condition.UpdateSwitch);
                if (value) {
                    $gameSwitches.setValue(condition.UpdateSwitch, false);
                }
                return value;
            } else if (condition.UpdateInterval) {
                return Graphics.frameCount % condition.UpdateInterval === 0;
            } else {
                return true;
            }
        }

        setupSceneParam(picture, scene) {
            picture.SceneShowPictureSwitch = scene.ShowPictureSwitch;
            picture.SceneMirrorSwitch = scene.MirrorSwitch;
            picture.SceneScaleX = scene.ScaleX;
            picture.SceneScaleY = scene.ScaleY;
            picture.FadeFrame = scene.FadeFrame;
            picture.CrossFadeFrame = scene.CrossFadeFrame;
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
                if (picture.FileList && picture.FileList.length > 0) {
                    picture.FileList.clone().reverse().some(file => this.setFileNameIfValid(file, picture));
                } else {
                    picture.FileName = null;
                }
                if (!picture.FileName && picture.DynamicFileName) {
                    picture.FileName = this.createDynamicFileName(picture.DynamicFileName);
                }
            });
            return this._standPictures;
        }

        setFileNameIfValid(file, picture) {
            picture.FileName = null;
            if (this._conditions.every(condition => condition(file))) {
                picture.FileName = file.FileName;
                picture.BlendMode = file.BlendMode;
                return true;
            } else {
                return false;
            }
        }

        isVariableValid(file) {
            const value1 = $gameVariables.value(file.Variable);
            const value2 = file.VariableOperand;
            switch (file.VariableType) {
                case 0:
                    return value1 === value2;
                case 1:
                    return value1 >= value2;
                case 2:
                    return value1 <= value2;
                case 3:
                    return value1 > value2;
                case 4:
                    return value1 < value2;
                case 5:
                    return value1 !== value2;
                default:
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

        hasStandPictureMeta(meta) {
            return this._actor.traitObjects().some(obj =>
                PluginManagerEx.findMetaValue(obj, 'StandPicture') === meta);
        }

        isDamage() {
            return this._actor && this._actor.isDamage();
        }

        getShakeSwitch() {
            return this._shakeSwitch;
        }
    }

    Game_Message.prototype.isFaceActor = function(gameActor) {
        return this._faceName === gameActor.faceName() && this._faceIndex === gameActor.faceIndex();
    };

    Game_Message.prototype.isSpeakerActor = function(gameActor) {
        return this._speakerName === gameActor.name();
    };

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

    Game_Battler.prototype.isInputCommand = function(command, skillType) {
        if (!this.isInputting()) {
            this._commandSymbol = null;
            this._commandSkillType = null;
            return false;
        } else if (command && this._commandSymbol !== command) {
            return false;
        } else if (command === 'skill' && this._commandSkillType !== skillType) {
            return false;
        } else {
            return true;
        }
    };

    Game_Battler.prototype.setCommandSymbol = function(symbol, skillType) {
        this._commandSymbol = symbol;
        this._commandSkillType = skillType;
    };

    const _Window_ActorCommand_select = Window_ActorCommand.prototype.select;
    Window_ActorCommand.prototype.select = function(index) {
        _Window_ActorCommand_select.apply(this, arguments);
        if (this._actor) {
            const symbol = this.currentSymbol();
            const ext = this.currentExt();
            this._actor.setCommandSymbol(symbol, ext);
        }
    };

    /**
     * Spriteset_Base
     */
    Spriteset_Base.prototype.appendToEffect = function(displayObject) {
        this._effectsContainer.addChild(displayObject);
        displayObject.x = -this._effectsContainer.x;
        displayObject.y = -this._effectsContainer.y;
    };

    Spriteset_Base.prototype.findTargetStand = function(target) {
        if (target instanceof Game_Actor) {
            return this.parent.findStandSprite(target);
        } else {
            return null;
        }
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite;
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        if (!$gameSystem.isSideView() && param.UseAnimationTarget) {
            const sprite = this.findTargetStand(target);
            if (sprite) {
                return sprite;
            }
        }
        return _Spriteset_Battle_findTargetSprite.apply(this, arguments);
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
        this._standActors = new Set();
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
        if (this._standActors.has(id)) {
            this._standSprites.get(id)?.changeActor(actor);
            return;
        }
        this._standActors.add(id);
        const pictureParam = new StandPictureParam();
        const existPicture = pictureParam.setup(actor, this._standSpriteScene, index);
        if (!existPicture) {
            return;
        }
        const sprite = usePointAdjust ? new Sprite_StandPictureWithDrag(pictureParam) :
            new Sprite_StandPicture(pictureParam);
        this._standSpriteContainer.addChild(sprite);
        this._standSprites.set(id, sprite);
    };

    Scene_Base.prototype.findStandSprite = function(actor) {
        return this._standSprites.get(actor.actorId());
    };

    Scene_Base.prototype.removeStandPicture = function(actor) {
        const id = actor.actorId();
        if (!this._standSprites.has(id)) {
            return;
        }
        this._standSpriteContainer.removeChild(this._standSprites.get(id));
        this._standSprites.delete(id);
        this._standActors.delete(id)
    };

    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.apply(this, arguments);
        if (this._standSprites) {
            this._standSprites.forEach(picture => picture.destroyStandApng());
        }
    };

    Scene_Base.prototype.isStandPictureScene = function(sceneName) {
        return this._standSpriteScene?.SceneName === sceneName;
    };

    Scene_Item.prototype.findStandPictureMember = function() {
        if (param.SelectActorOnly) {
            return this._actorWindow?.active ? [$gameParty.members()[this._actorWindow.index()]] : [];
        }
        return Scene_Base.prototype.findStandPictureMember.call(this);
    }

    Scene_Skill.prototype.findStandPictureMember = function() {
        if (param.SelectActorOnly) {
            return this._actorWindow?.active ? [$gameParty.members()[this._actorWindow.index()]] : [];
        }
        return param.MenuActorOnly ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
    };

    Scene_Equip.prototype.findStandPictureMember = function() {
        const tempActor = this._statusWindow?.getTempActor();
        if (param.MenuActorOnly) {
            return tempActor ? [tempActor] : [this.actor()];
        } else {
            const member = Scene_Base.prototype.findStandPictureMember.call(this);
            return member.map(actor => actor.actorId() === tempActor?.actorId() ? tempActor : actor);
        }
    };

    Scene_Status.prototype.findStandPictureMember = function() {
        return param.MenuActorOnly ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
    };

    Scene_Name.prototype.findStandPictureMember = function() {
        return param.MenuActorOnly ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
    };

    Scene_Shop.prototype.findStandPictureMember = function() {
        const tempActors = this._statusWindow?.getTempActors();
        const member = Scene_Base.prototype.findStandPictureMember.call(this);
        return member.map(actor => tempActors?.has(actor.actorId()) ? tempActors.get(actor.actorId()) : actor);
    };

    if (window.Scene_CustomMenu){
        Scene_CustomMenu.prototype.findStandPictureMember = function() {
            const changeable = !!this._customData.WindowList.find(win => win.ActorChangeable);
            return param.MenuActorOnly && changeable ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
        };
    }

    Window_EquipStatus.prototype.getTempActor = function() {
        return param.DressUp ? this._tempActor : null;
    };

    const _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
    Window_ShopStatus.prototype.refresh = function() {
        this._tempActors = new Map();
        _Window_ShopStatus_refresh.apply(this, arguments);
    };

    Window_ShopStatus.prototype.getTempActors = function() {
        return param.DressUp ? this._tempActors : null;
    };

    const _Window_ShopStatus_drawActorEquipInfo = Window_ShopStatus.prototype.drawActorEquipInfo;
    Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
        _Window_ShopStatus_drawActorEquipInfo.apply(this, arguments);
        if (param.DressUp) {
            this.appendTempActor(actor);
        }
    };

    Window_ShopStatus.prototype.appendTempActor = function(actor) {
        if (!actor.canEquip(this._item)) {
            return;
        }
        const slotId = this.findSlotId(actor);
        if (slotId !== -1) {
            const tempActor = JsonEx.makeDeepCopy(actor);
            tempActor.forceChangeEquip(slotId, this._item);
            this._tempActors.set(actor.actorId(), tempActor);
        }
    };

    Window_ShopStatus.prototype.findSlotId = function(actor) {
        return actor.equipSlots().findIndex(slot => slot === this._item.etypeId);
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
            if (param.Origin === 1) {
                this.anchor.x = 0.5;
                this.anchor.y = 0.5;
            } else if (param.Origin === 2) {
                this.anchor.x = 0.5;
                this.anchor.y = 1.0;
            }
        }

        changeActor(actor) {
            this._pictures.changeActorIfNeed(actor);
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
                if (this._shakeDuration <= 0) {
                    this.shake();
                } else {
                    $gameSwitches.setValue(shakeSwitch, false);
                }
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
            if (this._pictures.isNeedUpdatePicture()) {
                this._pictures.updatePictureFiles();
            }
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
            this.blendMode = this._picture.BlendMode || 0;
            this.updateCrossFade(file);
            if (this.addApngChild && file) {
                this.addApngChild(file);
            }
            if (!this._apngSprite && file) {
                const bitmap = ImageManager.loadPicture(file);
                bitmap.addLoadListener(() => this.setBitmap(bitmap));
            }
            this._fileName = file;
        }

        updateCrossFade(file) {
            if (this._crossFadeSprite) {
                this.removeCrossFade();
            }
            if (this._fileName && file && !this._apngSprite && this._picture.CrossFadeFrame > 0) {
                this.createCrossFade();
                this._fadeFrame = this._picture.CrossFadeFrame;
            } else {
                this._fadeFrame = this._picture.FadeFrame;
            }
        }

        createCrossFade() {
            this._crossFadeSprite = new Sprite_StandPictureChildCrossFade(this);
            this._openness = 0;
            this.parent.addChild(this._crossFadeSprite);
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
            if (this._crossFadeSprite) {
                this.updateCrossFadeVisibility();
            }
        }

        updateCrossFadeVisibility() {
            this._crossFadeSprite.opacity = this._picture.Opacity * (1 - this._openness);
            if (this._crossFadeSprite.opacity === 0) {
                this.removeCrossFade();
            }
        }

        removeCrossFade() {
            this.parent.removeChild(this._crossFadeSprite);
            this._crossFadeSprite = null;
        }

        calcDeltaOpenness() {
            const openness = 1 / (this._fadeFrame || 1);
            return this.isShowing() ? openness : -openness;
        }

        isShowing() {
            if (!this._fileName) {
                return false;
            }
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

    class Sprite_StandPictureChildCrossFade extends Sprite {
        constructor(baseSprite) {
            super();
            this.setup(baseSprite);
        }

        setup(baseSprite) {
            this.bitmap = baseSprite.bitmap;
            this.anchor.x = baseSprite.anchor.x;
            this.anchor.y = baseSprite.anchor.y;
            this.x = baseSprite.x;
            this.y = baseSprite.y;
            this.scale.x = baseSprite.scale.x;
            this.scale.y = baseSprite.scale.y;
        }

        isOutOfShake() {
            return false;
        }

        updateDrag() {}
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
