'use strict';

var ZIndices = {
    Background: 0,
    Ground: 1,
    Terrain: 2,

    PillarBeam: 5,
    Hero: 10,
    Pillar: 20
};

pillar.TerrainUnit = cc.Class.extend({
    _sprite: null,
    _size: 0,
    _pos: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),

    ctor: function(size, pos)  {
        this.init(size, pos);
    },

    init: function(size, pos)  {
        this._size = size;
        this._sprite = new cc.LayerColor(cc.color('#EDB624'),
                                         this._size,
                                         this._size);
        // this._sprite.setAnchorPoint(0, 0);
        this._pos = cc.p(pos.x * this._size, pos.y * this._size);

        this.updateSprite();
    },

    updateSprite: function()  {
        if (this._sprite)  {
            this._sprite.setPosition(cc.p(this._pos.x, this._pos.y));
        }
    },

    getSprite: function() {
        return this._sprite;
    },

    getPosition: function() {
        return this._pos;
    },

    getHitbox: function()  {
        var hitbox = cc.rect(this._pos.x,
                             this._pos.y,
                             this._size,
                             this._size);
        return hitbox;
    }

});

pillar.TerrainUnit.Types = {

};

pillar.LevelLayer = cc.Layer.extend({
    // Level physics
    _gravity: -1000,

    _hero: null,
    _pillar: null,
    _ground: 64,
    _terrain: [],
    _controls: {'right': false, 'left': false, 'jump': false, 'attack': false},

    _drawNode: null,

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

        var background = new cc.LayerColor(cc.color('#B0ECF7'), visibleSize.width*10, visibleSize.height);
        this.addChild(background, ZIndices.Background);

        var ground = new cc.LayerColor(cc.color('#4BC9C0'), visibleSize.width*10, this._ground);
        this.addChild(ground, ZIndices.Ground);
        console.debug('Ground:', ground);

        this.initTerrain();
    },

    initTerrain: function() {
        this._terrain.push(new pillar.TerrainUnit(64, cc.p(1, 1)));
        this._terrain.push(new pillar.TerrainUnit(64, cc.p(2, 1)));
        this._terrain.push(new pillar.TerrainUnit(64, cc.p(5, 3)));
        this._terrain.push(new pillar.TerrainUnit(64, cc.p(6, 3)));

        this._terrain.forEach((terrainUnit) => {
            this.addChild(terrainUnit.getSprite(), ZIndices.Terrain);
        });
    },

    initPillar: function()  {
        this._pillar = new pillar.Pillar();

        this._pillar.setPosition(cc.p(cc.winSize.width/2.0, this._ground + this._pillar.getHitbox().height/2.0));
        this.addChild(this._pillar.getSprite(), ZIndices.Pillar);

        this.addChild(this._pillar.getBeam(), ZIndices.PillarBeam);
    },

    initHero: function()  {
        this._hero = new pillar.Hero();

        this._hero.setPosition(cc.p(300, this._ground + this._hero.getHitbox().height/2.0));

        this.addChild(this._hero.getSprite(), ZIndices.Hero);
    },

    initControls: function()  {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event)  {
                var layer = event.getCurrentTarget();
                layer.setControlState(keyCode, true);
                // cc.log("Key " + keyCode.toString() + " was pressed!");
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

        this.updateHero(delta);

        // this.updateCollisions(delta);

        this.updateCamera(delta);
    },

    updateHero: function(delta)  {
        if (this._hero.getState() === HeroState.Grounded && this._controls.jump === true) {
            this._hero.jump();
        }
        // else if (this._hero.getState() === HeroState.Jumping && this._controls.jump === false) {
        //     this._hero.fall();
        // }

        if (this._controls.right === true)  {
            this._hero.runRight();
        }
        else if (this._controls.left === true)  {
            this._hero.runLeft();
        }
        else  {
            this._hero.stand();
        }

        this._hero.update(delta, this._gravity, this._ground, this._terrain);
    },

    // updateCollisions: function(delta) {
    //     this._terrain.forEach((terrainUnit) => {
    //         this._hero.interactObstacles(terrainUnit);
    //     });
    // },

    updateCamera: function(delta) {
        var heroPos = this._hero.getPosition();
        var pos = this.getPosition();
        var visibleSize = cc.winSize;

        pos.x = (visibleSize.width/2) - heroPos.x;
        if (pos.x > 0) {
            pos.x = 0;
        }
        // else if (pos.x < (visibleSize.width*3) - (visibleSize.width/2)) {
        //     pos.x = (visibleSize.width*3) - (visibleSize.width/2);
        // }
        this.setPosition(pos);

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
