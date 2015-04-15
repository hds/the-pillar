'use strict';

pillar.Hero = cc.Class.extend({
    _sprite: null,
    _pos: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),

    ctor: function()  {
        // this._super();
        this.init();
    },

    init: function()  {
        // this._super();
        this.initSprite();
        this.initHitbox();
    },

    initSprite: function()  {
        this._sprite = new cc.LayerColor(cc.color('#333333'), 64, 64);
        this._sprite.setAnchorPoint(0.5, 0.5);

        this.updateSprite();
    },

    updateSprite: function()  {
        if (this._sprite)  {
            var size = this._sprite.getContentSize();
            this._sprite.setPosition(cc.p(this._pos.x - size.width/2.0,
                                         this._pos.y - size.height/2.0));
        }
    },

    getSprite: function()  {
        return this._sprite;
    },

    initHitbox: function()  {
        this._hitbox = cc.rect(-32, -32, 64, 64);
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
