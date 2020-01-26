# bull-dashboard

a simple bull queue dashboard.

set the following environment variables depending on your needs:

- optionally `REDIS_HOST`, defaults to `0.0.0.0`
- optionally `REDIS_PASSWORD`, unset by default
- optionally `REDIS_PORT`, defaults to `6379`
- optionally `REDIS_DB`, defaults to '0'

you can **use it already with a one-liner**, given you have *nodejs* installed and *redis* running on localhost on port `6379`:

```
npx bull-dashboard@latest
```