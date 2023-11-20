// config/firebase.go
package config

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

var FirebaseApp *firebase.App
var FirebaseAuthClient *auth.Client

func InitFirebase() error {
	ctx := context.Background()
	opt := option.WithCredentialsFile("credentials.json")

	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return err
	}

	FirebaseApp = app
	FirebaseAuthClient, err = app.Auth(ctx)
	if err != nil {
		return err
	}

	return nil
}

// GetFirebaseClient retorna el cliente de Firebase Authentication
func GetFirebaseClient() (*auth.Client, error) {
	if FirebaseAuthClient == nil {
		return nil, fmt.Errorf("Firebase client not initialized")
	}
	return FirebaseAuthClient, nil
}
