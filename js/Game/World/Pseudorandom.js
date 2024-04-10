export class Pseudorandom {
	
	constructor() {
		this.m = 134456;
		this.a = 8121;
		this.c = 28411;

		this.seed = this.m/2;
	}

	lcg(start, end) {
		this.seed = (this.a * this.seed + this.c) % this.m;
		let output = ((this.seed/this.m) * (end-start)) + start;
		return output;
	}

	halton(base, index, start, end) {

		let result = 0;
		let denominator = 1;

		while (index > 0) {
			denominator = denominator * base;
			result = result + (index % base) / denominator;
			index = Math.floor(index/base);
		}
		let output = ((result) * (end - start)) + start;
		return output;
	}
}