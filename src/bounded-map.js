export class BoundedMap extends Map {
  #limit;

  constructor(limit) {
    if (!Number.isSafeInteger(limit) || limit < 1) {
      throw new RangeError('bounded map limit must be a positive safe integer');
    }
    super();
    this.#limit = limit;
  }

  set(key, value) {
    if (this.has(key)) this.delete(key);
    super.set(key, value);
    while (this.size > this.#limit) this.delete(this.keys().next().value);
    return this;
  }

  deleteValues(value) {
    for (const [key, entry] of this) {
      if (entry === value) this.delete(key);
    }
  }
}
