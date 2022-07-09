import inquirer from "inquirer";
import fs from 'fs'
import chalk from 'chalk';

// Siplificando funcoes
const print = (value) => {
   return console.log(value);
}

function operation() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'O que você deseja fazer?',
      choices: [ 'Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
    },
  ])
  .then((answer) => {
    const action = answer['action'];
    if(action === 'Criar conta') {
      createAccount();
    } else if(action === 'Depositar') {
      deposit();
    } else if(action === 'Consultar Saldo') {
      getBallance();
    } else if(action === 'Sacar') {
      withdraw();
    } else if(action === 'Sair') {
      print(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
      process.exit();
    }
  })
  .catch(err => print(err))
};

operation();

function createAccount() {
  print(chalk.bgGreen('Parabéns por escolher o nosso banco!'))
  print(chalk.green('Defina as opções da sua conta a seguir'))
  buildAccount();
};

function buildAccount() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite um nome para a sua conta:'
    }
  ])
  .then((answer) => {
    const accountName = answer['accountName'];

    if(!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts');
    }

    if(fs.existsSync(`accounts/${accountName}.json`)){
      print(chalk.bgRed.black('Esta conta já existe, escolhe outro nome!'));
      buildAccount();
      return;
    }

    fs.writeFileSync(
      `accounts/${accountName}.json`, 
      '{"balance": 0}', 
      function(err){
        console.log(err);
      }
    )

    print(chalk.green(`Parabéns, a conta ${accountName} foi criada!`));
    operation();

    })
  .catch(err => print(err));
};

function deposit() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    },
  ])
  .then((answer) => {
    const accountName = answer['accountName'];

    if(!checkAccount(accountName)) {
      return deposit();
    }

    inquirer.prompt([
      {      
        name: 'amount',
        message: 'Quanto você deseja depositar?'
      },
    ])
    .then((answer) => {
      const amount = answer['amount'];
      addAmount(accountName, amount);
    })
    .catch(err => print(err));
  })
  .catch(err => print(err));
};

function getBallance() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }
  ])
  .then((answer) => {
    const accountName = answer['accountName'];

    if(!checkAccount(accountName)) {
      return getBallance();
    }

    const accountData = getAccount(accountName);
    print(chalk.bgBlue.black(`O saldo da sua conta é de R$${accountData.balance}`));
    operation();

  })
  .catch(err => print(err));
};

function withdraw() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }
  ])
  .then((answer) => {
    const accountName = answer['accountName'];

    if(!checkAccount(accountName)) {
      return withdraw();
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto você desejar sacar?'
      }
    ])
    .then((answer) => {
      const amount = answer['amount'];
      removeAmount(accountName, amount);
    })
    .catch((err) => {print(err)})
  })
  .catch(err => print(err));
};

function checkAccount(accountName) {
  if(!fs.existsSync(`accounts/${accountName}.json`)) {
    print(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'));
    return false;
  } else {
    return true;
  }
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if(!amount) {
    print(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`, 
    JSON.stringify(accountData),
    function (err) {
      print(err);
    } 
  )
  print(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
  operation();
};

function getAccount(accountName) {
  const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r'
  })
  return JSON.parse(accountJson)
};

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if(!amount) {
    print(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
    return withdraw();
  }

  if(accountData.balance < amount) {
    print(chalk.bgRed.black('Valor indisponível! Entre novamente na sua conta e digite outro valor.'));
    return withdraw();
  };

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`, 
    JSON.stringify(accountData),
    function (err) {
      print(err);
    } 
  )
  print(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`));
  operation();
};