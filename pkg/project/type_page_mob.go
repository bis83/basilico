package project

type Mob struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Draw string `toml:"draw"`

	Radius float32 `toml:"radius"`
	Weight float32 `toml:"weight"`

	Action [][]string `toml:"action"`
}
