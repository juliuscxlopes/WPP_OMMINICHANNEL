WhatsApp Chatbot - Milldesk Support
Descrição
Este projeto é um chatbot para WhatsApp conectado à API Meta, projetado para oferecer suporte e abertura de tickets na plataforma de suporte Milldesk. O chatbot é implementado utilizando Node.js, Redis para persistência de dados, e a biblioteca Jscommon. O servidor é construído sobre Express e está hospedado na plataforma Railway.

Estrutura do Projeto
/src: Contém o código-fonte principal.
/controllers: Contém os controladores que gerenciam a lógica do chatbot.
/middleware: Contém middleware personalizado, como logging e verificação de tokens.
/routes: Contém as definições de rotas do servidor Express.
/services: Contém serviços para integração com a API Meta e Milldesk.
/utils: Contém funções utilitárias e helpers, como formatação de números de telefone.
/redis: Implementa a persistência de dados utilizando Redis.
app.js: Arquivo principal para configuração do servidor Express.
Requisitos
Node.js: Versão 16.x ou superior
Redis: Para persistência de dados
Railway: Para hospedagem do servidor
Jscommon: Biblioteca para funcionalidades comuns e reutilizáveis
