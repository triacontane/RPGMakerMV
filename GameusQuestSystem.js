// 1.0.1 2017/05/04 一部の用語が機能していなかった問題を修正 by triacontane
// Original：https://forums.rpgmakerweb.com/index.php?threads/gameus-quest-system.49234/
//=============================================================================
// Gameus Quest System
// Author gameus
// Version 1.1
//-----------------------------------------------------------------------------
// Intro:
// This is a (for the most part) basic quest system. Has a basic layout to help
// players keep track of all the different quests they might encounter. Also
// gives you plenty of commands and script calls to keep track of said quests
// behind the scenes. 
//
// Features:
// Simple UI to keep track of quests with some customization options 
// Friendly commands to track/complete/fail/reset/count/progress quests
// Auto rewards upon quest completion (optional)
// Quest categories (optional)
// Full blown quest editor included
// 
// 
// Instructions:
// Place in your plugins folder and save as 'GameusQuestSystem.js'
// Configure the options as you please.
//
// I highly recommend checking out the demo (includes Quest Editor)
//  http://jugglingcode.com/scripts/MV/QuestSystem/Demo.zip
//
// Credits:
// gameus ~ For creating it.
//=============================================================================

/*:
 * @plugindesc v1.0 - A simplistic quest system with various customization options.
 * @author gameus
 *
 * @param Auto Rewards
 * @desc True or False. Tells the script whether or not to automatically give quest rewards upon completion.
 * @default true
 *
 * @param ---------------
 *
 * @param Words
 *
 * @param ---------------
 *
 * @param Hidden Reward Text
 * @desc The text used to hide rewards
 * @default ??????
 *
 * @param No Quests Text
 * @desc The text used for "No Quests"
 * @default No Quests
 *
 * @param All Word
 * @desc Word for "All"
 * @default All
 * 
 * @param Completed Word
 * @desc Word for "Completed"
 * @default Completed
 *
 * @param Failed Word
 * @desc Word for "Failed"
 * @default Failed
 * 
 * @param In-Progress Word
 * @desc Word for "In-Progress"
 * @default In-Progress
 *
 * @param Steps Word
 * @desc Word for "Steps"
 * @default Steps
 *
 * @param Rewards Word
 * @desc Word for "Rewards"
 * @default Rewards
 *
 * @param ---------------
 *
 * @param Display Options
 *
 * @param ---------------
 *
 * @param Reverse Layout
 * @desc Reverses the quest log layout
 * @default false
 *
 * @param Filter Position
 * @desc Positions the filter window. Can use Top or Bottom 
 * @default Top
 *
 * @param Use Categories
 * @desc Use customizable sub-categories e.g. "Story", "Crafting", "Gathering" quests.
 * @default true
 *
 * @param Show Empty Categories
 * @desc 0 - Don't show; 1 - Show but greyed out; 2 - Show, but with "No Quests" under it
 * @default 0
 *
 * @param Show Quest Count
 * @desc This shows the quest count for each category.
 * @default true
 *
 * @param Bullet Character
 * @desc The character used to display each step and reward
 * @default -
 *
 * @param Max Steps
 * @desc Defines the number of steps to show at once under a quest info. Will only show steps you've completed or are already on.
 * @default 3
 *
 * @param ---------------
 *
 * @param Image Options
 *
 * @param ---------------
 * 
 * @param Use Icons
 * @desc Option to allow quest icons
 * @default true
 *
 * @param Completed Image 
 * @desc Image that's drawn over a quest when it's completed. Leave blank for no image
 *
 * @param Completed Image Opacity
 * @desc The opacity for the above image
 * @default 128
 *
 * @param Failed Image 
 * @desc Image that's drawn over a quest if it's marked as failed. Leave blank for no image
 *
 * @param Failed Image Opacity
 * @desc The opacity for the above image
 * @default 128
 *
 * @help 
 * Report any bugs, editor or plugin related here:
 *   http://forums.rpgmakerweb.com/index.php?/topic/49234-gameus-quest-system/
 * Before reporting a bug, check the version of editor/plugin to see if you're using an outdated version
 *
 * I highly recommend checking out the demo found here:
 *   http://jugglingcode.com/scripts/MV/QuestSystem/Demo.zip
 * ----------------------------------------------------
 * These are a list of following Plugin Commands:
 * ----------------------------------------------------
 * Quest Add QuestID
 *   Activates a quest.
 *
 * Quest NextStep QuestID
 *   Progresses the quest to the next step.
 *
 * Quest BackStep QuestID
 *   Makes the quest go back a step, allowing for steps to be failed.
 *
 * Quest Complete QuestID
 *   Completes the quest, if Auto Reward is on, the script will give out the rewards.
 *
 * Quest Fail QuestID
 *   Fails the quest.
 *
 * Quest Remove QuestID
 *   Removes the quest from the quest log, allowing it to be reset.
 *
 * Quest Reset QuestID
 *   Resets the step and status of a quest. NOTE: Any switches/variables you might have set during a quest, WILL have to be reset manually.
 *
 * Quest Open
 *   This opens up the quest log. Alternatively, there's a script call you can use below.
 *
 * ----------------------------------------------------
 * Here's a list of script calls you can use in a conditional branch:
 * ----------------------------------------------------
 * SceneManager.push(Scene_Quest)
 *   This opens up the quest scene, for those who enjoy script calls or are using it in a different plugin 
 *
 * $gameQuests.get(quest_id).completed()
 * $gameQuests.get(quest_id).failed()
 * $gameQuests.get(quest_id).inProgress()
 *   These calls are used to check the progress of a quest
 *   Note, even if the party does not have the quest yet, these will return true/false.
 *
 * $gameParty.hasQuest(quest_id)
 *   This is how you check if the party has activated the quest yet. Use in conjunction with the above script calls
 *
 * $gameParty.hasQuests([quest ids], filter)
 *   Not to be confused with the one above, this checks multiple quests the party has and see if they match the filter.
 *   Filter can be "progress", "completed", or "failed"
 *   Returns true if all the input quests match the filter AND the party has them active. e.g. Can be used to see if the party has completed a range of quests before moving on
 *
 * $gameQuests.get(quest_id).currentStep === step_number
 *   This is how you check which step a quest is on. step_number starts from 0. NOTE: This will still return a number even if the quest hasn't been activated.
 *
 * $gameQuests.get(quest_id).status === "status"
 *   This will return what status the quest is. "status" can be "progress", "completed", or "failed"
 *  
 * $gameQuests.totalQuests(filter)
 *   This gets you a total number of quests by the filter. Filter can be "all", "progress", "completed", or "failed". This applies to all quests.
 *
 * $gameParty.totalQuests(filter)
 *   Does the same as above, but only applies to the quests that the party has.
 *
 */
 
 // Import 'Quest System' 
