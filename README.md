# basilico

A single page application generator for Game.

## Build

```
cd ./basilico
go build -ldflags '-s -w'
```

## How to use

```
./basilico [your-project-directory]
```

- Create `_config.toml` (a project setting file) if not exists.
- Start a server. See `localhost:8080`
- Customize your project and rerun.
- `index.html` `app.js` `data/` are generated files. (No need add to repository)

## License

MIT License.
