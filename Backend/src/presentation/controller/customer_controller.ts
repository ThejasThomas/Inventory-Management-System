import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth_middleware";
import { IAddCustomerUseCase } from "../../domain/usecaseInterface/customers/add_customer_usecase_interface";
import { ICustomerController } from "../../domain/controllerInterface/customer_controller_interface";
import { IGetCustomersByUserUseCase } from "../../domain/usecaseInterface/customers/get_customers_usecase_interface";
import { CustomError } from "../../domain/utils/custom_error";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { IGetSalesReportUseCase } from "../../domain/usecaseInterface/customers/get_sales_report_usecase_interface";
import { IGetItemReportUseCase } from "../../domain/usecaseInterface/customers/get_item_report_usecse_interface";

@injectable()
export class CustomerController implements ICustomerController {
  constructor(
    @inject("IAddCustomerUseCase")
    private _addCustomerUseCase: IAddCustomerUseCase,
    @inject("IGetCustomersByUserUseCase")
    private _getCustomersUseCase: IGetCustomersByUserUseCase,
    @inject("IGetSalesReportUseCase")
    private _getSalesReportUseCase:IGetSalesReportUseCase,
    @inject("IGetItemReportUseCase")
    private _getItemReportUseCase:IGetItemReportUseCase
  ) {}

  async addCustomers(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user?.userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const {
        customerName,
        address,
        mobileNumber,
        productName,
        quantity,
        // totalAmount,
      } = req.body;

      const customer = await this._addCustomerUseCase.execute({
        userId: authReq.user.userId,
        customerName,
        address,
        mobileNumber,
        productName,
        quantity: Number(quantity),
        // totalAmount: Number(totalAmount),
      });

      res.status(201).json({
        success: true,
        message: "Customer added successfully",
        customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add customer",
      });
    }
  }

  async getMyCustomer(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (!userId) {
        throw new CustomError(ERROR_MESSAGE.UNAUTHORIZED_ACCESS, 401);
      }
      const result = await this._getCustomersUseCase.execute(
        userId,
        page,
        limit
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        customers: result.customers,
        total: result.total,
        page,
        limit,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }
  }
  async getSalesReport(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const { type } = req.query;

    if (!authReq.user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!["daily", "weekly", "monthly"].includes(type as string)) {
      res.status(400).json({ success: false, message: "Invalid report type" });
      return;
    }

    const report = await this._getSalesReportUseCase.execute(
      authReq.user.userId,
      type as "daily" | "weekly" | "monthly"
    );

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sales report",
    });
  }
}
async getItemReport(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const report = await this._getItemReportUseCase.execute(
      authReq.user.userId
    );
    console.log('report',report)
    res.status(200).json({
      success: true,
      items:report
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch item report"
    });
  }
}


}
