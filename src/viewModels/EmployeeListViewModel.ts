import { Employee } from "../models/Employee.js";
import { EmployeeService } from "../services/EmployeeService.js";

export class EmployeeListViewModel {
    private employees: Employee[] = [];
    private service: EmployeeService;
    private container: HTMLElement | null = null;

    public onAddEmployee?: () => void;
    public onEditEmployee?: (id: string) => void;

    constructor()
    {
        this.service = new EmployeeService();
    }

    //----------- Rendering -----------
    public async render(container: HTMLElement): Promise<void>
    {
        this.container = container;
        this.renderLoading();

        try 
        {
            await this.loadEmployees();
            this.renderView();

        } catch (error) {

            this.renderError(error as Error);

        }
    }

    private renderLoading(): void
    {
        if (!this.container) return;
        
        const template = document.getElementById('loading-template') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true);
        
        this.container.innerHTML = '';
        this.container.appendChild(clone);
    }
    
    private renderView(): void
    {
        if (!this.container) return;
        
        const template = document.getElementById('employee-list-template') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true);
        
        this.container.innerHTML = '';
        this.container.appendChild(clone);
        
        this.renderTableRows();
        
        this.bindEvents();
    }
    
    private renderTableRows(): void {
        const tbody = document.getElementById('employee-table-body');

        if (!tbody) return;

        tbody.innerHTML = "";

        if (this.employees.length == 0)
        {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No employees found</td></tr>';
            return;
        }

        this.employees.forEach(employee => {
            const row = this.createEmployeeRow(employee);
            tbody.appendChild(row);
        });
    }

    private createEmployeeRow(employee: Employee): HTMLElement {
        const template = document.getElementById('employee-row-template') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const tr = clone.querySelector('tr')!;

        tr.setAttribute('data-employee-id', employee.PersonID);

        const employeeNoCell = tr.querySelector('[data-field="employeeNo"]') as HTMLElement;
        employeeNoCell.textContent = employee.EmployeeNo;

        const firstNameCell = tr.querySelector('[data-field="firstName"]') as HTMLElement;
        firstNameCell.textContent = employee.FirstName;

        const lastNameCell = tr.querySelector('[data-field="lastName"]') as HTMLElement;
        lastNameCell.textContent = employee.LastName;

        const statusCell = tr.querySelector('[data-field="status"]') as HTMLElement;
        const status = employee.Status === 0 ? 'Active' : 'Inactive';
        const statusClass = employee.Status === 0 ? 'status-active' : 'status-inactive';

        statusCell.textContent = status;
        statusCell.classList.add(statusClass);

        const editBtn = tr.querySelector('.btn-edit') as HTMLElement;
        editBtn.setAttribute('data-employee-id', employee.PersonID);
        
        const deleteBtn = tr.querySelector('.btn-delete') as HTMLElement;
        deleteBtn.setAttribute('data-employee-id', employee.PersonID);
        
        return tr;
    }

    //----------- Services -----------
    private async loadEmployees(): Promise<void>
    {
        this.employees = await this.service.getAll();
    }

    //----------- Actions -----------

    private bindEvents(): void {
        const addButton = document.getElementById('add-employee-btn');
        if (addButton) {
            addButton.addEventListener('click', () => this.handleAddEmployee());
        }

        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let element = e.target as HTMLElement;
                let id = element.getAttribute('data-employee-id');
            
                if (!id && element.closest('.btn-edit')) {
                    id = element.closest('.btn-edit')!.getAttribute('data-employee-id');
                }
                
                if (id) this.handleEditEmployee(id);
            });
        });

        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let element = e.target as HTMLElement;
                let id = element.getAttribute('data-employee-id');
                
                if (!id && element.closest('.btn-delete')) {
                    id = element.closest('.btn-delete')!.getAttribute('data-employee-id');
                }
                
                if (id) this.handleDeleteEmployee(id);
            });
        });
    }

    private handleAddEmployee(): void {
        if (this.onAddEmployee) {
            this.onAddEmployee();
        }
    }

    private handleEditEmployee(id: string): void {
        if (this.onEditEmployee) {
            this.onEditEmployee(id);
        }
    }

    private async handleDeleteEmployee(id: string): Promise<void> {
        const confirmed = await this.showDeleteConfirmationModal();
        
        if (!confirmed) return;

        try {
            await this.service.delete(id);
            await this.showSuccessModal('Employee deleted successfully!');
            await this.loadEmployees();
            this.renderView();
        } catch (error) {
            await this.showErrorModal('Error deleting employee: ' + (error as Error).message);
        }
    }

    private showDeleteConfirmationModal(): Promise<boolean> {
        return new Promise((resolve) => {
            const template = document.getElementById('delete-confirmation-modal') as HTMLTemplateElement;
            const clone = template.content.cloneNode(true) as DocumentFragment;
            
            document.body.appendChild(clone);
            
            const modal = document.querySelector('.modal-overlay:last-child') as HTMLElement;
            const cancelBtn = modal?.querySelector('#modal-cancel') as HTMLElement;
            const confirmBtn = modal?.querySelector('#modal-confirm') as HTMLElement;
            
            const closeModal = (result: boolean) => {
                modal?.remove();
                resolve(result);
            };
            
            cancelBtn?.addEventListener('click', () => closeModal(false));
            confirmBtn?.addEventListener('click', () => closeModal(true));
            
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(false);
                }
            });
        });
    }

    private showSuccessModal(message: string): Promise<void> {
        return new Promise((resolve) => {
            const template = document.getElementById('success-modal') as HTMLTemplateElement;
            const clone = template.content.cloneNode(true) as DocumentFragment;
            
            // Set the success message
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
            
            // Set the error message
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

    private renderError(error: Error): void {
        if (!this.container) return;

        const template = document.getElementById('error-template') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true) as DocumentFragment;

        const errorMessage = clone.querySelector('[data-field="message"]') as HTMLElement;
        errorMessage.textContent = error.message;

        this.container.innerHTML = '';
        this.container.appendChild(clone);

        const retryButton = document.getElementById('retry-btn');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                if (this.container) this.render(this.container);
            });
        }
    }
}