export interface ICustomerEntity {
  customerId?: string;
  userId: string;

  customerName: string;
  address: string;
  mobileNumber: string;

  productName: string;
  quantity: number;

  createdAt?: Date;
  updatedAt?: Date;
}