var GameusScripts = GameusScripts || {};
GameusScripts["Config"] = GameusScripts["Config"] || {};
GameusScripts["QuestSystem"] = 1.0;
GameusScripts["Config"]["QuestSystem"] = PluginManager.parameters("GameusQuestSystem");

// Initialize global quest variables
var $dataQuests = null;
var $gameQuests = null;


// Load quest data
DataManager._databaseFiles.push(
    {name: "$dataQuests", src: "Quests.json"}
    
);

//---------------------------------------------------------------------------------------------
// Alias methods
//---------------------------------------------------------------------------------------------
    gameus_Quest_Party_Initialize = Game_Party.prototype.initialize;
    gameus_Quest_Data_Initialize  = DataManager.createGameObjects;
    gameus_Quest_Save_Data        = DataManager.makeSaveContents;
    gameus_Quest_Load_Data        = DataManager.extractSaveContents;
    gameus_Quest_Plugin_Commands  = Game_Interpreter.prototype.pluginCommand;
    
//---------------------------------------------------------------------------------------------
// Plugin Commands
//---------------------------------------------------------------------------------------------
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        gameus_Quest_Plugin_Commands.call(this, command, args);
        if (command.toLowerCase() === "quest") {
            switch (args[0].toLowerCase()) {
            case 'open':
                SceneManager.push(Scene_Quest);
                break;
            case 'add':
                $gameParty.addQuest(Number(args[1]));
                break;
            case 'remove':
                $gameParty.removeQuest(Number(args[1]));
                break;
            case 'complete':
                $gameQuests.get(Number(args[1])).complete();
                break;
            case 'fail':
                $gameQuests.get(Number(args[1])).fail();
                break;
            case 'reset':
                $gameQuests.get(Number(args[1])).reset();
                break;
            case 'nextstep':
                $gameQuests.get(Number(args[1])).nextStep();
                break;
            case 'backstep':
                $gameQuests.get(Number(args[1])).backStep();
                break;
            }
        }
    };
//---------------------------------------------------------------------------------------------
// DataManager
//---------------------------------------------------------------------------------------------
    DataManager.makeSaveContents = function() {
        contents = gameus_Quest_Save_Data.call(this);
        // Include the quests in the save file
        contents.quests = $gameQuests;
        return contents;
    };
    
    DataManager.extractSaveContents = function(contents) {
        gameus_Quest_Load_Data.call(this, contents);
        // Then take them back because we really don't trust banks
        $gameQuests = contents.quests;
    };
    
    DataManager.createGameObjects = function() {
        gameus_Quest_Data_Initialize.call(this);
        // Create global quests
        $gameQuests = new Game_Quests();
    };
    
