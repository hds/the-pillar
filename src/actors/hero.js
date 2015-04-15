'use strict';

pillar.Hero = cc.Class.extend({
    sprite: null,
    pos: cc.p(0, 0),

    ctor: function()  {
        // this._super();
        this.init();
    },

    init: function()  {
        // this._super();
        this.initSprite();
    },

    initSprite: function()  {
        this.sprite = new cc.LayerColor(cc.color('#999999'), 40, 40);
        cc.log(this.sprite);
        this.sprite.setAnchorPoint(0.5, 0.5);

        this.updateSprite();
    },

    updateSprite: function()  {
        if (this.sprite)  {
            var size = this.sprite.getContentSize();
            this.sprite.setPosition(cc.p(this.pos.x - size.width/2.0,
                                         this.pos.y - size.height/2.0));
        }
    },

    getPosition: function()  {
        return this.pos;
    },

    setPosition: function(pos)  {
        this.pos = pos;
        this.updateSprite();
    }
});
