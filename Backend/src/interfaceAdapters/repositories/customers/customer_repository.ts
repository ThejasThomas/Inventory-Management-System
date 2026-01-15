import { injectable } from "tsyringe";
import { ICustomerEntity } from "../../../domain/entity/customer_entity";
import { CustomerModel } from "../../database/schemas/customer_schema";
import { Types } from "mongoose";
import { ICustomerRepository } from "../../../domain/repositoryInterface/customers/customer_repository_interface";
import { ISalesReportEntity } from "../../../domain/entity/sales_report_entity";
import { IItemReportEntity } from "../../../domain/entity/ItemReportEntity";

@injectable()
export class CustomerRepository implements ICustomerRepository {
  async addCustomer(data: ICustomerEntity): Promise<ICustomerEntity> {
    console.log('repooo touch')
    const created = await CustomerModel.create({
      ...data,
      // userId: new Types.ObjectId(data.userId),
    });
    console.log('created',created)
    return {
      customerId: created._id.toString(),
      userId: created.userId.toString(),
      customerName: created.customerName,
      address: created.address,
      mobileNumber: created.mobileNumber,
      productName: created.productName,
      quantity: created.quantity,
      // totalAmount: created.totalAmount,
      createdAt: created.createdAt,
    };
  }

  async getCustomersByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      CustomerModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      CustomerModel.countDocuments({ userId }),
    ]);

    return {
      customers: customers.map((c) => ({
        customerId: c._id.toString(),
        userId: c.userId.toString(),
        customerName: c.customerName,
        address: c.address,
        mobileNumber: c.mobileNumber,
        productName: c.productName,
        quantity: c.quantity,
        // totalAmount: c.totalAmount,
        createdAt: c.createdAt,
      })),
      total,
    };
  }
  async getSalesReport(userId: string, type: "daily" | "weekly" | "monthly"): Promise<ISalesReportEntity[]> {
    let groupId: any;

  if (type === "daily") {
    groupId = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" }
    };
  }

  if (type === "weekly") {
    groupId = {
      year: { $year: "$createdAt" },
      week: { $week: "$createdAt" }
    };
  }

  if (type === "monthly") {
    groupId = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" }
    };
  }
  console.log('heyyy')

  const report = await CustomerModel.aggregate([
    { $match: { userId: userId } },

    {
      $group: {
        _id: groupId,
        totalSales: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" }
      }
    },

    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);
  console.log('reportss',report)

  return report.map((r) => ({
    period: r._id,
    totalSales: r.totalSales,
    totalQuantity: r.totalQuantity
  }));
  }

  async getItemReportByUser(userId: string): Promise<IItemReportEntity[]> {
    console.log('broh')
     const report = await CustomerModel.aggregate([
    {
      $match: { userId: userId } 
    },
    {
      $group: {
        _id: "$productName",
        totalSales: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" }
      }
    },
    {
      $sort: { totalQuantity: -1 } 
    }
  ]);

  return report.map((r) => ({
    productName: r._id,
    totalSales: r.totalSales,
    totalQuantity: r.totalQuantity
  }));
  }
}
