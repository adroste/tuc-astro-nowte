
export class StrokeStyle {
    /**
     * @param {string} [color='black'] color, e.g. 'white', '#f0f0f0'
     * @param {number} [thickness=3] stroke thickness (line width)
     */
    constructor(color = 'black', thickness = 3) {
        this.color = color;
        this.thickness = thickness;
    }


    /**
     * Applies style to rendering context
     * @param {Object} context canvas rendering context
     */
    apply(context) {
        context.strokeStyle = this.color;
        context.lineWidth = this.thickness;
        context.lineJoin = 'round';
    }
}