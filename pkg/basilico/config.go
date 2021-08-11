package basilico

type Config struct {
	Title        string
	Addr         string
	Logging      bool
	Assert       bool
	UnitTesting  bool
	Minify       bool
	Editor       bool
	DebugMonitor bool
	StartLevel   string
}
