/*:
 * @plugindesc PluginCommonBase利用サンプル
 * @target MZ
 * @base PluginCommonBase
 *
 * @param paramName
 * @text パラメータ名称
 * @desc パラメータの説明
 * @default test
 *
 * @command COMMAND_SAMPLE
 * @text コマンド名称
 * @desc コマンドの説明
 *
 * @arg argName
 * @text 引数名称
 * @desc 引数説明
 * @default
 * @type number
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    console.log(param.paramName);

    PluginManagerEx.registerCommand(script, 'COMMAND_SAMPLE', args => {
        console.log(args.argName);
    });
})();

