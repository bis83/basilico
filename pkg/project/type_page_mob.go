package project

type Mob struct {
	Name   string `toml:"name"`
	SaveID int    `toml:"save-id"`

	Draw string `toml:"draw"`

	Radius float32  `toml:"radius"`
	Mass   *float32 `toml:"mass"`

	Hp     int        `toml:"hp"`
	Item   []*MobItem `toml:"item"`
	Action [][]string `toml:"action"`
}

type MobItem struct {
	Item  string `toml:"item"`
	Count int    `toml:"count"`
}
