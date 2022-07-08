import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from "fs";

// Simplificando funcoes
const log = console.log();

function operation() {
   inquirer.prompt([
      {
         type: 'list',
         name: 'action',
         message: 'Escolha uma opcao',
         choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
         ]
      },
   ])
      .then((answer) => {
         const action = answer['action'];
         if (action === 'Criar conta') {
            createAccount();
         }
      })
      .catch(err => log(err))
};

// Create account
function createAccount() {
   log('Seja bem vindo ao nosso banco!');
   log('Defina as opcoes da sua conta para continuar: ');
   buildAccount();
}

function buildAccount() {
   inquirer.prompt([
      {
         name: 'accountName',
         message: 'Informe um nome de usuario para sua conta: '
      }
   ])
      .then((answer) => {
         const accountName = answer['accountName'];

         if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts');
         }

         if (fs.existsSync(`accounts/${accountName}.json`)) {
            log('Conta ja existente em nosso banco de dados. Informe outro nome!');
            buildAccount();
            return;
         }

         fs.writeFileSync(
            `accounts/${accountName}.json`,
            `{"ballance: 0}`,
            function (err) {
               log(err);
            }
         )

         log(`Conta criada com sucesso, REGISTRADO EM NOME DE ${accountName}`);
         operation();
      })
      .catch(err => log(err));
}

function deposit() {
   inquirer.prompt([
      {
         name: 'accountName',
         message: 'Qual o nome da sua conta?'
      },
   ])
   .then((answer) => {
      const accountName = answer['accountName'];

      if(!checkoutAccount(accountName)) {
         return deposit();
      }

      inquirer.prompt([
         {
            name: 'amount',
            message: 'Quanto voce deseja depositar?'
         },
      ])
      .then((answer) => {
         const amount = answer['amount'];
         addAmount(accountName, amount);
      }) 
      .catch(err => log(err));
   })
   .catch(err => log(err));
}

function getBallance() {
   
}
function withDraw() { }
function checkoutAccount() { }
function addAmount() { }
function getAccount() { }
function removeAmount() { }

//  PART 2