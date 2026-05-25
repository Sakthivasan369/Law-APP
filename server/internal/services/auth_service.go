package services

import (
	"context"
	"crypto/rand"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/sakthivasan369/law-app/server/internal/dto"
	"github.com/sakthivasan369/law-app/server/internal/models"
	"github.com/sakthivasan369/law-app/server/internal/repositories"
	"gorm.io/gorm"
)

type AuthService interface {
	RequestOTP(email string) error
	VerifyOTP(email, code string) (string, error)
	Onboard(userID uuid.UUID, req *dto.OnboardRequest) (*models.User, error)
	GetMe(userID uuid.UUID) (*models.User, error)
}

type authService struct {
	repo repositories.UserRepository
}

func NewAuthService(repo repositories.UserRepository) AuthService {
	return &authService{repo: repo}
}

func generateOTP() string {
	b := make([]byte, 3)
	_, _ = rand.Read(b)
	return fmt.Sprintf("%06d", int(b[0])<<16|int(b[1])<<8|int(b[2]))[:6]
}

// generateReferralCode creates a random 6-character alphanumeric code.
func generateReferralCode() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 6)
	_, _ = rand.Read(b)
	for i := range b {
		b[i] = charset[int(b[i])%len(charset)]
	}
	return string(b)
}

// sendOTPEmailWithTimeout sends an OTP email with a context-based timeout
// to prevent indefinite blocking when SMTP is unreachable.
func sendOTPEmailWithTimeout(ctx context.Context, to string, otp string) error {
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")

	log.Println("SMTP CONFIG:")
	log.Println("HOST:", host)
	log.Println("PORT:", port)
	log.Println("FROM:", from)

	subject := "Subject: Your Sattam Ungal Kaiyil OTP\r\n"
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"

	body := fmt.Sprintf(
		"<html><body><h3>Verification Code</h3><p>Your 6-digit verification code is: <b>%s</b></p></body></html>",
		otp,
	)

	msg := []byte(subject + mime + body)
	addr := fmt.Sprintf("%s:%s", host, port)

	// Use a channel to capture the result of the blocking smtp call
	type result struct {
		err error
	}
	ch := make(chan result, 1)

	go func() {
		log.Println("BEFORE SENDMAIL")

		// Use net.Dialer with timeout for the initial TCP connection
		dialer := &net.Dialer{Timeout: 15 * time.Second}
		conn, err := dialer.DialContext(ctx, "tcp", addr)
		if err != nil {
			log.Printf("SMTP DIAL FAILED: %v", err)
			ch <- result{err: fmt.Errorf("smtp dial failed: %w", err)}
			return
		}

		// Create SMTP client from the connection
		client, err := smtp.NewClient(conn, host)
		if err != nil {
			conn.Close()
			log.Printf("SMTP CLIENT CREATION FAILED: %v", err)
			ch <- result{err: fmt.Errorf("smtp client creation failed: %w", err)}
			return
		}
		defer client.Close()

		// STARTTLS — required for Gmail on port 587
		tlsConfig := &tls.Config{ServerName: host}
		if err := client.StartTLS(tlsConfig); err != nil {
			log.Printf("STARTTLS FAILED: %v", err)
			ch <- result{err: fmt.Errorf("starttls failed: %w", err)}
			return
		}

		// Authenticate
		auth := smtp.PlainAuth("", from, password, host)
		if err := client.Auth(auth); err != nil {
			log.Printf("SMTP AUTH FAILED: %v", err)
			ch <- result{err: fmt.Errorf("smtp auth failed: %w", err)}
			return
		}

		// Set sender and recipient
		if err := client.Mail(from); err != nil {
			ch <- result{err: fmt.Errorf("smtp mail from failed: %w", err)}
			return
		}
		if err := client.Rcpt(to); err != nil {
			ch <- result{err: fmt.Errorf("smtp rcpt to failed: %w", err)}
			return
		}

		// Send body
		w, err := client.Data()
		if err != nil {
			ch <- result{err: fmt.Errorf("smtp data failed: %w", err)}
			return
		}
		if _, err := w.Write(msg); err != nil {
			ch <- result{err: fmt.Errorf("smtp write failed: %w", err)}
			return
		}
		if err := w.Close(); err != nil {
			ch <- result{err: fmt.Errorf("smtp close writer failed: %w", err)}
			return
		}

		client.Quit()
		log.Println("AFTER SENDMAIL - SUCCESS")
		ch <- result{err: nil}
	}()

	// Wait for either completion or context cancellation
	select {
	case <-ctx.Done():
		log.Printf("SMTP TIMEOUT: email to %s cancelled: %v", to, ctx.Err())
		return fmt.Errorf("smtp timeout: %w", ctx.Err())
	case r := <-ch:
		return r.err
	}
}

func (s *authService) RequestOTP(email string) error {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			user = &models.User{
				Email:        email,
				Interests:    "[]",
				ReferralCode: generateReferralCode(),
			}
			if err := s.repo.Create(user); err != nil {
				return err
			}
		} else {
			return err
		}
	}

	otp := generateOTP()
	user.OTPCode = otp
	user.OTPExpiresAt = time.Now().Add(5 * time.Minute)

	if err := s.repo.Update(user); err != nil {
		return err
	}

	// Send email asynchronously — OTP is already saved to DB,
	// so the user gets a fast response and the email arrives in the background.
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		if err := sendOTPEmailWithTimeout(ctx, email, otp); err != nil {
			log.Printf("❌ Background email send failed for %s: %v", email, err)
		} else {
			log.Printf("✅ OTP email sent successfully to %s", email)
		}
	}()

	return nil
}

func (s *authService) VerifyOTP(email, code string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid_email")
	}

	if user.OTPCode != code {
		return "", errors.New("invalid_otp")
	}

	if time.Now().After(user.OTPExpiresAt) {
		return "", errors.New("expired_otp")
	}

	// Clear OTP after successful verification
	user.OTPCode = ""
	user.OTPExpiresAt = time.Time{}
	s.repo.Update(user)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":      user.ID.String(),
		"role":         user.Role,
		"is_onboarded": user.IsOnboarded,
		"exp":          time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func (s *authService) Onboard(userID uuid.UUID, req *dto.OnboardRequest) (*models.User, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	if user.IsOnboarded {
		return nil, errors.New("already_onboarded")
	}

	interestsJSON, _ := json.Marshal(req.Interests)

	user.Name = req.Name
	user.Age = req.Age
	user.Occupation = req.Occupation
	user.Interests = string(interestsJSON)
	user.IsOnboarded = true

	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *authService) GetMe(userID uuid.UUID) (*models.User, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user_not_found")
	}
	return user, nil
}
