package basil3d

type AppTile struct {
	Content []*AppTileContent `json:"content"`
}
type AppTileContent struct {
	Bg AppColor `json:"bg"`
}

func (p *App) buildTile(src *Source) error {
	p.Tile = make(map[string]*AppTile, len(src.Tile))
	for k, v := range src.Tile {
		var a AppTile
		a.Content = make([]*AppTileContent, 0, len(v.Content))
		for _, b := range v.Content {
			var c AppTileContent
			c.Bg = toAppColor0000(b.Bg)
			a.Content = append(a.Content, &c)
		}
		p.Tile[k] = &a
	}
	return nil
}
