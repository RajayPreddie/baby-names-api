import { Router } from 'express';
import BabyName from '../models/BabyName';

const router = Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
  const offset = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

  try {
    const { count, rows } = await BabyName.findAndCountAll({
      limit: parseInt(limit as string, 10),
      offset: offset,
    });
    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(limit as string, 10)),
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch baby names' });
  }
});

export default router;
