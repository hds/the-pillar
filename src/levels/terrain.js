'use strict';

pillar.TerrainUnitType = {
    None: ' ',
    Ground: '=',
    Platform: '*'
};

pillar.TerrainUnit = cc.Class.extend({
    _sprite: null,
    _size: 0,
    _type: pillar.TerrainUnitType.None,
    _pos: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),

    ctor: function(size, pos, type)  {
        this.init(size, pos, type);
    },

    init: function(size, pos, type)  {
        this._size = size;

        var colourCode = '#000';
        console.log('New terrain:', pos, type);
        switch (type) {
            case pillar.TerrainUnitType.Ground:
                colourCode = '#4BC9C0';
                break;
            case pillar.TerrainUnitType.Platform:
                colourCode = '#EDB624';
                break;
        }
        this._type = type;

        this._sprite = new cc.LayerColor(cc.color(colourCode),
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
