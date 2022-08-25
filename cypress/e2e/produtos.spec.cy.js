/// <reference types="cypress" />
import contrato from "../contratos/produtos.contratos";

describe("Testes da Funcionalidade Produtos", () => {
  let token;
  before(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it("Deve validar contrato de produtos", () => {
    cy.request("produtos").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  // it("Listar produtos", () => {
  //   cy.request({
  //     method: "GET",
  //     url: "produtos",
  //   }).then((response) => {
  //     expect(response.body.produtos[6].nome).to.equal("Samsung 60 polegadas");
  //     expect(response.status).to.equal(200);
  //     expect(response.body).to.have.property("produtos");
  //     expect(response.duration).to.be.lessThan(30);
  //   });
  // });

  it("Cadastrar produto", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 1000000000)}`;
    cy.request({
      method: "POST",
      url: "produtos",
      headers: { authorization: token },
      body: {
        nome: produto,
        preco: 17,
        descricao: "Produto novo",
        quantidade: 1230,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar mensagem de erro ao cadastrar produto repetido", () => {
    cy.CadastrarProduto(
      token,
      "Samsung 60 polegadas",
      300,
      "Descrição nova",
      210
    ).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Já existe produto com esse nome");
    });
  });

  it("Deve editar um produto cadastrado", () => {
    cy.request("produtos").then((response) => {
      let id = response.body.produtos[0]._id;
      cy.request({
        method: "PUT",
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          nome: "teste zeus 783354820",
          preco: 200,
          descricao: "Produto novo",
          quantidade: 130,
        },
      }).then((response) => {
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });
    });
  });

  it("Deve excluir um produto previamente cadastrado", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 1000000000)}`;
    cy.CadastrarProduto(
      token,
      produto,
      250,
      "Descrição produto novo",
      180
    ).then((response) => {
      let id = response.body._id;
      cy.request({
        method: "DELETE",
        url: `produtos/${id}`,
        headers: { authorization: token },
      }).then((response) => {
        expect(response.body.message).to.equal("Registro excluído com sucesso");
        expect(response.status).to.equal(200);
      });
    });
  });
});
