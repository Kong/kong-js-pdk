'use strict';

// https://stackoverflow.com/questions/47157428/how-to-implement-a-pseudo-blocking-async-queue-in-js-ts
class AsyncBlockingQueue {
  constructor() {
    // invariant: at least one of the arrays is empty
    this.resolvers = [];
    this.promises = [];
  }

  _add() {
    this.promises.push(new Promise(resolve => {
      this.resolvers.push(resolve);
    }))
  }

  enqueue(t) {
    if (!this.resolvers.length) this._add();
    this.resolvers.shift()(t);
  }

  dequeue() {
    if (!this.promises.length) this._add();
    return this.promises.shift();
  }

  // now some utilities:
  isEmpty() { // there are no values available
    return !this.promises.length; // this.length <= 0
  }

  isBlocked() { // it's waiting for values
    return !!this.resolvers.length; // this.length < 0
  }

  get length() {
    return this.promises.length - this.resolvers.length;
  }

  [Symbol.asyncIterator]() {
    return {
      next: () => this.dequeue().then(value => ({
        done: false,
        value
      }))
    };
  }
}

class Pipe {
  constructor (get, put) {
    this.get = get
    this.put = put
  }
}

class PipePair {
  constructor() {
    this.qa = new AsyncBlockingQueue()
    this.qb = new AsyncBlockingQueue()

    this.a = new Pipe(
      () => { return this.qa.dequeue() },
      (v) => { return this.qb.enqueue(v) },
    )

    this.b = new Pipe(
      () => { return this.qb.dequeue() },
      (v) => { return this.qa.enqueue(v) },
    )
  }

  getPair() {
    return [this.a, this.b]
  }
}

module.exports = PipePair
