'use strict';

pillar.LevelLayer = cc.Layer.extend({
    hero: null,

    ctor: function()  {
        this._super();
        this.init();
    },

    init: function()  {
        this._super();

        // Initialise the world
        this.initWorld();

        // Initialise the hero.
        this.initHero();


        return true;
    },

    initWorld: function()  {
        var visibleSize = cc.winSize;
        var background = new cc.LayerColor(cc.color('#2ab8ac'), visibleSize.width, visibleSize.height);

        this.addChild(background, 0);
    },

    initHero: function()  {
        this.hero = new pillar.Hero();

        cc.log(this.hero);

        this.hero.setPosition(cc.p(100, 0));

        this.addChild(this.hero.sprite, 10);
    }
});

pillar.LevelScene = cc.Scene.extend({
    onEnter: function()  {
        this._super();

        var layer = new pillar.LevelLayer();
        this.addChild(layer);
    }
});
