'use strict';

pillar.Pillar = cc.Class.extend({
    _sprite: null,
    _light: null,
    _pos: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),
    _countdownStart: 5.0,
    _countdown: 0.5,
    _colour: 0,

    ctor: function()  {
        // this._super();
        this.init();
    },

    init: function()  {
        // this._super();
        this.initSprite();
        this.initHitbox();
    },

    update: function(delta)  {
        this._countdown -= delta;

        if (this._countdown <= 0)  {
            this.switchLight();

            this._countdown = this._countdownStart;
            if (this._countdownStart > 0.2)
                this._countdownStart -= 0.1;
        }
    },

    initSprite: function()  {
        this._sprite = new cc.LayerColor(cc.color('#999999'), 16, 64);
        this._sprite.setAnchorPoint(0.5, 0.5);

        this._light = new cc.LayerColor(cc.color('#FFE10E'), 16, 8);
        this._light.setPosition(cc.p(0, 48));
        this._sprite.addChild(this._light);

        this._countdown = this._countdownStart;

        this.updateSprite();
    },

    updateSprite: function()  {
        if (this._sprite)  {
            var size = this._sprite.getContentSize();
            this._sprite.setPosition(cc.p(this._pos.x - size.width/2.0,
                                         this._pos.y - size.height/2.0));
        }
    },

    switchLight: function()  {
        if (this._colour === 0)
            this._light.setColor(cc.color('#FB000D'));
        else
            this._light.setColor(cc.color('#FFE10E'));

        this._colour = (this._colour + 1) % 2;
    },

    getSprite: function()  {
        return this._sprite;
    },

    initHitbox: function()  {
        this._hitbox = cc.rect(-16, -32, 32, 64);
    },

    getPosition: function()  {
        return this._pos;
    },

    setPosition: function(pos)  {
        this._pos = pos;
        this.updateSprite();
    },

    getHitbox: function()  {
        var hitbox = cc.rect(this._pos.x + this._hitbox.x,
                             this._pos.y + this._hitbox.y,
                             this._hitbox.width,
                             this._hitbox.height);
        return hitbox;
    }
});
