/**
 * An readonly in-memory store.
 */
var executeQuery = require("../resource-query").executeQuery;
var extendSome = require("lazy").extendSome;
function MemoryObject(){}
MemoryObject.prototype = {
	getId: function(object){
		return this.id;
	}
}
exports.ReadonlyMemory = function(options){
	return {
		index: (options && options.index) || {},
		get: function(id){
			var object = new MemoryObject;
			var current = this.index[id];
			if(!current){
				return;
			}
			for(var i in current){
				if(current.hasOwnProperty(i)){
					object[i] = current[i];
				}
			}
			return object;
		},
		query: function(query, options){
			options = options || {};
			var all = [];
			for(var i in this.index){
				all.push(this.index[i]);
			}
			var result = executeQuery(query, options, all);
			// make a copy 
			return extendSome({
				some: function(callback){
					result.some(function(item){
						var object = {};
						for(var i in item){
							if(item.hasOwnProperty(i)){
								object[i] = item[i];
							}
						}
						return callback(object);
					});
				},
				length: result.length
			});
		}
	};
};