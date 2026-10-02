# History

`history.json` — one record per render id (`<contentId>@<locale>[+<variant>]`), written only by the
pipeline: render state by `social:queue`, `social:render:queue`, `social:retry:failed`; publication state
(`platforms[]`, per platform) only by `social:publication:apply` from publication receipts. Versioned: it is
what prevents the same video from being produced — or scheduled — twice. Never edit it by hand.
Format: see docs/SOCIAL_ENGINE.md › History and › Publication State.
