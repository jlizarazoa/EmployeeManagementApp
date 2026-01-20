import { EmployeeFormViewModel } from "./viewModels/EmployeeFormViewModel.js";
import { EmployeeListViewModel } from "./viewModels/EmployeeListViewModel.js";

class App {
    private container!: HTMLElement;

    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    private init(): void {
        this.container = document.getElementById('app')!;

        if (!this.container) {
            throw new Error('App container not found');
        }

        this.showEmployeeList();
    }

    private showEmployeeList(): void {
        const viewModel = new EmployeeListViewModel();

        viewModel.onAddEmployee = () => {
            this.showEmployeeForm();
        }

        viewModel.onEditEmployee = (id: string) => {
            this.showEmployeeForm(id);
        }

        viewModel.render(this.container);
    }

    private showEmployeeForm(employeeId?: string): void {
        const viewModel = new EmployeeFormViewModel(employeeId);

        viewModel.onCancel = () => {
            this.showEmployeeList();
        };

        viewModel.onSave = () => {
            this.showEmployeeList();
        };

        viewModel.render(this.container);
    }
}

new App();