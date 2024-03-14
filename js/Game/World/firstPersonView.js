import { InputController } from "./InputController";
import * as THREE from "three";

const KEYS = {
	a: 65,
	s: 83,
	w: 87,
	d: 68,
};

// Creating the FPV
export class FirstPersonCamera {
	constructor(camera) {
		this.camera = camera;
		this.input = new InputController();
		this.rotation = new THREE.Quaternion();
		this.translation = new THREE.Vector3(0, 2, 0);
		this.phi = 0;
		this.theta = 0;
	}

	clamp(x, a, b) {
		return Math.min(Math.max(x, a), b);
	}

	update(deltaTime) {
		this.updateRotation(deltaTime);
		this.updateTranslation(deltaTime);
		this.updateCamera(deltaTime);
		this.input.update(deltaTime);
	}

	updateTranslation(deltaTime) {
		const forward =
			(this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
		const side =
			(this.input.key(KEYS.a) ? 1 : 0) + (this.input.key(KEYS.d) ? -1 : 0);

		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);

		const forwardV = new THREE.Vector3(0, 0, -1);
		forwardV.applyQuaternion(qx);
		forwardV.multiplyScalar(forward * deltaTime * 10);

		const sideV = new THREE.Vector3(-1, 0, 0);
		sideV.applyQuaternion(qx);
		sideV.multiplyScalar(side * deltaTime * 10);

		this.translation.add(forwardV);
		this.translation.add(sideV);
	}

	updateCamera() {
		this.camera.quaternion.copy(this.rotation);
		this.camera.position.copy(this.translation);
	}

	updateRotation(deltaTime) {
		const xh = this.input.mouse.mouseXDelta / window.innerWidth;
		const yh = this.input.mouse.mouseYDelta / window.innerHeight;

		this.phi += -xh * 5;
		this.theta = this.clamp(this.theta + -yh * 5, -Math.PI / 3, Math.PI / 3);

		const qx = new THREE.Quaternion();
		qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
		const qz = new THREE.Quaternion();
		qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);

		const q = new THREE.Quaternion();
		q.multiply(qx);
		q.multiply(qz);

		this.rotation.copy(q);
	}
}
