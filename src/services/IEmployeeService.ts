import { Employee } from "../models/Employee";

export interface IEmployeeService {

  getAll(): Promise<Employee[]>;
  getByKey(IdSsn: string): Promise<Employee>;
  create(employee: Employee): Promise<Employee>;
  update(employee: Employee): Promise<Employee>;
  delete(idSsn: string): Promise<void>;
  
}
