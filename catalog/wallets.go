// Package catalog is the Kaspa wallet catalog used by this integration kit.
// Inject connect is only claimed where a documented in-page provider exists.
package catalog

import (
	_ "embed"
	"encoding/json"
	"fmt"
)

//go:embed wallets.json
var catalogJSON []byte

type Kind string

const (
	Hardware Kind = "hardware"
	Native   Kind = "native"
	Multi    Kind = "multi"
)

type Connect string

const (
	Inject  Connect = "inject"  // in-page provider (this origin)
	Open    Connect = "open"    // official web companion
	Install Connect = "install" // app / store / hardware; no dApp inject here
)

// OS ids match the folders in this repo.
const (
	Windows = "windows"
	Linux   = "linux"
	Ubuntu  = "ubuntu"
	AppleOS = "appleos"
	IOS     = "ios"
	Android = "android"
)

type Wallet struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Kind      Kind     `json:"kind"`
	Connect   Connect  `json:"connect"`
	Inject    string   `json:"inject,omitempty"`
	URL       string   `json:"url"`
	Store     string   `json:"store,omitempty"`
	Platforms []string `json:"platforms"`
	OS        []string `json:"os"`
	KNS       bool     `json:"kns,omitempty"`
	KRC20     bool     `json:"krc20,omitempty"`
	NFT       bool     `json:"nft,omitempty"`
	Note      string   `json:"note"`
	Source    string   `json:"source"`
}

type File struct {
	Inject []string `json:"inject"`
	Note   string   `json:"note"`
	OS     []string `json:"os"`
	Wallets []Wallet `json:"wallets"`
}

func Load() (File, error) {
	var f File
	if err := json.Unmarshal(catalogJSON, &f); err != nil {
		return File{}, fmt.Errorf("catalog: %w", err)
	}
	return f, nil
}

func All() []Wallet {
	f, err := Load()
	if err != nil {
		return nil
	}
	return f.Wallets
}

func Injected() []Wallet {
	var out []Wallet
	for _, w := range All() {
		if w.Connect == Inject {
			out = append(out, w)
		}
	}
	return out
}

func ByKind(k Kind) []Wallet {
	var out []Wallet
	for _, w := range All() {
		if w.Kind == k {
			out = append(out, w)
		}
	}
	return out
}

func ByOS(os string) []Wallet {
	var out []Wallet
	for _, w := range All() {
		for _, id := range w.OS {
			if id == os {
				out = append(out, w)
				break
			}
		}
	}
	return out
}
