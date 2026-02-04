/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

import WebTablesPageObject from '../support/pages/webTables.pageObject';

const webTablesPage = new WebTablesPageObject();

Cypress.on('uncaught:exception', () => {
  return false;
});

describe('Web Tables page', () => {
  let user;
  let updatedUser;

  beforeEach(() => {
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;
    });

    updatedUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      salary: faker.number.int({ min: 10000, max: 50000 }),
      department: faker.commerce.department()
    };

    webTablesPage.visit();
  });

  it('should navigate through pagination pages', () => {
    for (let i = 0; i < 6; i++) {
      cy.task('generateUser').then((user) => {
        webTablesPage.addWorker(user);
      });
    }

    webTablesPage.changeRowsCount(5);
    webTablesPage.rowsPerPageSelect.should('have.value', '5');

    webTablesPage.nextPageButton.should('not.be.disabled');
    webTablesPage.nextPageButton.click();
    webTablesPage.pageJump.should('have.value', '2');

    webTablesPage.prevPageButton.should('not.be.disabled');
    webTablesPage.prevPageButton.click();
    webTablesPage.pageJump.should('have.value', '1');
  });

  it('should change number of rows per page', () => {
    webTablesPage.rowsPerPageSelect.should('have.value', '10');

    webTablesPage.changeRowsCount(5);
    webTablesPage.rowsPerPageSelect.should('have.value', '5');
    webTablesPage.rows.should('have.length.at.most', 5);

    webTablesPage.changeRowsCount(10);
    webTablesPage.rowsPerPageSelect.should('have.value', '10');
    webTablesPage.rows.should('have.length.at.most', 10);
  });

  it('should add a new worker', () => {
    webTablesPage.addWorker(user);
    webTablesPage.validateWorkerData(user);
  });

  it('should delete a worker', () => {
    webTablesPage.addWorker(user);
    webTablesPage.rows.should('contain', user.firstName);

    webTablesPage.deleteWorker(user.email);

    webTablesPage.verifyWorkerNotExists(user.email);
  });

  it('should delete all workers', () => {
    webTablesPage.addWorker(user);

    webTablesPage.noDataLabel.should('not.exist');

    webTablesPage.deleteAllWorkers();
    webTablesPage.noDataLabel.should('contain', 'No rows found');
  });

  it('should find a worker and edit it', () => {
    webTablesPage.addWorker(user);

    webTablesPage.search(user.firstName);
    webTablesPage.validateSearchResults(user.firstName);

    webTablesPage.editWorkerAllFields(updatedUser);

    webTablesPage.search(updatedUser.email);
    webTablesPage.validateSearchResults(updatedUser.email);
  });

  it('should validate worker data after editing', () => {
    webTablesPage.addWorker(user);

    webTablesPage.search(user.firstName);
    webTablesPage.validateSearchResults(user.firstName);

    webTablesPage.editWorkerAllFields(updatedUser);

    webTablesPage.searchField.clear();

    webTablesPage.validateWorkerData(updatedUser);
  });

  it('should search by all column values', () => {
    webTablesPage.addWorker(user);
    webTablesPage.searchByAllColumns(user);
  });
});
