import { Router } from "express";
import * as BookController from "$controllers/books/BookController";
import multer from "multer";
import { checkToken } from "$middlewares/checkToken";

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const BookRoutes = Router({ mergeParams: true }); // mergeParams = true -> to enable parsing query params

BookRoutes.post("/temp", checkToken, upload.single("file"), BookController.importTemp);
BookRoutes.post("/", checkToken, BookController.importBook);
BookRoutes.get("/temp", checkToken, BookController.getTempData);
BookRoutes.get("/", checkToken, BookController.getBookData);

export default BookRoutes;
