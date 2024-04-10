import { FirstPersonCamera } from "../World/firstPersonView";
import { State } from "./State";
import { TileNode } from "../World/TileNode";

export class CameraState extends FirstPersonCamera {
	constructor(camera, domElement, scene, gameMap, scary, haveBattery) {
		super(camera, domElement, scene, gameMap, scary);

		this.state = new IdleState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, scene, haveBattery, camera) {
		this.state.updateState(this);
		super.update(deltaTime, haveBattery, camera);
	}
}

export class IdleState extends State {
	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
		// console.log("idling");
	}

	updateState(player) {
		if (player.moving()) {
			player.switchState(new MovingState());
		}
		if (
			player.camera.position.distanceTo(player.scary.object.position) < 2.7 &&
			!player.scary.seen
		) {
			player.switchState(new GameOver());
		}
	}
}

export class MovingState extends State {
	enterState(player) {}

	updateState(player) {
		let node = player.gameMap.quantize(player.camera.position);

		if (
			player.gameMap.graph.getNode(node.x, node.z).type == TileNode.Type.End
		) {
			// console.log('Winner')
			player.switchState(new WinnerState());
		}
		if (!player.moving()) {
			player.switchState(new IdleState());
		} else {
		}
		if (
			player.camera.position.distanceTo(player.scary.object.position) < 2.7 &&
			!player.scary.seen
		) {
			player.switchState(new GameOver());
		}
	}
}

export class GameOver extends State {
	enterState(player) {
		console.log("DEAD");
		player.caught();
	}

	updateState(player) {}
}

export class WinnerState extends State {
	enterState(player) {
		console.log("Winner");
		player.winn = true;
		console.log(player.winn);
		player.scary.topSpeed = 0;
		player.win();
	}

	updateState(player) {}
}
