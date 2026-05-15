export interface SalesRecord {
  transno: string;
  salesdate: string;
  custno: string;
  empno: string;
}

export interface SalesDetailItem {
  transNo: string;
  prodCode: string;
  quantity: number;
  product?: {
    prodcode: string;
    description?: string;
    unit?: string;
  };
  unitPrice?: number | null;
}
