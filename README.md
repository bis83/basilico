# basilico

A single page application generator for Game.

## Build

```
cd <clone-directory>
go get ./...
go build -ldflags '-s -w' -trimpath ./cmd/...
```

## Usage

```
./basilico your-project-directory [clean/build/serve]
```

- Start a server. Visit `localhost:8080`
```
./basilico your-project-directory serve
```
- `dist` are generated files. (No need add to repository)

## License

MIT License.
