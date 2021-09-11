package project

type Start struct {
	Scene    string    `toml:"scene"`
	Position []float32 `toml:"position"`
	Angle    []float32 `toml:"angle"`
}

type Config struct {
	Title   string `toml:"title"`
	Addr    string `toml:"addr"`
	Logging bool   `toml:"logging"`
	Assert  bool   `toml:"assert"`
	Minify  bool   `toml:"minify"`
	Start   Start  `toml:"start"`
}
