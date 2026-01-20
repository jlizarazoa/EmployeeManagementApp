import { EmployeeFormViewModel } from "./viewModels/EmployeeFormViewModel.js";
import { EmployeeListViewModel } from "./viewModels/EmployeeListViewModel.js";
class App {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        }
        else {
            this.init();
        }
    }
    init() {
        this.container = document.getElementById('app');
        if (!this.container) {
            throw new Error('App container not found');
        }
        console.log('App initialized');
        this.showEmployeeList();
    }
    showEmployeeList() {
        const viewModel = new EmployeeListViewModel();
        viewModel.onAddEmployee = () => {
            this.showEmployeeForm();
        };
        viewModel.onEditEmployee = (id) => {
            this.showEmployeeForm(id);
        };
        viewModel.render(this.container);
    }
    showEmployeeForm(employeeId) {
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
