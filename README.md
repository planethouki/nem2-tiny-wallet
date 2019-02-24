# nem2-tiny-wallet

Alpaca, Bison, Cow compatible.

It is because this wallet supports only transfer transaction.

## hosting

- index.html
- index.js
- index.css
- normalize.css
- skeleton.css

## docker

https://cloud.docker.com/repository/docker/planethouki/nem2-tiny-wallet

## docker-compose

```yaml
  wallet:
    image: planethouki/nem2-tiny-wallet
    stop_signal: SIGINT
    command: ["python", "-m", "http.server", "8000"]
    ports:
    - "5000:8000"
```