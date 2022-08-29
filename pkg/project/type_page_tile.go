package project

type Tile struct {
	Name string `toml:"name"`
	Text string `toml:"text"`
	Desc string `toml:"desc"`

	Draw   string `toml:"draw"`
	Height int    `toml:"height"`

	Item      string `toml:"item"`
	ItemCount int    `toml:"item-count"`

	SaveID int `toml:"save-id"`
}
