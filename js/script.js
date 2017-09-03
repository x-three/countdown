jQuery(function($) {
    'use strict';

    var oParams = new window.webapp.Params(),
        nyDate = new Date((new Date()).getFullYear() + 1, 0, 1),
        nyLeft = Math.floor((nyDate.getTime() - Date.now()) / 1000),
        time = oParams.date || oParams.time || oParams.obj.forward === undefined && nyLeft || 0;

    new window.webapp.Countdown($('.b-countdown').eq(0), time, oParams.obj.forward !== undefined);
});



(function($) {
    'use strict';

    (window.webapp || (window.webapp = {})).Countdown = Countdown;


    function Countdown(el, time, forward) {
        $.extend(this, {
            $el:     $(el).addClass('b-countdown'),
            time:    time || 0,
            forward: forward || false,
            offset:  Date.now() % 1000,
            aNames:  ['hours', 'minutes', 'seconds'],
            oItems:  {}
        });

        if (time > 24 * 3600) this.aNames.unshift('days');
        this.initialize();
        this.tick();
    }


    Countdown.prototype.initialize = function() {
        var that = this,
            oTime = this.getTimeObj(),
            $item;

        $.each(this.aNames, function(index, name) {
            $item = $('<ul></ul>').addClass('m-' + name).appendTo(that.$el);
            that.oItems[name] = new window.webapp.FlipNumber($item, oTime[name], 2);
        });
    };


    Countdown.prototype.getTimeObj = function(time) {
        var seconds = time !== undefined ? time : this.time;
        return {
            days: Math.floor(seconds / (24 * 3600)),
            hours: Math.floor(seconds % (24 * 3600) / 3600),
            minutes: Math.floor(seconds % 3600 / 60),
            seconds: seconds % 60
        };
    };


    Countdown.prototype.tick = function() {
        var that = this,
            duration = 1000 + (this.offset - Date.now() % 1000),
            oTime = this.getTimeObj(this.time + (this.forward ? 1 : -1)),
            aDeferred = [];

        $.each(this.aNames, function(index, name) {
            if (that.oItems[name].value !== oTime[name]) {
                aDeferred.push(that.oItems[name].flip(oTime[name], duration));
            }
        });

        $.when.apply(null, aDeferred).done(function() {
            that.time += that.forward ? 1 : -1;
            that.tick();
        });
    };
}(jQuery));



(function($) {
    'use strict';

    (window.webapp || (window.webapp = {})).FlipNumber = FlipNumber;


    function FlipNumber(el, value, digits) {
        $.extend(this, {
            $el: $(el).addClass('b-flip-number'),
            value: value,
            digits: Math.max(digits || 0, value.toString().length),
            aItems: [],
            busy: false
        });
        this.initialize();
    }


    FlipNumber.prototype.initialize = function() {
        var aValue = this.value.toString().split('').reverse(),
            $item;

        for (var i = 0; i < this.digits; i++) {
            $item = $('<li>' + (aValue[i] || 0) + '</li>').prependTo(this.$el);
            this.aItems.push(new window.webapp.Flipper($item));
        }
    };


    FlipNumber.prototype.flip = function(value, duration) {
        if (this.busy) return;
        this.busy = true;

        var that = this,
            aOldValue = this.value.toString().split('').reverse(),
            aNewValue = value.toString().split('').reverse(),
            aDeferred = [],
            ready = $.Deferred();

        for (var i = 0; i < this.digits; i++) {
            if (aOldValue[i] !== aNewValue[i]) {
                aDeferred.push(this.aItems[i].flip(aNewValue[i] || 0, duration));
            }
        }

        $.when.apply(null, aDeferred).done(function() {
            that.value = value;
            that.busy = false;
            ready.resolve();
        });

        return ready;
    };
}(jQuery));



(function($) {
    'use strict';

    (window.webapp || (window.webapp = {})).Flipper = Flipper;


    function Flipper(el, duration) {
        $.extend(this, {
            $el: $(el).addClass('b-flipper'),
            duration: duration || 1000,
            busy: false
        });
        this.initialize();
    }


    Flipper.prototype.initialize = function() {
        this.$top = this.$el.wrapInner('<div class="l-wrap"></div>').find('> .l-wrap');
        this.$bottom = this.$top.clone().addClass('m-bottom').insertAfter(this.$top);
        this.$top.addClass('m-top');
    };


    Flipper.prototype.flip = function(content, duration) {
        if (this.busy) return;
        this.busy = true;

        var that = this,
            ready = $.Deferred();

        this.before(content);
        this.animate(duration, function() {
            that.after();
            that.busy = false;
            ready.resolve();
        });

        return ready;
    };


    Flipper.prototype.before = function(content) {
        this.$top.add(this.$bottom).addClass('m-old').append('<i class="i-shadow"></i>');
        this.$nt = $('<div class="l-wrap m-new"></div>').append(content, '<i class="i-shadow"></i>').prependTo(this.$el);
        this.$nb = this.$nt.clone().addClass('m-bottom').insertAfter(this.$nt);
        this.$nt.addClass('m-top');
    };


    Flipper.prototype.animate = function(duration, cb) {
        !duration && (duration = this.duration);
        this.$nb.css({ animation: 'fx-new-bottom ' + duration + 'ms linear both' });
        this.$nt.find('> .i-shadow').css({ animation: 'fx-new-shadow ' + duration + 'ms linear both' });
        this.$top.css({ animation: 'fx-old-top ' + duration + 'ms linear both' });
        this.$top.add(this.$bottom).find('> .i-shadow').css({ animation: 'fx-old-shadow ' + duration + 'ms linear both' });
        cb && setTimeout(cb, duration);
    };


    Flipper.prototype.after = function() {
        this.$top.remove();
        this.$bottom.remove();
        this.$nt.add(this.$nb).removeClass('m-new').css({ animation: '' }).find('> .i-shadow').remove();
        this.$top = this.$nt;
        this.$bottom = this.$nb;
        delete this.$nt;
        delete this.$nb;
    };
}(jQuery));



(function($) {
    'use strict';

    (window.webapp || (window.webapp = {})).Params = Params;


    function Params() {
        this.initialize();
        if (this.obj) {
            if (this.obj.date) this.date = this.parseDate(this.obj.date);
            if (this.obj.time) this.time = this.parseTime(this.obj.time);
        }
    }


    Params.prototype.initialize = function() {
        var that = this;
        this.obj = {};
        if (window.location.search !== '') {
            $.each(window.location.search.substr(1).split('&'), function(index, el) {
                var separator = el.indexOf('=');
                if (separator === -1) separator = el.length;
                that.obj[el.substr(0, separator)] = el.substr(separator + 1);
            });
        }
    };


    Params.prototype.parseDate = function(str) {
        var aDate = str.split(':'),
            date = new Date(aDate[0] || 0, (aDate[1] || 1) - 1, aDate[2] || 1, aDate[3] || 0, aDate[4] || 0, aDate[5] || 0);
        return Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
    };


    Params.prototype.parseTime = function(str) {
        var aTime = str.split(':');
        return (aTime[0] || 0) * 24 * 3600 + (aTime[1] || 0) * 3600 + (aTime[2] || 0) * 60 + (aTime[3] || 0);
    };
}(jQuery));