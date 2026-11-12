package token

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestUnitGrantConstantsAndCatalog(t *testing.T) {
	require.Equal(t, Grant(1), GrantSystem)
	require.Equal(t, Grant(2), GrantAdmin)
	require.Equal(t, Grant(4), GrantWrite)
	require.Equal(t, Grant(8), GrantRead)

	require.Len(t, Catalog, 4)
	require.Equal(t, "system", Catalog[0].Name)
	require.Equal(t, GrantSystem, Catalog[0].Id)
	require.Equal(t, "admin", Catalog[1].Name)
	require.Equal(t, GrantAdmin, Catalog[1].Id)
	require.Equal(t, "write", Catalog[2].Name)
	require.Equal(t, GrantWrite, Catalog[2].Id)
	require.Equal(t, "read", Catalog[3].Name)
	require.Equal(t, GrantRead, Catalog[3].Id)

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
			want:  GrantRead,
		})
	})

	t.Run("Multiple comma-separated names parse", func(t *testing.T) {
		check(t, testScenario{
			input: "read,write,admin",
			want:  GrantRead | GrantWrite | GrantAdmin,
		})
	})

	t.Run("Short aliases parse", func(t *testing.T) {
		check(t, testScenario{
			input: "rd,wr,adm,sys",
			want:  GrantRead | GrantWrite | GrantAdmin | GrantSystem,
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
			grant: GrantRead,
			want:  "read",
		})
	})

	t.Run("Combined grants format with pipe separator", func(t *testing.T) {
		check(t, testScenario{
			grant: GrantAdmin | GrantWrite | GrantRead,
			want:  "admin|write|read",
		})
	})

	t.Run("All grants format correctly", func(t *testing.T) {
		check(t, testScenario{
			grant: AllGrants(),
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
			current:  GrantRead | GrantWrite,
			required: []Grant{GrantRead},
			hasWant:  true,
			anyWant:  true,
		})
	})

	t.Run("Has multiple grants simultaneously", func(t *testing.T) {
		check(t, testScenario{
			current:  GrantAdmin | GrantWrite | GrantRead,
			required: []Grant{GrantWrite, GrantRead},
			hasWant:  true,
			anyWant:  true,
		})
	})

	t.Run("Missing one of required grants", func(t *testing.T) {
		check(t, testScenario{
			current:  GrantRead,
			required: []Grant{GrantRead, GrantWrite},
			hasWant:  false,
			anyWant:  true,
		})
	})

	t.Run("Missing all required grants", func(t *testing.T) {
		check(t, testScenario{
			current:  GrantRead,
			required: []Grant{GrantAdmin, GrantWrite},
			hasWant:  false,
			anyWant:  false,
		})
	})

	t.Run("Join grants helper combines properly", func(t *testing.T) {
		joined := Join(GrantRead, GrantWrite, GrantAdmin)
		require.Equal(t, GrantRead|GrantWrite|GrantAdmin, joined)
		require.Equal(t, joined, JoinGrants(GrantRead, GrantWrite, GrantAdmin))
	})
}
