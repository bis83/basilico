package basil3d

import (
	"bytes"
	"compress/flate"
	"encoding/base64"
)

type App struct {
	Embed []*string               `json:"embed"`
	JSON  map[string]*interface{} `json:"json"`

	Room  map[string]*AppRoom  `json:"room"`
	Mob   map[string]*AppMob   `json:"mob"`
	Stage map[string]*AppStage `json:"stage"`

	HID   AppHID   `json:"hid"`
	GPU   AppGPU   `json:"gpu"`
	Audio AppAudio `json:"audio"`
}

const (
	HasPosition int = 1 << iota
	HasNormal
	HasTangent
	HasTexcoord0
	HasBlendWeight0
	HasWeightIndices0
	HasTexture0
	HasTexture1
	HasTexture2
	HasDoubleSided
	HasAlphaBlend
)

type AppGPU struct {
	Shader  []*AppGPUShader        `json:"shader,omitempty"`
	Buffer  []*AppGPUBuffer        `json:"buffer,omitempty"`
	Texture []*AppGPUTexture       `json:"texture,omitempty"`
	Segment []*AppGPUSegment       `json:"segment,omitempty"`
	Mesh    map[string]*AppGPUMesh `json:"mesh,omitempty"`
}
type AppGPUShader struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUBuffer struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUTexture struct {
	Embed int `json:"embed,omitempty"`
}
type AppGPUSegment struct {
	Hint int `json:"hint"`

	// Input
	VertexBuffer0 []int `json:"vb0,omitempty"` // [buffer, offset, size], slot: 0, shaderLocation: 0, format: float32x3 (position)
	VertexBuffer1 []int `json:"vb1,omitempty"` // [buffer, offset, size], slot: 1, shaderLocation: 1, format: float32x3 (normal)
	VertexBuffer2 []int `json:"vb2,omitempty"` // [buffer, offset, size], slot: 2, shaderLocation: 2
	VertexBuffer3 []int `json:"vb3,omitempty"` // [buffer, offset, size], slot: 3, shaderLocation: 3
	VertexBuffer4 []int `json:"vb4,omitempty"` // [buffer, offset, size], slot: 4, shaderLocation: 4
	VertexBuffer5 []int `json:"vb5,omitempty"` // [buffer, offset, size], slot: 5, shaderLocation: 5
	IndexBuffer   []int `json:"ib,omitempty"`  // [buffer, offset, size], format: uint16

	// Uniform
	Factor0  []float64 `json:"factor0,omitempty"`  // [Color.r, Color.g, Color.b, Color.a]
	Factor1  []float64 `json:"factor1,omitempty"`  // [Occlusion, Metallic, Roughness, unused]
	Factor2  []float64 `json:"factor2,omitempty"`  // [Emissive.r, Emissive.g, Emissive.b, unused]
	Texture0 int       `json:"texture0,omitempty"` // BaseColorTexture
	Texture1 int       `json:"texture1,omitempty"` // ParameterTexture(OcclusionMetallicRoughness)
	Texture2 int       `json:"texture2,omitempty"` // NormalTexture

	Count int `json:"count"`
}
type AppGPUMesh struct {
	Segment []int `json:"segment"`
}

type AppAudio struct {
}

type AppHID struct {
	Keyboard map[string]*string `json:"keyboard"`
	Mouse    *AppHIDMouse       `json:"mouse"`
	Gamepad  *AppHIDGamepad     `json:"gamepad"`
}
type AppHIDMouse struct {
	Button    []*string `json:"button"`
	MovementX []*string `json:"movementX"`
	MovementY []*string `json:"movementY"`
}
type AppHIDGamepad struct {
	Buttons []*string   `json:"buttons"`
	Axes    [][]*string `json:"axes"`
}

type AppMesh struct {
	Data    string    `json:"data"`
	X       float32   `json:"x"`
	Y       float32   `json:"y"`
	Z       float32   `json:"z"`
	HA      float32   `json:"ha"`
	VA      float32   `json:"va"`
	Factor0 []float32 `json:"factor0"`
	Factor1 []float32 `json:"factor1"`
	Factor2 []float32 `json:"factor2"`
}

type AppRoom struct {
	Mesh   []*AppMesh       `json:"mesh"`
	Layout []*AppRoomLayout `json:"layout"`
}
type AppRoomLayout struct {
	Node    []*AppRoomNode `json:"node"`
	Unit    float32        `json:"unit"`
	Divisor int            `json:"divisor"`
	Indices []int          `json:"indices"`
}
type AppRoomNode struct {
	Mesh   []int   `json:"mesh"`
	Height float32 `json:"height"`
}

type AppMob struct {
	Mesh   []*AppMesh `json:"mesh"`
	Mass   float32    `json:"mass"`
	Radius float32    `json:"radius"`
	Height float32    `json:"height"`
}

type AppStage struct {
	Step   []*AppStageStep   `json:"step"`
	Entity []*AppStageEntity `json:"entity"`
}
type AppStageStep struct {
	Label string `json:"label,omitempty"`
	Event string `json:"event,omitempty"`
	Goto  string `json:"goto,omitempty"`
	Solve bool   `json:"solve,omitempty"`
	Yield bool   `json:"yield,omitempty"`
}
type AppStageEntity struct {
	Room   *AppStageRoom   `json:"room,omitempty"`
	Mob    *AppStageMob    `json:"mob,omitempty"`
	Camera *AppStageCamera `json:"camera,omitempty"`
	Light  *AppStageLight  `json:"light,omitempty"`
}
type AppStageRoom struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type AppStageMob struct {
	Data string  `json:"data"`
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
}
type AppStageCamera struct {
	X    float32 `json:"x"`
	Y    float32 `json:"y"`
	Z    float32 `json:"z"`
	HA   float32 `json:"ha"`
	VA   float32 `json:"va"`
	Fov  float32 `json:"fov"`
	Near float32 `json:"near"`
	Far  float32 `json:"far"`
}
type AppStageLight struct {
	HA       float32   `json:"ha"`
	VA       float32   `json:"va"`
	Color    []float32 `json:"color"`
	Ambient0 []float32 `json:"ambient0"`
	Ambient1 []float32 `json:"ambient1"`
}

func (p *App) addEmbed(buf string) int {
	for i, v := range p.Embed {
		if v != nil && *v == buf {
			return i
		}
	}
	i := len(p.Embed)
	p.Embed = append(p.Embed, &buf)
	return i
}

func (p *App) addEmbedBase64(buf []byte, compress bool) (int, error) {
	if compress {
		var b bytes.Buffer
		w, err := flate.NewWriter(&b, flate.BestCompression)
		if err != nil {
			return -1, err
		}
		if _, err := w.Write(buf); err != nil {
			w.Close()
			return -1, err
		}
		w.Close()

		return p.addEmbed(base64.StdEncoding.EncodeToString(b.Bytes())), nil
	} else {
		return p.addEmbed(base64.StdEncoding.EncodeToString(buf)), nil
	}
}

func (p *App) build(src *Source) error {
	p.Embed = append(p.Embed, nil)
	if err := p.buildWGSL(); err != nil {
		return err
	}
	if err := p.buildGLTF(src); err != nil {
		return err
	}
	if err := p.buildJSON(src); err != nil {
		return err
	}
	if err := p.buildHID(); err != nil {
		return err
	}
	if err := p.buildRoom(src); err != nil {
		return err
	}
	if err := p.buildMob(src); err != nil {
		return err
	}
	if err := p.buildStage(src); err != nil {
		return err
	}
	return nil
}

func (p *App) buildJSON(src *Source) error {
	p.JSON = src.JSON
	return nil
}
