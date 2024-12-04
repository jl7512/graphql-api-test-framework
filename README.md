## GraphQL API Test Framework

### Pre-requisites:

- Download and install **NodeJS v18.7.0 minimum (required to run cucumber)** on your system

If you are on Windows, open up a PowerShell terminal and execute the following command:

```
nvm use $(Get-Content .nvmrc)
```

This will make use of the .nvmrc file in the repo to use nvm (node version manager) to switch your node version.

- Download and install **git**

You will need git to clone the repository to your local system

### Installation

Clone the repository to your local file system:

```
git clone git@github.com:jl7512/graphql-api-test-framework.git
```

```
cd graphql-api-test-framework
npm i
```

### Running the tests

```
npm test
```

### Libaries:

Below are a list of libraries used in this test framework and the justifications as to why they are used.

- **@apollo/client**

This is used to make the GraphQL query and mutation calls to the GraphQL API.

- **@cucumber/cucumber**

A BDD framework in which tests are written in feature files (.feature) using Gherkin (Given, When, Then) which is the domain specific language
and makes understanding the tests easy because they are written in a human readable format.

- **@cucumber/pretty-formatter**

This is a formatting library to be used in conjunction with Cucumber so that tests are displayed clearly and nicely in the terminal.

- **@types/bluebird**, **@types/node**

These packages add type definitions so that the TypeScript transpiler can resolve the types in the respective packages as they are not included
by default.

- **@typescript-eslint/eslint-plugin and other eslint dependencies**

ESLint plugins for TypeScript. ESlint is used to enforce code style and catch code smells.

- **bluebird**

A Promise library offering a wide range of Promise related functions.

- **expect**

This is the Jest assertion library. It has a lot of matchers which help in asserting object equality which makes it versatile and well suited
for our test framework as we will be asserting the shape of the GraphQL response data as well as the fields and their values.

- **prettier**

This is a library used for code formatting, it is superior to eslint.

- **cross-fetch**

This is a dependency used to initialise the ApolloClient.

- **react**

Another dependency for the ApolloClient as we are using the React ApolloClient to make our GraphQL API calls.

- **ts-node**

This is a TypeScript excution engine which uses JIT (just in time) transpilation to transform JavaScript into TypeScript during runtime. 
Since it transforms during runtime this means that you do not need to transpile your code first, so this prevents any JavaScript files from
being emitted.

- **typescript**

This is the TypeScript package that gives us the ability to write our tests and code in TypeScript. TypeScript extends JavaScript and offers
type safety which helps improve developer experience as it will alert you to type safety errors while you write code in your IDE.

### Cucumber World

Cucumber offers a class that gives us an isolated scope/context for our tests. The instance of the World class is created for each scenario and
torn down after the scenario has finished running. This prevents state from one scenario leaking into another. Using an instance of World we can save
state in variables held in the World object for us to assert later on in the scenario using the step definitions, we can access these variables
using the `this` keyword.

One caveat is that this does not work for `arrow functions` as `arrow functions` **DO NOT** have a binding of `this`. This will only work if
we use `functions` because in functions the `this` keyword is bound to the object that called the function.

[More information on here](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md)

### Environment Variables:

**URL**

You can target a different test environment using the "URL" environment variable.

```
URL=www.blahtestenvironment.com npm test
```

**TAGS**

When you use `npm test` all the tests will be run by default. You can choose which tests to selectively run by using the environment variable
"TAGS".

```
TAGS=@test1 npm test
```

**DEBUG**

You can enable **debug mode** in the GraphQL client. This useful to let you view what is being sent to the GraphQL API.

```
DEBUG=true npm test
```

**OBSERVATIONS/BUGS:**

**GraphQL Schema**

The schema does not state whether the fields are **"non-nullable"** or not. The schema should denote this for the input fields of the queries
and mutations as well as the fields in the response. **To denote a field as non-nullable, simply put an exclamation sign "!" after the type.**

**Example:**
```
SkillDeleteOne(id: Int): DeleteResult!
```

**1. BUG: The "RoleUpdateOne" mutation does not allow you to update skills on a role**

**Actual:**

The "RoleUpdateOne" mutation only lets you update the "name" field of the role but NOT the "skills" field.

**Expected:**

