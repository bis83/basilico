package project

type Item struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Text string `toml:"text"`
	Desc string `toml:"desc"`
	Icon int    `toml:"icon"`

	Hit     string `toml:"hit"`
	Consume bool   `toml:"consume"`
}
