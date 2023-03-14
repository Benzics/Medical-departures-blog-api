import { Router } from "express";

const router = Router();

// our index
router.get('/', (req, res) => {
    res.send('Hello world');
})

export { router as indexRoute }