//---------------------------------------------------------------------------------------------
// Game_Party
//---------------------------------------------------------------------------------------------
    Game_Party.prototype.initialize = function() {
        gameus_Quest_Party_Initialize.call(this);
        // Initialize quest data
        this.quests = [];
    };
    
    Game_Party.prototype.addQuest = function(quest_id) {
        // Does party already have quest?
        if (this.quests.indexOf(quest_id) < 0) {
            // If not, give that crap to them. They don't have a choice now.
            this.quests.push(quest_id);
        }
    };
    
    // Removes the quest from the party. NOTE: This does NOT reset the quest
    Game_Party.prototype.removeQuest = function(quest_id) {
        // Check if quest exists
        if (this.quests.indexOf(quest_id) > -1) {
            // I was wrong...
            var index = this.quests.indexOf(quest_id);
            this.quests.splice(index, 1);
        }
    };
    
    // Returns total number of quests the party has
    // filter can be "all", "progress" "completed" or "failed"
    Game_Party.prototype.totalQuests = function(filter) {
        // Returns a list of ALL quests
        if (filter === undefined || filter === "all")
            return this.quests.length;
        // Time to cycle through quests....(dammit, I did this exact thing in the quest list window)
        var count = 0;
        for (var i = 0; i < this.quests.length; i += 1) {
            var q = $gameQuest.get(this.quests[i]);
            if (q.status === filter.toLowerCase())
                count += 1;
        }
        return count;
    };
    
    // Gets all quest id's 
    Game_Party.prototype.getQuests = function(filter) {
        // Returns a list of ALL quests
        if (filter === undefined || filter === "all")
            return this.quests;
        // Time to cycle through quests....(dammit, I did this exact thing in the quest list window)
        var data = [];
        for (var i = 0; i < this.quests.length; i += 1) {
            var q = $gameQuest.get(this.quests[i]);
            if (q.status === filter.toLowerCase())
                data.push(q.questId);
        }
        return data;
    };
    
    // This method is actually extremely useless. Ignore it for now.
    Game_Party.prototype.getQuest = function(index) {
        return $gameQuests.get(this.quests[index]);
    };
    
    Game_Party.prototype.hasQuest = function(quest_id){
        // Returns whether or not they have the quest
        return this.quests.indexOf(quest_id) > -1;
    };
    
    // This checks a list of quests and its status.
    // If the party has all and they match the input filter, it returns true
    // Used to check a range of quests completion
    Game_Party.prototype.hasQuests = function(quests, filter) {
        flag = true;
        for (var i = 0; i < quests.length; i += 1) {
            if (!this.hasQuest(quests[i]))
                flag = false;
            if ($gameQuests.get(quests[i]).status !== filter)
                flag = false;
        }
        return flag;
    }
    
//---------------------------------------------------------------------------------------------
// Game_Quest
//---------------------------------------------------------------------------------------------
    function Game_Quest() {
        this.initialize.apply(this, arguments);
    };
    
    Game_Quest.prototype.initialize = function(questId) {
        var questData = $dataQuests[questId];
        this.questId = questId;
        this.rawData = questData;
        this.cat = questData.cat;
        this.name = questData.name;
        this.desc = questData.desc;
        this.rewards = questData.rewards;
        this.icon = questData.icon;
        this.steps = questData.steps;
        this.maxSteps = this.steps.length;
        this.currentStep = 0;
        this.status = "progress";
    };
    
    Game_Quest.prototype.giveRewards = function() {
        for (var i = 0; i < this.rewards.length; i += 1) {
            var reward = this.rewards[i];
            switch (reward[0]) {
                case "item":
                    item = $dataItems[reward[1]];
                    $gameParty.gainItem(item, Number(reward[2]));
                    break;
                case "armor":
                    item = $dataArmors[reward[1]];
                    $gameParty.gainItem(item, Number(reward[2]));
                    break;
                case "weapon":
                    item = $dataWeapons[reward[1]];
                    $gameParty.gainItem(item, Number(reward[2]));
                    break;
                case "xp":
                    for (var j = 0; j < $gameParty.members().length; j++) { 
                        $gameParty.members()[j].gainExp(reward[1]);
                    };
                    break;
                case "gold":
                    $gameParty.gainGold(Number(reward[1]));
                    break;
            }
        }
    };
    
    Game_Quest.prototype.completed = function() {
        return this.status == "completed";
    }
    
    Game_Quest.prototype.inProgress = function() {
        return this.status == "progress";
    }
    
    Game_Quest.prototype.failed = function() {
        return this.status == "failed";
    }
    
    Game_Quest.prototype.nextStep = function() {
        this.currentStep = this.currentStep + 1 > this.maxSteps - 1 ? this.maxSteps - 1 : this.currentStep + 1;
    };
    
    Game_Quest.prototype.backStep = function() {
        this.currentStep = this.currentStep - 1 < 0 ? 0 : this.currentStep - 1;
    };
    
    Game_Quest.prototype.currentStep = function() {
        return this.currentStep;
    };
    
    Game_Quest.prototype.fail = function() {
        this.status = "failed";
    };
    
    Game_Quest.prototype.complete = function() {
        if ((GameusScripts["Config"]["QuestSystem"]["Auto Rewards"] || "false").toLowerCase() === "true") {
            this.giveRewards();
        }
        this.currentStep = this.maxSteps - 1;
        this.status = "completed";
    };
    
    Game_Quest.prototype.reset = function() {
        this.status = "progress";
        this.currentStep = 0;
    };

