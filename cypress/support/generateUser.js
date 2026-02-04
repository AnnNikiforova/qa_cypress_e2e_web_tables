import { faker } from '@faker-js/faker';

const generateUser = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    salary: faker.number.int({ min: 10000, max: 50000 }),
    department: faker.commerce.department()
  };
};

export default generateUser;
