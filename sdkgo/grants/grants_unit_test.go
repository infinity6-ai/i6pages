package grants

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestUnitGrantConstantsAndCatalog(t *testing.T) {
	require.Equal(t, Grant(1), System)
	require.Equal(t, Grant(2), Admin)
	require.Equal(t, Grant(4), Write)
	require.Equal(t, Grant(8), Read)

	require.Equal(t, System, GrantSystem)
	require.Equal(t, Admin, GrantAdmin)
	require.Equal(t, Write, GrantWrite)
	require.Equal(t, Read, GrantRead)

	require.Len(t, Catalog, 4)
	require.Equal(t, "system", Catalog[0].Name)
	require.Equal(t, System, Catalog[0].Id)
	require.Equal(t, "admin", Catalog[1].Name)
	require.Equal(t, Admin, Catalog[1].Id)
	require.Equal(t, "write", Catalog[2].Name)
	require.Equal(t, Write, Catalog[2].Id)
	require.Equal(t, "read", Catalog[3].Name)
	require.Equal(t, Read, Catalog[3].Id)

	require.Equal(t, Grant(15), All())
	require.Equal(t, Grant(15), AllGrants())
}

func TestUnitGrantParse(t *testing.T) {
	type testScenario struct {
		input  string
		want   Grant
		errMsg string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		got, err := Parse(s.input)
		if s.errMsg != "" {
			require.Error(t, err)
			require.Contains(t, err.Error(), s.errMsg)
			return
		}
		require.NoError(t, err)
		require.Equal(t, s.want, got)
	}

	t.Run("Single name parse", func(t *testing.T) {
		check(t, testScenario{
			input: "read",
			want:  Read,
		})
	})

	t.Run("Multiple comma-separated names parse", func(t *testing.T) {
		check(t, testScenario{
			input: "read,write,admin",
			want:  Read | Write | Admin,
		})
	})

	t.Run("Short aliases parse", func(t *testing.T) {
		check(t, testScenario{
			input: "rd,wr,adm,sys",
			want:  Read | Write | Admin | System,
		})
	})

	t.Run("Numeric string parse", func(t *testing.T) {
		check(t, testScenario{
			input: "14",
			want:  Grant(14),
		})
	})

	t.Run("Empty string returns error", func(t *testing.T) {
		check(t, testScenario{
			input:  "   ",
			errMsg: "grant value cannot be empty",
		})
	})

	t.Run("Invalid grant name returns error", func(t *testing.T) {
		check(t, testScenario{
			input:  "read,superadmin",
			errMsg: "invalid grant name",
		})
	})
}

func TestUnitGrantFormat(t *testing.T) {
	type testScenario struct {
		grant Grant
		want  string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		require.Equal(t, s.want, s.grant.Format())
		require.Equal(t, s.want, s.grant.String())
	}

	t.Run("Zero grant formats as none", func(t *testing.T) {
		check(t, testScenario{
			grant: 0,
			want:  "none",
		})
	})

	t.Run("Single grant formats correctly", func(t *testing.T) {
		check(t, testScenario{
			grant: Read,
			want:  "read",
		})
	})

	t.Run("Combined grants format with pipe separator", func(t *testing.T) {
		check(t, testScenario{
			grant: Admin | Write | Read,
			want:  "admin|write|read",
		})
	})

	t.Run("All grants format correctly", func(t *testing.T) {
		check(t, testScenario{
			grant: All(),
			want:  "system|admin|write|read",
		})
	})
}

func TestUnitGrantBitmaskOperations(t *testing.T) {
	type testScenario struct {
		current  Grant
		required []Grant
		hasWant  bool
		anyWant  bool
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		require.Equal(t, s.hasWant, s.current.Has(s.required...))
		require.Equal(t, s.hasWant, HasGrant(s.current, s.required...))
		require.Equal(t, s.anyWant, s.current.Any(s.required...))
		require.Equal(t, s.anyWant, AnyGrant(s.current, s.required...))
	}

	t.Run("Has exact grant", func(t *testing.T) {
		check(t, testScenario{
			current:  Read | Write,
			required: []Grant{Read},
			hasWant:  true,
			anyWant:  true,
		})
	})

	t.Run("Has multiple grants simultaneously", func(t *testing.T) {
		check(t, testScenario{
			current:  Admin | Write | Read,
			required: []Grant{Write, Read},
			hasWant:  true,
			anyWant:  true,
		})
	})

	t.Run("Missing one of required grants", func(t *testing.T) {
		check(t, testScenario{
			current:  Read,
			required: []Grant{Read, Write},
			hasWant:  false,
			anyWant:  true,
		})
	})

	t.Run("Missing all required grants", func(t *testing.T) {
		check(t, testScenario{
			current:  Read,
			required: []Grant{Admin, Write},
			hasWant:  false,
			anyWant:  false,
		})
	})

	t.Run("Join grants helper combines properly", func(t *testing.T) {
		joined := Join(Read, Write, Admin)
		require.Equal(t, Read|Write|Admin, joined)
		require.Equal(t, joined, JoinGrants(Read, Write, Admin))
	})
}
