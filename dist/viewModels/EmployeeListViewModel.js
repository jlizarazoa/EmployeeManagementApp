var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EmployeeService } from "../services/EmployeeService.js";
export class EmployeeListViewModel {
    constructor() {
        this.employees = [];
        this.container = null;
        this.service = new EmployeeService();
    }
    //----------- Rendering -----------
    render(container) {
        return __awaiter(this, void 0, void 0, function* () {
            this.container = container;
            this.renderLoading();
            try {
                yield this.loadEmployees();
                this.renderView();
            }
            catch (error) {
                this.renderError(error);
            }
        });
    }
    renderLoading() {
        if (!this.container)
            return;
        const template = document.getElementById('loading-template');
        const clone = template.content.cloneNode(true);
        this.container.innerHTML = '';
        this.container.appendChild(clone);
    }
    renderView() {
        if (!this.container)
            return;
        const template = document.getElementById('employee-list-template');
        const clone = template.content.cloneNode(true);
        this.container.innerHTML = '';
        this.container.appendChild(clone);
        this.renderTableRows();
        this.bindEvents();
    }
    renderTableRows() {
        const tbody = document.getElementById('employee-table-body');
        if (!tbody)
            return;
        tbody.innerHTML = "";
        if (this.employees.length == 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No employees found</td></tr>';
            return;
        }
        this.employees.forEach(employee => {
            const row = this.createEmployeeRow(employee);
            tbody.appendChild(row);
        });
    }
    createEmployeeRow(employee) {
        const template = document.getElementById('employee-row-template');
        const clone = template.content.cloneNode(true);
        const tr = clone.querySelector('tr');
        tr.setAttribute('data-employee-id', employee.PersonID);
        const employeeNoCell = tr.querySelector('[data-field="employeeNo"]');
        employeeNoCell.textContent = employee.EmployeeNo;
        const firstNameCell = tr.querySelector('[data-field="firstName"]');
        firstNameCell.textContent = employee.FirstName;
        const lastNameCell = tr.querySelector('[data-field="lastName"]');
        lastNameCell.textContent = employee.LastName;
        const statusCell = tr.querySelector('[data-field="status"]');
        const status = employee.Status === 0 ? 'Active' : 'Inactive';
        const statusClass = employee.Status === 0 ? 'status-active' : 'status-inactive';
        statusCell.textContent = status;
        statusCell.classList.add(statusClass);
        const editBtn = tr.querySelector('.btn-edit');
        editBtn.setAttribute('data-employee-id', employee.PersonID);
        const deleteBtn = tr.querySelector('.btn-delete');
        deleteBtn.setAttribute('data-employee-id', employee.PersonID);
        return tr;
    }
    //----------- Services -----------
    loadEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            this.employees = yield this.service.getAll();
        });
    }
    //----------- Actions -----------
    bindEvents() {
        const addButton = document.getElementById('add-employee-btn');
        if (addButton) {
            addButton.addEventListener('click', () => this.handleAddEmployee());
        }
        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                let element = e.target;
                let id = element.getAttribute('data-employee-id');
                if (!id && element.closest('.btn-edit')) {
                    id = element.closest('.btn-edit').getAttribute('data-employee-id');
                }
                if (id)
                    this.handleEditEmployee(id);
            });
        });
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                let element = e.target;
                let id = element.getAttribute('data-employee-id');
                if (!id && element.closest('.btn-delete')) {
                    id = element.closest('.btn-delete').getAttribute('data-employee-id');
                }
                if (id)
                    this.handleDeleteEmployee(id);
            });
        });
    }
    handleAddEmployee() {
        if (this.onAddEmployee) {
            this.onAddEmployee();
        }
    }
    handleEditEmployee(id) {
        if (this.onEditEmployee) {
            this.onEditEmployee(id);
        }
    }
    handleDeleteEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmed = yield this.showDeleteConfirmationModal();
            if (!confirmed)
                return;
            try {
                yield this.service.delete(id);
                yield this.showSuccessModal('Employee deleted successfully!');
                yield this.loadEmployees();
                this.renderView();
            }
            catch (error) {
                yield this.showErrorModal('Error deleting employee: ' + error.message);
            }
        });
    }
    showDeleteConfirmationModal() {
        return new Promise((resolve) => {
            const template = document.getElementById('delete-confirmation-modal');
            const clone = template.content.cloneNode(true);
            document.body.appendChild(clone);
            const modal = document.querySelector('.modal-overlay:last-child');
            const cancelBtn = modal === null || modal === void 0 ? void 0 : modal.querySelector('#modal-cancel');
            const confirmBtn = modal === null || modal === void 0 ? void 0 : modal.querySelector('#modal-confirm');
            const closeModal = (result) => {
                modal === null || modal === void 0 ? void 0 : modal.remove();
                resolve(result);
            };
            cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => closeModal(false));
            confirmBtn === null || confirmBtn === void 0 ? void 0 : confirmBtn.addEventListener('click', () => closeModal(true));
            modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(false);
                }
            });
        });
    }
    showSuccessModal(message) {
        return new Promise((resolve) => {
            const template = document.getElementById('success-modal');
            const clone = template.content.cloneNode(true);
            // Set the success message
            const messageElement = clone.querySelector('[data-field="success-message"]');
            if (messageElement) {
                messageElement.textContent = message;
            }
            document.body.appendChild(clone);
            const modal = document.querySelector('.modal-overlay:last-child');
            const okBtn = modal === null || modal === void 0 ? void 0 : modal.querySelector('#modal-ok');
            const closeModal = () => {
                modal === null || modal === void 0 ? void 0 : modal.remove();
                resolve();
            };
            okBtn === null || okBtn === void 0 ? void 0 : okBtn.addEventListener('click', closeModal);
            modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });
    }
    showErrorModal(message) {
        return new Promise((resolve) => {
            const template = document.getElementById('error-modal');
            const clone = template.content.cloneNode(true);
            // Set the error message
            const messageElement = clone.querySelector('[data-field="error-message"]');
            if (messageElement) {
                messageElement.textContent = message;
            }
            document.body.appendChild(clone);
            const modal = document.querySelector('.modal-overlay:last-child');
            const okBtn = modal === null || modal === void 0 ? void 0 : modal.querySelector('#modal-ok-error');
            const closeModal = () => {
                modal === null || modal === void 0 ? void 0 : modal.remove();
                resolve();
            };
            okBtn === null || okBtn === void 0 ? void 0 : okBtn.addEventListener('click', closeModal);
            modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });
    }
    renderError(error) {
        if (!this.container)
            return;
        const template = document.getElementById('error-template');
        const clone = template.content.cloneNode(true);
        const errorMessage = clone.querySelector('[data-field="message"]');
        errorMessage.textContent = error.message;
        this.container.innerHTML = '';
        this.container.appendChild(clone);
        const retryButton = document.getElementById('retry-btn');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                if (this.container)
                    this.render(this.container);
            });
        }
    }
}
