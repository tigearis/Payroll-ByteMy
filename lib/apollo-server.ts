import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { readFileSync } from "fs"
import { resolvers } from "@/graphql/resolvers"

const typeDefs = readFileSync("./graphql/schema.graphql", { encoding: "utf-8" })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

export default startServerAndCreateNextHandler(server)

