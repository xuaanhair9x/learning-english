package handlers

import "strings"

// NormalizeAnswer lowercases, strips punctuation, and trims spaces for answer comparison.
func NormalizeAnswer(s string) string {
	s = strings.ToLower(s)
	s = strings.NewReplacer(
		".", "", ",", "", "!", "", "?", "", "'", "",
	).Replace(s)
	return strings.TrimSpace(s)
}
