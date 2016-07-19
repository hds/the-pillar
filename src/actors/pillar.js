'use strict';

var BeamState = {
    Idle: 'Idle',
    CountDown: 'CountDown',
    Jumping: 'Jumping'
};

pillar.Pillar = cc.Class.extend({
    _sprite: null,
    _light: null,
    _pos: cc.p(0, 0),
    _hitbox: cc.rect(0, 0, 0, 0),
    _countdownStart: 1.0,
    _countdown: 0.5,
    _colour: 0,

    _state: BeamState.CountDown,
    _beam: null,

    ctor: function()  {
        // this._super();
        this.init();
    },

    init: function()  {
        // this._super();
        this.initSprite();
        this.initHitbox();

        this._beam = new cc.DrawNode();
        this._beam._radius = 0;
        this._beam._direction = 1;
        this._beam._state = BeamState.CountDown;
    },

    update: function(delta)  {
        this._countdown -= delta;

        if (this._countdown <= 0)  {
            this.switchLight();

            this._countdown = this._countdownStart;
            if (this._countdownStart > 0.2)  {
                this._countdownStart -= 0.1;
            }
            else if  (this._beam._state === BeamState.CountDown)  {
                this._beam._state = BeamState.Jumping;
                cc.log('Activate Pillar!');
            }
        }

        this.updateBeam(delta);
    },

    updateBeam: function(delta)  {
        if (this._beam._state === BeamState.Jumping)  {
            this._beam._radius += this._beam._direction * 1000 * delta;
            if (this._beam._radius > cc.winSize.width)
                this._beam._direction = -1;
            else if (this._beam._radius < 0)  {
                this._beam._radius = 0;
                this._beam._state = BeamState.Idle;
            }

            this._beam.clear();
            this._beam.drawDot(this._pos, this._beam._radius, cc.color('#ffffff'));
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

    getBeam: function()  {
        return this._beam;
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
