package project

type Mob struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Draw string `toml:"draw"`

	Action [][]string `toml:"action"`
}
