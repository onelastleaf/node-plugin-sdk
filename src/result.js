export class ActionResult {
  constructor(result = undefined, artifacts = []) {
    this.result = result;
    this.artifacts = artifacts;
  }

  static string(value) {
    return new ActionResult({ stringValue: value });
  }
}
