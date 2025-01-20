//=============================================================================
// DynamicDatabase.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.4 2025/01/20 2.1.3の修正に一部対応不備があったので修正
// 2.1.3 2025/01/19 二つ名などに\n[n]を使うとゲーム開始時にエラーになる問題を修正
// 2.1.2 2024/03/12 敵キャラの最大HPに動的データを適用しているとき、戦闘テスト時にHPが最大値にならない問題を修正
// 2.1.1 2022/07/22 ヘルプに注釈を追記
// 2.1.0 2022/07/18 用語に制御文字を使える機能を追加
// 2.0.1 2021/06/09 ドロップアイテムと出現率のタグが逆だったので修正
// 2.0.0 2020/09/25 MZ向けにリファクタリング。ヘルプを修正
// 1.3.2 2019/08/25 1.3.1の修正方法に誤りがあったため再度修正
// 1.3.1 2019/06/02 後方互換性を考慮しデータベースの元の値を参照する際「元の値」という変数名を使えるようになりました。
// 1.3.0 2019/02/10 計算式中に不等号を使えるようエスケープ処理を追加
// 1.2.9 2018/08/04 1.2.8の修正により、レベルアップメッセージなどでアクター名が正常に取得できなくなっていた問題を修正
// 1.2.8 2018/04/29 アクターの名前、二つ名、プロフィールについて一部の制御文字が正常に動作していなかった問題を修正
// 1.2.7 2017/10/07 リファクタリング
// 1.2.6 2017/06/09 全設定一覧のスプレッドシートへのリンクを説明に追加
// 1.2.5 2017/06/02 1.2.4の修正により動作しなくなっていた問題を修正
// 1.2.4 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.3 2017/02/16 1.2.2で数値を0に設定すると動的設定が効かなくなる問題を修正
// 1.2.2 2017/02/16 データベースに項目を追加するプラグインで発生する可能性のある競合対策
// 1.2.1 2017/02/12 汎用的な競合対策
// 1.2.0 2017/02/10 アクターと職業のデータベースについて「特徴」のみ動的データベースに対応
// 1.1.1 2017/01/19 設定値に入れた小数点以下の値が切り捨てられていた問題を修正
// 1.1.0 2016/08/15 コード整形、ドロップアイテムにドロップアイテムIDの定義が抜けていたのを修正
// 1.0.2 2016/05/16 特徴と効果にデータIDの定義を追加
// 1.0.1 2016/01/03 iterateとisEmptyが重複定義されないよう対応
// 1.0.0 2015/12/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 動的データベース構築プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicDatabase.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param dynamicTerm
 * @text 動的用語
 * @desc データベースの用語にも制御文字が使えるようになります。
 * @default false
 * @type boolean
 *
 * @help データベースの各項目を動的な値に変更するプラグインです。
 * 変数やJavaScript計算式を使ってより高度なデータベースを構築できます。
 *
 * 注意！
 * ゲーム中にスクリプトを使ってデータベースファイルを保存、更新する
 * プラグインと併用しないでください。
 *
 * 文字列項目：各項目に直接入力した制御文字が利用できます。
 * 数値項目：メモ欄に入力した制御文字と計算式が利用できます。
 * 選択項目：メモ欄に入力した制御文字と計算式が利用できます。
 * 　　　　　※一番上の選択肢が 0 になります。
 *
 * メモ欄に以下の通り指定してください。
 * 　<DD（項目名）:（計算式）>
 *
 * 設定例１（アイテムの価格に10番の変数の2倍の値を設定したい場合）
 * 　<DD価格:\V[10] * 2>
 *
 * 設定例２（武器の攻撃力に、元の値と10番の変数の値との乗算値を設定したい場合）
 * 　<DD攻撃力:prev * \V[10]>
 * 変数『prev』にデータベースの元の値が格納されます。
 *
 * 計算式中では不等号「>」は使えません。
 * 「<」で代用してください。
 *
 * 特徴や効果を動的データベース化したい場合は
 * メモ欄だけでなく実際の特徴や効果も定義してください。
 * （設定値はメモ欄が優先されるので枠だけあればOK）
 *
 * 公式プラグイン『TextScriptBase.js』を有効にしていると
 * 以下の制御文字が追加で使えます。詳細は同プラグインのヘルプを確認してください。
 * \tx[aaa]
 * \js[aaa]
 *
 * 対象データベースは以下の全項目になります。
 * 　アクター（特徴のみ）
 * 　職業（特徴のみ）
 * 　スキル
 * 　アイテム
 * 　武器
 * 　防具
 * 　敵キャラ
 * 　ステート
 *
 * 設定可能な項目の詳細は以下のリンクを参照ください。
 * https://docs.google.com/spreadsheets/d/1BnTyJr3Z1WoW4FMKtvKaICl4SQ5ehL5RxTDSV81oVQc/edit#gid=894678948
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Scene_Boot
    //  ダイナミックデータベースの構築開始
    //=============================================================================
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        DynamicDatabaseManager.makeDynamicDatabase();
        if (DataManager.isBattleTest()) {
            $gameTroop.members().forEach(enemy => enemy.recoverAll());
        }
    };

    //=============================================================================
    // Game_Actor
    //  アクター名、二つ名、プロフィールについて変更されるまではDBから再取得するよう修正
    //=============================================================================
    let processSetupActorIdList = [];
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        if (processSetupActorIdList[actorId]) {
            return;
        }
        processSetupActorIdList[actorId] = true;
        _Game_Actor_setup.apply(this, arguments);
        processSetupActorIdList[actorId] = false;
        this.__nickname = null;
        this.__profile = null;
        this.__name = null;
    };

    Object.defineProperty(Game_Actor.prototype, '_profile', {
        get: function() {
            return this.__profile !== null ? this.__profile : this.actor().profile;
        },
        set: function(name) {
            this.__profile = name;
        },
    });

    Object.defineProperty(Game_Actor.prototype, '_nickname', {
        get: function() {
            return this.__nickname !== null ? this.__nickname : this.actor().nickname;
        },
        set: function(name) {
            this.__nickname = name;
        },
    });

    Object.defineProperty(Game_Actor.prototype, '_name', {
        get: function() {
            return this.__name !== null ? this.__name : this.actor().name;
        },
        set: function(name) {
            this.__name = name;
        },
    });

    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        _DataManager_loadDatabase.apply(this, arguments);
        DynamicDatabaseManager.resetCreate();
    };

    /**
     * DynamicDatabaseManager
     *  ダイナミックデータベースの構築処理を定義します。
     * @constructor
     */
    function DynamicDatabaseManager() {
        throw new Error('This is a static class');
    }

    window.DynamicDatabaseManager = DynamicDatabaseManager;

    DynamicDatabaseManager._columnMapper = null;
    DynamicDatabaseManager._targetData = null;

    DynamicDatabaseManager._columnMapperCoomon = {
        animationId: 'アニメーション',
        hitType: '命中タイプ',
        iconIndex: 'アイコン',
        occasion: '使用可能時',
        repeats: '連続回数',
        scope: '範囲',
        speed: '速度補正',
        successRate: '成功率',
        tpCost: '消費TP',
        tpGain: '得TP',
        mpCost: '消費MP',
        damage_elementId: '属性',
        damage_type: 'タイプ',
        damage_variance: '分散度',
        price: '価格',
        params_0: '最大HP',
        params_1: '最大MP',
        params_2: '攻撃力',
        params_3: '防御力',
        params_4: '魔法力',
        params_5: '魔法防御',
        params_6: '敏捷性',
        params_7: '運'
    };

    DynamicDatabaseManager._columnMapperSkills = {
        stypeId: 'スキルタイプ',
        requiredWtypeId1: '武器タイプ1',
        requiredWtypeId2: '武器タイプ2'
    };

    DynamicDatabaseManager._columnMapperItems = {
        itypeId: 'アイテムタイプ',
        consumable: '消耗'
    };

    DynamicDatabaseManager._columnMapperWeapons = {
        wtypeId: '武器タイプ'
    };

    DynamicDatabaseManager._columnMapperArmors = {
        atypeId: '防具タイプ',
        etypeId: '装備タイプ'
    };

    DynamicDatabaseManager._columnMapperEnemies = {
        battlerHue: '色相',
        exp: '経験値',
        gold: '所持金'
    };

    DynamicDatabaseManager._columnMapperStates = {
        autoRemovalTiming: '自動解除のタイミング',
        chanceByDamage: 'ダメージで解除_ダメージ',
        maxTurns: '継続ターン数_最大',
        minTurns: '継続ターン数_最小',
        motion: '[SV] モーション',
        overlay: '[SV] 重ね合わせ',
        priority: '優先度',
        removeAtBattleEnd: '戦闘終了時に解除',
        removeByDamage: 'ダメージで解除',
        removeByRestriction: '行動制約で解除',
        removeByWalking: '歩数で解除',
        restriction: '行動制約',
        stepsToRemove: '歩数で解除_歩数'
    };

    DynamicDatabaseManager._targetDynamicDatabase = {
        $dataActors: DynamicDatabaseManager._columnMapperCoomon,
        $dataClasses: DynamicDatabaseManager._columnMapperCoomon,
        $dataSkills: DynamicDatabaseManager._columnMapperSkills,
        $dataItems: DynamicDatabaseManager._columnMapperItems,
        $dataWeapons: DynamicDatabaseManager._columnMapperWeapons,
        $dataArmors: DynamicDatabaseManager._columnMapperArmors,
        $dataEnemies: DynamicDatabaseManager._columnMapperEnemies,
        $dataStates: DynamicDatabaseManager._columnMapperStates
    };

    DynamicDatabaseManager._isEmpty = function(that) {
        return Object.keys(that).length <= 0;
    };

    DynamicDatabaseManager._iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    DynamicDatabaseManager._times = function(count, handler) {
        let i = 0;
        while (i < count) handler.call(this, i++);
    };

    DynamicDatabaseManager.makeDynamicDatabase = function() {
        if (this._create) {
            return;
        }
        this._setColumnMapperDynamic();
        this._iterate(this._targetDynamicDatabase, (dataKey, columnMap) => {
            this._makeDynamicData(window[dataKey], columnMap);
        });
        this._create = true;
    };

    DynamicDatabaseManager.resetCreate = function() {
        this._create = false;
    };

    DynamicDatabaseManager._setColumnMapperDynamic = function() {
        this._times(this._getMaxLength('effects'), i => {
            this._columnMapperCoomon['effects_%1_code'.format(i)] = '使用効果%1_タイプ'.format(i + 1);
            this._columnMapperCoomon['effects_%1_dataId'.format(i)] = '使用効果%1_データID'.format(i + 1);
            this._columnMapperCoomon['effects_%1_value1'.format(i)] = '使用効果%1_内容1'.format(i + 1);
            this._columnMapperCoomon['effects_%1_value2'.format(i)] = '使用効果%1_内容2'.format(i + 1);
        });
        this._times(this._getMaxLength('traits'), i => {
            this._columnMapperCoomon['traits_%1_code'.format(i)] = '特徴%1_タイプ'.format(i + 1);
            this._columnMapperCoomon['traits_%1_dataId'.format(i)] = '特徴%1_データID'.format(i + 1);
            this._columnMapperCoomon['traits_%1_value'.format(i)] = '特徴%1_内容'.format(i + 1);
        });
        this._times(this._getMaxLength('actions'), i => {
            this._columnMapperEnemies['actions_%1_conditionParam1'.format(i)] = '行動%1_条件1'.format(i + 1);
            this._columnMapperEnemies['actions_%1_conditionParam2'.format(i)] = '行動%1_条件2'.format(i + 1);
            this._columnMapperEnemies['actions_%1_conditionType'.format(i)] = '行動%1_条件タイプ'.format(i + 1);
            this._columnMapperEnemies['actions_%1_rating'.format(i)] = '行動%1_R'.format(i + 1);
            this._columnMapperEnemies['actions_%1_skillId'.format(i)] = '行動%1_スキル'.format(i + 1);
        });
        this._times(3, i => {
            this._columnMapperEnemies['dropItems_%1_kind'.format(i)] = 'ドロップアイテム%1_ドロップアイテム'.format(i + 1);
            this._columnMapperEnemies['dropItems_%1_dataId'.format(i)] = 'ドロップアイテム%1_ドロップアイテムID'.format(i + 1);
            this._columnMapperEnemies['dropItems_%1_denominator'.format(i)] = 'ドロップアイテム%1_出現率'.format(i + 1);
        });
    };

    DynamicDatabaseManager._getMaxLength = function(keyName) {
        let length = 0;
        this._iterate(this._targetDynamicDatabase, dataKey => {
            const dataArray = window[dataKey];
            dataArray.forEach(data => {
                if (data && data.hasOwnProperty(keyName)) {
                    length = Math.max(data[keyName].length, length);
                }
            });
        });
        return length;
    };

    DynamicDatabaseManager._makeDynamicData = function(dataArray, columnMap) {
        this._columnMapper = columnMap;
        dataArray.forEach(data => {
            if (!data) {
                return;
            }
            this._targetData = data;
            this._iterate(data, (key, value) => {
                this._makeProperty(data, key, key, value);
            });
        });
    };

    DynamicDatabaseManager._makeProperty = function(parent, keyPath, key, child) {
        if (key === 'meta') {
            return;
        }
        switch (typeof child) {
            case 'string':
                if (child.match(/\\/g)) {
                    this._makePropertyString(parent, key, child);
                }
                break;
            case 'boolean':
            case 'number':
                if (this._isEmpty(parent.meta)) {
                    return;
                }
                const propName = this._columnMapper[keyPath] || this._columnMapperCoomon[keyPath];
                const metaTag = 'DD' + propName;
                if (propName != null && parent.meta[metaTag] != null) {
                    this._makePropertyFormula(parent, key, child, metaTag);
                }
                parent[propName] = child;
                break;
            case 'object':
                if (!child || this._isEmpty(parent.meta)) {
                    return;
                }
                child.meta = parent.meta;
                this._iterate(child, function(valuesKey, valuesItem) {
                    this._makeProperty(child, keyPath + '_' + valuesKey, valuesKey, valuesItem);
                }.bind(this));
                break;
        }
    };

    DynamicDatabaseManager._makePropertyFormula = function(parent, key, child, metaTag) {
        const data = this._targetData;
        Object.defineProperty(parent, key, {
            get: function() {
                const prev = child;
                const script = PluginManagerEx.convertEscapeCharacters(this.meta[metaTag]);
                return eval(script);
            }
        });
    };

    DynamicDatabaseManager._makePropertyString = function(parent, key, child) {
        Object.defineProperty(parent, key, {
            get: function() {
                return PluginManagerEx.convertEscapeCharacters(child);
            }
        });
    };

    if (param.dynamicTerm) {
        TextManager.basic = function(basicId) {
            return PluginManagerEx.convertEscapeCharacters($dataSystem.terms.basic[basicId] || '');
        };

        TextManager.param = function(paramId) {
            return PluginManagerEx.convertEscapeCharacters($dataSystem.terms.params[paramId] || '');
        };

        TextManager.command = function(commandId) {
            return PluginManagerEx.convertEscapeCharacters($dataSystem.terms.commands[commandId] || '');
        };

        TextManager.message = function(messageId) {
            return PluginManagerEx.convertEscapeCharacters($dataSystem.terms.messages[messageId] || '');
        };
    }
})();