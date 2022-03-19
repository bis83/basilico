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
./basilico [init/clean/build/serve] [your-project-directory]
```

- Create `setup.toml` (a project setting), `pages/` (asset descriptions) if not exists.
```
./basilico init [your-project-directory]
```
- Start a server. Visit `localhost:8080`
```
./basilico serve [your-project-directory]
```
- `dist` are generated files. (No need add to repository)

## License

MIT License.
