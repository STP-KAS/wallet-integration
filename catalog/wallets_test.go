package catalog

import "testing"

func TestCatalogCoversRequested(t *testing.T) {
	need := []string{
		"tangem", "ledger", "onekey", "ellipal", "safepal-x1",
		"kaspium", "kasware", "kastle", "web-wallet", "kdx", "kaskeeper", "kurncy",
		"zelcore", "okx", "now", "guarda", "bitget", "mathwallet", "safepal-app",
		"kaspa-ng",
	}
	file, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	have := map[string]bool{}
	for _, w := range file.Wallets {
		if w.URL == "" || w.Name == "" {
			t.Fatalf("incomplete %+v", w)
		}
		if len(w.OS) == 0 {
			t.Fatalf("no os tags for %s", w.ID)
		}
		have[w.ID] = true
	}
	for _, id := range need {
		if !have[id] {
			t.Fatalf("missing %s", id)
		}
	}
	if len(Injected()) != 2 {
		t.Fatalf("inject count %d want kasware+kastle", len(Injected()))
	}
	if file.Inject[0] != "kasware" || file.Inject[1] != "kastle" {
		t.Fatalf("inject ids %v", file.Inject)
	}
}

func TestOSFoldersCovered(t *testing.T) {
	need := []string{Windows, Linux, Ubuntu, AppleOS, IOS, Android}
	for _, os := range need {
		list := ByOS(os)
		if len(list) == 0 {
			t.Fatalf("no wallets tagged %s", os)
		}
	}
	kasware := false
	for _, w := range ByOS(IOS) {
		if w.ID == "kasware" {
			kasware = true
		}
	}
	if kasware {
		t.Fatal("Kasware is not on iOS")
	}
	foundKastle := false
	foundKaspium := false
	for _, w := range ByOS(IOS) {
		if w.ID == "kastle" {
			foundKastle = true
		}
		if w.ID == "kaspium" {
			foundKaspium = true
		}
	}
	if !foundKastle || !foundKaspium {
		t.Fatal("iOS should list Kastle and Kaspium")
	}
}

func TestKaswareOnAndroidAndDesktop(t *testing.T) {
	for _, os := range []string{Windows, Linux, Ubuntu, AppleOS, Android} {
		ok := false
		for _, w := range ByOS(os) {
			if w.ID == "kasware" {
				ok = true
			}
		}
		if !ok {
			t.Fatalf("Kasware missing on %s", os)
		}
	}
}
