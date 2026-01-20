export interface Employee {
    PersonID: string;
    FirstName: string;
    LastName: string;
    SSN: string;
    EmployeeNo: string;
    EmploymentStartDate: string | Date;
    EmploymentEndDate?: string | Date | null;
    Status: number;
    LastUpdatedBy: string;
    LastUpdatedDate: string | Date;
}