import Distributions from './Distributions'

const distributions = new Distributions()

class Caps {

  workingTime = 8 * 60
  nextCapsArrival = 0
  cantCapsArrival = 0
  timeCapsArrival = 0
  stopCapsPainting = 0
  isPainting = false
  caps = []

  capsArrival(minute, day) {
    if (minute % 60 === 0) {
      this.nextCapsArrival = minute
      this.cantCapsArrival = distributions.getPoisson(5)
      this.timeCapsArrival = Math.floor(60 / this.cantCapsArrival)
    }

    if (minute === this.nextCapsArrival) {
      this.caps.push({
        type: this.getType(),
        arrivalTime: { day, minute },
        painted: false,
        assembled: false,
        totalTime: 0,
        timesPainted: 0
      })
      this.nextCapsArrival += this.timeCapsArrival
    }
  }

  capsPainting(minute) {

    if (this.caps.length === 0) return

    const indexPainting = this.caps.findIndex(cap => cap.painted === false)

    if (!this.isPainting && indexPainting > -1) {
      const paintingTime = distributions.getTriangular(6, 9, 12)
      this.caps[indexPainting].totalTime += paintingTime
      this.caps[indexPainting].timesPainted++
      const nextStop = minute + paintingTime
      this.stopCapsPainting = nextStop >= this.workingTime ? (nextStop - this.workingTime) : nextStop
      this.isPainting = true
    }

    if (this.stopCapsPainting === minute) {
      this.caps[indexPainting].painted = this.getFaultyPaint()
      this.isPainting = false
    }
  }


  getType() {
    return Math.random() < 0.5 ? 'Superior' : 'Inferior'
  }

  getFaultyPaint() {
    return Math.random() < 0.95 ? true : false
  }
}

export default Caps