/*global jQuery, DIS */

/* DIS/PLAY Script
 Author's name: ...
 Modified by:
 Client name: ...
 Date of creation: ...
 */

(function ($, window, DIS) {
    "use strict";

    DIS.ProjectHandler = function (objectConfiguration) {

        var defaults = {
                SomeValue: "This is an example that can be overridden by passing {SomeValue: 'Something else'} to the constructor."
            },
            configuration = $.extend(true, defaults, objectConfiguration),
            DOM = {},
            eventHandlers,
            firstInit = 1,
            stop = 0,
            seconds = 0,
            minutes = 0,
            hours = 0,
            timerId,
            // Reference to the current scope, usable inside callbacks et al. to reference this module (instead of whatever
            // scope the function might be running in.)
            selfScope = this;

        eventHandlers = {
            refreshAll: function () {
                window.console.log("Performing refresh-action...");
            },
            initTimer: function () {
				timerId = setInterval(timer, 1000);
            },
            startTimer: function() {
                if (firstInit) {
                	firstInit = 0;
                	eventHandlers.initTimer();
                }
                stop = 0;
            },
            pauseTimer: function () {
                stop = 1;
				saveProject();
            },
            restartTimer: function () {
				clearInterval(timerId);
				timerId = null;
            	firstInit = 1,
            	seconds = 0,
            	minutes = 0,
            	hours = 0,
				updateTimer(seconds, minutes, hours);
				eventHandlers.startTimer();
            },
            finishProject: function (e) {
                e.preventDefault();
				clearInterval(timerId);
				timerId = null;
            	firstInit = 1,
				eventHandlers.pauseTimer();
            }
        };

        function timer() {
        	console.log("timer kører");
        	if (stop === 0) {
				if (seconds === 60) {
					seconds = 0;
					minutes++;
					if (minutes === 60) {
						minutes = 0;
						hours++;
					}
				}
				seconds++;
				updateTimer(seconds, minutes, hours);
			}
        }

        function updateTimer(seconds, minutes, hours) {
			if (Math.round(seconds) < 10) {
				seconds = '0' + seconds;
			}
			if (Math.round(minutes) < 10) {
				minutes = '0' + minutes;
			}
			DOM.seconds.html(seconds);
			DOM.minutes.html(minutes);
        }

        function saveProject() {
            window.console.log("Project saved!", hours, minutes, seconds);
        } 

        this.someFunction = function () {
            // Return the "selfScope", as explained in the comment block above.
            return selfScope;
        };

        function init() {
            DOM.container = $(configuration.container);
            if (!DOM.container.length) {
                // If we haven't got a container at this point, throw a hissy fit!
                throw "Given container could not be found, or no container given. That's bad!";
            } else {
                DOM.timer = DOM.container.find(".timer");
                DOM.hours = DOM.timer.find(".hours");
                DOM.minutes = DOM.timer.find(".minutes");
                DOM.seconds = DOM.timer.find(".seconds");
                DOM.startTimerButton = DOM.container.find("[name=start]");
                DOM.startTimerButton.click(eventHandlers.startTimer);
                DOM.pauseTimerButton = DOM.container.find("[name=pause]");
                DOM.pauseTimerButton.click(eventHandlers.pauseTimer);
                DOM.restartTimerButton = DOM.container.find("[name=restart]");
                DOM.restartTimerButton.click(eventHandlers.restartTimer);
                DOM.submitButton = DOM.container.find("[type=submit]");
                DOM.submitButton.click(eventHandlers.finishProject);
                DOM.container.on("dis.refresh", eventHandlers.refreshAll);
            }
        }
        init();
        return this;
    };
}(jQuery, window, DIS));
