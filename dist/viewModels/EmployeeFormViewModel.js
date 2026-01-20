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
export class EmployeeFormViewModel {
    constructor(employeeId) {
        this.employeeId = null;
        this.container = null;
        this.isEditMode = false;
        this.service = new EmployeeService();
        this.employeeId = employeeId || null;
        this.isEditMode = !!employeeId;
    }
    render(container) {
        return __awaiter(this, void 0, void 0, function* () {
            this.container = container;
            this.renderForm();
            if (this.isEditMode && this.employeeId) {
                yield this.LoadEmployee(this.employeeId);
            }
            this.bindEvents();
        });
    }
    renderForm() {
        if (!this.container)
            return;
        const template = document.getElementById('employee-form-template');
        const clone = template.content.cloneNode(true);
        this.container.innerHTML = '';
        this.container.appendChild(clone);
        const title = document.getElementById('form-title');
        if (title) {
            title.textContent = this.isEditMode ? 'Edit Employee' : 'Add Employee';
        }
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.textContent = this.isEditMode ? 'UPDATE' : 'SAVE';
        }
        const breadcrumb = document.getElementById('breadcrumb-container');
        if (breadcrumb) {
            breadcrumb.style.display = this.isEditMode ? 'block' : 'none';
        }
    }
    LoadEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employee = yield this.service.getByKey(id);
                this.populateForm(employee);
            }
            catch (error) {
                yield this.showErrorModal('Error loading employee: ' + error.message);
                if (this.onCancel) {
                    this.onCancel();
                }
            }
        });
    }
    populateForm(employee) {
        const form = document.getElementById('employee-form');
        if (!form)
            return;
        form.querySelector('#firstName').value = employee.FirstName;
        form.querySelector('#lastName').value = employee.LastName;
        form.querySelector('#ssn').value = employee.SSN;
        form.querySelector('#employeeNo').value = employee.EmployeeNo;
        const statusCheckbox = form.querySelector('#status');
        statusCheckbox.checked = employee.Status === 0;
        const breadcrumbName = document.getElementById('breadcrumb-name');
        if (breadcrumbName) {
            breadcrumbName.textContent = `${employee.FirstName} ${employee.LastName}`;
        }
    }
    handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const form = event.target;
            this.clearErrors();
            if (!this.validateForm(form))
                return;
            const employee = this.getFormData(form);
            try {
                if (this.isEditMode && this.employeeId) {
                    employee.PersonID = this.employeeId;
                    yield this.service.update(employee);
                    yield this.showSuccessModal('Employee updated successfully!');
                }
                else {
                    employee.PersonID = this.generateUUID();
                    yield this.service.create(employee);
                    yield this.showSuccessModal('Employee created successfully!');
                }
                if (this.onSave) {
                    this.onSave();
                }
            }
            catch (error) {
                yield this.showErrorModal('Error saving employee: ' + error.message);
            }
        });
    }
    getFormData(form) {
        const statusCheckbox = form.querySelector('#status');
        return {
            PersonID: '',
            FirstName: form.querySelector('#firstName').value.trim(),
            LastName: form.querySelector('#lastName').value.trim(),
            SSN: form.querySelector('#ssn').value.trim(),
            EmployeeNo: form.querySelector('#employeeNo').value.trim(),
            EmploymentStartDate: new Date().toISOString(),
            EmploymentEndDate: null,
            Status: statusCheckbox.checked ? 0 : 1,
            LastUpdatedBy: 'testUser',
            LastUpdatedDate: new Date().toISOString()
        };
    }
    validateForm(form) {
        let isValid = true;
        // Validate First Name
        const firstName = form.querySelector('#firstName').value.trim();
        if (!firstName) {
            this.showError('firstName', 'First name is required');
            isValid = false;
        }
        // Validate Last Name
        const lastName = form.querySelector('#lastName').value.trim();
        if (!lastName) {
            this.showError('lastName', 'Last name is required');
            isValid = false;
        }
        // Validate SSN with format XXX-XX-XXXX
        const ssn = form.querySelector('#ssn').value.trim();
        const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
        if (!ssn) {
            this.showError('ssn', 'SSN is required');
            isValid = false;
        }
        else if (!ssnPattern.test(ssn)) {
            this.showError('ssn', 'SSN must be in format XXX-XX-XXXX (e.g., 111-11-1111)');
            isValid = false;
        }
        // Validate Employee Number
        const employeeNo = form.querySelector('#employeeNo').value.trim();
        if (!employeeNo) {
            this.showError('employeeNo', 'Employee number is required');
            isValid = false;
        }
        return isValid;
    }
    showError(fieldName, message) {
        const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        const input = document.getElementById(fieldName);
        if (input) {
            input.classList.add('error');
        }
    }
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(el => el.classList.remove('error'));
    }
    showSuccessModal(message) {
        return new Promise((resolve) => {
            const template = document.getElementById('success-modal');
            const clone = template.content.cloneNode(true);
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
    handleCancel() {
        if (this.onCancel) {
            this.onCancel();
        }
    }
    bindEvents() {
        const form = document.getElementById('employee-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.handleCancel());
        }
    }
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
