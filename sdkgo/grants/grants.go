package grants

import (
	"fmt"
	"strings"

	"github.com/infinity6-ai/gox/commonz/bitmapz"
)

// Grant represents a compact permission bitmask over datasets and solutions.
type Grant uint8

const (
	// System grants internal platform orchestration permissions.
	System Grant = 1 << 0 // 1 (0x01)

	// Admin grants permission to manage grants, solutions, and credentials.
	Admin Grant = 1 << 1 // 2 (0x02)

	// Write grants permission to ingest, mutate, and update data and pipelines.
	Write Grant = 1 << 2 // 4 (0x04)

	// Read grants permission to query, inspect, and export data.
	Read Grant = 1 << 3 // 8 (0x08)

	// Backward-compatible explicit aliases:
	GrantSystem = System
	GrantAdmin  = Admin
	GrantWrite  = Write
	GrantRead   = Read
)

// Info describes a grant for catalogs, UI checkboxes, and documentation.
type Info struct {
	Id          Grant  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Catalog lists all registered grants, their bitmask IDs, and human descriptions.
var Catalog = []Info{
	{Id: System, Name: "system", Description: "Internal platform orchestration permissions."},
	{Id: Admin, Name: "admin", Description: "Manage dataset grants, solutions, and credentials."},
	{Id: Write, Name: "write", Description: "Ingest, mutate, and update data and pipelines."},
	{Id: Read, Name: "read", Description: "Query, inspect, and export data."},
}

// All returns a bitmask containing all registered grants combined.
func All() Grant {
	return System | Admin | Write | Read
}

// AllGrants is an alias for All.
func AllGrants() Grant {
	return All()
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
			res |= System
		case "admin", "adm":
			res |= Admin
		case "write", "wr":
			res |= Write
		case "read", "rd":
			res |= Read
		default:
			return 0, fmt.Errorf("invalid grant name: %q", part)
		}
	}
	return res, nil
}

// Format returns a human-readable pipe-delimited string (e.g. "admin|write|read").
func (g Grant) Format() string {
	var parts []string
	if g&System != 0 {
		parts = append(parts, "system")
	}
	if g&Admin != 0 {
		parts = append(parts, "admin")
	}
	if g&Write != 0 {
		parts = append(parts, "write")
	}
	if g&Read != 0 {
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
