package build

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"

	float16 "github.com/x448/float16"
)

func encodeFloat32Array(data []float32) (string, error) {
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data); err != nil {
		return "", err
	}
	str := base64.StdEncoding.EncodeToString(b.Bytes())
	return str, nil
}

func encodeFloat16Array(data []float32) (string, error) {
	var data2 []uint16
	for _, v := range data {
		data2 = append(data2, float16.Fromfloat32(v).Bits())
	}
	var b bytes.Buffer
	if err := binary.Write(&b, binary.LittleEndian, data2); err != nil {
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
