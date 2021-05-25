# blockchain-basics

## Description
Backend of blockchain as a database in nodejs using express with ES6,ES7,ES8(using babel), ProvenDB, MonogClient, Eslint, Prettier, Githooks with Husky and lint-staged for linting and request logging with morgan.

[![express](https://img.shields.io/badge/express-%5E4.16.1-orange.svg)](https://github.com/expressjs/express)
[![mongodb](https://img.shields.io/badge/mongodb-3.6.8-orange.svg)](https://www.mongodb.com/)
[![provenDB](https://img.shields.io/badge/provebdb-0.1.13-red.svg)](https://app.provendb.com)
[![morgan](https://img.shields.io/badge/morgan-%5E1.10.0-blue.svg)](https://github.com/expressjs/morgan)
[![husky](https://img.shields.io/badge/husky-%5E6.0.0-blue.svg)](https://github.com/typicode/husky)
![node version](https://img.shields.io/badge/node-%3E%3D12.16.1-green)
[![specification](https://img.shields.io/badge/ES8/ECMASCRIPT-2017-yellow.svg)](https://www.ecma-international.org/ecma-262/8.0/index.html)
[![lint-staged](https://img.shields.io/badge/lint--staged-%5E11.0.0-red.svg)](https://github.com/okonet/lint-staged)
[![code style](https://img.shields.io/badge/eslint--config--standard-%5E16.0.2-brightgreen.svg)](https://github.com/eslint/eslint)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)

## Features
- Added databases like [provenDB](https://github.com/SouthbankSoftware/provendb) and [mongoDB](https://github.com/mongodb/mongo) using async await with latest standards
- Request logging with [morgan](https://github.com/expressjs/morgan)
- ES6,ES7,ES8 supported via [babel](https://github.com/babel/babel) with version ^7.*
- Response logging with the help of middleware
- Code [linting](http://eslint.org) using [eslint](https://github.com/eslint/eslint), [prettierrc](https://github.com/sourcegraph/prettierrc) and prepare commit msg and pre commit git hooks using [husky](https://github.com/typicode/husky) with [lint-staged](https://github.com/okonet/lint-staged) for better commits, proper linting and for avoiding bad commits
- [nodemon](https://github.com/remy/nodemon) for auto restart of server
- Application level error handler middleware
- async-await with single try catch throughout routes using a middleware wrapper
- Manage enviroment via deploy file
- Used [helmet](https://github.com/helmetjs/helmet) and [cors](https://github.com/expressjs/cors) for necessary security headers to secure api's 

## Getting Started
1. Clone repository
``` 
> git clone https://github.com/ashishssoni/blockchain-basics.git
> cd blockchain-basics
```
3. Install project dependencies
```
> npm install
```
4. Set enviroment variables
```
> cp deploy_sh.sample deploy.sh
```
5. Run application
``` 
> npm run build
> npm start
```
6. Run Code
