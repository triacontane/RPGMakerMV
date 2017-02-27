(function() {
    'use strict';
    var _TouchInput__onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function(event) {
        _TouchInput__onMouseMove.apply(this, arguments);
        this.mouseX = Graphics.pageToCanvasX(event.pageX);
        this.mouseY = Graphics.pageToCanvasY(event.pageY);
    };
})();

