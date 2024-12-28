/*=============================================================================
 MessageWindowPopup.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.4.4 2024/12/28 余白設定がフキダシウィンドウを無効にしたときも反映されていた問題を修正
 1.4.3 2024/10/25 英語版ヘルプのプラグインコマンドのキャラクターID下限を削除
 1.4.2 2023/12/27 フキダシ位置の自動設定に関する説明を追記
 1.4.1 2023/12/20 可能な範囲でNovelMessageMZ.jsと併用できるよう修正
 1.4.0 2022/12/08 フキダシウィンドウプラグインの横幅に拘わらず、左側の座標を固定する機能を追加
 1.3.1 2022/10/29 MPP_ChoiceEX.jsと併用するとマップ表示時にエラーになる問題に対処
 1.3.0 2022/09/21 戦闘画面でバトラーを指定したフキダシウィンドウが表示できる機能を追加
 1.2.1 2022/06/12 lowerLimitXなどいくつかのパラメータが機能していなかった問題を修正
 1.2.0 2021/12/06 フォロワーのフキダシ表示機能をMV版から流用して追加
 1.1.3 2021/11/04 テール画像を指定した場合、特定の手順を踏んで選択肢の表示などを実行するとエラーになる問題を修正
 1.1.2 2021/01/17 パラメータでテール画像を指定していない状態でプラグインコマンドからテール画像を変更しても正しく反映されない問題を修正
 1.1.1 2020/11/30 英訳版ヘルプをご提供いただいて追加
 1.1.0 2020/10/17 テール画像を変更できるプラグインコマンドを追加
 1.0.4 2020/09/23 1.0.3の修正方法を変更し、メッセージ表示直後にフキダシを無効化した場合でもネームウィンドウが一瞬上に表示されないよう修正
 1.0.3 2020/09/23 フキダシ位置を下にして表示したとき、条件次第でウィンドウを閉じる瞬間にフキダシが一瞬上に表示される問題を修正
 1.0.2 2020/08/26 ベースプラグインの説明を追加
 1.0.1 2020/08/26 画面サイズとUIサイズで異なる値を指定したときにフキダシ位置がずれる問題を修正
                  テール画像が正しく表示されない問題を修正
 1.0.0 2020/07/25 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc Balloon Window Plugin
 * @author triacontane
 * @target MZ
 * @author Triacontane
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageWindowPopup.js
 *
 * @param FontSize
 * @text FontSize
 * @desc The default font size of the balloon window
 * Default window font size：28
 * @default 22
 * @type number
 *
 * @param Padding
 * @text Margins
 * @desc Margin size of the balloon window
 * Default window margin：18
 * @default 10
 * @type number
 *
 * @param AutoPopup
 * @text Automatic configuration
 * @desc When an event is launched, the target of the speech balloon is automatically set to the launched event.
 * If off, it will be set to the normal message window.
 * @default true
 * @type boolean
 *
 * @param FaceScale
 * @text Face Multiplier
 * @desc Face image display magnification (1-100%) in a speech balloon window
 * @default 75
 * @type number
 *
 * @param WindowLinkage
 * @text Window linkage
 * @desc Interact the choice window and the numeric entry window with the balloon window.
 * @default true
 * @type boolean
 *
 * @param BetweenLines
 * @text Between the lines
 * @desc Set the space between the lines, in pixels.
 * @default 4
 * @type number
 *
 * @param FontSizeRange
 * @text Font Size Increase/Decrease Range
 * @desc This is the range of font size increase or decrease when using the control characters Control characters "\{" or "\}" in the speech balloon window. The default is 12.
 * @default 12
 * @type number
 *
 * @param FontUpperLimit
 * @text Font Size Maximum
 * @desc This is the maximum font size for the control characters Control Character "\{" or "\}" in the speech balloon window. The default is 96.
 * @default 96
 * @type number
 *
 * @param FontLowerLimit
 * @text Lower limit of font size
 * @desc The lower limit of the font size when using the control characters Control characters "\{" or "\}" in a speech balloon window. The default is 24.
 * @default 24
 * @type number
 *
 * @param InnerScreen
 * @text Fit it in the screen
 * @desc Adjust the position so that the speech balloon window fits within the screen not only horizontally, but also vertically.
 * @default false
 * @type boolean
 *
 * @param ShakeSpeed
 * @text The speed of vibration
 * @desc The speed at which the window vibrates.
 * @default 5
 * @type number
 *
 * @param ShakeDuration
 * @text Vibration time
 * @desc The time (in frames) for which the window should vibrate; a value of 0 means it will continue to vibrate.
 * @default 60
 * @type number
 *
 * @param NoUseTail
 * @text Do not use the tail
 * @desc Disable the tailing feature of the posesign. It will be displayed in the default position.
 * @default false
 * @type boolean
 *
 * @param MinWidthVariableId
 * @text Minimum Width Get Variable ID
 * @desc The value of the variable with the specified number will be the minimum width of the speech balloon window (in pixels).
 * @default 0
 * @type variable
 *
 * @param MinHeightVariableId
 * @text Minimum Height Acquisition Variable ID
 * @desc The value of the variable with the specified number will be the minimum value of the height of the balloon window (in pixels).
 * @default 0
 * @type variable
 *
 * @param lowerLimitX
 * @text Lower limit X coordinate
 * @desc The lower X coordinate of the balloon window.
 * @default 0
 * @type number
 *
 * @param upperLimitX
 * @text Upper Limit X Coordinate
 * @desc The upper X coordinate of the speech balloon window.
 * @default 0
 * @type number
 *
 * @param lowerLimitY
 * @text Lower Limit Y Coordinate
 * @desc The lower Y coordinate of the balloon window.
 * @default 0
 * @type number
 *
 * @param upperLimitY
 * @text Upper Limit Y Coordinate
 * @desc The upper Y coordinate of the speech balloon window.
 * @default 0
 * @type number
 *
 * @param tailImage
 * @text Tail Image
 * @desc Specify the image to be used for the tail from the system image.
 * @default
 * @dir img/system/
 * @type file
 *
 * @param tailImageAdjustY
 * @text Tail Image Y Coordinates
 * @desc The Y-coordinate correction value of the image used for the tail.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param FixedLeftX
 * @desc
 * @default 0
 * @type number
 *
 * @command POPUP_VALID
 * @text Enable balloon window
 * @desc Activate the speech balloon with the specified ID.
 *
 * @arg id
 * @text Character ID
 * @desc balloon window Subject ID.[-1]Player [0]this Event [1..]The specified ID event
 * @default 0
 * @type number
 *
 * @arg name
 * @text Event Name
 * @desc Event name for the speech balloon target. If you want to specify the target by name, please specify here.
 * @default
 * @type string
 *
 * @arg windowPosition
 * @text Window Position
 * @desc balloon window position.
 * @default auto
 * @type select
 * @option Auto
 * @value auto
 * @option Display upper character
 * @value upper
 * @option Display under character
 * @value lower
 *
 * @command POPUP_INVALID
 * @text Disable balloon window
 * @desc Disable speech balloon window and return to normal window display.
 *
 * @command FREE_POPUP_VALID
 * @text Enable Free balloon window
 * @desc Enable speech balloon window with the display coordinates.
 *
 * @arg x
 * @text X-coordinate
 * @desc The X-coordinates of balloon window.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @arg y
 * @text Y-coordinate
 * @desc The Y-coordinates of balloon window.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @command POPUP_WINDOW_SETTING
 * @text Persimmon window display settings
 * @desc Change the speech balloon window display settings.
 *
 * @arg windowPosition
 * @text Window Position
 * @desc balloon window position.
 * @default none
 * @type select
 * @option Do not change
 * @value none
 * @option Auto
 * @value auto
 * @option Display upper character
 * @value upper
 * @option Display under character
 * @value lower
 *
 * @arg skin
 * @text Window skins
 * @desc If you want to change the skin of the balloon window, please specify.
 * @default
 * @dir img/system/
 * @type file
 *
 * @command SUB_WINDOW_SETTING
 * @text Sub-window display settings
 * @desc Set how the sub-window is displayed.
 *
 * @arg type
 * @text Display Type
 * @desc This is how the sub-window is displayed.
 * @default 0
 * @type select
 * @option Normal
 * @value 0
 * @option Above the player's upper
 * @value 1
 * @option The right side
 * @value 3
 *
 * @command POPUP_ADJUST_POSITION
 * @text Balloon window position adjustment
 * @desc Adjusts the display coordinates of the speech balloon window.
 *
 * @arg x
 * @text X-coordinate
 * @desc The x-coordinate to be adjusted. Set the value relative to the original coordinates.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @arg y
 * @text Y-coordinate
 * @desc The Y coordinate to be adjusted. Set the value relative to the original coordinates.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @command POPUP_ADJUST_SIZE
 * @text Speech balloon window size adjustment
 * @desc Adjust the display size of the speech balloon window.
 *
 * @arg width
 * @text Width
 * @desc The width to adjust. Set the value relative to the original size.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @arg height
 * @text Height
 * @desc The height to adjust. Set the value relative to the original size.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @command CHANGE_TAIL
 * @text Tail image change
 * @desc Change the tail image to another image.
 *
 * @arg tailImage
 * @text Tail Image
 * @desc Specifies the image to be used for the tail from the system image. If you specify empty, it returns to the tail image specified by the parameter.
 * @default
 * @dir img/system/
 * @type file
 *
 * @help Modify the message window to display as a speech ballon above the head of a specified character.
 * You can configure various settings for ballon from the plugin command.
 *
 * -Available control characters
 * \sh[5] # Vibrate the window with strength [5].
 *
 * You need the base plugin "PluginCommonBase.js" to use this plugin.
 * The "PluginCommonBase.js" is stored in the following folder under the installation folder of RPG Maker MZ.
 * dlc/BasicResources/plugins/official
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */
/*:ja
 * @plugindesc フキダシウィンドウプラグイン
 * @author triacontane
 * @target MZ
 * @author トリアコンタン
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageWindowPopup.js
 *
 * @param FontSize
 * @text フォントサイズ
 * @desc フキダシウィンドウのデフォルトフォントサイズ
 * 通常ウィンドウのフォントサイズ：28
 * @default 22
 * @type number
 *
 * @param Padding
 * @text 余白
 * @desc フキダシウィンドウの余白サイズ
 * 通常ウィンドウの余白：18
 * @default 10
 * @type number
 *
 * @param AutoPopup
 * @text 自動設定
 * @desc イベント起動時にフキダシの対象が、起動したイベントに自動設定されます。
 * OFFの場合は通常のメッセージウィンドウに設定されます。
 * @default true
 * @type boolean
 *
 * @param FaceScale
 * @text フェイス倍率
 * @desc フキダシウィンドウの顔グラフィック表示倍率(1-100%)
 * @default 75
 * @type number
 *
 * @param WindowLinkage
 * @text ウィンドウ連携
 * @desc 選択肢ウィンドウと数値入力ウィンドウをポップアップウィンドウに連動させます。
 * @default true
 * @type boolean
 *
 * @param BetweenLines
 * @text 行間
 * @desc 行と行の間のスペースをピクセル単位で設定します。
 * @default 4
 * @type number
 *
 * @param FontSizeRange
 * @text フォントサイズ増減幅
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの増減幅です。デフォルトは12です。
 * @default 12
 * @type number
 *
 * @param FontUpperLimit
 * @text フォントサイズ上限
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの上限値です。デフォルトは96です。
 * @default 96
 * @type number
 *
 * @param FontLowerLimit
 * @text フォントサイズ下限
 * @desc フキダシウィンドウで制御文字「\{」「\}」を使用した場合のフォントサイズの下限値です。デフォルトは24です。
 * @default 24
 * @type number
 *
 * @param InnerScreen
 * @text 画面内に収める
 * @desc 横方向だけでなく縦方向についても画面内にフキダシウィンドウが収まるように位置を調整します。
 * @default false
 * @type boolean
 *
 * @param ShakeSpeed
 * @text 振動の速さ
 * @desc ウィンドウを振動させる際の速さです。
 * @default 5
 * @type number
 *
 * @param ShakeDuration
 * @text 振動時間
 * @desc ウィンドウを振動させる時間(フレーム)です。0を指定するとずっと振動し続けます。
 * @default 60
 * @type number
 *
 * @param NoUseTail
 * @text テールを使わない
 * @desc ポーズサインのテール化機能を無効化します。デフォルトの位置に表示されます。
 * @default false
 * @type boolean
 *
 * @param MinWidthVariableId
 * @text 最小横幅取得変数ID
 * @desc 指定した番号の変数の値が、フキダシウィンドウの横幅の最小値（単位はピクセル数）となります。
 * @default 0
 * @type variable
 *
 * @param MinHeightVariableId
 * @text 最小高さ取得変数ID
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
 * @desc フキダシウィンドウの下限Y座標です。このパラメータを使用する場合、パラメータ『画面内に収める』を有効にします。
 * @default 0
 * @type number
 *
 * @param upperLimitY
 * @text 上限Y座標
 * @desc フキダシウィンドウの上限Y座標です。このパラメータを使用する場合、パラメータ『画面内に収める』を有効にします。
 * @default 0
 * @type number
 *
 * @param tailImage
 * @text テール画像
 * @desc テールに使う画像をシステム画像から指定します。
 * @default
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
 * @param FixedLeftX
 * @text 固定左X座標
 * @desc 指定した場合フキダシウィンドウの横幅に拘わらず、ウィンドウの左端が固定されます。
 * @default 0
 * @type number
 *
 * @command POPUP_VALID
 * @text フキダシ有効化
 * @desc 指定したIDでフキダシを有効化します。
 *
 * @arg id
 * @text キャラクターID
 * @desc フキダシ対象IDです。[-1]プレイヤー [0]このイベント [1..]指定したIDのイベント [-2..] フォロワー
 * @default 0
 * @type number
 * @min -9999
 *
 * @arg name
 * @text イベント名称
 * @desc フキダシ対象のイベント名称です。対象を名前で指定したい場合はこちらを指定してください。
 * @default
 * @type string
 *
 * @arg windowPosition
 * @text ウィンドウ位置
 * @desc ウィンドウ位置です。自動ではデフォルト上側表示しますが、画面外にウィンドウがはみ出す場合、下側表示となります。
 * @default auto
 * @type select
 * @option 自働
 * @value auto
 * @option キャラクターの上に表示
 * @value upper
 * @option キャラクターの下に表示
 * @value lower
 *
 * @command POPUP_INVALID
 * @text フキダシ無効化
 * @desc フキダシを無効化し通常のウィンドウ表示に戻します。
 *
 * @command FREE_POPUP_VALID
 * @text フリーフキダシ有効化
 * @desc 表示座標を指定してフキダシを有効化します。
 *
 * @arg x
 * @text X座標
 * @desc フキダシのX座標です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @arg y
 * @text Y座標
 * @desc フキダシのY座標です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @command BATTLE_POPUP_VALID
 * @text 戦闘用フキダシ有効化
 * @desc バトラーを指定してフキダシを有効化します。アクターIDかパーティ、敵キャラインデックスのいずれかを指定します。
 *
 * @arg actorId
 * @text アクターID
 * @desc フキダシ表示対象となるアクターです。指定した場合、最優先で参照されます。
 * @default 0
 * @type actor
 *
 * @arg partyIndex
 * @text パーティインデックス
 * @desc フキダシ表示対象となるパーティインデックス(1...)です。
 * @default 0
 * @type number
 *
 * @arg enemyIndex
 * @text 敵キャラインデックス
 * @desc フキダシ表示対象となる敵キャラインデックス(1...)です。
 * @default 0
 * @type number
 *
 * @command POPUP_WINDOW_SETTING
 * @text フキダシウィンドウ表示設定
 * @desc フキダシウィンドウ表示設定を変更します。
 *
 * @arg windowPosition
 * @text ウィンドウ位置
 * @desc フキダシのウィンドウ位置です。
 * @default none
 * @type select
 * @option 変更しない
 * @value none
 * @option 自働
 * @value auto
 * @option キャラクターの上に表示
 * @value upper
 * @option キャラクターの下に表示
 * @value lower
 *
 * @arg skin
 * @text ウィンドウスキン
 * @desc フキダシウィンドウのスキンを変更する場合、指定してください。
 * @default
 * @dir img/system/
 * @type file
 *
 * @command SUB_WINDOW_SETTING
 * @text サブウィンドウ表示設定
 * @desc サブウィンドウの表示方法を設定します。
 *
 * @arg type
 * @text 表示タイプ
 * @desc サブウィンドウの表示方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option プレイヤーの頭上
 * @value 1
 * @option 右側
 * @value 3
 *
 * @command POPUP_ADJUST_POSITION
 * @text フキダシ位置調整
 * @desc フキダシウィンドウの表示座標を調整します。
 *
 * @arg x
 * @text X座標
 * @desc 調整するX座標です。元の座標からの相対値を設定します。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @arg y
 * @text Y座標
 * @desc 調整するY座標です。元の座標からの相対値を設定します。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @command POPUP_ADJUST_SIZE
 * @text フキダシサイズ調整
 * @desc フキダシウィンドウの表示サイズを調整します。
 *
 * @arg width
 * @text 横幅
 * @desc 調整する横幅です。元のサイズからの相対値を設定します。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @arg height
 * @text 高さ
 * @desc 調整する高さです。元のサイズからの相対値を設定します。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @command CHANGE_TAIL
 * @text テール画像変更
 * @desc テール画像を別の画像に変更します。
 *
 * @arg tailImage
 * @text テール画像
 * @desc テールに使う画像をシステム画像から指定します。空を指定するとパラメータで指定したテール画像に戻ります。
 * @default
 * @dir img/system/
 * @type file
 *
 * @help メッセージウィンドウを指定したキャラクターの頭上にフキダシで
 * 表示するよう変更します。
 * プラグインコマンドからフキダシに関する各種設定が可能です。
 *
 * ・使用可能な制御文字
 * \sh[5] # 強さ[5]でウィンドウを振動させます。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    const findEventByName = function(eventName) {
        return $gameMap.events().filter(event => {
            return event.event().name === eventName;
        })[0] || null;
    };

    PluginManagerEx.registerCommand(script, 'POPUP_VALID', function(args) {
        $gameSystem.clearMessagePopupFree();
        let eventId = 0;
        if (args.name) {
            const event = findEventByName(args.name);
            if (event) {
                eventId = event.eventId();
            }
        } else {
            eventId = args.id || this.eventId();
        }
        $gameSystem.setMessagePopup(eventId);
        this.setPopupWindowPosition(args.windowPosition, eventId);
    });

    PluginManagerEx.registerCommand(script, 'POPUP_INVALID', function(args) {
        $gameSystem.clearMessagePopupFree();
        $gameSystem.clearMessagePopup();
    });

    PluginManagerEx.registerCommand(script, 'FREE_POPUP_VALID', function(args) {
        $gameSystem.setMessagePopupFree(args.x, args.y);
    });

    PluginManagerEx.registerCommand(script, 'SUB_WINDOW_SETTING', function(args) {
        $gameSystem.setPopupSubWindowPosition(args.type);
    });

    PluginManagerEx.registerCommand(script, 'POPUP_WINDOW_SETTING', function(args) {
        this.setPopupWindowPosition(args.windowPosition, null);
        if (args.skin) {
            $gameSystem.setPopupWindowSkin(args.skin);
            this.setWaitMode('image');
        }
    });

    PluginManagerEx.registerCommand(script, 'POPUP_ADJUST_POSITION', function(args) {
        $gameSystem.setPopupAdjustPosition(args.x, args.y);
    });

    PluginManagerEx.registerCommand(script, 'POPUP_ADJUST_SIZE', function(args) {
        $gameSystem.setPopupAdjustSize(args.width, args.height);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_TAIL', function(args) {
        $gameSystem.setTailImage(args.tailImage);
    });

    PluginManagerEx.registerCommand(script, 'BATTLE_POPUP_VALID', function(args) {
        if (args.actorId > 0) {
            $gameSystem.setMessagePopupBattler($gameActors.actor(args.actorId));
        } else if (args.partyIndex > 0) {
            $gameSystem.setMessagePopupBattler($gameParty.members()[args.partyIndex - 1]);
        } else if (args.enemyIndex > 0) {
            $gameSystem.setMessagePopupBattler($gameTroop.members()[args.enemyIndex - 1]);
        }
    });

    Game_Interpreter.prototype.setPopupWindowPosition = function(windowPosition, characterId) {
        switch (windowPosition) {
            case 'upper':
                $gameSystem.setPopupFixUpper(characterId);
                break;
            case 'lower':
                $gameSystem.setPopupFixLower(characterId);
                break;
            case 'auto':
                $gameSystem.setPopupAuto(characterId);
        }
    };

    const _Game_Interpreter_terminate    = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this._depth === 0 && ($gameMap.isInterpreterOf(this) || $gameParty.inBattle())) {
            $gameSystem.clearMessagePopup();
        }
    };

    //=============================================================================
    // Game_System
    //  ポップアップフラグを保持します。
    //=============================================================================
    const _Game_System_initialize    = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._messagePopupCharacterId       = 0;
        this._messagePopupPosition          = null;
        this._messagePopupAdjustSize        = null;
        this._messagePopupAdjustPosition    = null;
        this._messagePopupWindowSkin        = null;
        this._messagePopupSubWindowPosition = 0;
        this._messagePopupEnemyIndex = null;
        this._messagePopupActorId = null;
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

    Game_System.prototype.setMessagePopupBattler = function(battler) {
        if (!battler) {
            this.clearBattleMessagePopup();
            return;
        }
        if (battler.isActor()) {
            this._messagePopupActorId = battler.actorId();
            this._messagePopupEnemyIndex = null;
        } else {
            this._messagePopupEnemyIndex = battler.index();
            this._messagePopupActorId = null;
        }
    };

    Game_System.prototype.getMessagePopupBattler = function() {
        if (this._messagePopupActorId > 0) {
            return $gameActors.actor(this._messagePopupActorId);
        } else if (this._messagePopupEnemyIndex >= 0) {
            return $gameTroop.members()[this._messagePopupEnemyIndex];
        } else {
            return null;
        }
    };

    Game_System.prototype.clearBattleMessagePopup = function() {
        this._messagePopupEnemyIndex = null;
        this._messagePopupActorId = null;
    };

    Game_System.prototype.clearMessagePopup = function() {
        this._messagePopupCharacterId    = 0;
        this._messagePopupPositionEvents = [];
        this.clearBattleMessagePopup();
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
        const id = eventId || this._messagePopupCharacterId;
        this.initMessagePositionEvents();
        const positionFixForId   = this._messagePopupPositionEvents[id];
        const event              = $gameMap.event(id);
        const positionFixForName = event ? this._messagePopupPositionEvents[event.event().name] : 0;
        if (positionFixForId > 0) {
            return positionFixForId === position;
        } else if (positionFixForName > 0) {
            return positionFixForName === position;
        } else {
            return this._messagePopupPosition === position;
        }
    };

    Game_System.prototype.getTailImage = function() {
        return this._tailImage || param.tailImage;
    };

    Game_System.prototype.isExistTailImage = function() {
        return !!this.getTailImage();
    };

    Game_System.prototype.setTailImage = function(value) {
        this._tailImage = value;
    };

    //=============================================================================
    // Game_Map
    //  イベント起動時に自動設定を適用します。
    //=============================================================================
    const _Game_Map_setupStartingMapEvent    = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function() {
        const result = _Game_Map_setupStartingMapEvent.apply(this, arguments);
        if (result) {
            if (param.AutoPopup) {
                $gameSystem.setMessagePopup(this._interpreter.eventId());
            } else {
                $gameSystem.clearMessagePopup();
            }
        }
        return result;
    };

    //=============================================================================
    // Game_Troop
    //  戦闘開始時にポップアップフラグを解除します。
    //=============================================================================
    const _Game_Troop_setup    = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        $gameSystem.clearMessagePopup();
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの高さを設定します。
    //=============================================================================
    const _Game_CharacterBase_initMembers    = Game_CharacterBase.prototype.initMembers;
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
    // Game_BattlerBase
    //  戦闘画面でフキダシウィンドウを表示するための設定
    //=============================================================================
    Game_BattlerBase.prototype.setRealScreenPosition = function(x, y, height) {
        this._realScreenX = x;
        this._realScreenY = y;
        this._imageHeight = height;
    };

    Game_BattlerBase.prototype.getRealScreenX = function() {
        return this._realScreenX;
    };

    Game_BattlerBase.prototype.getRealScreenY = function() {
        return this._realScreenY;
    };

    Game_BattlerBase.prototype.getHeightForPopup = function() {
        return this._imageHeight;
    };

    //=============================================================================
    // Game_Screen
    //  画面座標をズームを考慮した座標に変換します。
    //=============================================================================
    Game_Screen.prototype.convertRealX = function(x) {
        const scale = this.zoomScale();
        return scale * x - (scale - 1.0) * this.zoomX();
    };

    Game_Screen.prototype.convertRealY = function(y) {
        const scale = this.zoomScale();
        return scale * y - (scale - 1.0) * this.zoomY();
    };

    //=============================================================================
    // Scene_Map
    //  ポップアップ用のウィンドウスキンをロードします。
    //=============================================================================
    const _Scene_Map_isReady    = Scene_Map.prototype.isReady;
    Scene_Map.prototype.isReady = function() {
        const ready   = _Scene_Map_isReady.apply(this, arguments);
        const popSkin = $gameSystem.getPopupWindowSkin();
        if (popSkin && ready) {
            const bitmap = ImageManager.loadSystem(popSkin);
            return bitmap.isReady();
        }
        return ready;
    };

    //=============================================================================
    // Sprite_Character
    //  キャラクターの高さを逆設定します。
    //=============================================================================
    const _Sprite_Character_updateBitmap    = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        if (this.isImageChanged()) this._imageChange = true;
        _Sprite_Character_updateBitmap.apply(this, arguments);
        if (this._imageChange) {
            this.bitmap.addLoadListener(() => {
                const width  = this.bitmap.width === 1 ? $gameMap.tileWidth() : this.patternWidth();
                const height = this.bitmap.height === 1 ? $gameMap.tileHeight() : this.patternHeight();
                this._character.setSizeForMessagePopup(width, height);
            });
            this._imageChange = false;
        }
    };

    const _Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
    Sprite_Battler.prototype.updatePosition = function() {
        _Sprite_Battler_updatePosition.apply(this, arguments);
        if (this._battler) {
            const target = this.mainSprite();
            this._battler.setRealScreenPosition(this.x, this.y, target?.height || 0);
        }
    };

    //=============================================================================
    // Window_Base
    //  共通処理を定義します。
    //=============================================================================
    const _Window_Base_loadWindowskin    = Window_Base.prototype.loadWindowskin;
    Window_Base.prototype.loadWindowskin = function() {
        const popSkin = $gameSystem.getPopupWindowSkin();
        if (this.isPopup() && popSkin) {
            this.windowskin = ImageManager.loadSystem(popSkin);
        } else {
            _Window_Base_loadWindowskin.apply(this, arguments);
        }
    };

    Window_Base.prototype.setPauseSignToTail = function(lowerFlg) {
    };

    Window_Message.prototype.setPauseSignToTail = function(lowerFlg) {
        if (lowerFlg) {
            this._pauseSignSprite.rotation = 180 * Math.PI / 180;
            this._pauseSignSprite.y        = 12;
            this._pauseSignSprite.anchor.y = 0;
        } else {
            this._pauseSignSprite.rotation = 0;
            this._pauseSignSprite.y        = this.height + 12;
            this._pauseSignSprite.anchor.y = 1;
        }
        this._pauseSignLower  = lowerFlg;
        this._pauseSignToTail = true;
    };

    Window_Base.prototype.setPauseSignImageToTail = function(lowerFlg) {
    };

    Window_Message.prototype.setPauseSignImageToTail = function(lowerFlg) {
        this._pauseSignSprite.visible = false;
        if (lowerFlg) {
            this._messageTailImage.rotation = 180 * Math.PI / 180;
            this._messageTailImage.y        = -param.tailImageAdjustY;
            this._messageTailImage.anchor.y = 0;
        } else {
            this._messageTailImage.rotation = 0;
            this._messageTailImage.y        = this.height + param.tailImageAdjustY;
            this._messageTailImage.anchor.y = 0;
        }
    };

    Window_Base.prototype.setPauseSignToNormal = function() {
        this._pauseSignSprite.rotation = 0;
        this._pauseSignSprite.anchor.y = 1.0;
        this._pauseSignSprite.move(this._width / 2, this._height);
        this._pauseSignToTail = false;
    };

    const _Window_Base_updatePauseSign     = Window_Base.prototype._updatePauseSign;
    Window_Base.prototype._updatePauseSign = function() {
        _Window_Base_updatePauseSign.apply(this, arguments);
        if (this._pauseSignToTail) this._pauseSignSprite.alpha = 1.0;
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
        this.setPopupAdjustBoxSize();
    };

    Window_Base.prototype.setPopupAdjustBoxSize = function() {
        if (Graphics.boxWidth !== Graphics.width) {
            this.x += (Graphics.boxWidth - Graphics.width) / 2 + 3;
        }
        if (Graphics.boxHeight !== Graphics.height) {
            this.y += (Graphics.boxHeight - Graphics.height) / 2 + 3;
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
        const pos = $gameSystem.getPopupAdjustPosition();
        this.x    = this.getPopupBaseX() - this.findPopupLeftX() + (pos ? pos[0] : 0) - 4;
        this.y    = this.getPopupBaseY() - this.height - this.getHeightForPopup() + (pos ? pos[1] : 0);
    };

    Window_Base.prototype.findPopupLeftX = function() {
        return param.FixedLeftX || this.width / 2;
    };

    const _Window_Base_updatePadding    = Window_Base.prototype.updatePadding;
    Window_Base.prototype.updatePadding = function() {
        _Window_Base_updatePadding.apply(this, arguments);
        if (this.isPopup() && param.Padding) {
            this._prevPadding = this.padding;
            this.padding = param.Padding;
        } else if (this._prevPadding !== undefined) {
            this.padding = this._prevPadding;
            this._prevPadding = undefined;

        }
    };

    const _Window_Base_fittingHeight    = Window_Base.prototype.fittingHeight;
    Window_Base.prototype.fittingHeight = function(numLines) {
        if (this.isPopup()) {
            return numLines * this.itemHeight() + this.padding * 2;
        } else {
            return _Window_Base_fittingHeight.apply(this, arguments);
        }
    };

    Window_Base.prototype.setPopupShakePosition = function() {
        const duration = param.ShakeDuration;
        if (duration && this._shakeCount > duration) {
            this.setWindowShake(0);
        }
        const position = Math.sin(this._shakeCount / 10 * param.ShakeSpeed) * this._shakePower;
        this.x += position;
        this._pauseSignSprite.x -= position;
        this._messageTailImage.x -= position;
        this._shakeCount++;
    };

    Window_Base.prototype.setPopupLowerPosition = function() {
        const lowerFlg = this.isPopupLower();
        if (lowerFlg) {
            this.y += this.height + this.getHeightForPopup() + 8;
        }
        if (!param.NoUseTail && !this.isUsePauseSignTextEnd()) {
            this.setPauseSignToTail(lowerFlg);
        }
        if ($gameSystem.getTailImage()) {
            this.setPauseSignImageToTail(lowerFlg);
        }
    };

    Window_Base.prototype.setPopupAdjustInnerScreen = function() {
        if (param.InnerScreen) {
            this.adjustPopupPositionY();
        }
        const adjustResultX = this.adjustPopupPositionX();
        const tailX         = this.findPopupLeftX() + adjustResultX;
        if (!this.isUsePauseSignTextEnd()) {
            this._pauseSignSprite.x = tailX;
        }
        if (this._messageTailImage) {
            this._messageTailImage.x = tailX;
        }
    };

    Window_Base.prototype.setWindowShake = function(power) {
        this._shakePower = power;
        this._shakeCount = 0;
    };

    Window_Base.prototype.adjustPopupPositionX = function() {
        let deltaX = 0;
        const minX = param.lowerLimitX || 0;
        const maxX = param.upperLimitX || Graphics.boxWidth;
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
        let minY = (this._pauseSignLower ? this._pauseSignSprite.height / 2 : 0);
        minY += param.lowerLimitY || 0;
        if (this.y < minY) {
            this.y = minY;
        }
        const maxY = (param.upperLimitY || Graphics.boxHeight) - this._pauseSignSprite.height / 2;
        if (this.y + this.height > maxY) {
            this.y = maxY - this.height;
        }
    };

    Window_Base.prototype.updatePlacementPopup = function() {
        if (!this._messageWindow) {
            return;
        }
        if (param.WindowLinkage) {
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
                    const pos = this._messageWindow.getSubWindowPosition();
                    this.x    = pos.x;
                    this.y    = pos.y;
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

    const _Window_Base_resetFontSettings    = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _Window_Base_resetFontSettings.apply(this, arguments);
        if (this.isPopup()) {
            this.contents.fontSize = param.FontSize;
        }
    };

    Window_Base.prototype.isPopup = function() {
        if (this._messageWindow) {
            return this._messageWindow.isPopup() && this._messageWindow.isOpen();
        } else {
            return false;
        }
    };

    Window_Base.prototype.isPopupLinkage = function() {
        return this.isPopup() && param.WindowLinkage;
    };

    Window_Base.prototype.resetLayout = function() {
        this.width             = this.windowWidth();
        this.height            = this.windowHeight();
        this.contents.fontSize = param.FontSize;
        this.loadWindowskin();
        this.updatePadding();
        this.setPauseSignToNormal();
    };

    const _Window_Base_makeFontBigger    = Window_Base.prototype.makeFontBigger;
    Window_Base.prototype.makeFontBigger = function() {
        if (this.isValidFontRangeForPopup()) {
            if (this.contents.fontSize <= param.FontUpperLimit) {
                this.contents.fontSize += param.FontSizeRange;
            }
        } else {
            _Window_Base_makeFontBigger.apply(this, arguments);
        }
    };

    const _Window_Base_makeFontSmaller    = Window_Base.prototype.makeFontSmaller;
    Window_Base.prototype.makeFontSmaller = function() {
        if (this.isValidFontRangeForPopup()) {
            if (this.contents.fontSize >= param.FontLowerLimit) {
                this.contents.fontSize -= param.FontSizeRange;
            }
        } else {
            _Window_Base_makeFontSmaller.apply(this, arguments);
        }
    };

    Window_Base.prototype.isValidFontRangeForPopup = function() {
        return this.isPopup() && param.FontSizeRange > 0;
    };

    Window_Base.prototype.isUsePauseSignTextEnd = function() {
        return this.isValidPauseSignTextEnd && this.isValidPauseSignTextEnd();
    };

    const _Window_Base_processDrawIcon = Window_Base.prototype.processDrawIcon;
    Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
        _Window_Base_processDrawIcon.apply(this, arguments);
        const iconHeight = ImageManager.iconHeight + 4;
        if (!textState.drawing && textState.height < iconHeight) {
            textState.height = iconHeight;
        }
    };

    //=============================================================================
    // ImageManager
    //  ポップアップ用のフェイスグラフィックサイズを設定します。
    //=============================================================================
    ImageManager.popUpfaceWidth  = Math.floor(ImageManager.faceWidth * param.FaceScale / 100);
    ImageManager.popUpfaceHeight = Math.floor(ImageManager.faceHeight * param.FaceScale / 100);

    //=============================================================================
    // Window_Message
    //  ポップアップする場合、表示内容により座標とサイズを自動設定します。
    //=============================================================================
    const _Window_Message_initialize    = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function(rect) {
        this._defaultRect = rect;
        _Window_Message_initialize.apply(this, arguments);
    };

    const _Window_Message__createAllParts    = Window_Message.prototype._createAllParts;
    Window_Message.prototype._createAllParts = function() {
        _Window_Message__createAllParts.apply(this, arguments);
        this._messageTailImage = new Sprite();
        this._messageTailImage.visible  = false;
        this._messageTailImage.anchor.x = 0.5;
        this.addChild(this._messageTailImage);
        if ($gameSystem.isExistTailImage()) {
            this.refreshTailImage();
        }
    };

    Window_Message.prototype.refreshTailImage = function() {
        const tailImage = $gameSystem.getTailImage();
        if (tailImage === this._tailImageName) {
            return;
        }
        this._messageTailImage.bitmap = ImageManager.loadSystem(tailImage);
        this._tailImageName = tailImage;
        this.setPauseSignImageToTail(this.isPopupLower());
    };

    Window_Message.prototype.clearTailImage = function() {
        this._messageTailImage.bitmap   = null;
        this._tailImageName = null;
    };

    Window_Message.prototype.windowWidth = function() {
        return this._defaultRect.width;
    };

    Window_Message.prototype.windowHeight = function() {
        return this._defaultRect.height;
    };

    const _Window_Message_calcTextHeight    = Window_Message.prototype.calcTextHeight;
    Window_Message.prototype.calcTextHeight = function(textState, all) {
        const height = _Window_Message_calcTextHeight.apply(this, arguments);
        return this.isPopup() ? height - 8 + (param.BetweenLines || 0) : height;
    };

    const _Window_Message_startMessage    = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        this.updateTargetCharacterId();
        this.loadWindowskin();
        _Window_Message_startMessage.apply(this, arguments);
        this.resetLayout();
    };

    const _Window_Message_loadWindowskin    = Window_Message.prototype.loadWindowskin;
    Window_Message.prototype.loadWindowskin = function() {
        const popupWindowSkin = $gameSystem.getPopupWindowSkin();
        if (this._windowSkinName !== popupWindowSkin || !popupWindowSkin) {
            if (this.isPopup()) {
                this._windowSkinName = popupWindowSkin;
            }
        }
        _Window_Message_loadWindowskin.apply(this, arguments);
    };

    Window_Message.prototype.updateTargetCharacterId = function() {
        this._targetCharacterId = $gameSystem.getMessagePopupId();
        if ($gameParty.inBattle()) {
            this._targetBattler = $gameSystem.getMessagePopupBattler();
        }
    };

    Window_Message.prototype.getPopupTargetCharacter = function() {
        if (this._targetBattler) {
            return this._targetBattler;
        }
        const id = this._targetCharacterId;
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

    const _Window_Message_update    = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.apply(this, arguments);
        this.updatePlacementPopupIfNeed();
    };

    Window_Message.prototype.updatePlacementPopupIfNeed = function() {
        const prevX = this.x;
        const prevY = this.y;
        if (this.openness > 0 && this.isPopup()) {
            this.updatePlacementPopup();
        }
        if ((prevX !== this.x || prevY !== this.y) && this.isClosing()) {
            this.openness = 0;
        }
    };

    const _Window_Message_updatePlacement    = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        this.x = this._defaultRect.x;
        _Window_Message_updatePlacement.apply(this, arguments);
        this._nameBoxWindow?.updatePlacement();
        if (!this.isPopup()) {
            return;
        }
        this.updatePlacementPopup();
    };

    const _Window_Message__updatePauseSign    = Window_Message.prototype.hasOwnProperty('_updatePauseSign') ?
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
        const id = this._targetCharacterId;
        return $gameSystem.isPopupFixLower(id) || (!$gameSystem.isPopupFixUpper(id) && this.getWindowTopY() < 0);
    };

    Window_Message.prototype.getWindowTopY = function() {
        return this.y;
    };

    Window_Message.prototype.updatePlacementPopup = function() {
        if (this.isClosing()) {
            return;
        }
        this.setPopupPosition(this.getPopupTargetCharacter());
        if (this._choiceListWindow && $gameMessage.isChoice()) {
            this._choiceListWindow.updatePlacementPopup();
        }
        this._numberInputWindow.updatePlacementPopup();
        this._nameBoxWindow.updatePlacement();
    };

    Window_Message.prototype.updateTailImage = function() {
        if (!this.isPopup()) {
            this._messageTailImage.visible = false;
        } else if ($gameSystem.isExistTailImage()) {
            this.refreshTailImage();
            this._messageTailImage.visible = this.isOpen();
            if (!this.isUsePauseSignTextEnd() && !param.NoUseTail) {
                this._pauseSignSprite.visible = false;
            }
        } else if (this._tailImageName) {
            this.clearTailImage();
        }
    };

    Window_Message.prototype.resetLayout = function() {
        if (this.getPopupTargetCharacter()) {
            this.resizeForPopup();
        } else {
            this.width  = this.windowWidth();
            this.height = this.windowHeight();
            this.setPauseSignToNormal();
        }
        this.updatePlacement();
        this.updateBackground();
        this.updatePadding();
    };

    Window_Message.prototype.resizeForPopup = function() {
        this.updatePadding();
        const virtual = this.createVirtualTextState();
        let width    = virtual.outputWidth + this.padding * 2;
        let height   = Math.max(this.getFaceHeight(), virtual.y) + this.padding * 2;
        const adjust = $gameSystem.getPopupAdjustSize();
        if (adjust) {
            width += adjust[0];
            height += adjust[1];
        }
        if (this.isUsePauseSignTextEnd()) {
            width += this._pauseSignSprite.width;
        } else if (param.NoUseTail) {
            height += 8;
        }
        this.width  = Math.max(width, this.getMinimumWidth());
        this.height = Math.max(height, this.getMinimumHeight());
        // for NovelMessageMZ.js
        if (this._windowRect) {
            this._windowRect.width = this.width;
            this._windowRect.height = this.height;
        }
        this.resetFontSettings();
    };

    Window_Message.prototype.createVirtualTextState = function() {
        const text = this.convertEscapeCharacters($gameMessage.allText());
        const virtual = this.createTextState(text, 0, 0, 0);
        virtual.drawing = false;
        virtual.startX  = this.newLineX();
        this.newPage(virtual);
        this.processAllText(virtual);
        virtual.outputWidth += virtual.startX;
        virtual.y += virtual.height;
        this._subWindowY = virtual.y;
        if ($gameSystem.getPopupSubWindowPosition() !== 2) {
            return virtual;
        }
        const choices = $gameMessage.choices();
        if (choices) {
            virtual.y += choices.length * this._choiceListWindow.lineHeight();
            virtual.outputWidth = Math.max(virtual.outputWidth, this.newLineX() + this._choiceListWindow.maxChoiceWidth());
        }
        if ($gameMessage.numInputMaxDigits()) {
            virtual.y += this._numberInputWindow.windowHeight() - $gameSystem.windowPadding() * 2;
        }
        return virtual;
    };

    Window_Message.prototype.getMinimumWidth = function() {
        return $gameVariables.value(param.MinWidthVariableId);
    };

    Window_Message.prototype.getMinimumHeight = function() {
        return $gameVariables.value(param.MinHeightVariableId);
    };

    Window_Message.prototype.getSubWindowPosition = function() {
        const pos = new Point();
        pos.x     = this.x + this.newLineX();
        pos.y     = this.y + this._subWindowY;
        return pos;
    };

    const _Window_Message_newLineX    = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        if (this.isPopup()) {
            return $gameMessage.faceName() === '' ? 0 : ImageManager.popUpfaceWidth + 8;
        } else {
            return _Window_Message_newLineX.apply(this, arguments);
        }
    };

    Window_Message.prototype.getFaceHeight = function() {
        return $gameMessage.faceName() === '' ? 0 : ImageManager.popUpfaceHeight;
    };

    const _Window_Message_drawFace    = Window_Message.prototype.drawFace;
    Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        if (this.isPopup()) {
            arguments[4] = ImageManager.faceWidth;
            arguments[5] = ImageManager.faceHeight;
            this.contents.prepareDwDh(ImageManager.popUpfaceWidth, ImageManager.popUpfaceHeight);
        }
        _Window_Message_drawFace.apply(this, arguments);
    };

    const _Window_Message_processEscapeCharacter    = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'SH') {
            this.setWindowShake(this.obtainEscapeParam(textState));
        } else {
            if (textState.drawing) {
                _Window_Message_processEscapeCharacter.apply(this, arguments);
            } else {
                Window_Base.prototype.processEscapeCharacter.apply(this, arguments);
            }
        }
    };

    const _Window_Message_terminateMessage    = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this.setWindowShake(0);
        _Window_Message_terminateMessage.apply(this, arguments);
    };

    //=============================================================================
    // Window_ChoiceList
    //  ポップアップする場合、メッセージウィンドウに連動して表示位置と余白を調整します。
    //=============================================================================
    const _Window_ChoiceList_lineHeight    = Window_ChoiceList.prototype.lineHeight;
    Window_ChoiceList.prototype.lineHeight = function() {
        return this.isPopupLinkage() ? param.FontSize + 8 : _Window_ChoiceList_lineHeight.apply(this, arguments);
    };

    const _Window_ChoiceList_start    = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        this._messageWindow.updateTargetCharacterId();
        if (!this.isPopup()) {
            this._messageWindow.resetLayout();
        }
        return _Window_ChoiceList_start.apply(this, arguments);
    };

    const _Window_ChoiceList_updatePlacement    = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        this.resetLayout();
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        if (this.isPopup()) {
            this.updatePlacementPopup();
        }
    };

    const _Window_ChoiceList_refresh    = Window_ChoiceList.prototype.refresh;
    Window_ChoiceList.prototype.refresh = function() {
        this.resetLayout();
        _Window_ChoiceList_refresh.apply(this, arguments);
    };

    const _Window_ChoiceList_numVisibleRows    = Window_ChoiceList.prototype.numVisibleRows;
    Window_ChoiceList.prototype.numVisibleRows = function() {
        const result = _Window_ChoiceList_numVisibleRows.apply(this, arguments);
        if (this.isPopupLinkage()) {
            return Math.min($gameMessage.choices().length, 8);
        }
        return result;
    };

    const _Window_NameBox_refresh    = Window_NameBox.prototype.refresh;
    Window_NameBox.prototype.refresh = function() {
        this.resetLayout();
        _Window_NameBox_refresh.apply(this, arguments);
    };

    const _Window_NameBox_lineHeight    = Window_NameBox.prototype.lineHeight;
    Window_NameBox.prototype.lineHeight = function() {
        return this.isPopup() ? param.FontSize : _Window_NameBox_lineHeight.apply(this, arguments);
    };

    const _Window_NameBox_baseTextRect    = Window_NameBox.prototype.baseTextRect;
    Window_NameBox.prototype.baseTextRect = function() {
        const rect = _Window_NameBox_baseTextRect.apply(this, arguments);
        rect.y += 2;
        return rect;
    };

    Window_NameBox.prototype.isPopup = function() {
        return this._messageWindow && this._messageWindow.isPopup();
    };

    /**
     * Bitmap
     * dw, dhの値を予約できるようにします。
     */
    const _Bitmap_blt = Bitmap.prototype.blt;
    Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (this._prepareDw) {
            dw = this._prepareDw;
            this._prepareDw = null;

        }
        if (this._prepareDh) {
            dh = this._prepareDh;
            this._prepareDh = null;
        }
        _Bitmap_blt.call(this, source, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    Bitmap.prototype.prepareDwDh = function(dw, dh) {
        this._prepareDw = dw;
        this._prepareDh = dh;
    };
})();
