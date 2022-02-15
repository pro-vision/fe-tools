// provides handy method to measure elapsed time between events
module.exports = class Timer {
  constructor() {
    this.startTimes = {};
  }

  /**
   * marks the time to be measured later
   *
   * @param {string} name - marker name
   */
  start(name) {
    this.startTimes[name] = Date.now();
  }

  /**
   * return time elapsed from the start time for the given marker
   *
   * @param {string} name - name of time marker
   * @param {boolean} [format=false] - should the time be formatted in seconds or in milliseconds
   * @returns {string}
   */
  measure(name, format) {
    const duration = Date.now() - this.startTimes[name];
    return format ? (duration / 1000).toFixed(2) : duration;
  }
};
