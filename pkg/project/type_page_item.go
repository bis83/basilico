package project

type Item struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Text string `toml:"text"`
	Desc string `toml:"desc"`
	Icon int    `toml:"icon"`

	Usable *ItemUsable  `toml:"usable"`
	Trait  []*ItemTrait `toml:"trait"`
}

type ItemUsable struct {
	Hit     string `toml:"hit"`
	Consume bool   `toml:"consume"`
}

type ItemTrait struct {
	Type  string `toml:"type"`
	Value int    `toml:"value"`
}
