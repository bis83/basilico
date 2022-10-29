package project

type Grid struct {
	Name string `toml:"name"`

	Width  int `toml:"width"`
	Height int `toml:"height"`

	Grid []*GridBase `toml:"base"`
	Tile []*GridTile `toml:"tile"`
}

type GridBase struct {
	Base   string `toml:"base"`
	X      int    `toml:"x"`
	Y      int    `toml:"y"`
	Width  int    `toml:"width"`
	Height int    `toml:"height"`
}

type GridTile struct {
	Tile   string `toml:"tile"`
	X      int    `toml:"x"`
	Y      int    `toml:"y"`
	HAngle int    `toml:"h-angle"`
}
