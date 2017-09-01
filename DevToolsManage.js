//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.1 2017/09/01 スクリプトエラー発生時に警告を出力する機能を追加
// 2.2.0 2017/08/09 パラメータ型指定機能に対応。一部パラメータは再設定が必要です。
//                  起動時に自動で最前面に表示するパラメータを追加。
//                  NW.jsを最新化したときに発生するエラーに対処（ただし一部機能は使用できません）
// 2.1.1 2017/03/10 コミュニティ版でロード時にエンジン名称を出力するよう修正。
// 2.1.0 2016/12/25 スローモーション機能を追加しました。一時的にゲーム速度を最低1/60倍速まで低下できます。
// 2.0.0 2016/12/16 ES2015向けにリファクタリングしました。
//                  JSON形式でのセーブ＆ロードに対応しました。
//                  ゲーム画面にフォーカスを戻した際に、マップとデータベースの再読込を自動で行うようにしました。
//                  「最前面に表示」機能をゲーム中に切り替えられるようにしました。
//                  一部、余分な機能を無効化しました。
// 1.5.1 2016/08/14 コアスクリプトのバージョンを出力するようにしました。
// 1.5.0 2016/06/25 スクリプトの常駐実行機能を追加
// 1.4.2 2016/06/14 SceneManager.initializeでエラーが発生した際にエラー内容を確認できない問題を修正
// 1.4.1 2016/06/14 YEP_CoreEngine.jsと併用したときにウィンドウ高さ補正が効かなくなる問題を修正
// 1.4.0 2016/06/03 メニューバーからデバッグ用のコマンドを実行できる機能を追加
//                  ゲーム画面の更新を停止し、一時的にフリーズする機能を追加
//                  セーブデータのエンコード・デコード機能を追加
// 1.3.0 2016/05/04 スクリプトのその場実行機能を追加
//                  モバイル偽装機能を追加
//                  コードのリファクタリング
// 1.2.2 2016/03/19 ゲームのスピード高速化を8倍速まで対応
// 1.2.1 2016/02/27 タイトルカットしたときにイベントテスト、戦闘テストが正しく開始されない不具合を修正
// 1.2.0 2016/02/24 ゲームのスピードを高速(2倍速)化する機能を追加
//                  戦闘を勝利扱いで即終了する機能を追加
// 1.1.0 2016/01/11 ゲーム開始時にFPS表示（FPS表示/MS表示に対応）を有効にする機能を追加
//                  タイトル画面を飛ばして最新のセーブファイルをロードする機能を追加
// 1.0.2 2016/01/02 繰り返しリセットすると警告が出る問題の解消
//                  ゲームウィンドウを端に寄せる機能(笑)を追加
// 1.0.1 2015/12/19 F12キーでリセットする機能を追加（F5と同様の動作）
// 1.0.0 2015/12/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Developer tools management plugin
 * @author triacontane
 *
 * @param StartupDevTool
 * @desc It will start the developer tools at the start of the game.
 * @default true
 * @type select
 * @option ON
 * @option OFF
 * @option MINIMIZE
 *
 * @param DevToolsPosition
 * @desc Developer tool's position(X, Y, Width, Height) Separated comma(ex:0,0,800,600)
 * @default
 * @type struct<devPosition>
 * @default
 *
 * @param FuncKeyMinimize
 * @desc デベロッパツールの最小化/復帰の切り替えを行うキーです(F1～F12)。
 * このキーをCtrlと一緒に押すとデベロッパツールとゲーム画面を閉じます。
 * @default F8
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param FuncKeyReload
 * @desc 画面のリロードを行うキーです(F1～F12)。デフォルトF5キーと同様の役割を持ちます。
 * @default F12
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param FuncKeyOnTop
 * @desc ゲーム画面を最前面に表示するキーです。(F1～F12)。
 * @default
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param FuncKeyRapidGame
 * @desc ゲームを高速化するキーです。(F1～F12)。
 * @default F10
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param FuncKeyScript
 * @desc スクリプト実行用のウィンドウをポップアップするキーです。(F1～F12)。
 * @default F6
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param FuncKeyFreeze
 * @desc 画面の更新を一時停止するキーです。(F1～F12)。
 * @default
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param ShowFPS
 * @desc 初期状態で画面左上にFPSもしくはMSを表示します（FPS/MS/OFF）。
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param CutTitle
 * @desc タイトル画面をとばして最新のセーブファイルをロードします。
 * セーブファイルがなければニューゲームになります。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param RapidStart
 * @desc 高速化された状態でゲームを開始します。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param RapidSpeed
 * @desc 高速化を実行した際のスピード倍率です。
 * @default 2
 * @type number
 * @min -60
 * @max 16
 *
 * @param FakeMobile
 * @desc モバイル実行を偽装します。(ON/OFF)
 * モバイル版で異なるUIを使用する場合の表示確認ができます。
 * @default false
 * @type boolean
 *
 * @param MenuBarVisible
 * @desc メニューバーを表示し各種デバッグコマンドを実行できます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickMenu
 * @desc クリックメニューから各種デバッグコマンドを実行できます。(-1;無効 0:左 1:ホイール 2:右)
 * @default 1
 * @type select
 * @option -1
 * @option 0
 * @option 1
 * @option 2
 *
 * @param JsonSave
 * @desc JSON形式でセーブ＆ロードできます。テキストエディタ等でセーブファイルを自由に編集できるようになります。
 * @default false
 * @type boolean
 *
 * @param OutputStartupInfo
 * @desc 起動時に様々な情報をログ出力します。
 * @default true
 * @type boolean
 *
 * @param StartupOnTop
 * @desc 起動時にゲーム画面が最前面に固定されます。
 * @default false
 * @type boolean
 *
 * @help デベロッパツールの挙動を調整する制作支援プラグインです。
 * このプラグインはローカル環境でのテストプレー時のみ有効となります。
 * また、UserAgentやコアスクリプトのバージョン等役立つ情報をログに出力します。
 * 快適な開発支援のために以下の機能を提供します。
 *
 * 1. ゲーム開始時にデベロッパツールが自動で立ち上がります。(通常はF8で起動)
 *    OFFにしていた場合でもエラーが発生すると自動で立ち上がります。
 *
 * 2. ゲーム画面を常に最前面に表示してくれます。画面を見ながら作業をする場合に便利です。
 *    ゲーム中にメニューバーから切り替えできます。
 *
 * 3. マップやイベントを修正して再保存すると、ゲーム画面にフォーカスを戻した瞬間に
 *    マップとデータベースを自動でリロードしてくれます。
 *
 * 4. タイトル画面を飛ばして最新のセーブファイルをロードできます。
 *
 * 5. マップ上でのゲームのスピードを高速化(8倍速まで)できます。
 *    (マップ上で高速、フェードアウト、メッセージ表示の高速スキップ)
 *    ゲームスピードが高速の場合は、BGMのピッチが変化します。
 *
 * 6. 強制的に敵を全滅させて勝利することができます。報酬も取得できます。
 *
 * 7. 任意のスクリプトを毎フレーム実行させることができます。
 *    スクリプトの戻り値が変化したときのみ結果をコンソールに出力します。
 *
 * 8. ゲーム画面の更新を一時的に止めて画面をフリーズさせることができます。
 *
 * 9. セーブデータを保存する際にエンコーディングせずjson形式のままセーブ・ロードできます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 総合開発支援プラグイン
 * @author トリアコンタン
 *
 * @param 開始時に起動
 * @desc ゲーム開始時に同時にデベロッパツールを起動します。(MINIMIZE:最小化で起動)
 * @default ON
 * @type select
 * @option ON
 * @option OFF
 * @option MINIMIZE
 *
 * @param デベロッパツール表示位置
 * @desc デベロッパツールの表示座標です。X、Y、横幅、高さを指定します。指定しない場合自動調整されます。
 * @default
 * @type struct<devPosition>
 * @default
 *
 * @param 最小化切替キー
 * @desc デベロッパツールの最小化/復帰の切り替えを行うキーです(F1～F12)。
 * このキーをCtrlと一緒に押すとデベロッパツールとゲーム画面を閉じます。
 * @default F8
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param リロードキー
 * @desc 画面のリロードを行うキーです(F1～F12)。デフォルトF5キーと同様の役割を持ちます。
 * 以前のツクールとの後方互換性を持たせるための機能です。
 * @default F12
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 最前面に表示キー
 * @desc ゲーム画面を最前面表示を切り替えるキーです。(F1～F12)。
 * @default F11
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 高速化切替キー
 * @desc ゲームの高速化を切り替えるキーです。(F1～F12)。
 * @default
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param 強制戦闘勝利キー
 * @desc 戦闘を勝利扱いで強制終了するキーです。(F1～F12)。
 * @default
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param スクリプト実行キー
 * @desc スクリプト常駐実行用のキーです。(F1～F12)。
 * @default
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param フリーズキー
 * @desc 画面の更新を一時停止するキーです。(F1～F12)。
 * @default F10
 * @type select
 * @option none
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param FPS表示
 * @desc 初期状態で画面左上にFPSを表示します。（FPS/MS/OFF）
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param タイトルカット
 * @desc タイトル画面をとばして最新のセーブファイルをロードします。
 * セーブファイルがなければニューゲームになります。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param 高速開始
 * @desc 高速化された状態でゲームを開始します。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param 高速スピード
 * @desc 高速化を実行した際のスピード倍率です。(-60...16)
 * 負の値を設定するとスローモーションになります。
 * @default 2
 * @type number
 * @min -60
 * @max 16
 *
 * @param モバイル偽装
 * @desc モバイル実行を偽装します。(ON/OFF)
 * モバイル版で異なるUIを使用する場合の表示確認ができます。
 * @default false
 * @type boolean
 *
 * @param メニューバー表示
 * @desc メニューバーを表示し各種デバッグコマンドを実行できます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param クリックメニュー
 * @desc クリックメニューから各種デバッグコマンドを実行できます。(-1;無効 0:左 1:ホイール 2:右)
 * @default 1
 * @type select
 * @option -1
 * @option 0
 * @option 1
 * @option 2
 *
 * @param JSON形式セーブ
 * @desc JSON形式でセーブ＆ロードできます。テキストエディタ等でセーブファイルを自由に編集できるようになります。
 * @default false
 * @type boolean
 *
 * @param 起動時情報出力
 * @desc 起動時に様々な情報をログ出力します。
 * @default true
 * @type boolean
 *
 * @param 最前面で起動
 * @desc 起動時にゲーム画面が最前面に固定されます。
 * @default false
 * @type boolean
 * 
 * @help デベロッパツールの挙動を調整する制作支援プラグインです。
 * このプラグインはローカル環境でのテストプレー時のみ有効となります。
 * また、UserAgentやコアスクリプトのバージョン等役立つ情報をログに出力します。
 * 快適な開発支援のために以下の機能を提供します。
 *
 * 1. ゲーム開始時にデベロッパツールが自動で立ち上がります。(通常はF8で起動)
 *    OFFにしていた場合でもエラーが発生すると自動で立ち上がります。
 *
 * 2. ゲーム画面を常に最前面に表示してくれます。画面を見ながら作業をする場合に便利です。
 *    ゲーム中にメニューバーから切り替えできます。
 *
 * 3. マップやイベントを修正して再保存すると、ゲーム画面にフォーカスを戻した瞬間に
 *    マップとデータベースを自動でリロードしてくれます。
 *
 * 4. タイトル画面を飛ばして最新のセーブファイルをロードできます。
 *
 * 5. マップ上でのゲームのスピードを高速化(16倍速まで)できます。
 *    (マップ上で高速、フェードアウト、メッセージ表示の高速スキップ)
 *    逆に低速化(1/60倍速まで)することもできます。速度倍率に負の値を設定してください。
 *    ゲームスピードが変化した場合は、BGMのピッチが変化します。
 *
 * 6. 強制的に敵を全滅させて勝利することができます。報酬も取得できます。
 *
 * 7. 任意のスクリプトを毎フレーム実行させることができます。
 *    スクリプトの戻り値が変化したときのみ結果をコンソールに出力します。
 *
 * 8. ゲーム画面の更新を一時的に止めて画面をフリーズさせることができます。
 *
 * 9. セーブデータを保存する際にエンコーディングせずjson形式のままセーブ・ロードできます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*~struct~devPosition:
 * @param x
 * @desc デベロッパツールのX座標です。
 * @type number
 * @param y
 * @desc デベロッパツールのY座標です。
 * @type number
 * @param width
 * @desc デベロッパツールの横幅です。
 * @type number
 * @param height
 * @desc デベロッパツールの高さです。
 * @type number
 */
