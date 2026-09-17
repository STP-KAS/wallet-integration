package catalog

import "testing"

func TestWithdrawn(t *testing.T) {
	if Withdrawn() == "" {
		t.Fatal("expected withdrawn marker")
	}
}
