export { GridPuzzle };
import { GridBase, ProgressTrack } from './index.js';

class GridPuzzle {
    //#region Private Variables

    #id;
    #title;
    #instructions;
    /** @type {ProgressTrack[]} */
    #progressTracks = [];
    #gridType;
    #arguments = [];

    //#endregion

    //#region Properties

    get Id() {
        return this.#id;
    }
    get Title() {
        return this.#title;
    }
    get Instructions() {
        return this.#instructions;
    }
    get ProgressTracks() {
        return this.#progressTracks;
    }
    get GridType() {
        return this.#gridType;
    }

    //#endregion

    /**
        @param id {string}
        @param title {string}
        @param instructions {string}
        @param progressTracks {ProgressTrack[]}
        @param gridType {any} A class type that inherits from GridBase.
    */
    constructor(id, title, instructions, progressTracks, gridType, args = []) {
        if (typeof gridType !== "function"
            || !('prototype' in gridType)
            || !(gridType.prototype instanceof GridBase))
            throw "Invalid grid type";

        this.#id = id;
        this.#title = title;
        this.#instructions = instructions;
        this.#progressTracks = progressTracks;
        this.#gridType = gridType;
        this.#arguments = args;
    }

    CreateGrid(canvasId, leftX, topY) {
        return new this.GridType.prototype.constructor(canvasId, leftX, topY, this.ProgressTracks, ...this.#arguments);
    }
}
