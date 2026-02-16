/* 
    Graphic Helper functions. Math Helper Functions
*/
let {
	getColor,
	fill,
	stroke,
	noStroke,
	noFill,
	strokeWeight,
	strokeCap,
	beginShape,
	endShape,
	vertex,
	curveVertex,
	quad,
	triangle,
	bezierVertex,
	bezier,
	line,
	point,
	rect,
	arcTo,
	arc,
	ellipse,
	pushMatrix,
	popMatrix,
	translate,
	random,
	lerp,
	map,
	constrain,
	dist,
	midpoint,
	mapToLine,
	edgeCheck,
	clamp,
	lerpAngle,
	normRandom,
	min
} = (function helpers() {
	//color modes
	let Stroke = true;
	let Fill = true;

	/**
	 * processes color inputs and returns a formatted RGBA color strind
	 * grayscale, grayscale with alpha, RGB, or RGBA
	 *
	 * @param {number|Object} [n1] - red value (also gradient object)
	 * @param {number} [n2] - green value (0-255) or alpha if no n3
	 * @param {number} [n3] - blue value (0-255)
	 * @param {number} [n4 = 255] - alpha value (0-255)
	 * @returns {string|CanvasGradient} rgba string or grad
	 */
	function getColor(n1 = 0, n2, n3, n4 = 255) {
		let r, g, b, a;

		if (n1?.isGrad) {
			return n1.grad;
		}

		if (n2 === undefined) {
			if (typeof n1 === "number" && (n1 < 0 || n1 > 255)) {
				[r, g, b, a] = [red(n1), green(n1), blue(n1), alpha(n1)];
			} else {
				[r, g, b, a] = [n1, n1, n1, 255];
			}
		} else if (n3 === undefined) {
			if (typeof n1 === "number" && (n1 < 0 || n1 > 255)) {
				[r, g, b, a] = [red(n1), green(n1), blue(n1), n2];
			} else {
				[r, g, b, a] = [n1, n1, n1, n2];
			}
		} else {
			[r, g, b, a] = [n1, n2, n3, n4];
		}
		const alphaNormalized = a / 255;
		return `rgba(${r}, ${g}, ${b}, ${alphaNormalized})`;
	}

	/**
	 * Sets the fill color and enables filling
	 * @param {number|string|Object} r - red, grayscale, hex, CSS string, or gradient
	 * @param {number} [g] - green or alpha
	 * @param {number} [b] - blue
	 * @param {number} [aVal] - alpha
	 */
	function fill(r, g, b, aVal) {
		if (typeof r === "string") {
			ctx.fillStyle = r;
		} else {
			ctx.fillStyle = getColor(r, g, b, aVal);
		}
		Fill = true;
	}

	/**
	 * Sets the stroke color and enables outlining
	 * @param {number|string|Object} r - Red, grayscale, hex, CSS string, or gradient
	 * @param {number} [g] - Green or alpha
	 * @param {number} [b] - Blue
	 * @param {number} [aVal] - Alpha
	 */
	function stroke(r, g, b, aVal) {
		if (typeof r === "string") {
			ctx.fillStyle = r;
		} else {
			ctx.strokeStyle = getColor(r, g, b, aVal);
		}
		Stroke = true;
	}

	/** disables shape outlines */
	function noStroke() {
		Stroke = false;
	}

	/** Disables shape fills */
	function noFill() {
		Fill = false;
	}

	/**
	 * sets the stroke thickness
	 * @param {number} s - line width in pixels.
	 */
	function strokeWeight(s) {
		ctx.lineWidth = s;
	}

	/**
	 * sets the style of line endings
	 * @param {CanvasLineCap} cap - "butt", "round", or "square"
	 */
	function strokeCap(cap) {
		ctx.lineCap = cap;
	}

	/** starts a new path */
	function beginShape() {
		ctx.beginPath();
	}

	/** fills and/or strokes the current path based on active settings */
	function endShape() {
		if (Fill) {
			ctx.fill();
		}
		if (Stroke) {
			ctx.stroke();
		}
	}

	/**
	 * Adds a straight line to the path.
	 * @param {number} x - Target X coordinate
	 * @param {number} y - Target Y coordinate
	 */
	function vertex(x, y) {
		ctx.lineTo(x, y);
	}

	/**
	 * Adds a quadratic Bezier curve to the path.
	 * @param {number} cx - Control point X
	 * @param {number} cy - Control point Y.
	 * @param {number} x - Anchor X
	 * @param {number} y - Anchor Y.
	 */
	function curveVertex(cx, cy, x, y) {
		ctx.quadraticCurveTo(cx, cy, x, y);
	}

	/**
	 * Draws a four-sided polygon.
	 * @param {number} x1..y4 - Coordinates for each corner.
	 */
	function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
		beginShape();
		vertex(x1, y1);
		vertex(x2, y2);
		vertex(x3, y3);
		vertex(x4, y4);
		vertex(x1, y1);
		endShape();
	}

	/**
	 * Draws a three-sided polygon.
	 * @param {number} x1..y3 - Coordinates for each corner.
	 */
	function triangle(x1, y1, x2, y2, x3, y3) {
		beginShape();
		vertex(x1, y1);
		vertex(x2, y2);
		vertex(x3, y3);
		vertex(x1, y1);
		endShape();
	}

	/**
	 * Adds a cubic Bezier curve to the path.
	 * @param {number} cx1 - First control X.
	 * @param {number} cy1 - First control Y.
	 * @param {number} cx2 - Second control X
	 * @param {number} cy2 - Second control Y.
	 * @param {number} x - Anchor X.
	 * @param {number} y - Anchor Y
	 */
	function bezierVertex(cx1, cy1, cx2, cy2, x, y) {
		ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
	}

	/**
	 * Draws a cubic Bezier curve.
	 * @param {number} x1,y1 - Start point.
	 * @param {number} cx1,cy1 - First control point
	 * @param {number} cx2,cy2 - Second control point.
	 * @param {number} x2,y2 - End point.
	 */
	function bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		bezierVertex(cx1, cy1, cx2, cy2, x2, y2);
		ctx.stroke();
	}

	/**
	 * Draws a straight line between two sets of coordinates.
	 * @param {number} x1 - Starting X coordinate.
	 * @param {number} y1 - Starting Y coordinate
	 * @param {number} x2 - Ending X coordinate.
	 * @param {number} y2 - Ending Y coordinate
	 */
	function line(x1, y1, x2, y2) {
		beginShape();
		vertex(x1, y1);
		vertex(x2, y2);
		endShape();
	}

	/**
	 * Draws a square point at the given coordinates.
	 * @param {number} x,y - position.
	 * @param {number} [s=2] - Point size
	 */
	function point(x, y, s) {
		if (s === undefined) {
			ctx.fillRect(x, y, 2, 2);
		}
		ctx.fillRect(x, y, s, s);
	}

	/**
	 * Adds a circular arc to the current path using degrees.
	 * @param {number} r - Diameter.
	 * @param {number} start,stop - Angles in degrees
	 */
	function arcTo(x, y, r, start, stop) {
		ctx.arc(x, y, r / 2, (start / 180) * Math.PI, (stop / 180) * Math.PI);
	}

	/**
	 * draws a scaled arc - see arcTo
	 * @param {number} w,h - width and height
	 */
	function arc(x, y, w, h, start, stop) {
		ctx.save();
		ctx.translate(x, y);
		ctx.scale(1, h / w);
		beginShape();
		arcTo(0, 0, w, start, stop);
		endShape();
		ctx.restore();
	}

	/**
	 * Draws an ellipse or circle at the specified coordinates.
	 * @param {number} x - Center X coordinate.
	 * @param {number} y - Center Y coordinate
	 * @param {number} w - Width of the ellipse.
	 * @param {number} h - Height of the ellipse.
	 */
	function ellipse(x, y, w, h) {
		w = Math.abs(w);
		h = Math.abs(h);
		arc(x, y, w, h, 0, 360);
	}

	/** saves the previous drawing state/transform */
	function pushMatrix() {
		ctx.save();
	}

	/** restores the previous drawing state/transform. */
	function popMatrix() {
		ctx.restore();
	}

	/**
	 * Shifts the drawing origin.
	 * @param {number} x - Horizontal offset.
	 * @param {number} y - Vertical offset.
	 */
	function translate(x, y) {
		ctx.translate(x, y);
	}

	/**
	 * Returns the unit sign of a number (-1, 1, or 0).
	 * @param {number} x - Input value.
	 * @returns {number}
	 */
	function sign(x) {
		return abs(x) / x || 0;
	}

	/**
	 * Generates a random number within a range.
	 * @param {number} min - Minimum value.
	 * @param {number} max - Maximum value.
	 * @returns {number}
	 */
	function random(min, max) {
		return Math.random() * (max - min + 1) + min;
	}

	/**
	 * Linearly interpolates between two values.
	 * @param {number} num1 - Start value.
	 * @param {number} num2 - End value.
	 * @param {number} amt - Interpolation amount (0.0 to 1.0).
	 * @returns {number}
	 */
	function lerp(num1, num2, amt) {
		return num1 + (num2 - num1) * amt;
	}

	/**
	 * Re-maps a number from one range to another.
	 * @param {number} num - Value to map.
	 * @param {number} start1,stop1 - Original range.
	 * @param {number} start2,stop2 - Target range.
	 * @returns {number}
	 */
	function map(num, start1, stop1, start2, stop2) {
		return start2 + ((num - start1) / (stop1 - start1)) * (stop2 - start2);
	}

	/**
	 * Constrains a value between a minimum and maximum.
	 * @param {number} num - Value to limit.
	 * @returns {number}
	 */
	function constrain(num, min, max) {
		return Math.max(Math.min(num, max), min);
	}

	/**
	 * Calculates the Euclidean distance between two 2D points.
	 * @param {number} x1 - First X coordinate.
	 * @param {number} y1 - First Y coordinate.
	 * @param {number} x2 - Second X coordinate.
	 * @param {number} y2 - Second Y coordinate.
	 * @returns {number} The distance between points.
	 */
	function dist(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}

	/**
	 * Calculates the midpoint between two 2D points.
	 * @param {number} Ax - First X coordinate.
	 * @param {number} Bx - Second X coordinate.
	 * @param {number} Ay - First Y coordinate.
	 * @param {number} By - Second Y coordinate.
	 * @returns {number[]} A coordinate pair as [x, y].
	 */

	function midpoint(Ax, Bx, Ay, By) {
		var mx = (Ax + Bx) / 2;
		var my = (Ay + By) / 2;

		return [mx, my];
	}

	/**
	 * Interpolates a point along a line segment by a percentage.
	 * @param {number} x1,y1 - Start coordinates.
	 * @param {number} x2,y2 - End coordinates.
	 * @param {number} percentage - Interpolation factor (0.0 to 1.0).
	 * @returns {{x: number, y: number}} The resulting point object.
	 */
	function mapToLine(x1, y1, x2, y2, percentage) {
		return {
			x: x1 * (1.0 - percentage) + x2 * percentage,
			y: y1 * (1.0 - percentage) + y2 * percentage,
		};
	}

	/**
	 * Detects Axis-Aligned Bounding Box (AABB) collision between two objects.
	 * @param {Object} a - First object with x, y, w, h properties.
	 * @param {Object} b - Second object with x, y, w, h properties.
	 * @returns {boolean} True if objects overlap.
	 */
	function edgeCheck(a, b) {
		return (
			a.x + a.w > b.x &&
			a.x < b.x + b.w &&
			a.y + a.h > b.y &&
			a.y < b.y + b.h
		);
	}

	/**
	 * Restricts a value within a specified range.
	 * @param {number} v - Value to clamp.
	 * @param {number} a - Minimum bound.
	 * @param {number} b - Maximum bound.
	 * @returns {number}
	 */
	function clamp(v, a, b) {
		return Math.max(a, Math.min(b, v));
	}

	/**
	 * Linearly interpolates between two angles in radians, handling wrap-around.
	 * @param {number} a - Start angle.
	 * @param {number} b - End angle.
	 * @param {number} t - Interpolation amount (0.0 to 1.0).
	 * @returns {number}
	 */
	function lerpAngle(a, b, t) {
		let diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
		return a + diff * t;
	}

	/**
	 * Draws a rectangle with support for individual corner radii.
	 * Supports rounded (positive) or scalloped (negative) corners.
	 *
	 * @param {number} x - Top-left X coordinate.
	 * @param {number} y - Top-left Y coordinate.
	 * @param {number} w - Rectangle width.
	 * @param {number} h - Rectangle height.
	 * @param {number} [r1=0] - Top-left radius (default for all corners).
	 * @param {number} [r2] - Top-right radius.
	 * @param {number} [r3] - Bottom-right radius.
	 * @param {number} [r4] - Bottom-left radius.
	 */
	function rect(x, y, w, h, r1 = 0, r2, r3, r4) {
		const maxR = Math.min(w, h) / 2;
		const limit = (val) => Math.max(-maxR, Math.min(val, maxR));
		const [tr1, tr2, tr3, tr4] = [r1, r2 ?? r1, r3 ?? r1, r4 ?? r1].map(limit);

		ctx.beginPath();

		ctx.moveTo(x, y + tr1);
		curveVertex(x, y, x + tr1, y);

		vertex(x + w - tr2, y);
		curveVertex(x + w, y, x + w, y + tr2);

		vertex(x + w, y + h - tr3);
		curveVertex(x + w, y + h, x + w - tr3, y + h);

		vertex(x + tr4, y + h);
		curveVertex(x, y + h, x, y + h - tr4);

		ctx.closePath();
		ctx.fill();
	}

	/**
	 * generates a random number between 0 and 1 with a normal distribution
	 *
	 * @returns {number} value between 0 and 1
	 */
	function gaussianRandom() {
		var sampSize = 7;
		var rand = 0;
		for (var i = 0; i < sampSize; i += 1) {
			rand += Math.random();
		}
		return rand / sampSize;
	}

	/**
	 * Generates a random integer within a specified range following a bell curve (gaussian)
	 *
	 * @param {number} start - the lower bound of the range (inclusive
	 * @param {number} end - the upper bound of the range (inclusive).
	 * @returns {number} A randomized integer biased toward the center of the range
	 */
	function normRandom(start, end) {
		return Math.floor(start + gaussianRandom() * (end - start + 1));
	}
	
	/**
	 * Returns the smaller number of two inputs
	 *
	 * @param {number} start - the lower bound of the range (inclusive
	 * @param {number} end - the upper bound of the range (inclusive).
	 */
	function min(a, b) {
	    let answer = a;
	    if(b < answer){
	        answer = b;
	    }
	    return answer;
	}
    
	return {
		getColor,
		fill,
		stroke,
		noStroke,
		noFill,
		strokeWeight,
		strokeCap,
		beginShape,
		endShape,
		vertex,
		curveVertex,
		quad,
		triangle,
		bezierVertex,
		bezier,
		line,
		point,
		rect,
		arcTo,
		arc,
		ellipse,
		pushMatrix,
		popMatrix,
		translate,
		sign,
		random,
		lerp,
		map,
		constrain,
		dist,
		midpoint,
		mapToLine,
		edgeCheck,
		clamp,
		lerpAngle,
		normRandom,
		min,
		//triangle,
	};
})();