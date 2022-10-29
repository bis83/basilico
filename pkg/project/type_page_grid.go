package project

type Grid struct {
	Name string `toml:"name"`

	Width  int `toml:"width"`
	Height int `toml:"height"`

	Grid []*GridBase `toml:"base"`
	Tile []*GridTile `toml:"tile"`
	Mob  []*GridMob  `toml:"mob"`
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

type GridMob struct {
	Mob    string `toml:"mob"`
	X      int    `toml:"x"`
	Y      int    `toml:"y"`
	HAngle int    `toml:"h-angle"`
	VAngle int    `toml:"v-angle"`
}
