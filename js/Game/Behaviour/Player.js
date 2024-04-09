import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { Character } from './Character.js';
import { State } from './State';
import * as THREE from 'three';


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
		this.state.updateState(this, controller, camera);
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

	updateState(player, controller, camera) {
		player.location = camera.position.clone()
		if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			if (player.location.x >= 30 && player.location.z >= 30) {
				console.log('Winner')
			}
		}	
	}
  
}
