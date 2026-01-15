export interface ISalesReportEntity {
  period: {
    year: number;
    month?: number;
    day?: number;
    week?: number;
  };
  totalSales: number;    
  totalQuantity: number
}
