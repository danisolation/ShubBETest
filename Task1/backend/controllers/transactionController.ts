import { Request, Response } from "express";
import * as xlsx from "xlsx";
import moment from "moment";
import { getLatestUploadedFile } from "./fileController";

interface TransactionRow {
  __EMPTY_1: string;
  __EMPTY_7: string;
}

export const getTransactions = (req: Request, res: Response): void => {
  const { startTime, endTime } = req.query;

  if (!startTime || !endTime) {
    res
      .status(400)
      .json({ message: "Missing startTime or endTime query parameter" });
    return;
  }

  const latestUploadedFile = getLatestUploadedFile();
  if (!latestUploadedFile) {
    res.status(400).json({ message: "No file has been uploaded yet" });
    return;
  }

  const startMoment = moment(startTime as string, "HH:mm:ss", true);
  const endMoment = moment(endTime as string, "HH:mm:ss", true);

  if (!startMoment.isValid() || !endMoment.isValid()) {
    res.status(400).json({ message: "Invalid time format. Use HH:mm:ss format" });
    return;
  }

  try {
    const workbook = xlsx.readFile(latestUploadedFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { raw: false }); 
    let totalAmount = 0;

    for (const row of data) {
      const transactionRow = row as TransactionRow;
      const time = transactionRow["__EMPTY_1"];
      const amount = parseFloat(transactionRow["__EMPTY_7"]);

      if (
        moment(time, "HH:mm:ss").isBetween(startMoment, endMoment, undefined, "[]")
      ) {
        totalAmount += amount;
      }
    }

    res.status(200).json({ totalAmount });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error });
  }
};
