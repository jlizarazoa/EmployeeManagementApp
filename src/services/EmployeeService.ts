import { error } from "node:console";
import { config } from "../config/config.js";
import { IEmployeeService } from "./IEmployeeService";
import { Employee } from "../models/Employee";

export class EmployeeService implements IEmployeeService
{
    private baseUrl: string = config.baseUrl;
    private customerID: string = config.customerID;
    private apiKey: string = config.apiKey;

    private getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'CustomerID': this.customerID,
            'APIKey': this.apiKey
        };
    }

    async getAll(): Promise<Employee[]> {

        try {
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error. Status: ${response.status}`)
            }

            const data = await response.json();
            return data as Employee[];
        }
        catch (error)
        {
            console.error("Error fetching employees: ", error);
            throw error;
        }
    }

    async getByKey(idSsn: string): Promise<Employee> {

        try {
            const response = await fetch(`${this.baseUrl}(${idSsn})`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error. Status: ${response.status}`)
            }

            const data = await response.json();
            return data as Employee;
        }
        catch (error)
        {
            console.error(`Error fetching employee: ${idSsn}`, error);
            throw error;
        }
    }

    async create(employee: Employee): Promise<Employee> {

        try {

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(employee)
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error. Status: ${response.status}`)
            }

            const data = await response.json();
            return data as Employee;
        }
        catch (error)
        {
            console.error("Error creating employee: ", error);
            throw error;
        }
    }

    async update(employee: Employee): Promise<Employee> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(employee)
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error. Status: ${response.status}`)
            }

            const data = await response.json();
            return data as Employee;
        }
        catch (error)
        {
            console.error(`Error updating employee ${employee.PersonID}: `, error);
            throw error;
        }
    }

    async delete(idSsn: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}(${idSsn})`, {
                method: 'DELETE',
                headers: this.getHeaders(),
                body: idSsn
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error. Status: ${response.status}`)
            }
        }
        catch (error)
        {
            console.error(`Error deleting employee ${idSsn}: `, error);
            throw error;
        }
    }
}