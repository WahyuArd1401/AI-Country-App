import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApolloProvider } from "@apollo/client"
import client from "./apolloClient"
import Home from "./pages/Home"

function App() {

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App
