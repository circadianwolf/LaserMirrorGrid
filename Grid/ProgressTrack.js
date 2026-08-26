export { ProgressTrack };

class ProgressTrack {
    Name;
    Display;
    MaxValue;
    /** @type {string} */
    ElementId;

    /**
     * @param {string} name
     * @param {string} display
     * @param {number} maxValue
     */
    constructor(name, display, maxValue) {
        this.Name = name;
        this.Display = display;
        this.MaxValue = maxValue;
    }
}