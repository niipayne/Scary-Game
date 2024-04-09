import { State } from "./State";
import { Scary } from "./Scary.js";

export class EnemyState extends Scary {
	constructor(scene, gameMap, camera) {
		super(scene, gameMap, camera);
		this.camera = camera;

		this.state = new ApproachingState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap) {
		this.state.updateState(this);
		super.update(deltaTime, gameMap);
	}
}

export class ApproachingState extends State {
	enterState(enemy) {
		console.log("I KNOW WHERE YOU ARE");
	}

	updateState(enemy) {
		enemy.topSpeed = 1.5;
		enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));

		if (
			Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) < 15
		) {
			enemy.switchState(new SprintState());
		}
	}
}

export class SprintState extends State {
	enterState(enemy) {
		console.log("HEHEHHEHEHEHE");
	}

	updateState(enemy) {
		enemy.topSpeed = 25;
		enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));

		if (
			Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) > 15
		) {
			enemy.switchState(new ApproachingState());
		}
	}
}

export class FleeingState extends State {
	enterState(enemy) {
		console.log("HEHEHHEHEHEHE");
	}

	updateState(enemy) {
		enemy.topSpeed = 25;
		enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));

		if (
			Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) > 15
		) {
			enemy.switchState(new ApproachingState());
		}
	}
}
