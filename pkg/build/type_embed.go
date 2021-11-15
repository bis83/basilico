package build

type EmbedStart struct {
	Scene    string    `json:"scene"`
	Position []float32 `json:"position"`
	Angle    []float32 `json:"angle"`
}

type Embed struct {
	Start EmbedStart `json:"start"`
}
