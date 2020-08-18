//=============================================================================
// ExcludeMaterialGuard.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2020/08/18 ヘルプの注釈と英語版のヘルプと追加
// 1.0.0 2017/08/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MaterialSelectorPlugin
 * @author triacontane
 *
 * @param ImageFiles
 * @desc This is a list of image materials to exclude from the delete unused files feature.
 * @default
 * @require 1
 * @dir img/
 * @type file[]
 *
 * @param AudioFiles
 * @desc This is a list of audio material to exclude from the delete unused files feature.
 * @default
 * @require 1
 * @dir audio/
 * @type file[]
 *
 * @help By selecting a material, you can delete unused material.
 * You can exclude them from the list.
 *
 * By supporting the type designation function implemented in the main body
 * version 1.5.0 of Maker MV, you can remove the target.
 * You can select multiple files from the file dialog.
 *
 * It is not possible to keep all the files in a folder,
 * but you must select all the files one by one.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 未使用素材削除ガードプラグイン
 * @author トリアコンタン
 *
 * @param 画像素材
 * @desc 未使用ファイル削除機能の対象外にする画像素材のリストです。
 * @default
 * @require 1
 * @dir img/
 * @type file[]
 *
 * @param 音声素材
 * @desc 未使用ファイル削除機能の対象外にする音声素材のリストです。
 * @default
 * @require 1
 * @dir audio/
 * @type file[]
 *
 * @help 素材を選択しておくことで未使用素材削除機能の
 * 対象から外すことができます。
 *
 * ツクールMVの本体バージョン1.5.0で実装された型指定機能に対応することで
 * ファイルダイアログから複数のファイルを選択することができます。
 *
 * 指定したフォルダ以下の全てのファイルを残す、といったことはできません。
 * その場合は全ファイルをひとつずつ選択する必要があります。
 *
 * ※ RPGツクールMV本体のヘルプに未使用素材削除機能の詳細が記載されています。
 * RPGツクールMV > 資料集 > 未使用ファイル削除ツール プラグインへの対応
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

