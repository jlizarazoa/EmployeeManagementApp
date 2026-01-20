var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from "../config/config.js";
export class EmployeeService {
    constructor() {
        this.baseUrl = config.baseUrl;
        this.customerID = config.customerID;
        this.apiKey = config.apiKey;
    }
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'CustomerID': this.customerID,
            'APIKey': this.apiKey
        };
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.baseUrl, {
                    method: 'GET',
                    headers: this.getHeaders()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error("Error fetching employees: ", error);
                throw error;
            }
        });
    }
    getByKey(idSsn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}(${idSsn})`, {
                    method: 'GET',
                    headers: this.getHeaders()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error(`Error fetching employee: ${idSsn}`, error);
                throw error;
            }
        });
    }
    create(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.baseUrl, {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify(employee)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error("Error creating employee: ", error);
                throw error;
            }
        });
    }
    update(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.baseUrl, {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(employee)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error(`Error updating employee ${employee.PersonID}: `, error);
                throw error;
            }
        });
    }
    delete(idSsn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}(${idSsn})`, {
                    method: 'DELETE',
                    headers: this.getHeaders(),
                    body: idSsn
                });
                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }
            }
            catch (error) {
                console.error(`Error deleting employee ${idSsn}: `, error);
                throw error;
            }
        });
    }
}
