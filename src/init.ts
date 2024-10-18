import { delay } from 'ver/helpers';

import { Node } from 'lib/scenes/Node';
import { ProcessSystem } from 'lib/scenes/Node';
import { RenderSystem } from 'lib/scenes/CanvasItem';
import { ControllersSystem } from 'lib/scenes/Control';

import { AnimationManager } from '@/animations';
import { canvas, mainloop, touches, viewport } from '@/canvas';
import { socket } from '@/socket';

import { MainScene } from '@/scenes/MainScene';


const app = document.querySelector<HTMLDivElement>('#app')!;
//@ts-ignore
window.ondblclick = () => app.webkitRequestFullscreen();

const GUIElement = document.querySelector<HTMLDivElement>('#GUI')!;
GUIElement; // NOTE: можно подключить react или что то еще по желанию


canvas.on('resize', size => viewport.size.set(size), 1000).call(canvas, canvas.size, canvas.pixelRatio);


export const processSystem = new ProcessSystem();
export const renderSystem = new RenderSystem();
export const controllersSystem = new ControllersSystem(touches, viewport);

mainloop.on('update', dt => controllersSystem.update(dt), 1000);
mainloop.on('update', dt => processSystem.update(dt), -50);
mainloop.on('update', () => renderSystem.update(viewport), -100);
mainloop.on('update', () => canvas.render(), -100);
mainloop.on('update', dt => touches.nullify(dt), -10000);


export const anims = new AnimationManager();
mainloop.on('update', dt => { for(const anim of anims.anims) anim.tick(dt); }, -200);


const write_address = Promise.withResolvers<string>();

const input_address = document.createElement('input');
input_address.value = 'localhost:5000';
input_address.placeholder = 'address';
input_address.inputMode = 'search';
input_address.onkeyup = e => e.key === 'Enter' && write_address.resolve(input_address.value);

GUIElement.append(input_address);

(async () => {
	try {
		let error: string = '';

		const address = await write_address.promise;

		await Promise.all([socket.connect(`ws://${address}/server`), (async () => {
			console.log('connecting...');

			delay(10000, () => {
				if(!socket.isConnected) error = `Connect error timeout (${address})`;
			});

			let i = 0; while(true) {
				if(error) break;

				if(socket.isConnected) {
					console.log('connected');

					GUIElement.innerHTML = `<h2 style="color: #eeeeee; font-family: arkhip">Connected</h2>`;
					await delay(200);
					GUIElement.innerHTML = ``;

					break;
				}

				GUIElement.innerHTML = `<h2 style="color: #eeeeee; font-family: arkhip">
					Connecting to server${'.'.repeat(i = ++i % 4)}
				</h2>`;

				if(!socket.isConnected) await delay(500);
			}

			if(error) throw error;
		})()]);
	} catch(err) {
		console.error(err);
		GUIElement.innerHTML = `<h4 style="color: #ee7777; font-family: arkhip">${err}<h4>`;
	}


	await Node.load();
	const root_node = new Node();
	await root_node.init();

	processSystem.addRoot(root_node);
	renderSystem.addRoot(root_node);
	controllersSystem.addRoot(root_node);

	await MainScene.load();
	const main_scene = new MainScene();
	await main_scene.init();

	root_node.addChild(main_scene);
})();
