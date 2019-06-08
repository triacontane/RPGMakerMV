//=============================================================================
// AutoTranslation.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2019/06/03 一部をより競合のおきにくい記述に変更
// 2.0.0 2019/06/02 Translator Text APIのV3に対応しました。パラメータの再設定が必要です。
//                  複数の翻訳先言語を指定可能にしました。
//                  リアルタイム翻訳機能を追加しました。
// 1.2.1 2019/06/02 動的データベースプラグインと併用してブラウザ起動するとエラーになる問題を修正
// 1.2.0 2017/11/19 RTK1_Option_EnJa.jsと連携できるように仕様を微調整
// 1.1.2 2017/08/24 ヘルプの誤字を修正＋型指定機能に対応
// 1.1.1 2017/04/22 制御文字の精度をほんの少し改善
// 1.1.0 2017/04/19 制御文字の翻訳に部分的に対応。翻訳対象から除外する制御文字を追加
//                  サブスクリプションキーを指定できる機能を追加
// 1.0.0 2017/04/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AutoTranslationPlugin
 * @author triacontane
 *
 * @param ToLanguage
 * @desc This is the translation target language code.
 * @default ['ja']
 *
 * @param TranslateDatabase
 * @desc Translate each element of the database. Translation process involves little by little in the background.
 * @default false
 * @type boolean
 *
 * @param TranslateMessage
 * @desc Translate the contents of the message and choose display.
 * @default true
 * @type boolean
 *
 * @param RealtimeTranslate
 * @desc Calls the translation API outside of test play.
 * @default false
 * @type boolean
 *
 * @param TranslationSwitchId
 * @desc Is the switch ID translation is enabled. Specify 0 to unconditionally valid in translation.
 * @default 0
 * @type switch
 *
 * @param LanguageVariableId
 * @desc This is a variable number that determines the display language to be specified when multiple target languages are specified
 * @default 0
 * @type variable
 *
 * @param InvertTranslationSwitch
 * @desc The effect of translation switch ID is inverted, translation is enabled when OFF, and disabled when ON.
 * @default false
 * @type boolean
 *
 * @param SubscriptionKey
 * @desc It is the subscription key of Microsoft Azure. If unspecified, use the shared environment prepared here.
 * @default
 *
 * @param OutLog
 * @desc Logging the request process. (ON/TEST/OFF)
 * @default TEST
 * @type select
 * @option ON
 * @option TEST
 * @option OFF
 *
 * Automatically translate messages and data during game.
 * Although there is a limit to the precision because of machine translation,
 * it can easily correspond to multiple languages.
 * The following is the translation target.
 * 1. Message of "Text display"
 * 2. Choices of "Show Choice"
 * 3. "Map name"
 * 4. Databases (including terminology)
 *
 * Translation uses "Translator Text API" (Web API) of "Microsoft Azure".
 * https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/
 *
 * For the language code, please refer to the following.
 * https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/language-support
 *
 * The translation result is accumulated in the file
 * "Translations - (translation destination language code). Json"
 * If the same sentence is requested, the contents saved in the file are returned.
 * The JSON file is a simple structure that uses the text before translation
 * as the key and the post sentence as the value
 * It can be edited easily with the JSON editor etc. as follows. (Editing is self-responsibility)
 *
 * http://jsoneditoronline.org/
 *
 * The creation of the translation data is done only during the test play,
 * only after releasing the JSON file
 * It can be used even in offline games because it refers.
 *
 * Since message translation is performed at the timing of display,
 * when communication occurs (only for the first time)
 * It may take time to display the message on the window.
 * Also, since database translation is executed little by little in the background,
 * It takes time.
 *
 * Whether to apply the translation can be switched by designating an arbitrary switch.
 * Please use it when you want to change the target language on the setting screen etc.
 *
 * Restriction
 * 1. The free version of "Translator Text API" can translate up to 2 million characters per month.
 * This is the total of all users of this plugin.
 * (Probably I do not think it will exceed) I do not need to shrink the translation in particular,
 * In the unlikely event it will be impossible to translate, please understand beforehand.
 *
 * 2. If you include control characters in sentences,
 * the contents will be lost and skipping the translation.
 *
 * 3. We can not respond to requests on the system.
 *
 * 4. When "Translator Text API" terminates the service, this plug-in naturally
 * It will become unusable. (I will consider alternatives)
 *
 * There is no plug-in command in this plug-in.
 *
 * This sentence was created by google translation.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 自動翻訳プラグイン
 * @author トリアコンタン
 *
 * @param ToLanguage
 * @text 翻訳先言語
 * @desc 翻訳先になる言語コードです。複数指定可能で、パラメータ「翻訳先変数番号」の値で切り替わります。
 * @default ["en"]
 * @type string[]
 *
 * @param TranslateDatabase
 * @text データベース翻訳
 * @desc データベースの各要素を翻訳します。翻訳処理はバックグラウンドで少しずつ行われます。
 * @default false
 * @type boolean
 *
 * @param TranslateMessage
 * @text メッセージ翻訳
 * @desc メッセージ表示と選択肢表示の内容を翻訳します。
 * @default true
 * @type boolean
 *
 * @param RealtimeTranslate
 * @text リアルタイム翻訳
 * @desc テストプレー時以外でも翻訳APIを呼び出します。
 * @default false
 * @type boolean
 *
 * @param TranslationSwitchId
 * @text 翻訳スイッチ番号
 * @desc 翻訳が有効になるスイッチ番号です。0を指定すると無条件で翻訳が有効になります。
 * @default 0
 * @type switch
 *
 * @param LanguageVariableId
 * @text 翻訳先変数番号
 * @desc 翻訳先言語を複数指定した場合に指定する表示言語を決める変数番号です。翻訳先言語で指定した順(0始まり)になります。
 * @default 0
 * @type variable
 *
 * @param InvertTranslationSwitch
 * @text 翻訳スイッチ反転
 * @desc 翻訳スイッチIDの効果を反転させ、OFFのときに翻訳が有効、ONのときに無効になります。
 * @default false
 * @type boolean
 *
 * @param SubscriptionKey
 * @text サブスクリプションキー
 * @desc Microsoft Azureのサブスクリプションキーです。未指定の場合、こちらで用意した共用環境を使用します。
 * @default
 *
 * @param OutLog
 * @text ログ出力
 * @desc リクエストの経過をログ出力します。(ON/TEST/OFF)
 * TESTはテストプレー時のみ出力
 * @default TEST
 * @type select
 * @option ON
 * @option TEST
 * @option OFF
 *
 * @help ゲーム中のメッセージおよびデータを自働で翻訳します。
 * 機械翻訳のため精度には限界はありますが、手軽に多言語対応できます。
 * 以下が翻訳対象です。
 * 1. 「文章の表示」のメッセージ
 * 2. 「選択肢の表示」の選択肢
 * 3. 「マップ名」
 * 4. 各種データベースの値（用語も含む）
 *
 * 翻訳APIはテストプレー時しか呼ばれません。実際にメッセージを表示すると
 * 言語ごとの辞書ファイル「data/Translations_{言語コード}.json」が作成されます。
 * リリース後は、この辞書ファイルを元に翻訳します。
 * 翻訳元言語は元の文章から自動判定されます。
 *
 * パラメータ「リアルタイム翻訳」をONにすると、プレイヤーがゲームをプレーしている
 * 最中にも翻訳APIが呼ばれるようになります。
 * ただし、RPGアツマールなど外部のAPIを呼び出せない環境下では動作しません。
 *
 * 辞書ファイルは、翻訳前の文章をキー、翻訳後の文章を値とするJSON形式のため
 * 以下のようなJSONエディタ等で簡単に編集できます。
 * 誤訳を調整したり、特定の単語を翻訳しないようにすることもできます。
 * http://jsoneditoronline.org/
 *
 * 翻訳は「Microsoft Azure」の「Translator Text API」(Web API)を使用しています。
 * https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/
 *
 * 言語コードについては、以下を参照してください。
 * https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/language-support
 *
 * ・制約事項
 * 1. 「Translator Text API」の無料版は、1ヶ月に200万文字までしか翻訳できません。
 * これは当プラグインの使用者全員の合計になります。
 * （多分超えないと思うので）特に翻訳を萎縮して頂く必要はありませんが、
 * 万一超過した場合は翻訳できなくなる点は予めご了承ください。
 *
 * 2. 制御文字を含む文章の翻訳は不完全です。結果がおかしくなる場合
 * 必要に応じて辞書ファイルを修正してください。
 *
 * 3. 翻訳精度に関するご要望にはお応えできません。
 *
 * 4. 「Translator Text API」がサービスを終了した場合、当然このプラグインは
 * 使用できなくなります。（代替案は検討します）
 *
 * メッセージ翻訳は、表示するタイミングで行われるため、通信発生時（初回のみ）は
 * ウィンドウにメッセージ表示までに時間が掛かる場合があります。
 * また、データベース翻訳はバックグラウンドで少しずつ実行されるため完了までには
 * 時間が掛かります。
 *
 * 翻訳を適用するかどうかは任意のスイッチを指定して切り替えることができます。
 * 設定画面等で対象言語を切り替えたい場合に使用してください。
 *
 * 翻訳して欲しくない文章がある場合、先頭に「\NT」と記述すると翻訳対象から
 * 除外されます。
 *
 * ・RTK1_Option_EnJaとの連携
 * RTK1_Option_EnJaが有効になっている場合、用語の自動翻訳は行いません。
 * 同プラグインのswitchと自動翻訳プラグインの翻訳スイッチIDを同一にした上で
 * 翻訳スイッチ反転を有効にすることで自然な動作になります。
 *
 * 注意！
 * 総合開発支援プラグインを使用中で、データベース翻訳機能を使う場合は
 * 同プラグインのリロード機能を無効にしてください。
 * 翻訳したデータベースが翻訳前のデータで上書きされてしまいます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var $dataTransDic = null;