The "RoleUpdateOne" mutation should allow you to update skills on a role as well as update the name of the role. This would mean that the 
mutation "RoleSkillsOverwrite" is not needed as the "RoleUpdateOne" mutation can serve both purposes allowing you to update the "name" of
the role and the "skills" in one mutation, making the "RoleSkillsOverwrite" mutation redundant.

**2. BUG: The "RoleUpdateOne" mutation creates a new Role resource on the server if the role "id" that is sent in the mutation does not exist**

**Steps to reproduce:**

1. Send a RoleUpdateOne mutation with a role "id" that does not exist

2. Send a query to get back all the available roles on the server, you should see that there are no roles available on the server

**Actual:**

Payload with a "Role" is returned

**Expected:**

The API should return a client error as the API should not allow you to update a role that does not exist.

**3. BUG: The "SkillUpdateOne" mutation creates a new Skill resource on the server if the "id" that is sent in the mutation does not exist**

**Steps to reproduce:**

1. Send a SkillUpdateOne mutation with an id that does not exist

2. Send a query to get back all the available skills on the server, you should see that there are no skills available on the server

**Actual:**

Payload with a "Skill" is returned

**Expected:**

There should be an error returned as there are no skills with the non-existent "id"

**4. BUG: The GraphQL input type "Asd" should have an appropriate name to denote its purpose**

**5. BUG: The "RoleCreateOne" mutation allows you to create a role with an empty string as the name**

**Steps to reproduce:**

1. Create a Role with the RoleCreateOne mutation and set the name to "" empty string

**Actual:**

Creates a Role with empty string as the "name"

**Expected:**

This is not expected behaviour and there should be validation on the "name" field to prevent empty strings from being sent in the mutation

**6. BUG: Cannot re-create a previously deleted skill**

**Steps to reproduce:**

1. Create a "Skill" with name "Manual Testing"

2. Delete the "Manual Testing" skill

3. Send a query to get back all available skills on the server, you should see that there are no skills available on the server

4. Create a "Skill" with the same name "Manual Testing" again

**Actual:**

You get an error, even though there are no skills with the name "Manual Testing"

**Expected:**

There should not be an error returned as there are no skills with the name "Manual Testing" on the server

**7. BUG: The API allows the creation of multiple roles with the exact name**

Depending on the requirements this may not be a bug but I'll note it here incase it is a trick question.

**Steps to reproduce:**

1. Create a "Role" with name "QA"

2. Send a query to get back all available roles on the server, you should not see any roles

3. Create a "Role" with the same name "QA" again

**Actual:**

The API returns a response with payload of a "Role" object

**Expected:**

The API should return an error because the names of Roles should be unique.

**8. BUG: If "id" field is provided to the "RoleFindOne" query the "name" field is ignored**

**Steps to reproduce:**

1. Create a Role using the "RoleCreateOne" mutation, take note of the "id" and "name". We will refer to this role as "role1"

2. Create another Role using the "RoleCreateOne" mutation, take note of the "id" and "name". We will refer to this role as "role2"

3. Send a "RoleFindOne" query with the "id" of "role2" and the "name" of "role1"

**Actual:**

The "name" field of "role1" is ignored and "role2" is returned in the response payload

**Expected:**

Since we are sending the "id" of "role2" but the "name" of "role1". I would expect the server to use both fields ("id" and "name") to
filter the available roles on the server and return the "Role" that matches both fields. However that does not happen.

**Recommendation**

If an identifier is to be used to try to filter Roles on the server, it would be best to just use the "id" field as it **SHOULD BE** the
most unique identifier and it **SHOULD BE** a read-only field so it cannot be changed on the client side. Only the server should have the
capability to do that, so it is safe to be used this way.

**9. BUG: The "RoleSkillsOverwrite" mutation allows updating a role with a skill "id" that does not exist**

**Steps to reproduce:**

1. Create a Role using the "RoleCreateOne" mutation

2. Update the skills on the role that was just created using "RoleSkillsOverwrite" mutation and pass in the role "id", a non existing skill "id" and "weight" of "1"

**Actual:**

The response payload returns the role with the following fields in the skill object:

```
"skill": {
    "createdAt": "0001-01-01T00:00:00Z",
    "deletedAt": null,
    "id": 0,
    "name": "",
    "updatedAt": "0001-01-01T00:00:00Z"
},
```

**Expected:**

The API should return a client error as the API should not allow you to update a role with skills that do not exist.
