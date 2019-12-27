//=============================================================================
// MessageWindowPopup.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.14.9 2019/12/27 StandPictureEC.jsおよびMessageAlignmentEC.jsと組み合わせた場合に発生する競合を修正
// 2.14.8 2019/12/27 2.14.7の修正で一部制御文字を使用するとウィンドウ幅の計算が正しく行われない問題を修正
// 2.14.7 2019/12/22 不明な制御文字が挿入されたとき、ウィンドウの横幅が拡張されないよう修正
//                   StandPictureEC.jsでピクチャを表示したとき、初回のみポップアップウィンドウの座標が反映されない競合を修正
// 2.14.6 2019/12/07 YEP_MessageCore.jsでネームボックスを表示する際、同プラグインの位置調整が反映されない競合を修正
// 2.14.5 2019/07/21 YEP_MessageCore.jsでネームボックスを表示する際、特定の条件下で一瞬だけネームボックスが不正な位置に表示される問題を修正
// 2.14.4 2019/06/23 フキダシウィンドウを無効化したときのX座標の値をデフォルトのコアスクリプトの動作に準拠するよう修正
// 2.14.3 2019/06/18 MKR_MessageWindowCustom.jsとの連携で、フキダシウィンドウ有効時はフキダシの横幅と高さを優先するよう変更
// 2.14.2 2019/06/16 FTKR_ExMessageWindow2.jsおよびPauseSignToTextEnd.jsとの連携で、フキダシウィンドウ表示時にポーズサインがはみ出してしまう競合を修正
// 2.14.1 2019/06/16 2.14.0で追加したテール画像がフキダシウィンドウ無効のときも表示されていた問題を修正
// 2.14.0 2019/06/10 テール画像を別途指定できる機能を追加
// 2.13.0 2019/05/26 PauseSignToTextEnd.jsと完全に組み合わせて使用できるよう修正
// 2.12.2 2019/04/14 フキダシウィンドウをキャラクター下に表示した際、Y座標の位置調整が効かなくなる問題を修正
// 2.12.1 2019/02/07 GraphicalDesignMode.jsと併用し、かつフキダシウィンドウ無効時、カスタマイズしたウィンドウの横幅が反映されるよう修正
// 2.12.0 2019/10/21 フキダシウィンドウの表示位置の上限と下限を設定できる機能を追加
//                   フキダシウィンドウを画面上の任意の位置に表示できる機能を追加
// 2.11.2 2018/11/26 ポップアップ用のウィンドウスキン設定後、ポップアップを解除してもスキンがそのままになってしまう場合がある問題を修正
// 2.11.1 2018/11/26 MPP_MessageEX.jsとの競合を解消(ネームウィンドウの表示不整合)
// 2.11.0 2018/11/11 ポップアップウィンドウの横幅と高さの最小値を変数から取得できる機能を追加
// 2.10.2 2018/11/07 ポップアップ用のウィンドウスキン設定後、メニューを開くか場所移動すると設定が戻ってしまう問題を修正
// 2.10.1 2018/06/15 ウィンドウ連携が有効かつ、フキダシウィンドウを1回も表示していない場合に選択肢ウィンドウが見えなくなる問題を修正
// 2.10.0 2018/05/20 ポーズサインのテール化機能を使わない設定を追加しました。
// 2.9.8 2018/03/19 プラグインを未適用の状態でセーブしたデータをロードするとエラーになる現象を修正
// 2.9.7 2018/01/30 BetweenCharacters.jsとの競合を解消
// 2.9.6 2018/01/15 MPP_MessageEX.jsとの競合を解消、パラメータの型指定誤りを修正、2.9.1の修正の取り込みが一部間違っていた問題を修正
// 2.9.5 2018/01/12 KMS_DebugUtil.jsとの競合を解消
// 2.9.4 2017/12/21 FTKR_ExMessageWindow2.jsとの連携で、上下にフキダシウィンドウを同時表示できるよう修正
// 2.9.3 2017/12/14 2.9.2の修正で上方向に対する調整が抜けていたのを修正
// 2.9.2 2017/12/10 フキダシ位置のY座標を調整する際にテール画像が表示されるように微調整
// 2.9.1 2017/12/07 フキダシ表示を無効化後、メッセージの表示をする前に選択肢を表示すると位置がおかしくなる問題を修正（by 奏ねこまさん）
// 2.9.0 2017/10/18 AltWindowFrame.jsとの競合を解消してMADOと連携できるようになりました。
// 2.8.1 2017/08/14 ウィンドウの振動時間を設定できる機能を追加
// 2.8.0 2017/08/14 ウィンドウを振動させる機能を追加
//                  パラメータの型指定機能に対応
// 2.7.0 2017/06/24 フキダシ位置を設定する機能で、イベント名で指定できる機能を追加
//                  フキダシ有効化時にウィンドウ位置を設定できる機能を追加
// 2.6.0 2017/06/21 ウィンドウが画面外に出ないように調整するパラメータを追加
//                  フキダシの位置固定をイベントごとに設定できる機能で、イベント名で指定できる機能を追加
// 2.5.1 2017/06/11 DP_MapZoom.js以外のマップズーム機能に対してフキダシ位置が正しく表示されていなかった問題を修正
// 2.5.0 2017/06/05 マップズームに対してフキダシ位置が正しく表示されるよう対応
//                  フキダシの位置固定をイベントごとに設定できる機能を追加
// 2.4.1 2017/05/28 ウィンドウスキンを変更した直後の文字色のみ変更前の文字色になってしまう問題を修正（by 奏ねこまさん）
//                  2行目以降の文字サイズを変更したときにウィンドウの高さが正しく計算されない問題を修正
// 2.4.0 2017/05/16 並列実行のコモンイベントで「MWP_VALID 0」を実行したときに、実行中のマップイベントを対象とするよう修正
// 2.3.2 2017/05/25 「FTKR_ExMessageWindow2.js」の連携機能の修正(byフトコロ)
//                  ウィンドウを閉じた時にフキダシ無効化をする対象を、指定していたウィンドウIDのみに変更
//                  フキダシ無効化コマンドにウィンドウIDを指定する機能追加
//                  場所移動時にすべてのウィンドウIDのフキダシ無効化処理を追加
//                  プラグインパラメータ[自動設定]をOFFに設定した場合、イベント起動時にフキダシ無効化する対象をウィンドウID0だけに変更
// 2.3.1 2017/05/14 「FTKR_ExMessageWindow2.js」の連携機能の修正(byフトコロ)
//                  ポップアップの初期化および、ポップアップ無効時の文章の表示位置の不具合修正
//                  フキダシ有効化コマンドにウィンドウIDを指定する機能追加
// 2.3.0 2017/05/01 フトコロさんの「FTKR_ExMessageWindow2.js」と連携してフキダシを複数表示できる機能を追加（byフトコロさん）
// 2.2.0 2017/04/20 選択肢および数値ウィンドウをテール画像の右側に表示できるプラグインコマンドを追加
// 2.1.0 2017/02/21 フキダシウィンドウ内で制御文字「\{」「\}」を指定したときの上限、下限、増減幅を設定できる機能を追加
// 2.0.5 2017/01/23 ウィンドウスキンを変更しているデータをロード直後にフキダシメッセージを表示すると
//                  文字が黒くなってしまう問題を修正
// 2.0.4 2016/12/25 ウィンドウを閉じている最中にウィンドウ表示位置を変更するプラグインコマンドを実行すると、
//                  一瞬だけ空ウィンドウが表示される問題を修正
// 2.0.3 2016/10/22 デフォルト以外で制御文字と見なされる記述（\aaa[333]や\d<test>）を枠幅の計算から除外するよう修正
// 2.0.2 2016/09/29 キャラクターの位置によってはネームポップが一部見切れてしまう現象を修正
// 2.0.1 2016/08/25 フォントサイズを\{で変更して\}で戻さなかった場合の文字サイズがおかしくなっていた現象を修正
// 2.0.0 2016/08/22 本体v1.3.0によりウィンドウ透過の実装が変更されたので対応
// 1.3.3 2016/07/02 ポップアップ有効時は選択肢の最大表示数が8になるよう修正
// 1.3.2 2016/06/02 YEP_MessageCore.jsとのウィンドウ位置に関する競合を解消
// 1.3.1 2016/05/25 フォロワーにフキダシを表示できる機能を追加
// 1.3.0 2016/03/21 ウィンドウの表示位置をキャラクターの高さに合わせて自動調整するよう修正
//                  ポップアップウィンドウ専用のウィンドウスキンを使用する機能を追加
//                  位置とサイズを微調整する機能を追加
//                  選択肢と数値入力ウィンドウの表示方法を2種類追加
// 1.2.3 2016/02/23 YEP_MessageCore.jsより上に配置した場合に発生するエラーを修正
//                  （正常に動作しない点はそのままです）
// 1.2.2 2016/02/20 YEP_MessageCore.js最新版に対応
// 1.2.1 2016/02/20 YEP_MessageCore.jsのネームポップをポップアップウィンドウと連動するよう対応
// 1.2.0 2016/02/13 並列処理のイベントが存在するときにポップアップ設定がクリアされてしまう
//                  問題の修正
//                  ウィンドウの表示位置を下に表示できる設定を追加
// 1.1.3 2016/02/04 イベント終了時にポップアップ設定をクリアするよう修正
// 1.1.2 2016/01/31 行間を調整できる機能を追加
// 1.1.1 2016/01/30 選択肢と数値入力ウィンドウをポップアップと連携するよう修正
//                  その他微調整と軽微な表示不良修正
// 1.1.0 2016/01/29 高確率で競合するバグを修正
//                  ポップアップウィンドウがキャラクターの移動に追従するよう修正
//                  顔グラフィックが見切れないよう修正
//                  実行中のイベントをポップアップ対象にできる機能を追加（0を指定）
//                  英語対応
// 1.0.0 2016/01/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Popup window plugin
 * @author triacontane
 *
 * @param FontSize
 * @desc Font size of popup window
 * @default 22
 * @type number
 *
 * @param Padding
 * @desc Padding of popup window
 * @default 10
 * @type number
 *
 * @param AutoPopup
 * @desc Popup set when event starting（ON/OFF）
 * @default true
 * @type boolean
 *
 * @param FaceScale
 * @desc Scale of face graphic of popup window(1-100%)
 * @default 75
 * @type number
 *
 * @param WindowLinkage
 * @desc Select window and Number input window is linkage with popup window(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param BetweenLines
 * @desc Between the Lines
 * @default 4
 * @type number
 *
 * @param ThroughWindow
 * @desc Window through if overlap windows(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param FontSizeRange
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの増減幅です。デフォルトは12です。
 * @default 12
 * @type number
 *
 * @param FontUpperLimit
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの上限値です。デフォルトは96です。
 * @default 96
 * @type number
 *
 * @param FontLowerLimit
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの下限値です。デフォルトは24です。
 * @default 24
 * @type number
 *
 * @param InnerScreen
 * @desc 横方向だけでなく縦方向についても画面内にフキダシウィンドウが収まるように位置を調整します。
 * @default false
 * @type boolean
 *
 * @param ShakeSpeed
 * @desc ウィンドウを振動させる際の速さです。制御文字\v[n]が利用できます。
 * @default 5
 * @type number
 *
 * @param ShakeDuration
 * @desc ウィンドウを振動させる時間(フレーム)です。制御文字\v[n]が利用できます。0を指定するとずっと振動し続けます。
 * @default 60
 * @type number
 *
 * @param NoUseTail
 * @desc ポーズサインのテール化機能を無効化します。デフォルトの位置に表示されます。
 * @default false
 * @type boolean
 *
 * @param MinWidthVariableId
 * @desc 指定した番号の変数の値が、フキダシウィンドウの横幅の最小値（単位はピクセル数）となります。
 * @default 0
 * @type variable
 *
 * @param MinHeightVariableId
 * @desc 指定した番号の変数の値が、フキダシウィンドウの高さの最小値（単位はピクセル数）となります。
 * @default 0
 * @type variable
 *
 * @param lowerLimitX
 * @desc フキダシウィンドウの下限X座標です。
 * @default 0
 * @type number
 *
 * @param lowerLimitY
 * @desc フキダシウィンドウの下限Y座標です。
 * @default 0
 * @type number
 *
 * @param upperLimitX
 * @desc フキダシウィンドウの下限X座標です。
 * @default 0
 * @type number
 *
 * @param upperLimitY
 * @desc フキダシウィンドウの下限Y座標です。
 * @default 0
 * @type number
 *
 * @param tailImage
 * @desc テールに使う画像をピクチャから指定します。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @help Change the message window from fixed to popup
 *
 * Plugin Command
 *
 * MWP_VALID [Character ID]
 *  Popup window valid
 *  Player:-1 Current event:0 Event:1...
 * ex:MWP_VALID 0
 *
 * MWP_INVALID
 *  Popup window invalid
 * ex:MWP_INVALID
 *
 * MWP_FREE 100 200
 * フキダシウィンドウフリー配置 100 200
 * 指定した任意の位置にフキダシウィンドウを表示します。
 *
 * MWP_SETTING [parameter]
 *  Popup window setting. parameter are...
 *   POS_UPPER
 *     Window position fixed upper.
 *
 * 　POS_LOWER
 *     Window position fixed upper.
 *
 * 　POS_AUTO
 *     Window position auto.
 *
 *   SKIN [File name(/img/system/...)]
 *     Setting window skin for popup message.
 *
 *   SUB_POS_PLAYER
 *     Choice window or NumberInput displays player.
 *
 *   SUB_POS_INNER
 *     Choice window or NumberInput displays internal message window.
 *
 *   SUB_POS_NORMAL
 *     Choice window or NumberInput displays normal position.
 *
 * MWP_ADJUST [parameter]
 *   Popup window adjust. parameter are...
 *
 *   POS [X] [Y]
 *     Popup window adjust relative position.
 *
 * 　SIZE [Width] [Height]
 * 　　Popup window adjust relative size.
 *
 * ・使用可能な制御文字
 * \sh[5] # 強さ[5]でウィンドウを振動させます。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc フキダシウィンドウプラグイン
 * @author トリアコンタン
 *
 * @param フォントサイズ
 * @desc フキダシウィンドウのデフォルトフォントサイズ
 * 通常ウィンドウのフォントサイズ：28
 * @default 22
 * @type number
 *
 * @param 余白
 * @desc フキダシウィンドウの余白サイズ
 * 通常ウィンドウの余白：18
 * @default 10
 * @type number
 *
 * @param 自動設定
 * @desc イベント起動時にフキダシの対象が、起動したイベントに自動設定されます。（ON/OFF）
 * OFFの場合は通常のメッセージウィンドウに設定されます。
 * @default true
 * @type boolean
 *
 * @param フェイス倍率
 * @desc フキダシウィンドウの顔グラフィック表示倍率(1-100%)
 * @default 75
 * @type number
 *
 * @param ウィンドウ連携
 * @desc 選択肢ウィンドウと数値入力ウィンドウを
 * ポップアップウィンドウに連動させます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param 行間
 * @desc 行と行の間のスペースをピクセル単位で設定します。
 * @default 4
 * @type number
 *
 * @param ウィンドウ透過
 * @desc ウィンドウが重なったときに透過表示します。(ON/OFF)
 * 選択肢をフキダシ内に表示する場合はONにしてください。
 * @default false
 * @type boolean
 *
 * @param フォントサイズ増減幅
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの増減幅です。デフォルトは12です。
 * @default 12
 * @type number
 *
 * @param フォントサイズ上限
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの上限値です。デフォルトは96です。
 * @default 96
 * @type number
 *
 * @param フォントサイズ下限
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの下限値です。デフォルトは24です。
 * @default 24
 * @type number
 *
 * @param 画面内に収める
 * @desc 横方向だけでなく縦方向についても画面内にフキダシウィンドウが収まるように位置を調整します。
 * @default false
 * @type boolean
 *
 * @param 振動の速さ
 * @desc ウィンドウを振動させる際の速さです。制御文字\v[n]が利用できます。
 * @default 5
 * @type number
 *
 * @param 振動時間
 * @desc ウィンドウを振動させる時間(フレーム)です。制御文字\v[n]が利用できます。0を指定するとずっと振動し続けます。
 * @default 60
 * @type number
 *
 * @param テールを使わない
 * @desc ポーズサインのテール化機能を無効化します。デフォルトの位置に表示されます。
 * @default false
 * @type boolean
 *
 * @param 最小横幅取得変数ID
 * @desc 指定した番号の変数の値が、フキダシウィンドウの横幅の最小値（単位はピクセル数）となります。
 * @default 0
 * @type variable
 *
 * @param 最小高さ取得変数ID
 * @desc 指定した番号の変数の値が、フキダシウィンドウの高さの最小値（単位はピクセル数）となります。
 * @default 0
 * @type variable
 *
 * @param lowerLimitX
 * @text 下限X座標
 * @desc フキダシウィンドウの下限X座標です。
 * @default 0
 * @type number
 *
 * @param upperLimitX
 * @text 上限X座標
 * @desc フキダシウィンドウの上限X座標です。
 * @default 0
 * @type number
 *
 * @param lowerLimitY
 * @text 下限Y座標
 * @desc フキダシウィンドウの下限Y座標です。
 * @default 0
 * @type number
 *
 * @param upperLimitY
 * @text 上限Y座標
 * @desc フキダシウィンドウの上限Y座標です。
 * @default 0
 * @type number
 *
 * @param tailImage
 * @text テール画像
 * @desc テールに使う画像をシステム画像から指定します。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param tailImageAdjustY
 * @text テール画像Y座標
 * @desc テールに使う画像のY座標補正値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @help メッセージウィンドウを指定したキャラクターの頭上にフキダシで
 * 表示するよう変更します。
 *
 * YEP_MessageCore.jsのネームポップと併せて使用する場合は、
 * プラグイン管理画面で当プラグインをYEP_MessageCore.jsより
 * 下に配置してください。
 *
 * また、FTKR_ExMessageWindow2.jsの複数メッセージウィンドウ表示と
 * 併せて使用する場合は、プラグイン管理画面で当プラグインを
 * FTKR_ExMessageWindow2.jsより下に配置してください。
 *
 *
 * プラグインパラメータ[自動設定]詳細
 * FTKR_ExMessageWindow2.jsと併用する場合、
 * 自動設定で使用するメッセージウィンドウは、ウィンドウID0 です。
 * OFFの場合、ウィンドウID0 を通常の表示方法に戻します。
 *
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * MWP_VALID [キャラクターID] [ウィンドウ位置] or
 * フキダシウィンドウ有効化 [キャラクターID] [ウィンドウ位置]
 * 　メッセージウィンドウを指定したキャラクターIDの頭上に表示します。
 * 　プレイヤー : -1 このイベント : 0 指定したIDのイベント : 1 ～
 * 　フォロワー : -2, -3, -4
 *
 * 　ウィンドウ位置
 *   0 : 自動（指定しなかった場合も含む）
 *   1 : キャラクターの上に表示
 *   2 : キャラクターの下に表示
 *
 * 例：MWP_VALID 0 1
 * 　　フキダシウィンドウ有効化 3 1
 *
 * MWP_VALID [イベント名] [ウィンドウ位置] or
 * フキダシウィンドウ有効化 [イベント名] [ウィンドウ位置]
 * 　メッセージウィンドウを指定した名称と一致するイベントの頭上に表示します。
 *
 * 例：MWP_VALID test_event 1
 * 　　フキダシウィンドウ有効化 テストイベント 2
 *
 * !複数メッセージウィンドウ表示を使う場合!
 * MWP_VALID [キャラクターID] [ウィンドウID] [ウィンドウ位置] or
 * フキダシウィンドウ有効化 [キャラクターID] [ウィンドウID] [ウィンドウ位置]
 * 　指定したメッセージウィンドウIDを指定したキャラクターIDの頭上に表示するようにします。
 * 　プレイヤー : -1 このイベント : 0 指定したIDのイベント : 1 ～
 * 　フォロワー : -2, -3, -4
 * 　ウィンドウIDを指定しない(入力なし)場合は、ウィンドウID0を使用します。
 *
 * 例：MWP_VALID 0 1
 * 　　フキダシウィンドウ有効化 3 2
 *
 * MWP_INVALID or
 * フキダシウィンドウ無効化
 * 　ウィンドウの表示方法を通常に戻します。
 *
 * 例：MWP_INVALID
 * 　　フキダシウィンドウ無効化
 *
 * !複数メッセージウィンドウ表示を使う場合!
 * MWP_INVALID [ウィンドウID]
 * フキダシウィンドウ無効化 [ウィンドウID]
 * 　指定したメッセージウィンドウIDの表示方法を通常に戻します。
 * 　入力無しはすべてのウィンドウIDの表示方法を通常に戻します。
 *
 * 例：MWP_INVALID 1
 * 　　フキダシウィンドウ無効化 2
 * 　　フキダシウィンドウ無効化
 *
 * MWP_FREE 100 200
 * フキダシウィンドウフリー配置 100 200
 * 指定した任意の位置にフキダシウィンドウを表示します。
 *
 * MWP_SETTING [設定内容] or
 * フキダシウィンドウ設定 [設定内容]
 * 　フキダシウィンドウの設定を行います。設定内容に以下を入力。
 *
 *   POS_UPPER or 位置_上固定
 * 　　ウィンドウの位置をキャラクターの上で固定します。
 *
 *   POS_UPPER 1 or 位置_上固定 1
 * 　　イベントID[1]のみウィンドウの位置をキャラクターの上で固定します。
 *
 *   POS_UPPER aaa or 位置_上固定 aaa
 * 　　イベント名[aaa]のみウィンドウの位置をキャラクターの上で固定します。
 *
 *   POS_LOWER or 位置_下固定
 * 　　ウィンドウの位置をキャラクターの下で固定します。
 *
 *   POS_LOWER -1 or 位置_下固定 -1
 * 　　プレイヤーのみウィンドウの位置をキャラクターの下で固定します。
 *
 *   POS_LOWER aaa or 位置_下固定 aaa
 * 　　イベント名[aaa]のみウィンドウの位置をキャラクターの下で固定します。
 *
 *   POS_AUTO or 位置_自動
 * 　　通常はキャラクターの上に表示し、ウィンドウが上に見切れる場合のみ
 * 　　下に表示します。
 *
 *   SKIN or スキン [/img/system/以下に配置するスキンのファイル名]
 *     フキダシウィンドウ時専用のウィンドウスキンを設定します。
 *
 *   SUB_POS_PLAYER or サブ位置_プレイヤーの頭上
 *   　選択肢および数値入力のウィンドウをプレイヤーの頭上に表示します。
 *   　位置関係次第でウィンドウが被る場合があるので、必要に応じて
 *   　ウィンドウ透過のパラメータを有効にしてください。
 *
 *   SUB_POS_INNER or サブ位置_メッセージウィンドウ内部
 *     選択肢および数値入力のウィンドウをメッセージウィンドウに含めます。
 *     この設定を使用する場合は必ずウィンドウ透過のパラメータを
 *     有効にしてください。
 *
 *   SUB_POS_NORMAL or サブ位置_通常
 *   　選択肢および数値入力のウィンドウをフキダシウィンドウの下に表示します。
 *   　特に設定を変更しない場合はこの設定になります。
 *
 *   SUB_POS_RIGHT or サブ位置_右
 *   　選択肢および数値入力のウィンドウをフキダシウィンドウのテール部分の
 *   　右側に表示します。
 *
 * 例：MWP_SETTING POS_UPPER
 * 　　フキダシウィンドウ設定 位置_自動
 * 　　MWP_SETTING SKIN window2
 * 　　フキダシウィンドウ設定 サブ位置_プレイヤーの頭上
 *
 * MWP_ADJUST [設定内容] or
 * フキダシウィンドウ調整 [設定内容]
 * 　フキダシウィンドウの表示位置やサイズを微調整します。設定内容に以下を入力。
 *
 * 　POS or 位置 [X座標] [Y座標]
 * 　　ウィンドウのX座標とY座標を調整します。指定するのは元の座標からの相対です。
 *
 * 　SIZE or サイズ [横幅] [高さ]
 * 　　ウィンドウの横幅と高さを調整します。指定するのは元のサイズからの相対です。
 *
 * 例：MWP_ADJUST POS 5 -3
 * 　　フキダシウィンドウ調整 サイズ 20 -40
 *
 * !複数メッセージウィンドウ表示を使う場合!
 * フキダシウィンドウの設定や表示位置、サイズの調整結果は
 * すべてのウィンドウIDで共通です。
 *
 * ・使用可能な制御文字
 * \sh[5] # 強さ[5]でウィンドウを振動させます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName = 'MessageWindowPopup';

    var checkTypeFunction = function(value) {
        return checkType(value, 'Function');
    };

    var checkType = function(value, typeName) {
        return Object.prototype.toString.call(value).slice(8, -1) === typeName;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    //FTKR_ExMessageWindow2.jsを使用しているか
    var imported_FTKR_EMW = function() {
        return typeof Imported !== 'undefined' && Imported.FTKR_EMW;
    };

    var isExistPlugin = function(pluginName) {
        return Object.keys(PluginManager.parameters(pluginName)).length > 0;
    };

    //=============================================================================
    // パラメータのバリデーション
    //=============================================================================
    var paramThroughWindow       = getParamBoolean(['ThroughWindow', 'ウィンドウ透過']);
    var paramFaceScale           = getParamNumber(['FaceScale', 'フェイス倍率'], 1, 100);
    var paramFontSize            = getParamNumber(['FontSize', 'フォントサイズ'], 1);
    var paramPadding             = getParamNumber(['Padding', '余白'], 1);
    var paramLinkage             = getParamBoolean(['WindowLinkage', 'ウィンドウ連携']);
    var paramBetweenLines        = getParamNumber(['BetweenLines', '行間'], 0);
    var paramAutoPopup           = getParamBoolean(['AutoPopup', '自動設定']);
    var paramFontSizeRange       = getParamNumber(['FontSizeRange', 'フォントサイズ増減幅'], 0);
    var paramFontUpperLimit      = getParamNumber(['FontUpperLimit', 'フォントサイズ上限'], 0);
    var paramFontLowerLimit      = getParamNumber(['FontLowerLimit', 'フォントサイズ下限'], 0);
    var paramInnerScreen         = getParamBoolean(['InnerScreen', '画面内に収める']);
    var paramShakeSpeed          = getParamString(['ShakeSpeed', '振動の速さ']);
    var paramShakeDuration       = getParamString(['ShakeDuration', '振動時間']);
    var paramNoUseTail           = getParamBoolean(['NoUseTail', 'テールを使わない']);
    var paramMinWidthVariableId  = getParamNumber(['MinWidthVariableId', '最小横幅取得変数ID']);
    var paramMinHeightVariableId = getParamNumber(['MinHeightVariableId', '最小高さ取得変数ID']);
    var paramLowerLimitX         = getParamNumber(['lowerLimitX']);
    var paramUpperLimitX         = getParamNumber(['upperLimitX']);
    var paramLowerLimitY         = getParamNumber(['lowerLimitY']);
    var paramUpperLimitY         = getParamNumber(['upperLimitY']);
    var paramTailImage           = getParamString(['tailImage']);
    var paramTailImageAdjustY    = getParamNumber(['tailImageAdjustY']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandMessageWindowPopup(command, args);
    };

    Game_Interpreter.prototype.pluginCommandMessageWindowPopup = function(command, args) {
        switch (getCommandName(command)) {
            case 'MWP_VALID' :
            case 'フキダシウィンドウ有効化':
                $gameSystem.clearMessagePopupFree();
                var eventId = this.getEventIdForMessagePopup(args[0]);
                if (isNaN(eventId)) {
                    eventId = this.getEventIdFromEventName(eventId);
                }
                $gameSystem.setMessagePopup(eventId);
                var windowPosition;
                if (imported_FTKR_EMW() && args[1]) {
                    var windowId = getArgNumber(args[1]);
                    if (windowId >= 0) $gameSystem.setMessagePopupEx(windowId, eventId);
                    windowPosition = getArgNumber(args[2]);
                } else {
                    windowPosition = getArgNumber(args[1]);
                }
                if (windowPosition === 1) {
                    $gameSystem.setPopupFixUpper(eventId);
                } else if (windowPosition === 2) {
                    $gameSystem.setPopupFixLower(eventId);
                }
                break;
            case 'MWP_FREE' :
            case 'フキダシウィンドウフリー配置':
                var x = getArgNumber(args[0]) || 0;
                var y = getArgNumber(args[1]) || 0;
                $gameSystem.setMessagePopupFree(x, y);
                break;
            case 'MWP_INVALID':
            case 'フキダシウィンドウ無効化':
                $gameSystem.clearMessagePopupFree();
                if (imported_FTKR_EMW() && args[0]) {
                    var windowId2 = getArgNumber(args[0]);
                    if (windowId2 >= 0) $gameSystem.clearMessagePopupEx(windowId2);
                } else {
                    $gameSystem.clearMessagePopup();
                }
                break;
            case 'MWP_SETTING' :
            case 'フキダシウィンドウ設定':
                switch (getCommandName(args[0])) {
                    case 'POS_UPPER' :
                    case '位置_上固定':
                        $gameSystem.setPopupFixUpper(args[1] ? this.getEventIdForMessagePopup(args[1]) : null);
                        break;
                    case 'POS_LOWER' :
                    case '位置_下固定':
                        $gameSystem.setPopupFixLower(args[1] ? this.getEventIdForMessagePopup(args[1]) : null);
                        break;
                    case 'POS_AUTO' :
                    case '位置_自動':
                        $gameSystem.setPopupAuto(args[1] ? this.getEventIdForMessagePopup(args[1]) : null);
                        break;
                    case 'SKIN' :
                    case 'スキン' :
                        $gameSystem.setPopupWindowSkin(getArgString(args[1]));
                        this.setWaitMode('image');
                        break;
                    case 'SUB_POS_NORMAL' :
                    case 'サブ位置_通常':
                        $gameSystem.setPopupSubWindowPosition(0);
                        break;
                    case 'SUB_POS_PLAYER' :
                    case 'サブ位置_プレイヤーの頭上':
                        $gameSystem.setPopupSubWindowPosition(1);
                        break;
                    case 'SUB_POS_INNER' :
                    case 'サブ位置_メッセージウィンドウ内部':
                        $gameSystem.setPopupSubWindowPosition(2);
                        break;
                    case 'SUB_POS_RIGHT' :
                    case 'サブ位置_右':
                        $gameSystem.setPopupSubWindowPosition(3);
                        break;
                }
                break;
            case 'MWP_ADJUST':
            case 'フキダシウィンドウ調整':
                switch (getCommandName(args[0])) {
                    case 'SIZE' :
                    case 'サイズ':
                        $gameSystem.setPopupAdjustSize(getArgNumber(args[1]), getArgNumber(args[2]));
                        break;
                    case 'POS' :
                    case '位置':
                        $gameSystem.setPopupAdjustPosition(getArgNumber(args[1]), getArgNumber(args[2]));
                        break;
                }
                break;
        }
    };

    Game_Interpreter.prototype.getEventIdForMessagePopup = function(arg) {
        var convertedArg = convertEscapeCharacters(arg);
        var eventId      = parseInt(convertedArg);
        if (isNaN(eventId)) {
            return convertedArg;
        }
        if (eventId === 0) {
            eventId = this.eventId() || ($gameMap.isEventRunning() ? $gameMap._interpreter.eventId() : 0);
        }
        return eventId;
    };

    Game_Interpreter.prototype.getEventIdFromEventName = function(eventName) {
        var eventId = 0;
        $gameMap.events().some(function(event) {
            if (event.event().name === eventName) {
                eventId = event.eventId();
                return true;
            }
            return false;
        });
        return eventId;
    };

    var _Game_Interpreter_terminate      = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this._depth === 0 && this.isGameMapInterpreter()) {
            if (imported_FTKR_EMW()) {
                $gameSystem.clearMessagePopupEx(this.windowId());
            } else {
                $gameSystem.clearMessagePopup();
            }
        }
    };

    Game_Interpreter.prototype.setGameMapInterpreter = function() {
        this._gameMapInterpreter = true;
    };

    Game_Interpreter.prototype.isGameMapInterpreter = function() {
        return this._gameMapInterpreter;
    };

    //=============================================================================
    // Game_System
    //  ポップアップフラグを保持します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._messagePopupCharacterId       = 0;
        this._messagePopupPosition          = null;
        this._messagePopupAdjustSize        = null;
        this._messagePopupAdjustPosition    = null;
        this._messagePopupWindowSkin        = null;
        this._messagePopupSubWindowPosition = 0;
    };

    Game_System.prototype.initMessagePositionEvents = function() {
        if (!this._messagePopupPositionEvents) {
            this._messagePopupPositionEvents = [];
        }
    };

    Game_System.prototype.setPopupSubWindowPosition = function(position) {
        this._messagePopupSubWindowPosition = position.clamp(0, 3);
    };

    Game_System.prototype.getPopupSubWindowPosition = function() {
        return this._messagePopupSubWindowPosition;
    };

    Game_System.prototype.setPopupWindowSkin = function(fileName) {
        this._messagePopupWindowSkin = fileName;
        ImageManager.loadSystem(fileName);
    };

    Game_System.prototype.getPopupWindowSkin = function() {
        return this._messagePopupWindowSkin;
    };

    Game_System.prototype.setMessagePopup = function(id) {
        this._messagePopupCharacterId = id;
    };

    Game_System.prototype.clearMessagePopup = function() {
        this._messagePopupCharacterId    = 0;
        this._messagePopupPositionEvents = [];
    };

    Game_System.prototype.setMessagePopupFree = function(x, y) {
        this._messagePopupFreeX       = x;
        this._messagePopupFreeY       = y;
        this._messagePopupCharacterId = 1;
    };

    Game_System.prototype.clearMessagePopupFree = function() {
        this.setMessagePopupFree(undefined, undefined);
    };

    Game_System.prototype.getMessagePopupId = function() {
        return this._messagePopupCharacterId !== 0 ? this._messagePopupCharacterId : null;
    };

    Game_System.prototype.getMessagePopupFree = function() {
        if (this._messagePopupFreeX === undefined || this._messagePopupFreeY === undefined) {
            return null;
        }
        return {x: this._messagePopupFreeX, y: this._messagePopupFreeY};
    };

    Game_System.prototype.setPopupFixUpper = function(characterId) {
        this.setPopupFixPosition(characterId, 1);
    };

    Game_System.prototype.setPopupFixLower = function(characterId) {
        this.setPopupFixPosition(characterId, 2);
    };

    Game_System.prototype.setPopupAuto = function(characterId) {
        this.setPopupFixPosition(characterId, 0);
    };

    Game_System.prototype.setPopupFixPosition = function(characterId, position) {
        if (characterId !== null) {
            this.initMessagePositionEvents();
            this._messagePopupPositionEvents[characterId] = position;
        } else {
            this._messagePopupPosition = position;
        }
    };

    Game_System.prototype.setPopupAdjustSize = function(w, h) {
        this._messagePopupAdjustSize = [w, h];
    };

    Game_System.prototype.getPopupAdjustSize = function() {
        return this._messagePopupAdjustSize;
    };

    Game_System.prototype.setPopupAdjustPosition = function(x, y) {
        this._messagePopupAdjustPosition = [x, y];
    };

    Game_System.prototype.getPopupAdjustPosition = function() {
        return this._messagePopupAdjustPosition;
    };

    Game_System.prototype.isPopupFixUpper = function(eventId) {
        return this.isPopupFixPosition(1, eventId);
    };

    Game_System.prototype.isPopupFixLower = function(eventId) {
        return this.isPopupFixPosition(2, eventId);
    };

    Game_System.prototype.isPopupFixPosition = function(position, eventId) {
        var id = eventId || this._messagePopupCharacterId;
        this.initMessagePositionEvents();
        var positionFixForId   = this._messagePopupPositionEvents[id];
        var event              = $gameMap.event(id);
        var positionFixForName = event ? this._messagePopupPositionEvents[event.event().name] : 0;
        if (positionFixForId > 0) {
            return positionFixForId === position;
        } else if (positionFixForName > 0) {
            return positionFixForName === position;
        } else {
            return this._messagePopupPosition === position;
        }
    };

    //=============================================================================
    // Game_Map
    //  イベント起動時に自動設定を適用します。
    //=============================================================================
    var _Game_Map_setupStartingMapEvent      = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function() {
        var result = _Game_Map_setupStartingMapEvent.apply(this, arguments);
        if (result) {
            if (paramAutoPopup) {
                $gameSystem.setMessagePopup(this._interpreter.eventId());
            } else if (imported_FTKR_EMW()) {
                $gameSystem.clearMessagePopupEx(0);
            } else {
                $gameSystem.clearMessagePopup();
            }
        }
        return result;
    };

    var _Game_Map_setup      = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.apply(this, arguments);
        this._interpreter.setGameMapInterpreter();
    };

    //=============================================================================
    // Game_Troop
    //  戦闘開始時にポップアップフラグを解除します。
    //=============================================================================
    var _Game_Troop_setup      = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        $gameSystem.clearMessagePopup();
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの高さを設定します。
    //=============================================================================
    var _Game_CharacterBase_initMembers      = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.setSizeForMessagePopup(0, 0);
    };

    Game_CharacterBase.prototype.setSizeForMessagePopup = function(width, height) {
        this._size = [width, height];
    };

    Game_CharacterBase.prototype.getHeightForPopup = function() {
        return $gameScreen.zoomScale() * this._size[1];
    };

    Game_CharacterBase.prototype.getRealScreenX = function() {
        return $gameScreen.convertRealX(this.screenX());
    };

    Game_CharacterBase.prototype.getRealScreenY = function() {
        return $gameScreen.convertRealY(this.screenY());
    };

    //=============================================================================
    // Game_Screen
    //  画面座標をズームを考慮した座標に変換します。
    //=============================================================================
    Game_Screen.prototype.convertRealX = function(x) {
        var scale = this.zoomScale();
        return scale * x - (scale - 1.0) * this.zoomX();
    };

    Game_Screen.prototype.convertRealY = function(y) {
        var scale = this.zoomScale();
        return scale * y - (scale - 1.0) * this.zoomY();
    };

    //=============================================================================
    // Scene_Map
    //  ポップアップ用のウィンドウスキンをロードします。
    //=============================================================================
    var _Scene_Map_isReady      = Scene_Map.prototype.isReady;
    Scene_Map.prototype.isReady = function() {
        var ready   = _Scene_Map_isReady.apply(this, arguments);
        var popSkin = $gameSystem.getPopupWindowSkin();
        if (popSkin && ready) {
            var bitmap = ImageManager.loadSystem(popSkin);
            return bitmap.isReady();
        }
        return ready;
    };

    //=============================================================================
    // Sprite_Character
    //  キャラクターの高さを逆設定します。
    //=============================================================================
    var _Sprite_Character_updateBitmap      = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        if (this.isImageChanged()) this._imageChange = true;
        _Sprite_Character_updateBitmap.apply(this, arguments);
        if (this._imageChange) {
            this.bitmap.addLoadListener(function() {
                var width  = this.bitmap.width === 1 ? $gameMap.tileWidth() : this.patternWidth();
                var height = this.bitmap.height === 1 ? $gameMap.tileHeight() : this.patternHeight();
                this._character.setSizeForMessagePopup(width, height);
            }.bind(this));
            this._imageChange = false;
        }
    };

    //=============================================================================
    // Window_Base
    //  共通処理を定義します。
    //=============================================================================
    var _Window_Base_loadWindowskin      = Window_Base.prototype.loadWindowskin;
    Window_Base.prototype.loadWindowskin = function() {
        var popSkin = $gameSystem.getPopupWindowSkin();
        if (this.isPopup() && popSkin) {
            this.windowskin = ImageManager.loadSystem(popSkin);
        } else {
            _Window_Base_loadWindowskin.apply(this, arguments);
        }
    };

    Window_Base.prototype.setPauseSignToTail = function(lowerFlg) {
        if (lowerFlg) {
            this._windowPauseSignSprite.rotation = 180 * Math.PI / 180;
            this._windowPauseSignSprite.y        = 12;
            this._windowPauseSignSprite.anchor.y = 0;
        } else {
            this._windowPauseSignSprite.rotation = 0;
            this._windowPauseSignSprite.y        = this.height + 12;
            this._windowPauseSignSprite.anchor.y = 1;
        }
        this._pauseSignLower  = lowerFlg;
        this._pauseSignToTail = true;
    };

    Window_Base.prototype.setPauseSignImageToTail = function(lowerFlg) {
        this._windowPauseSignSprite.visible = false;
        if (lowerFlg) {
            this._messageTailImage.rotation = 180 * Math.PI / 180;
            this._messageTailImage.y        = -paramTailImageAdjustY;
            this._messageTailImage.anchor.y = 0;
        } else {
            this._messageTailImage.rotation = 0;
            this._messageTailImage.y        = this.height + paramTailImageAdjustY;
            this._messageTailImage.anchor.y = 0;
        }
    };

    Window_Base.prototype.setPauseSignToNormal = function() {
        this._windowPauseSignSprite.rotation = 0;
        this._windowPauseSignSprite.anchor.y = 1.0;
        this._windowPauseSignSprite.move(this._width / 2, this._height);
        this._pauseSignToTail = false;
    };

    var _Window_Base_updatePauseSign       = Window_Base.prototype._updatePauseSign;
    Window_Base.prototype._updatePauseSign = function() {
        _Window_Base_updatePauseSign.apply(this, arguments);
        if (this._pauseSignToTail) this._windowPauseSignSprite.alpha = 1.0;
    };

    Window_Base.prototype.isPopupLower = function() {
        return $gameSystem.isPopupFixLower() || (!$gameSystem.isPopupFixUpper() && this.y < 0);
    };

    Window_Base.prototype.setPopupPosition = function(character) {
        this._popupCharacter = character;
        this._popupFreePos   = $gameSystem.getMessagePopupFree();
        this.setPopupBasePosition();
        this.setPopupLowerPosition();
        this.setPopupAdjustInnerScreen();
        if (this._shakePower > 0) {
            this.setPopupShakePosition();
        }
    };

    Window_Base.prototype.getPopupBaseX = function() {
        return this._popupFreePos ? this._popupFreePos.x : this._popupCharacter.getRealScreenX();
    };

    Window_Base.prototype.getPopupBaseY = function() {
        return this._popupFreePos ? this._popupFreePos.y : this._popupCharacter.getRealScreenY();
    };

    Window_Base.prototype.getHeightForPopup = function() {
        return this._popupFreePos ? 0 : (this._popupCharacter.getHeightForPopup() + 8);
    };

    Window_Base.prototype.setPopupBasePosition = function() {
        var pos = $gameSystem.getPopupAdjustPosition();
        this.x  = this.getPopupBaseX() - this.width / 2 + (pos ? pos[0] : 0);
        this.y  = this.getPopupBaseY() - this.height - this.getHeightForPopup() + (pos ? pos[1] : 0);
    };

    Window_Base.prototype.setPopupShakePosition = function() {
        var duration = getArgNumber(paramShakeDuration);
        if (duration && this._shakeCount > duration) {
            this.setWindowShake(0);
        }
        var speed    = getArgNumber(paramShakeSpeed, 1);
        var position = Math.sin(this._shakeCount / 10 * speed) * this._shakePower;
        this.x += position;
        this._windowPauseSignSprite.x -= position;
        this._messageTailImage.x -= position;
        this._shakeCount++;
    };

    Window_Base.prototype.setPopupLowerPosition = function() {
        var lowerFlg = this.isPopupLower();
        if (lowerFlg) {
            this.y += this.height + this.getHeightForPopup() + 8;
        }
        if (!paramNoUseTail && !this.isUsePauseSignTextEnd()) {
            this.setPauseSignToTail(lowerFlg);
        }
        if (paramTailImage) {
            this.setPauseSignImageToTail(lowerFlg);
        }
    };

    Window_Base.prototype.setPopupAdjustInnerScreen = function() {
        if (paramInnerScreen) {
            this.adjustPopupPositionY();
        }
        var adjustResultX = this.adjustPopupPositionX();
        var tailX = this._width / 2 + adjustResultX;
        if (!this.isUsePauseSignTextEnd()) {
            this._windowPauseSignSprite.x = tailX
        }
        this._messageTailImage.x = tailX;
    };

    Window_Base.prototype.setWindowShake = function(power) {
        this._shakePower = power;
        this._shakeCount = 0;
    };

    Window_Base.prototype.adjustPopupPositionX = function() {
        var deltaX = 0;
        var minX   = paramLowerLimitX || 0;
        var maxX   = paramUpperLimitX || Graphics.boxWidth;
        if (this.x < minX) {
            deltaX = this.x - minX;
            this.x = minX;
        }
        if (this.x + this.width > maxX) {
            deltaX = this.x + this.width - maxX;
            this.x = maxX - this.width;
        }
        return deltaX;
    };

    Window_Base.prototype.adjustPopupPositionY = function() {
        var minY = (this._pauseSignLower ? this._windowPauseSignSprite.height / 2 : 0);
        minY += paramLowerLimitY || 0;
        if (this.y < minY) {
            this.y = minY;
        }
        var maxY = (paramUpperLimitY || Graphics.boxHeight) - this._windowPauseSignSprite.height / 2;
        if (this.y + this.height > maxY) {
            this.y = maxY - this.height;
        }
    };

    Window_Base.prototype.updatePlacementPopup = function() {
        if (!this._messageWindow) return;
        if (paramLinkage) {
            switch ($gameSystem.getPopupSubWindowPosition()) {
                case 0:
                    this.x = this._messageWindow.x;
                    this.y = this._messageWindow.y + this._messageWindow.height;
                    this.setPauseSignToNormal();
                    break;
                case 1:
                    this.setPopupPosition($gamePlayer);
                    break;
                case 2:
                    var pos = this._messageWindow.getSubWindowPosition();
                    this.x  = pos.x;
                    this.y  = pos.y;
                    this.setPauseSignToNormal();
                    this.opacity = 0;
                    break;
                case 3:
                    this.x = this._messageWindow.x + this._messageWindow.width / 2 + 16;
                    this.y = this._messageWindow.y + this._messageWindow.height;
                    this.setPauseSignToNormal();
                    break;
            }
        } else {
            this.y = Graphics.boxHeight - this.height - this._messageWindow.windowHeight() / 2;
        }
    };

    Window_Base.prototype.isPopup = function() {
        return false;
    };

    Window_Base.prototype.isPopupLinkage = function() {
        return this.isPopup() && paramLinkage;
    };

    Window_Base.prototype.resetLayout = function() {
        this.padding = this.standardPadding();
        this.width   = this.windowWidth();
        this.height  = this.windowHeight();
        this.loadWindowskin();
        this.setPauseSignToNormal();
    };

    var _Window_Base_makeFontBigger      = Window_Base.prototype.makeFontBigger;
    Window_Base.prototype.makeFontBigger = function() {
        if (this.isValidFontRangeForPopup()) {
            if (this.contents.fontSize <= paramFontUpperLimit) {
                this.contents.fontSize += paramFontSizeRange;
            }
        } else {
            _Window_Base_makeFontBigger.apply(this, arguments);
        }
    };

    var _Window_Base_makeFontSmaller      = Window_Base.prototype.makeFontSmaller;
    Window_Base.prototype.makeFontSmaller = function() {
        if (this.isValidFontRangeForPopup()) {
            if (this.contents.fontSize >= paramFontLowerLimit) {
                this.contents.fontSize -= paramFontSizeRange;
            }
        } else {
            _Window_Base_makeFontSmaller.apply(this, arguments);
        }
    };

    Window_Base.prototype.isValidFontRangeForPopup = function() {
        return this.isPopup() && paramFontSizeRange > 0;
    };

    Window_Base.prototype.isUsePauseSignTextEnd = function() {
        return this.isValidPauseSignTextEnd && this.isValidPauseSignTextEnd()
    };

    //=============================================================================
    // Window_Message
    //  ポップアップする場合、表示内容により座標とサイズを自動設定します。
    //=============================================================================
    Window_Message._faceHeight = Math.floor(Window_Base._faceHeight * paramFaceScale / 100);
    Window_Message._faceWidth  = Math.floor(Window_Base._faceWidth * paramFaceScale / 100);

    var _Window_Message__createAllParts = Window_Message.prototype._createAllParts;
    Window_Message.prototype._createAllParts = function() {
        _Window_Message__createAllParts.apply(this, arguments);
        this._messageTailImage = new Sprite();
        if (paramTailImage) {
            this._messageTailImage.bitmap   = ImageManager.loadSystem(paramTailImage);
            this._messageTailImage.visible  = false;
            this._messageTailImage.anchor.x = 0.5;
            this.addChild(this._messageTailImage);
        }
    };

    var _Window_Message_standardFontSize      = Window_Message.prototype.standardFontSize;
    Window_Message.prototype.standardFontSize = function() {
        return this.isPopup() ? paramFontSize : _Window_Message_standardFontSize.apply(this, arguments);
    };

    var _Window_Message_standardPadding      = Window_Message.prototype.standardPadding;
    Window_Message.prototype.standardPadding = function() {
        return this.isPopup() ? paramPadding : _Window_Message_standardPadding.apply(this, arguments);
    };

    var _Window_Message_calcTextHeight      = Window_Message.prototype.calcTextHeight;
    Window_Message.prototype.calcTextHeight = function(textState, all) {
        var height = _Window_Message_calcTextHeight.apply(this, arguments);
        return this.isPopup() ? height - 8 + paramBetweenLines : height;
    };

    var _Window_Message_startMessage      = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        this.updateTargetCharacterId();
        this.loadWindowskin();
        // Resolve conflict for MPP_MessageEX
        if (isExistPlugin('MPP_MessageEX')) {
            this.width = this.windowWidth();
        }
        // Resolve conflict for StandPictureEC
        if (typeof Imported !== 'undefined' && Imported['StandPictureEC']) {
            this._textState = {};
            this._textState.index = 0;
            this._textState.text = '';
            this.resetLayout();
        }
        _Window_Message_startMessage.apply(this, arguments);
        this.resetLayout();
    };

    var _Window_Message_loadWindowskin      = Window_Message.prototype.loadWindowskin;
    Window_Message.prototype.loadWindowskin = function() {
        var popupWindowSkin = $gameSystem.getPopupWindowSkin();
        if (this._windowSkinName !== popupWindowSkin || !popupWindowSkin) {
            if (this.isPopup()) {
                this._windowSkinName = popupWindowSkin;
            }
        }
        _Window_Message_loadWindowskin.apply(this, arguments);
    };

    Window_Message.prototype.updateTargetCharacterId = function() {
        this._targetCharacterId = $gameSystem.getMessagePopupId();
    };

    var _Window_Message_resetFontSettings      = Window_Message.prototype.resetFontSettings;
    Window_Message.prototype.resetFontSettings = function() {
        _Window_Message_resetFontSettings.apply(this, arguments);
        if (this.isPopup()) this.contents.fontSize = paramFontSize;
    };

    Window_Message.prototype.getPopupTargetCharacter = function() {
        var id = this._targetCharacterId;
        if (id < -1) {
            return $gamePlayer.followers().follower((id * -1) - 2);
        } else if (id === -1) {
            return $gamePlayer;
        } else if (id > -1) {
            return $gameMap.event(id);
        } else {
            return null;
        }
    };

    Window_Message.prototype.isPopup = function() {
        return !!this.getPopupTargetCharacter();
    };

    var _Window_Message_update      = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.apply(this, arguments);
        this.updatePlacementPopupIfNeed();
    };

    Window_Message.prototype.updatePlacementPopupIfNeed = function() {
        var prevX = this.x;
        var prevY = this.y;
        if (this.openness > 0 && this.isPopup()) {
            this.updatePlacementPopup();
        }
        if ((prevX !== this.x || prevY !== this.y) && this.isClosing()) {
            this.openness = 0;
        }
    };

    var _Window_Message_updatePlacement      = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        if (typeof Yanfly === 'undefined' || !Yanfly.Message) {
            var width = this.windowWidth();
            this.x = (Graphics.boxWidth - width) / 2;
        }
        _Window_Message_updatePlacement.apply(this, arguments);
        if (!this.isPopup()) {
            if (this._positionLock) {
                this.loadContainerInfo();
            }
            return;
        }
        this.updatePlacementPopup();
        // Resolve conflict for MKR_MessageWindowCustom.js
        if (isExistPlugin('MKR_MessageWindowCustom')) {
            this.processVirtual();
        }
    };

    var _Window_Message__updatePauseSign = Window_Message.prototype.hasOwnProperty('_updatePauseSign') ?
        Window_Message.prototype._updatePauseSign : null;
    Window_Message.prototype._updatePauseSign = function() {
        if (_Window_Message__updatePauseSign) {
            _Window_Message__updatePauseSign.apply(this, arguments);
        } else {
            Window_Base.prototype._updatePauseSign.apply(this, arguments);
        }
        this.updateTailImage();
    };

    Window_Message.prototype.isPopupLower = function() {
        var id = this._targetCharacterId;
        return $gameSystem.isPopupFixLower(id) || (!$gameSystem.isPopupFixUpper(id) && this.getWindowTopY() < 0);
    };

    Window_Message.prototype.getWindowTopY = function() {
        return this.y - (this._nameWindow && this._nameWindow.visible ? this._nameWindow.height : 0);
    };

    Window_Message.prototype.updatePlacementPopup = function() {
        this.setPopupPosition(this.getPopupTargetCharacter());
        if (this._choiceWindow && $gameMessage.isChoice()) {
            this._choiceWindow.updatePlacementPopup();
        }
        this._numberWindow.updatePlacementPopup();
        // Resolve conflict for YEP_MessageCore.js and MPP_MessageEX.js
        if (this._nameWindow && checkTypeFunction(this._nameWindow.updatePlacementPopup)) {
            this._nameWindow.updatePlacementPopup();
            if (isExistPlugin('MPP_MessageEX')) {
                this._nameWindow.y = this.y - this._nameWindow.height;
                this._nameWindow.x = this.x;
            }
        }
    };

    Window_Message.prototype.updateTailImage = function() {
        if (!this.isPopup()) {
            this._messageTailImage.visible = false;
        } else if (paramTailImage) {
            this._messageTailImage.visible = this.isOpen();
            if (!this.isUsePauseSignTextEnd() && !paramNoUseTail) {
                this._windowPauseSignSprite.visible = false;
            }
        }
    };

    Window_Message.prototype.resetLayout = function() {
        this.padding = this.standardPadding();
        if (this.getPopupTargetCharacter()) {
            this.processVirtual();
        } else {
            this.width  = this.windowWidth();
            this.height = this.windowHeight();
            this.setPauseSignToNormal();
        }
        this.updatePlacement();
        this.updateBackground();
    };

    Window_Message.prototype.processVirtual = function() {
        var virtual      = {};
        virtual.index    = 0;
        virtual.text     = this.convertEscapeCharacters($gameMessage.allText());
        var defaultEscapeList = ['C', 'I', '{', '}'];
        virtual.text     = virtual.text.replace(/\x1b(\w+)\[.*]/gi, function(text) {
            return defaultEscapeList.contains(arguments[1].toUpperCase()) ? text : '';
        });
        virtual.maxWidth = 0;
        this.newPage(virtual);
        while (!this.isEndOfText(virtual)) {
            this.processVirtualCharacter(virtual);
        }
        virtual.y += virtual.height;
        this._subWindowY = virtual.y;
        var choices      = $gameMessage.choices();
        if (choices && $gameSystem.getPopupSubWindowPosition() === 2) {
            virtual.y += choices.length * this._choiceWindow.lineHeight();
            virtual.maxWidth = Math.max(virtual.maxWidth, this.newLineX() + this._choiceWindow.maxChoiceWidth());
        }
        var digit = $gameMessage.numInputMaxDigits();
        if (digit && $gameSystem.getPopupSubWindowPosition() === 2) {
            virtual.y += this._numberWindow.lineHeight();
        }
        var width  = virtual.maxWidth + this.padding * 2;
        var height = Math.max(this.getFaceHeight(), virtual.y) + this.padding * 2;
        var adjust = $gameSystem.getPopupAdjustSize();
        if (adjust) {
            width += adjust[0];
            height += adjust[1];
        }
        if (this.isUsePauseSignTextEnd()) {
            width += this._windowPauseSignSprite.width;
        } else if (paramNoUseTail) {
            height += 8;
        }
        this.width  = Math.max(width, this.getMinimumWidth());
        this.height = Math.max(height, this.getMinimumHeight());
        this.resetFontSettings();
    };

    Window_Message.prototype.getMinimumWidth = function() {
        return $gameVariables.value(paramMinWidthVariableId);
    };

    Window_Message.prototype.getMinimumHeight = function() {
        return $gameVariables.value(paramMinHeightVariableId);
    };

    Window_Message.prototype.getSubWindowPosition = function() {
        var pos = new Point();
        pos.x   = this.x + this.newLineX();
        pos.y   = this.y + this._subWindowY;
        return pos;
    };

    Window_Message.prototype.processVirtualCharacter = function(textState) {
        switch (textState.text[textState.index]) {
            case '\n':
                this.processNewLine(textState);
                break;
            case '\f':
                this.processNewPage(textState);
                break;
            case '\x1b':
                this.processVirtualEscapeCharacter(this.obtainEscapeCode(textState), textState);
                break;
            default:
                this.processVirtualNormalCharacter(textState);
                break;
        }
    };

    var _Window_Message_processNewLine      = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {
        if (this.isPopup()) {
            textState.index++;
            _Window_Message_processNewLine.apply(this, arguments);
            textState.index--;
        } else {
            _Window_Message_processNewLine.apply(this, arguments);
        }
    };

    Window_Message.prototype.processVirtualEscapeCharacter = function(code, textState) {
        switch (code) {
            case 'C':
                this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
                break;
            case 'I':
                this.processVirtualDrawIcon(this.obtainEscapeParam(textState), textState);
                break;
            case '{':
                this.makeFontBigger();
                break;
            case '}':
                this.makeFontSmaller();
                break;
            default:
                this.obtainEscapeParam(textState);
                if (this.obtainEscapeString) {
                    this.obtainEscapeString(textState);
                }
        }
    };

    Window_Message.prototype.processVirtualNormalCharacter = function(textState) {
        var c = textState.text[textState.index++];
        textState.x += this.textWidth(c);
        // Resolve conflict for BetweenCharacters.js
        if (this.getBetweenCharacters) {
            textState.x += this.getBetweenCharacters();
        }
        textState.maxWidth = Math.max(textState.maxWidth, textState.x);
    };

    Window_Message.prototype.processVirtualDrawIcon = function(iconIndex, textState) {
        textState.x += Window_Base._iconWidth + 4;
        textState.maxWidth = Math.max(textState.maxWidth, textState.x);
    };

    var _Window_Message_newLineX      = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        if (this.isPopup()) {
            return $gameMessage.faceName() === '' ? 0 : Window_Message._faceWidth + 8;
        } else {
            return _Window_Message_newLineX.apply(this, arguments);
        }
    };

    Window_Message.prototype.getFaceHeight = function() {
        return $gameMessage.faceName() === '' ? 0 : Window_Message._faceHeight;
    };

    var _Window_Message_drawFace      = Window_Message.prototype.drawFace;
    Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        if (this.isPopup()) {
            width      = width || Window_Base._faceWidth;
            height     = height || Window_Base._faceHeight;
            var bitmap = ImageManager.loadFace(faceName);
            var pw     = Window_Base._faceWidth;
            var ph     = Window_Base._faceHeight;
            var sw     = Math.min(width, pw);
            var sh     = Math.min(height, ph);
            var dx     = Math.floor(x + Math.max(width - pw, 0) / 2);
            var dy     = Math.floor(y + Math.max(height - ph, 0) / 2);
            var sx     = faceIndex % 4 * pw + (pw - sw) / 2;
            var sy     = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
            this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, Window_Message._faceWidth, Window_Message._faceHeight);
        } else {
            _Window_Message_drawFace.apply(this, arguments);
        }
    };

    var _Window_Message_processEscapeCharacter      = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'SH') {
            this.setWindowShake(this.obtainEscapeParam(textState));
        } else {
            _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };

    var _Window_Message_terminateMessage      = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this.setWindowShake(0);
        _Window_Message_terminateMessage.apply(this, arguments);
    };

    //=============================================================================
    // Window_ChoiceList
    //  ポップアップする場合、メッセージウィンドウに連動して表示位置と余白を調整します。
    //=============================================================================
    var _Window_ChoiceList_standardFontSize      = Window_ChoiceList.prototype.standardFontSize;
    Window_ChoiceList.prototype.standardFontSize = function() {
        return this.isPopupLinkage() ? paramFontSize : _Window_ChoiceList_standardFontSize.apply(this, arguments);
    };

    var _Window_ChoiceList_standardPadding      = Window_ChoiceList.prototype.standardPadding;
    Window_ChoiceList.prototype.standardPadding = function() {
        return this.isPopupLinkage() ? paramPadding : _Window_ChoiceList_standardPadding.apply(this, arguments);
    };

    var _Window_ChoiceList_lineHeight      = Window_ChoiceList.prototype.lineHeight;
    Window_ChoiceList.prototype.lineHeight = function() {
        return this.isPopupLinkage() ? paramFontSize + 8 : _Window_ChoiceList_lineHeight.apply(this, arguments);
    };

    var _Window_ChoiceList_start      = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        this._messageWindow.updateTargetCharacterId();
        if (!this.isPopup()) {
            this._messageWindow.resetLayout();
        }
        return _Window_ChoiceList_start.apply(this, arguments);
    };

    var _Window_ChoiceList_updatePlacement      = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        this.resetLayout();
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        if (this.isPopup()) this.updatePlacementPopup();
    };

    var _Window_ChoiceList_refresh      = Window_ChoiceList.prototype.refresh;
    Window_ChoiceList.prototype.refresh = function() {
        this.resetLayout();
        _Window_ChoiceList_refresh.apply(this, arguments);
    };

    Window_ChoiceList.prototype.isPopup = function() {
        return this._messageWindow.isPopup() && this._messageWindow.isOpen();
    };

    var _Window_ChoiceList_numVisibleRows      = Window_ChoiceList.prototype.numVisibleRows;
    Window_ChoiceList.prototype.numVisibleRows = function() {
        var result = _Window_ChoiceList_numVisibleRows.apply(this, arguments);
        if (this.isPopupLinkage()) {
            result = Math.min($gameMessage.choices().length, 8);
        }
        return result;
    };

    //=============================================================================
    // Window_NumberInput
    //  ポップアップする場合、メッセージウィンドウに連動して表示位置と余白を調整します。
    //=============================================================================
    var _Window_NumberInput_standardFontSize      = Window_NumberInput.prototype.standardFontSize;
    Window_NumberInput.prototype.standardFontSize = function() {
        return this.isPopupLinkage() ? paramFontSize : _Window_NumberInput_standardFontSize.apply(this, arguments);
    };

    var _Window_NumberInput_standardPadding      = Window_NumberInput.prototype.standardPadding;
    Window_NumberInput.prototype.standardPadding = function() {
        return this.isPopupLinkage() ? paramPadding : _Window_NumberInput_standardPadding.apply(this, arguments);
    };

    var _Window_NumberInput_lineHeight      = Window_NumberInput.prototype.lineHeight;
    Window_NumberInput.prototype.lineHeight = function() {
        return this.isPopupLinkage() ? paramFontSize + 8 : _Window_NumberInput_lineHeight.apply(this, arguments);
    };

    var _Window_NumberInput_updatePlacement      = Window_NumberInput.prototype.updatePlacement;
    Window_NumberInput.prototype.updatePlacement = function() {
        this.resetLayout();
        this.opacity = 255;
        _Window_NumberInput_updatePlacement.apply(this, arguments);
        if (this.isPopup()) this.updatePlacementPopup();
    };

    Window_NumberInput.prototype.isPopup = function() {
        return this._messageWindow.isPopup() && this._messageWindow.isOpen();
    };

    // Resolve conflict for KMS_DebugUtil.js
    if (isExistPlugin('KMS_DebugUtil')) {
        Window_NumberInput.prototype.isPopup = function() {
            return this._messageWindow && this._messageWindow.isPopup() && this._messageWindow.isOpen();
        };
    }

    //=============================================================================
    // Window_NameBox
    //  メッセージウィンドウに連動して表示位置と余白を調整します。
    //=============================================================================
    if (typeof Window_NameBox !== 'undefined') {
        var _Window_NameBox_standardFontSize      = Window_NameBox.prototype.standardFontSize;
        Window_NameBox.prototype.standardFontSize = function() {
            return this.isPopupLinkage() ? paramFontSize : _Window_NameBox_standardFontSize.apply(this, arguments);
        };

        var _Window_NameBox_standardPadding      = Window_NameBox.prototype.standardPadding;
        Window_NameBox.prototype.standardPadding = function() {
            return this.isPopupLinkage() ? paramPadding : _Window_NameBox_standardPadding.apply(this, arguments);
        };

        var _Window_NameBox_lineHeight      = Window_NameBox.prototype.lineHeight;
        Window_NameBox.prototype.lineHeight = function() {
            return this.isPopupLinkage() ? paramFontSize + 8 : _Window_NameBox_lineHeight.apply(this, arguments);
        };

        var _Window_NameBox_updatePlacement      = Window_NameBox.prototype.updatePlacement;
        Window_NameBox.prototype.updatePlacement = function() {
            this.resetLayout();
            _Window_NameBox_updatePlacement.apply(this, arguments);
            if (this.isPopup()) this.updatePlacementPopup();
        };

        var _Window_NameBox_refresh      = Window_NameBox.prototype.refresh;
        Window_NameBox.prototype.refresh = function() {
            this.resetLayout();
            return _Window_NameBox_refresh.apply(this, arguments);
        };

        Window_NameBox.prototype.isPopup = function() {
            return this._parentWindow.isPopup();
        };

        Window_NameBox.prototype.updatePlacementPopup = function() {
            this.adjustPositionX();
            this.adjustPositionY();
            if (!$gameSystem.getMessagePopupId()) {
                this.openness = 0;
            }
        };
    }

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (paramThroughWindow && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow = function(window) {};

        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }

    //=============================================================================
    // FTKR_ExMessageWindow2.js の修正
    //=============================================================================
    if (imported_FTKR_EMW()) {

        //------------------------------------------------------------------------
        //Game_System
        //フキダシウィンドウの有効無効フラグをウィンドウID毎に保持
        //------------------------------------------------------------------------
        var _EMW_Game_System_initialize  = Game_System.prototype.initialize;
        Game_System.prototype.initialize = function() {
            _EMW_Game_System_initialize.apply(this, arguments);
            this._messagePopupCharacterIds = [];
        };

        Game_System.prototype.setMessagePopupEx = function(windowId, eventId) {
            this._messagePopupCharacterIds[windowId] = eventId;
        };

        var _EMW_Game_System_clearMessagePopup  = Game_System.prototype.clearMessagePopup;
        Game_System.prototype.clearMessagePopup = function() {
            _EMW_Game_System_clearMessagePopup.apply(this, arguments);
            this._messagePopupCharacterIds.forEach(function(id, i) {
                this.clearMessagePopupEx(i);
            }, this);
        };

        Game_System.prototype.clearMessagePopupEx = function(windowId) {
            this._messagePopupCharacterIds[windowId] = 0;
        };

        Game_System.prototype.getMessagePopupIdEx = function(windowId) {
            windowId = windowId || 0;
            return this._messagePopupCharacterIds[windowId] !== 0 ? this._messagePopupCharacterIds[windowId] : null;
        };

        //------------------------------------------------------------------------
        //Scene_Map
        //場所移動時にすべてのウィンドウIDのフキダシ無効化
        //------------------------------------------------------------------------
        var _EMW_Scene_Map_terminate  = Scene_Map.prototype.terminate;
        Scene_Map.prototype.terminate = function() {
            _EMW_Scene_Map_terminate.call(this);
            if (SceneManager.isNextScene(Scene_Map)) {
                $gameSystem.clearMessagePopup();
            }
        };

        //------------------------------------------------------------------------
        //Window_MessageEx
        //------------------------------------------------------------------------
        var _Window_MessageEx_startMessage      = Window_MessageEx.prototype.startMessage;
        Window_MessageEx.prototype.startMessage = function() {
            this.updateTargetCharacterId();
            this.loadWindowskin();
            _Window_MessageEx_startMessage.apply(this, arguments);
            this.resetLayout();
        };

        var _Window_MessageEx_updatePlacement      = Window_MessageEx.prototype.updatePlacement;
        Window_MessageEx.prototype.updatePlacement = function() {
            if (typeof Yanfly === 'undefined' || !Yanfly.Message) {
                this.x = 0;
            }
            _Window_MessageEx_updatePlacement.apply(this, arguments);
            if (!this.isPopup()) {
                return;
            }
            this.updatePlacementPopup();
        };

        Window_MessageEx.prototype.updateTargetCharacterId = function() {
            var id                  = $gameSystem.getMessagePopupIdEx(this._windowId);
            this._targetCharacterId = $gameSystem.getMessagePopupIdEx(this._windowId);
        };

        Window_MessageEx.prototype.updatePlacementPopup = function() {
            this.setPopupPosition(this.getPopupTargetCharacter());
            if (this._choiceWindow && this._gameMessage.isChoice()) {
                this._choiceWindow.updatePlacementPopup();
            }
            this._numberWindow.updatePlacementPopup();
            if (this._nameWindow && checkTypeFunction(this._nameWindow.updatePlacementPopup)) {
                this._nameWindow.updatePlacementPopup();
            }
        };

        Window_MessageEx.prototype.processVirtual = function() {
            var virtual      = {};
            virtual.index    = 0;
            virtual.text     = this.convertEscapeCharacters(this._gameMessage.allText());
            virtual.maxWidth = 0;
            this.newPage(virtual);
            while (!this.isEndOfText(virtual)) {
                this.processVirtualCharacter(virtual);
            }
            virtual.y += virtual.height;
            this._subWindowY = virtual.y;
            var choices      = this._gameMessage.choices();
            if (choices && $gameSystem.getPopupSubWindowPosition() === 2) {
                virtual.y += choices.length * this._choiceWindow.lineHeight();
                virtual.maxWidth = Math.max(virtual.maxWidth, this.newLineX() + this._choiceWindow.maxChoiceWidth());
            }
            var digit = this._gameMessage.numInputMaxDigits();
            if (digit && $gameSystem.getPopupSubWindowPosition() === 2) {
                virtual.y += this._numberWindow.lineHeight();
            }
            var width  = virtual.maxWidth + this.padding * 2;
            var height = Math.max(this.getFaceHeight(), virtual.y) + this.padding * 2;
            var adjust = $gameSystem.getPopupAdjustSize();
            if (adjust) {
                width += adjust[0];
                height += adjust[1];
            }
            if (this.isUsePauseSignTextEnd()) {
                width += this._windowPauseSignSprite.width;
            } else if (paramNoUseTail) {
                height += 8;
            }
            this.width  = width;
            this.height = height;
            this.resetFontSettings();
        };

        var _Window_MessageEx_newLineX      = Window_MessageEx.prototype.newLineX;
        Window_MessageEx.prototype.newLineX = function() {
            if (this.isPopup()) {
                return this._gameMessage.faceName() === '' ? 0 : Window_Message._faceWidth + 8;
            } else {
                return _Window_MessageEx_newLineX.apply(this, arguments);
            }
        };

        Window_MessageEx.prototype.getFaceHeight = function() {
            return this._gameMessage.faceName() === '' ? 0 : Window_Message._faceHeight;
        };

        //------------------------------------------------------------------------
        //Window_ChoiceListEx
        //------------------------------------------------------------------------
        var _Window_ChoiceListEx_numVisibleRows      = Window_ChoiceListEx.prototype.numVisibleRows;
        Window_ChoiceListEx.prototype.numVisibleRows = function() {
            var result = _Window_ChoiceListEx_numVisibleRows.apply(this, arguments);
            if (this.isPopupLinkage()) {
                result = Math.min(this._gameMessage.choices().length, 8);
            }
            return result;
        };

        var _Window_ChoiceListEx_updatePlacement      = Window_ChoiceListEx.prototype.updatePlacement;
        Window_ChoiceListEx.prototype.updatePlacement = function() {
            this.resetLayout();
            _Window_ChoiceListEx_updatePlacement.apply(this, arguments);
            if (this.isPopup()) this.updatePlacementPopup();
        };

        //------------------------------------------------------------------------
        //Window_NumberInputEx
        //------------------------------------------------------------------------
        var _Window_NumberInputEx_updatePlacement      = Window_NumberInputEx.prototype.updatePlacement;
        Window_NumberInputEx.prototype.updatePlacement = function() {
            this.resetLayout();
            this.opacity = 255;
            _Window_NumberInputEx_updatePlacement.apply(this, arguments);
            if (this.isPopup()) this.updatePlacementPopup();
        };

    }//FTKR_ExMessageWindow2
})();

