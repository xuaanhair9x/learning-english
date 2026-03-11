# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy everything first so go mod tidy can resolve all imports
COPY . .

# Download and verify all dependencies (generates correct go.sum)
RUN go mod tidy && go mod download

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Run stage
FROM alpine:3.19

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata
ENV TZ=Asia/Ho_Chi_Minh

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
