const { Inventory, User, History } = require('../models');

const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({ include: User });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id, { include: User });
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInventory = async (req, res) => {
  try {
    const { propiedad, it, area, responsable, serial, capacidad, ram, marca, status, location, warrantyExpiry } = req.body;
    const item = await Inventory.create({
      propiedad,
      it,
      area,
      responsable,
      serial,
      capacidad,
      ram,
      marca,
      status,
      location,
      warrantyExpiry,
      assignedTo: req.user.id
    });
    await History.create({ action: 'CREATE', tableName: 'Inventories', recordId: item.id, newValues: item.toJSON(), userId: req.user.id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    const oldValues = item.toJSON();
    const { propiedad, it, area, responsable, serial, capacidad, ram, marca, status, location, warrantyExpiry } = req.body;
    await item.update({
      propiedad,
      it,
      area,
      responsable,
      serial,
      capacidad,
      ram,
      marca,
      status,
      location,
      warrantyExpiry
    });
    await History.create({ action: 'UPDATE', tableName: 'Inventories', recordId: item.id, oldValues, newValues: item.toJSON(), userId: req.user.id });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    await History.create({ action: 'DELETE', tableName: 'Inventories', recordId: item.id, oldValues: item.toJSON(), userId: req.user.id });
    await item.destroy();
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllInventory, getInventoryById, createInventory, updateInventory, deleteInventory };