var DEGREES_TO_RADIANS = Math.PI / 180.0;

function Vector( x, y ){
	this.x = x;
	this.y = y;
	return this;
}

function RandomVector( min, max ){
	var a = Math.random() * Math.PI * 2;
	var size = Math.random() * ( max - min ) + min;
	return new Vector( Math.cos(a) * size, Math.sin(a) * size );
}

Vector.prototype.size = function(){
	return Math.sqrt( this.x * this.x + this.y * this.y );
}

Vector.prototype.mult = Vector.prototype.scale = function(s){
	return new Vector( this.x * s, this.y * s );
}

// offset vector by a vector (passed as x) or two coordinates (passed as x and y)
Vector.prototype.add = function( x, y ){
	if( typeof y == 'undefined' ){
		y = x.y;
		x = x.x;
	}
	return new Vector( this.x + x, this.y + y );
}

// rotate vector a degrees anticlockwise
Vector.prototype.rotate = function( a ){
	var r = a * DEGREES_TO_RADIANS;
//	console.log(a + ' degrees == ' + r + ' radians');
	var x = this.y * Math.sin(r) - this.x * Math.cos(r);
	var y = this.y * Math.cos(r) + this.x * Math.sin(r);
	return new Vector(x,y);
}

Vector.prototype.log = function(){
	console.log( "(" + this.x + ", " + this.y + ")" );
	return this;
}

// distance to another vector or x,y pair
Vector.prototype.distance = function( x, y ){
	if( typeof y == 'undefined' ){
		y = x.y;
		x = x.x;
	}
	var v = new Vector( this.x - x, this.y - y );
	return v.size();
}

Vector.prototype.equals = function( v, tolerance ){
	if( typeof tolerance == 'undefined' ){
		tolerance = 0.02;
	}
	return this.distance( v ) <= tolerance;
}

function Rect( x, y, w, h ){
	this.position = new Vector( x, y );
	this.w = w;
	this.h = h;
	return this;
}

// calculate the line passing through two points
function Segment( p0, p1 ){
	// y = mx + b
	this.p0 = p0;
	this.p1 = p1;
	var dy = p1.y - p0.y;
	var dx = p1.x - p0.x;
	this.m = dx != 0 ? 1.0 * dy / dx : 0 ;
	this.b = p0.y - this.m * p0.x;
	// b = y - mx;
	
	// console.log( p0, p1, 'segment: y = ' + this.m + 'x + ' + this.b );
	
}

Segment.prototype.intersects = function( otherLine ){
	// parallel and not-coincident
	if( this.m == otherLine.m ){
		// console.log( 'y = ' + this.m + 'x + ' + this.b + ' and y = ' + otherLine.m + 'x + ' + otherLine.b + ' are parallel' );
		return Math.abs( this.b - otherLine.b ) < 0.5;
	}
	var x = ( this.b - otherLine.b ) / ( otherLine.m - this.m );
	var p = new Vector( x, x * this.m + this.b );
	
	// console.log( 'y = ' + this.m + 'x + ' + this.b + ' and y = ' + otherLine.m + 'x + ' + otherLine.b + ' intersect at (' + p.x + ', ' + p.y + ')' );
	var d = this.p0.distance( this.p1 );
	if( this.m == 0 ){
		return p.distance( otherLine.p0 ) <= d && p.distance( otherLine.p1 ) <= d;
	} else {
		if( p.distance( this.p0 ) <= d && p.distance( this.p1 ) <= d ){
			console.log( this, otherLine, 'y = ' + this.m + 'x + ' + this.b + ' and y = ' + otherLine.m + 'x + ' + otherLine.b + ' intersect at (' + p.x + ', ' + p.y + ')' );
		}
		return p.distance( this.p0 ) <= d && p.distance( this.p1 ) <= d;
	}
}