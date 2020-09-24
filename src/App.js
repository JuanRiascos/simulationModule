import React, { useState, useEffect } from 'react'
import './App.css'
import { XYPlot, VerticalBarSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis'
import Caps from './Caps'
import Interiors from './Interiors'
import Product from './Product'
const { jStat } = require('jstat')

const tapas = new Caps()
const interiors = new Interiors()
const product = new Product(tapas, interiors)

function App() {
	const [capsEntry, setCapsEntry] = useState([])
	const [interiorsEntry, setInteriorsEntry] = useState([])
	const [totalProducts, setTotalProducts] = useState([])
	const [totalInteriors, setTotalInteriors] = useState([])
	const [totalScrap, setTotalScrap] = useState([])
	const [topCaps, setTopCaps] = useState()
	const [lowerCaps, setLowerCaps] = useState()

	const [media, setMedia] = useState()
	const [mediana, setMediana] = useState()
	const [moda, setModa] = useState()
	const [rango, setRango] = useState()
	const [varianza, setVarianza] = useState()
	const [max, setMax] = useState()
	const [min, setMin] = useState()

	const [graphMedia, setGraphMedia] = useState([])
	const [graphTotal, setGraphTotal] = useState([])

	useEffect(() => {
		main()
	}, [])

	const workingTime = 8 * 60

	const main = async () => {
		for (let day = 1; day <= 30; day++) {
			tapas.nextCapsArrival = 0
			for (let minute = 0; minute < workingTime; minute++) {
				tapas.capsArrival(minute, day)
				tapas.capsPainting(minute, day)
				interiors.interiorsArrival(minute, day)
				interiors.interiorsUnpacked(minute, day)
				product.assambleProduct(minute, day, tapas, interiors)
			}
		}

		for (let i = 0; i < product.finalProduct.length; i++) {

			const dayTop = tapas.caps[product.finalProduct[i].topCap].arrivalTime.day
			let minuteTop = 0
			if (dayTop == 1)
				minuteTop = tapas.caps[product.finalProduct[i].topCap].arrivalTime.minute
			else
				minuteTop = (dayTop - 1) * workingTime + tapas.caps[product.finalProduct[i].topCap].arrivalTime.minute


			const dayLower = tapas.caps[product.finalProduct[i].lowerCap].arrivalTime.day
			let minuteLower = 0
			if (dayLower == 1)
				minuteLower = tapas.caps[product.finalProduct[i].lowerCap].arrivalTime.minute
			else
				minuteLower = (dayLower - 1) * workingTime + tapas.caps[product.finalProduct[i].lowerCap].arrivalTime.minute


			const dayInterior = interiors.interiors[product.finalProduct[i].interior].arrivalTime.day
			let minuteInterior = 0
			if (dayInterior == 1)
				minuteInterior = interiors.interiors[product.finalProduct[i].interior].arrivalTime.minute
			else
				minuteInterior = (dayInterior - 1) * workingTime + interiors.interiors[product.finalProduct[i].interior].arrivalTime.minute

			const less = Math.min(minuteTop, minuteLower, minuteInterior)

			const creationDay = product.finalProduct[i].creationTime.day
			let creationMinute = 0
			if (creationDay == 1)
				creationMinute = product.finalProduct[i].creationTime.minute
			else
				creationMinute = ((creationDay - 1) * workingTime + product.finalProduct[i].creationTime.minute)

			product.finalProduct[i].totalTime = creationMinute - less

		}

		let mediaData = []
		let totalData = []
		for (const product2 of product.finalProduct) {
			const day = product2.creationTime.day
			if (!mediaData[day - 1]) {
				mediaData[day - 1] = { id: '1', y: product2.assembledTime, x: day }
				totalData[day - 1] = { id: '1', y: 1, x: day }
			} else {
				mediaData[day - 1].y += product2.assembledTime
				totalData[day - 1].y++
			}
		}

		for (let i = 0; i < mediaData.length; i++) {
			mediaData[i].y /= totalData[i].y
		}

		let tops = 0, lowers = 0
		for (const cap of tapas.caps) {
			if (cap.type == 'Superior') tops++
			else lowers++
		}

		setCapsEntry(tapas.caps)
		setInteriorsEntry(interiors.interiorsPackage)
		setTotalInteriors(interiors.interiors)
		setTotalScrap(interiors.scrap)
		setTotalProducts(product.finalProduct)
		setTopCaps(tops)
		setLowerCaps(lowers)

		const data = totalData.map(item => item.y)

		setGraphMedia(mediaData)
		setGraphTotal(totalData)
		setMedia(jStat.mean(data))
		setMediana(jStat.median(data))
		setModa(jStat.mode(data))
		setRango(jStat.range(data))
		setVarianza(jStat.variance(data))
		setMin(Math.min(...data))
		setMax(Math.max(...data))

	}

	const yTotal = graphTotal.reduce(
		(res, row) => {
			return {
				max: Math.max(res.max, row.y),
				min: Math.min(res.min, row.y)
			};
		},
		{ max: -Infinity, min: Infinity }
	)

	const BarSeries = VerticalBarSeries;

	return (
		<div className='App'>
			<p>Tapas llegadas: {capsEntry.length}</p>
			<p>Tapas superiores: {topCaps}</p>
			<p>Tapas inferiores: {lowerCaps}</p>
			<p>Paquetes de interiores llegados: {interiorsEntry.length}</p>
			<p>Interiores buenos: {totalInteriors.length}</p>
			<p>Interiores malos (chatarra): {totalScrap.length}</p>
			<p>Productos terminados: {totalProducts.length}</p>
			<div style={{ display: 'flex', flexDirection: 'row', marginTop: 100 }}>
				<div>
					<p>Total de productos por día</p>
					<XYPlot
						margin={{ left: 75 }}
						width={600}
						height={300}
						yDomain={[0, yTotal.max]}
						stackBy="y"
					>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis />
						<YAxis />
						<BarSeries className="vertical-bar-series-example" data={graphTotal} />
					</XYPlot>
				</div>
				<div style={{ marginLeft: 30 }}>
					<p>Mínimo: {min}</p>
					<p>Máximo: {max}</p>
					<p>Media: {media?.toFixed(2)}</p>
					<p>Mediana: {mediana}</p>
					<p>Moda: {moda?.length ? moda.join(', ') : moda}</p>
					<p>Rango: {rango}</p>
					<p>Varianza: {varianza?.toFixed(2)}</p>
				</div>
			</div>
		</div>
	)
}

export default App