/*~struct~devPosition:ja
 * @param x
 * @desc デベロッパツールのX座標です。
 * @type number
 * @param y
 * @desc デベロッパツールのY座標です。
 * @type number
 * @param width
 * @desc デベロッパツールの横幅です。
 * @type number
 * @param height
 * @desc デベロッパツールの高さです。
 * @type number
 */

var p = null;

(function() {
    'use strict';
    const pluginName = 'DevToolsManage';

    //=============================================================================
    // p
    //  ログ出力をより短い関数名で実現します。(RGSS互換)
    //=============================================================================
    p = function(value) {
        console.log.apply(console, arguments);
        SceneManager.getNwJs().showDevTools();
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getParamString = function(paramNames, upperFlg) {
        const value = getParamOther(paramNames);
        return value === null ? '' : upperFlg ? value.toUpperCase() : value;
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getParamJson = function(paramNames, defaultValue) {
        var value = getParamOther(paramNames);
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            }
        } catch (e) {
            alert(`!!!Plugin param is wrong.!!!\nPlugin:${pluginName}.js\nName:[${paramNames}]\nValue:${value}`);
        }
        return value;
    };

    const paramStartupDevTool    = getParamString(['StartupDevTool', '開始時に起動'], true);
    const paramDevToolsPosition  = getParamJson(['DevToolsPosition', 'デベロッパツール表示位置']);
    const paramFuncKeyMinimize   = getParamString(['FuncKeyMinimize', '最小化切替キー']);
    const paramFuncKeyReload     = getParamString(['FuncKeyReload', 'リロードキー']);
    const paramFuncKeyOnTop      = getParamString(['FuncKeyOnTop', '最前面に表示キー']);
    const paramFuncKeyRapidGame  = getParamString(['FuncKeyRapidGame', '高速化切替キー']);
    const paramFuncKeyVictory    = getParamString(['FuncKeyVictory', '強制戦闘勝利キー']);
    const paramFuncKeyScript     = getParamString(['FuncKeyScript', 'スクリプト実行キー']);
    const paramFuncKeyFreeze     = getParamString(['FuncKeyFreeze', 'フリーズキー']);
    const paramShowFPS           = getParamString(['ShowFPS', 'FPS表示'], true);
    const paramCutTitle          = getParamBoolean(['CutTitle', 'タイトルカット']);
    const paramRapidStart        = getParamBoolean(['RapidStart', '高速開始']);
    const paramRapidSpeed        = getParamNumber(['RapidSpeed', '高速スピード'], -60, 16);
    const paramFakeMobile        = getParamBoolean(['FakeMobile', 'モバイル偽装']);
    const paramMenuBarVisible    = getParamBoolean(['MenuBarVisible', 'メニューバー表示']);
    const paramClickMenu         = getParamNumber(['ClickMenu', 'クリックメニュー'], -1);
    const paramJsonSave          = getParamBoolean(['JsonSave', 'JSON形式セーブ']);
    const paramOutputStartupInfo = getParamBoolean(['OutputStartupInfo', '起動時情報出力']);
    const paramStartupOnTop      = getParamBoolean(['StartupOnTop', '最前面で起動']);

    //=============================================================================
    // Graphics
    //  FPSの表示を設定します。
    //=============================================================================
    Graphics.setFPSMeter = function(type) {
        switch (type) {
            case 'FPS':
                this.hideFps();
                this._switchFPSMeter();
                break;
            case 'MS':
                this.hideFps();
                this._switchFPSMeter();
                this._switchFPSMeter();
                break;
        }
    };

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements        = function() {
        _Graphics__createAllElements.apply(this, arguments);
        if (paramOutputStartupInfo) {
            this.outputStartUpLog();
        }
    };

    Graphics.outputStartUpLog = function() {
        console.log('********************************');
        console.log('***   User Agent             ***');
        console.log('********************************');
        console.log(navigator.userAgent);
        console.log('********************************');
        console.log('***   Core Version           ***');
        console.log('********************************');
        console.log('RPG Maker Name    : ' + Utils.RPGMAKER_NAME);
        console.log('RPG Maker Version : ' + Utils.RPGMAKER_VERSION);
        console.log('RPG Maker Engine  : ' + (Utils.RPGMAKER_ENGINE || 'Official Version'));
        console.log('********************************');
        console.log('***   Audio                  ***');
        console.log('********************************');
        console.log('Can Play OGG : ' + WebAudio.canPlayOgg());
        console.log('Can Play M4A : ' + WebAudio.canPlayM4a());

        if (Utils.isNwjs()) {
            console.log('********************************');
            console.log('***   Environment            ***');
            console.log('********************************');
            console.log('Platform : ' + process.platform);
            console.log(process.env);
            console.log('*********************************');
            console.log('***   document head           ***');
            console.log('*********************************');
            console.log(document.head);
            console.log('*********************************');
            console.log('***   document body           ***');
            console.log('*********************************');
            console.log(document.body);
        }
    };

    // テストプレー時以外は以降の機能を無効
    if (!Utils.isNwjs() || !Utils.isOptionValid('test')) {
        console.log(pluginName + ' is valid only test play!');
        return;
    }

    //=============================================================================
    // Utils
    //  モバイルモードを偽装します。
    //=============================================================================
    const _Utils_isMobileDevice = Utils.isMobileDevice;
    Utils.isMobileDevice        = function() {
        return _Utils_isMobileDevice.apply(this, arguments) || paramFakeMobile;
    };

    Utils.isNwjsNormal = function() {
        return this.isNwjs() && navigator.userAgent.match(/Chrome\/4/);
    };

    //=============================================================================
    // Input
    //  promptを再定義します。
    //=============================================================================
    const _Input_wrapNwjsAlert = Input._wrapNwjsAlert;
    Input._wrapNwjsAlert       = function() {
        _Input_wrapNwjsAlert.apply(this, arguments);
        const _window_prompt = window.prompt;
        window.prompt        = function(value, defaultValue) {
            return SceneManager.getNwJs().prompt(value, defaultValue, _window_prompt);
        };
    };

    Input.functionReverseMapper = {
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        F10: 121,
        F11: 122,
        F12: 123
    };

    //=============================================================================
    // SceneManager
    //  状況に応じてデベロッパツールを自動制御します。
    //=============================================================================
    SceneManager.devCommands       = [
        {code: 101, use: true, name: 'DEVツール最小化', key: paramFuncKeyMinimize, type: 'checkbox'},
        {code: 102, use: true, name: '最前面に表示', key: paramFuncKeyOnTop, type: 'checkbox'},
        {code: 103, use: true, name: 'リロード', key: paramFuncKeyReload, type: 'normal'},
        {code: 104, use: true, name: '高速モード切替', key: paramFuncKeyRapidGame, type: 'checkbox'},
        {code: 105, use: true, name: '戦闘強制勝利', key: paramFuncKeyVictory, type: 'normal'},
        {code: 106, use: true, name: '常駐スクリプト実行', key: paramFuncKeyScript, type: 'normal'},
        {code: 107, use: true, name: '画面フリーズ', key: paramFuncKeyFreeze, type: 'checkbox'}
    ];
    SceneManager.originalTitle     = null;
    SceneManager._rapidGame        = false;
    SceneManager._lastScriptString = null;
    SceneManager._lastScriptResult = null;

    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize        = function() {
        _SceneManager_initialize.apply(this, arguments);
        this._nwJsGui = new Controller_NwJs();
        if (paramStartupOnTop) {
            this._nwJsGui.toggleAlwaysOnTop();
        }
        this._freeze = false;
        Graphics.setFPSMeter(paramShowFPS);
    };

    SceneManager.getNwJs = function() {
        return this._nwJsGui;
    };

    SceneManager.toggleFreeze = function() {
        Input.clear();
        this._freeze = !this._freeze;
        return this._freeze;
    };

    const _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException        = function(e) {
        if (this._nwJsGui) this._nwJsGui.showDevTools(false);
        _SceneManager_catchException.apply(this, arguments);
    };

    const _SceneManager_onError = SceneManager.onError;
    SceneManager.onError        = function(e) {
        if (this._nwJsGui) this._nwJsGui.showDevTools(false);
        _SceneManager_onError.apply(this, arguments);
    };

    const _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown        = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        this.onKeyDownForDevToolManage(event);
    };

    SceneManager.onKeyDownForDevToolManage = function(event) {
        let commandCode = null;
        this.devCommands.some(function(commandInfo) {
            if (Input.functionReverseMapper[commandInfo.key] === event.keyCode) {
                commandCode = commandInfo.code;
                return true;
            }
            return false;
        });
        if (commandCode && this._nwJsGui) this.executeDevCommand(commandCode, event);
    };

    SceneManager.executeDevCommand = function(code, event) {
        const command = this['executeDevCommand' + code];
        return command ? command.call(SceneManager, event) : null;
    };

    SceneManager.executeDevCommand101 = function(event) {
        if (event && event.ctrlKey) {
            this._nwJsGui.closeDevTools();
            return false;
        } else {
            return this._nwJsGui.toggleDevTools();
        }
    };

    SceneManager.executeDevCommand102 = function() {
        return this._nwJsGui.toggleAlwaysOnTop();
    };

    SceneManager.executeDevCommand103 = function() {
        location.reload();
    };

    SceneManager.executeDevCommand104 = function() {
        return this.toggleRapid();
    };

    SceneManager.executeDevCommand105 = function() {
        BattleManager.forceVictory();
    };

    SceneManager.executeDevCommand106 = function() {
        this.showScriptDialog();
    };

    SceneManager.executeDevCommand107 = function() {
        return this.toggleFreeze();
    };

    SceneManager.isRapid = function() {
        return SceneManager._rapidGame && paramRapidSpeed > 1;
    };

    SceneManager.isSlow = function() {
        return SceneManager._rapidGame && paramRapidSpeed < -1;
    };

    SceneManager.toggleRapid = function() {
        this._rapidGame = !this._rapidGame;
        const bgm       = AudioManager.saveBgm();
        AudioManager.playBgm(bgm, bgm.pos);
        AudioManager._bgmBuffer.play(true, bgm.pos);
        this.updateDocumentTitle();
        return this.isRapid();
    };

    SceneManager.updateDocumentTitle = function() {
        if (!this.originalTitle) this.originalTitle = document.title;
        document.title = this.originalTitle +
            (this.isRapid() ? ' [!!!Rapid!!!] * ' + paramRapidSpeed : '') +
            (this.isSlow() ? ' [!!!Slow!!!] / ' + -paramRapidSpeed : '') +
            (this._nwJsGui.isOnTop() ? '[!!!Always On Top!!!]' : '');
    };

    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    SceneManager.showScriptDialog = function() {
        const promptValue  = '常駐実行したいスクリプトを入力してください。';
        const scriptString = window.prompt(promptValue, this._nwJsGui.readClipboard());
        if (scriptString !== null && scriptString !== '') {
            this._nwJsGui.showDevTools();
            this._nwJsGui.writeClipboard(scriptString);
            this.executeScript(scriptString);
            this._lastScriptString = scriptString;
        }
    };

    SceneManager.executeScript = function(scriptString) {
        let result = null;
        try {
            result = eval(scriptString);
            if (!this._lastScriptString) {
                SoundManager.playOk();
                console.log('Execute Script : ' + scriptString);
                console.log('Execute Result : ');
            }
        } catch (e) {
            if (!this._lastScriptString) {
                SoundManager.playBuzzer();
                console.log('Error Script : ' + scriptString);
                console.error(e.stack);
            }
            result = e.toString();
        }
        if (!this._lastScriptString || result !== this._lastScriptResult) {
            console.log(result);
        }
        this._lastScriptResult = result;
    };

    const _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs        = function() {
        _SceneManager_initNwjs.apply(this, arguments);
        this.addMenuBar();
    };

    SceneManager.addMenuBar = function() {
        if (!paramMenuBarVisible) {
            this._needAdjustScreen = false;
            return;
        }
        const gui        = require('nw.gui');
        const gameWindow = gui.Window.get();
        if (!gameWindow.menu || gameWindow.menu.type !== 'menubar') {
            this._needAdjustScreen = true;
        }
        gameWindow.menu = new gui.Menu({type: 'menubar'});
    };

    const _SceneManager_run = SceneManager.run;
    SceneManager.run        = function(sceneClass) {
        _SceneManager_run.apply(this, arguments);
        this.setWindowSizeForMenuBar();
    };

    SceneManager.setWindowSizeForMenuBar = function() {
        if (!this._needAdjustScreen) {
            return;
        }
        const gui        = require('nw.gui');
        const gameWindow = gui.Window.get();
        var height = this.getMenuBarHeight();
        gameWindow.moveBy(0, -height);
        gameWindow.resizeBy(0, height);
    };

    SceneManager.getMenuBarHeight = function() {
        return Utils.isNwjsNormal() ? 20 : 25;
    };

    const _SceneManager_requestUpdate = SceneManager.requestUpdate;
    SceneManager._updateRateCount     = 0;
    SceneManager.requestUpdate        = function() {
        if (this.isSlow()) {
            this._updateRateCount++;
            if (this._updateRateCount >= -paramRapidSpeed) {
                this.updateInputData();
                _SceneManager_requestUpdate.apply(this, arguments);
                this._updateRateCount = 0;
            } else {
                if (!this._stopped) {
                    requestAnimationFrame(this.requestUpdate.bind(this));
                }
            }
        } else {
            this._updateRateCount = 0;
            _SceneManager_requestUpdate.apply(this, arguments);
        }
    };

    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain        = function() {
        if (this.isSlow()) {
            this.changeScene();
            this.updateScene();
            this.renderScene();
            this.requestUpdate();
        } else {
            _SceneManager_updateMain.apply(this, arguments);
        }
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene        = function() {
        this.updateScript();
        if (!DataManager.isBattleTest() && !DataManager.isEventTest() && DataManager.isDatabaseLoaded()) {
            this.updateDataReload();
        }
        if (this._freeze || this.isReloading()) return;
        _SceneManager_updateScene.apply(this, arguments);
    };

    SceneManager.updateScript = function() {
        if (this._lastScriptString) {
            this.executeScript(this._lastScriptString);
        }
    };

    SceneManager.updateDataReload = function() {
        if (this.isOnFocusGameWindow()) {
            this.reloadSystemData();
            this._dataSystemLoading = true;
            return;
        }
        if (this._dataSystemLoading) {
            this._dataSystemLoading = false;
            if (this._preVersionId !== $dataSystem.versionId) {
                this.reloadAllData();
                this._dataBaseLoading = true;
                return;
            }
        }
        if (this._dataBaseLoading) {
            this._dataBaseLoading = false;
        }
    };

    SceneManager.isOnFocusGameWindow = function() {
        if (this.getNwJs().isOnFocus()) {
            this.getNwJs().setOnFocus(false);
            return true;
        }
        return false;
    };

    SceneManager.reloadSystemData = function() {
        for (let i = 0; i < DataManager._databaseFiles.length; i++) {
            const name = DataManager._databaseFiles[i].name;
            if (name === '$dataSystem') {
                this._preVersionId = $dataSystem.versionId;
                DataManager.loadDataFile(name, DataManager._databaseFiles[i].src);
                return;
            }
        }
    };

    SceneManager.reloadAllData = function() {
        if (this._scene instanceof Scene_Map && $gamePlayer.canMove()) {
            console.log('Map Reload');
            $gamePlayer.reserveTransfer(
                $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
            $gamePlayer._needsMapReload = true;
        }
        console.log('Data Reload');
        DataManager.loadDatabase();
    };

    SceneManager.isReloading = function() {
        return this._dataSystemLoading || this._dataBaseLoading;
    };

    //=============================================================================
    // BattleManager
    //  強制勝利を追加定義します。
    //=============================================================================
    BattleManager.forceVictory = function() {
        if (SceneManager.isCurrentScene(Scene_Battle) && !this.isBattleAlreadyEnd()) {
            $gameTroop.members().forEach(function(enemy) {
                enemy.addNewState(enemy.deathStateId());
            });
            this.processVictory();
        }
    };

    BattleManager.isBattleAlreadyEnd = function() {
        return this._phase === 'battleEnd';
    };

    //=============================================================================
    // AudioManager
    //  高速化実行時にBGMのピッチを強制的に最大にします。
    //=============================================================================
    const _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm        = function(bgm, pos) {
        const originalPitch = bgm.pitch;
        if (SceneManager.isRapid()) arguments[0].pitch = 150;
        if (SceneManager.isSlow()) arguments[0].pitch = 50;
        _AudioManager_playBgm.apply(this, arguments);
        this._currentBgm.pitch = originalPitch;
    };

    //=============================================================================
    // DataManager
    //  セーブデータのエンコード・デコードを実施します。
    //=============================================================================
    DataManager.decodeSaveGame = function(savefileId) {
        if (this.isThisGameFile(savefileId)) {
            const json = StorageManager.load(savefileId);
            StorageManager.saveToLocalFileJson(savefileId, json);
        }
    };

    DataManager.encodeSaveGame = function(savefileId) {
        const json = StorageManager.loadFromLocalFileJson(savefileId);
        if (json) {
            StorageManager.save(savefileId, json);
        }
    };

    const _DataManager_saveGameWithoutRescue = DataManager.saveGameWithoutRescue;
    DataManager.saveGameWithoutRescue        = function(savefileId) {
        const result = _DataManager_saveGameWithoutRescue.apply(this, arguments);
        if (paramJsonSave) this.decodeSaveGame(savefileId);
        return result;
    };

    const _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue        = function(savefileId) {
        this.encodeSaveGame(savefileId);
        return _DataManager_loadGameWithoutRescue.apply(this, arguments);
    };

    //=============================================================================
    // StorageManager
    //  jsonセーブファイルの読み込みと書き込みを行います。
    //=============================================================================
    StorageManager.saveToLocalFileJson = function(savefileId, json) {
        const fs       = require('fs');
        const dirPath  = this.localFileDirectoryPath();
        const filePath = dirPath + 'file%1.json'.format(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, json);
    };

    StorageManager.loadFromLocalFileJson = function(savefileId) {
        const fs       = require('fs');
        const filePath = this.localFileDirectoryPath() + 'file%1.json'.format(savefileId);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, {encoding: 'utf8'});
        }
        return null;
    };

    //=============================================================================
    // Scene_Base
    //  マップの高速化を提供します。
    //=============================================================================

    const _Scene_Base_fadeSpeed    = Scene_Base.prototype.fadeSpeed;
    Scene_Base.prototype.fadeSpeed = function() {
        return SceneManager.isRapid() ? 1 : _Scene_Base_fadeSpeed.apply(this, arguments);
    };

    const _Scene_Base_startFadeIn    = Scene_Base.prototype.startFadeIn;
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        if (SceneManager.isRapid()) arguments[0] = 1;
        _Scene_Base_startFadeIn.apply(this, arguments);
    };

    const _Scene_Base_startFadeOut    = Scene_Base.prototype.startFadeOut;
    Scene_Base.prototype.startFadeOut = function(duration, white) {
        if (SceneManager.isRapid()) arguments[0] = 1;
        _Scene_Base_startFadeOut.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Boot
    //  タイトル画面をとばしてマップ画面に遷移します。
    //=============================================================================
    const _Scene_Boot_start    = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (paramRapidStart) SceneManager.toggleRapid();
        this.cutSceneTitle();
    };

    Scene_Boot.prototype.cutSceneTitle = function() {
        if (paramCutTitle && !DataManager.isBattleTest() && !DataManager.isEventTest()) {
            if (!this.goToLatestContinue()) {
                this.goToNewGame();
            }
        }
    };

    Scene_Boot.prototype.goToNewGame = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Boot.prototype.goToLatestContinue = function() {
        if (DataManager.isAnySavefileExists()) {
            if (DataManager.loadGame(DataManager.latestSavefileId())) {
                this.reloadMapIfUpdated();
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    Scene_Boot.prototype.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;

    //=============================================================================
    // Scene_Map
    //  高速モードを実装します。
    //=============================================================================
    const _Scene_Map_isFastForward    = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return _Scene_Map_isFastForward.apply(this, arguments) || SceneManager.isRapid();
    };

    const _Scene_Map_updateMainMultiply    = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isFastForward() && SceneManager.isRapid()) {
            for (let i = 2; i <= paramRapidSpeed; i++) {
                this.updateMain();
            }
        }
    };

    //=============================================================================
    // Window_Base
    //  ウィンドウの高速開閉を提供します。
    //=============================================================================
    const _Window_Base_updateOpen    = Window_Base.prototype.updateOpen;
    Window_Base.prototype.updateOpen = function() {
        if (SceneManager.isRapid() && this._opening) this.openness = 255;
        _Window_Base_updateOpen.apply(this, arguments);
    };

    const _Window_Base_updateClose    = Window_Base.prototype.updateClose;
    Window_Base.prototype.updateClose = function() {
        if (SceneManager.isRapid() && this._closing) this.openness = 0;
        _Window_Base_updateClose.apply(this, arguments);
    };

    //=============================================================================
    // Window_Message
    //  メッセージの高速化を提供します。
    //=============================================================================
    const _Window_Message_isTriggered    = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        return _Window_Message_isTriggered.apply(this, arguments) || SceneManager.isRapid();
    };

    const _Window_Message_startPause    = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (SceneManager.isRapid()) this.startWait(1);
    };

    var _Game_Interpreter_command355 = Game_Interpreter.prototype.command355;
    Game_Interpreter.prototype.command355 = function() {
        try {
            return _Game_Interpreter_command355.apply(this, arguments);
        } catch (e) {
            console.warn(`Script Error!! Event ID:${this._eventId}`);
            throw e;
        }
    };

    var _Game_Interpreter_command111 = Game_Interpreter.prototype.command111;
    Game_Interpreter.prototype.command111 = function() {
        if (this._params[0] === 12) {
            try {
                return _Game_Interpreter_command111.apply(this, arguments);
            } catch (e) {
                if (this._params[0] === 12) {
                    console.warn(`Script Error!! Event ID:${this._eventId}`);
                }
                throw e;
            }
        } else {
            return _Game_Interpreter_command111.apply(this, arguments);
        }
    };

    var _Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
    Game_Character.prototype.processMoveCommand = function(command) {
        try {
            _Game_Character_processMoveCommand.apply(this, arguments);
        } catch (e) {
            if (command.code === Game_Character.ROUTE_SCRIPT) {
                console.warn(`Script Error!! ${this.getInformation()}`);
            }
            throw e;
        }
    };

    Game_Character.prototype.getInformation = function() {
        return `X:${this._x} Y:${this._y}`;
    };

    Game_Event.prototype.getInformation = function() {
        return `ID:${this._eventId} Name:${this.event().name}` + Game_Character.prototype.getInformation.call(this);
    };

    Game_Player.prototype.getInformation = function() {
        return `Player` + Game_Character.prototype.getInformation.call(this);
    };

    //=============================================================================
    // Controller_NwJs
    //  Nw.jsのAPI呼び出しを管理します。
    //=============================================================================
    function Controller_NwJs() {
        this.initialize.apply(this, arguments);
    }

    Controller_NwJs.prototype.constructor = Controller_NwJs;

    Controller_NwJs.prototype.initialize = function() {
        this._nwGui           = require('nw.gui');
        this._devTool         = null;
        this._devToolMinimize = false;
        this._onFocus         = false;
        this._menuBar         = this.getWindow().menu;
        this._menuClick       = null;
        this._onTop           = false;
        this.setOnFocus(false);
        this.initSetting();
    };

    Controller_NwJs.prototype.initSetting = function() {
        if (paramMenuBarVisible) this.makeMenu(this._menuBar);
        this.initClickMenu();
        this.addEventListener();
        switch (paramStartupDevTool) {
            case 'ON':
            case 'MINIMIZE':
                this.showDevTools();
                break;
        }
        this.setMenuBar(this._menuBar);
    };

    Controller_NwJs.prototype.initClickMenu = function() {
        this._menuClick      = new this._nwGui.Menu();
        this._clickMenuItems = {};
        this.makeMenu(this._menuClick);
    };

    Controller_NwJs.prototype.setMenuBar = function(menu) {
        this.getWindow().menu = menu;
    };

    Controller_NwJs.prototype.makeMenu = function(menuObject) {
        this.getSortedDevCommands().forEach(function(commandInfo) {
            if (commandInfo.use) this.makeMenuItem(commandInfo, menuObject);
        }, this);
    };

    Controller_NwJs.prototype.makeMenuItem = function(commandInfo, menuObject) {
        const menuItem = new this._nwGui.MenuItem({
            label: commandInfo.name + (commandInfo.key ? '(' + commandInfo.key + ')' : ''),
            type : commandInfo.type,
        });
        if (menuObject === this._menuClick) {
            this._clickMenuItems[commandInfo.name] = menuItem;
        }
        menuItem.click = function() {
            const result = SceneManager.executeDevCommand(commandInfo.code);
            if (commandInfo.type === 'checkbox') this._clickMenuItems[commandInfo.name].checked = result;
        }.bind(this);
        menuObject.append(menuItem);
    };

    Controller_NwJs.prototype.getSortedDevCommands = function() {
        return SceneManager.devCommands.sort(function(a, b) {
            if (a.key && b.key) {
                return Input.functionReverseMapper[a.key] - Input.functionReverseMapper[b.key];
            } else if (a.key || b.key) {
                return a.key ? -1 : 1;
            } else {
                return a.code - b.code;
            }
        });
    };

    Controller_NwJs.prototype.setOnFocus = function(value) {
        this._onFocus = value;
    };

    Controller_NwJs.prototype.isOnFocus = function() {
        return this._onFocus;
    };

    Controller_NwJs.prototype.addEventListener = function() {
        const currentWin = this.getWindow();
        currentWin.removeAllListeners();
        currentWin.on('focus', function() {
            this._onFocus = true;
        }.bind(this));
        document.addEventListener('mousedown', function(event) {
            if (event.button === paramClickMenu) {
                this._menuClick.popup(event.pageX, event.pageY);
            }
        }.bind(this));
    };

    Controller_NwJs.prototype.getWindow = function() {
        return this._nwGui.Window.get();
    };

    Controller_NwJs.prototype.getClipboard = function() {
        return this._nwGui.Clipboard.get();
    };

    Controller_NwJs.prototype.toggleAlwaysOnTop = function() {
        this._onTop = !this._onTop;
        this.getWindow().setAlwaysOnTop(this._onTop);
        SceneManager.updateDocumentTitle();
        return this._onTop;
    };

    Controller_NwJs.prototype.isOnTop = function() {
        return this._onTop;
    };

    Controller_NwJs.prototype.prompt = function(value, defaultValue, aliasPrompt) {
        const win    = this.getWindow();
        const result = aliasPrompt.call(window, value, defaultValue);
        win.focus();
        Input.clear();
        return result;
    };

    Controller_NwJs.prototype.showDevTools = function() {
        if (!(this.getWindow().isDevToolsOpen && this.getWindow().isDevToolsOpen()) || !this._devTool) {
            const devTool = this.getWindow().showDevTools();
            if (!devTool) {
                setTimeout(function() {
                    this.getWindow().focus();
                }.bind(this), 500);
                return;
            }
            if (paramDevToolsPosition && paramDevToolsPosition.width > 0 && paramDevToolsPosition.height > 0) {
                devTool.moveTo(paramDevToolsPosition.x, paramDevToolsPosition.y);
                devTool.resizeTo(paramDevToolsPosition.width, paramDevToolsPosition.height);
            } else {
                devTool.moveTo(0, 0);
                devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
            }
            if (!this._devTool) {
                this.addEventListenerDevTools(devTool);
                this._devTool = devTool;
            }
        } else {
            this._devTool.restore();
        }
        this.focus();
    };

    Controller_NwJs.prototype.addEventListenerDevTools = function(devTool) {
        devTool.removeAllListeners();
        devTool.on('minimize', function() {
            this._devToolMinimize = true;
            this.focus();
        }.bind(this));
        devTool.on('restore', function() {
            this._devToolMinimize = false;
            this.focus();
        }.bind(this));
        devTool.on('loaded', function() {
            if (paramStartupDevTool === 'MINIMIZE') {
                this._devTool.minimize();
            }
            SceneManager.updateDocumentTitle();
        }.bind(this));
        devTool.on('closed', function() {
            this.getWindow().close();
        }.bind(this));
    };

    Controller_NwJs.prototype.toggleDevTools = function() {
        if (this._devTool) {
            if (this._devToolMinimize) {
                this._devTool.restore();
            } else {
                this._devTool.minimize();
            }
            this.focus();
            return !this._devToolMinimize;
        } else {
            this.showDevTools(false);
            return false;
        }
    };

    Controller_NwJs.prototype.closeDevTools = function() {
        if (this.getWindow().isDevToolsOpen()) this.getWindow().closeDevTools();
    };

    Controller_NwJs.prototype.focus = function() {
        this.getWindow().focus();
    };

    Controller_NwJs.prototype.readClipboard = function(mode) {
        if (!mode) mode = 'text';
        return this.getClipboard().get(mode);
    };

    Controller_NwJs.prototype.writeClipboard = function(copyValue, mode) {
        if (!mode) mode = 'text';
        if (mode === 'text') copyValue = copyValue.toString();
        this.getClipboard().set(copyValue, mode);
    };
})();
