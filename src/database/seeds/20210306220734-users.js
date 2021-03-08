module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Teste',
        email: 'teste@gmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Teste2',
        email: 'teste2@gmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
