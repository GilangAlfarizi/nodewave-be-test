import {
	handleServiceErrorWithResponse,
	response_created,
	response_success,
} from "$utils/response.utils";
import { Request, Response } from "express";
import * as BookService from "$services/BookService";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";

export async function getTempData(
	req: Request,
	res: Response
): Promise<Response> {
	const tempDataResponse = await BookService.getAllTempData();

	if (!tempDataResponse.status)
		return handleServiceErrorWithResponse(res, tempDataResponse);

	return response_success(res, tempDataResponse.data, "Success");
}

export async function getBookData(
	req: Request,
	res: Response
): Promise<Response> {
	const filterQuery = checkFilteringQueryV2(req);
	const bookDataResponse = await BookService.getAllBookData(filterQuery);

	if (!bookDataResponse.status)
		return handleServiceErrorWithResponse(res, bookDataResponse);

	return response_success(res, bookDataResponse.data, "Success");
}

//this is temporary data only, save in cache for better performance
export async function importTemp(
	req: Request,
	res: Response
): Promise<Response> {
	const sheetData = await BookService.parseXlsx(req.file);
	if (!sheetData) return handleServiceErrorWithResponse(res, sheetData);

	const importTempBookResponse = await BookService.importTempBook(sheetData);

	if (!importTempBookResponse.status)
		return handleServiceErrorWithResponse(res, importTempBookResponse);

	const totalData = importTempBookResponse.data.length;
	return response_created(
		res,
		importTempBookResponse.data,
		`${totalData} Books uploaded successfully`
	);
}

export async function importBook(
	req: Request,
	res: Response
): Promise<Response> {
	const createBooksResponse = await BookService.createBooks();

	if (!createBooksResponse.status)
		return handleServiceErrorWithResponse(res, createBooksResponse);

	const totalData = createBooksResponse.data.length;
	return response_created(
		res,
		createBooksResponse.data,
		`${totalData} Books imported successfully`
	);
}
