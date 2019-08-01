;(function(){
var f = 'index';
indexedDB.deleteDatabase(f);
var o = indexedDB.open(f, 1), ind = {}, db;
o.onupgradeneeded = function(eve){ (eve.target.result).createObjectStore(f) }
o.onsuccess = function(){ db = o.result }
o.onerror = function(eve){ console.log(eve||1); }
ind.put = function(key, data, cb){
	if(!db){ setTimeout(function(){ ind.put(key, data, cb) },9); return }
	var tx = db.transaction([f], 'readwrite');
	var obj = tx.objectStore(f);
	var req = obj.put(data, ''+key);
	req.onsuccess = obj.onsuccess = tx.onsuccess = function(){ cb(null, 1) }
	req.onabort = obj.onabort = tx.onabort = function(eve){ cb(eve||2) }
	req.onerror = obj.onerror = tx.onerror = function(eve){ cb(eve||3) }
}
ind.get = function(key, cb){
	if(!db){ setTimeout(function(){ ind.get(key, cb) },9); return }
	var tx = db.transaction([f], 'readwrite');
	var obj = tx.objectStore(f);
	var req = obj.get(''+key);
	req.onsuccess = function(){ cb(null, req.result) }
	req.onabort = function(eve){ cb(eve||4) }
	req.onerror = function(eve){ cb(eve||5) }
}
window.ind = ind;
}());


import {get as idbGet, set as idbSet} from 'idb-keyval';
async function main() {
    console.time('get/set');
    for (let i = 0; i < 500; i+=1) {
        await idbSet('foo', {a: 1});
        await idbGet('foo');
    }
	// 3981ms, 251ops/sec
    console.timeEnd('get/set');

    console.time('write-only');
    for (let i = 0; i < 1000; i+=1) {
        await idbSet('foo', {a: 1});
    }
    // 6401ms, 156ops/sec
    console.timeEnd('write-only');

    console.time('read-only');
    for (let i = 0; i < 10000; i+=1) {
        await idbGet('foo');
    }
    // 4087ms, 2447ops/sec
    console.timeEnd('read-only');

    console.time('Parallel read');
    await Promise.all(new Array(10000).fill(0).map(() => idbGet('foo')));
    // 1521ms, 6574ops/sec
    console.timeEnd('Parallel read');

    console.time('Parallel write');
    await Promise.all(new Array(1000).fill(0).map(() => idbSet('foo' + Math.random().toFixed(4), {a: 1})));
    // 5494ms, 182ops/sec
    console.timeEnd('Parallel write');

    console.time('get/set');
    for (let i = 0; i < 500; i+=1) {
        await new Promise((resolve, reject) => window.ind.put('foo', {a: 1}, (err) => err ? reject(err) : resolve()));
        await new Promise((resolve, reject) => window.ind.get('foo', (err) => err ? reject(err) : resolve()));
    }
	// 3310ms, 302ops/sec
    console.timeEnd('get/set');

    console.time('write-only');
    for (let i = 0; i < 1000; i+=1) {
        await new Promise((resolve, reject) => window.ind.put('foo', {a: 1}, (err) => err ? reject(err) : resolve()));
    }
    // 5862ms, 170ops/sec
    console.timeEnd('write-only');

    console.time('read-only');
    for (let i = 0; i < 10000; i+=1) {
        await new Promise((resolve, reject) => window.ind.get('foo', (err) => err ? reject(err) : resolve()));
    }
    // 2385ms, 4192ops/sec
    console.timeEnd('read-only');

    console.time('Parallel read');
    await Promise.all(new Array(10000).fill(0).map(() => {
        return new Promise((resolve, reject) => window.ind.get('foo', (err) => err ? reject(err) : resolve()));
	}));
    // 2240ms, 4464ops/sec
    console.timeEnd('Parallel read');

    console.time('Parallel write');
    await Promise.all(new Array(1000).fill(0).map(() => {
        return new Promise((resolve, reject) => window.ind.put('foo' + Math.random().toFixed(4), {a: 1}, (err) => err ? reject(err) : resolve()));
	}));
    // 4464ms, 224ops/sec
	console.timeEnd('Parallel write');
}

main();
