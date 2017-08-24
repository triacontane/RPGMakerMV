//=============================================================================
// AutoTranslation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2017/08/24 ヘルプの誤字を修正＋型指定機能に対応
// 1.1.1 2017/04/22 制御文字の精度をほんの少し改善
// 1.1.0 2017/04/19 制御文字の翻訳に部分的に対応。翻訳対象から除外する制御文字を追加
//                  サブスクリプションキーを指定できる機能を追加
// 1.0.0 2017/04/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AutoTranslationPlugin
 * @author triacontane
 *
 * @param FromLanguage
 * @desc It is a language code that the original translation.
 * @default en
 *
 * @param ToLanguage
 * @desc This is the translation target language code.
 * @default ja
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
 * @param TranslationSwitchId
 * @desc Is the switch ID translation is enabled. Specify 0 to unconditionally valid in translation.
 * @default 0
 * @type switch
 *
 * @param Category
 * @desc Specifies the category of translation at run time.
 * （Normal：general, NeuralNetwork：generalnn）
 * @default general
 * @type select
 * @option general
 * @option generalnn
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
 * https://azure.microsoft.com/en-us/services/cognitive-services/
 *
 * For the language code, please refer to the following.
 * https://msdn.microsoft.com/en-us/library/hh456380.aspx
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
 * @param 翻訳元言語
 * @desc 翻訳元になる言語コードです。
 * @default ja
 *
 * @param 翻訳先言語
 * @desc 翻訳先になる言語コードです。
 * @default en
 *
 * @param データベース翻訳
 * @desc データベースの各要素を翻訳します。翻訳処理はバックグラウンドで少しずつ行われます。
 * @default false
 * @type boolean
 *
 * @param メッセージ翻訳
 * @desc メッセージ表示と選択肢表示の内容を翻訳します。
 * @default true
 * @type boolean
 *
 * @param 翻訳スイッチID
 * @desc 翻訳が有効になるスイッチIDです。0を指定すると無条件で翻訳が有効になります。
 * @default 0
 * @type switch
 *
 * @param カテゴリ
 * @desc 翻訳実行時のカテゴリを指定します。
 * （通常：general ニューラルネットワーク：generalnn）
 * @default general
 * @type select
 * @option general
 * @option generalnn
 *
 * @param サブスクリプションキー
 * @desc Microsoft Azureのサブスクリプションキーです。未指定の場合、こちらで用意した共用環境を使用します。
 * @default
 *
 * @param ログ出力
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
 * 翻訳は「Microsoft Azure」の「Translator Text API」(Web API)を使用しています。
 * https://azure.microsoft.com/ja-jp/services/cognitive-services/
 *
 * 言語コードについては、以下を参照してください。
 * https://msdn.microsoft.com/en-us/library/hh456380.aspx
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
 * 翻訳結果は「Translations_（翻訳先言語コード）.json」というファイルに蓄積され
 * 同一の文章が要求された場合は、ファイルに保存されている内容を返します。
 * JSONファイルは、翻訳前の文章をキー、翻訳後の文章を値とする簡単な構成のため
 * 以下のようなJSONエディタ等で簡単に編集できます。（編集は自己責任です）
 * 誤訳を調整したり、特定の単語を翻訳しないようにすることもできます。
 *
 * http://jsoneditoronline.org/
 *
 * 翻訳データの作成はテストプレー中にのみ行われ、リリース後はJSONファイルのみを
 * 参照するので、オフラインゲームでも使用可能です。
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
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var $dataTransDic = null;

function TranslationManager() {
    throw new Error('This is a static class');
}

