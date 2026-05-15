export interface CustomerData {
    custno: string;
    custname: string;
    address: string;
    payterm: string;
    record_status: 'ACTIVE' | 'INACTIVE';
    stamp?: string;
}