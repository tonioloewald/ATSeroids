// require sprite.js

function Ship( x, y, bounds ){
	this.Sprite = Sprite;
	this.Sprite( x, y, 100, 100, bounds );
	this.acceleration = new Vector( 0, -200 );
	this.rotationalAcceleration = 720;
	this.maxRotationalVelocity = 180;
	this.maxVelocity = 500;
	this.controls = {
		up : false,
		left: false,
		right: false,
		fire: false,
		hyperspace: false
	};
	
	this.bindings = {
		"38": "up",
		"37": "left",
		"39": "right",
		"32": "fire",
		"27": "hyperspace"
	}
	
	// add listeners
	
	var ship = this;
	
	function keydown( evt ){
		var setting = ship.bindings[ evt.keyCode.toString() ];
		if( setting ){
			ship.controls[setting] = true;
		}
	}
	
	function keyup( evt ){
		var setting = ship.bindings[ evt.keyCode.toString() ];
		if( setting ){
			ship.controls[setting] = false;
		}
	}
	
	if( document.addEventListener ){
		document.addEventListener( 'keydown', keydown, false );
		document.addEventListener( 'keyup', keyup, false );
	} else {
		document.onkeydown = keydown;
		document.onkeyup = keyup;
	}
	
	return this;
}

Ship.prototype = new Sprite;

Ship.prototype.log = function(){
	var s = [];
	for( var setting in this.controls ){
		s.push( setting + ': ' + this.controls[setting] );
	}
	console.log( s.join(', ') );
	return this;
}

Ship.prototype.update = function(){
	Sprite.prototype.update.apply( this );
	
	if( ship.controls.left ){
		this.rotationalVelocity += this.rotationalAcceleration * this.elapsedTime;
	}
	
	if( ship.controls.right ){
		this.rotationalVelocity -= this.rotationalAcceleration * this.elapsedTime;
	}
	
	if( !ship.controls.left && !ship.controls.right ){
		this.rotationalVelocity -= this.rotationalVelocity * this.elapsedTime * 4;
		if( Math.abs(this.rotationalVelocity) < 0.5 ){
			this.rotationalVelocity = 0;
		}
	}
	
	if( Math.abs(this.rotationalVelocity) > this.maxRotationalVelocity ){
		if( this.rotationalVelocity > 0 ){
			this.rotationalVelocity = this.maxRotationalVelocity;
		} else {
			this.rotationalVelocity = -this.maxRotationalVelocity;
		}
	}
	
	if( ship.controls.up ){
		var deltaV = this.acceleration.rotate( this.rotation ).mult(this.elapsedTime);
		this.velocity = this.velocity.add( deltaV );
	}
	
	if( this.velocity.size() > this.maxVelocity ){
		this.velocity = this.velocity.scale( this.maxVelocity / this.velocity.size() );
	}
		
	return this;
}