/*
    Name:dd.js
    Description: Base architecture 
    Author: navneet
    Last updated: 20/12/2013
*/
(function (dd, $, undefined) {
    var collections={};
    dd.isNullorUndefined=function(value) { 
            return value===undefined || value===null;
        };
    dd.module = function (name, base, proto) {
        if (!proto) {
            proto = base;
            base = dd.Module;
        }
        var nameparts = name.split('.');
        nameparts[nameparts.length];

        var newModule = function (options, el) {
            this._createModule(options, el);
        }
        var baseProto = new base();
        //copy the options object
        baseProto.options = $.extend(true, {}, baseProto.options);
        newModule.prototype = $.extend(true, baseProto, {
            namespace: nameparts[0],
            moduleName: nameparts[1]
        }, proto);
        collections[name]=newModule;
        return newModule;
    };
    dd.initialize = function(name,options,el){
        if (collections[name] && typeof collections[name]==="function"){
            return new collections[name](options,el);
        }
        throw {message:[name," not found in repository"].join(''),description:[name," not found in repository"].join('')}
    }
    dd.Module = function (options, el) {
        if(arguments.length) {
            this._createModule(options, el);
        }
    };

    dd.Module.prototype = {
        options: {
            disabled: false
        },
        _createModule: function (options, el) {
            this.element=el;
            this.options = $.extend(true, {}, this.options, options);
            this._create();
            this._trigger(this.element, 'create', []);
            this._init();
            this._trigger(this.element,'load',[]);
        },
        _create: function () { },
        _init: function () { },
        _on: function (el, evt, func) {
            var self = this;
            $(el).bind(evt, function (e) {
               return func.apply(self, [e,this]);
            });
        },
        _off: function (el, evt) {
            el.unbind(evt);
        },
        _trigger: function (el, evt, args) {
            return this.options[evt] && typeof this.options[evt] === "function" && this.options[evt].apply(el, args);
        },
        setUp:function(options){
             this.options=$.extend(true,{},this.options,options);
        },
        subscribe:function (evt,fn){
            if (evt && fn && typeof(fn)==="function"){
                this.options[evt]=fn;
            }
        },
        unsubscribe:function (evt){
            delete this.options[evt];
        }
    };




})(window.dd || (window.dd = {}), jQuery);



/* 
Usage sample
(function (module, $, undefined) {


    var Menu = dd.module("dd.menu", {
        options: {
            align: "top"
        },
        _create: function () {
            console.log("created constructor");
        },
        onlistclick: function (e,obj) {
                this._trigger(this.element,"click", [e,{target:obj }]);
            },
        _init:function() {
            this.$container=$(this.element);
            this.$li = this.$container.find('ul>li');
            this._off()._on(this.$li, 'click', this.onlistclick);
        }
    });
    // plugin initialization
    $.fn.menu = function (options) {
        return this.each(function () {
           new Menu( options,this);
        });
    }
})(window, jQuery); */