//=============================================================================
// SceneGlossary.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.18.0 2017/09/01 カテゴリごとにアイテム使用可否を設定できる機能を追加
// 1.17.0 2017/08/21 用語に制御文字が使われた場合は自動変換する機能を追加
// 1.16.1 2017/08/04 セーブとロードを繰り返しすと用語辞典の初期位置が最後に選択していたものになってしまう問題を修正
//                   コマンド「GLOSSARY_GAIN_ALL」で隠しアイテム以外も辞書に追加されるよう仕様変更
// 1.16.0 2017/08/03 カテゴリの並び順を自由に指定できる機能を追加
// 1.15.1 2017/07/22 1.15.0でパラメータのブール変数項目が全て効かなくなっていた問題を修正
// 1.15.0 2017/07/13 最後に選択していた項目を記憶した状態で辞書画面に戻る機能を追加
//                   パラメータの型指定機能に対応
// 1.14.1 2017/06/22 カテゴリ表示が有効な場合に、対象用語を一つも所持していない場合はカテゴリリストに表示しないよう修正
// 1.14.0 2017/06/08 所持数表示機能を追加
// 1.13.0 2017/04/19 自動翻訳プラグインに一部対応
// 1.12.0 2017/04/09 用語集リストの表示順を個別に設定する機能を追加
// 1.11.3 2017/03/31 用語リストをスクロールしたときに確認ウィンドウの位置がおかしくなる問題を修正
// 1.11.2 2017/03/08 カテゴリウィンドウで制御文字を使っていない場合は、ウィンドウ幅に応じて文字を縮めるように修正
// 1.11.1 2017/02/09 ピクチャが空の状態でもページ表示できるよう修正
// 1.11.0 2017/02/09 「武器」と「防具」を専用のカテゴリで表示しようとすると表示できない問題を修正
//                   変数などで動的に表示内容を変化させる場合に、表示内容が空の場合はページを表示しないよう修正
// 1.10.0 2017/01/10 辞書画面ごとに別々の背景を指定できる機能を追加
// 1.9.0 2017/01/03 メニュー画面の辞書コマンドに出現条件を指定できる機能を追加
// 1.8.0 2016/12/23 説明文の自動改行機能を追加
// 1.7.1 2016/12/09 1.7.0で収集率が正しく表示されない問題を修正
// 1.7.0 2016/12/09 隠しアイテムでない「アイテム」「武器」「防具」も辞書画面に登録できる機能を追加
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
 * @default false
 * @type boolean
 *
 * @param CommandName
 * @desc メニュー画面に表示されるコマンド名です。空欄にすると追加されなくなります。
 * @default Glossary
 *
 * @param CommandSwitchId
 * @desc 辞書コマンドの出現条件スイッチ番号です。空欄にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param BackPicture
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CommandName2
 * @desc メニュー画面に表示される2つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param CommandSwitchId2
 * @desc 辞書コマンドの出現条件スイッチ番号です。空欄にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param BackPicture2
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CommandName3
 * @desc メニュー画面に表示される3つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param CommandSwitchId3
 * @desc 辞書コマンドの出現条件スイッチ番号です。空欄にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param BackPicture3
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param CommandName4
 * @desc メニュー画面に表示される4つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param CommandSwitchId4
 * @desc 辞書コマンドの出現条件スイッチ番号です。空欄にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param BackPicture4
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param AutoAddition
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default false
 * @type boolean
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
 * @default false
 * @type boolean
 *
 * @param AutoResizePicture
 * @desc ウィンドウ内にピクチャを表示する際、表示可能なように自動で縮小されます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param PicturePosition
 * @desc 画像の表示位置です。(top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾)
 * @default top
 * @type select
 * @option top
 * @option bottom
 * @option text
 *
 * @param PictureAlign
 * @desc 画像の揃えです。(left:左揃え center:中央揃え right:右揃え)
 * @default center
 * @type select
 * @option left
 * @option center
 * @option right
 *
 * @param ThroughBackPicture
 * @desc 背景ピクチャの背後に通常の背景（マップ画面）を表示します。
 * @default false
 * @type boolean
 *
 * @param ConfirmMessage
 * @desc 用語アイテムを使用する際に確認メッセージが表示されるようになります。
 * @default false
 * @type boolean
 *
 * @param SwitchAutoAdd
 * @desc 用語アイテムの自動登録が行われた際に指定した番号のスイッチがONになります。何らかの通知を行いたい場合に指定します。
 * @default 0
 * @type switch
 *
 * @param VariableAutoAdd
 * @desc 用語アイテムの自動登録が行われた際に指定した番号の変数にアイテムIDが設定されます。
 * @default 0
 * @type variable
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
 * @default false
 * @type boolean
 *
 * @param CompleteMessage
 * @desc 収集率を表示する文言です。「%1」が収集率に変換されます。
 * @default Complete \c[2]%1\c[0] \%
 *
 * @param NewGlossaryColor
 * @desc 新着用語を明示するためのカラーです。システムカラーから選択してください。
 * @default 2
 * @type number
 *
 * @param UseItemHistory
 * @desc ONにすると一度入手した用語アイテムを失っても辞書には表示されたままになります。
 * @default false
 * @type boolean
 *
 * @param PageWrap
 * @desc 複数のページが存在する場合、最後のページまで到達していたら最初のページに戻します。
 * @default true
 * @type boolean
 *
 * @param ShowingItemNumber
 * @desc 用語集アイテムの所持数を表示します。
 * @default false
 * @type boolean
 *
 * @param CategoryOrder
 * @desc カテゴリ並び順を任意に変更したい場合はカテゴリ名を指定してください。
 * @default
 * @type string[]
 *
 * @param CategoryUnusable
 * @desc ここで指定したカテゴリは「アイテム使用」が有効でも使用できなくなります。
 * @default
 * @type string[]
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
 * ・追加機能1
 * 隠しアイテムでない「アイテム」「武器」「防具」も辞書画面に
 * 表示できるようになりました。隠しアイテムと同じ内容をメモ欄に記入してください。
 * アイテム図鑑、武器図鑑、防具図鑑も作成できます。
 * この機能を利用する場合はパラメータ「UseItemHistory」を有効にしてください。
 *
 * ・追加機能2
 * 用語リストはデフォルトではアイテムID順に表示されますが、
 * 以下のタグで表示順を個別に設定することができます。
 * 同一の表示順が重複した場合はIDの小さい方が先に表示されます。
 * <SG表示順:5> // ID[5]と同じ並び順で表示されます。
 * <SGOrder:5>  // 同上
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * GLOSSARY_GAIN_ALL or 用語集全取得
 *  データベースに登録している全ての用語を取得状態にします。
 *  対象は「隠しアイテム」扱いの用語のみですが、パラメータ「入手履歴を使用」が
 *  有効な場合は全てのアイテムを解禁します。（アイテム自体は取得しません）
 *
 * GLOSSARY_CALL or 用語集画面の呼び出し [種別]
 *  用語集画面を呼び出します。
 *  種別を省略すると、自動で「1」になります。
 * 例：GLOSSARY_CALL 2
 *
 * GLOSSARY_BACK or 用語集画面に戻る
 *  最後に選択していた項目を再選択した状態で用語集画面を呼び出します。
 * 例：GLOSSARY_BACK
 *
 * This plugin is released under the MIT License.
 */

