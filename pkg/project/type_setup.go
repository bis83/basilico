package project

type Setup struct {
	Title   string `toml:"title"`
	Addr    string `toml:"addr"`
	Logging bool   `toml:"logging"`
	Assert  bool   `toml:"assert"`
	Minify  bool   `toml:"minify"`
}
