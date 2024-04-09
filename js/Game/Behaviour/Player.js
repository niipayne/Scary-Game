import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { Character } from './Character.js';
import { State } from './State';
import * as THREE from 'three';
import { TileNode } from '../World/TileNode.js';


export class Player extends Character {

	constructor(colour) {
		super(colour);
		this.frictionMagnitude = 20;
		// let coneMat = new THREE.

		// State
		this.state = new IdleState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap, controller, camera) {
		this.state.updateState(this, controller, camera, gameMap);
		// console.log(gameMap.quantize(this.location).type == TileNode.Type.Ground)
		super.update(deltaTime, gameMap);
	}


}

export class IdleState extends State {

	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
	}

	updateState(player, controller) {
		if (controller.moving()) {
			player.switchState(new MovingState());
		}
	}

}



export class MovingState extends State {

	enterState(player) {
	}

	updateState(player, controller, camera, gameMap) {
		player.location = camera.position.clone()
		if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			let node = gameMap.quantize(player.location)
			if (gameMap.graph.getNode(node.x, node.z).type == TileNode.Type.End) {
				console.log('Winner')
			}
		}	
	}
  
}
