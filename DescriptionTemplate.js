/*=============================================================================
 DescriptionTemplate.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/08/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 説明テンプレートプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DescriptionTemplate.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param skillTemplate
 * @text スキル説明テンプレート
 * @desc スキルの説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
 * @default
 * @type multiline_string[]
 *
 * @param itemTemplate
 * @text アイテム説明テンプレート
 * @desc アイテムの説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
 * @default
 * @type multiline_string[]
 *
 * @param weaponTemplate
 * @text 武器説明テンプレート
 * @desc 武器の説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
 * @default
 * @type multiline_string[]
 *
 * @param armorTemplate
 * @text 防具説明テンプレート
 * @desc 防具の説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
 * @default
 * @type multiline_string[]
 *
 * @param terms
 * @text 用語
 * @desc データベースのプルダウン項目をテンプレートに指定したときに使用される用語文字列です。言語圏によっては変更が必要です。
 * @type struct<Terms>
 * @default {"itypeId":"[\"通常アイテム\",\"大事なもの\",\"隠しアイテムA\",\"隠しアイテムB\"]","hitType":"[\"必中\",\"物理攻撃\",\"魔法攻撃\"]","type":"[\"なし\",\"HPダメージ\",\"MPダメージ\",\"HP回復\",\"MP回復\",\"HP吸収\",\"MP吸収\"]","occasion":"[\"常時\",\"バトル画面\",\"メニュー画面\",\"使用不可\"]","consumable":"[\"する\",\"しない\"]","critical":"[\"あり\",\"なし\"]","scope":"[\"なし\",\"敵単体\",\"敵全体\",\"敵1体ランダム\",\"敵2体ランダム\",\"敵3体ランダム\",\"敵4体ランダム\",\"味方単体（生存）\",\"味方全体（生存）\",\"味方単体（戦闘不能）\",\"味方全体（戦闘不能）\",\"使用者\",\"味方単体（無条件）\",\"味方全体（無条件）\",\"敵味方全体\"]","none":"なし","normalAttack":"通常攻撃"}
 *
 * @help DescriptionTemplate.js
 *
 * 各データベースの『説明』欄にそれぞれ共通のテンプレートを適用します。
 * 共通化することで表記揺れや誤りを防ぎ、統一感のある説明が作成できます。
 *
 * テンプレートはパラメータの1件目に登録したものが使用されますが、
 * メモ欄に以下の通り入力すると、2件目以降のテンプレートも利用できます。
 * <TemplateIndex:2>
 *
 * メモ欄に以下の通り入力すると、テンプレートの適用外になります。
 * <NoDescTemplate>
 *
 * 以下の通り入力すると、データベースの設定値に置き換わります。
 * ${name} : 名前
 * ${description} : (元の)説明
 * ${price} : 値段
 * ${mpCost} : 消費MP
 * ${tpCost} : 消費TP
 * ${requiredWtypeId1} : 必要武器タイプ1
 * ${requiredWtypeId2} : 必要武器タイプ2
 * ${occasion} : 使用可能時
 * ${scope} : 効果範囲
 * ${speed} : 速度補正
 * ${successRate} : 成功率
 * ${tpGain} : 獲得TP
 * ${repeats} : 連続回数
 * ${wtypeId} : 武器タイプ
 * ${atypeId} : 防具タイプ
 * ${etypeId} : 装備タイプ
 * ${stypeId} : スキルタイプ
 * ${itypeId} : アイテムタイプ
 * ${hitType} : 命中タイプ
 * ${elementId} : 属性
 * ${critical} : 会心
 * ${type} : ダメージタイプ
 * ${variance} : 分散度
 * ${consumable} : 消耗
 * ${mhp} : 最大HP
 * ${mmp} : 最大MP
 * ${atk} : 攻撃力
 * ${def} : 防御力
 * ${mat} : 魔法力
 * ${mdf} : 魔法防御
 * ${agi} : 敏捷性
 * ${luk} : 運
 * ${aaa} : メモ欄[aaa]の値
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

/*~struct~Terms:
 *
 * @param itypeId
 * @text アイテムタイプ
 * @desc アイテムタイプの用語リストです。
 * @type string[]
 * @default ["通常アイテム","大事なもの","隠しアイテムA","隠しアイテムB"]
 *
 * @param hitType
 * @text 命中タイプ
 * @desc 命中タイプの用語リストです。
 * @type string[]
 * @default ["必中","物理攻撃","魔法攻撃"]
 *
 * @param type
 * @text ダメージタイプ
 * @desc ダメージタイプの用語リストです。
 * @type string[]
 * @default ["なし","HPダメージ","MPダメージ","HP回復","MP回復","HP吸収","MP吸収"]
 *
 * @param occasion
 * @text 使用可能時
 * @desc 使用可能時の用語リストです。
 * @type string[]
 * @default ["常時","バトル画面","メニュー画面","使用不可"]
 *
 * @param consumable
 * @text 消耗
 * @desc 消耗の用語リストです。
 * @type string[]
 * @default ["する","しない"]
 *
 * @param critical
 * @text 会心
 * @desc 会心の用語リストです。
 * @type string[]
 * @default ["あり","なし"]
 *
 * @param scope
 * @text 効果範囲
 * @desc 効果範囲の用語リストです。
 * @type string[]
 * @default ["なし","敵単体","敵全体","敵1体ランダム","敵2体ランダム","敵3体ランダム","敵4体ランダム","味方単体（生存）","味方全体（生存）","味方単体（戦闘不能）","味方全体（戦闘不能）","使用者","味方単体（無条件）","味方全体（無条件）","敵味方全体"]
 *
 * @param none
 * @text なし
 * @desc タイプ指定や属性が「なし」の場合の表示ラベルです。
 * @type string
 * @default なし
 *
 * @param normalAttack
 * @text 通常攻撃
 * @desc 属性が「通常攻撃」の場合の表示ラベルです。
 * @type string
 * @default 通常攻撃
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.terms) {
        param.terms = {};
    }

    /**
     * DataManager
     */
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        const templates = this.findTemplate(object);
        if (templates) {
            applyDescriptionTemplate(object, templates);
        }
        if (object === $dataSystem) {
            this.createOptionLabel();
        }
    };

    DataManager.findTemplate = function(object) {
        const templateMap = new Map();
        templateMap.set($dataItems, param.itemTemplate);
        templateMap.set($dataSkills, param.skillTemplate);
        templateMap.set($dataWeapons, param.weaponTemplate);
        templateMap.set($dataArmors, param.armorTemplate);
        return templateMap.get(object);
    };

    DataManager.createOptionLabel = function() {
        const options = new Map();
        options.set('requiredWtypeId1', $dataSystem.weaponTypes);
        options.set('requiredWtypeId2', $dataSystem.weaponTypes);
        options.set('wtypeId', $dataSystem.weaponTypes);
        options.set('atypeId', $dataSystem.armorTypes);
        options.set('etypeId', $dataSystem.equipTypes);
        options.set('stypeId', $dataSystem.skillTypes);
        options.set('elementId', $dataSystem.elements);
        Object.keys(param.terms._parameter).forEach(function(key) {
            options.set(key, param.terms[key]);
        });
        this._optionLabels = options;
    };

    DataManager.findOptionLabel = function(propName, index) {
        if (!isFinite(index)) {
            return null;
        }
        if (index === -1 && propName === 'elementId') {
            return param.terms.normalAttack;
        }
        const option = this._optionLabels.get(propName);
        return option ? option[index] || param.terms.none : null;
    };

    function applyDescriptionTemplate(object, templates) {
        object.forEach(function(data) {
            if (!data || data.hasOwnProperty('prevDesc') || data.meta.NoDescTemplate) {
                return;
            }
            data.prevDesc = data.description || '';
            const templateIndex = parseInt(data.meta.TemplateIndex) - 1;
            const template = templates[templateIndex || 0];
            if (!template) {
                return;
            }
            Object.defineProperty(data, 'description', {
                get: function() {
                    return createDescription(data, template);
                }
            });
        });
    }

    const paramProps = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];

    function createDescription(data, template) {
        return template.replace(/\${(.*?)}/g, function() {
            const propName = arguments[1];
            if (propName === 'description') {
                return data.prevDesc;
            } else if (data.meta && data.meta.hasOwnProperty(propName)) {
                return convertDescription(data.meta, propName);
            } else if (data.damage && data.damage.hasOwnProperty(propName)) {
                return convertDescription(data.damage, propName);
            } else if (data.hasOwnProperty(propName)) {
                return convertDescription(data, propName);
            } else {
                const paramIndex = paramProps.indexOf(propName);
                return paramIndex >= 0 ? data.params[paramIndex] : '';
            }
        });
    }

    function convertDescription(data, propName) {
        const value = data[propName]
        return DataManager.findOptionLabel(propName, value) || value;
    }
})();
