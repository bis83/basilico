package project

type Tile struct {
	Name string `toml:"name"`
	Text string `toml:"text"`
	Desc string `toml:"desc"`

	Draw   string `toml:"draw"`
	Height int    `toml:"height"`

	SaveID int `toml:"save-id"`

	Mine   *TileMine   `toml:"mine"`
	Device *TileDevice `toml:"device"`
}

type TileMine struct {
	Item  string `toml:"item"`
	Count int    `toml:"count"`
}

type TileDevice struct {
	Action [][]string `toml:"action"`
}
