package project

type Base struct {
	Name   string `toml:"name"`
	Draw   string `toml:"draw"`
	SaveID int    `toml:"save-id"`
	Item   string `toml:"item"`
}
