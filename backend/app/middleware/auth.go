package middleware

import (
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Implementa la lógica de autenticación aquí
		next.ServeHTTP(w, r)
	})
}
