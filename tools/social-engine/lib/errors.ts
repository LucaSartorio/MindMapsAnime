/** Error with a human-readable message meant to be printed as-is by the CLI. */
export class SocialEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SocialEngineError';
  }
}

/** Data required by a template is missing/invalid: the render must not start. */
export class RenderDataError extends SocialEngineError {
  constructor(template: string, reason: string) {
    super(`Cannot render ${template}:\n  ${reason}`);
    this.name = 'RenderDataError';
  }
}
