package speclabeltokentype

import "strings"

const Key = "token_types"

const (
	User    = "user"
	Dataset = "dataset"
	None    = "none"
)

const Separator = "|"

const (
	DatasetUser = Dataset + Separator + User
	UserDataset = User + Separator + Dataset
)

func Join(kinds ...string) string {
	return strings.Join(kinds, Separator)
}

func Split(kind string) []string {
	return strings.Split(kind, Separator)
}
