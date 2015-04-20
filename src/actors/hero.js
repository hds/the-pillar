'use strict';

pillar.HeroState = {
    'None': 'None',
    'Jumping': 'Jumping',
    'Firing': 'Firing',
};

pillar.Hero = cc.Class.extend({
    // Intrinsic characteristics
    _jumpSpeed: 500,
    _acceleration: 1000,
    _runSpeed: 500,

    _sprite: null,
    _pos: cc.p(0, 0),
    _speed: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),
    _isJumping: false,
    _direction: 0,

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
        return cc.p(this._pos);
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
    },

    getHalfHeight: function()  {
        return this.getHitbox().height/2;
    },

    isJumping: function()  {
        return this._isJumping;
    },

    jump: function()  {
        this._isJumping = true;
        this._speed.y += this._jumpSpeed;
    },

    land: function()  {
        this._isJumping = false;
        this._speed.y = 0;
    },

    runLeft: function()  {
        this._direction = -1;
    },

    runRight: function()  {
        this._direction = 1;
    },

    stand: function()  {
        this._direction = 0;
    },

    update: function(delta, gravity, ground)  {
        var pos = this.getPosition();

        // Vertical movement
        if (this._isJumping === true)  {
            this._speed.y += gravity * delta;
            pos.y += this._speed.y * delta;

            if (pos.y <= ground + this.getHalfHeight())  {
                pos.y = ground + this.getHalfHeight();
                this.land();
            }
        }

        // Horizontal movement.
        if (this._direction === -1)  {
            this._speed.x -= this._acceleration * delta;
            if (this._speed.x < -this._runSpeed)
                this._speed.x = -this._runSpeed;
        }
        else if (this._direction === 1)  {
            this._speed.x += this._acceleration * delta;
            if (this._speed.x > this._runSpeed)
                this._speed.x = this._runSpeed;

        }
        else if (this._direction === 0)  {
            if (this._speed.x > 0)  {
                this._speed.x -= this._acceleration * delta;
                if (this._speed.x < 0)
                    this._speed.x = 0;
            }
            else if (this._speed.x < 0)  {
                this._speed.x += this._acceleration * delta;
                if (this._speed.x > 0)
                    this._speed.x = 0;
            }
        }
        pos.x += this._speed.x * delta;


        this.setPosition(pos);
    }
});