/*:ja
 * @plugindesc ゲーム内用語辞典プラグイン
 * @author トリアコンタン
 *
 * @param カテゴリ分類
 * @desc 用語をカテゴリごとに分けて表示します。
 * @default false
 * @type boolean
 * 
 * @param コマンド名称
 * @desc メニュー画面に表示されるコマンド名です。空欄にすると追加されなくなります。
 * @default 用語辞典
 *
 * @param 出現条件スイッチ
 * @desc 辞書コマンドの出現条件スイッチ番号です。0にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param コマンド名称2
 * @desc メニュー画面に表示される2つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param 出現条件スイッチ2
 * @desc 辞書コマンド2の出現条件スイッチ番号です。0にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param 背景ピクチャ2
 * @desc 2つ目のコマンド背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param コマンド名称3
 * @desc メニュー画面に表示される3つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param 出現条件スイッチ3
 * @desc 辞書コマンド3の出現条件スイッチ番号です。0にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param 背景ピクチャ3
 * @desc 3つ目のコマンド背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param コマンド名称4
 * @desc メニュー画面に表示される4つ目のコマンド名です。空欄にすると追加されなくなります。
 * @default
 *
 * @param 出現条件スイッチ4
 * @desc 辞書コマンド4の出現条件スイッチ番号です。0にすると無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param 背景ピクチャ4
 * @desc 3つ目のコマンド背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @param 自動登録
 * @desc 文章の表示の命令中に同一単語が出現した場合に自動登録します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param フォントサイズ
 * @desc 用語集のフォントサイズです。
 * @default 22
 * @type number
 *
 * @param 用語集リスト横幅
 * @desc 用語集リストのウィンドウ横幅です。
 * @default 240
 * @type number
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
 * @default false
 * @type boolean
 *
 * @param 画像の自動縮小
 * @desc ウィンドウ内にピクチャを表示する際、表示可能なように自動で縮小されます。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param 画像の表示位置
 * @desc 画像の表示位置です。(top:ウィンドウの先頭 bottom:ウィンドウの下部 text:テキストの末尾)
 * @default top
 * @type select
 * @option top
 * @option bottom
 * @option text
 *
 * @param 画像の揃え
 * @desc 画像の揃えです。(left:左揃え center:中央揃え right:右揃え)
 * @default center
 * @type select
 * @option left
 * @option center
 * @option right
 *
 * @param 背景ピクチャ透過
 * @desc 背景ピクチャの背後に通常の背景（マップ画面）を表示します。
 * @default false
 * @type boolean
 *
 * @param 確認メッセージ
 * @desc 用語アイテムを使用する際に確認メッセージが表示されるようになります。
 * @default false
 * @type boolean
 *
 * @param 自動登録IDスイッチ
 * @desc 用語アイテムの自動登録が行われた際に指定した番号のスイッチがONになります。何らかの通知を行いたい場合に指定します。
 * @default 0
 * @type switch
 *
 * @param 自動登録ID変数
 * @desc 用語アイテムの自動登録が行われた際に指定した番号の変数にアイテムIDが設定されます。
 * @default 0
 * @type variable
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
 * @default false
 * @type boolean
 *
 * @param 収集率メッセージ
 * @desc 収集率を表示する文言です。「%1」が収集率に変換されます。
 * @default 収集率 \c[2]%1\c[0] ％
 *
 * @param 新着用語カラー
 * @desc 新着用語を明示するためのカラーです。システムカラーから選択してください。
 * @default 2
 * @type number
 *
 * @param 入手履歴を使用
 * @desc ONにすると一度入手した用語アイテムを失っても辞書には表示されたままになります。
 * @default false
 * @type boolean
 *
 * @param ページ折り返し
 * @desc 複数のページが存在する場合、最後のページまで到達していたら最初のページに戻します。
 * @default true
 * @type boolean
 *
 * @param 所持数表示
 * @desc 用語集アイテムの所持数を表示します。
 * @default false
 * @type boolean
 *
 * @param カテゴリ並び順
 * @desc カテゴリ並び順を任意に変更したい場合はカテゴリ名を指定してください。
 * @default
 * @type string[]
 *
 * @param 使用禁止カテゴリ
 * @desc ここで指定したカテゴリは「アイテム使用」が有効でも使用できなくなります。
 * @default
 * @type string[]
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
 * ・追加機能1
 * 隠しアイテムでない「アイテム」「武器」「防具」も辞書画面に
 * 表示できるようになりました。隠しアイテムと同じ内容をメモ欄に記入してください。
 * アイテム図鑑、武器図鑑、防具図鑑も作成できます。
 * この機能を利用する場合はパラメータ「入手履歴を使用」を有効にしてください。
 *
 * ・追加機能2
 * 用語リストはデフォルトではアイテムID順に表示されますが、
 * 以下のタグで表示順を個別に設定することができます。
 * 同一の表示順が重複した場合はIDの小さい方が先に表示されます。
 * <SG表示順:5> // ID[5]と同じ並び順で表示されます。
 * <SGOrder:5>  // 同上
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * GLOSSARY_GAIN_ALL or 用語集全取得
 *  データベースに登録している全ての用語を取得状態にします。
 *  対象は「隠しアイテム」扱いの用語のみですが、パラメータ「入手履歴を使用」が
 *  有効な場合は全てのアイテムを解禁します。（アイテム自体は取得しません）
 *
 * GLOSSARY_CALL or 用語集画面の呼び出し [種別]
 *  用語集画面を呼び出します。
 *  種別を省略すると、自動で「1」になります。
 * 例：GLOSSARY_CALL 2
 *
 * GLOSSARY_BACK or 用語集画面に戻る
 *  最後に選択していた項目を再選択した状態で用語集画面を呼び出します。
 * 例：GLOSSARY_BACK
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
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamJson = function(paramNames, defaultValue) {
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
    var paramCommandNames     = [];
    var paramCommandSwitchIds = [];
    var paramBackPictures     = [];
    for (var i = 0; i < 4; i++) {
        var idString             = (i > 0 ? String(i + 1) : '');
        paramCommandNames[i]     = getParamString(['CommandName' + idString, 'コマンド名称' + idString]);
        paramCommandSwitchIds[i] = getParamNumber(['CommandSwitchId' + idString, '出現条件スイッチ' + idString]);
        paramBackPictures[i]     = getParamString(['BackPicture' + idString, '背景ピクチャ' + idString]);
    }
    var paramCommandNamesMax    = paramCommandNames.length;
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
    var paramUseItemHistory     = getParamBoolean(['UseItemHistory', '入手履歴を使用']);
    var paramPageWrap           = getParamBoolean(['PageWrap', 'ページ折り返し']);
    var paramShowingItemNumber  = getParamBoolean(['ShowingItemNumber', '所持数表示']);
    var paramCategoryOrder      = getParamJson(['CategoryOrder', 'カテゴリ並び順'], []);
    var paramCategoryUnusable   = getParamJson(['CategoryUnusable', '使用禁止カテゴリ'], []);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandSceneGlossary(command, args);
    };

    Game_Interpreter.prototype.pluginCommandSceneGlossary = function(command, args) {
        switch (getCommandName(command)) {
            case 'GLOSSARY_CALL' :
            case '用語集画面の呼び出し' :
                $gameParty.clearGlossaryIndex();
                $gameParty.setSelectedGlossaryType(getArgNumber(args[0], 1));
                SceneManager.push(Scene_Glossary);
                break;
            case 'GLOSSARY_GAIN_ALL' :
            case '用語集全取得' :
                $gameParty.gainGlossaryAll();
                break;
            case 'GLOSSARY_BACK' :
            case '用語集画面に戻る' :
                if (args[0]) {
                    $gameParty.setSelectedGlossaryType(getArgNumber(args[0], 1));
                }
                SceneManager.push(Scene_Glossary);
                break;
        }
    };

    //=============================================================================
    // DataManager
    //  種別コードを返します。
    //=============================================================================
    DataManager.getItemTypeCode = function(item) {
        if (this.isItem(item)) {
            return 0;
        } else if (this.isWeapon(item)) {
            return 1;
        } else if (this.isArmor(item)) {
            return 2;
        } else {
            return 3;
        }
    };

    //=============================================================================
    // Game_System
    //  ロード完了時に履歴情報フィールドを必要に応じて初期化します。
    //=============================================================================
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameParty.initAllItemHistory();
    };

    //=============================================================================
    // Game_Party
    //  用語集アイテムの管理を追加定義します。
    //=============================================================================
    var _Game_Party_initAllItems      = Game_Party.prototype.initAllItems;
    Game_Party.prototype.initAllItems = function() {
        _Game_Party_initAllItems.apply(this, arguments);
        this.initAllItemHistory();
    };

    Game_Party.prototype.initAllItemHistory = function() {
        this._itemHistory   = this._itemHistory || {};
        this._weaponHistory = this._weaponHistory || {};
        this._armorHistory  = this._armorHistory || {};
        this.getAllMaterials().forEach(function(item) {
            this.gainItemHistory(item);
        }, this);
    };

    Game_Party.prototype.getAllMaterials = function() {
        return this.items().concat(this.weapons()).concat(this.armors());
    };

    Game_Party.prototype.getAllMaterialsHistories = function() {
        return this.swapItemHash(this.getAllMaterials.bind(this));
    };

    Game_Party.prototype.isGlossaryItem = function(item) {
        return item && getMetaValues(item, ['説明', 'Description']) !== undefined;
    };

    Game_Party.prototype.isGlossaryHiddenItem = function(item) {
        return this.isGlossaryItem(item) && item.itypeId > 2;
    };

    Game_Party.prototype.isSameGlossaryType = function(item) {
        var type     = this.getSelectedGlossaryType();
        var itemType = getArgNumber(getMetaValues(item, ['種別', 'Type']));
        return type > 1 ? itemType === type : !itemType || itemType === type;
    };

    Game_Party.prototype.getGlossaryCategory = function(item) {
        return getMetaValues(item, ['カテゴリ', 'Category']);
    };

    Game_Party.prototype.hasGlossary = function(item) {
        return paramUseItemHistory ? this.hasItemHistory(item) : this.hasItem(item);
    };

    Game_Party.prototype.hasItemHistory = function(item) {
        return this.swapItemHash(this.hasItem.bind(this), [item]);
    };

    Game_Party.prototype.getAllGlossaryList = function() {
        return $dataItems.concat($dataWeapons).concat($dataArmors).filter(function(item) {
            return item && this.isGlossaryItem(item);
        }.bind(this));
    };

    Game_Party.prototype.getAllHiddenGlossaryList = function() {
        return $dataItems.filter(function(item) {
            return item && this.isGlossaryHiddenItem(item);
        }.bind(this));
    };

    Game_Party.prototype.getHasGlossaryPercent = function(categoryName) {
        var hasCount = 0, allCount = 0;
        this.getAllGlossaryList().forEach(function(item) {
            if (this.isSameGlossaryType(item) && (!categoryName || this.getGlossaryCategory(item) === categoryName)) {
                if (this.hasGlossary(item)) hasCount++;
                allCount++;
            }
        }.bind(this));
        return Math.floor(hasCount / allCount * 100);
    };

    Game_Party.prototype.getAllGlossaryCategory = function() {
        var list = [];
        this.getAllGlossaryList().forEach(function(item) {
            var category = this.getGlossaryCategory(item);
            if (category && this.isSameGlossaryType(item) && !list.contains(category) && this.hasGlossary(item)) {
                list.push(category);
            }
        }.bind(this));
        return list.sort(this._compareOrderGlossaryCategory.bind(this));
    };

    /**
     * @private
     */
    Game_Party.prototype._compareOrderGlossaryCategory = function(a, b) {
        var orderLength = paramCategoryOrder.length + 1;
        var orderA      = paramCategoryOrder.indexOf(a) + 1 || orderLength;
        var orderB      = paramCategoryOrder.indexOf(b) + 1 || orderLength;
        return orderA - orderB;
    };

    Game_Party.prototype.gainGlossaryFromText = function(text) {
        this.getAllHiddenGlossaryList().forEach(function(item) {
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
            if (this.hasItem(item)) {
                return;
            }
            if (this.isGlossaryHiddenItem(item)) {
                this.gainGlossary(item);
            } else {
                this.gainItemHistory(item);
            }
        }.bind(this));
    };

    Game_Party.prototype.gainGlossary = function(item) {
        this.gainItem(item, 1, false);
    };

    var _Game_Party_gainItem      = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.apply(this, arguments);
        if (amount > 0) this.gainItemHistory(item);
    };

    Game_Party.prototype.gainItemHistory = function(item) {
        var container = this.itemHistoryContainer(item);
        if (container) {
            container[item.id] = true;
        }
    };

    Game_Party.prototype.itemHistoryContainer = function(item) {
        return this.swapItemHash(this.itemContainer.bind(this), [item]);
    };

    Game_Party.prototype.swapItemHash = function(caller, args) {
        var prevItems   = this._items;
        var prevWeapons = this._weapons;
        var prevArmor   = this._armors;
        this._items     = this._itemHistory;
        this._weapons   = this._weaponHistory;
        this._armors    = this._armorHistory;
        var result      = caller.apply(this, args);
        this._items     = prevItems;
        this._weapons   = prevWeapons;
        this._armors    = prevArmor;
        return result;
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

    Game_Party.prototype.setGlossaryCategoryIndex = function(index) {
        this.initGlossaryIndex();
        this._glossaryCategoryIndex[this.getSelectedGlossaryType()] = index;
    };

    Game_Party.prototype.getGlossaryCategoryIndex = function() {
        this.initGlossaryIndex();
        return this._glossaryCategoryIndex[this.getSelectedGlossaryType()];
    };

    Game_Party.prototype.setGlossaryListIndex = function(index) {
        this.initGlossaryIndex();
        this._glossaryListIndex[this.getSelectedGlossaryType()] = index;
    };

    Game_Party.prototype.getGlossaryListIndex = function() {
        this.initGlossaryIndex();
        return this._glossaryListIndex[this.getSelectedGlossaryType()];
    };

    Game_Party.prototype.clearGlossaryIndex = function() {
        var type = this.getSelectedGlossaryType();
        this.initGlossaryIndex();
        this._glossaryListIndex[type]     = -1;
        this._glossaryCategoryIndex[type] = -1;
    };

    Game_Party.prototype.initGlossaryIndex = function() {
        if (!this._glossaryCategoryIndex) {
            this._glossaryCategoryIndex = {};
        }
        if (!this._glossaryListIndex) {
            this._glossaryListIndex = {};
        }
    };

    Game_Party.prototype.setSelectedGlossaryType = function(type) {
        this._selectedGlossaryType = type;
    };

    Game_Party.prototype.getSelectedGlossaryType = function() {
        return this._selectedGlossaryType || 0;
    };

    //=============================================================================
    // Scene_Menu
    //  用語集画面の呼び出しを追加します。
    //=============================================================================
    Scene_Menu.isVisibleGlossaryCommand = function(index) {
        return paramCommandNames[index] &&
            (!paramCommandSwitchIds[index] || $gameSwitches.value(paramCommandSwitchIds[index]));
    };

    var _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        for (var i = 0; i < paramCommandNamesMax; i++) {
            if (Scene_Menu.isVisibleGlossaryCommand(i)) {
                this._commandWindow.setHandler('glossary' + String(i), this.commandGlossary.bind(this, i + 1));
            }
        }
    };

    Scene_Menu.prototype.commandGlossary = function(type) {
        $gameParty.clearGlossaryIndex();
        $gameParty.setSelectedGlossaryType(type);
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
            if (Scene_Menu.isVisibleGlossaryCommand(i)) {
                if (typeof TranslationManager !== 'undefined') {
                    TranslationManager.translateIfNeed(paramCommandNames[i], function(translatedText) {
                        paramCommandNames[i] = translatedText;
                    });
                }
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
        return _Window_EventItem_includes.apply(this, arguments) && !$gameParty.isGlossaryHiddenItem(item);
    };

    //=============================================================================
    // Window_BattleItem
    //  用語集アイテムをアイテム選択の候補から除外します。
    //=============================================================================
    var _Window_BattleItem_includes      = Window_BattleItem.prototype.includes;
    Window_BattleItem.prototype.includes = function(item) {
        return _Window_BattleItem_includes.apply(this, arguments) && !$gameParty.isGlossaryHiddenItem(item);
    };

    //=============================================================================
    // Window_Message
    //  メッセージに登場した単語を用語集に加えます。
    //=============================================================================
    var _Window_Message_startMessage      = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        if (paramAutoAddition) $gameParty.gainGlossaryFromText(this.convertEscapeCharacters(this._textState.text));
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

    Scene_Glossary.prototype.createHelpWindow = function() {
        Scene_MenuBase.prototype.createHelpWindow.apply(this, arguments);
        this.updateHelp('');
    };

    Scene_Glossary.prototype.createGlossaryWindow = function() {
        this._glossaryWindow = new Window_Glossary(paramGlossaryListWidth, this._helpWindow.height);
        this.addWindow(this._glossaryWindow);
    };

    Scene_Glossary.prototype.createGlossaryListWindow = function() {
        this._glossaryListWindow = new Window_GlossaryList(this._glossaryWindow);
        this._glossaryListWindow.setHandler('cancel', this.onCancelGlossaryList.bind(this));
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
        this.addChild(this._confirmWindow);
    };

    Scene_Glossary.prototype.createGlossaryCompleteWindow = function() {
        this._glossaryCompleteWindow = new Window_GlossaryComplete(this._glossaryListWindow);
        if (!paramCompleteView) this._glossaryCompleteWindow.hide();
        this.addWindow(this._glossaryCompleteWindow);
    };

    Scene_Glossary.prototype.createBackground = function() {
        var pictureName = this.getBackPictureName();
        if (pictureName) {
            if (paramThroughBackPicture) {
                Scene_ItemBase.prototype.createBackground.apply(this, arguments);
            }
            var sprite    = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(pictureName, 0);
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

    Scene_Glossary.prototype.getBackPictureName = function() {
        var type = $gameParty.getSelectedGlossaryType();
        return paramBackPictures[type - 1] || paramBackPictures[0];
    };

    Scene_Glossary.prototype.updateHelp = function(helpText) {
        if (paramHelpText) {
            if (typeof TranslationManager !== 'undefined') {
                TranslationManager.getTranslatePromise(helpText).then(function(translatedText) {
                    this._helpWindow.setText(translatedText);
                }.bind(this));
            } else {
                this._helpWindow.setText(helpText);
            }
        } else {
            this._helpWindow.visible = false;
            this._helpWindow.height  = 0;
        }
    };

    Scene_Glossary.prototype.setInitActivateWindow = function() {
        var clearIndex = !($gameParty.getGlossaryListIndex() >= 0);
        if (paramUseCategory && clearIndex) {
            this.activateCategoryWindow(clearIndex);
        } else {
            this.activateListWindow(clearIndex);
            this._glossaryListWindow.selectLastIndex();
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
            this.activateCategoryWindow(false);
        } else {
            this.escapeScene();
        }
    };

    Scene_Glossary.prototype.activateCategoryWindow = function(indexInit) {
        this._glossaryCategoryWindow.activateAndShow();
        if (indexInit) {
            this._glossaryCategoryWindow.select(0);
        }
        this._glossaryListWindow.deactivateAndHide();
        this._glossaryListWindow.deselect();
        this._glossaryCompleteWindow.clear();
        this._confirmWindow.deactivateAndHide();
        this.updateHelp(paramHelpTextCategory);
    };

    Scene_Glossary.prototype.activateListWindow = function(indexInit) {
        this._glossaryListWindow.setItemHandler(this.onOkGlossaryList.bind(this));
        this._glossaryListWindow.activateAndShow();
        if (indexInit) {
            this._glossaryListWindow.select(0);
        }
        this._glossaryCategoryWindow.deactivateAndHide();
        this._glossaryCompleteWindow.refresh();
        this._confirmWindow.deactivateAndHide();
        this.updateHelp(paramHelpText);
    };

    Scene_Glossary.prototype.activateConfirmWindow = function() {
        this._glossaryListWindow.deactivate();
        this._confirmWindow.updatePlacement();
        this._confirmWindow.select(0);
        this._confirmWindow.activateAndShow();
    };

    Scene_Glossary.prototype.escapeScene = function() {
        this.popScene();
    };

    //=============================================================================
    // Window_Base
    //  必要なら制御文字変換を行ってテキストを表示します。
    //=============================================================================
    Window_Base.prototype.drawTextExIfNeed = function(text, x, y, maxWidth) {
        if (text.match(/\\/)) {
            this.drawTextEx(text, x, y);
        } else {
            this.drawText(text, x, y, maxWidth);
        }
    };

    //=============================================================================
    // Window_Selectable
    //  アクティブウィンドウを切り替えます。
    //=============================================================================
    Window_Selectable.prototype.activateAndShow = function() {
        this.activate();
        this.show();
    };

    Window_Selectable.prototype.deactivateAndHide = function() {
        this.deactivate();
        this.hide();
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
        this.selectLastIndex();
    };

    Window_GlossaryCategory.prototype.selectLastIndex = function() {
        var lastIndex = $gameParty.getGlossaryCategoryIndex();
        if (lastIndex >= 0) {
            this.select(Math.min(lastIndex, this.maxItems() - 1));
        }
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
        if (index >= 0) {
            $gameParty.setGlossaryCategoryIndex(index);
        }
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
            this.drawTextExIfNeed(text, rect.x + this.textPadding(), rect.y, rect.width - this.textPadding());
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
        this.selectLastIndex();
    };

    Window_GlossaryList.prototype.selectLastIndex = function() {
        var lastIndex = $gameParty.getGlossaryListIndex();
        if (lastIndex >= 0) {
            this.select(Math.min(lastIndex, this.maxItems() - 1));
        }
    };

    Window_GlossaryList.prototype.maxCols = function() {
        return 1;
    };

    Window_GlossaryList.prototype.numberWidth = function() {
        return this.needsNumber() ? Window_ItemList.prototype.numberWidth.call(this, arguments) : 0;
    };

    Window_GlossaryList.prototype.needsNumber = function() {
        return paramShowingItemNumber;
    };

    Window_GlossaryList.prototype.drawItemName = function(item, x, y, width) {
        if (item) {
            var iconBoxWidth = item.iconIndex > 0 ? Window_Base._iconWidth + 4 : 0;
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.setGlossaryColor(item);
            this.drawTextExIfNeed(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
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
        return this.isUsableItem() ? Window_ItemList.prototype.isEnabled.call(this, item) : true;
    };

    Window_GlossaryList.prototype.includes = function(item) {
        return $gameParty.isGlossaryItem(item) && this.isCategoryMatch(item) && $gameParty.isSameGlossaryType(item);
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
        if (index >= 0) {
            $gameParty.setGlossaryListIndex(index);
        }
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

    Window_GlossaryList.prototype.makeItemList = function() {
        this._data = this.getMaterialList().filter(function(item) {
            var isInclude = this.includes(item);
            if (isInclude) {
                item.sortOrder = getMetaValues(item, ['Order', '表示順']) || item.id;
            }
            return isInclude;
        }, this).sort(this.compareOrder);
    };

    Window_GlossaryList.prototype.compareOrder = function(itemA, itemB) {
        return DataManager.getItemTypeCode(itemA) - DataManager.getItemTypeCode(itemB) ||
            itemA.sortOrder - itemB.sortOrder || itemA.id - itemB.id;
    };

    Window_GlossaryList.prototype.getMaterialList = function() {
        return paramUseItemHistory ? $gameParty.getAllMaterialsHistories() : $gameParty.getAllMaterials();
    };

    Window_GlossaryList.prototype.isUsableItem = function() {
        return paramUsableItem && !paramCategoryUnusable.contains(this._category);
    };

    Window_GlossaryList.prototype.removeHandler = function(symbol) {
        delete this._handlers[symbol];
    };

    Window_GlossaryList.prototype.setItemHandler = function(handler) {
        if (this.isUsableItem()) {
            this.setHandler('ok', handler);
        } else {
            this.removeHandler('ok');
        }
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
        this.x   = this._listWindow.x + 64;
        var line = this._listWindow.index() - this._listWindow.topRow();
        if (line >= this._listWindow.maxPageRows() - 2) {
            line -= 3;
        }
        this.y = this._listWindow.y + line * this._listWindow.itemHeight() + 32;
    };

    Window_GlossaryConfirm.prototype.makeCommandList = function() {
        this.addCommand(paramConfirmUse, 'use');
        this.addCommand(paramConfirmNoUse, 'noUse');
    };

    //=============================================================================
    // Window_GlossaryComplete
    //  用語集収集率ウィンドウです。
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

    Window_Glossary.prototype.calcMaxPages = function(index) {
        if (!index) index = 0;
        var exist = !!this.getPictureName(index) || !!this.getDescription(index);
        return (exist && index < 100) ? this.calcMaxPages(index + 1) : index;
    };

    Window_Glossary.prototype.getPictureName = function(index) {
        return this.getMetaContents(['ピクチャ', 'Picture'], index);
    };

    Window_Glossary.prototype.getDescription = function(index) {
        return this.getMetaContents(['説明', 'Description'], index);
    };

    Window_Glossary.prototype.getMetaContents = function(names, index) {
        var item  = this._itemData;
        var value = getMetaValues(item, names, index);
        if (!value) return null;
        var contents = getArgString(value);
        return contents && contents !== '0' ? contents : null;
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
        } else if (wrap && paramPageWrap) {
            this.drawItem(0);
        }
    };

    Window_Glossary.prototype.cursorLeft = function(wrap) {
        if (this._maxPages === 1) return;
        if (this.canMoveLeft()) {
            this.drawItem(this._pageIndex - 1);
        } else if (wrap && paramPageWrap) {
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
        var pictureName = this.getPictureName(index);
        if (pictureName) {
            var bitmap = ImageManager.loadPicture(pictureName, 0);
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
        var text = this.getDescription(this._pageIndex);
        if (text === null) return;
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
        if (typeof TranslationManager !== 'undefined') {
            TranslationManager.getTranslatePromise(text).then(function(translatedText) {
                this.drawTextEx(translatedText, 0, y);
            }.bind(this));
        } else {
            this.drawTextEx(text, 0, y);
        }
    };

    Window_Glossary.prototype.processNormalCharacter = function(textState) {
        var c = textState.text[textState.index + 1];
        var w = this.textWidth(c);
        if (textState.x + w > this.contentsWidth()) {
            this.processNewLine(textState);
            textState.index--;
        }
        Window_Base.prototype.processNormalCharacter.apply(this, arguments);
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
            if (x >= 0 && x < this.width / 2) this.cursorLeft(false);
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

