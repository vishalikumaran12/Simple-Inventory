let items = [
    {
        id: 1,
        name: "Keyboard",
        category: "Electronics",
        quantity: 20,
        price: 799
    },
    {
        id: 2,
        name: "Notebook",
        category: "Stationery",
        quantity: 50,
        price: 60
    }
];

let nextId = 3;

function getAllItems() {
    return items;
}

function getItemById(id) {
    return items.find(item => item.id === Number(id));
}

function addItem(data) {
    const newItem = {
        id: nextId++,
        ...data
    };

    items.push(newItem);
    return newItem;
}

function updateItem(id, data) {
    const item = getItemById(id);

    if (!item) return null;

    Object.assign(item, data);
    return item;
}

function deleteItem(id) {
    const index = items.findIndex(
        item => item.id === Number(id)
    );

    if (index === -1) return null;

    return items.splice(index, 1)[0];
}

module.exports = {
    getAllItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem
};