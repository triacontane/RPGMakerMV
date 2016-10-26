//=============================================================================
// SceneGlossary.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.0 2016/10/26 背景ピクチャを設定したときに、もともとマップ背景を透過表示できる機能を追加
// 1.5.0 2016/08/06 まだ確認していない用語の文字色を変えられる機能を追加
// 1.4.1 2016/07/03 戦闘画面のアイテム選択ウィンドウに用語集アイテムが表示されていた問題を修正
// 1.4.0 2016/05/31 テキストと画像を重ねて表示する設定を追加
//                  新語が自動登録された場合にスイッチや変数を操作する機能を追加
//                  アイテムを使用する際に確認ウィンドウを表示する機能を追加
//                  新語の自動登録に制御文字を使えるよう修正
//                  収集率を画面左下に表示できる機能を追加
// 1.3.1 2016/04/26 ピクチャ名を変数で指定できる機能を追加
// 1.3.0 2016/04/23 用語の種別ごとに、複数の用語画面を作成できる機能を追加
//                  用語をアイテムとして使用できる機能を追加
// 1.2.1 2016/04/21 複数ページ送りをタッチ操作に対応
//                  アイテムタイプの判定が無条件で有効になってしまう不具合を修正
// 1.2.0 2016/04/20 自動登録の対象外にするタグを追加
//                  ひとつの用語に対して複数のページを表示できる機能を追加
//                  用語が存在しない状態で決定ボタンを押すとフリーズする問題を修正
// 1.1.0 2016/04/20 カテゴリごとに分類して表示できる機能を追加
// 1.0.0 2016/04/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Glossary Plugin
 * @author triacontane
 *
 * @param UseCategory
 * @desc 用語をカテゴリごとに分けて表示します。
 * @default OFF
 *
 * @param CommandName
 * @desc メニュー画面に表示されるコマンド名です。空欄にすると追加されなくなります。
 * @default Glossary
 *
 * @param CommandName2
 * @desc メニュー画面に表示される2つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param CommandName3
 * @desc メニュー画面に表示される3つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param CommandName4
 * @desc メニュー画面に表示される4つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param ItemType
 * @desc 用語扱いとするアイテムの隠しアイテムタイプ（A or B）
 * @default A
 *
 * @param AutoAddition
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default ON
 *
 * @param FontSize
 * @desc 用語集のフォントサイズです。
 * @default 22
 *
 * @param GlossaryListWidth
 * @desc 用語集リストのウィンドウ横幅です。
 * @default 240
 *
 * @param HelpText
 * @desc 画面上のヘルプ画面に表示するテキストです。未指定の場合、ヘルプウィンドウは非表示になります。
 * @default Select the Words
 *
 * @param HelpText2
 * @desc 用語カテゴリ選択時のヘルプ画面に表示するテキストです。
 * @default Select the category
 *
 * @param UsableItem
 * @desc 用語選択中に対象の用語を「アイテム」として使用できるようになります。
 * @default OFF
 *
 * @param AutoResizePicture
 * @desc ウィンドウ内にピクチャを表示する際、表示可能なように自動で縮小されます。(ON/OFF)
 * @default ON
 *
 * @param PicturePosition
 * @desc 画像の表示位置です。(top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾)
 * @default top
 *
 * @param PictureAlign
 * @desc 画像の揃えです。(left:左揃え center:中央揃え right:右揃え)
 * @default center
 *
 * @param BackPicture
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param ThroughBackPicture
 * @desc 背景ピクチャの背後に通常の背景（マップ画面）を表示します。
 * @default OFF
 *
 * @param ConfirmMessage
 * @desc 用語アイテムを使用する際に確認メッセージが表示されるようになります。
 * @default OFF
 *
 * @param SwitchAutoAdd
 * @desc 用語アイテムの自動登録が行われた際に指定した番号のスイッチがONになります。何らかの通知を行いたい場合に指定します。
 * @default 0
 *
 * @param VariableAutoAdd
 * @desc 用語アイテムの自動登録が行われた際に指定した番号の変数にアイテムIDが設定されます。
 * @default 0
 *
 * @param ConfirmUse
 * @desc 確認メッセージで使う場合のメッセージです。
 * @default Use
 *
 * @param ConfirmNoUse
 * @desc 確認メッセージで使わない場合のメッセージです。
 * @default No Use
 *
 * @param CompleteView
 * @desc カテゴリごとの収集率を表示します。
 * @default OFF
 *
 * @param CompleteMessage
 * @desc 収集率を表示する文言です。「%1」が収集率に変換されます。
 * @default Complete \c[2]%1\c[0] \%
 *
 * @param NewGlossaryColor
 * @desc 新着用語を明示するためのカラーです。システムカラーから選択してください。
 * @default 2
 *
 * @noteParam SGピクチャ
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @noteParam SGPicture
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @help ゲームに登場する用語を閲覧できる画面を追加します。
 * 用語を解説する画像およびテキスト説明がウィンドウに表示されます。
 * 用語は「隠しアイテム」としてアイテムのデータベースにあからじめ登録しておきます。
 *
 * 用語は対象アイテムを取得することで閲覧可能になるほか、文章の表示の命令中で
 * 同一単語が出現した場合に自動的に登録する機能もあります。
 *
 * 用語はすべてを一つのウィンドウで表示する方式と
 * カテゴリごとに分類して表示する方式が選択できます。
 * パラメータから表示方法を選択してください。
 * カテゴリごとに表示する場合はメモ欄に「<SGカテゴリ:カテゴリ名>」を指定してください。
 *
 * メニュー画面およびプラグインコマンドから用語集画面に遷移できます。
 *
 * ・データ登録方法
 *
 * 1.アイテムデータベースに新規データを登録して
 * 「アイテムタイプ」を「隠しアイテムA」もしくは「隠しアイテムB」に設定
 *
 * 2.「名前」に用語の名称を設定
 *
 * 3.「メモ欄」に以下の通り記述(不要な項目は省略可能)
 *   説明文およびカテゴリ名には制御文字が使用できます。
 * <SGDescription:説明文>    // 用語の説明文
 * <SGCategory:カテゴリ名>   // 用語の属するカテゴリの名称
 * <SGManual>                // 用語を自動登録の対象から除外する
 * <SGPicture:ファイル名>    // 用語のピクチャのファイル名
 * <SGPicturePosition:text>  // ピクチャの表示位置
 *  top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾
 *  under:テキストの下
 * <SGPictureScale:0.5>      // ピクチャの拡大率
 * <SGPictureAlign:right>    // ピクチャの揃え
 *  left:左揃え center:中央揃え right:右揃え
 *
 * さらに、一つの用語で複数のページを使用することができます。
 * ページは方向キーの左右で切り替えます。
 * <SGDescription2:説明文>   // 2ページ目の用語の説明文
 * <SGPicture2:ファイル名>   // 2ページ目の用語のピクチャのファイル名
 * <SGPicturePosition2:text> // 2ページ目のピクチャの表示位置
 *
 * 3ページ目以降も同様で、最大99ページまで指定できます。
 * 複数ページ表示する場合の1ページ目には「1」をつけないでください。
 * NG:<SGDescription1:説明文>
 *
 * 「CommandName2」のパラメータに内容を設定すると、
 * メニュー画面に二つ目の用語画面を追加できます。
 * 二つ目の用語画面に用語を登録したい場合は、以下のタグが必要です。
 *
 * <SGType:2>   // 用語の属する種別番号
 *
 * 「CommandName3」および「CommandName4」も同様です。
 * 「プラグインコマンド」から呼び出す場合、コマンド名の後に
 * 種別を指定してください。
 *
 * 「アイテム使用」のパラメータをONにすると、用語をアイテムとして使用できます。
 * 通常はOFFで問題ありませんが、使い方次第です。
 *
 * 「YEP_MainMenuManager.js」と連携して、コマンドの表示制御を行うには
 * 「コマンド名称」の項目を空にした上で「YEP_MainMenuManager.js」の
 * パラメータを以下の通り設定してください。
 *
 * Menu X Name      : 'Glossary1'
 * Menu X Symbol    : glossary1
 * Menu X Main Bind : this.commandGlossary.bind(this, 1)
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * GLOSSARY_GAIN_ALL or 用語集全取得 [種別]
 *  データベースに登録している全ての用語を取得状態にします。
 *  種別を省略すると、自動で「1」になります。
 * 例：GLOSSARY_GAIN_ALL 2
 *
 * GLOSSARY_CALL or 用語集画面の呼び出し
 *  用語集画面を呼び出します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ゲーム内用語辞典プラグイン
 * @author トリアコンタン
 *
 * @param カテゴリ分類
 * @desc 用語をカテゴリごとに分けて表示します。
 * @default OFF
 * 
 * @param コマンド名称
 * @desc メニュー画面に表示されるコマンド名です。空欄にすると追加されなくなります。
 * @default 用語辞典
 *
 * @param コマンド名称2
 * @desc メニュー画面に表示される2つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param コマンド名称3
 * @desc メニュー画面に表示される3つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param コマンド名称4
 * @desc メニュー画面に表示される4つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 * 
 * @param アイテムタイプ
 * @desc 用語扱いとするアイテムの隠しアイテムタイプ（A or B）
 * @default A
 * 
 * @param 自動登録
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default ON
 *
 * @param フォントサイズ
 * @desc 用語集のフォントサイズです。
 * @default 22
 *
 * @param 用語集リスト横幅
 * @desc 用語集リストのウィンドウ横幅です。
 * @default 240
 *
 * @param ヘルプテキスト
 * @desc 用語リスト選択時のヘルプ画面に表示するテキストです。未指定の場合、ヘルプウィンドウは非表示になります。
 * @default ゲーム中に登場する用語を解説しています。
 *
 * @param ヘルプテキスト2
 * @desc 用語カテゴリ選択時のヘルプ画面に表示するテキストです。
 * @default カテゴリを選択してください。
 *
 * @param アイテム使用
 * @desc 用語選択中に対象の用語を「アイテム」として使用できるようになります。
 * @default OFF
 *
 * @param 画像の自動縮小
 * @desc ウィンドウ内にピクチャを表示する際、表示可能なように自動で縮小されます。(ON/OFF)
 * @default ON
 *
 * @param 画像の表示位置
 * @desc 画像の表示位置です。(top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾)
 * @default top
 *
 * @param 画像の揃え
 * @desc 画像の揃えです。(left:左揃え center:中央揃え right:右揃え)
 * @default center
 *
 * @param 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 背景ピクチャ透過
 * @desc 背景ピクチャの背後に通常の背景（マップ画面）を表示します。
 * @default OFF
 *
 * @param 確認メッセージ
 * @desc 用語アイテムを使用する際に確認メッセージが表示されるようになります。
 * @default OFF
 *
 * @param 自動登録IDスイッチ
 * @desc 用語アイテムの自動登録が行われた際に指定した番号のスイッチがONになります。何らかの通知を行いたい場合に指定します。
 * @default 0
 *
 * @param 自動登録ID変数
 * @desc 用語アイテムの自動登録が行われた際に指定した番号の変数にアイテムIDが設定されます。
 * @default 0
 *
 * @param 確認_使う
 * @desc 確認メッセージで使う場合のメッセージです。
 * @default 使う
 *
 * @param 確認_使わない
 * @desc 確認メッセージで使わない場合のメッセージです。
 * @default やめる
 * 
 * @param 収集率表示
 * @desc カテゴリごとの収集率を表示します。コンプリートの目安です。
 * @default OFF
 *
 * @param 収集率メッセージ
 * @desc 収集率を表示する文言です。「%1」が収集率に変換されます。
 * @default 収集率 \c[2]%1\c[0] ％
 *
 * @param 新着用語カラー
 * @desc 新着用語を明示するためのカラーです。システムカラーから選択してください。
 * @default 2
 *
 * @noteParam SGピクチャ
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @noteParam SGPicture
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @help ゲームに登場する用語を閲覧できる画面を追加します。
 * 用語を解説する画像およびテキスト説明がウィンドウに表示されます。
 * 用語は「隠しアイテム」としてアイテムのデータベースにあからじめ登録しておきます。
 *
 * 用語は対象アイテムを取得することで閲覧可能になるほか、文章の表示の命令中で
 * 同一単語が出現した場合に自動的に登録する機能もあります。
 * （特定の用語を自動登録の対象外に指定することも可能です）
 *
 * 用語はすべてを一つのウィンドウで表示する方式と
 * カテゴリごとに分類して表示する方式が選択できます。
 * パラメータから表示方法を選択してください。
 * カテゴリごとに表示する場合はメモ欄に「<SGカテゴリ:XXX>」を指定してください。
 *
 * メニュー画面およびプラグインコマンドから用語集画面に遷移できます。
 *
 * ・データ登録方法
 *
 * 1.アイテムデータベースに新規データを登録して
 * 「アイテムタイプ」を「隠しアイテムA」もしくは「隠しアイテムB」に設定
 *
 * 2.「名前」に用語の名称を設定
 * 
 * 3.「メモ欄」に以下の通り記述(不要な項目は省略可能)
 * <SG説明:説明文>           // 用語の説明文
 * <SGカテゴリ:カテゴリ名>   // 用語の属するカテゴリの名称
 * <SG手動>                  // 用語を自動登録の対象から除外する
 * <SGピクチャ:ファイル名>   // 用語のピクチャのファイル名
 * <SGピクチャ位置:text>     // ピクチャの表示位置
 *  top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾
 *  under:テキストの下
 * <SGピクチャ拡大率:0.5>    // ピクチャの拡大率
 * <SGピクチャ揃え:right>    // ピクチャの揃え
 *  left:左揃え center:中央揃え right:右揃え
 *
 * さらに、一つの用語で複数のページを使用することができます。
 * ページは方向キーの左右で切り替えます。
 * <SG説明2:説明文>          // 2ページ目の用語の説明文
 * <SGピクチャ2:ファイル名>  // 2ページ目の用語のピクチャのファイル名
 * <SGピクチャ位置2:text>    // 2ページ目のピクチャの表示位置
 *
 * 3ページ目以降も同様で、最大99ページまで指定できます。
 * 複数ページ表示する場合の1ページ目には「1」をつけないでください。
 * NG:<SG説明1:説明文>
 *
 * 「コマンド名称2」のパラメータに内容を設定すると、
 * メニュー画面に二つ目の用語画面を追加できます。
 * 二つ目の用語画面に用語を登録したい場合は、以下のタグが必要です。
 *
 * <SG種別:2>   // 用語の属する種別番号
 *
 * 「コマンド名称3」および「コマンド名称4」も同様です。
 * 「プラグインコマンド」から呼び出す場合、コマンド名の後に
 * 種別を指定してください。
 *
 * 「アイテム使用」のパラメータをONにすると、用語をアイテムとして使用できます。
 * 通常はOFFで問題ありませんが、使い方次第です。
 *
 * 「YEP_MainMenuManager.js」と連携して、コマンドの表示制御を行うには
 * 「コマンド名称」の項目を空にした上で「YEP_MainMenuManager.js」の
 * パラメータを以下の通り設定してください。
 *
 * Menu X Name      : '用語辞典1'
 * Menu X Symbol    : glossary1
 * Menu X Main Bind : this.commandGlossary.bind(this, 1)
 *
 * 通常アイテムのメモ欄に以下の通り設定するとアイテム画面から
 * 辞書画面に直接遷移できます。特定のアイテムの解説等に活用できます。
 *
 * <SG用語:100> # 選択してShiftキーを押すと辞書画面に遷移します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * GLOSSARY_GAIN_ALL or 用語集全取得 [種別]
 *  データベースに登録している全ての用語を取得状態にします。
 *  種別を省略すると、自動で「1」になります。
 * 例：GLOSSARY_GAIN_ALL 2
 *
 * GLOSSARY_CALL or 用語集画面の呼び出し
 *  用語集画面を呼び出します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Scene_Glossary() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName    = 'SceneGlossary';
    var metaTagPrefix = 'SG';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names, index) {
        var footer = index > 0 ? String(index + 1) : '';
        if (!Array.isArray(names)) return getMetaValue(object, names + footer);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i] + footer);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return convertEscapeCharactersAndEval(arg, true).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramCommandNames = [];
    for (var i = 0; i < 4; i++) {
        var idString         = (i > 0 ? String(i + 1) : '');
        paramCommandNames[i] = getParamString(['CommandName' + idString, 'コマンド名称' + idString]);
    }
    var paramCommandNamesMax    = paramCommandNames.length;
    var paramBackPicture        = getParamString(['BackPicture', '背景ピクチャ']);
    var paramItemType           = getParamString(['ItemType', 'アイテムタイプ']).toUpperCase();
    var paramAutoAddition       = getParamBoolean(['AutoAddition', '自動登録']);
    var paramGlossaryListWidth  = getParamNumber(['GlossaryListWidth', '用語集リスト横幅'], 1);
    var paramFontSize           = getParamNumber(['FontSize', 'フォントサイズ'], 0);
    var paramAutoResizePicture  = getParamBoolean(['AutoResizePicture', '画像の自動縮小']);
    var paramHelpText           = getParamString(['HelpText', 'ヘルプテキスト']);
    var paramHelpTextCategory   = getParamString(['HelpText2', 'ヘルプテキスト2']);
    var paramPicturePosition    = getParamString(['PicturePosition', '画像の表示位置']).toLowerCase();
    var paramPictureAlign       = getParamString(['PictureAlign', '画像の揃え']).toLowerCase();
    var paramUseCategory        = getParamBoolean(['UseCategory', 'カテゴリ分類']);
    var paramUsableItem         = getParamBoolean(['UsableItem', 'アイテム使用']);
    var paramConfirmMessage     = getParamBoolean(['ConfirmMessage', '確認メッセージ']);
    var paramSwitchAutoAdd      = getParamNumber(['SwitchAutoAdd', '自動登録IDスイッチ']);
    var paramVariableAutoAdd    = getParamNumber(['VariableAutoAdd', '自動登録ID変数']);
    var paramConfirmUse         = getParamString(['ConfirmUse', '確認_使う']);
    var paramConfirmNoUse       = getParamString(['ConfirmNoUse', '確認_使わない']);
    var paramCompleteView       = getParamBoolean(['CompleteView', '収集率表示']);
    var paramCompleteMessage    = getParamString(['CompleteMessage', '収集率メッセージ']);
    var paramNewGlossaryColor   = getParamNumber(['NewGlossaryColor', '新着用語カラー']);
    var paramThroughBackPicture = getParamBoolean(['ThroughBackPicture', '背景ピクチャ透過']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandSceneGlossary(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandSceneGlossary = function(command, args) {
        switch (getCommandName(command)) {
            case 'GLOSSARY_CALL' :
            case '用語集画面の呼び出し' :
                $gameTemp.setGlossaryType(getArgNumber(args[0], 1));
                SceneManager.push(Scene_Glossary);
                break;
            case 'GLOSSARY_GAIN_ALL' :
            case '用語集全取得' :
                $gameParty.gainGlossaryAll();
                break;
        }
    };

    //=============================================================================
    // Game_Party
    //  用語集アイテムの管理を追加定義します。
    //=============================================================================
    Game_Party.prototype.isGlossaryItem = function(item) {
        var iTypeId = (paramItemType === 'B' ? 4 : 3);
        return item.itypeId === iTypeId && getMetaValues(item, ['説明', 'Description']) !== undefined;
    };

    Game_Party.prototype.isSameGlossaryType = function(item) {
        var type     = $gameTemp.getGlossaryType();
        var itemType = getArgNumber(getMetaValues(item, ['種別', 'Type']));
        return type > 1 ? itemType === type : !itemType || itemType === type;
    };

    Game_Party.prototype.getGlossaryCategory = function(item) {
        return getMetaValues(item, ['カテゴリ', 'Category']);
    };

    Game_Party.prototype.getAllGlossaryList = function() {
        return $dataItems.filter(function(item) {
            return item && this.isGlossaryItem(item);
        }.bind(this));
    };

    Game_Party.prototype.getHasGlossaryPercent = function(categoryName) {
        var hasCount = 0, allCount = 0;
        this.getAllGlossaryList().forEach(function(item) {
            if (this.isSameGlossaryType(item) && (!categoryName || this.getGlossaryCategory(item) === categoryName)) {
                if (this.hasItem(item)) hasCount++;
                allCount++;
            }
        }.bind(this));
        return Math.floor(hasCount / allCount * 100);
    };

    Game_Party.prototype.getAllGlossaryCategory = function() {
        var list = [];
        this.items().forEach(function(item) {
            var category = this.getGlossaryCategory(item);
            if (category && this.isSameGlossaryType(item) && !list.contains(category)) {
                list.push(category);
            }
        }.bind(this));
        return list;
    };

    Game_Party.prototype.gainGlossaryFromText = function(text) {
        this.getAllGlossaryList().forEach(function(item) {
            if (!this.hasItem(item) && this.isAutoGlossaryWord(item) && text.contains(item.name)) {
                if (paramSwitchAutoAdd > 0) $gameSwitches.setValue(paramSwitchAutoAdd, true);
                if (paramVariableAutoAdd > 0) $gameVariables.setValue(paramVariableAutoAdd, item.id);
                this.gainGlossary(item);
            }
        }.bind(this));
    };

    Game_Party.prototype.isAutoGlossaryWord = function(item) {
        return !getMetaValues(item, ['手動', 'Manual']);
    };

    Game_Party.prototype.gainGlossaryAll = function() {
        this.getAllGlossaryList().forEach(function(item) {
            if (!this.hasItem(item)) {
                this.gainGlossary(item);
            }
        }.bind(this));
    };

    Game_Party.prototype.gainGlossary = function(item) {
        this.gainItem(item, 1, false);
    };

    Game_Party.prototype.setConfirmedGlossaryItem = function(item) {
        if (!this._confirmedGlossaryItems) this._confirmedGlossaryItems = [];
        if (!this._confirmedGlossaryItems.contains(item.id)) {
            this._confirmedGlossaryItems.push(item.id);
            return true;
        }
        return false;
    };

    Game_Party.prototype.isConfirmedGlossaryItem = function(item) {
        return this._confirmedGlossaryItems ? this._confirmedGlossaryItems.contains(item.id) : false;
    };

    //=============================================================================
    // Game_Temp
    //  用語集画面の種別を追加定義します。
    //=============================================================================
    var _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._glossaryType = 0;
    };

    Game_Temp.prototype.setGlossaryType = function(type) {
        this._glossaryType = type;
    };

    Game_Temp.prototype.getGlossaryType = function() {
        return this._glossaryType;
    };

    //=============================================================================
    // Scene_Menu
    //  用語集画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        for (var i = 0; i < paramCommandNamesMax; i++) {
            if (paramCommandNames[i]) {
                this._commandWindow.setHandler('glossary' + String(i), this.commandGlossary.bind(this, i + 1));
            }
        }
    };

    Scene_Menu.prototype.commandGlossary = function(type) {
        $gameTemp.setGlossaryType(type);
        SceneManager.push(Scene_Glossary);
    };

    //=============================================================================
    // Window_MenuCommand
    //  用語集画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_MenuCommand_addOriginalCommands      = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        for (var i = 0; i < paramCommandNamesMax; i++) {
            if (paramCommandNames[i]) {
                this.addCommand(paramCommandNames[i], 'glossary' + String(i), this.isGlossaryEnabled(i));
            }
        }
    };

    Window_MenuCommand.prototype.isGlossaryEnabled = function() {
        return true;
    };

    //=============================================================================
    // Window_EventItem
    //  用語集アイテムをアイテム選択の候補から除外します。
    //=============================================================================
    var _Window_EventItem_includes      = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        return _Window_EventItem_includes.apply(this, arguments) && !$gameParty.isGlossaryItem(item);
    };

    //=============================================================================
    // Window_BattleItem
    //  用語集アイテムをアイテム選択の候補から除外します。
    //=============================================================================
    var _Window_BattleItem_includes      = Window_BattleItem.prototype.includes;
    Window_BattleItem.prototype.includes = function(item) {
        return _Window_BattleItem_includes.apply(this, arguments) && !$gameParty.isGlossaryItem(item);
    };

    //=============================================================================
    // Window_Message
    //  メッセージに登場した単語を用語集に加えます。
    //=============================================================================
    var _Window_Message_startMessage      = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        if (paramAutoAddition) $gameParty.gainGlossaryFromText(this._textState.text);
    };

    //=============================================================================
    // Window_ScrollText
    //  メッセージに登場した単語を用語集に加えます。
    //=============================================================================
    var _Window_ScrollText_startMessage      = Window_ScrollText.prototype.startMessage;
    Window_ScrollText.prototype.startMessage = function() {
        _Window_ScrollText_startMessage.apply(this, arguments);
        if (paramAutoAddition) $gameParty.gainGlossaryFromText(this.convertEscapeCharacters(this._text));
    };

    //=============================================================================
    // Scene_Glossary
    //  用語集画面を扱うクラスです。
    //=============================================================================
    Scene_Glossary.prototype             = Object.create(Scene_ItemBase.prototype);
    Scene_Glossary.prototype.constructor = Scene_Glossary;

    Scene_Glossary.prototype.create = function() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGlossaryWindow();
        this.createGlossaryListWindow();
        this.createGlossaryCategoryWindow();
        this.createGlossaryCompleteWindow();
        this.createConfirmWindow();
        this.createActorWindow();
        this.setInitActivateWindow();
    };

    Scene_Glossary.prototype.createGlossaryWindow = function() {
        this._glossaryWindow = new Window_Glossary(paramGlossaryListWidth, this._helpWindow.height);
        this.addWindow(this._glossaryWindow);
    };

    Scene_Glossary.prototype.createGlossaryListWindow = function() {
        this._glossaryListWindow = new Window_GlossaryList(this._glossaryWindow);
        this._glossaryListWindow.setHandler('cancel', this.onCancelGlossaryList.bind(this));
        if (paramUsableItem) {
            this._glossaryListWindow.setHandler('ok', this.onOkGlossaryList.bind(this));
        }
        this._itemWindow = this._glossaryListWindow;
        this.addWindow(this._glossaryListWindow);
    };

    Scene_Glossary.prototype.createGlossaryCategoryWindow = function() {
        this._glossaryCategoryWindow = new Window_GlossaryCategory(this._glossaryListWindow);
        this._glossaryCategoryWindow.setHandler('cancel', this.escapeScene.bind(this));
        this._glossaryCategoryWindow.setHandler('ok', this.onOkGlossaryCategory.bind(this));
        this.addWindow(this._glossaryCategoryWindow);
    };

    Scene_Glossary.prototype.createConfirmWindow = function() {
        this._confirmWindow = new Window_GlossaryConfirm(this._glossaryListWindow);
        this._confirmWindow.setHandler('cancel', this.activateListWindow.bind(this));
        this._confirmWindow.setHandler('use', this.onItemOk.bind(this));
        this._confirmWindow.setHandler('noUse', this.activateListWindow.bind(this));
        this.addWindow(this._confirmWindow);
    };

    Scene_Glossary.prototype.createGlossaryCompleteWindow = function() {
        this._glossaryCompleteWindow = new Window_GlossaryComplete(this._glossaryListWindow);
        if (!paramCompleteView) this._glossaryCompleteWindow.hide();
        this.addWindow(this._glossaryCompleteWindow);
    };

    Scene_Glossary.prototype.createBackground = function() {
        if (paramBackPicture) {
            if (paramThroughBackPicture) {
                Scene_ItemBase.prototype.createBackground.apply(this, arguments);
            }
            var sprite    = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(paramBackPicture, 0);
            sprite.bitmap.addLoadListener(function() {
                sprite.scale.x = Graphics.boxWidth / sprite.width;
                sprite.scale.y = Graphics.boxHeight / sprite.height;
            }.bind(this));
            this._backgroundSprite = sprite;
            this.addChild(this._backgroundSprite);
        } else {
            Scene_ItemBase.prototype.createBackground.apply(this, arguments);
        }
    };

    Scene_Glossary.prototype.updateHelp = function(helpText) {
        if (paramHelpText) {
            this._helpWindow.setText(helpText);
        } else {
            this._helpWindow.visible = false;
            this._helpWindow.height  = 0;
        }
    };

    Scene_Glossary.prototype.setInitActivateWindow = function() {
        if (paramUseCategory) {
            this.activateCategoryWindow(true);
        } else {
            this.activateListWindow(true);
        }
    };

    Scene_Glossary.prototype.onOkGlossaryCategory = function() {
        this.activateListWindow(true);
    };

    Scene_Glossary.prototype.onOkGlossaryList = function() {
        if (paramConfirmMessage) {
            this.activateConfirmWindow();
        } else {
            this.onItemOk();
        }
    };

    Scene_Glossary.prototype.onItemOk = function() {
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        $gameParty.setLastItem(this.item());
        this.determineItem();
    };

    Scene_Glossary.prototype.playSeForItem = function() {
        SoundManager.playUseItem();
    };

    Scene_Glossary.prototype.isCursorLeft = function() {
        return true;
    };

    Scene_Glossary.prototype.user = Scene_Item.prototype.user;

    Scene_Glossary.prototype.onCancelGlossaryList = function() {
        if (paramUseCategory) {
            this.activateCategoryWindow();
        } else {
            this.escapeScene();
        }
    };

    Scene_Glossary.prototype.activateCategoryWindow = function(indexInit) {
        this._glossaryCategoryWindow.activate();
        this._glossaryCategoryWindow.show();
        if (indexInit) this._glossaryCategoryWindow.select(0);
        this._glossaryListWindow.deactivate();
        this._glossaryListWindow.hide();
        this._glossaryListWindow.deselect();
        this._glossaryCompleteWindow.clear();
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.updateHelp(paramHelpTextCategory);
    };

    Scene_Glossary.prototype.activateListWindow = function(indexInit) {
        this._glossaryListWindow.activate();
        this._glossaryListWindow.show();
        if (indexInit) this._glossaryListWindow.select(0);
        this._glossaryCategoryWindow.deactivate();
        this._glossaryCategoryWindow.hide();
        this._glossaryCompleteWindow.refresh();
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.updateHelp(paramHelpText);
    };

    Scene_Glossary.prototype.activateConfirmWindow = function() {
        this._glossaryListWindow.deactivate();
        this._confirmWindow.updatePlacement();
        this._confirmWindow.select(0);
        this._confirmWindow.show();
        this._confirmWindow.activate();
    };

    Scene_Glossary.prototype.escapeScene = function() {
        this.popScene();
    };

    //=============================================================================
    // Window_GlossaryCategory
    //  用語集カテゴリウィンドウです。
    //=============================================================================
    function Window_GlossaryCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_GlossaryCategory.prototype             = Object.create(Window_Selectable.prototype);
    Window_GlossaryCategory.prototype.constructor = Window_GlossaryCategory;

    Window_GlossaryCategory.prototype.initialize = function(glWindow) {
        this._glossaryListWindow = glWindow;
        Window_Selectable.prototype.initialize.call(this, glWindow.x, glWindow.y, glWindow.width, glWindow.height);
        this._data = null;
        this.refresh();
    };

    Window_GlossaryCategory.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    Window_GlossaryCategory.prototype.item = function() {
        var index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    };

    Window_GlossaryCategory.prototype.isCurrentItemEnabled = function() {
        return !!this.item();
    };

    Window_GlossaryCategory.prototype.makeItemList = function() {
        this._data = $gameParty.getAllGlossaryCategory();
    };

    Window_GlossaryCategory.prototype.select = function(index) {
        Window_Selectable.prototype.select.apply(this, arguments);
        this._glossaryListWindow.setCategory(this.item());
    };

    Window_GlossaryCategory.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_GlossaryCategory.prototype.drawItem = function(index) {
        var text = this._data[index];
        if (text) {
            var rect = this.itemRect(index);
            this.drawTextEx(text, rect.x + this.textPadding(), rect.y);
        }
    };

    //=============================================================================
    // Window_GlossaryList
    //  用語集リストウィンドウです。
    //=============================================================================
    function Window_GlossaryList() {
        this.initialize.apply(this, arguments);
    }

    Window_GlossaryList.prototype             = Object.create(Window_ItemList.prototype);
    Window_GlossaryList.prototype.constructor = Window_GlossaryList;

    Window_GlossaryList.prototype.initialize = function(gWindow) {
        this._glossaryWindow = gWindow;
        var height           = gWindow.height - (paramCompleteView ? this.lineHeight() + this.standardPadding() * 2 : 0);
        Window_ItemList.prototype.initialize.call(this, 0, gWindow.y, paramGlossaryListWidth, height);
        this.refresh();
    };

    Window_GlossaryList.prototype.maxCols = function() {
        return 1;
    };

    Window_GlossaryList.prototype.needsNumber = function() {
        return false;
    };

    Window_GlossaryList.prototype.numberWidth = function() {
        return 0;
    };

    Window_GlossaryList.prototype.drawItemName = function(item, x, y, width) {
        if (item) {
            var iconBoxWidth = item.iconIndex > 0 ? Window_Base._iconWidth + 4 : 0;
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.setGlossaryColor(item);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
            this.changePaintOpacity(1);
            this.resetTextColor();
        }
    };

    Window_GlossaryList.prototype.setGlossaryColor = function(item) {
        this.changePaintOpacity(this.isEnabled(item));
        var colorIndex = $gameParty.isConfirmedGlossaryItem(item) ? 0 : paramNewGlossaryColor;
        this.changeTextColor(this.textColor(colorIndex));
    };

    Window_GlossaryList.prototype.isEnabled = function(item) {
        return paramUsableItem ? Window_ItemList.prototype.isEnabled.call(this, item) : true;
    };

    Window_GlossaryList.prototype.includes = function(item) {
        return DataManager.isItem(item) && $gameParty.isGlossaryItem(item) &&
            this.isCategoryMatch(item) && $gameParty.isSameGlossaryType(item);
    };

    Window_GlossaryList.prototype.isCategoryMatch = function(item) {
        return !paramUseCategory || this._category === $gameParty.getGlossaryCategory(item);
    };

    Window_GlossaryList.prototype.select = function(index) {
        var prevItem = this.item();
        if (prevItem) {
            var result = $gameParty.setConfirmedGlossaryItem(prevItem);
            if (result) this.refresh();
        }
        Window_ItemList.prototype.select.apply(this, arguments);
        this._glossaryWindow.refresh(this.item());
    };

    Window_GlossaryList.prototype.cursorRight = function(wrap) {
        this._glossaryWindow.cursorRight(wrap);
    };

    Window_GlossaryList.prototype.cursorLeft = function(wrap) {
        this._glossaryWindow.cursorLeft(wrap);
    };

    Window_GlossaryList.prototype.getCategory = function() {
        return this._category !== 'none' ? this._category : null;
    };

    //=============================================================================
    // Window_GlossaryConfirm
    //  用語集確認ウィンドウです。
    //=============================================================================
    function Window_GlossaryConfirm() {
        this.initialize.apply(this, arguments);
    }

    Window_GlossaryConfirm.prototype             = Object.create(Window_Command.prototype);
    Window_GlossaryConfirm.prototype.constructor = Window_GlossaryConfirm;

    Window_GlossaryConfirm.prototype.initialize = function(listWindow) {
        this._listWindow = listWindow;
        Window_Command.prototype.initialize.call(this, 0, 0);
    };

    Window_GlossaryConfirm.prototype.windowWidth = function() {
        return 120;
    };

    Window_GlossaryConfirm.prototype.updatePlacement = function() {
        this.x = this._listWindow.x + 64;
        this.y = this._listWindow.y + this._listWindow.index() * this._listWindow.itemHeight() + 32;
    };

    Window_GlossaryConfirm.prototype.makeCommandList = function() {
        this.addCommand(paramConfirmUse, 'use');
        this.addCommand(paramConfirmNoUse, 'noUse');
    };

    //=============================================================================
    // Window_Glossary
    //  用語集ウィンドウです。
    //=============================================================================
    function Window_GlossaryComplete() {
        this.initialize.apply(this, arguments);
    }

    Window_GlossaryComplete.prototype             = Object.create(Window_Base.prototype);
    Window_GlossaryComplete.prototype.constructor = Window_GlossaryComplete;

    Window_GlossaryComplete.prototype.initialize = function(listWindow) {
        var x            = listWindow.x;
        var y            = listWindow.y + listWindow.height;
        var width        = listWindow.width;
        var height       = Graphics.boxHeight - y;
        this._listWindow = listWindow;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_GlossaryComplete.prototype.clear = function() {
        this.contents.clear();
    };

    Window_GlossaryComplete.prototype.refresh = function() {
        this.clear();
        var percent = $gameParty.getHasGlossaryPercent(this._listWindow.getCategory());
        this.drawTextEx(paramCompleteMessage.format(percent.padZero(3)), 0, 0);
    };

    //=============================================================================
    // Window_Glossary
    //  用語集ウィンドウです。
    //=============================================================================
    function Window_Glossary() {
        this.initialize.apply(this, arguments);
    }

    Window_Glossary.prototype             = Object.create(Window_Base.prototype);
    Window_Glossary.prototype.constructor = Window_Glossary;

    Window_Glossary.prototype.initialize = function(x, y) {
        var height      = Graphics.boxHeight - y;
        var width       = Graphics.boxWidth - x;
        this._maxPages  = 1;
        this._itemData  = null;
        this._pageIndex = 0;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    Window_Glossary.prototype.standardFontSize = function() {
        return paramFontSize ? paramFontSize : Window_Base.prototype.standardFontFace();
    };

    Window_Glossary.prototype.calcMaxPages = function(depth) {
        if (!depth) depth = 0;
        var item  = this._itemData;
        var exist = !!getMetaValues(item, ['ピクチャ', 'Picture'], depth) || !!getMetaValues(item, ['説明', 'Description'], depth);
        return (exist && depth < 100) ? this.calcMaxPages(depth + 1) : depth;
    };

    Window_Glossary.prototype.refresh = function(item) {
        this._itemData = item;
        this._maxPages = item ? this.calcMaxPages() : 1;
        this.drawItem(0, true);
    };

    Window_Glossary.prototype.cursorRight = function(wrap) {
        if (this._maxPages === 1) return;
        if (this.canMoveRight()) {
            this.drawItem(this._pageIndex + 1);
        } else if (wrap) {
            this.drawItem(0);
        }
    };

    Window_Glossary.prototype.cursorLeft = function(wrap) {
        if (this._maxPages === 1) return;
        if (this.canMoveLeft()) {
            this.drawItem(this._pageIndex - 1);
        } else if (wrap) {
            this.drawItem(this._maxPages - 1);
        }
    };

    Window_Glossary.prototype.canMoveLeft = function() {
        return this._pageIndex > 0;
    };

    Window_Glossary.prototype.canMoveRight = function() {
        return this._pageIndex < this._maxPages - 1;
    };

    Window_Glossary.prototype.drawItem = function(index, noSound) {
        this.contents.clear();
        this._pageIndex = index;
        this.updateArrows();
        if (!this._itemData) return;
        var pictureName = getMetaValues(this._itemData, ['ピクチャ', 'Picture'], index);
        if (pictureName) {
            var bitmap = ImageManager.loadPicture(getArgString(pictureName), 0);
            bitmap.addLoadListener(this.drawItemSub.bind(this, bitmap));
        } else {
            this.drawItemSub(null);
        }
        if (!noSound) SoundManager.playCursor();
    };

    Window_Glossary.prototype.updateArrows = function() {
        this.downArrowVisible = this.canMoveLeft();
        this.upArrowVisible   = this.canMoveRight();
    };

    Window_Glossary.prototype.drawItemSub = function(bitmap) {
        var item = this._itemData;
        var text = getMetaValues(item, ['説明', 'Description'], this._pageIndex);
        switch (this.getPicturePosition(item)) {
            case 'under':
                this.drawPicture(item, bitmap, text, 0);
                this.drawItemText(text, 0);
                break;
            case 'top':
                this.drawPicture(item, bitmap, text, 0);
                this.drawItemText(text, this.calcItemPictureHeight(item, bitmap, text));
                break;
            case 'bottom':
                this.drawItemText(text, 0);
                this.drawPicture(item, bitmap, text, this.contentsHeight() - this.calcItemPictureHeight(item, bitmap, text));
                break;
            default :
                this.drawItemText(text, 0);
                this.drawPicture(item, bitmap, text, this.calcItemTextHeight(text));
                break;
        }
    };

    Window_Glossary.prototype.getPicturePosition = function(item) {
        var position = getMetaValues(item, ['ピクチャ位置', 'PicturePosition'], this._pageIndex);
        return position ? position.toLowerCase() : paramPicturePosition;
    };

    Window_Glossary.prototype.getPictureAlign = function(item) {
        var align = getMetaValues(item, ['ピクチャ揃え', 'PictureAlign'], this._pageIndex);
        return align ? align.toLowerCase() : paramPictureAlign;
    };

    Window_Glossary.prototype.calcItemTextHeight = function(text) {
        var textState = {index: 0, x: 0, y: 0, left: 0, text: text};
        return this.calcTextHeight(textState, true) + 4;
    };

    Window_Glossary.prototype.calcItemPictureHeight = function(item, bitmap, text) {
        return bitmap ? bitmap.height * this.getPictureScale(item, bitmap, text) + 4 : 0;
    };

    Window_Glossary.prototype.drawItemText = function(text, y) {
        this.drawTextEx(text, 0, y);
    };

    Window_Glossary.prototype.drawPicture = function(item, bitmap, text, y) {
        if (!bitmap) return;
        var scale = this.getPictureScale(item, bitmap, text);
        var dw    = bitmap.width * scale;
        var dy    = bitmap.height * scale;
        var x     = 0;
        switch (this.getPictureAlign(item)) {
            case 'left':
                x = 0;
                break;
            case 'center':
                x = this.contentsWidth() / 2 - dw / 2;
                break;
            case 'right':
                x = this.contentsWidth() - dw;
                break;
        }
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, dw, dy);
    };

    Window_Glossary.prototype.getPictureScale = function(item, bitmap, text) {
        var scale     = 1;
        var metaValue = getMetaValues(item, ['ピクチャ拡大率', 'PictureScale'], this._pageIndex);
        if (metaValue) {
            scale = getArgNumber(metaValue);
        } else if (paramAutoResizePicture) {
            var mw = this.contentsWidth();
            var mh = this.contentsHeight() - this.calcItemTextHeight(text);
            scale  = Math.min(mw / bitmap.width, mh / bitmap.height, 1);
        }
        return scale;
    };

    Window_Glossary.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.processTouch();
    };

    Window_Glossary.prototype.processTouch = function() {
        if (!TouchInput.isTriggered()) return;
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        if (y >= 0 && y <= this.height) {
            if (x >= 0 && x < this.width / 2)          this.cursorLeft(false);
            if (x >= this.width / 2 && x < this.width) this.cursorRight(false);
        }
    };

    Window_Glossary.prototype._refreshArrows = function() {
        Window.prototype._refreshArrows.call(this);
        var w = this._width;
        var h = this._height;
        var p = 24;
        var q = p / 2;

        this._downArrowSprite.rotation = 90 * Math.PI / 180;
        this._downArrowSprite.move(q, h / 2);
        this._upArrowSprite.rotation = 90 * Math.PI / 180;
        this._upArrowSprite.move(w - q, h / 2);
    };
})();

