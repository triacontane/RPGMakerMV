//=============================================================================
// ExcludeMaterialGuard.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @desc 未使用ファイル削除機能の対象外にする画像素材のリストです。
 * @default
 * @require 1
 * @dir img/
 * @type file[]
 *
 * @param AudioFiles
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
 * このプラグインにはプラグインコマンドはありません。
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
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

