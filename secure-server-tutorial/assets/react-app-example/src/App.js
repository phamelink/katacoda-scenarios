import logo from "./logo.svg"
import "./App.css"

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Welcome to an example app written for this tutorial!</h1>
				<img src={logo} className="App-logo" alt="logo" />

				<a
					className="App-link"
					href="https://katacoda.com/phamelink/scenarios/secure-server-tutorial"
					target="_blank"
					rel="noopener noreferrer">
					Secure server tutorial
				</a>
			</header>
		</div>
	)
}

export default App
