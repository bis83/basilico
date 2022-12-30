package basil

type Middleware interface {
	PreBuild(bsl *Basil) error
}
