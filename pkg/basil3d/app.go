package basil3d

import (
	"bytes"
	"compress/flate"
	"encoding/base64"
)

type App struct {
	Embed []*string               `json:"embed"`
	JSON  map[string]*interface{} `json:"json"`

	Room map[string]*AppRoom `json:"room"`
	Mob  map[string]*AppMob  `json:"mob"`
	Func map[string]*AppFunc `json:"func"`

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
	Shader  []*AppGPUShader  `json:"shader,omitempty"`
	Buffer  []*AppGPUBuffer  `json:"buffer,omitempty"`
	Texture []*AppGPUTexture `json:"texture,omitempty"`
	Mesh    []*AppGPUMesh    `json:"mesh,omitempty"`
	ID      []*AppGPUID      `json:"id,omitempty"`
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
type AppGPUMesh struct {
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
type AppGPUID struct {
	Name string `json:"name"`
	Mesh []int  `json:"mesh"`
}

type AppAudio struct {
}

type AppHID struct {
	Timer    string             `json:"timer"`
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

type AppRoom struct {
	Mesh    []*AppMesh     `json:"mesh"`
	Node    []*AppRoomNode `json:"node"`
	Unit    float32        `json:"unit"`
	Divisor int            `json:"divisor"`
	Indices []int          `json:"indices"`
}
type AppRoomNode struct {
	Mesh  []int     `json:"mesh"`
	Space *AppSpace `json:"space,omitempty"`
}

type AppMob struct {
	Mesh  []*AppMesh `json:"mesh"`
	Space *AppSpace  `json:"space,omitempty"`
}

type AppMesh struct {
	Name    string     `json:"name"`
	Offset  *AppOffset `json:"offset"`
	Factor0 *AppColor  `json:"factor0,omitempty"`
	Factor1 *AppColor  `json:"factor1,omitempty"`
	Factor2 *AppColor  `json:"factor2,omitempty"`
}

type AppFunc struct {
	Branch []*AppFuncBranch `json:"branch"`
}
type AppFuncBranch struct {
	Next   int      `json:"next"`
	Action []string `json:"action"`
}

type AppOffset struct {
	X  float32 `json:"x"`
	Y  float32 `json:"y"`
	Z  float32 `json:"z"`
	HA float32 `json:"ha"`
	VA float32 `json:"va"`
}
type AppColor struct {
	R float32 `json:"r"`
	G float32 `json:"g"`
	B float32 `json:"b"`
	A float32 `json:"a"`
}
type AppSpace struct {
	Min    *float32 `json:"min,omitempty"`
	Max    *float32 `json:"max,omitempty"`
	Radius *float32 `json:"radius,omitempty"`
}

func (p *App) AddEmbed(buf string) int {
	for i, v := range p.Embed {
		if v != nil && *v == buf {
			return i
		}
	}
	i := len(p.Embed)
	p.Embed = append(p.Embed, &buf)
	return i
}

func (p *App) AddEmbedBase64(buf []byte, compress bool) (int, error) {
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

		return p.AddEmbed(base64.StdEncoding.EncodeToString(b.Bytes())), nil
	} else {
		return p.AddEmbed(base64.StdEncoding.EncodeToString(buf)), nil
	}
}
