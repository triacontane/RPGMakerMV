//=============================================================================
// CounterExtend.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.10.1 2021/03/03 1.10.0のタグが命中タイプ「必中」の場合にも作動していた問題を修正
// 1.10.0 2021/03/03 特徴の「反撃率」の代わりになるタグ<CE_反撃:n>を定義
// 1.9.5 2021/01/25 ヘルプの文言を修正
// 1.9.4 2020/04/07 NRP_CountTimeBattle.jsと併用したとき、戦闘行動の強制による反撃でコマンド入力が回ってきてしまう競合を修正
// 1.9.3 2019/12/30 スキルの属性を指定してからタイプを「なし」にした場合でも、スクリプト「action.hasElement」が元々指定していた属性を返してしまう問題を修正
// 1.9.2 2019/06/09 戦闘行動の強制による反撃を行わない設定のとき、反撃後の自動ステート解除で反撃を有効にするステートを解除した場合、
//                  反撃による敵の行動キャンセルが行われない問題を修正
// 1.9.1 2019/05/02 クロスカウンターで、相手の攻撃が当たった場合のみ反撃する場合は、身代わりによる肩代わりも除外するよう仕様変更
// 1.9.0 2019/04/30 クロスカウンターで、相手の攻撃が当たった場合のみ反撃、もしくは外れた場合のみ反撃できる設定を追加
// 1.8.3 2019/01/29 クロスカウンターによって敵を全滅された後の戦闘で、一部の反撃エフェクトが表示される場合がある問題を修正
// 1.8.2 2019/01/13 クロスカウンター有効時、反撃可能かどうかの再チェックを行うよう修正
//                  「コスト不足で失敗」パラメータ有効時、スキル封印についても考慮するよう修正
// 1.8.1 2018/12/19 クロスカウンター有効時、攻撃によって戦闘不能になったバトラーの反撃が実行される問題を修正
// 1.8.0 2018/12/07 相手が攻撃してきたスキルで反撃する機能を追加
// 1.7.1 2018/09/26 「戦闘行動の強制」を使用しない反撃方法でスキルアニメーションとコモンイベントが呼ばれない問題を修正
//                  反撃が失敗しなかった場合も任意のステートを解除できる機能を追加
// 1.7.0 2018/09/26 「戦闘行動の強制」を使用しない反撃方法を追加しました。動作に若干の違いがあります
// 1.6.0 2018/08/19 コスト不足で反撃が失敗した場合に任意のステートを解除できる機能を追加
//                  魔法反撃に対してコスト不足時発動失敗する機能が正常に動いていなかった問題を修正
// 1.5.0 2018/04/25 スキルに対して個別に反撃されやすさを設定できるようになりました。
// 1.4.4 2018/03/10 反撃条件にスクリプトを使用する際、攻撃してきた相手の情報をtargetで正しく取得できていなかった問題を修正
// 1.4.3 2017/08/09 反撃条件に属性を指定する際に「通常攻撃」を指定した場合も考慮する関数を追加
// 1.4.2 2017/07/12 複数のバトラーが同時に反撃を行った場合に全員分の反撃が正常に行われない問題を修正
// 1.4.1 2017/07/11 1.4.0の機能追加以降、スキル反撃を行うとアクター本来の行動がキャンセルされる場合がある問題を修正
// 1.4.0 2017/06/13 反撃スキルに指定した効果範囲と連続回数が適用されるようになりました。
//                  攻撃を受けてから反撃するクロスカウンター機能を追加
// 1.3.3 2017/06/10 CustumCriticalSoundVer5.jsとの競合を解消
// 1.3.2 2017/05/20 BattleEffectPopup.jsとの併用でスキルによる反撃が表示されない問題を修正。
// 1.3.1 2017/04/22 1.3.0の機能がBattleEngineCoreで動作するよう修正
// 1.3.0 2017/04/09 反撃に成功した時点で相手の行動をキャンセルできる機能を追加
// 1.2.2 2017/02/07 端末依存の記述を削除
// 1.2.1 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.2.0 2016/11/27 反撃スキルIDを複数設定できる機能を追加。条件に応じたスキルで反撃します。
// 1.1.0 2016/11/20 特定のスキルによる反撃や反撃条件を細かく指定できる機能を追加
// 1.0.0 2016/11/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CounterExtendPlugin
 * @author triacontane
 *
 * @param PayCounterCost
 * @desc 固有スキルによる反撃がコスト消費するかどうかを設定します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param FailureCostShortage
 * @desc 固有スキルによる反撃がコスト不足もしくは封印されている場合、反撃は行いません。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param UsingForceAction
 * @desc 戦闘行動の強制によって反撃を実現します。通常はONで、希望通りの動作をしない場合は試してみてください。
 * @default true
 * @type boolean
 *
 * @param EraseStateTiming
 * @desc 反撃後にメモ欄で指定したステートを解除できます。メモ欄の指定がなければ解除されません。
 * @default 0
 * @type select
 * @option Failure
 * @value 0
 * @option Success
 * @value 1
 * @option Always
 * @value 2
 *
 * @help 反撃の仕様を拡張します。
 * 魔法に対する反撃や、特定のスキルを使った反撃、
 * 特定の条件下でのみ発動する反撃などが作成できます。
 *
 * 前提として魔法反撃以外は特徴「反撃率」の設定が必須です。
 * そのうえで、反撃の仕様を以下の通り拡張します。
 *
 * 機能詳細
 *
 * 1. 魔法攻撃を受けた場合もカウンターが発動するようになります。
 * 特徴を有するメモ欄(※1)に以下の通り入力してください。
 *
 * <CE_魔法反撃:50>      # 魔法攻撃を受けた場合に50%の確率で反撃します。
 * <CE_MagicCounter:50>  # 同上
 *
 * ※1 アクター、職業、武器、防具、ステート、敵キャラが該当します。
 *
 * 数値を指定しない場合は、物理攻撃と同様の反撃率が適用されます。
 *
 * <CE_魔法反撃>     # 魔法攻撃を受けた場合にもともとの反撃率で反撃します。
 * <CE_MagicCounter> # 同上
 *
 * 2. 反撃時のスキルを個別に設定することができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃スキルID:\v[1]>    # 反撃時に変数[1]のIDのスキルを使用します。
 * <CE_CounterSkillId:\v[1]>  # 同上
 * <CE_魔法反撃スキルID:3>    # 魔法反撃時にID[3]のスキルを使用します。
 * <CE_MagicCounterSkillId:3> # 同上
 *
 * 反撃スキルは、通常は攻撃してきた相手をターゲットとしますが
 * 味方対象のスキルなどは自分や味方に対して使用します。
 *
 * IDに[0]を指定すると、相手が攻撃してきたスキルで反撃します。
 *
 * 3. 反撃条件をJavaScript計算式の評価結果を利用できます。
 * 反撃条件を満たさない場合は反撃は実行されません。
 * 特定のスキルに対してのみ反撃したり、特定の条件下でのみ反撃したりできます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃条件:v(1) &lt; 100>    # 変数[1]が100より小さければ反撃します。
 * <CE_CounterCond:v(1) &lt; 100> # 同上(※2)
 * <CE_魔法反撃条件:s(1)>         # スイッチ[1]がONなら魔法反撃します。
 * <CE_MagicCounterCond:s(1)>     # 同上
 *
 * 実行したスキルの情報はローカル変数「skill」で参照できます。
 * また、アクションオブジェクトはローカル変数「action」で参照できます。
 * <CE_反撃条件:skill.id === 10>      # スキルIDが[10]なら反撃します。
 * <CE_反撃条件:action.hasElement(3)> # スキル属性IDが[3]なら反撃します。
 *
 * 対象のバトラー情報は「this」で、相手のバトラー情報は「target」で参照できます。
 * <CE_反撃条件:this.hpRate() &lt; 0.5> # 自分のHPが50%を下回ると反撃します。
 *
 * ※2 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 4. 複数の反撃スキルおよび反撃条件を設定できます。
 * 複数定義する場合は、末尾に「_n」を付与してください。
 * <CE_反撃スキルID:4>   # スイッチ[1]がONならスキルID[4]で反撃
 * <CE_反撃条件:s(1)>    #
 * <CE_反撃スキルID_1:5> # スイッチ[2]がONならスキルID[5]で反撃
 * <CE_反撃条件_1:s(2)>  #
 * <CE_反撃スキルID_2:6> # スイッチ[3]がONならスキルID[6]で反撃
 * <CE_反撃条件_2:s(3)>  #
 *
 * 複数の条件を一度に満たした場合は、インデックスの小さい方が
 * 優先して使用されます。
 *
 * 5. 反撃実行時に専用のアニメーションIDを再生します。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_反撃アニメID:20>       # 反撃実行前にアニメーション[20]を再生します。
 * <CE_CounterAnimationId:20> # 同上
 *
 * 6. 反撃成功時に相手の行動をキャンセル（中断）できます。
 * 相手が全体攻撃のスキルを使った場合に、反撃成功時点で以降の相手には
 * 当たらなくなります。特徴を有するメモ欄に以下の通り入力してください。
 * <CE_キャンセル> # 反撃成功時に相手の行動をキャンセル
 * <CE_Cancel>     # 同上
 *
 * 7. デフォルトの反撃とは異なり、攻撃を受けてから反撃させることができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_クロスカウンター> # 相手の攻撃を受けてから反撃します。
 * <CE_CrossCounter>     # 同上
 * ※クロスカウンターはスキルによる反撃の場合のみ有効です。
 *
 * クロスカウンターの発動条件を設定できます。
 * <CE_クロスカウンター条件:1> # 相手の行動が当たった場合のみ反撃
 * <CE_CrossCounterCond:1>     # 同上
 * 0 : 常に
 * 1 : 相手の行動が当たった場合のみ
 * 2 : 相手の行動が外れた場合のみ
 *
 * 8. スキルに対して個別に反撃のされやすさを設定できます。
 * スキルのメモ欄に以下の通り入力してください。
 * <CE_反撃増減:50> # 相手の反撃確率が50%増加する
 * <CE_反撃増減:-100> # 相手の反撃確率が100%減少する
 * ※確率は元の値に乗算ではなく加算(減算)となります。
 *
 * 9. コスト不足で反撃が失敗した場合、任意のステートを解除できます。
 * <CE_ステート解除:1> # コスト不足で反撃が失敗するとステート[1]が解除
 * <CE_StateClear:1>   # 同上
 *
 * ※  パラメータ「戦闘行動強制による反撃」による動作の違い
 * パラメータ「戦闘行動強制による反撃」を有効にすると以下の動作となります。
 * 1. クロスカウンターが動作する
 * 2. 反撃スキルに設定した「効果範囲」および「連続回数」が有効になる
 * 3. 複数回行動する敵の場合、敵の全行動が終わってから反撃する
 * 4. 複数人が反撃しかつ反撃スキルにコモンイベントを設定していた場合、
 *    反撃したバトラー全員のコモンイベントが実行される。
 *
 * 逆に無効にすると以下の動作となります。
 * 1. クロスカウンターが動作しない
 * 2. 反撃スキルに設定した「効果範囲」および「連続回数」が無視される
 * 3. 複数回行動する敵の場合、敵の行動ごとに反撃を実行する
 * 4. 複数人が反撃しかつ反撃スキルにコモンイベントを設定していた場合、
 *    最後に反撃したバトラーのコモンイベントのみが実行される。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 反撃拡張プラグイン
 * @author トリアコンタン
 *
 * @param PayCounterCost
 * @text 反撃コスト消費
 * @desc 固有スキルによる反撃がコスト消費するかどうかを設定します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param FailureCostShortage
 * @text コスト不足で失敗
 * @desc 固有スキルによる反撃がコスト不足もしくは封印されている場合、反撃は行いません。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param UsingForceAction
 * @text 戦闘行動強制による反撃
 * @desc 戦闘行動の強制によって反撃を実現します。通常はONで、希望通りの動作をしない場合は試してみてください。
 * @default true
 * @type boolean
 *
 * @param EraseStateTiming
 * @text ステート解除タイミング
 * @desc 反撃後にメモ欄で指定したステートを解除できます。メモ欄の指定がなければ解除されません。
 * @default 0
 * @type select
 * @option 失敗した場合(コスト不足により)
 * @value 0
 * @option 成功した場合
 * @value 1
 * @option 常に
 * @value 2
 *
 * @help 反撃の仕様を拡張します。
 * 魔法に対する反撃や、特定のスキルを使った反撃、
 * 特定の条件下でのみ発動する反撃などが作成できます。
 *
 * 具体的な機能詳細は以下の通りです。
 *
 * 機能詳細
 *
 * 1. 魔法攻撃を受けた場合もカウンターが発動するようになります。
 * 特徴を有するメモ欄(※1)に以下の通り入力してください。
 *
 * <CE_魔法反撃:50>      # 魔法攻撃を受けた場合に50%の確率で反撃します。
 * <CE_MagicCounter:50>  # 同上
 *
 * ※1 アクター、職業、武器、防具、ステートが該当します。
 *
 * 数値を指定しない場合は、物理攻撃と同様の反撃率が適用されます。
 *
 * <CE_魔法反撃>     # 魔法攻撃を受けた場合にもともとの反撃率で反撃します。
 * <CE_MagicCounter> # 同上
 *
 * 2. 反撃時のスキルを個別に設定することができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃スキルID:\v[1]>    # 反撃時に変数[1]のIDのスキルを使用します。
 * <CE_CounterSkillId:\v[1]>  # 同上
 * <CE_魔法反撃スキルID:3>    # 魔法反撃時にID[3]のスキルを使用します。
 * <CE_MagicCounterSkillId:3> # 同上
 *
 * 反撃スキルは、通常は攻撃してきた相手をターゲットとしますが
 * 味方対象のスキルなどは自分や味方に対して使用します。
 *
 * IDに[0]を指定すると、相手が攻撃してきたスキルで反撃します。
 *
 * 3. 反撃条件をJavaScript計算式の評価結果を利用できます。
 * 反撃条件を満たさない場合は反撃は実行されません。
 * 特定のスキルに対してのみ反撃したり、特定の条件下でのみ反撃したりできます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃条件:v(1) &lt; 100>    # 変数[1]が100より小さければ反撃します。
 * <CE_CounterCond:v(1) &lt; 100> # 同上(※2)
 * <CE_魔法反撃条件:s(1)>         # スイッチ[1]がONなら魔法反撃します。
 * <CE_MagicCounterCond:s(1)>     # 同上
 *
 * 実行したスキルの情報はローカル変数「skill」で参照できます。
 * また、アクションオブジェクトはローカル変数「action」で参照できます。
 * <CE_反撃条件:skill.id === 10>      # スキルIDが[10]なら反撃します。
 * <CE_反撃条件:action.hasElement(3)> # スキル属性IDが[3]なら反撃します。
 *
 * 対象のバトラー情報は「this」で、相手のバトラー情報は「target」で参照できます。
 * <CE_反撃条件:this.hpRate() &lt; 0.5> # 自分のHPが50%を下回ると反撃します。
 *
 * ※2 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 4. 複数の反撃スキルおよび反撃条件を設定できます。
 * 複数定義する場合は、末尾に「_n」を付与してください。
 * <CE_反撃スキルID:4>   # スイッチ[1]がONならスキルID[4]で反撃
 * <CE_反撃条件:s(1)>    #
 * <CE_反撃スキルID_1:5> # スイッチ[2]がONならスキルID[5]で反撃
 * <CE_反撃条件_1:s(2)>  #
 * <CE_反撃スキルID_2:6> # スイッチ[3]がONならスキルID[6]で反撃
 * <CE_反撃条件_2:s(3)>  #
 *
 * 複数の条件を一度に満たした場合は、インデックスの小さい方が
 * 優先して使用されます。
 *
 * 5. 反撃実行時に専用のアニメーションIDを再生します。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_反撃アニメID:20>       # 反撃実行前にアニメーション[20]を再生します。
 * <CE_CounterAnimationId:20> # 同上
 *
 * 6. 反撃成功時に相手の行動をキャンセル（中断）できます。
 * 相手が全体攻撃のスキルを使った場合に、反撃成功時点で以降の相手には
 * 当たらなくなります。特徴を有するメモ欄に以下の通り入力してください。
 * <CE_キャンセル> # 反撃成功時に相手の行動をキャンセル
 * <CE_Cancel>     # 同上
 *
 * 7. デフォルトの反撃とは異なり、攻撃を受けてから反撃させることができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_クロスカウンター> # 相手の攻撃を受けてから反撃します。
 * <CE_CrossCounter>     # 同上
 * ※クロスカウンターはスキルによる反撃の場合のみ有効です。
 *
 * クロスカウンターの発動条件を設定できます。
 * <CE_クロスカウンター条件:1> # 相手の行動が当たった場合のみ反撃
 * <CE_CrossCounterCond:1>     # 同上
 * 0 : 常に
 * 1 : 相手の行動が当たった場合のみ
 * 2 : 相手の行動が外れた場合のみ
 *
 * 8. スキルに対して個別に反撃のされやすさを設定できます。
 * スキルのメモ欄に以下の通り入力してください。
 * <CE_反撃増減:50> # 相手の反撃確率が50%増加する
 * <CE_反撃増減:-100> # 相手の反撃確率が100%減少する
 * ※確率は元の値に乗算ではなく加算(減算)となります。
 *
 * 9. コスト不足で反撃が失敗した場合、任意のステートを解除できます。
 * <CE_ステート解除:1> # コスト不足で反撃が失敗するとステート[1]が解除
 * <CE_StateClear:1>   # 同上
 *
 * ※  パラメータ「戦闘行動強制による反撃」による動作の違い
 * パラメータ「戦闘行動強制による反撃」を有効にすると以下の動作となります。
 * 1. クロスカウンターが動作する
 * 2. 反撃スキルに設定した「効果範囲」および「連続回数」が有効になる
 * 3. 複数回行動する敵の場合、敵の全行動が終わってから反撃する
 *
 * 逆に無効にすると以下の動作となります。
 * 1. クロスカウンターが動作しない
 * 2. 反撃スキルに設定した「効果範囲」および「連続回数」が無視される
 * 3. 複数回行動する敵の場合、敵の行動ごとに反撃を実行する
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var Imported = Imported || {};

