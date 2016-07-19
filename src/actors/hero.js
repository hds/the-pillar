'use strict';

var HeroState = {
    Grounded: 'Grounded',
    Jumping: 'Jumping',
    Falling: 'Falling',
    Firing: 'Firing',
};

var CollisionType = {
    'None': 'None',
    'Distant': 'Distant',
    'Behind': 'Behind',
    'On': 'On',
    'Under': 'Under',
    'Hit': 'Hit'
};

pillar.Hero = cc.Class.extend({
    // Intrinsic characteristics
    _jumpSpeed: 600,
    _acceleration: 5000,
    _runSpeed: 500,

    _sprite: null,
    _lastPos: cc.p(0, 0),
    _pos: cc.p(0, 0),
    _speed: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),
    _direction: 0,
    _state: HeroState.Grounded,
    _obstacles: [],

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
        this._lastPos = this._pos;
        this._pos = pos;
        this.updateSprite();
    },

    _setPositionWithoutLastPosUpdate: function(pos) {
        this._pos = pos;
        this.updateSprite();
    },

    getLastPosition: function() {
        return cc.p(this._lastPos);
    },

    _getHitboxWithPosition: function(pos) {
        var hitbox = cc.rect(pos.x + this._hitbox.x,
                             pos.y + this._hitbox.y,
                             this._hitbox.width,
                             this._hitbox.height);
        return hitbox;
    },

    getHitbox: function()  {
        return this._getHitboxWithPosition(this._pos);
        // var hitbox = cc.rect(this._pos.x + this._hitbox.x,
        //                      this._pos.y + this._hitbox.y,
        //                      this._hitbox.width,
        //                      this._hitbox.height);
        // return hitbox;
    },

    getLastHitbox: function() {
        return this._getHitboxWithPosition(this._lastPos);
    },

    getHalfHeight: function()  {
        return this.getHitbox().height/2;
    },

    getHalfWidth: function() {
        return this.getHitbox().width/2;
    },

    setState: function(state) {
        this._state = state;
    },

    getState: function() {
        return this._state;
    },

    jump: function()  {
        this.setState(HeroState.Jumping);
        this._speed.y += this._jumpSpeed;
    },

    fall: function() {
        this.setState(HeroState.Falling);
        this._speed.y = Math.min(this._speed.y, 0);
    },

    land: function()  {
        this.setState(HeroState.Grounded);
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

    update: function(delta, gravity, terrain)  {
        var pos = this.getPosition();


        // Vertical movement
        if (this.getState() === HeroState.Jumping || this.getState() === HeroState.Falling)  {
            var newYSpeed = this._speed.y + (gravity * delta);
            if (this._speed.y >= 0 && newYSpeed < 0) {
                this.fall();
            }
            this._speed.y += gravity * delta;
            pos.y += this._speed.y * delta;
        }
        else if (this._obstacles.length === 0) {
            this.fall();
        }

        // Horizontal movement.
        if (this._direction === -1)  {
            this._speed.x = Math.max(this._speed.x - (this._acceleration * delta),
                                     -this._runSpeed);
        }
        else if (this._direction === 1)  {
            this._speed.x = Math.min(this._speed.x + (this._acceleration * delta),
                                     this._runSpeed);

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

        this._obstacles = [];
        terrain.forEach((obstacle) => {
            var newPos = this.interactObstacle(pos, obstacle);
            pos = newPos;
        });

        this.setPosition(pos);
    },

    interactObstacle: function(pos, obstacle) {
        var hitbox = this._getHitboxWithPosition(pos);
        var lastHitbox = this.getLastHitbox();
        var obbox = obstacle.getHitbox();
        var lastObbox = obstacle.getHitbox(); // FIXME: obstacle.getLastHitbox();
        var lastPos = this.getLastPosition();
        var positionUpdated = false;
        var collision = CollisionType.None;

        function BOTTOM(b) { return b.y; }
        function TOP(b) { return b.y + b.height; }
        function LEFT(b) { return b.x; }
        function RIGHT(b) { return b.x + b.width; }

        var rectIntersectsRect = function (rectA, rectB) {
            return !(cc.rectGetMaxX(rectA) <= cc.rectGetMinX(rectB) ||
            cc.rectGetMaxX(rectB) <= cc.rectGetMinX(rectA) ||
            cc.rectGetMaxY(rectA) <= cc.rectGetMinY(rectB) ||
            cc.rectGetMaxY(rectB) <= cc.rectGetMinY(rectA));
        };

        if (rectIntersectsRect(hitbox, obbox)) {
            if (BOTTOM(lastHitbox) >= TOP(lastObbox)) {
                pos.y = TOP(lastObbox) + this.getHalfHeight();
                this.land();
                this._obstacles.push(obstacle);
            }
            else if (LEFT(lastHitbox) >= RIGHT(lastObbox)) {
                pos.x = RIGHT(lastObbox) + this.getHalfWidth();
            }
            else if (RIGHT(lastHitbox) <= LEFT(lastObbox)) {
                pos.x = LEFT(lastObbox) - this.getHalfWidth();
            }
            else if (TOP(lastHitbox) <= BOTTOM(lastObbox)) {
                pos.y = BOTTOM(lastObbox) - this.getHalfHeight();
                this.fall();
            }
        }

        return pos;
    }
});
