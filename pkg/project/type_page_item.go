package project

type Item struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Text string `toml:"text"`
	Desc string `toml:"desc"`
	Icon int    `toml:"icon"`

	Hand *ItemHand `toml:"hand"`
	Base *ItemBase `toml:"base"`
}

type ItemHand struct {
	Hit string `toml:"hit"`
}

type ItemBase struct {
	Base string `toml:"base"`
}
