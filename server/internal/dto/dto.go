package dto

type RequestOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code" validate:"required,len=6"`
}

type OnboardRequest struct {
	Name       string   `json:"name" validate:"required,min=2,max=100"`
	Age        int      `json:"age" validate:"required,min=10,max=100"`
	Occupation string   `json:"occupation" validate:"required"`
	Interests  []string `json:"interests" validate:"required,min=1"`
}

type WatchProgressRequest struct {
	VideoID     string `json:"video_id" validate:"required,uuid"`
	CurrentTime int    `json:"current_time" validate:"required,min=0"`
}
