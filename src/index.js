import Gun from 'gun';
import 'gun/lib/rindexed';

const gun = Gun({localStorage: false});
window.Gun = Gun;
window.gun = gun;

const f = gun.get('foo1').put({id: 'foo1'});
gun.get('foo-set').set(f);
gun.get('foo-set').map().on(console.log);
