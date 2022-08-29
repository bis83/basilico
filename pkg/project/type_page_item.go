package project

type Item struct {
	Name string `toml:"name"`
	Text string `toml:"text"`
	Desc string `toml:"desc"`
	Icon int    `toml:"icon"`

	SaveID int `toml:"save-id"`
}
