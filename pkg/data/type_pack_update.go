package data

type UpdateGround struct {
	Buffer *string `json:"b"`
	DOP6   *string `json:"dop6"`
	DOP8   *string `json:"dop8"`
	DOP12  *string `json:"dop12"`
}

type Update struct {
	Ground []*UpdateGround `json:"ground"`
}
