function Promise(fn) {
    var state = 'pending',	
        value = null,		
        callbacks = [];		

    this.then = function (onFulfilled, onRejected) {	
        return new Promise(function (resolve, reject) {
            handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        });
    };

    function handle(callback) {
        if (state === 'pending') {		
            callbacks.push(callback);	
            return;						
        }

        var cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected,	
            ret;

        if( !(typeof cb === 'function') ){
        	cb = state === 'fulfilled' ? callback.resolve : callback.reject;
        	cb(value);
        	return;
        }

        try {	
            ret = cb(value);
            callback.resolve(ret);
        } catch (e) {
            callback.reject(e);
        } 
    }

    function resolve(newValue) {
    	
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function') && typeof newValue.then == 'function') {
      		newValue.then.call(newValue, resolve, reject);
            return;
        }
        state = 'fulfilled';	
        value = newValue;		
        execute();				
    }

    function reject(reason) {
        state = 'rejected';		 
        value = reason;			 
        execute();				 
    }

    function execute() {		
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }

    fn(resolve, reject);
}




// 测试
var a = new Promise( function(resolve, reject){
	console.log(1);
	resolve(new Promise((resolve,reject)=>{
		reject('error');
	}));
} ).then(function(data){
	console.log(data);
	return new Promise(function(resolve,reject){
		resolve(4);
	});
}, function(err){
	console.log(err);
	return new Promise(function(resolve,reject){
		resolve(4);
	});
}).then(data => {
	console.log(data);
	a.a();
}).then(1)
.then( data=>{
	console.log(data);
}, err=>{
	console.log(err);
} );