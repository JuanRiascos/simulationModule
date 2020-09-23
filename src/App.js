import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
	const [mediaPoisson, setMediaPoisson] = useState(5)
	const [tapasEntry, setTapasEntry] = useState(1)
	const main = () => {
		for (let meses = 0; meses < 30; meses++) {
			for (let horas = 0; horas < 8 * 60; horas++) {
				const random = Math.random().toFixed(2)
			}
		}
	}
	const factorial = (n) => {
		return n != 1 ? n * factorial(n - 1) : 1
	}

	const poisson = (mediaPoisson, numberTapas) => {
		return ((mediaPoisson ^ numberTapas) * Math.exp(-mediaPoisson)) / factorial(numberTapas)
	}

	const triangular = (a, b, c) => {
		const segmentRatio = (b - a) / (c - a)
		const random = Math.random()
		return segmentRatio > random
			? a + (b - a) * Math.sqrt(random * (b - a) * (c - a))
			: c - (c - b) * Math.sqrt((1 - random) * (b - a) * (c - a))
	}

	const exponential = (media) => {
		return Math.log(Math.random()) * media
	}

	const uniforme = (inferiorLimit, upperLimit) => {
		return inferiorLimit + (upperLimit - inferiorLimit) * Math.random()
  }
  
  const normal = ()=>{
    
  }

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