//---------------------------------------------------------------------------------------------
// Game_Quests
//---------------------------------------------------------------------------------------------
    function Game_Quests() {
        this.initialize.apply(this, arguments);
    };
    
    Game_Quests.prototype.initialize = function() {
        this.data = [];
    };
    
    Game_Quests.prototype.get = function(quest_id) {
        if ($dataQuests[quest_id]) {
            if (!this.data[quest_id]) {
                this.data[quest_id] = new Game_Quest(quest_id);
            }
            return this.data[quest_id];
        }
        return null;
    };
    
    Game_Quests.prototype.categories = function() {
        if ($dataQuests[0])
            return $dataQuests[0];
        return null;
    };
    
    Game_Quests.prototype.totalQuests = function(filter) {
        // Returns a list of ALL quests
        if (filter === undefined || filter === "all")
            return $dataQuests.length;
        // Time to cycle through quests....(dammit, I did this exact thing in the quest list window)
        var count = 0;
        for (var i = 0; i < $dataQuests.length; i += 1) {
            var q = this.get(this.quests[i]);
            if (q.status === filter.toLowerCase())
                count += 1;
        }
        return data;
    };
//---------------------------------------------------------------------------------------------
// Window_Base
//---------------------------------------------------------------------------------------------
    Window_Base.prototype.sliceText = function(text, width) {
        var words = text.split(" ");
        if (words.length === 1)
            return words;
        var result = [];
        var current_text = words.shift();
        for (var i = 0; i < words.length; i += 1) {
            var word = words[i];
            var textW = this.contents.measureTextWidth(current_text + " " + word);
            if (textW > width) {
                result.push(current_text);
                current_text = word;
            } else {
                current_text += " " + word;
            }
            if (i >= words.length - 1)
                result.push(current_text) 
        }
        return result
    }