(function() {
    'use strict';
    var metaTagPrefix = 'CE_';

    var getArgEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (eval(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        text            = text.replace(/&gt;?/gi, '>');
        text            = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param                 = createPluginParameter('CounterExtend');

    //=============================================================================
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.isValidMagicCounter = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
        });
    };

    Game_BattlerBase.prototype.isCounterCancel = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['キャンセル', 'Cancel']);
        });
    };

    Game_BattlerBase.prototype.isCrossCounter = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['クロスカウンター', 'CrossCounter']);
        });
    };

    Game_BattlerBase.prototype.getMagicCounterRate = function() {
        return this.traitObjects().reduce(function(prevValue, traitObject) {
            var metaValue = getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
            return metaValue ? Math.max(getArgEval(metaValue) / 100, prevValue) : prevValue;
        }, 0);
    };

    Game_BattlerBase.prototype.getCounterAnimationId = function() {
        var counterAnimationId = 0;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, ['反撃アニメID', 'CounterAnimationId']);
            if (metaValue) {
                counterAnimationId = getArgEval(metaValue, 1);
                return true;
            }
            return false;
        }.bind(this));
        return counterAnimationId;
    };

    Game_BattlerBase.prototype.getCrossCounterCondition = function() {
        var crossCounterCondition = 0;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, ['クロスカウンター条件', 'CrossCounterCond']);
            if (metaValue) {
                crossCounterCondition = parseInt(getArgString(metaValue)) || 0;
                return true;
            }
            return false;
        }.bind(this));
        return crossCounterCondition;
    };

    Game_BattlerBase.prototype.reserveCounterSkillId = function(names, originalSkillId) {
        this._reserveCounterSkillId = 0;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, names);
            if (metaValue) {
                this._reserveCounterSkillId = getArgEval(metaValue, 0) || originalSkillId;
                return true;
            }
            return false;
        }.bind(this));
        return this._reserveCounterSkillId;
    };

    Game_BattlerBase.prototype.getCounterCustomRate = function(names, action, target) {
        if (!this.canPaySkillCostForCounter()) {
            if (param.EraseStateTiming !== 1) {
                this.eraseStateCounterFailure();
            }
            return 0;
        }
        var counterCondition;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, names);
            if (metaValue) {
                counterCondition = getArgString(metaValue);
                return true;
            }
            return false;
        }.bind(this));
        return counterCondition ? this.executeCounterScript(counterCondition, action, target) : 1;
    };

    Game_BattlerBase.prototype.eraseStateCounterFailure = function() {
        var stateId = 0;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, ['ステート解除', 'StateClear']);
            if (metaValue) {
                stateId = getArgEval(metaValue, 1);
                return true;
            }
            return false;
        }.bind(this));
        if (stateId > 0) {
            this.eraseState(stateId);
        }
    };

    Game_BattlerBase.prototype.getCounterRate = function() {
        var counter = null;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, ['反撃', 'Counter']);
            if (metaValue) {
                counter = getArgEval(metaValue, 1);
                return true;
            }
            return false;
        }.bind(this));
        return counter;
    };

    Game_BattlerBase.prototype.executeCounterScript = function(counterCondition, action, target) {
        var skill     = action.item();
        // use in eval
        var v         = $gameVariables.value.bind($gameVariables);
        var s         = $gameSwitches.value.bind($gameSwitches);
        var elementId = skill.damage.elementId;
        var result;
        try {
            result = !!eval(counterCondition);
            if ($gameTemp.isPlaytest()) {
                console.log('Execute Script:' + counterCondition);
                console.log('Execute Result:' + result);
            }
        } catch (e) {
            console.error(e.toString());
            throw new Error('Failed To Execute Counter Condition Script :' + counterCondition);
        }
        return result ? 1 : 0;
    };

    Game_BattlerBase.prototype.getCounterSkillId = function() {
        return this.isReserveCounterSkill() ? this._reserveCounterSkillId : this.attackSkillId();
    };

    Game_BattlerBase.prototype.isReserveCounterSkill = function() {
        return !!this._reserveCounterSkillId;
    };

    Game_BattlerBase.prototype.canPaySkillCostForCounter = function() {
        return !param.FailureCostShortage || !this._reserveCounterSkillId ||
            this.meetsSkillConditions($dataSkills[this._reserveCounterSkillId]);
    };

    //=============================================================================
    // Game_Battler
    //  カウンター時のスキルコスト消費処理を別途定義します。
    //=============================================================================
    var _Game_Battler_useItem      = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        if (this.isCounterSubject() && !param.PayCounterCost) return;
        _Game_Battler_useItem.apply(this, arguments);
        this.refresh();
    };

    Game_Battler.prototype.setCounterAction = function(target) {
        var counterSkillId = this.getCounterSkillId();
        var action         = new Game_Action(this);
        action.setSkill(counterSkillId);
        var counterTargetIndex;
        if (action.isForFriend()) {
            counterTargetIndex = this.friendsUnit().members().indexOf(this);
        } else {
            counterTargetIndex = target.friendsUnit().members().indexOf(target);
        }
        this._nativeActions  = this._actions;
        this._counterSubject = true;
        this.forceAction(counterSkillId, counterTargetIndex);
    };

    Game_Battler.prototype.clearCounterAction = function() {
        if (this._nativeActions && this._nativeActions.length > 0) {
            this._actions = this._nativeActions;
        }
        this._nativeActions  = null;
        this._counterSubject = false;
        if (param.EraseStateTiming !== 0) {
            this.eraseStateCounterFailure();
        }
    };

    Game_Battler.prototype.isCounterSubject = function() {
        return this._counterSubject;
    };

    var _Game_Battler_onAllActionsEnd      = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        if (this.isCounterSubject()) {
            this.clearResult();
        } else {
            _Game_Battler_onAllActionsEnd.apply(this, arguments);
        }
    };

    var _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.apply(this, arguments);
        this.clearCounterAction();
    };

    //=============================================================================
    // Game_Action
    //  魔法反撃を可能にします。
    //=============================================================================
    Game_Action.prototype.getCounterAdditionalRate = function() {
        var rate = getMetaValues(this.item(), ['反撃増減', 'CounterAdditional']);
        return rate ? parseInt(rate) / 100 : 0;
    };

    var _Game_Action_itemCnt      = Game_Action.prototype.itemCnt;
    Game_Action.prototype.itemCnt = function(target) {
        // invalid by user action
        if (this.subject().isCounterSubject()) {
            return 0;
        }
        var cnt           = _Game_Action_itemCnt.apply(this, arguments);
        var additionalCnt = this.getCounterAdditionalRate();
        if (this.isMagical()) {
            return this.itemMagicCnt(target, additionalCnt);
        } else {
            var rate = this.reserveTargetCounterSkillId(target, false, 0);
            if (!cnt && this.isPhysical() && target.canMove()) {
                cnt = target.getCounterRate();
            }
            return rate * (cnt + additionalCnt);
        }
    };

    Game_Action.prototype.itemMagicCnt = function(target, additionalCnt) {
        if (target.isValidMagicCounter() && this.isMagical() && target.canMove()) {
            var rate = this.reserveTargetCounterSkillId(target, true, 0);
            return rate * ((target.getMagicCounterRate() || target.cnt) + additionalCnt);
        } else {
            return 0;
        }
    };

    Game_Action.prototype.reserveTargetCounterSkillId = function(target, magicFlg, depth) {
        var skillMetaNames = this.getMetaNamesForCounterExtend(['反撃スキルID', 'CounterSkillId'], magicFlg, depth);
        var counterSkill   = target.reserveCounterSkillId(skillMetaNames, this.item().id);
        if (counterSkill === 0 && depth > 0) {
            return 0;
        }
        var rateMetaNames = this.getMetaNamesForCounterExtend(['反撃条件', 'CounterCond'], magicFlg, depth);
        var counterRate   = target.getCounterCustomRate(rateMetaNames, this, this.subject());
        if (counterRate > 0 || depth > 100) {
            return counterRate;
        } else {
            return this.reserveTargetCounterSkillId(target, magicFlg, depth + 1);
        }
    };

    Game_Action.prototype.getMetaNamesForCounterExtend = function(names, magicFlg, depth) {
        if (depth > 0) {
            names[0] = names[0] + '_' + String(depth);
            names[1] = names[1] + '_' + String(depth);
        }
        if (magicFlg) {
            names[0] = '魔法' + names[0];
            names[1] = 'Magic' + names[1];
        }
        return names;
    };

    Game_Action.prototype.hasElement = function(elementId) {
        if (this.item().damage.type === 0) {
            return false;
        }
        var skillElementId = this.item().damage.elementId;
        // Normal attack elementID[-1]
        if (skillElementId === -1) {
            return this.subject().attackElements().contains(elementId);
        } else {
            return elementId === skillElementId;
        }
    };

    var _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        this._targetForCounterExtend = target;
    };

    Game_Action.prototype.isValidCrossCounter = function(target) {
        if (target.isDead() || this.itemCnt(target) <= 0) {
            return false;
        }
        var cond = target.getCrossCounterCondition();
        return (cond === 1 && this._targetForCounterExtend === target) ||
            (cond === 2 && !this._targetForCounterExtend) ||
            cond === 0;
    };

    //=============================================================================
    // BattleManager
    //  スキルによる反撃を実装します。
    //=============================================================================
    var _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers      = function() {
        _BattleManager_initMembers.apply(this, arguments);
        this._counterBattlers = [];
    };

    var _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction      = function() {
        this._actionCancel = false;
        if (this._subject.isCounterSubject()) {
            this._logWindow.displaySkillCounter(this._subject);
        }
        _BattleManager_startAction.apply(this, arguments);
    };

    var _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
    BattleManager.invokeCounterAttack      = function(subject, target) {
        if (target.isCounterCancel()) {
            this._actionCancel = true;
        }
        if (!target.isReserveCounterSkill()) {
            _BattleManager_invokeCounterAttack.apply(this, arguments);
        } else if (param.UsingForceAction) {
            if (target.isCrossCounter()) {
                this.invokeNormalAction(subject, target);
                if (!this._action.isValidCrossCounter(target)) {
                    return;
                }
            }
            if (!target.isCounterSubject()) {
                this.prepareCounterSkill(subject, target);
            }
        } else if (subject.isAlive()) {
            var action = new Game_Action(target);
            action.setSkill(target.getCounterSkillId());
            action.apply(subject);
            action.applyGlobal();
            this._logWindow.displaySkillCounterAction(subject, target, action);
            if (param.EraseStateTiming !== 0) {
                target.eraseStateCounterFailure();
            }
        }
    };

    BattleManager.prepareCounterSkill = function(subject, target) {
        target.setCounterAction(subject);
        this._counterBattlers.push(target);
    };

    var _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction      = function(subject, target) {
        if (this._actionCancel) return;
        _BattleManager_invokeAction.apply(this, arguments);
    };

    var _BattleManager_getNextSubject = BattleManager.getNextSubject;
    BattleManager.getNextSubject      = function() {
        if (this._subject && this._subject.isCounterSubject()) {
            this._subject.clearCounterAction();
        }
        if (this._counterBattlers.length > 0) {
            return this._counterBattlers.shift();
        }
        return _BattleManager_getNextSubject.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleLog
    //  スキルによる反撃を演出します。
    //=============================================================================
    Window_BattleLog.prototype.displaySkillCounter = function(subject) {
        var counterAnimation = subject.getCounterAnimationId();
        if (counterAnimation) {
            this.push('showAnimation', subject, [subject], counterAnimation);
            this.push('waitForAnimation');
        }
        if (!Imported.YEP_BattleEngineCore) {
            this.push('addText', TextManager.counterAttack.format(subject.name()));
        }
        // for BattleEffectPopup.js
        if (this.popupCounter) {
            this.popupCounter(subject);
        }
    };

    Window_BattleLog.prototype.displaySkillCounterAction = function(subject, target, action) {
        this.displaySkillCounter(target);
        this.startAction(target, action, [subject]);
        this.push('waitForAnimation');
        this.displayActionResults(target, subject);
        this.endAction(target);
    };

    var _Window_BattleLog_updateWaitMode      = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        var waiting = false;
        switch (this._waitMode) {
            case 'animation':
                waiting = this._spriteset.isAnimationPlaying();
                break;
        }
        if (!waiting) {
            waiting = _Window_BattleLog_updateWaitMode.apply(this, arguments);
        }
        return waiting;
    };

    Window_BattleLog.prototype.waitForAnimation = function() {
        this.setWaitMode('animation');
    };

    // Resolve conflict for NRP_CountTimeBattle.js
    if (BattleManager.startInputActor) {
        var _BattleManager_startInput = BattleManager.startInput;
        BattleManager.startInput = function() {
            if (this._counterBattlers.length > 0) {
                this._subject = this.getNextSubject();
                this._phase = 'action';
            } else {
                _BattleManager_startInput.apply(this, arguments);
            }
        };

        var _BattleManager_endTurn = BattleManager.endTurn;
        BattleManager.endTurn = function() {
            if (this._subject.isCounterSubject()) {
                this._phase      = 'turnEnd';
                this._preemptive = false;
                this._surprise   = false;
            } else {
                _BattleManager_endTurn.apply(this, arguments);
            }
        }
    }
})();