/**
 * TranslationManager
 * 翻訳を管理するstaticクラス
 * @constructor
 */
function TranslationManager() {
    throw new Error('This is a static class');
}

(function() {
    'use strict';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
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

    var param = createPluginParameter('AutoTranslation');
    if (!param.ToLanguage) {
        param.ToLanguage = ['en'];
    }

    var isExistPlugin = function(pluginName) {
        return Object.keys(PluginManager.parameters(pluginName)).length > 0;
    };

    //=============================================================================
    // Game_Interpreter
    //  文章の表示等の命令に翻訳を挟みます。
    //=============================================================================
    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        _Game_Interpreter_command101.apply(this, arguments);
        if (param.TranslateMessage) {
            $gameMessage.translateMessage();
        }
    };

    var _Game_Interpreter_setupChoices      = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
        _Game_Interpreter_setupChoices.apply(this, arguments);
        if (param.TranslateMessage) {
            $gameMessage.translateChoice();
        }
    };

    //=============================================================================
    // Game_System
    //  翻訳先言語によって言語情報を変更します。
    //=============================================================================
    var _Game_System_isJapanese      = Game_System.prototype.isJapanese;
    Game_System.prototype.isJapanese = function() {
        return this.isTranslateLocale(_Game_System_isJapanese, /^ja/);
    };

    var _Game_System_isChinese      = Game_System.prototype.isChinese;
    Game_System.prototype.isChinese = function() {
        return this.isTranslateLocale(_Game_System_isChinese, /^zh/);
    };

    var _Game_System_isKorean      = Game_System.prototype.isKorean;
    Game_System.prototype.isKorean = function() {
        return this.isTranslateLocale(_Game_System_isKorean, /^ko/);
    };

    var _Game_System_isCJK      = Game_System.prototype.isCJK;
    Game_System.prototype.isCJK = function() {
        return this.isTranslateLocale(_Game_System_isCJK, /^(ja|zh|ko)/);
    };

    var _Game_System_isRussian      = Game_System.prototype.isRussian;
    Game_System.prototype.isRussian = function() {
        return this.isTranslateLocale(_Game_System_isRussian, /^ru/);
    };

    Game_System.prototype.isTranslateLocale = function(originalMethod, ragExp) {
        if (TranslationManager.isValidTranslation()) {
            return this.getTranslateTo().match(ragExp);
        } else {
            return originalMethod.apply(this, arguments);
        }
    };

    Game_System.prototype.getTranslateTo = function() {
        var index = $gameVariables.value(param.LanguageVariableId);
        return param.ToLanguage[index] || param.ToLanguage[0];
    };

    //=============================================================================
    // Game_Message
    //  メッセージの翻訳処理を実行します。
    //=============================================================================
    Game_Message.prototype.translateMessage = function() {
        this._translateMessage = true;
        TranslationManager.getTranslatePromise(this.getTranslateMessage()).then(this.setTranslationMessage.bind(this));
    };

    Game_Message.prototype.translateChoice = function() {
        this._translateChoice = true;
        var promise = null;
        var translatedChoices = [];
        var originalChoice    = '';
        this._choices.forEach(function(choice) {
            if (!promise) {
                originalChoice = choice;
                promise        = TranslationManager.getTranslatePromise(choice);
            } else {
                promise = promise.then(function(translatedChoice) {
                    translatedChoices.push(translatedChoice || originalChoice);
                    originalChoice = choice;
                    return TranslationManager.getTranslatePromise(choice);
                });
            }
        }, this);
        promise.then(function(translatedChoice) {
            translatedChoices.push(translatedChoice || originalChoice);
            this._choices         = translatedChoices;
            this._translateChoice = false;
        }.bind(this));
    };

    Game_Message.prototype.setTranslationMessage = function(translatedText) {
        if (translatedText && TranslationManager.isValidTranslation()) {
            this._texts = [translatedText];
        }
        this._translateMessage = false;
    };

    Game_Message.prototype.getTranslateMessage = function() {
        return this._texts.join('');
    };

    Game_Message.prototype.isTranslating = function() {
        return this._translateMessage || this._translateChoice;
    };

    //=============================================================================
    // Game_Actor
    //  翻訳中の待機と自動改行を実装します。
    //=============================================================================
    if (param.TranslateDatabase) {
        var _Game_Actor_name      = Game_Actor.prototype.name;
        Game_Actor.prototype.name = function() {
            var name = _Game_Actor_name.apply(this, arguments);
            TranslationManager.translateIfNeed(name, function(translatedText) {
                name = translatedText || name;
            });
            return name;
        };

        var _Game_Actor_nickname      = Game_Actor.prototype.nickname;
        Game_Actor.prototype.nickname = function() {
            var nickName = _Game_Actor_nickname.apply(this, arguments);
            TranslationManager.translateIfNeed(nickName, function(translatedText) {
                nickName = translatedText || nickName;
            });
            return nickName;
        };

        var _Game_Actor_profile      = Game_Actor.prototype.profile;
        Game_Actor.prototype.profile = function() {
            var profile = _Game_Actor_profile.apply(this, arguments);
            TranslationManager.translateIfNeed(profile, function(translatedText) {
                profile = translatedText || profile;
            });
            return profile;
        };
    }

    //=============================================================================
    // Window_Message
    //  翻訳中の待機と自動改行を実装します。
    //=============================================================================
    var _Window_Message_updateLoading      = Window_Message.prototype.updateLoading;
    Window_Message.prototype.updateLoading = function() {
        return _Window_Message_updateLoading.apply(this, arguments) || $gameMessage.isTranslating();
    };

    var _Window_Message_processNormalCharacter      = Window_Base.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function(textState) {
        _Window_Message_processNormalCharacter.apply(this, arguments);
        if (TranslationManager.isValidTranslation()) {
            this.processAutoWordWrap(textState);
        }
    };

    Window_Message.prototype.processAutoWordWrap = function(textState) {
        var c         = textState.text[textState.index];
        var textNextX = textState.x + (c ? this.textWidth(c) : 0);
        if (textNextX > this.contents.width) {
            textState.index--;
            this.processNewLine(textState);
        }
    };

    //=============================================================================
    // TranslationManager
    //  翻訳の実行を管理します。
    //=============================================================================
    TranslationManager._accessTokenUrl   = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken';
    TranslationManager._translateUrlV3   = 'https://api.cognitive.microsofttranslator.com/translate';
    TranslationManager._subscriptionKey1 = param.SubscriptionKey || 'f78dab007fdb4ad4ad5baaaa01b74829';

    TranslationManager._translateProperties = {
        $dataClasses: ['name'],
        $dataSkills : ['name', 'description', 'message1', 'message2'],
        $dataItems  : ['name', 'description', 'message1', 'message2'],
        $dataWeapons: ['name', 'description'],
        $dataArmors : ['name', 'description'],
        $dataEnemies: ['name'],
        $dataStates : ['name', 'message1', 'message2', 'message3', 'message4'],
    };

    TranslationManager._translateTypeProperties = [
        'elements', 'equipTypes', 'skillTypes', 'weaponTypes', 'armorTypes'
    ];

    TranslationManager.initialize = function() {
        if (this.isMakingDictionary()) {
            this.addCloseListener();
        }
    };

    TranslationManager.makeTranslator = function() {
        this._databaseTranslator = this.translateAllDatabase();
        this._interval           = 0;
    };

    TranslationManager.clearTranslator = function() {
        this._databaseTranslator = null;
        this._interval           = -1;
    };

    TranslationManager.isExistTranslator = function() {
        return !!this._databaseTranslator;
    };

    TranslationManager.update = function() {
        if (this._interval === 0 && this._databaseTranslator && !this._translateError) {
            var result = this._databaseTranslator.next();
            if (result.done) {
                this._interval = -1;
            } else {
                this._interval = 30;
            }
        } else if (this._interval > 0) {
            this._interval--;
        }
    };

    // Generator Function
    TranslationManager.translateAllDatabase = function* () {
        var i, j, k;
        this._currentData = $dataSystem;
        if (!this.translateProperty('gameTitle')) {
            yield;
        }

        for (i = 0; i < this._translateTypeProperties.length; i++) {
            this._currentData = $dataSystem[this._translateTypeProperties[i]];
            for (j = 0; j < this._currentData.length; j++) {
                if (!this.translateProperty(j)) {
                    yield;
                }
            }
        }

        if (!isExistPlugin('RTK1_Option_EnJa')) {
            var termNames = Object.keys($dataSystem.terms);
            for (i = 0; i < termNames.length; i++) {
                this._currentData = $dataSystem.terms[termNames[i]];
                var isArray       = Array.isArray(this._currentData);
                var keyArray      = (isArray ? this._currentData : Object.keys(this._currentData));
                for (j = 0; j < keyArray.length; j++) {
                    if (!this.translateProperty(isArray ? j : keyArray[j])) {
                        yield;
                    }
                }
            }
        }

        var databaseNames = Object.keys(this._translateProperties);
        for (i = 0; i < databaseNames.length; i++) {
            var databaseName = databaseNames[i];
            for (j = 1; j < window[databaseName].length; j++) {
                this._currentData = window[databaseName][j];
                var properties    = this._translateProperties[databaseName];
                for (k = 0; k < properties.length; k++) {
                    if (!this.translateProperty(properties[k])) {
                        yield;
                    }
                }
            }
        }
    };

    TranslationManager.translateProperty = function(propertyName) {
        if (this._translating) return false;
        var targetText = this._currentData[propertyName + 'Original'] || this._currentData[propertyName];
        this._continue = true;
        this.translateIfNeed(targetText, this.setTranslatedData.bind(this, propertyName));
        return this._continue;
    };

    TranslationManager.setTranslatedData = function(propertyName, translatedText) {
        var originalProperty = propertyName + 'Original';
        if (!translatedText || this._currentData.hasOwnProperty(originalProperty)) return;
        this._currentData[originalProperty] = this._currentData[propertyName];
        Object.defineProperty(this._currentData, propertyName, {
            get: function() {
                if (TranslationManager.isValidTranslation()) {
                    if ($gameSystem) {
                        return TranslationManager.getDictionaryData(this[originalProperty]);
                    } else {
                        return translatedText;
                    }
                } else {
                    return this[originalProperty];
                }
            },

            configurable: true
        });
    };

    TranslationManager.translateIfNeed = function(targetText, callBack) {
        var dictionaryText = this.getDictionaryData(targetText);
        if (dictionaryText) {
            callBack(this.isValidTranslation() ? dictionaryText : targetText);
            return;
        }
        if (!targetText || !this.canCallApi()) {
            callBack(targetText || '');
            return;
        }
        if (TranslationManager.isInvalidText(targetText)) {
            callBack(targetText.replace(/^\\NT/i, ''));
            return;
        }
        this._translating = true;
        this.requestExecute(targetText).then(function(transResults) {
            var translatedText;
            transResults.forEach(function(transData) {
                var parsedText = this.parseTranslatedText(transData.text);
                this.addDictionaryData(targetText, parsedText, transData.to);
                if (this.findActiveLanguage() === transData.to) {
                    translatedText = parsedText;
                }
            }, this);
            this._translating = false;
            callBack(this.isValidTranslation() && translatedText ? translatedText : targetText);
        }.bind(this), function(error) {
            console.error('Failed to Request for ' + error);
            this._translateError = true;
            callBack(targetText);
        }.bind(this));
        this._continue = false;
    };

    TranslationManager.isInvalidText = function(targetText) {
        return targetText.match(/^\\NT/i);
    };

    TranslationManager.getTranslatePromise = function(targetText) {
        return new Promise(function(resolve) {
            this.translateIfNeed(targetText, resolve);
        }.bind(this));
    };

    TranslationManager.parseTranslatedText = function(translatedText) {
        translatedText = translatedText.replace(/%\s+(\d+)/gi, function() {
            return '%' + arguments[1] + ' ';
        }.bind(this));
        translatedText = translatedText.replace(/(\\\w+)\s+(\[.+?])/gi, function() {
            return arguments[1] + arguments[2];
        }.bind(this));
        translatedText = translatedText.replace(/(\\\w+)\s+(<.+?>)/gi, function() {
            return arguments[1] + arguments[2];
        }.bind(this));
        translatedText = translatedText.replace(/(\\)\s+(\W)/gi, function() {
            return arguments[1] + arguments[2];
        }.bind(this));
        return translatedText;
    };

    TranslationManager.addDictionaryData = function(targetText, translatedText, language) {
        // languageのデータがないことは想定していない
        $dataTransDic[language][targetText] = translatedText;
    };

    TranslationManager.getDictionaryData = function(targetText) {
        return $dataTransDic[this.findActiveLanguage()][targetText];
    };

    TranslationManager.findActiveLanguage = function() {
        return $gameSystem ? $gameSystem.getTranslateTo() : param.ToLanguage[0];
    };

    TranslationManager.requestExecute = function(text) {
        return this.requestAccessToken().then(this.requestTranslate.bind(this, text));
    };

    TranslationManager.requestAccessToken = function() {
        var client = new GameWebClient(this._accessTokenUrl, 'POST');
        client.addRequestHeader('Ocp-Apim-Subscription-Key', this._subscriptionKey1);
        return client.request();
    };

    TranslationManager.requestTranslate = function(text, accessToken) {
        var client = new GameWebClient(this._translateUrlV3, 'POST');
        client.setLogPolicy(param.OutLog);
        client.addQuery('api-version', '3.0');
        param.ToLanguage.forEach(function(language) {
            client.addQuery('to', language);
        });
        client.addParams({text: text});
        client.addRequestHeader('Authorization', `Bearer ${accessToken}`);
        client.addRequestHeader('Content-Type', 'application/json');
        return client.request().then(this.parseResponse.bind(this));
    };

    TranslationManager.parseResponse = function(resultJson) {
        var data = JSON.parse(resultJson);
        return data[0].translations;
    };

    TranslationManager.addCloseListener = function() {
        var nwWin = require('nw.gui').Window.get();
        nwWin.on('close', function() {
            try {
                DataManager.saveTranslateData();
            } finally {
                nwWin.close(true);
            }
        });
    };

    TranslationManager.isMakingDictionary = function() {
        return Utils.isNwjs() && Utils.isOptionValid('test');
    };

    TranslationManager.canCallApi = function() {
        return this.isMakingDictionary() || param.RealtimeTranslate;
    };

    TranslationManager.isValidTranslation = function() {
        if (!param.TranslationSwitchId || !$gameSwitches) {
            return true;
        }
        var result = ($gameSwitches ? $gameSwitches.value(param.TranslationSwitchId) : true);
        return param.InvertTranslationSwitch ? !result : result;
    };

    //=============================================================================
    // SceneManager
    //  TranslationManagerの初期化と更新を行います。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        _SceneManager_initialize.apply(this, arguments);
        TranslationManager.initialize();
    };

    var _SceneManager_updateManagers = SceneManager.updateManagers;
    SceneManager.updateManagers      = function() {
        _SceneManager_updateManagers.apply(this, arguments);
        if ($dataTransDic && param.TranslateDatabase) {
            TranslationManager.update();
        }
    };

    //=============================================================================
    // DataManager
    //  辞書データのロードとセーブを実装します。
    //=============================================================================
    DataManager._languageFileUrl = 'data/Translations_%1.json';

    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase      = function() {
        _DataManager_loadDatabase.apply(this, arguments);
        if (!$dataTransDic) {
            if (!$dataTransDic) {
                $dataTransDic = {};
            }
            this.loadTranslateData();
        }
        TranslationManager.clearTranslator();
    };

    DataManager.loadTranslateData = function() {
        param.ToLanguage.forEach(function(language) {
            var client = new GameWebClient(this._languageFileUrl.format(language), 'GET');
            client.request().then(this.onLoadLanguageData.bind(this, language),
                this.onErrorLanguageData.bind(this, language));
        }, this);
    };

    DataManager.onLoadLanguageData = function(language, data) {
        $dataTransDic[language] = JSON.parse(data);
    };

    DataManager.onErrorLanguageData = function(language) {
        console.log('Make Dictionary JSON file.');
        $dataTransDic[language] = {};
    };

    DataManager.saveTranslateData = function() {
        if (!$dataTransDic) return;
        param.ToLanguage.forEach(function(language) {
            StorageManager.saveTranslateFile(this._languageFileUrl.format(language),
                JSON.stringify($dataTransDic[language]));
        }, this);
    };

    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded      = function() {
        var result = _DataManager_isDatabaseLoaded.apply(this, arguments) && !!$dataTransDic;
        if (result && !TranslationManager.isExistTranslator()) {
            TranslationManager.makeTranslator();
            if (TranslationManager.isMakingDictionary()) {
                this.checkCanSaveDictionary();
            }
        }
        return result;
    };

    DataManager.checkCanSaveDictionary = function() {
        try {
            this.saveTranslateData();
        } catch (e) {
            throw new Error('Failed To Save Dictionary file. 辞書ファイルを開いている可能性があります。');
        }
    };

    var _DataManager_loadMapData = DataManager.loadMapData;
    DataManager.loadMapData      = function(mapId) {
        _DataManager_loadMapData.apply(this, arguments);
        this._mapNameLoadingStatus = 1;
    };

    var _DataManager_isMapLoaded = DataManager.isMapLoaded;
    DataManager.isMapLoaded      = function() {
        var loaded = _DataManager_isMapLoaded.apply(this, arguments);
        if (!$gameSystem) {
            return loaded;
        }
        if (loaded && this._mapNameLoadingStatus === 1) {
            this._mapNameLoadingStatus = 2;
            TranslationManager.getTranslatePromise($dataMap.displayName).then(this.onTranslateDisplayName.bind(this));
        }
        return loaded && this._mapNameLoadingStatus === 3;
    };

    DataManager.onTranslateDisplayName = function(translatedDisplayName) {
        $dataMap.displayName       = translatedDisplayName;
        this._mapNameLoadingStatus = 3;
    };

    //=============================================================================
    // StorageManager
    //  辞書データをファイルにして保存します。
    //=============================================================================
    StorageManager.saveTranslateFile = function(filePath, json) {
        var fs   = require('fs');
        var path = require('path');
        var base = path.dirname(process.mainModule.filename);
        fs.writeFileSync(path.join(base, filePath), json);
    };

    //=============================================================================
    // Game_WebClient
    //  WebAPIに対してリクエストを投げる基底クラスです。
    //=============================================================================
    class GameWebClient {
        constructor(url, method) {
            this._xmlHttpRequest = new XMLHttpRequest();
            this._xmlHttpRequest.addEventListener('readystatechange', this.onReadyStateChange.bind(this));
            this._originalUrl    = url;
            this._requestHeaders = {};
            this._queryParams    = [];
            this._bodyParams     = [];
            this._bodyParamText  = '';
            this._method         = method === 'POST' ? 'POST' : 'GET';
            this.setLogPolicy('OFF');
            this.setResponseType('text');
            this.setTimeout(20000);
        }

        setTimeout(timeout) {
            this._timeout = timeout;
        }

        setResponseType(type) {
            this._responseType = type;
        }

        setLogPolicy(policy) {
            this._logPolicy = policy;
        }

        getFullUrl() {
            var queryText = this.createQueryText();
            return this._originalUrl + (queryText.length > 0 ? '?' + queryText : '');
        }

        request() {
            var xhr = this._xmlHttpRequest;
            xhr.open(this._method, this.getFullUrl());
            this.setRequestHeaders();
            xhr.responseType    = this._responseType;
            xhr.timeout         = this._timeout;
            this._bodyParamText = JSON.stringify(this._bodyParams);
            xhr.send(this._bodyParamText);
            return this.getPromise();
        }

        getPromise() {
            return new Promise(function(resolve, reject) {
                this._xmlHttpRequest.addEventListener('load', this.onLoad.bind(this, resolve, reject));
                this._xmlHttpRequest.addEventListener('error', this.onError.bind(this, reject));
            }.bind(this));
        }

        addRequestHeader(name, value) {
            this._requestHeaders[name] = value;
        }

        addQuery(name, value) {
            this._queryParams.push({name: name, value: value});
        }

        addParams(value) {
            this._bodyParams.push(value);
        }

        createQueryText() {
            var paramArray = this._queryParams.map(function(paramHash) {
                return encodeURIComponent(paramHash.name) + '=' + encodeURIComponent(paramHash.value);
            });
            return paramArray.join('&');
        }

        setRequestHeaders() {
            var keys = Object.keys(this._requestHeaders);
            if (keys && keys.length > 0) {
                keys.forEach(function(paramName) {
                    this._xmlHttpRequest.setRequestHeader(paramName, this._requestHeaders[paramName]);
                }, this);
            }
        }

        onReadyStateChange() {
            var xhr = this._xmlHttpRequest;
            this.outputDebugLog(`${xhr.readyState} : ${this.getReadyStateMessage()}`);
            if (xhr.readyState < 4) return;
            if (this.isStatusOk()) {
                this.outputDebugLog(this.getResponse());
            } else {
                this.outputErrorLog(this.getResponse());
            }
        }

        onLoad(resolve, reject) {
            if (this.isStatusOk()) {
                resolve(this.getResponse());
            } else {
                reject(this.getResponse());
            }
        }

        onError(reject) {
            reject(this.getResponse());
        }

        getReadyStateMessage() {
            var xhr   = this._xmlHttpRequest;
            var value = '';
            switch (xhr.readyState) {
                case 0:
                    value = 'Before Open';
                    break;
                case 1:
                    value = 'Before Send [URL]' + this.getFullUrl();
                    break;
                case 2:
                    value = 'After Send [Parameter]' + this._bodyParamText;
                    break;
                case 3:
                    value = 'Processing...';
                    break;
                case 4:
                    value = (this.isStatusOk() ? 'Success' : 'Failure') + '[Code]' + xhr.status;
                    break;
            }
            return value;
        }

        getResponse() {
            var xhr = this._xmlHttpRequest;
            switch (this._responseType) {
                case '':
                case 'text':
                    return xhr.responseText;
                case 'xml':
                    return xhr.responseXML;
                default:
                    return xhr.response;
            }
        }

        isStatusOk() {
            return this._xmlHttpRequest.status < 400;
        }

        showDevToolsIfNeed() {
            var nwWin = nw.Window.get();
            nwWin.showDevTools();
        }

        outputDebugLog(value) {
            if (this.isNeedDebugLog()) {
                console.log(value);
            }
        }

        outputErrorLog(value) {
            if (this.isNeedDebugLog()) {
                this.showDevToolsIfNeed();
            }
            console.warn(value);
        }

        isNeedDebugLog() {
            switch (this._logPolicy) {
                case 'ON':
                    return true;
                case 'TEST':
                    return Utils.isOptionValid('test');
                default :
                    return false;
            }
        }
    }
})();

