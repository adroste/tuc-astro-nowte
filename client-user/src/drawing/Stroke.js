
export class Stroke {
    constructor(color, thickness) {
        this.color = color;
        this.thickness = thickness;
    }

    apply(context) {
        context.strokeStyle = this.color;
        context.lineWidth = this.thickness;
    }
}