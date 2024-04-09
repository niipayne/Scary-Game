import { FirstPersonCamera } from "../World/firstPersonView";
import { State } from "./State";

export class CameraState extends FirstPersonCamera {
	constructor(camera, domElement, scene, gameMap, scary) {
		super(camera, domElement, scene, gameMap, scary);

		this.state = new IdleState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime) {
		this.state.updateState(this);
		super.update(deltaTime);
	}
}

export class IdleState extends State {
	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
		console.log("idling");
	}

	updateState(player) {
		if (player.moving()) {
			player.switchState(new MovingState());
		}

		if (player.camera.position.distanceTo(player.scary.object.position) < 4) {
			player.switchState(new GameOver());
		}
	}
}

export class MovingState extends State {
	enterState(player) {}

	updateState(player) {
		if (!player.moving()) {
			player.switchState(new IdleState());
		} else {
			console.log("moving");
		}
		if (player.camera.position.distanceTo(player.scary.object.position) < 4) {
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
