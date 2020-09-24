import jstat from "jstat"

export default class Distributions {

  getPoisson = (lambda) => {
    const L = Math.exp(-lambda)
    let p = 1
    let k = 0
    do {
      k++
      p *= Math.random()
    } while (p > L)
    return k - 1
  }

  getTriangular = (a, b, c) => {
    const segmentRatio = (b - a) / (c - a)
    const random = Math.random()
    return segmentRatio > random
      ? Math.round(a + (b - a) * Math.sqrt(random * (b - a) * (c - a)))
      : Math.round(c - (c - b) * Math.sqrt((1 - random) * (b - a) * (c - a)))
  }

	getNormalInv = (media, varianza) => {
		return Math.round(jstat.normal.inv(Math.random(), media, Math.sqrt(varianza)))
	}

	getExponential = (media) => {
		return Math.round(-Math.log(Math.random()) * media)
	}

	getUniform = (inferiorLimit, upperLimit) => {
		return Math.round(inferiorLimit + (upperLimit - inferiorLimit) * Math.random())
	}
}