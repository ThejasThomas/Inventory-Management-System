export interface IItemReportEntity {
  productName: string;
  totalSales: number; 
  totalQuantity: number;  
}

export interface ITemReportResponse{
    success:boolean;
    items:IItemReportEntity[]
}
