//=============================================================================
// ConvertKinokoTakenoko
// ----------------------------------------------------------------------------
// Copyright (c) 2016 fftfantt
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2016/8/15 たけのこをきのこに変換するよう修正しました。be triacontane
// 1.0.0 2016/8/15 初版
// ----------------------------------------------------------------------------
// [HomePage]: https://googledrive.com/host/0BxiSZT-B8lvFOUFhVTF6VjNnUGc/index.html 
// [Twitter] : https://twitter.com/fftfantt/
// [GitHub]  : https://github.com/fftfantt/
//=============================================================================
/*:
 *
 * @plugindesc 文章中の「たけのこ」を「きのこ」に変換します。
 * @help
 *
 * ■説明
 *  このプラグインは、文章の表示やシステムメッセージなどあらゆる場面での「たけのこ」
 *  を「きのこ」に「たけのこの里」を「きのこの山」に変換します。
 * 
 * ■使い方
 *  プラグインを適用するだけでご使用できます。
 * 
 * ■利用規約
 *  当プラグインはMITライセンスのもとで公開されています。
 *  https://osdn.jp/projects/opensource/wiki/licenses%2FMIT_license
 *  ヘッダーのライセンス表記のみ残してください。
 *  商用利用、年齢制限のあるゲームへの使用や改変が可能です。
 *  クレジットは不要です。
 *  当プラグインによる損害の責任についても、MITライセンスの表記どおりです。 
*/

(function () {
    'use strict';

    //=============================================================================
    // Game_Message
    // きのこからたけのこへの変換を追加定義します。
    //=============================================================================
    var _Game_Message_prototype_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function (text) {
        text = convertTakenokoKinoko(text);
        _Game_Message_prototype_add.call(this, text);
    };

    //=============================================================================
    // convertTakenokoKinoko
    // たけのこからきのこへの変換の実装部分です。
    //=============================================================================
    var convertTakenokoKinoko = function (text) {

        var dm = '';

        text = text.replace(/たけのこの里/ig, 'きのこの山');
        text = text.replace(/タケノコの里/ig, 'キノコの山');
        text = text.replace(/ﾀｹﾉｺの里/ig, 'ｷﾉｺの山');
        text = text.replace(/たけのこ/ig, 'きのこ');
        text = text.replace(/タケノコ/ig, 'キノコ');
        text = text.replace(/ﾀｹﾉｺ/ig, 'ｷﾉｺ');
        text = text.replace(/takenoko/ig, 'kinoko');

        dm = sarchTakenoko(text.match(/(た)(.)(け)(.)(の)(.)(こ)(.)(の)(.)(里)/i));
        text = (dm !== null) ?
            text.replace('た' + dm + 'け' + dm + 'の' + dm + 'こ' + dm + 'の' + dm + '里',
                'き' + dm + 'の' + dm + 'こ' + dm + 'の' + dm + '山') : text;

        dm = sarchTakenoko(text.match(/(タ)(.)(ケ)(.)(ノ)(.)(コ)(.)(の)(.)(里)/i));
        text = (dm !== null) ?
            text.replace('タ' + dm + 'ケ' + dm + 'ノ' + dm + 'コ' + dm + 'の' + dm + '里',
                'キ' + dm + 'ノ' + dm + 'コ' + dm + 'の' + dm + '山') : text;

        dm = sarchTakenoko(text.match(/(ﾀ)(.)(ｹ)(.)(ﾉ)(.)(ｺ)(.)(の)(.)(里)/i));
        text = (dm !== null) ?
            text.replace('ﾀ' + dm + 'ｹ' + dm + 'ﾉ' + dm + 'ｺ' + dm + 'の' + dm + '里',
                'ｷ' + dm + 'ﾉ' + dm + 'ｺ' + dm + 'の' + dm + '山') : text;

        dm = sarchTakenoko(text.match(/(た)(.)(け)(.)(の)(.)(こ)/i))
        text = (dm !== null) ?
            text.replace('た' + dm + 'け' + dm + 'の' + dm + 'こ',
                'き' + dm + 'の' + dm + 'こ') : text;

        dm = sarchTakenoko(text.match(/(タ)(.)(ケ)(.)(ノ)(.)(コ)/i));
        text = (dm !== null) ?
            text.replace('タ' + dm + 'ケ' + dm + 'ノ' + dm + 'コ',
                'キ' + dm + 'ノ' + dm + 'コ') : text;

        dm = sarchTakenoko(text.match(/(ﾀ)(.)(ｹ)(.)(ﾉ)(.)(ｺ)/i));
        text = (dm !== null) ?
            text.replace('ﾀ' + dm + 'ｹ' + dm + 'ﾉ' + dm + 'ｺ',
                'ｷ' + dm + 'ﾉ' + dm + 'ｺ') : text;

        dm = sarchTakenoko(text.match(/(T)(.)(a)(.)(k)(.)(e)(.)(n)(.)(o)(.)(k)(.)(o)/i));
        text = (dm !== null) ?
            text.replace('T' + dm + 'a' + dm + 'k' + dm + 'e' + dm + 'n' + dm + 'o' + dm + 'k' + dm + 'o',
                'K' + dm + 'i' + dm + 'n' + dm + 'o' + dm + 'k' + dm + 'o') : text;

        return text;

    };

    var sarchTakenoko = function (text) {
        if (text == null) return null;
        var delimiterKinoko = text[2];
        for (var i = 1; i < text.length; i++) {
            if ((i % 2) !== 0 && text[i] === null) return null;
            if ((i % 2) === 0 && delimiterKinoko !== text[i]) return null;
        }
        return delimiterKinoko;
    };

})();