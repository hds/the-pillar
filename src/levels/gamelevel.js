'use strict';

pillar.LevelLayer = cc.Layer.extend({
    _hero: null,
    _pillar: null,
    _ground: 64,
    _controls: {'right': false, 'left': false, 'jump': false, 'attack': false},

    ctor: function()  {
        this._super();
        this.init();
    },

    // **** Init ****
    init: function()  {
        this._super();

        // Initialise controls.
        this.initControls();

        // Initialise the world
        this.initWorld();

        // Initialise the pillar.
        this.initPillar();

        // Initialise Blokk.
        this.initHero();

        this.scheduleUpdate();

        return true;
    },

    initWorld: function()  {
        var visibleSize = cc.winSize;

        cc.log('Game world size:', visibleSize);

        var background = new cc.LayerColor(cc.color('#B0ECF7'), visibleSize.width, visibleSize.height);
        this.addChild(background, 0);

        var ground = new cc.LayerColor(cc.color('#4BC9C0'), visibleSize.width, this._ground);
        this.addChild(ground, 1);
    },

    initPillar: function()  {
        this._pillar = new pillar.Pillar();

        this._pillar.setPosition(cc.p(cc.winSize.width/2.0, this._ground + this._pillar.getHitbox().height/2.0));
        this.addChild(this._pillar.getSprite(), 20);
    },

    initHero: function()  {
        this._hero = new pillar.Hero();

        this._hero.setPosition(cc.p(300, this._ground + this._hero.getHitbox().height/2.0));

        this.addChild(this._hero.getSprite(), 10);
    },

    initControls: function()  {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event)  {
                var layer = event.getCurrentTarget();
                layer.setControlState(keyCode, true);
                cc.log("Key " + keyCode.toString() + " was pressed!");
            },
            onKeyReleased: function(keyCode, event){
                var layer = event.getCurrentTarget();
                layer.setControlState(keyCode, false);
            }
        }, this);
    },

    // **** Update ****
    update: function(delta)  {
        this._pillar.update(delta);

        var bpos = this._hero.getPosition();
        if (this._controls.right)  {
            bpos.x += 500 * delta;
        }
        else if (this._controls.left)  {
            bpos.x -= 500 * delta;
        }
        this._hero.setPosition(bpos);

        // cc.log(this._controls);
    },

    setControlState: function(e, state)  {
        switch (e)  {
            case cc.KEY.right:
                this._controls.right = state;
                break;
            case cc.KEY.left:
                this._controls.left = state;
                break;
            case cc.KEY.z:
                this._controls.jump = state;
                break;
            case cc.KEY.x:
                this._controls.attack = state;
                break;
        }
    }

});

pillar.LevelScene = cc.Scene.extend({
    onEnter: function()  {
        this._super();

        var layer = new pillar.LevelLayer();
        this.addChild(layer);
    }
});
