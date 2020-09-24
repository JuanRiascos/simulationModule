import React, { useState, useEffect } from 'react'
import './App.css'
import { XYPlot, VerticalBarSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis'
import Caps from './Caps'
import Interiors from './Interiors'
import Product from './Product'
import { Card, Col, Layout, Row } from 'antd'
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

		let tops = 0,
			lowers = 0
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

		const data = totalData.map((item) => item.y)

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
				min: Math.min(res.min, row.y),
			}
		},
		{ max: -Infinity, min: Infinity }
	)

	const BarSeries = VerticalBarSeries

	return (
		<Layout className='content'>
			<Row>
				<Card bordered className='card'>
					<div className='card__body'>
						<div>
							<p>Tapas llegadas: {capsEntry.length}</p>
							<p>Tapas superiores: {topCaps}</p>
							<p>Tapas inferiores: {lowerCaps}</p>
						</div>
						<div>
							<p>Paquetes de interiores llegados: {interiorsEntry.length}</p>
							<p>Interiores buenos: {totalInteriors.length}</p>
							<p>Interiores malos (chatarra): {totalScrap.length}</p>
						</div>
						<div className='card__productFinished'>
							<p>Productos terminados: {totalProducts.length}</p>
						</div>
					</div>
				</Card>

				<div style={{ display: 'flex', flexDirection: 'row', marginTop: 100 }}>
					<div>
						<p className='title'>Total de productos por día</p>
						<Card className='card card--graph'>
							<XYPlot margin={{ left: 75 }} width={600} height={300} yDomain={[0, yTotal.max]} stackBy='y'>
								<VerticalGridLines />
								<HorizontalGridLines />
								<BarSeries className='vertical-bar-series-example' data={graphTotal} />
								<XAxis />
								<YAxis />
							</XYPlot>
						</Card>
					</div>
					<div className='other'>
						<div style={{ marginRight: 20 }}>
							<p>Mínimo:</p>
							<p>Máximo:</p>
							<p>Media:</p>
							<p>Mediana:</p>
							<p>Moda:</p>
							<p>Rango:</p>
							<p>Varianza:</p>
						</div>
						<div span='12'>
							<strong>{min}</strong>

							<strong>{max}</strong>

							<strong>{media?.toFixed(2)}</strong>

							<strong>{mediana}</strong>

							<strong>{moda?.length ? moda.join(', ') : moda}</strong>

							<strong>{rango}</strong>

							<strong>{varianza?.toFixed(2)}</strong>
						</div>
					</div>
				</div>
			</Row>
		</Layout>
	)
}

export default App
