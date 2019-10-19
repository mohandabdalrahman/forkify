import uniqid from 'uniqid';
export default class list {
    constructor() {
        this.items = [];
    }

    addItem(unit, count, ingredient) {
        const item = {
            id: uniqid(),
            unit,
            count,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    updateItem(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}