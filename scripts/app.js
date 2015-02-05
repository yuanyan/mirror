define(function(require, exports, module) {
	var view = require('./view');
	var ui = require('./ui');
	var event = require('./event');
	var preferences = require('./preferences');
	var utils = require('./utils');
	var eventRouter = require('./event-router');
	var serializer = require('./serializer');
	var syncScroll = require('./sync-scroll');
	var overrideScroll = require('./override-scroll');

    var defaultPreferences = {
        maxWidthEnabled: true,
        maxWidth: 700,
        overrideScroll: overrideScroll.guessState()
    };

    function initMainView(uiContainer, appData) {
        var scroller = ui.scroller(uiContainer);
        var allViews = view.init(appData.url, appData.breakpoints, scroller, viewOptions());

        setTimeout(function() {
            allViews.forEach(function(v) {
                syncScroll.init(v);
            });
        }, 100);

        return allViews;
    }


    function viewOptions(v) {
        var options = {};
        if (preferences.get('maxWidthEnabled')) {
            options.maxWidth = preferences.get('maxWidth');
        }

        return options;
    }

    return function main(state){
        state = state || location.hash;
        var isAppView = true;
        var allViews = null;

        preferences.load(defaultPreferences);
        var appData = serializer.unserialize(state);

        var uiContainer = ui.create({
            panel: isAppView,
            maxWidth: {
                enabled: preferences.get('maxWidthEnabled'),
                value: preferences.get('maxWidth')
            },
            syncScroll: true,
            overrideScroll: preferences.get('overrideScroll'),
            reset: true
        });

        // start the app
        document.body.appendChild(uiContainer);

        allViews =  initMainView(uiContainer, appData);

        // route events
        eventRouter.setup({
            updateViews: utils.throttle(function updateAllViews() {
                allViews.forEach(function(v) {
                    view.update(v, viewOptions(v));
                });
            }, 100),
            reset: function reset() {
                while (allViews.length) {
                    view.remove(allViews.pop());
                }
                preferences.load(defaultPreferences);
                appData = serializer.unserialize(state);
                initMainView(appData.breakpoints);
            }
        });

        event.on('view:remove', function(v) {
            if (~allViews.indexOf(v)) {
                allViews.splice(allViews.indexOf(v), 1);
            }
        });

    }

});