import {
	INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
	ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { FilteringQueryV2 } from "$entities/Query";

const prisma = new PrismaClient();

export async function parseXlsx(file: any) {
	const wb = xlsx.read(file.buffer);
	return xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
}

export async function importTempBook(
	bookTempDatas: any[]
): Promise<ServiceResponse<any>> {
	try {
		let createdDatas = [];

		for (const bookTempData of bookTempDatas) {
			const checkExist = await prisma.tempBook.findFirst({
				where: bookTempData,
			});
			if (checkExist) continue;

			const data = await prisma.tempBook.create({ data: bookTempData });
			createdDatas.push(data);
		}

		return {
			status: true,
			data: createdDatas,
		};
	} catch (err) {
		Logger.error(`BookService.post.importTempBook : ${err}`);
		return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
	}
}

export async function createBooks(): Promise<ServiceResponse<any>> {
	try {
		const bookTempDatas = await prisma.tempBook.findMany();

		console.log(bookTempDatas);
		let createdDatas = [];
		for (const bookTempData of bookTempDatas) {
			const checkExist = await prisma.book.findFirst({
				where: bookTempData,
			});
			if (checkExist) continue;

			const data = await prisma.book.create({ data: bookTempData });

			await prisma.tempBook.delete({ where: { id: bookTempData.id } });

			createdDatas.push(data);
		}

		return {
			status: true,
			data: createdDatas,
		};
	} catch (err) {
		Logger.error(`BookService.post.createBooks : ${err}`);
		return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
	}
}

export async function getAllTempData(
	filterQuery: FilteringQueryV2
): Promise<ServiceResponse<{}>> {
	try {
		const filter = buildFilterQueryLimitOffsetV2(filterQuery);
		const tempDatas = await prisma.tempBook.findMany(filter);

		return {
			status: true,
			data: tempDatas,
		};
	} catch (err) {
		Logger.error(`BookService.get.getAllTempData : ${err}`);
		return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
	}
}

export async function getAllBookData(
	filterQuery: any
): Promise<ServiceResponse<{}>> {
	try {
		const filter = buildFilterQueryLimitOffsetV2(filterQuery);
		const tempDatas = await prisma.book.findMany(filter);

		return {
			status: true,
			data: tempDatas,
		};
	} catch (err) {
		Logger.error(`BookService.get.getAllTempData : ${err}`);
		return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
	}
}
