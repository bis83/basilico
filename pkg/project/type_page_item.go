package project

type Item struct {
	Name string `toml:"name"`
	Text string `toml:"text"`
	Desc string `toml:"desc"`
	Icon int    `toml:"icon"`

	SaveID int `toml:"save-id"`

	Hand *ItemHand `toml:"hand"`
	Tile *ItemTile `toml:"tile"`
}

type ItemHand struct {
	Hit string `toml:"hit"`
}

type ItemTile struct {
	Tile string `toml:"tile"`
}