(function() {
    'use strict';
    var pluginName = 'AutoTranslation';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                 = {};
    param.toLanguage          = getParamString(['ToLanguage', '翻訳先言語']);
    param.fromLanguage        = getParamString(['FromLanguage', '翻訳元言語']);
    param.outLog              = getParamString(['OutLog', 'ログ出力']).toUpperCase();
    param.translationSwitchId = getParamNumber(['TranslationSwitchId', '翻訳スイッチID'], 0);
    param.translateDatabase   = getParamBoolean(['TranslateDatabase', 'データベース翻訳']);
    param.translateMessage    = getParamBoolean(['TranslateMessage', 'メッセージ翻訳']);
    param.category            = getParamString(['Category', 'カテゴリ']);
    param.subscriptionKey     = getParamString(['SubscriptionKey', 'サブスクリプションキー']);

    //=============================================================================
    // Game_Interpreter
    //  文章の表示等の命令に翻訳を挟みます。
    //=============================================================================
    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        _Game_Interpreter_command101.apply(this, arguments);
        if (param.translateMessage) {
            $gameMessage.translateMessage();
        }
    };

    var _Game_Interpreter_setupChoices      = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
        _Game_Interpreter_setupChoices.apply(this, arguments);
        if (param.translateMessage) {
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
            return param.toLanguage.match(ragExp);
        } else {
            return originalMethod.apply(this, arguments);
        }
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
        var promise;
        var translatedChoices = [];
        var originalChoice    = "";
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
            this._choices = translatedChoices;
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
    if (param.translateDatabase) {
        var _Game_Actor_name = Game_Actor.prototype.name;
        Game_Actor.prototype.name = function() {
            var name = _Game_Actor_name.apply(this, arguments);
            TranslationManager.translateIfNeed(name, function(translatedText) {
                name = translatedText || name;
            });
            return name;
        };

        var _Game_Actor_nickname = Game_Actor.prototype.nickname;
        Game_Actor.prototype.nickname = function() {
            var nickName = _Game_Actor_nickname.apply(this, arguments);
            TranslationManager.translateIfNeed(nickName, function(translatedText) {
                nickName = translatedText || nickName;
            });
            return nickName;
        };

        var _Game_Actor_profile = Game_Actor.prototype.profile;
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
    TranslationManager._translateUrl     = 'https://api.microsofttranslator.com/V2/Http.svc/Translate';
    TranslationManager._subscriptionKey1 = param.subscriptionKey || 'f78dab007fdb4ad4ad5baaaa01b74829';

    TranslationManager._translateProperties = {
        $dataActors : ['name', 'nickname', 'profile'],
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
    TranslationManager.translateAllDatabase = function*() {
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

        var databaseNames = Object.keys(this._translateProperties);
        for (i = 0; i < databaseNames.length; i++) {
            var databaseName = databaseNames[i];
            for (j = 1; j < window[databaseName].length; j++) {
                this._currentData = window[databaseName][j];
                var properties = this._translateProperties[databaseName];
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
            get         : function() {
                if (TranslationManager.isValidTranslation()) {
                    return translatedText;
                } else {
                    return this[originalProperty];
                }
            },
            configurable: false
        });
    };

    TranslationManager.translateIfNeed = function(targetText, callBack) {
        var dictionaryText = $dataTransDic[targetText];
        if (dictionaryText) {
            callBack(this.isValidTranslation() ? dictionaryText : targetText);
            return;
        }
        if (!targetText || !this.isMakingDictionary()) {
            callBack(targetText || '');
            return;
        }
        if (TranslationManager.isInvalidText(targetText)) {
            callBack(targetText.replace(/^\\NT/i, ''));
            return;
        }
        this._translating = true;
        this.requestExecute(targetText).then(function(translatedText) {
            translatedText = this.parseTranslatedText(translatedText);
            this.addDictionary(targetText, translatedText);
            this._translating = false;
            callBack(this.isValidTranslation() ? translatedText : targetText);
        }.bind(this), function(error) {
            console.error('Failed to Request for ' + error);
            this._translateError = true;
            callBack(targetText);
        }.bind(this));
        this._continue = false;
    };

    TranslationManager.isInvalidText = function(targetText) {
        return targetText.match(/^\\NT/i)
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
        translatedText = translatedText.replace(/(\\\w+)\s+(\[.+?\])/gi, function() {
            return arguments[1] + arguments[2];
        }.bind(this));
        translatedText = translatedText.replace(/(\\\w+)\s+(\<.+?\>)/gi, function() {
            return arguments[1] + arguments[2];
        }.bind(this));
        translatedText = translatedText.replace(/(\\)\s+(\W)/gi, function() {
            return arguments[1] + arguments[2];
        }.bind(this));
        return translatedText;
    };

    TranslationManager.addDictionary = function(targetText, translatedText) {
        $dataTransDic[targetText] = translatedText;
    };

    TranslationManager.requestExecute = function(text) {
        return this.requestAccessToken().then(this.requestTranslate.bind(this, text));
    };

    TranslationManager.requestAccessToken = function() {
        var client = new Game_PostWebClient(this._accessTokenUrl);
        client.addRequestHeader('Ocp-Apim-Subscription-Key', this._subscriptionKey1);
        return client.request();
    };

    TranslationManager.requestTranslate = function(text, accessToken) {
        var client = new Game_GetWebClient(this._translateUrl);
        client.setLogPolicy(param.outLog);
        client.addQuery('appid', `Bearer ${accessToken}`);
        client.addQuery('text', text);
        client.addQuery('from', param.fromLanguage);
        client.addQuery('to', param.toLanguage);
        client.addQuery('category', param.category || 'general');
        return client.request().then(this.parseResponse.bind(this));
    };

    TranslationManager.parseResponse = function(resultXml) {
        var parser = new DOMParser();
        var dom    = parser.parseFromString(resultXml, 'text/xml');
        return dom.getElementsByTagName('string').item(0).textContent;
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

    TranslationManager.isValidTranslation = function() {
        return param.translationSwitchId && $gameSwitches ? $gameSwitches.value(param.translationSwitchId) : true;
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
        if ($dataTransDic && param.translateDatabase) {
            TranslationManager.update();
        }
    };

    //=============================================================================
    // DataManager
    //  辞書データのロードとセーブを実装します。
    //=============================================================================
    DataManager._languageFileUrl = `data/Translations_${param.toLanguage}.json`;

    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase      = function() {
        _DataManager_loadDatabase.apply(this, arguments);
        if (!$dataTransDic) {
            this.loadTranslateData();
        }
        TranslationManager.clearTranslator();
    };

    DataManager.loadTranslateData = function() {
        var client = new Game_GetWebClient(this._languageFileUrl);
        client.request().then(this.onLoadLanguageData, this.onErrorLanguageData);
    };

    DataManager.onLoadLanguageData = function(data) {
        $dataTransDic = JSON.parse(data);
    };

    DataManager.onErrorLanguageData = function() {
        console.log('Make Dictionary JSON file.');
        $dataTransDic = {};
    };

    DataManager.saveTranslateData = function() {
        if (!$dataTransDic) return;
        StorageManager.saveTranslateFile(this._languageFileUrl, JSON.stringify($dataTransDic));
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
        if (loaded && this._mapNameLoadingStatus === 1) {
            this._mapNameLoadingStatus = 2;
            TranslationManager.getTranslatePromise($dataMap.displayName).then(this.onTranslateDisplayName.bind(this));
        }
        return loaded && this._mapNameLoadingStatus === 3;
    };

    DataManager.onTranslateDisplayName = function(translatedDisplayName) {
        $dataMap.displayName = translatedDisplayName;
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
    // Game_BaseWebClient
    //  WebAPIに対してリクエストを投げる基底クラスです。
    //=============================================================================
    class Game_BaseWebClient {
        constructor(url) {
            this._xmlHttpRequest = new XMLHttpRequest();
            this._xmlHttpRequest.addEventListener('readystatechange', this.onReadyStateChange.bind(this));
            this._originalUrl    = url;
            this._requestHeaders = {};
            this._queryParams    = {};
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
            return this._originalUrl;
        }

        getRequestMethodName() {
            return '';
        }

        getSendQuery() {
            return undefined;
        }

        request() {
            var xhr = this._xmlHttpRequest;
            xhr.open(this.getRequestMethodName(), this.getFullUrl());
            this.setRequestHeaders();
            xhr.responseType = this._responseType;
            xhr.timeout      = this._timeout;
            xhr.send(this.getSendQuery());
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
            this._queryParams[name] = value;
        }

        getQueryText() {
            var paramArray = [];
            var keys       = Object.keys(this._queryParams);
            if (keys && keys.length > 0) {
                keys.forEach(function(paramName) {
                    paramArray.push(encodeURIComponent(paramName) + '=' + encodeURIComponent(this._queryParams[paramName]));
                }, this);
            }
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
                    value = 'After Send [Parameter]' + (this.getSendQuery() || '');
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
            var nwWin = require('nw.gui').Window.get();
            if (!nwWin.isDevToolsOpen()) {
                var devTool = nwWin.showDevTools();
                devTool.moveTo(0, 0);
                devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                nwWin.focus();
            }
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

    //=============================================================================
    // Game_GetWebClient
    //  WebAPIに対してGETリクエストを投げるクラスです。
    //=============================================================================
    class Game_GetWebClient extends Game_BaseWebClient {
        getRequestMethodName() {
            return 'GET';
        }

        getFullUrl() {
            var queryText = this.getQueryText();
            return super.getFullUrl() + (queryText.length > 0 ? '?' + queryText : '');
        }
    }

    //=============================================================================
    // Game_PostWebClient
    //  WebAPIに対してPOSTリクエストを投げるクラスです。
    //=============================================================================
    class Game_PostWebClient extends Game_BaseWebClient {
        getRequestMethodName() {
            return 'POST';
        }

        getSendQuery() {
            return this.getQueryText();
        }
    }
})();

