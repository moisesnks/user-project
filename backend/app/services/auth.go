package services

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"firebase.google.com/go/auth"
)

// User representa la estructura de datos del usuario.
type User struct {
	ID              string
	Nombre          string
	Apellido        string
	SegundoApellido string
	Email           string
	Rut             string
	Fono            string
	ImgProfile      string
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
	err := s.DB.QueryRow("SELECT id FROM usuario WHERE id = $1", uid).Scan(&existingUID)
	if err == nil {
		// El usuario ya existe en la base de datos
		return errors.New("El usuario ya está registrado")
	} else if err != sql.ErrNoRows {
		// Ocurrió un error al consultar la base de datos
		return err
	}

	// Insertar el usuario en la base de datos
	_, err = s.DB.Exec("INSERT INTO usuario (id, correo) VALUES ($1, $2)", uid, email)
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

// GetUserInfoByID obtiene la información del usuario por su ID y la filtra para mostrar solo los campos deseados.
func (s *AuthService) GetUserInfoByID(userID string) (map[string]interface{}, error) {
	user, err := s.FirebaseAuthClient.GetUser(context.Background(), userID)
	if err != nil {
		return nil, err
	}

	// Crear un objeto JSON con la información filtrada
	userData := map[string]interface{}{
		"email":         user.Email,
		"EmailVerified": user.EmailVerified,
		"UserMetadata": map[string]interface{}{
			"CreationTimestamp":  time.Unix(user.UserMetadata.CreationTimestamp/1000, 0).Format("02 de enero de 2006"),
			"LastLogInTimestamp": time.Unix(user.UserMetadata.LastLogInTimestamp/1000, 0).Format("02 de enero de 2006"),
		},
		"TenantID": user.TenantID,
	}

	return userData, nil
}

func (s *AuthService) ExtractUserIDFromToken(token string) (string, error) {
	// Realiza la verificación del token JWT
	strToken, err := s.FirebaseAuthClient.VerifyIDToken(context.Background(), token)
	if err != nil {
		return "", err
	}

	// Extraer el user_id del token JWT
	user_id, ok := strToken.Claims["user_id"].(string)
	if !ok || user_id == "" {
		return "", errors.New("user_id no encontrado en el token JWT")
	}

	return user_id, nil
}
