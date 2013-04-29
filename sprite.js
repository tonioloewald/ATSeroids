// requires vector.js

function Sprite( x, y, width, height, wrapBounds ){
	this.position = new Vector( x, y );
	this.w = width;
	this.h = height;
	this.rotation = 0; // straight up
	this.rotationalVelocity = 0;
	this.color = 'rgb(255,255,255)';
	this.strokeWidth = 0.5;
	this.velocity = new Vector( 0, 0 );
	this.lastUpdate = (new Date()).getTime();
	this.elapsedTime = 0.0;
	this.wrap = typeof wrapBounds !== 'undefined' ? wrapBounds : false ;
	this.path = false;
	this.scale = 1.0;
	this.debug = {};
	this.recalcCollisionRadius();
	return 
}

Sprite.prototype.recalcCollisionRadius = function(){
	var path = this.path;
	if( path ){
		this.collisionRadius = 0;
		for( var i = 0; i < path.points.length; i++ ){
			var s = path.points[i].size();
			if( s > this.collisionRadius ){
				this.collisionRadius = s;
			}
		}
	} else {
		this.collisionRadius = Math.sqrt( this.w * this.w + this.h * this.h ) * 0.5;
	}
};

// draw the sprite in a canvas graphics context
Sprite.prototype.draw = function( g ){
	var x = this.position.x, y = this.position.y, w = this.w, h = this.h;
	
	g.save();
	
	g.translate( x, y );
	g.rotate( - this.rotation * DEGREES_TO_RADIANS );
	g.scale( this.scale, this.scale );
	g.beginPath();
	if( this.path ){
		this.path.draw( g );
	} else {
		g.moveTo( -w * 0.5, -h * 0.5 );
		g.lineTo( w * 0.5, -h * 0.5 );
		g.lineTo( w * 0.5, h * 0.5 );
		g.lineTo( -w * 0.5, h * 0.5 );
		g.lineTo( -w * 0.5, -h * 0.5 );
	}
	g.closePath();
	if (this.debug.collision){
		g.strokeStyle = 'rgb(255,0,0)';
	}else{
		g.strokeStyle = this.color;
	}
	
	g.lineWidth = this.strokeWidth;
	g.stroke();
	
	g.restore();
	
	return this;
}

Sprite.prototype.update = function( elapsedTime ){
	if( typeof elapsedTime == 'undefined' ){
		elapsedTime = (new Date()).getTime() - this.lastUpdate;
		this.lastUpdate += elapsedTime;
	} else {
		this.lastUpdate += (new Date()).getTime();
	}
	
	elapsedTime *= 0.001;
	
	this.elapsedTime = elapsedTime;
	
	this.rotation += this.rotationalVelocity * elapsedTime;
	this.position = this.position.add( this.velocity.mult( elapsedTime ) );
	
	if( this.wrap ){
		if( this.position.x < this.wrap.position.x ){
			this.position.x += this.wrap.w;
		} else if ( this.position.x > this.wrap.position.x + this.wrap.w ){
			this.position.x -= this.wrap.w;
		}
		
		if( this.position.y < this.wrap.position.y ){
			this.position.y += this.wrap.h;
		} else if ( this.position.y > this.wrap.position.y + this.wrap.h ){
			this.position.y -= this.wrap.h;
		}
	}
	
	return this;
}

Sprite.prototype.hitTest = function(otherSprite, g){
	// otherSprite is a sprite
	if (typeof otherSprite == "undefined"){
		return false;
	}
	return this.position.distance(otherSprite.position) <= this.collisionRadius + otherSprite.collisionRadius;
}