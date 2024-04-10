import { State } from "./State";
import { Scary } from "./Scary.js";
import * as THREE from "three";

export class EnemyState extends Scary {
	constructor(scene, gameMap, camera) {
		super(scene, gameMap, camera);
		this.camera = camera;

		this.state = new ApproachingState();

		this.state.enterState(this, gameMap);
		this.runAway;
		this.runAwayNode;
	}

	switchState(state, gameMap) {
		this.state = state;
		this.state.enterState(this, gameMap);
	}

	update(deltaTime, gameMap) {
		this.state.updateState(this, gameMap);
		super.update(deltaTime, gameMap);
	}
}

export class ApproachingState extends State {
	enterState(enemy) {
		enemy.topSpeed = 1.5;
		console.log("I KNOW WHERE YOU ARE");
	}

	updateState(enemy, gameMap) {
		if (enemy.seen === true) {
			enemy.switchState(new SeenState(), gameMap);
		} else {
			enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));
			if (
				Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) < 12
			) {
				enemy.switchState(new SprintState(), gameMap);
			}
		}
	}
}

export class SprintState extends State {
	enterState(enemy) {
		console.log("HEHEHHEHEHEHE");
		enemy.topSpeed = 10;
	}

	updateState(enemy, gameMap) {
		enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));

		if (enemy.seen === true) {
			enemy.topSpeed = 0;
			enemy.switchState(new SeenState(), gameMap);
		} else if (Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) > 15) {
				enemy.switchState(new ApproachingState(), gameMap);
			}
	}
}

export class SeenState extends State {
	enterState(enemy) {
		enemy.topSpeed = 0;
		console.log("Interesting");
	}

	updateState(enemy, gameMap) {
		enemy.followAway(gameMap)
		if (enemy.seen === false) {
			enemy.switchState(new ApproachingState());
		}
	}
}
