(function () {


    var result = $gameMap.events().every(function(event){
        return !event.isStarting();
    });
})();