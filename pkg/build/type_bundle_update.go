package build

type UpdateGround struct {
	Buffer string `json:"b"`
	DOP6   []int  `json:"dop6"`
	DOP8   []int  `json:"dop8"`
	DOP12  []int  `json:"dop12"`
}

type Update struct {
	Name   string          `json:"name"`
	Ground []*UpdateGround `json:"ground"`
}
