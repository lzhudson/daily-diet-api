<p align="center">
  <img src=".github/docs/images/logo.svg" width="350"/>
</p>

<br />

[![Author](https://img.shields.io/badge/author-lzhudson-00B37E?style=flat-square)](https://github.com/lzhudson)
[![Languages](https://img.shields.io/github/languages/count/lzhudson/daily-diet-api?color=%2300B37E&style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/lzhudson/daily-diet-api?color=00B37E&style=flat-square)](https://github.com/lzhudson/daily-diet-api/stargazers)
[![Forks](https://img.shields.io/github/forks/lzhudson/daily-diet-api?color=00B37E&style=flat-square)](https://github.com/lzhudson/daily-diet-api/network/members)
[![Contributors](https://img.shields.io/github/contributors/lzhudson/daily-diet-api?color=00B37E&style=flat-square)](https://github.com/lzhudson/daily-diet-api/graphs/contributors)

# :pushpin: Table of Contents
* [Overview](#memo-overview)
* [Features](#rocket-features)
* [Installation](#construction_worker-installation)
* [Testing](#test_tube-testing)
* [Found a bug? Missing a specific feature?](#bug-issues)
* [Contributing](#tada-contributing)
* [License](#closed_book-license)

# :memo: Overview

The daily diet API is an API developed for recording and controlling meals where the user can record their daily meals with name, description, date and time and also whether or not it is within their diet.

# :rocket: Features

* Create user
* Identify each user's meals 
* Create, update, delete, list all and list exclusive meal(s) by id
* Provide metrics for the number of meals, the number of meals within the diet, the number of meals outside the diet and the best sequence of meals within the diet.
* e2e tests

# :construction_worker: Installation

**You need to install [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) first, then in order to clone the project via HTTPS, run this command:**

```
git clone https://github.com/lzhudson/daily-diet-api.git
```

SSH URLs provide access to a Git repository via SSH, a secure protocol. If you have a SSH key registered in your Github account, clone the project using this command:

```
git clone git@github.com:lzhudson/daily-diet-api.git
```

**Create the .env file with following content:**

```
NODE_ENV=development
DATABASE_CLIENT=sqlite3
DATABASE_URL="./db/app.db"
```

**Install dependencies**

```
npm i install
```

**Start development server**

```
npm run dev
```

**The routes to test the API are available on the button below:**

 <a href=".github/docs/insomnia/daily-diet-api.json" download>Click to Download Insomnia file API</a>


# :test_tube: Testing

**Create the .env.test file with following content:**

```
NODE_ENV=test
DATABASE_CLIENT=sqlite3
DATABASE_URL="./db/test.db"
```

**Running tests**

```
npm run test:all
```

# :bug: Issues

Feel free to **file a new issue** with a respective title and description on the [Daily Diet API](https://github.com/lzhudson/daily-diet-api/issues) repository. If you already found a solution to your problem, **I would love to review your pull request**! Have a look at our [contribution guidelines](https://github.com/lzhudson/daily-diet-api/blob/main/CONTRIBUTING.md) to find out about the coding standards.

# :tada: Contributing

Check out the [contributing](https://github.com/lzhudson/daily-diet-api/blob/main/CONTRIBUTING.md) page to see the best places to file issues, start discussions and begin contributing.

# :closed_book: License

Released in 2024
This project is under the [MIT license](https://github.com/lzhudson/daily-diet-api/main/LICENSE).

Designed by [Rockeseat](https://github.com/Rocketseat) and developed by [Hudson Holanda](https://github.com/lzhudson) 🖤🚀