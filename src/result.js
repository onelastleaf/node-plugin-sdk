import {
  snapshotArtifactDescriptor,
  validateArtifactDescriptor,
  validateConfigValue,
} from './validation.js';

export class ActionResult {
  constructor(result = undefined, artifacts = []) {
    if (!Array.isArray(artifacts)) throw new TypeError('action artifacts must be an array');
    this.result = result;
    this.artifacts = Object.freeze(artifacts.map(snapshotArtifactDescriptor));
    assertActionResult(this);
    Object.freeze(this);
  }

  static string(value) {
    if (typeof value !== 'string') throw new TypeError('action string result must be a string');
    return new ActionResult({ stringValue: value });
  }
}

export function assertActionResult(value) {
  if (!(value instanceof ActionResult)) {
    throw new TypeError('action handler must return an ActionResult');
  }
  if (value.result !== undefined) {
    validateConfigValue(value.result, { label: 'action result' });
  }
  if (!Array.isArray(value.artifacts)) {
    throw new TypeError('action artifacts must be an array');
  }
  const seen = new Set();
  for (const artifact of value.artifacts) {
    validateArtifactDescriptor(artifact);
    const id = artifact.artifactId.value;
    if (seen.has(id)) throw new TypeError('action artifacts must have unique IDs');
    seen.add(id);
  }
  return value;
}
