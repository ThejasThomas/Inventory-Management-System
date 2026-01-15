import { inject, injectable } from "tsyringe";
import { IProductController } from "../../domain/controllerInterface/product_controller_interface";
import { IAddProductUseCase } from "../../domain/usecaseInterface/products/add_product_usecase_interface";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth_middleware";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom_error";
import { success } from "zod";
import { IGetProductUseCase } from "../../domain/usecaseInterface/products/get_product_usecase_interface";
import { IGetProductByIdUseCase } from "../../domain/usecaseInterface/products/get_product_by_id_usecase_interface";
import { IUpdateProductUseCase } from "../../domain/usecaseInterface/products/update_product_usecase_interface";
import { IDeleteProductUseCase } from "../../domain/usecaseInterface/products/delete_product_usecase_interface";

@injectable()
export class ProductController implements IProductController {
  constructor(
    @inject("IAddProductUseCase")
    private _addProductUsecase: IAddProductUseCase,
    @inject("IGetProductUseCase")
    private _getProductsUseCase: IGetProductUseCase,
    @inject("IGetProductByIdUseCase")
    private _getProductByIdUseCase: IGetProductByIdUseCase,
    @inject("IUpdateProductUseCase")
    private _updateProductUseCase: IUpdateProductUseCase,
    @inject("IDeleteProductUseCase")
    private _deleteProductUseCase: IDeleteProductUseCase
  ) {}

  async addProduct(req: Request, res: Response): Promise<void> {
    try {
      console.log("heyyyyy");
      const { name, description, quantity, price } = req.body;
      console.log(name, description, quantity, price);
      const authReq = req as AuthRequest;
      console.log("userrr", authReq.user?.userId);

      if (!authReq.user || !authReq.user.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      const userId = authReq.user.userId;

      const product = await this._addProductUsecase.execute({
        userId,
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
      });
      console.log("brooo");

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGE.PRODUCT_ADDED_SUCCESSSFULLY,
        product,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        messsage: ERROR_MESSAGE.PRODUCT_NOT_ADDED,
      });
    }
  }
  async getMyProducts(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;
      const authReq = req as AuthRequest;

      if (!authReq.user?.userId) {
        res
          .status(401)
          .json({ success: false, message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
        return;
      }

      const result = await this._getProductsUseCase.execute(
        authReq.user.userId,
        Number(page),
        Number(limit)
      );
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: ERROR_MESSAGE.FAILED_TO_FETCH_PRODUCT,
      });
    }
  }
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
        return;
      }
      if (!authReq.user?.userId) {
        res
          .status(401)
          .json({ success: false, message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
        return;
      }

      const product = await this._getProductByIdUseCase.execute(
        id,
        authReq.user.userId
      );
      res.status(200).json({
        success: true,
        product,
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
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, quantity, price } = req.body;
      console.log("update controooller");

      const authReq = req as AuthRequest;
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
        return;
      }

      if (!authReq.user?.userId) {
        res
          .status(401)
          .json({ success: false, message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS });
        return;
      }

      const updatedProduct = await this._updateProductUseCase.execute(
        id,
        authReq.user.userId,
        {
          name,
          description,
          quantity: Number(quantity),
          price: Number(price),
        }
      );
      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGE.PRODUCT_UPDATED_SUCCESSFULLY,
        product: updatedProduct,
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
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      if (!authReq.user?.userId) {
        res.status(401).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED_ACCESS,
        });
        return;
      }
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid product id",
        });
        return;
      }

      await this._deleteProductUseCase.execute(id, authReq.user.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGE.PRODUCT_DELETED_SUCCESSFULLY,
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
}