//---------------------------------------------------------------------------------------------
// Window_QuestInfo
//---------------------------------------------------------------------------------------------
    function Window_QuestInfo() {
        this.initialize.apply(this, arguments);
    }
    
    Window_QuestInfo.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestInfo.prototype.constructor = Window_QuestInfo;
    
    Window_QuestInfo.prototype.initialize = function() {
        var xx = (GameusScripts["Config"]["QuestSystem"]["Reverse Layout"] || "false").toLowerCase() === "true" ? 0 : 320;
        this.failedImg = GameusScripts["Config"]["QuestSystem"]["Failed Image"] || '';
        this.completedImg = GameusScripts["Config"]["QuestSystem"]["Completed Image"] || '';
        if (this.failedImg !== '')
            this.failedImg = ImageManager.loadPicture(this.failedImg, 0);
        if (this.completedImg !== '')
            this.completedImg = ImageManager.loadPicture(this.completedImg, 0);
        this.quest = 0;
        this.offY = 0;
        this.lineY = 0;
        this.resizeFlag = false;
        Window_Selectable.prototype.initialize.call(this, xx, 0, Graphics.boxWidth - 320, Graphics.boxHeight);
        this.questBitmap = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this.refresh();
    };
    
    Window_QuestInfo.prototype.setQuest = function(quest_id) {
        this.quest = quest_id;
        this.offY = 0;
        this.resizeFlag = false;
        this.createQuestBitmap();
        this.refresh();
    };
    
    Window_QuestInfo.prototype.refresh = function() {
        this.contents.clear();
        if (this.quest > 0) {
            this.contents.blt(this.questBitmap, 0, this.offY, this.contentsWidth(), this.contentsHeight(), 0, 0, this.contentsWidth(), this.contentsHeight());
        }
    }
    
    // This function is used to keep track of the height of the bitmap, has to be called after every line of text drawn
    Window_QuestInfo.prototype.write = function() {
        this.lineY += this.lineHeight() + this.textPadding();
        if (this.lineY > this.questBitmap.height) {
            this.questBitmap.resize(this.questBitmap.width, this.lineY);
            this.resizeFlag = true;
        }
    }
        
    Window_QuestInfo.prototype.createQuestBitmap = function() {
        this.questBitmap.clear();
        if (this.quest > 0) {
            this.questBitmap.paintOpacity = 255;
            var q = $gameQuests.get(this.quest);
            this.drawQuestInfo(q);
            this.drawQuestSteps(q);
            this.drawQuestRewards(q);
            // Check for resize, then redraw
            if (this.resizeFlag) {
                this.resizeFlag = false;
                this.createQuestBitmap();
            }
            if (this.failedImg !== '' && q.status === "failed") {
                this.questBitmap.paintOpacity = Number(GameusScripts["Config"]["QuestSystem"]["Failed Image Opacity"] || 128);
                this.questBitmap.blt(this.failedImg, 0, 0, this.failedImg.width, this.failedImg.height, 
                    this.contentsWidth() / 2 - this.failedImg.width / 2, 
                    this.contentsHeight() / 2 - this.failedImg.height / 2);
            }
            if (this.completedImg !== '' && q.status === "completed") {
                this.questBitmap.paintOpacity = Number(GameusScripts["Config"]["QuestSystem"]["Completed Image Opacity"] || 128);
                this.questBitmap.blt(this.completedImg, 0, 0, this.completedImg.width, this.completedImg.height,
                    this.contentsWidth() / 2 - this.completedImg.width / 2, 
                    this.contentsHeight() / 2 - this.completedImg.height / 2);
            }
        }
    };
    
    Window_QuestInfo.prototype.drawQuestInfo = function(q) {
        var headerX = 0;
        this.questBitmap.paintOpacity = 255;
        this.lineY = 0;
        if (q.icon > -1) {
            this.drawIcon(q.icon, 0, this.lineY);
            headerX = 40;
        }
        this.questBitmap.textColor = this.systemColor();
        this.questBitmap.drawText(q.name, headerX, this.lineY, this.contentsWidth() - headerX, this.lineHeight());
        this.write();
        this.questBitmap.textColor = this.normalColor();
        var lines = this.sliceText(q.desc, this.contentsWidth());
        for (var i = 0; i < lines.length; i += 1) {
            this.questBitmap.drawText(lines[i], 0, this.lineY, this.contentsWidth(), this.lineHeight());
            this.write();
        }
        this.drawHorzLine(this.lineY);
        this.write();
    }
    
    Window_QuestInfo.prototype.drawQuestSteps = function(q) {
        // Draw the quest steps
        var bullet = String(GameusScripts["Config"]["QuestSystem"]["Bullet Character"] || "-" ) + " ";
        this.questBitmap.textColor = this.systemColor();
        var steps = String(GameusScripts["Config"]["QuestSystem"]["Steps Word"] || "Steps" );
        this.questBitmap.drawText(steps, 0, this.lineY, this.contentsWidth(), this.lineHeight());
        this.write();
        this.questBitmap.textColor = this.normalColor();
        var maxSteps = Number(GameusScripts["Config"]["QuestSystem"]["Max Steps"] || 3);
        if (maxSteps === 0)
            maxSteps = q.steps.length;
        if (q.currentStep >= q.steps.length)
            q.currentStep = q.steps.length - 1;
        var startStep = Math.max(0, q.currentStep - maxSteps + 1);
        var drawableSteps = q.steps.slice(startStep, q.currentStep + 1);
        for (var i = 0; i < drawableSteps.length; i += 1) {
            var step = drawableSteps[i];
            var stepText = bullet + step[0];
            if (step[1] === true) {
                var varVal = $gameVariables.value(step[2]);
                var maxVal = step[3];
                if (step[4])
                    stepText += " " + String(Math.floor(varVal / maxVal * 100)) + "%";
                else
                    stepText += " " + String(varVal) + " / " + String(maxVal);
            }    
            lines = this.sliceText(stepText, this.contentsWidth());
            var done = i + startStep < q.currentStep || (q.status === "completed" || q.status === "failed");
            this.questBitmap.paintOpacity = done ? 160 : 255
            for (var j = 0; j < lines.length; j += 1) {
                var bulletOffset = 0;
                if (j > 0)
                    bulletOffset += this.contents.measureTextWidth(bullet);
                this.questBitmap.drawText(lines[j], bulletOffset, this.lineY, this.contentsWidth(), this.lineHeight());
                this.write();
            }
        }
        this.drawHorzLine(this.lineY);
        this.write();
    }
    
    Window_QuestInfo.prototype.drawQuestRewards = function(q) {
        var bullet = String(GameusScripts["Config"]["QuestSystem"]["Bullet Character"] || "-" ) + " ";
        // Draw Rewards
        var rewards = String(GameusScripts["Config"]["QuestSystem"]["Rewards Word"] || "Rewards" );
        this.questBitmap.textColor = this.systemColor(); 
        this.questBitmap.drawText(rewards, 0, this.lineY, this.contentsWidth(), this.lineHeight());
        this.write();
        this.questBitmap.textColor = this.normalColor();
        for (var i = 0; i < q.rewards.length; i += 1) {
            var reward = q.rewards[i];
            // If the reward is hidden and quest not completed yet...
            if (reward[3] === true && q.status !== "completed") {
                // Draw this shit as hidden
                var hidden = bullet + (GameusScripts["Config"]["QuestSystem"]["Hidden Reward Text"] || "??????");
                this.questBitmap.drawText(hidden, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                this.write();
                continue;
            }
            var item = null;
            var amount = null;
            var done = (q.status === "completed" || q.status === "failed");
            this.questBitmap.paintOpacity = done ? 160 : 255
            switch (reward[0]) {
                case "item":
                    item = $dataItems[reward[1]];
                    amount = reward[2];
                    this.questBitmap.drawText(bullet, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.drawItemName(item, this.contents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
                    this.questBitmap.drawText("x" + String(amount), 0, this.lineY, this.contentsWidth(), this.lineHeight(), "right");
                    this.write();
                    break;
                case "armor":
                    item = $dataArmors[reward[1]];
                    amount = reward[2];
                    this.questBitmap.drawText(bullet, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.drawItemName(item, this.contents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
                    this.questBitmap.drawText("x" + String(amount), 0, this.lineY, this.contentsWidth(), this.lineHeight(), "right");
                    this.write();
                    break;
                case "weapon":
                    item = $dataWeapons[reward[1]];
                    amount = reward[2];
                    this.questBitmap.drawText(bullet, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.drawItemName(item, this.contents.measureTextWidth(bullet), this.lineY, this.contentsWidth());
                    this.questBitmap.drawText("x" + String(amount), 0, this.lineY, this.contentsWidth(), this.lineHeight(), "right");
                    this.write();
                    break;
                case "xp":
                    amount = reward[1];
                    this.questBitmap.drawText(bullet + TextManager.exp, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.questBitmap.drawText("x" + String(amount), 0, this.lineY, this.contentsWidth(), this.lineHeight(), "right");
                    this.write();
                    break;
                case "gold":
                    amount = reward[1];
                    this.questBitmap.drawText(bullet + TextManager.currencyUnit, 0, this.lineY, this.contentsWidth(), this.lineHeight());
                    this.questBitmap.drawText("x" + String(amount), 0, this.lineY, this.contentsWidth(), this.lineHeight(), "right");
                    this.write();
                    break;
                case "custom":
                    amount = this.sliceText(bullet + reward[1], this.contentsWidth());
                    for (var j = 0; j < amount.length; j += 1) {
                        var bulletOffset = 0;
                        if (j > 0)
                            bulletOffset += this.contents.measureTextWidth(bullet);
                        this.questBitmap.drawText(amount[j], bulletOffset, this.lineY, this.contentsWidth(), this.lineHeight());
                        this.write();
                    }
                    break;
            }
        }
    }
    
    // Borrow some drawing methods since we're drawing to a secondary bitmap
    Window_QuestInfo.prototype.drawItemName = function(item, x, y, width) {
        width = width || 312;
        if (item) {
            var iconBoxWidth = Window_Base._iconWidth + 8;
            this.questBitmap.textColor = this.normalColor();
            this.drawIcon(item.iconIndex, x - 2, y + 2);
            this.questBitmap.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth, this.lineHeight());
        }
    };
    
    Window_QuestInfo.prototype.drawIcon = function(iconIndex, x, y) {
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        this.questBitmap.blt(bitmap, sx, sy, pw, ph, x, y);
    };
    
    Window_QuestInfo.prototype.drawHorzLine = function(y) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.questBitmap.paintOpacity = 48;
        this.questBitmap.fillRect(0, lineY, this.contentsWidth(), 2, this.normalColor());
        this.questBitmap.paintOpacity = 255;
    };
    
    // Update the up/down arrows to indicate scrolling is available
    Window_QuestInfo.prototype.updateArrows = function() {
        this.downArrowVisible = (this.questBitmap.height > this.contentsHeight() && this.offY < this.questBitmap.height - this.contentsHeight());
        this.upArrowVisible = this.offY > 0;
    };
    
    // Override the arrow key controls so we can scroll instead, let's be honest, that's way cooler
    Window_QuestInfo.prototype.isCursorMovable = function() {
        return (this.isOpenAndActive());
    };

    Window_QuestInfo.prototype.cursorDown = function(wrap) {
        if (this.questBitmap.height > this.contentsHeight() && this.offY < this.questBitmap.height - this.contentsHeight()) {
            SoundManager.playCursor();
            this.offY += this.lineHeight() + this.textPadding();
            this.refresh();
        }
    };

    Window_QuestInfo.prototype.cursorUp = function(wrap) {
        if (this.offY > 0) {
            SoundManager.playCursor();
            this.offY -= this.lineHeight() + this.textPadding();
            if (this.offY < 0)
                this.offY = 0;
            this.refresh();
        }
    };
    
    Window_QuestInfo.prototype.cursorPagedown = function() {
        this.cursorDown();
    };

    Window_QuestInfo.prototype.cursorPageup = function() {
        this.cursorUp();
    };

    Window_QuestInfo.prototype.cursorRight = function(wrap) {
        // We are basically...
    };

    Window_QuestInfo.prototype.cursorLeft = function(wrap) {
        // ...screwing the system
    };
    
//---------------------------------------------------------------------------------------------
// Window_Quests
//---------------------------------------------------------------------------------------------
    function Window_Quests() {
        this.initialize.apply(this, arguments);
    };

    Window_Quests.prototype = Object.create(Window_Command.prototype);
    Window_Quests.prototype.constructor = Window_Quests;
    
    Window_Quests.prototype.initialize = function() {
        var xx = (GameusScripts["Config"]["QuestSystem"]["Reverse Layout"] || "false").toLowerCase() === "true" ? Graphics.boxWidth - 320 : 0;
        var yy = String(GameusScripts["Config"]["QuestSystem"]["Filter Position"]).toLowerCase() === "top" ? this.fittingHeight(1) : 0;
        // Stores all quests available from $gameParty
        this.qFilters = ["all", "progress", "completed", "failed"];
        this.filterIndex = 0;
        this.data = [];
        this.cats = $gameQuests.categories();
        this.expanded = [];
        for (var i = 0; i < this.cats.length; i += 1) 
            this.expanded[i] = false;
        this.filter = "all";
        this.refreshQuests();
        Window_Command.prototype.initialize.call(this, xx, yy);
    };
    
    Window_Quests.prototype.windowWidth = function() {
        return 320;
    };

    Window_Quests.prototype.numVisibleRows = function() {
        return 10;
    };
    
    Window_Quests.prototype.windowHeight = function() {
        return Graphics.boxHeight - this.fittingHeight(1)
    }
    
    Window_Quests.prototype.drawItem = function(index) {
        var item = this._list[index];
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        var tempX = 0;
        if (item.symbol === "quest") {
            var q = $gameQuests.get(Number(item.ext));
            if (q.icon > -1 && (GameusScripts["Config"]["QuestSystem"]["Use Icons"]).toLowerCase() === "true") {
                this.drawIcon(q.icon, rect.x + 8, rect.y + 2);
                tempX = 40;
            }
        }
        this.drawText(this.commandName(index), rect.x + tempX / 2, rect.y, rect.width, align);
    };
    
    
    Window_Quests.prototype.questData = function(quest_id) {
        return $gameQuests.get(quest_id);
    };
    
    Window_Quests.prototype.refreshQuests = function() {
        this.data = $gameParty.getQuests();
        this.cats = $gameQuests.categories();
        this.counter = [];
        for (var i = 0; i < this.cats.length; i += 1) 
            this.expanded[i] = false;
        for (var i = 0; i < this.cats.length; i += 1) {
            this.counter[i] = 0;
            for (var j = 0; j < this.data.length; j += 1) {
                var q = $gameQuests.get(this.data[j]);
                if (q.cat == i && (this.filter == q.status || this.filter == "all"))
                    this.counter[i] += 1;
            }
        }
    };

    Window_Quests.prototype.setFilter = function(filter) {
        this.filter = filter;
    };

    Window_Quests.prototype.toggle = function(cat) {
        this.expanded[cat] = !this.expanded[cat];
        this.refresh();
    };
    
    Window_Quests.prototype.makeCommandList = function() {
        var q;
        var flag = false;
        var count = "";
        var useCats   = (GameusScripts["Config"]["QuestSystem"]['Use Categories'] || "false").toLowerCase();
        var catMode   = Number(GameusScripts["Config"]["QuestSystem"]["Show Empty Categories"] || 0);
        var showCount = (GameusScripts["Config"]["QuestSystem"]["Show Quest Count"] || "false").toLowerCase();
        if (useCats === "true") {
            for (var i = 0; i < this.cats.length; i += 1) {
                flag = true;
                if (showCount === "true")
                    count = " (" + String(this.counter[i]) + ")";
                if (catMode == 1 && this.counter[i] == 0)
                    flag = false;
                if (catMode > 0 || this.counter[i] > 0)
                    this.addCommand(this.cats[i] + count, "cat", flag, String(i));
                if (this.expanded[i]) {
                    flag = false;
                    for (var j = 0; j < this.data.length; j += 1) {
                        q = $gameQuests.get(this.data[j]);
                        if ((q.status == this.filter || this.filter == "all") && i == q.cat) {
                            flag = true;
                            this.addCommand("  " + q.name, "quest", true, q.questId);
                        }
                    }
                    if (!flag)
                        this.addCommand("  " + GameusScripts["Config"]["QuestSystem"]["No Quests Text"] || "No Quests", "none");
                }
            }
        } else {
            for (var i = 0; i < this.data.length; i += 1) {
                q = $gameQuests.get(this.data[i]);
                if (q.status == this.filter || this.filter == "all")
                    this.addCommand(q.name, "quest", true, q.questId);
            }
        }
        if (this._list.length < 1) {
            this.addCommand(GameusScripts["Config"]["QuestSystem"]["No Quests Text"] || "No Quests", "none");
        }
    };
    
    Window_Quests.prototype.cursorRight = function(wrap) {
        this.filterIndex = this.filterIndex + 1 > 3 ? 0 : this.filterIndex + 1;
        this.filter = this.qFilters[this.filterIndex];
        this.refreshQuests();
        this.refresh();
        this.select(0);
    };

    Window_Quests.prototype.cursorLeft = function(wrap) {
        this.filterIndex = this.filterIndex - 1 < 0 ? 3 : this.filterIndex - 1;
        this.filter = this.qFilters[this.filterIndex];
        this.refreshQuests();
        this.refresh();
        this.select(0);
    };
//---------------------------------------------------------------------------------------------
// Window_QuestFilter
//---------------------------------------------------------------------------------------------
    function Window_QuestFilter() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestFilter.prototype = Object.create(Window_Base.prototype);
    Window_QuestFilter.prototype.constructor = Window_QuestFilter;

    Window_QuestFilter.prototype.initialize = function() {
        this.qFilters = [
            GameusScripts["Config"]["QuestSystem"]["All Word"] || "All",
            GameusScripts["Config"]["QuestSystem"]["In-Progress Word"] || "In-Progress",
            GameusScripts["Config"]["QuestSystem"]["Completed Word"] || "Completed",
            GameusScripts["Config"]["QuestSystem"]["Failed Word"] || "Failed",
        ];
        var xx = (GameusScripts["Config"]["QuestSystem"]["Reverse Layout"] || "false").toLowerCase() === "true" ? Graphics.boxWidth - 320 : 0;
        var yy = String(GameusScripts["Config"]["QuestSystem"]["Filter Position"]).toLowerCase() === "top" ? 0 : Graphics.boxHeight - this.windowHeight();
        this.filterIndex = 0;
        this.filter = "";
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, xx, yy, width, height);
        this.refresh();
    };

    Window_QuestFilter.prototype.windowWidth = function() {
        return 320;
    };

    Window_QuestFilter.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_QuestFilter.prototype.refresh = function() {
        if (this.filter == this.qFilters[this.filterIndex])
            return;
        this.filter = this.qFilters[this.filterIndex];
        this.contents.clear();
        this.drawText(this.filter, 0, 0, this.contentsWidth(), "center");
    };
//---------------------------------------------------------------------------------------------
// Scene_Quest
//---------------------------------------------------------------------------------------------
    function Scene_Quest() {
        this.initialize.apply(this, arguments);
    };

    Scene_Quest.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Quest.prototype.constructor = Scene_Quest;    

    Scene_Quest.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_Quest.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.qFilters = ["all", "progress", "completed", "failed"];
        this.createQuestWindow();
    };
    
    Scene_Quest.prototype.createQuestWindow = function() {
        this.oldIndex = 0;
        this.questWindow = new Window_Quests();
        this.questWindow.setHandler("cat", this.handleCategory.bind(this));
        this.questWindow.setHandler("quest", this.handleQuest.bind(this));
        this.questWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this.questWindow);
        this.questInfo = new Window_QuestInfo();
        this.questInfo.setHandler("cancel", this.cancelInfo.bind(this));
        this.addWindow(this.questInfo);
        this.questFilter = new Window_QuestFilter();
        this.addWindow(this.questFilter);
    };
    
    Scene_Quest.prototype.update = function() {
        var index = this.questWindow.index();
        if (this.oldIndex != index) {
            var q = this.questWindow._list[index];
            if (q.symbol === "quest")
                this.questInfo.setQuest(q.ext);
            else 
                this.questInfo.setQuest(-1);
            this.oldIndex = index;
        }
        this.questFilter.filterIndex = this.questWindow.filterIndex;
        this.questFilter.refresh();
        Scene_Base.prototype.update.call(this);
    };
    
    Scene_Quest.prototype.cancelInfo = function() {
        this.questWindow.activate();
        this.questInfo.deactivate();
    }
    
    Scene_Quest.prototype.handleQuest = function() {
        this.questWindow.deactivate();
        this.questInfo.activate();
    };
    
    Scene_Quest.prototype.handleCategory = function() {
        var catIndex = this.questWindow.currentExt();
        this.questWindow.toggle(catIndex);
        this.questWindow.refresh();
        this.questWindow.activate();
    };

    // This is used to open up the Quest Log from the menu
    // Used in conjunction with Yanfly's Menu plugin
    Scene_Menu.prototype.commandQuest = function() {
        SceneManager.push(Scene_Quest);
    };
    
