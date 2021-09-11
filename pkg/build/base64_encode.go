package build

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
)

func encodeFloat32Array(data []float32) (string, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return "", err
	}
	str := base64.StdEncoding.EncodeToString(b.Bytes())
	return str, nil
}

func encodeUint8Array(data []uint8) (string, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return "", err
	}
	str := base64.StdEncoding.EncodeToString(b.Bytes())
	return str, nil
}

func encodeUint16Array(data []uint16) (string, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return "", err
	}
	str := base64.StdEncoding.EncodeToString(b.Bytes())
	return str, nil
}
