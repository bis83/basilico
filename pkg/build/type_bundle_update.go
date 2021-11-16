package build

type UpdateGround struct {
	Buffer *string `json:"b"`
	DOP6   *string  `json:"dop6"`
	DOP8   *string  `json:"dop8"`
	DOP12  *string  `json:"dop12"`
}

type Update struct {
	Name   string          `json:"name"`
	Ground []*UpdateGround `json:"ground"`
}
