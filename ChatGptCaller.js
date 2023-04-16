/*=============================================================================
 ChatGptCaller.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/04/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ChatGPT呼び出しプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChatGptCaller.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param apiKey
 * @text APIキー
 * @desc ChatGPTのAPIキーを入力してください。
 * @default
 *
 * @param organizationId
 * @text 組織ID
 * @desc 必要に応じてChatGPTの組織IDを入力してください。
 * @default
 *
 * @param responseTrigger
 * @text 回答受信トリガー
 * @desc 回答を受信したときにONになるスイッチIDを指定してください。
 * @default 0
 * @type switch
 *
 * @param responseSelfTrigger
 * @text 回答受信セルフトリガー
 * @desc 回答を受信したときにONになるセルフスイッチを指定してください。指定が無い場合、プラグインパラメータの設定が使用されます。
 * @default
 * @type select
 * @option none
 * @value
 * @option A
 * @value A
 * @option B
 * @value B
 * @option C
 * @value C
 * @option D
 * @value D
 *
 * @param model
 * @text モデル
 * @desc ChatGPTのモデルを指定してください。
 * @default gpt-3.5-turbo
 *
 * @param requestTemplate
 * @text リクエストテンプレート
 * @desc 武器や敵キャラの追加リクエストのテンプレートです。基本的には編集不要です。
 * @default %1ような%2を1つ考えてください。結果はRPGツクールMZのデータベースのjson形式で返してください。
 * @type multiline_string
 *
 * @command CALL_GPT_QUESTION
 * @text 質問呼び出し
 * @desc ChatGPTに質問をして結果をファイルに蓄積します。
 *
 * @arg questionId
 * @text 質問ID
 * @desc 質問ごとに一意になる任意の識別子です。このIDをキーにして回答データが保存されます。
 * @default 1
 *
 * @arg questionText
 * @text 質問文
 * @desc 質問文を指定してください。
 * @default
 * @type multiline_string
 *
 * @arg responseTrigger
 * @text 回答受信トリガー
 * @desc 回答を受信したときにONになるスイッチIDを指定してください。指定が無い場合、プラグインパラメータの設定が使用されます。
 * @default 0
 * @type switch
 *
 * @arg responseSelfTrigger
 * @text 回答受信セルフトリガー
 * @desc 回答を受信したときにONになるセルフスイッチを指定してください。指定が無い場合、プラグインパラメータの設定が使用されます。
 * @default
 * @type select
 * @option none
 * @value
 * @option A
 * @value A
 * @option B
 * @value B
 * @option C
 * @value C
 * @option D
 * @value D
 *
 * @arg temperature
 * @text サンプリング温度
 * @desc サンプリング温度を指定してください。0～200の範囲で指定してください。高い値ほど回答文のランダム性が増します。
 * @default 70
 * @type number
 * @max 200
 *
 * @arg wait
 * @text 完了まで待機
 * @desc APIの結果が返ってくるまでイベントの実行を待機します。
 * @default false
 * @type boolean
 *
 * @help ChatGptCaller.js
 *
 * ChatGPTを呼び出して質問文を送信します。
 * 質問は非同期で実行され、結果が返ってきたときに指定スイッチがONになります。
 *
 * 回答はファイル[save/gptAnswer.rmmzsave]に蓄積されゲーム終了後も残ります。
 * 制御文字 \ans[id] あるいは以下のスクリプトで回答を取得できます。
 * $gameTemp.findGptAnswer(id);
 *
 * APIキーをパラメータから入力するので、ゲームを公開する場合はご注意ください。
 * APIの呼び出しは原則制作時にのみ行い、公開後はファイル保存された回答を
 * 使用することを想定しています。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CALL_GPT_QUESTION', function(args) {
        const responseTrigger = args.responseTrigger || param.responseTrigger;
        const responseSelfTrigger = args.responseSelfTrigger || param.responseSelfTrigger;
        this.callQuestion(args.questionId, args.questionText, responseTrigger, responseSelfTrigger, args.temperature);
        if (args.wait) {
            this.setWaitMode('gpt');
        }
    });

    const _Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;
    Game_Interpreter.prototype.initialize = function(depth) {
        _Game_Interpreter_initialize.call(this, depth);
        this._requestCount = 0;
    };

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'gpt') {
            return this._requestCount > 0;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    }

    Game_Interpreter.prototype.callQuestion = function(questionId, questionText, responseTrigger, responseSelfTrigger, temperature) {
        const mapId = this._mapId;
        const eventId = this._eventId;
        this.callGpt(questionText, temperature, content => {
            gptAnswerData.setAnswer(questionId, content);
            if (responseTrigger) {
                $gameSwitches.setValue(responseTrigger, true);
            }
            if (responseSelfTrigger) {
                const key = [mapId, eventId, responseSelfTrigger];
                $gameSelfSwitches.setValue(key, true);
            }
        });
        $gameSwitches.setValue(responseTrigger, false);
    };

    Game_Interpreter.prototype.callGpt = function(message, temperature, callBack) {
        if (!param.apiKey) {
            return;
        }
        this._requestCount++;
        const client = new OpenAiClient('chat/completions', 'POST');
        client.setQuestion(message, temperature);
        client.request().then(response => {
            const json = JSON.parse(response);
            callBack(json.choices[0].message.content);
            this._requestCount--;
        }).catch(error => {
            PluginManagerEx.throwError(error, script);
        });
    };

    class GptAnswerData {
        constructor() {
            this.initialize.apply(this, arguments);
        }

        initialize() {
            this._fileName = 'gptAnswer';
            this._answerList = {};
            this._loaded = false;
        }

        load() {
            StorageManager.loadObject(this._fileName).then(info => {
                this._answerList = info.answerList || {};
                this._loaded = true;
            }).catch(() => {
                this._loaded = true;
            });
        }

        save() {
            StorageManager.saveObject(this._fileName, {
                answerList: this._answerList
            });
        }

        getAnswer(question) {
            return this._answerList[question];
        }

        setAnswer(question, answer) {
            this._answerList[question] = answer;
            this.save();
        }

        isLoaded() {
            return this._loaded;
        }
    }
    const gptAnswerData = new GptAnswerData();
    gptAnswerData.load();

    const _Scene_Boot_isReady    = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return _Scene_Boot_isReady.apply(this, arguments) && gptAnswerData.isLoaded();
    };

    Game_Temp.prototype.findGptAnswer = function(questionId) {
        return gptAnswerData.getAnswer(questionId) || '';
    }

    const _PluginManagerEx_convertEscapeCharactersEx = PluginManagerEx.convertEscapeCharactersEx;
    PluginManagerEx.convertEscapeCharactersEx        = function(text) {
        text = _PluginManagerEx_convertEscapeCharactersEx.apply(this, arguments);
        text = text.replace(/\x1bANS\[(.+?)]/gi, (_, p1) =>
            $gameTemp ? $gameTemp.findGptAnswer(p1) : ''
        );
        return text;
    };

    class OpenAiClient {
        constructor(endPoint, method) {
            this._xmlHttpRequest = new XMLHttpRequest();
            this._originalUrl    = 'https://api.openai.com/v1/' + endPoint;
            this._requestHeaders = {};
            this._queryParams    = [];
            this._bodyParams     = {};
            this._method         = method === 'POST' ? 'POST' : 'GET';
            this.createOpenAiHeader();
        }

        createOpenAiHeader() {
            this.addRequestHeader('Authorization', `Bearer ${param.apiKey}`);
            if (param.organizationId) {
                this.addRequestHeader('OpenAI-Organization', param.organizationId);
            }
            this.addRequestHeader('Content-Type', 'application/json');
        }

        getFullUrl() {
            const queryText = this.createQueryText();
            return this._originalUrl + (queryText.length > 0 ? '?' + queryText : '');
        }

        setQuestion(questionText, temperature) {
            this.setBodyParam({
                "model": param.model,
                "messages": [{"role": "user", "content": questionText}],
                "temperature": temperature / 100
            })
        }

        request() {
            const xhr = this._xmlHttpRequest;
            xhr.open(this._method, this.getFullUrl());
            this.setRequestHeaders();
            xhr.send(JSON.stringify(this._bodyParams));
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

        setBodyParam(paramObject) {
            this._bodyParams = paramObject;
        }

        createQueryText() {
            const paramArray = this._queryParams.map(function(paramHash) {
                return encodeURIComponent(paramHash.name) + '=' + encodeURIComponent(paramHash.value);
            });
            return paramArray.join('&');
        }

        setRequestHeaders() {
            const keys = Object.keys(this._requestHeaders);
            if (keys && keys.length > 0) {
                keys.forEach(function(paramName) {
                    this._xmlHttpRequest.setRequestHeader(paramName, this._requestHeaders[paramName]);
                }, this);
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

        getResponse() {
            return this._xmlHttpRequest.responseText;
        }

        isStatusOk() {
            return this._xmlHttpRequest.status < 400;
        }
    }
})();
