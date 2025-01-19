package basil3d

import (
	"github.com/qmuntal/gltf"
)

type Builder struct {
	GLTF  []*gltf.Document
	JSON  map[string]*interface{}
	Room  map[string]*SrcRoom
	Mob   map[string]*SrcMob
	Stage map[string]*SrcStage
}

type SrcColor struct {
	R *float32 `json:"r"`
	G *float32 `json:"g"`
	B *float32 `json:"b"`
	A *float32 `json:"a"`
}

func (p *SrcColor) toFloat() []float32 {
	var r float32 = 0.0
	var g float32 = 0.0
	var b float32 = 0.0
	var a float32 = 0.0
	if p.R != nil {
		r = *p.R
	}
	if p.G != nil {
		g = *p.G
	}
	if p.B != nil {
		b = *p.B
	}
	if p.A != nil {
		a = *p.A
	}
	return []float32{r, g, b, a}
}

type SrcMesh struct {
	Data    string   `json:"data"`
	X       float32  `json:"x"`
	Y       float32  `json:"y"`
	Z       float32  `json:"z"`
	HA      float32  `json:"ha"`
	VA      float32  `json:"va"`
	Factor0 SrcColor `json:"factor0"`
	Factor1 SrcColor `json:"factor1"`
	Factor2 SrcColor `json:"factor2"`
}

type SrcRoom struct {
	Mesh   []*SrcMesh       `json:"mesh"`
	Layout []*SrcRoomLayout `json:"layout"`
}
type SrcRoomLayout struct {
	Node    []*SrcRoomNode `json:"node"`
	Unit    float32        `json:"unit"`
	Divisor int            `json:"divisor"`
	Indices []int          `json:"indices"`
}
type SrcRoomNode struct {
	Mesh   []int   `json:"mesh"`
	Height float32 `json:"height"`
}

type SrcMob struct {
	Mesh   []*SrcMesh `json:"mesh"`
	Mass   float32    `json:"mass"`
	Radius float32    `json:"radius"`
	Height float32    `json:"height"`
}

type SrcStage struct {
	Step   []*SrcStageStep   `json:"step"`
	Room   []*SrcStageRoom   `json:"room"`
	Mob    []*SrcStageMob    `json:"mob"`
	Camera []*SrcStageCamera `json:"camera"`
	Light  []*SrcStageLight  `json:"light"`
}
type SrcStageStep struct {
	Label string `json:"label,omitempty"`
	Event string `json:"event,omitempty"`
	Goto  string `json:"goto,omitempty"`
	Solve bool   `json:"solve,omitempty"`
	Yield bool   `json:"yield,omitempty"`
}
type SrcStageRoom struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type SrcStageMob struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type SrcStageCamera struct {
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
	Fov  float32 `json:"fov"`
	Near float32 `json:"near"`
	Far  float32 `json:"far"`
}
type SrcStageLight struct {
	HA       float32   `json:"ha"`
	VA       float32   `json:"va"`
	Color    *SrcColor `json:"color"`
	Ambient0 *SrcColor `json:"ambient0"`
	Ambient1 *SrcColor `json:"ambient1"`
}

func (p *Builder) read(baseDir string) error {
	if err := p.readGLTF(baseDir); err != nil {
		return err
	}
	if err := p.readJSON(baseDir); err != nil {
		return err
	}
	if err := p.readRoom(baseDir); err != nil {
		return err
	}
	if err := p.readMob(baseDir); err != nil {
		return err
	}
	if err := p.readStage(baseDir); err != nil {
		return err
	}
	return nil
}

func (p *Builder) build() (*App, error) {
	var app App
	app.Embed = append(app.Embed, nil)
	if err := p.importWGSL(&app); err != nil {
		return nil, err
	}
	if err := p.importGLTF(&app); err != nil {
		return nil, err
	}
	if err := p.importJSON(&app); err != nil {
		return nil, err
	}
	if err := p.importHID(&app); err != nil {
		return nil, err
	}
	if err := p.importRoom(&app); err != nil {
		return nil, err
	}
	if err := p.importMob(&app); err != nil {
		return nil, err
	}
	if err := p.importStage(&app); err != nil {
		return nil, err
	}
	return &app, nil
}
