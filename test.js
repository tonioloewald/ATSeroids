function assert( condition ){
	if( eval( condition ) ){
		console.log( condition + ' [OK]' );
	} else {
		console.log( condition + ' [FAILED]' );
	}
}