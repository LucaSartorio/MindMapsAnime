# History

`history.json` — one record per render id (`<contentId>@<locale>[+<variant>]`), written only by the
pipeline (`social:queue`, `social:render:queue`, `social:retry:failed`). Versioned: it is what prevents the
same video from being produced twice. Format: see docs/SOCIAL_ENGINE.md › History.
