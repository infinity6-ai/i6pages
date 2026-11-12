package token

import (
	"fmt"
	"strings"

	"github.com/infinity6-ai/gox/commonz/bitmapz"
)

// Grant represents a compact permission bitmask over datasets and solutions.
type Grant uint8

const (
	// GrantSystem grants internal platform orchestration permissions.
	GrantSystem Grant = 1 << 0 // 1 (0x01)

	// GrantAdmin grants permission to manage grants, solutions, and credentials.
	GrantAdmin Grant = 1 << 1 // 2 (0x02)

	// GrantWrite grants permission to ingest, mutate, and update data and pipelines.
	GrantWrite Grant = 1 << 2 // 4 (0x04)

	// GrantRead grants permission to query, inspect, and export data.
	GrantRead Grant = 1 << 3 // 8 (0x08)
)

// GrantInfo describes a grant for catalogs, UI checkboxes, and documentation.
type GrantInfo struct {
	Id          Grant  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Catalog lists all registered grants, their bitmask IDs, and human descriptions.
var Catalog = []GrantInfo{
	{Id: GrantSystem, Name: "system", Description: "Internal platform orchestration permissions."},
	{Id: GrantAdmin, Name: "admin", Description: "Manage dataset grants, solutions, and credentials."},
	{Id: GrantWrite, Name: "write", Description: "Ingest, mutate, and update data and pipelines."},
	{Id: GrantRead, Name: "read", Description: "Query, inspect, and export data."},
}

// AllGrants returns a bitmask containing all registered grants combined.
func AllGrants() Grant {
	return GrantSystem | GrantAdmin | GrantWrite | GrantRead
}

// Parse parses a string representation into a Grant (e.g. "read", "write,admin", or "12").
func Parse(s string) (Grant, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return 0, fmt.Errorf("grant value cannot be empty")
	}

	var val uint64
	if _, err := fmt.Sscan(s, &val); err == nil {
		return Grant(val), nil
	}

	parts := strings.Split(s, ",")
	var res Grant
	for _, part := range parts {
		switch strings.TrimSpace(strings.ToLower(part)) {
		case "system", "sys":
			res |= GrantSystem
		case "admin", "adm":
			res |= GrantAdmin
		case "write", "wr":
			res |= GrantWrite
		case "read", "rd":
			res |= GrantRead
		default:
			return 0, fmt.Errorf("invalid grant name: %q", part)
		}
	}
	return res, nil
}

// Format returns a human-readable pipe-delimited string (e.g. "admin|write|read").
func (g Grant) Format() string {
	var parts []string
	if g&GrantSystem != 0 {
		parts = append(parts, "system")
	}
	if g&GrantAdmin != 0 {
		parts = append(parts, "admin")
	}
	if g&GrantWrite != 0 {
		parts = append(parts, "write")
	}
	if g&GrantRead != 0 {
		parts = append(parts, "read")
	}
	if len(parts) == 0 {
		return "none"
	}
	return strings.Join(parts, "|")
}

// String implements fmt.Stringer via Format.
func (g Grant) String() string {
	return g.Format()
}

// Has reports whether the grant contains all required grants.
func (g Grant) Has(required ...Grant) bool {
	return bitmapz.ContainsAll(g, required...)
}

// Any reports whether the grant contains at least one of the expected grants.
func (g Grant) Any(expected ...Grant) bool {
	return bitmapz.ContainsAny(g, expected...)
}

// Join combines multiple grants into a single bitmask.
func Join(grants ...Grant) Grant {
	return bitmapz.Join(grants...)
}

// HasGrant reports whether current contains all expected grants (package-level helper).
func HasGrant(current Grant, expected ...Grant) bool {
	return bitmapz.ContainsAll(current, expected...)
}

// AnyGrant reports whether current contains at least one of the expected grants (package-level helper).
func AnyGrant(current Grant, expected ...Grant) bool {
	return bitmapz.ContainsAny(current, expected...)
}

// JoinGrants combines multiple grants into a single bitmask (package-level helper).
func JoinGrants(grants ...Grant) Grant {
	return bitmapz.Join(grants...)
}
