(function() {
    var IntersectionsData = function(data) {
        var _this = this;
        this.data = data;
        this.listeners = [];

        this.update = function(intersection_id, update) {
            console.log("Update", intersection_id, update);
            var intersection = _this.data[intersection_id];
            var lat = intersection['lat'];
            var lon = intersection['lon'];
            for (var i=0; i<update['reports'].length; i++) {
                console.log(update['reports'][i]);
                intersection['reports'].push(update['reports'][i]);
            }
            _this._dispatchUpdate(intersection_id);
        };

        this.addUpdateListener = function(f) {
            this.listeners.push(f);
        };

        this._dispatchUpdate = function(intersection_id) {
            for (var i=0; i<this.listeners.length; i++) {
                this.listeners[i](intersection_id);
            }
        };
    };

    if (typeof exports !== 'undefined') {
        module.exports = IntersectionsData;
    } else {
        window.IntersectionsData = IntersectionsData;
    }
})();
