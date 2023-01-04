package project

type Tile struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Text string `toml:"text"`
	Desc string `toml:"desc"`

	Draw string `toml:"draw"`

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
