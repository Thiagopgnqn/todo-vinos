import * as wineTypeService from '../services/wineType.service.js';

export const getWineTypes = async (req, res, next) => {
  try {
    const types = await wineTypeService.getWineTypes();
    res.json(types);
  } catch (error) {
    next(error);
  }
};

export const createWineType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newType = await wineTypeService.createWineType(name);
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteWineType = async (req, res, next) => {
  try {
    const { id } = req.params;
    await wineTypeService.deleteWineType(id);
    res.json({ message: 'Tipo de vino eliminado con éxito' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

