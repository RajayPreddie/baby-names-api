import { Router } from 'express';
import BabyName from '../models/BabyName';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const babyNames = await BabyName.findAll();
    res.json(babyNames);
  } catch (error) {
    res.status(500).json({ error: error});
  }
});

export default router;
