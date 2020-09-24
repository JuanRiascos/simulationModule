import Distributions from './Distributions'

const distributions = new Distributions()

class Interiors {


	interiors = []
	interiorsPackage = []
	workingTime = 8 * 60
	nextInteriorsArrival = 0
	stopInteriorsUnpacked = 0
	unpackedTime = 0
	isUnpacking = false
	scrap = []


  interiorsArrival = (minute, day) => {
    if (minute === this.nextInteriorsArrival) {
      this.interiorsPackage.push({
        arrivalTime: { day, minute },
        unpacked: false
      })
      const nextArrival = distributions.getExponential(64) + minute
      this.nextInteriorsArrival = nextArrival >= this.workingTime ? (nextArrival - this.workingTime) : nextArrival
    }
  }

  interiorsUnpacked = (minute, day) => {

    if (this.interiorsPackage.length === 0) return

    const indexPackage = this.interiorsPackage.findIndex(interior => interior.unpacked === false)

    if (!this.isUnpacking && indexPackage > -1) {
      this.unpackedTime = distributions.getUniform(30, 50)
      const nextStop = minute + this.unpackedTime
      this.stopInteriorsUnpacked = nextStop >= this.workingTime ? (nextStop - this.workingTime) : nextStop
      this.isUnpacking = true
    }

    if (this.stopInteriorsUnpacked === minute) {
      this.interiorsPackage[indexPackage].unpacked = true
      for (let i = 0; i < 3; i++) {
        const faulty = this.getFaulty()
        if (faulty) {
          this.interiors.push({
            arrivalTime: this.interiorsPackage[indexPackage].arrivalTime,
            unpackedTime: { day, minute },
            assembled: false,
            totalTime: this.unpackedTime
          })
        } else {
          this.scrap.push({ unpackedTime: { day, minute }, totalTime: this.unpackedTime })
        }
      }
      this.isUnpacking = false
    }
  }

  getFaulty = () => {
    return Math.random() < 0.90 ? true : false
  }

}

export default Interiors