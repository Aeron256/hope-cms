export interface CustomerData {
    address: string;
    custname: string;
    custno: string;
    payterm: string;
    record_status: 'ACTIVE' | 'INACTIVE';
}