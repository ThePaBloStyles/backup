import { getItems, postItem, putItem, putPrice, getItemById } from "@/controllers/Item.controller";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
import { Router } from "express";

const router = Router()



router.post('/', postItem)
router.get('/', getItems)
router.get('/:id', getItemById)
router.put('/', putItem)
router.put('/price', putPrice)
router.delete('/', require('@/controllers/Item.controller').deleteItem)

// Endpoint para subir imagen
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }
  // Devuelve la ruta relativa para guardar en el producto
  const url = `/uploads/${req.file.filename}`;
  res.status(200).json({ url });
});


export default router