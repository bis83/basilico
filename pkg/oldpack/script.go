package pack

import (
	"io"
)

func writePageScript(wr io.Writer) error {
	for _, path := range scripts {
		js, err := fs.ReadFile(path)
		if err != nil {
			return err
		}
		wr.Write(js)
	}
	return nil
}
