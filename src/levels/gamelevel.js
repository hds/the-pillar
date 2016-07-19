'use strict';

var ZIndices = {
    Background: 0,
    Ground: 1,
    Terrain: 2,

    PillarBeam: 5,
    Hero: 10,
    Pillar: 20
};

pillar.LevelLayer = cc.Layer.extend({
    // Level physics
    _gravity: -1000,

    _hero: null,
    _pillar: null,
    _ground: 64,
    _worldSize: cc.size(0, 0),
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
        // this.initPillar();

        // Initialise Blokk.
        this.initHero();

        this.scheduleUpdate();

        return true;
    },

    initWorld: function()  {
        var terrainWidth = 8*4;
        var terrainHeight = 12;
        var terrainUnitSize = 64;
        var terrainMap =
            "********************************" +
            "*                              *" +
            "*                              *" +
            "*                              *" +
            "*             **********    ****" +
            "*         p                   **" +
            "*       ****                   *" +
            "*                              *" +
            "*      *      **               =" +
            "*                   ===      ===" +
            "***        **      =====    ====" +
            "================================";

        // Sanity check.
        if (terrainMap.length % terrainWidth !== 0) {
            cc.error("Invalid map data: Terrain map size doesn't match width.");
            return;
        }
        else if (terrainMap.length / terrainWidth !== terrainHeight) {
            cc.error("Invalid map data: Terrain map size doesn't match height.");
            return;
        }

        // Set the size of the world and the background.
        this._worldSize = cc.size(terrainWidth * terrainUnitSize,
                                  terrainHeight * terrainUnitSize);
        var background = new cc.LayerColor(cc.color('#B0ECF7'),
                                           this._worldSize.width,
                                           this._worldSize.height);
        this.addChild(background, ZIndices.Background);

        // Create objects from map.
        for (var idx = 0; idx < terrainWidth*terrainHeight; idx++) {
            var pos = cc.p(idx % terrainWidth,
                           terrainHeight - 1 - Math.floor(idx / terrainWidth));
            var terrainType = terrainMap.charAt(idx);
            if (terrainType === 'p') {
                if (this._pillar !== null) {
                    console.error("Multiple pillars cannot be!");
                    return;
                }
                this._pillar = new pillar.Pillar();
                this._pillar.setPosition(cc.p((pos.x + 0.5) * terrainUnitSize,
                                              (pos.y * terrainUnitSize) + this._pillar.getHitbox().height/2.0));
                this.addChild(this._pillar.getSprite(), ZIndices.Pillar);
                this.addChild(this._pillar.getBeam(), ZIndices.PillarBeam);
            }
            else if (terrainType !== ' ') {
                var terrainUnit = new pillar.TerrainUnit(terrainUnitSize, pos, terrainType);
                this._terrain.push(terrainUnit);
            }
        }

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

        var pillarPos = this._pillar.getPosition();
        this._hero.setPosition(cc.p(pillarPos));

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

        pos = cc.p((visibleSize.width/2) - heroPos.x,
                   (visibleSize.height/2) - heroPos.y);
        pos.x = (visibleSize.width/2) - heroPos.x;

        if (pos.x > 0) {
            pos.x = 0;
        }
        else if (pos.x < -(this._worldSize.width - visibleSize.width)) {
            pos.x = -(this._worldSize.width - visibleSize.width);
        }

        if (pos.y > 0) {
            pos.y = 0;
        }
        else if (pos.y < -(this._worldSize.height - visibleSize.height)) {
            pos.y = -(this._worldSize.height - visibleSize.height);
        }


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
