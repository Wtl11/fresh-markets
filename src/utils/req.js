
import axios from 'axios'
const TIME_OUT = 10000
const ERR_OK = 0
const ERR_NO = -404
const COMMON_HEADER = {}

class Request {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Request()
    }
    return this.instance
  }
  constructor() {
    this.http = axios.create({
      timeout: TIME_OUT,
      headers: COMMON_HEADER
    })
  }
}

export default Request.getInstance()
