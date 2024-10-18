const axios = require('axios');
require('dotenv').config();

const createTicket = async (contact) => {
  const apiKey = process.env.MILLDESK_API_KEY;
  const email = contact.email;
  const title = contact.title;
  const description = contact.description;
  const additionalInfo = 
  `Chamado aberto por: ${contact.nameContact}\r\n` +
  `Telefone da Abertura: ${contact.phoneNumber}\r\n` +
  `Empresa: ${contact.name}\r\n` +
  `CNPJ: ${contact.CNPJ}\r\n`;

  const fullDescription = `${description}${additionalInfo}`;
  
  const url = `https://v1.milldesk.com/api/${apiKey}/addTicket?email=${email}&title=${title}&description=${fullDescription}`;

  console.log(fullDescription);

  try {
    const response = await axios.get(url);
    console.log(response.data);
    console.log(url);
  } catch (error) {
    console.error('Erro ao criar ticket na MillDesk:', error);
  }
};

module.exports = {
  createTicket,
};
