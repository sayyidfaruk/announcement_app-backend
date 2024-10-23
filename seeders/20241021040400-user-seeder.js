'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin', 10); 

    await queryInterface.bulkInsert('Users', [
      {
        nrp: '2106071', 
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
