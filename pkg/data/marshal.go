package data

import (
	"encoding/json"
)

func marshalJSON(v interface{}, minify bool) ([]byte, error) {
	if minify {
		data, err := json.Marshal(v)
		if err != nil {
			return nil, err
		}
		return data, nil
	} else {
		data, err := json.MarshalIndent(v, "", "    ")
		if err != nil {
			return nil, err
		}
		return data, nil
	}
}
