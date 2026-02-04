class WebTablesPage {
  visit() {
    cy.visit('/webtables', { failOnStatusCode: false });
  }

  get addButton() {
    return cy.get('#addNewRecordButton');
  }

  get submitButton() {
    return cy.get('#submit');
  }

  get deleteButtons() {
    return cy.get('[title="Delete"]');
  }

  get editButtons() {
    return cy.get('[title="Edit"]');
  }

  get firstNameField() {
    return cy.get('#firstName');
  }

  get lastNameField() {
    return cy.get('#lastName');
  }

  get emailField() {
    return cy.get('#userEmail');
  }

  get ageField() {
    return cy.get('#age');
  }

  get salaryField() {
    return cy.get('#salary');
  }

  get departmentField() {
    return cy.get('#department');
  }

  get rows() {
    return cy.get('.rt-tr-group');
  }

  get noDataLabel() {
    return cy.get('.rt-noData');
  }

  get searchField() {
    return cy.get('#searchBox');
  }

  get rowsPerPageSelect() {
    return cy.get('select[aria-label="rows per page"]');
  }

  get nextPageButton() {
    return cy.get('div.-next button');
  }

  get prevPageButton() {
    return cy.get('div.-previous button');
  }

  get pageJump() {
    return cy.get('div.-pageJump input');
  }

  addWorker(user) {
    this.addButton.click();

    this.firstNameField.type(user.firstName);
    this.lastNameField.type(user.lastName);
    this.emailField.type(user.email);
    this.ageField.type(String(user.age));
    this.salaryField.type(String(user.salary));
    this.departmentField.type(user.department);

    this.submitButton.click();
  }

  deleteWorker(value) {
    cy.contains('.rt-tr-group', value).find('[title="Delete"]').click();
  }

  verifyWorkerNotExists(value) {
    cy.contains('.rt-tr-group', value).should('not.exist');
  }

  deleteAllWorkers() {
    const deleteNext = () => {
      cy.get('body').then(() => {
        const $buttons = Cypress.$('[title="Delete"]');

        if ($buttons.length > 0) {
          cy.wrap($buttons.first()).click();
          deleteNext();
        }
      });
    };

    deleteNext();
  }

  search(value) {
    this.searchField.clear().type(value);
  }

  editWorkerAllFields(newUser) {
    this.editButtons.first().click();

    this.firstNameField.clear().type(newUser.firstName);
    this.lastNameField.clear().type(newUser.lastName);
    this.emailField.clear().type(newUser.email);
    this.ageField.clear().type(String(newUser.age));
    this.salaryField.clear().type(String(newUser.salary));
    this.departmentField.clear().type(newUser.department);

    this.submitButton.click();
  }

  changeRowsCount(count) {
    this.rowsPerPageSelect.select(String(count));
  }

  validateSearchResults(value) {
    cy.contains('.rt-tr-group', value).should('exist');
  }

  getWorkerVisibleValues(user) {
    return [
      user.firstName,
      user.lastName,
      user.email,
      String(user.age),
      String(user.salary),
      user.department
    ];
  }

  validateWorkerData(user) {
    const values = this.getWorkerVisibleValues(user);

    cy.contains('.rt-tr-group', user.email)
      .within(() => {
        values.forEach((value) => {
          cy.contains(value);
        });
      });
  }

  searchByAllColumns(user) {
    this.getWorkerVisibleValues(user).forEach((value) => {
      this.search(value);
      this.validateSearchResults(value);
    });
  }
}

export default WebTablesPage;
