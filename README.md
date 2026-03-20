# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact

## **API Endpoints**

Base URL: `import.meta.env.VITE_ARQBS_API_URL`

- **Company:**
	- **POST /company/create:** crear empresa (multipart/form-data)
	- **GET /company/get-company:** obtener datos de la(s) empresa(s)
	- **DELETE /company/delete/:companyId:** eliminar empresa

- **Product:**
	- **GET /product/getProductByCompany/:companyId:** obtener productos por compañía (requiere `Authorization: Bearer <token>`)
	- **GET /product/search:** búsqueda server-side — params: `companyId`, `name`, `category`
	- **GET /product/by-price:** ordenar por precio — params: `companyId`, `sort=ASC|DESC`, `category`, `name`

Notes:
- Los endpoints se usan desde `src/Api/companyAPI.ts` y `src/Api/productsApi.ts`.
- El valor base se configura en `src/constants/index.ts` como `VITE_ARQBS_API_URL`.