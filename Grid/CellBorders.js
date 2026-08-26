export { CellBorders };

class CellBorders {
    static Left = 1 << 0;
    static Right = 1 << 1;
    static Top = 1 << 2;
    static Bottom = 1 << 3;

    #borders = 0;

    AddBorder(border) {
        this.#borders = this.#borders | border;
    }

    RemoveBorder(border) {
        this.#borders = this.#borders & ~border;
    }

    HasBorder(border) {
        return (border & this.#borders) !== 0;
    }
}