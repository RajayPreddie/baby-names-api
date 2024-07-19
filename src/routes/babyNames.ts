import { Router } from 'express';
import BabyName from '../models/BabyName';

// Instantiate the router
const router = Router();

// Obtain all baby names
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


// Get baby names by birth year
router.get('/year/:year', async (req, res) => {
  const {year} = req.params;

  try {
    const babyNames = await BabyName.findAll({
      where: {birth_year: year}
    });
    res.json(babyNames);
  }

  catch (error) {
    res.status(500).json({ error: 'Failed to fetch baby names' });
  }
});
export default router;
