import { Request, Response } from "express";
import { ImportLog } from "../models/ImportLog.model";

export async function getImportLogs(req: Request, res: Response) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 20, 1);

    const total = await ImportLog.countDocuments();
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * limit;

    const logs = await ImportLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      data: logs,
      meta: {
        total,
        page: safePage,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch import logs" });
  }
}
