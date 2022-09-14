```js
query Job {
  job(id: "yX71WsWqBRAFuMAIDj4W0") {
    id
    title
    description
    company {
      id
    }
  }
}
```

```js
query Jobs {
  jobs {
    id
    title
  }
}
```

```js
query Company {
  company(id: "wvdB54Gqbdp_NZTXK9Tue") {
    id
    name
  }
}
```

```js
// should use header Authorization Bearer token
mutation CreateJob {
  job: createJob(input: {
    title: "test",
    description: "description"
  }) {
    id
    title
  }
}
```
