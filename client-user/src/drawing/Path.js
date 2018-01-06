
export class Path
{
    constructor(stroke, points) {
        this.stroke = stroke;
        this.points = points ? points : [];
    }

    addPoint(point) {
        this.points.push(point);
    }
}