import { Employee } from "../models/Employee.js";
import { EmployeeService } from "../services/EmployeeService.js";

export class EmployeeFormViewModel {
    private employeeId: string | null = null;
    private service: EmployeeService;
    private container: HTMLElement | null = null;
    private isEditMode: boolean = false;

    public onCancel?: () => void;
    public onSave?: () => void;

    constructor(employeeId?: string)
    {
        this.service = new EmployeeService();
        this.employeeId = employeeId || null;
        this.isEditMode = !!employeeId;
    }

    public async render(container: HTMLElement): Promise<void>
    {
        this.container = container;

        this.renderForm();

        if (this.isEditMode && this.employeeId)
        {
            await this.LoadEmployee(this.employeeId);
        }

        this.bindEvents();
    }

    private renderForm(): void {
        if (!this.container) return;

        const template = document.getElementById('employee-form-template') as HTMLTemplateElement;
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

    private async LoadEmployee(id: string): Promise<void> {
        try {
            const employee = await this.service.getByKey(id);
            this.populateForm(employee);
        } catch (error) {
            await this.showErrorModal('Error loading employee: ' + (error as Error).message);
            if (this.onCancel) {
                this.onCancel();
            }
        }
    }

    private populateForm(employee: Employee): void {
        const form = document.getElementById('employee-form') as HTMLFormElement;
        if (!form) return;

        (form.querySelector('#firstName') as HTMLInputElement).value = employee.FirstName;
        (form.querySelector('#lastName') as HTMLInputElement).value = employee.LastName;
        (form.querySelector('#ssn') as HTMLInputElement).value = employee.SSN;
        (form.querySelector('#employeeNo') as HTMLInputElement).value = employee.EmployeeNo;

        const statusCheckbox = form.querySelector('#status') as HTMLInputElement;
        statusCheckbox.checked = employee.Status === 0;
        
        const breadcrumbName = document.getElementById('breadcrumb-name');
        if (breadcrumbName) {
            breadcrumbName.textContent = `${employee.FirstName} ${employee.LastName}`;
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.target as HTMLFormElement;

        this.clearErrors();

        if (!this.validateForm(form)) return;

        const employee = this.getFormData(form);

        try {

            if (this.isEditMode && this.employeeId)
            {
                employee.PersonID = this.employeeId;
                await this.service.update(employee);
                await this.showSuccessModal('Employee updated successfully!');
            } else {
                employee.PersonID = this.generateUUID();
                await this.service.create(employee);
                await this.showSuccessModal('Employee created successfully!');
            }

            if (this.onSave) {
                this.onSave();
            }
            
        } catch (error) {
            await this.showErrorModal('Error saving employee: ' + (error as Error).message);
        }
    }

    private getFormData(form: HTMLFormElement): Employee {
        const statusCheckbox = form.querySelector('#status') as HTMLInputElement;
        
        return {
            PersonID: '',
            FirstName: (form.querySelector('#firstName') as HTMLInputElement).value.trim(),
            LastName: (form.querySelector('#lastName') as HTMLInputElement).value.trim(),
            SSN: (form.querySelector('#ssn') as HTMLInputElement).value.trim(),
            EmployeeNo: (form.querySelector('#employeeNo') as HTMLInputElement).value.trim(),
            EmploymentStartDate: new Date().toISOString(),
            EmploymentEndDate: null,
            Status: statusCheckbox.checked ? 0 : 1,
            LastUpdatedBy: 'testUser',
            LastUpdatedDate: new Date().toISOString()
        };
    }

    private validateForm(form: HTMLFormElement): boolean {
        let isValid = true;
        
        // Validate First Name
        const firstName = (form.querySelector('#firstName') as HTMLInputElement).value.trim();
        if (!firstName) {
            this.showError('firstName', 'First name is required');
            isValid = false;
        }
        
        // Validate Last Name
        const lastName = (form.querySelector('#lastName') as HTMLInputElement).value.trim();
        if (!lastName) {
            this.showError('lastName', 'Last name is required');
            isValid = false;
        }
        
        // Validate SSN with format XXX-XX-XXXX
        const ssn = (form.querySelector('#ssn') as HTMLInputElement).value.trim();
        const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
        if (!ssn) {
            this.showError('ssn', 'SSN is required');
            isValid = false;
        } else if (!ssnPattern.test(ssn)) {
            this.showError('ssn', 'SSN must be in format XXX-XX-XXXX (e.g., 111-11-1111)');
            isValid = false;
        }
        
        // Validate Employee Number
        const employeeNo = (form.querySelector('#employeeNo') as HTMLInputElement).value.trim();
        if (!employeeNo) {
            this.showError('employeeNo', 'Employee number is required');
            isValid = false;
        }
        
        return isValid;
    }

    private showError(fieldName: string, message: string): void {
        const errorElement = document.querySelector(`[data-error="${fieldName}"]`) as HTMLElement;
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        const input = document.getElementById(fieldName) as HTMLInputElement;
        if (input) {
            input.classList.add('error');
        }
    }

    private clearErrors(): void {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            (el as HTMLElement).textContent = '';
            (el as HTMLElement).style.display = 'none';
        });
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(el => el.classList.remove('error'));
    }

    private showSuccessModal(message: string): Promise<void> {
        return new Promise((resolve) => {
            const template = document.getElementById('success-modal') as HTMLTemplateElement;
            const clone = template.content.cloneNode(true) as DocumentFragment;
            
            const messageElement = clone.querySelector('[data-field="success-message"]') as HTMLElement;
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            document.body.appendChild(clone);
            
            const modal = document.querySelector('.modal-overlay:last-child') as HTMLElement;
            const okBtn = modal?.querySelector('#modal-ok') as HTMLElement;
            
            const closeModal = () => {
                modal?.remove();
                resolve();
            };
            
            okBtn?.addEventListener('click', closeModal);
            
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });
    }

    private showErrorModal(message: string): Promise<void> {
        return new Promise((resolve) => {
            const template = document.getElementById('error-modal') as HTMLTemplateElement;
            const clone = template.content.cloneNode(true) as DocumentFragment;
            
            const messageElement = clone.querySelector('[data-field="error-message"]') as HTMLElement;
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            document.body.appendChild(clone);
            
            const modal = document.querySelector('.modal-overlay:last-child') as HTMLElement;
            const okBtn = modal?.querySelector('#modal-ok-error') as HTMLElement;
            
            const closeModal = () => {
                modal?.remove();
                resolve();
            };
            
            okBtn?.addEventListener('click', closeModal);
            
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });
    }

    private handleCancel(): void {
        if (this.onCancel) {
            this.onCancel();
        }
    }

    private bindEvents(): void {
        const form = document.getElementById('employee-form') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.handleCancel());
        }
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}