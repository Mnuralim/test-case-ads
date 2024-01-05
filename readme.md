# Simple-online-shop-api (add to cart & order)

I made this for the purpose of completing the coding test from ADS digital partner

## Database diagram

![App Screenshot](/public/image/db.png)

## Demo

http://localhost:${PORT}

example : http://localhost:${PORT}/api/v1/auths

## Tech Stack

**Server:** Express js, Sequelize, PostgreSql

## Installation

Clone the project

```bash
  git clone https://github.com/Irfiyandaabidin/Binar-CH7-Testing.git my-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

## Setup Database

Create database

```bash
  npm run db:create
```

Migration model database

```bash
  npm run db:migrate
```

Seed data

```bash
  npm run db:seed
```

## Run Locally

Start the server

```bash
  npm run start
```

Development

```bash
  npm run dev
```

## Testing

Create database for testing

```bash
 NODE_ENV=test npm run db:create
```

Migration model database for testing

```bash
 NODE_ENV=test npm run db:migrate
```

Seed data for testing

```bash
 NODE_ENV=test npm run db:seed
```

Run fo testing

```bash
 NODE_ENV=test npm run test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_PORT`

`JWT_SIGNATURE_KEY`

`DB_USER`

`DB_PASSWORD`

`DB_NAME`

`DB_HOST`

## API Reference

Open on swagger

```http
  http://localhsot:${PORT}/api-docs
```

## 🚀 About Me

i'm student and junior full stack developer...
