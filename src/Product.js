import Distributions from './Distributions'

const distributions = new Distributions()

class Product {

  workingTime = 8 * 60
  stopAssembly = -1
  isAssembling = false
  assembledTime = 0
  finalProduct = []

  assambleProduct = (minute, day, tapas, inter) => {

    const topCap = tapas.caps.findIndex(cap => (cap.painted === true && cap.assembled === false && cap.type === 'Superior'))
    const lowerCap = tapas.caps.findIndex(cap => (cap.painted === true && cap.assembled === false && cap.type === 'Inferior'))
    const interior = inter.interiors.findIndex(interior => (interior.assembled === false))

    if (!this.isAssembling && topCap > -1 && lowerCap > -1 && interior > -1) {
      this.assembledTime = distributions.getNormalInv(15, 10)
      const nextStop = minute + this.assembledTime
      this.stopAssembly = nextStop >= this.workingTime ? (nextStop - this.workingTime) : nextStop
      this.isAssembling = true
    }

    if (this.stopAssembly === minute) {
      this.finalProduct.push({
        creationTime: { day, minute },
        topCap,
        lowerCap,
        interior,
        totalTime: 0,
        assembledTime: this.assembledTime
      })
      tapas.caps[topCap].assembled = true
      tapas.caps[lowerCap].assembled = true
      inter.interiors[interior].assembled = true
      this.isAssembling = false
    }
  }
}

export default Product