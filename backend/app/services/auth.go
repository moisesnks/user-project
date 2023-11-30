package services

import (
	"backend/app/models"
	"context"
	"errors"
	"log"
	"time"

	"firebase.google.com/go/auth"
	"gorm.io/gorm"
)

// AuthService provides authentication and authorization-related services.
type AuthService struct {
	FirebaseAuthClient *auth.Client
	DB                 *gorm.DB
}

// NewAuthService creates a new instance of AuthService.
func NewAuthService(firebaseAuthClient *auth.Client, db *gorm.DB) *AuthService {
	return &AuthService{
		FirebaseAuthClient: firebaseAuthClient,
		DB:                 db,
	}
}

func (s *AuthService) RegisterUser(uid, email string) error {
	log.Println("Start RegisterUser")

	// Check if the user is already registered in the database
	var existingUser models.User
	if err := s.DB.First(&existingUser, "id = ?", uid).Error; err == nil {
		log.Printf("User with UID %s is already registered\n", uid)
		return errors.New("User is already registered")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error checking for existing user: %v\n", err)
		return err
	}
	log.Println("User is not registered, proceeding with insertion")

	// Insert the user into the database
	newUser := models.User{
		ID:    uid,
		Email: email,
	}
	if err := s.DB.Create(&newUser).Error; err != nil {
		log.Printf("Error inserting user: %v\n", err)
		return err
	}

	log.Println("User registered successfully")
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
	}

	return userData, nil
}

func (s *AuthService) ExtractUserDetailsFromToken(token string) (string, string, error) {
	// Realiza la verificación del token JWT
	strToken, err := s.FirebaseAuthClient.VerifyIDToken(context.Background(), token)
	if err != nil {
		return "", "", err
	}

	// Extraer el user_id del token JWT
	userID, ok := strToken.Claims["user_id"].(string)
	if !ok || userID == "" {
		return "", "", errors.New("user_id no encontrado en el token JWT")
	}

	// Extraer el email del token JWT
	email, ok := strToken.Claims["email"].(string)
	if !ok || email == "" {
		return "", "", errors.New("email no encontrado en el token JWT")
	}

	return userID, email, nil
}
