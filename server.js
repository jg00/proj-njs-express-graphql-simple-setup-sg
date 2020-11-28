const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema"); // instance of a schema was returned

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => console.log("Server listening on port 3090"));
