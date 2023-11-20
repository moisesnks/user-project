package services

import (
	"context"
	"database/sql"
	"errors"

	"firebase.google.com/go/auth"
	_ "github.com/lib/pq"
)

// User representa la estructura de datos del usuario.
type User struct {
	UID   string
	Email string
}

// AuthService proporciona servicios relacionados con la autenticación y autorización.
type AuthService struct {
	FirebaseAuthClient *auth.Client
	DB                 *sql.DB
}

// NewAuthService crea una nueva instancia de AuthService.
func NewAuthService(firebaseAuthClient *auth.Client, db *sql.DB) *AuthService {
	return &AuthService{
		FirebaseAuthClient: firebaseAuthClient,
		DB:                 db,
	}
}

// RegisterUser registra un usuario en la base de datos con UID y correo.
func (s *AuthService) RegisterUser(uid, email string) error {
	// Verificar si el usuario ya está registrado en la base de datos
	var existingUID string
	err := s.DB.QueryRow("SELECT uid FROM users WHERE uid = $1", uid).Scan(&existingUID)
	if err == nil {
		// El usuario ya existe en la base de datos
		return errors.New("El usuario ya está registrado")
	} else if err != sql.ErrNoRows {
		// Ocurrió un error al consultar la base de datos
		return err
	}

	// Insertar el usuario en la base de datos
	_, err = s.DB.Exec("INSERT INTO users (uid, email) VALUES ($1, $2)", uid, email)
	if err != nil {
		// Ocurrió un error al insertar el usuario en la base de datos
		return err
	}

	return nil
}

// ValidateJWT valida un token JWT utilizando la SDK de Firebase Admin y devuelve true si es válido, de lo contrario, false.
func (s *AuthService) ValidateJWT(jwtToken string) (bool, error) {
	// Verificar y decodificar el token JWT utilizando la SDK de Firebase Admin
	token, err := s.FirebaseAuthClient.VerifyIDToken(context.Background(), jwtToken)
	if err != nil {
		return false, err
	}

	_ = token

	// Verificación exitosa, el token es válido
	return true, nil
}
